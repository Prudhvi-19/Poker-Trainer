// Settings Module

import storage from '../utils/storage.js';
import { showToast } from '../utils/helpers.js';
import { showConfirm } from '../components/Modal.js';
import { DEFAULT_SETTINGS } from '../utils/constants.js';

let currentSettings = {};

function render() {
    currentSettings = storage.getSettings();

    const container = document.createElement('div');

    // Header
    const header = document.createElement('div');
    header.innerHTML = '<h1>⚙️ Settings</h1>';
    header.style.marginBottom = '2rem';
    container.appendChild(header);

    // Display Settings
    const displaySection = createDisplaySettings();
    container.appendChild(displaySection);

    // Training Settings
    const trainingSection = createTrainingSettings();
    container.appendChild(trainingSection);

    // Data Management
    const dataSection = createDataManagement();
    container.appendChild(dataSection);

    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary btn-lg';
    saveBtn.textContent = 'Save Settings';
    saveBtn.style.marginTop = '1rem';
    saveBtn.addEventListener('click', saveSettings);
    container.appendChild(saveBtn);

    return container;
}

function createDisplaySettings() {
    const section = document.createElement('div');
    section.className = 'card settings-section';

    const header = document.createElement('h2');
    header.textContent = 'Display Settings';
    header.style.marginBottom = '1.5rem';
    section.appendChild(header);

    const settings = document.createElement('div');
    settings.className = 'settings-group';

    // Deck Style
    const deckStyleSetting = createSelectSetting(
        'Deck Style',
        'Choose between 4-color or traditional 2-color deck',
        'deckStyle',
        [
            { value: '4-color', label: '4-Color Deck (♠ ♥ ♦ ♣)' },
            { value: '2-color', label: '2-Color Deck (Traditional)' }
        ],
        currentSettings.deckStyle
    );
    settings.appendChild(deckStyleSetting);

    // Font Size
    const fontSizeSetting = createSelectSetting(
        'Font Size',
        'Adjust text size for better readability',
        'fontSize',
        [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
        ],
        currentSettings.fontSize
    );
    settings.appendChild(fontSizeSetting);

    // Sound Effects
    const soundSetting = createToggleSetting(
        'Sound Effects',
        'Enable sound effects for actions',
        'soundEnabled',
        currentSettings.soundEnabled
    );
    settings.appendChild(soundSetting);

    section.appendChild(settings);

    return section;
}

function createTrainingSettings() {
    const section = document.createElement('div');
    section.className = 'card settings-section';

    const header = document.createElement('h2');
    header.textContent = 'Training Settings';
    header.style.marginBottom = '1.5rem';
    section.appendChild(header);

    const settings = document.createElement('div');
    settings.className = 'settings-group';

    // Default Session Length
    const sessionLengthSetting = createSelectSetting(
        'Default Session Length',
        'Number of hands per training session',
        'defaultSessionLength',
        [
            { value: '10', label: '10 hands' },
            { value: '25', label: '25 hands' },
            { value: '50', label: '50 hands' },
            { value: '100', label: '100 hands' }
        ],
        currentSettings.defaultSessionLength.toString()
    );
    settings.appendChild(sessionLengthSetting);

    // Show Hints
    const hintsSetting = createToggleSetting(
        'Show Hints',
        'Display helpful hints during practice',
        'showHints',
        currentSettings.showHints
    );
    settings.appendChild(hintsSetting);

    // Timed Mode
    const timedModeSetting = createToggleSetting(
        'Timed Mode',
        'Add time pressure to decisions (coming soon)',
        'timedMode',
        currentSettings.timedMode
    );
    timedModeSetting.querySelector('button').disabled = true;
    settings.appendChild(timedModeSetting);

    section.appendChild(settings);

    return section;
}

function createDataManagement() {
    const section = document.createElement('div');
    section.className = 'card settings-section';

    const header = document.createElement('h2');
    header.textContent = 'Data Management';
    header.style.marginBottom = '1.5rem';
    section.appendChild(header);

    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.gap = '1rem';
    buttons.style.flexWrap = 'wrap';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-secondary';
    exportBtn.textContent = '📥 Export All Data';
    exportBtn.addEventListener('click', exportData);

    const importBtn = document.createElement('button');
    importBtn.className = 'btn btn-secondary';
    importBtn.textContent = '📤 Import Data';
    importBtn.addEventListener('click', importData);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-danger';
    resetBtn.textContent = '🗑️ Reset All Progress';
    resetBtn.addEventListener('click', resetProgress);

    buttons.appendChild(exportBtn);
    buttons.appendChild(importBtn);
    buttons.appendChild(resetBtn);

    section.appendChild(buttons);

    return section;
}

function createSelectSetting(label, description, key, options, currentValue) {
    const item = document.createElement('div');
    item.className = 'setting-item';

    const labelDiv = document.createElement('div');
    labelDiv.className = 'setting-label';

    const labelText = document.createElement('div');
    labelText.className = 'setting-label-text';
    labelText.textContent = label;

    const desc = document.createElement('div');
    desc.className = 'setting-description';
    desc.textContent = description;

    labelDiv.appendChild(labelText);
    labelDiv.appendChild(desc);

    const select = document.createElement('select');
    select.style.padding = '0.5rem';
    select.dataset.settingKey = key;

    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (opt.value === currentValue || opt.value === currentValue.toString()) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        let value = e.target.value;
        // Convert to number if it's the session length
        if (key === 'defaultSessionLength') {
            value = parseInt(value, 10);
        }
        currentSettings[key] = value;
    });

    item.appendChild(labelDiv);
    item.appendChild(select);

    return item;
}

function createToggleSetting(label, description, key, currentValue) {
    const item = document.createElement('div');
    item.className = 'setting-item';

    const labelDiv = document.createElement('div');
    labelDiv.className = 'setting-label';

    const labelText = document.createElement('div');
    labelText.className = 'setting-label-text';
    labelText.textContent = label;

    const desc = document.createElement('div');
    desc.className = 'setting-description';
    desc.textContent = description;

    labelDiv.appendChild(labelText);
    labelDiv.appendChild(desc);

    const toggle = document.createElement('button');
    toggle.className = `toggle-switch${currentValue ? ' active' : ''}`;
    toggle.dataset.settingKey = key;

    const slider = document.createElement('span');
    slider.className = 'toggle-slider';

    toggle.appendChild(slider);

    toggle.addEventListener('click', () => {
        const isActive = toggle.classList.contains('active');
        if (isActive) {
            toggle.classList.remove('active');
            currentSettings[key] = false;
        } else {
            toggle.classList.add('active');
            currentSettings[key] = true;
        }
    });

    item.appendChild(labelDiv);
    item.appendChild(toggle);

    return item;
}

function saveSettings() {
    storage.saveSettings(currentSettings);

    // Apply settings immediately
    if (currentSettings.deckStyle) {
        document.documentElement.setAttribute('data-deck-style', currentSettings.deckStyle);
    }

    if (currentSettings.fontSize) {
        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        document.documentElement.style.fontSize = fontSizes[currentSettings.fontSize] || '16px';
    }

    showToast('Settings saved successfully!', 'success');
}

function exportData() {
    const data = storage.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `poker-trainer-backup-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);

    showToast('Data exported successfully!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                storage.importData(data);
                showToast('Data imported successfully! Reloading...', 'success');
                setTimeout(() => location.reload(), 1500);
            } catch (error) {
                showToast('Error importing data: Invalid file format', 'error');
            }
        };

        reader.readAsText(file);
    });

    input.click();
}

function resetProgress() {
    showConfirm({
        title: 'Reset All Progress',
        message: 'This will delete ALL your progress, sessions, and custom ranges. This action cannot be undone. Are you absolutely sure?',
        confirmText: 'Yes, Reset Everything',
        cancelText: 'Cancel',
        onConfirm: () => {
            storage.resetAll();
            showToast('All progress reset. Reloading...', 'info');
            setTimeout(() => location.reload(), 1500);
        }
    });
}

export default {
    render
};
