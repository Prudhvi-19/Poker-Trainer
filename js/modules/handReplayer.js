// Hand Replayer Module
// Review and replay hands from your training sessions

import storage from '../utils/storage.js';
import { createHandDisplay, createCard } from '../components/Card.js';
import { formatPercentage } from '../utils/helpers.js';

let allSessions = [];
let currentSessionIndex = null;
let currentHandIndex = null;
let currentFilter = 'all'; // 'all', 'correct', 'incorrect'
let filteredHands = []; // Stores hands after filtering

function render() {
    const container = document.createElement('div');
    container.className = 'trainer-container';

    // Header
    const header = document.createElement('div');
    header.className = 'trainer-header';
    header.innerHTML = '<h1>🎬 Hand Replayer</h1><p class="text-muted">Review your training hands and learn from your decisions</p>';
    container.appendChild(header);

    // Load sessions
    allSessions = storage.getSessions().reverse(); // Most recent first

    if (allSessions.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'card';
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = '3rem';
        emptyState.innerHTML = `
            <h2>No Sessions Yet</h2>
            <p class="text-muted" style="margin-top: 1rem;">Complete some training hands to see them here!</p>
            <button class="btn btn-primary" onclick="window.location.hash='preflop-trainer'" style="margin-top: 1.5rem;">
                Start Training
            </button>
        `;
        container.appendChild(emptyState);
        return container;
    }

    // Session selector
    const sessionSelector = createSessionSelector();
    container.appendChild(sessionSelector);

    // Replay area
    const replayArea = document.createElement('div');
    replayArea.id = 'replay-area';
    container.appendChild(replayArea);

    // Auto-select first session
    if (allSessions.length > 0) {
        currentSessionIndex = 0;
        showSession();
    }

    return container;
}

function createSessionSelector() {
    const card = document.createElement('div');
    card.className = 'card mb-lg';

    const label = document.createElement('label');
    label.textContent = 'Select Session:';
    label.style.fontWeight = '600';
    label.style.marginRight = '1rem';
    card.appendChild(label);

    const select = document.createElement('select');
    select.style.padding = '0.5rem 1rem';
    select.style.fontSize = '1rem';
    select.id = 'session-selector';

    allSessions.forEach((session, index) => {
        const option = document.createElement('option');
        option.value = index;

        const date = new Date(session.startTime);
        const moduleLabel = session.module || 'Unknown';

        // Handle both formats
        const handCount = session.results?.length || session.hands?.length || 0;
        let accuracy = '0%';

        if (session.results && session.results.length > 0) {
            accuracy = formatPercentage(session.results.filter(r => r.isCorrect).length / session.results.length, 0);
        } else if (session.hands && session.hands.length > 0) {
            let totalDecisions = 0;
            let correctDecisions = 0;
            session.hands.forEach(hand => {
                if (hand.decisions) {
                    totalDecisions += hand.decisions.length;
                    correctDecisions += hand.decisions.filter(d => d.isCorrect).length;
                }
            });
            accuracy = totalDecisions > 0 ? formatPercentage(correctDecisions / totalDecisions, 0) : '0%';
        }

        option.textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${moduleLabel} - ${handCount} hands - ${accuracy} accuracy`;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        currentSessionIndex = parseInt(e.target.value);
        showSession();
    });

    card.appendChild(select);

    return card;
}

function showSession() {
    const replayArea = document.getElementById('replay-area');
    if (!replayArea || currentSessionIndex === null) return;

    replayArea.innerHTML = '';

    const session = allSessions[currentSessionIndex];

    // Handle both multistreet (uses 'hands') and regular trainers (use 'results')
    const sessionHands = session.results || session.hands || [];

    if (sessionHands.length === 0) {
        replayArea.innerHTML = '<div class="card text-center"><p class="text-muted">No hands in this session</p></div>';
        return;
    }

    // Session summary
    const summary = createSessionSummary(session, sessionHands);
    replayArea.appendChild(summary);

    // Hands list
    const handsCard = document.createElement('div');
    handsCard.className = 'card';

    // Hands header with filter buttons
    const handsHeaderSection = document.createElement('div');
    handsHeaderSection.style.display = 'flex';
    handsHeaderSection.style.justifyContent = 'space-between';
    handsHeaderSection.style.alignItems = 'center';
    handsHeaderSection.style.marginBottom = '1.5rem';
    handsHeaderSection.style.flexWrap = 'wrap';
    handsHeaderSection.style.gap = '1rem';

    const handsHeader = document.createElement('h2');
    handsHeader.textContent = 'Hands';
    handsHeader.style.marginBottom = '0';
    handsHeaderSection.appendChild(handsHeader);

    // Filter buttons
    const filterButtons = createFilterButtons(sessionHands);
    handsHeaderSection.appendChild(filterButtons);

    handsCard.appendChild(handsHeaderSection);

    // Hands container
    const handsContainer = document.createElement('div');
    handsContainer.id = 'hands-container';
    handsCard.appendChild(handsContainer);

    replayArea.appendChild(handsCard);

    // Apply initial filter
    applyFilter(sessionHands);
}

function createSessionSummary(session, sessionHands) {
    const card = document.createElement('div');
    card.className = 'card mb-lg';

    const title = document.createElement('h2');
    title.textContent = 'Session Summary';
    title.style.marginBottom = '1.5rem';
    card.appendChild(title);

    const statsGrid = document.createElement('div');
    statsGrid.className = 'session-stats';

    // Handle both formats: results (preflop/postflop) or hands (multistreet)
    const totalHands = sessionHands.length;
    let correct = 0;

    let totalDecisions = totalHands;

    if (session.results) {
        // Preflop/Postflop format
        correct = sessionHands.filter(r => r.isCorrect).length;
    } else if (session.hands) {
        // Multistreet format - count correct decisions out of total decisions
        totalDecisions = 0;
        sessionHands.forEach(hand => {
            if (hand.decisions) {
                totalDecisions += hand.decisions.length;
                correct += hand.decisions.filter(d => d.isCorrect).length;
            }
        });
    }

    const accuracy = totalDecisions > 0 ? correct / totalDecisions : 0;

    const handsBox = createStatBox(totalHands, 'Total Hands');
    const correctBox = createStatBox(correct, 'Correct');
    const wrongBox = createStatBox(totalDecisions - correct, 'Incorrect');
    const accuracyBox = createStatBox(formatPercentage(accuracy, 0), 'Accuracy');

    statsGrid.appendChild(handsBox);
    statsGrid.appendChild(correctBox);
    statsGrid.appendChild(wrongBox);
    statsGrid.appendChild(accuracyBox);

    card.appendChild(statsGrid);

    return card;
}

function createStatBox(value, label) {
    const box = document.createElement('div');
    box.className = 'stat-box';

    const valueEl = document.createElement('div');
    valueEl.className = 'stat-value';
    valueEl.textContent = value;

    const labelEl = document.createElement('div');
    labelEl.className = 'stat-label';
    labelEl.textContent = label;

    box.appendChild(valueEl);
    box.appendChild(labelEl);

    return box;
}

function createFilterButtons(sessionHands) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '0.5rem';

    const filters = [
        { value: 'all', label: 'All', icon: '📋' },
        { value: 'correct', label: 'Correct', icon: '✅' },
        { value: 'incorrect', label: 'Incorrect', icon: '❌' }
    ];

    filters.forEach(filter => {
        const btn = document.createElement('button');
        btn.className = `btn ${currentFilter === filter.value ? 'btn-primary' : 'btn-secondary'}`;
        btn.style.fontSize = '0.875rem';
        btn.style.padding = '0.5rem 1rem';
        btn.textContent = `${filter.icon} ${filter.label}`;
        btn.dataset.filter = filter.value;

        btn.addEventListener('click', () => {
            currentFilter = filter.value;
            applyFilter(sessionHands);

            // Update button styles
            container.querySelectorAll('.btn').forEach(b => {
                b.className = b.dataset.filter === currentFilter ? 'btn btn-primary' : 'btn btn-secondary';
            });
        });

        container.appendChild(btn);
    });

    return container;
}

function applyFilter(sessionHands) {
    const handsContainer = document.getElementById('hands-container');
    if (!handsContainer) return;

    handsContainer.innerHTML = '';

    // Filter hands based on current filter
    filteredHands = sessionHands.filter(result => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'correct') return result.isCorrect;
        if (currentFilter === 'incorrect') return !result.isCorrect;
        return true;
    });

    if (filteredHands.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '2rem';
        emptyMsg.style.color = 'var(--color-text-muted)';
        emptyMsg.textContent = `No ${currentFilter} hands found`;
        handsContainer.appendChild(emptyMsg);
        return;
    }

    // Display filtered hands
    filteredHands.forEach((result, filteredIndex) => {
        const originalIndex = sessionHands.indexOf(result);
        const handItem = createHandItem(result, originalIndex, filteredIndex);
        handsContainer.appendChild(handItem);
    });
}

function createHandItem(result, originalIndex, filteredIndex) {
    const item = document.createElement('div');
    item.style.padding = '1rem';
    item.style.marginBottom = '1rem';
    item.style.background = 'var(--color-bg-tertiary)';
    item.style.borderRadius = 'var(--border-radius)';
    item.style.borderLeft = `4px solid ${result.isCorrect ? 'var(--color-success)' : 'var(--color-error)'}`;
    item.style.cursor = 'pointer';
    item.style.transition = 'all 0.2s ease';

    item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--color-bg-secondary)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.background = 'var(--color-bg-tertiary)';
    });

    item.addEventListener('click', () => {
        currentHandIndex = filteredIndex;
        showHandDetails(filteredIndex);
    });

    // Header row
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.justifyContent = 'space-between';
    headerRow.style.alignItems = 'center';
    headerRow.style.marginBottom = '0.75rem';

    const handNumber = document.createElement('div');
    handNumber.textContent = `Hand #${originalIndex + 1}`;
    handNumber.style.fontWeight = '600';
    headerRow.appendChild(handNumber);

    const resultBadge = document.createElement('div');
    resultBadge.textContent = result.isCorrect ? '✅ Correct' : '❌ Incorrect';
    resultBadge.style.color = result.isCorrect ? 'var(--color-success)' : 'var(--color-error)';
    resultBadge.style.fontWeight = '600';
    headerRow.appendChild(resultBadge);

    item.appendChild(headerRow);

    // Hand details row
    const detailsRow = document.createElement('div');
    detailsRow.style.display = 'flex';
    detailsRow.style.gap = '1rem';
    detailsRow.style.fontSize = '0.875rem';
    detailsRow.style.color = 'var(--color-text-secondary)';

    // Check both 'hand' (preflop) and 'heroHand' (postflop)
    const heroHand = result.scenario?.hand || result.scenario?.heroHand;
    if (heroHand) {
        const handDisplay = document.createElement('div');
        handDisplay.textContent = `Hand: ${heroHand.display}`;
        handDisplay.style.fontWeight = '600';
        handDisplay.style.color = 'var(--color-text-primary)';
        detailsRow.appendChild(handDisplay);
    }

    if (result.scenario?.position) {
        const posDisplay = document.createElement('div');
        posDisplay.textContent = `Position: ${result.scenario.position}`;
        detailsRow.appendChild(posDisplay);
    }

    if (!result.isCorrect) {
        const actionDisplay = document.createElement('div');
        actionDisplay.innerHTML = `Your action: <strong>${result.userAnswer.toUpperCase()}</strong> | GTO: <strong>${result.correctAnswer.toUpperCase()}</strong>`;
        actionDisplay.style.color = 'var(--color-error)';
        detailsRow.appendChild(actionDisplay);
    }

    item.appendChild(detailsRow);

    return item;
}

// Global variable to track current keyboard handler
let currentKeyHandler = null;

function showHandDetails(filteredIndex) {
    const result = filteredHands[filteredIndex];
    const totalHands = filteredHands.length;

    // Check if modal already exists
    let modal = document.getElementById('hand-details-modal');
    const isNewModal = !modal;

    if (isNewModal) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'hand-details-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.right = '0';
        modal.style.bottom = '0';
        modal.style.background = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';
        modal.style.padding = '2rem';

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    const closeModal = () => {
        if (modal && modal.parentNode) {
            document.body.removeChild(modal);
        }
        if (currentKeyHandler) {
            document.removeEventListener('keydown', currentKeyHandler);
            currentKeyHandler = null;
        }
    };

    // Remove old keyboard handler if exists
    if (currentKeyHandler) {
        document.removeEventListener('keydown', currentKeyHandler);
    }

    // Create new keyboard handler with current filteredIndex
    currentKeyHandler = (e) => {
        if (e.key === 'ArrowLeft' && filteredIndex > 0) {
            e.preventDefault();
            showHandDetails(filteredIndex - 1);
        } else if (e.key === 'ArrowRight' && filteredIndex < totalHands - 1) {
            e.preventDefault();
            showHandDetails(filteredIndex + 1);
        } else if (e.key === 'Escape') {
            closeModal();
        }
    };

    // Add new keyboard handler
    document.addEventListener('keydown', currentKeyHandler);

    // Clear existing content
    modal.innerHTML = '';

    const modalCard = document.createElement('div');
    modalCard.className = 'scenario-card';
    modalCard.style.maxWidth = '700px';
    modalCard.style.width = '100%';
    modalCard.style.maxHeight = '85vh';
    modalCard.style.overflow = 'auto';
    modalCard.style.position = 'relative';

    // Header with navigation
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '1.5rem';

    const titleSection = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = `Hand Details`;
    title.style.marginBottom = '0.25rem';
    titleSection.appendChild(title);

    const handCounter = document.createElement('div');
    handCounter.style.fontSize = '0.875rem';
    handCounter.style.color = 'var(--color-text-muted)';
    handCounter.innerHTML = `<kbd>←</kbd> <kbd>→</kbd> ${filteredIndex + 1} of ${totalHands} ${currentFilter !== 'all' ? `(${currentFilter})` : ''}`;
    titleSection.appendChild(handCounter);

    header.appendChild(titleSection);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-secondary';
    closeBtn.textContent = '✕';
    closeBtn.style.fontSize = '1.25rem';
    closeBtn.style.padding = '0.5rem 1rem';
    closeBtn.addEventListener('click', () => {
        closeModal();
    });
    header.appendChild(closeBtn);

    modalCard.appendChild(header);

    // Result badge
    const resultBadge = document.createElement('div');
    resultBadge.className = `feedback-panel ${result.isCorrect ? 'correct' : 'incorrect'}`;
    resultBadge.style.marginBottom = '1.5rem';

    const badgeTitle = document.createElement('div');
    badgeTitle.className = 'feedback-title';
    badgeTitle.textContent = result.isCorrect ? '✅ Correct Decision' : '❌ Incorrect Decision';
    resultBadge.appendChild(badgeTitle);

    modalCard.appendChild(resultBadge);

    // Scenario info
    if (result.scenario) {
        const scenario = result.scenario;

        if (scenario.position) {
            const posDiv = document.createElement('div');
            posDiv.innerHTML = `<strong>Position:</strong> ${scenario.position}`;
            posDiv.style.marginBottom = '0.5rem';
            modalCard.appendChild(posDiv);
        }

        if (scenario.villainPosition) {
            const villainDiv = document.createElement('div');
            villainDiv.innerHTML = `<strong>Villain:</strong> ${scenario.villainPosition}`;
            villainDiv.style.marginBottom = '0.5rem';
            modalCard.appendChild(villainDiv);
        }

        if (scenario.description) {
            const descDiv = document.createElement('div');
            descDiv.innerHTML = `<strong>Situation:</strong> ${scenario.description}`;
            descDiv.style.marginBottom = '1rem';
            descDiv.style.padding = '1rem';
            descDiv.style.background = 'var(--color-bg-tertiary)';
            descDiv.style.borderRadius = 'var(--border-radius)';
            modalCard.appendChild(descDiv);
        }

        // Board (if postflop)
        if (scenario.board && scenario.board.length > 0) {
            const boardLabel = document.createElement('div');
            boardLabel.textContent = 'Board:';
            boardLabel.style.fontWeight = '600';
            boardLabel.style.marginTop = '1rem';
            boardLabel.style.marginBottom = '0.5rem';
            modalCard.appendChild(boardLabel);

            const boardDisplay = document.createElement('div');
            boardDisplay.style.display = 'flex';
            boardDisplay.style.gap = '0.5rem';
            boardDisplay.style.marginBottom = '1rem';

            scenario.board.forEach(cardStr => {
                const rank = cardStr.slice(0, -1);
                const suit = cardStr.slice(-1);
                const card = createCard({ rank, suit });
                boardDisplay.appendChild(card);
            });

            modalCard.appendChild(boardDisplay);
        }

        // Hero hand - check both 'hand' (preflop) and 'heroHand' (postflop)
        const heroHand = scenario.hand || scenario.heroHand;
        if (heroHand) {
            const handLabel = document.createElement('div');
            handLabel.textContent = 'Your Hand:';
            handLabel.style.fontWeight = '600';
            handLabel.style.marginTop = '1rem';
            handLabel.style.marginBottom = '0.5rem';
            modalCard.appendChild(handLabel);

            const handDisplay = createHandDisplay(heroHand, true);
            handDisplay.style.marginBottom = '1rem';
            modalCard.appendChild(handDisplay);
        }
    }

    // Actions
    const actionsDiv = document.createElement('div');
    actionsDiv.style.padding = '1rem';
    actionsDiv.style.background = result.isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    actionsDiv.style.borderRadius = 'var(--border-radius)';
    actionsDiv.style.marginTop = '1.5rem';

    const yourActionDiv = document.createElement('div');
    yourActionDiv.innerHTML = `<strong>Your Action:</strong> <span style="color: ${result.isCorrect ? 'var(--color-success)' : 'var(--color-error)'}; font-weight: 600;">${result.userAnswer.toUpperCase()}</span>`;
    yourActionDiv.style.marginBottom = '0.5rem';
    actionsDiv.appendChild(yourActionDiv);

    const correctActionDiv = document.createElement('div');
    correctActionDiv.innerHTML = `<strong>GTO Action:</strong> <span style="color: var(--color-success); font-weight: 600;">${result.correctAnswer.toUpperCase()}</span>`;
    actionsDiv.appendChild(correctActionDiv);

    modalCard.appendChild(actionsDiv);

    // Navigation buttons at bottom
    const navFooter = document.createElement('div');
    navFooter.style.display = 'flex';
    navFooter.style.justifyContent = 'space-between';
    navFooter.style.alignItems = 'center';
    navFooter.style.marginTop = '1.5rem';
    navFooter.style.paddingTop = '1.5rem';
    navFooter.style.borderTop = '1px solid var(--color-border)';

    const prevBtnFooter = document.createElement('button');
    prevBtnFooter.className = 'btn btn-secondary';
    prevBtnFooter.innerHTML = '← Previous';
    prevBtnFooter.disabled = filteredIndex === 0;
    prevBtnFooter.addEventListener('click', () => {
        if (filteredIndex > 0) {
            showHandDetails(filteredIndex - 1);
        }
    });
    if (filteredIndex === 0) {
        prevBtnFooter.style.opacity = '0.5';
        prevBtnFooter.style.cursor = 'not-allowed';
    }

    const nextBtnFooter = document.createElement('button');
    nextBtnFooter.className = 'btn btn-secondary';
    nextBtnFooter.innerHTML = 'Next →';
    nextBtnFooter.disabled = filteredIndex === totalHands - 1;
    nextBtnFooter.addEventListener('click', () => {
        if (filteredIndex < totalHands - 1) {
            showHandDetails(filteredIndex + 1);
        }
    });
    if (filteredIndex === totalHands - 1) {
        nextBtnFooter.style.opacity = '0.5';
        nextBtnFooter.style.cursor = 'not-allowed';
    }

    navFooter.appendChild(prevBtnFooter);
    navFooter.appendChild(nextBtnFooter);
    modalCard.appendChild(navFooter);

    modal.appendChild(modalCard);

    // Append to body if it's a new modal
    if (isNewModal) {
        document.body.appendChild(modal);
    }
}

// Clean up on module unload
window.addEventListener('hashchange', () => {
    if (currentKeyHandler) {
        document.removeEventListener('keydown', currentKeyHandler);
        currentKeyHandler = null;
    }
});

export default {
    render
};
