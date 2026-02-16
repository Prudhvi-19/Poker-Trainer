// Modal Dialog Component

/**
 * Create and show a modal
 * @param {Object} config - Modal configuration
 * @param {string} config.title - Modal title
 * @param {string|HTMLElement} config.content - Modal content
 * @param {Array} config.buttons - Array of button configs
 * @param {Function} config.onClose - Callback when modal closes
 * @param {boolean} config.closeOnOverlay - Whether clicking overlay closes modal
 * @returns {HTMLElement} Modal overlay element
 */
export function showModal({
    title = '',
    content = '',
    buttons = [],
    onClose = null,
    closeOnOverlay = true
}) {
    // Remove any existing modals
    closeModal();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal';

    const modal = document.createElement('div');
    modal.className = 'modal';

    // Header
    if (title) {
        const header = document.createElement('div');
        header.className = 'modal-header';

        const titleEl = document.createElement('h2');
        titleEl.className = 'modal-title';
        titleEl.textContent = title;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-secondary btn-sm';
        closeBtn.textContent = '×';
        closeBtn.style.fontSize = '1.5rem';
        closeBtn.style.padding = '0.25rem 0.75rem';
        closeBtn.addEventListener('click', () => {
            closeModal();
            if (onClose) onClose();
        });

        header.appendChild(titleEl);
        header.appendChild(closeBtn);
        modal.appendChild(header);
    }

    // Body
    const body = document.createElement('div');
    body.className = 'modal-body';

    if (typeof content === 'string') {
        body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        body.appendChild(content);
    }

    modal.appendChild(body);

    // Footer (buttons)
    if (buttons && buttons.length > 0) {
        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        buttons.forEach(btnConfig => {
            const btn = document.createElement('button');
            btn.className = btnConfig.className || 'btn btn-secondary';
            btn.textContent = btnConfig.text;

            btn.addEventListener('click', () => {
                if (btnConfig.onClick) {
                    btnConfig.onClick();
                }
                if (btnConfig.closeOnClick !== false) {
                    closeModal();
                }
            });

            footer.appendChild(btn);
        });

        modal.appendChild(footer);
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close on overlay click
    if (closeOnOverlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
                if (onClose) onClose();
            }
        });
    }

    // Close on Escape key - store handler reference for cleanup
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (onClose) onClose();
        }
    };
    document.addEventListener('keydown', escapeHandler);

    // Store handler reference on overlay for cleanup in closeModal()
    overlay._escapeHandler = escapeHandler;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return overlay;
}

/**
 * Close the active modal
 */
export function closeModal() {
    const modal = document.getElementById('active-modal');
    if (modal) {
        // Clean up escape handler to prevent memory leak
        if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
        }
        modal.remove();
        document.body.style.overflow = '';
    }
}

/**
 * Show a confirmation dialog
 * @param {Object} config - Confirmation config
 * @param {string} config.title - Dialog title
 * @param {string} config.message - Confirmation message
 * @param {Function} config.onConfirm - Callback on confirm
 * @param {Function} config.onCancel - Callback on cancel
 * @returns {HTMLElement} Modal element
 */
export function showConfirm({
    title = 'Confirm',
    message = 'Are you sure?',
    onConfirm = null,
    onCancel = null,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) {
    return showModal({
        title,
        content: `<p>${message}</p>`,
        buttons: [
            {
                text: cancelText,
                className: 'btn btn-secondary',
                onClick: onCancel
            },
            {
                text: confirmText,
                className: 'btn btn-danger',
                onClick: onConfirm
            }
        ],
        closeOnOverlay: false
    });
}

/**
 * Show an alert dialog
 * @param {Object} config - Alert config
 * @param {string} config.title - Dialog title
 * @param {string} config.message - Alert message
 * @param {Function} config.onClose - Callback on close
 * @returns {HTMLElement} Modal element
 */
export function showAlert({
    title = 'Alert',
    message = '',
    onClose = null,
    type = 'info' // 'success', 'error', 'warning', 'info'
}) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const icon = icons[type] || icons.info;

    return showModal({
        title: `${icon} ${title}`,
        content: `<p>${message}</p>`,
        buttons: [
            {
                text: 'OK',
                className: 'btn btn-primary',
                onClick: onClose
            }
        ]
    });
}

/**
 * Show an input dialog
 * @param {Object} config - Input dialog config
 * @param {string} config.title - Dialog title
 * @param {string} config.message - Prompt message
 * @param {string} config.defaultValue - Default input value
 * @param {Function} config.onSubmit - Callback with input value
 * @returns {HTMLElement} Modal element
 */
export function showPrompt({
    title = 'Input',
    message = '',
    defaultValue = '',
    placeholder = '',
    onSubmit = null,
    onCancel = null
}) {
    const content = document.createElement('div');

    if (message) {
        const messageEl = document.createElement('p');
        messageEl.textContent = message;
        messageEl.style.marginBottom = '1rem';
        content.appendChild(messageEl);
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaultValue;
    input.placeholder = placeholder;
    input.style.width = '100%';
    input.style.padding = '0.5rem';

    content.appendChild(input);

    const modal = showModal({
        title,
        content,
        buttons: [
            {
                text: 'Cancel',
                className: 'btn btn-secondary',
                onClick: onCancel
            },
            {
                text: 'Submit',
                className: 'btn btn-primary',
                onClick: () => {
                    if (onSubmit) {
                        onSubmit(input.value);
                    }
                }
            }
        ],
        closeOnOverlay: false
    });

    // Focus input
    setTimeout(() => input.focus(), 100);

    // Submit on Enter
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (onSubmit) {
                onSubmit(input.value);
            }
            closeModal();
        }
    });

    return modal;
}

export default {
    showModal,
    closeModal,
    showConfirm,
    showAlert,
    showPrompt
};
