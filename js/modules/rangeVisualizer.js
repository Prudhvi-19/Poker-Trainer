// Range Visualizer Module

import { createHandGrid, updateGridSelection, getSelectedHands, clearSelection } from '../components/HandGrid.js';
import ranges from '../data/ranges.js';
import { showToast } from '../utils/helpers.js';
import storage from '../utils/storage.js';
import { showPrompt } from '../components/Modal.js';

let currentGrid = null;
let selectedRange = [];

function render() {
    const container = document.createElement('div');
    container.className = 'range-visualizer-container';

    // Header
    const header = document.createElement('div');
    header.innerHTML = '<h1>🎨 Hand Range Visualizer</h1>';
    header.style.marginBottom = '2rem';
    container.appendChild(header);

    // Range presets
    const presetsSection = createPresetsSection();
    container.appendChild(presetsSection);

    // Range stats
    const statsSection = document.createElement('div');
    statsSection.id = 'range-stats';
    statsSection.className = 'card mb-lg';
    container.appendChild(statsSection);

    // Hand grid
    const gridSection = document.createElement('div');
    gridSection.className = 'card';

    const gridHeader = document.createElement('h2');
    gridHeader.textContent = '13×13 Hand Grid';
    gridHeader.style.marginBottom = '1rem';
    gridSection.appendChild(gridHeader);

    currentGrid = createHandGrid(selectedRange, handleHandClick, true);
    gridSection.appendChild(currentGrid);

    container.appendChild(gridSection);

    // Control buttons
    const controls = createControls();
    container.appendChild(controls);

    updateStats();

    return container;
}

function createPresetsSection() {
    const section = document.createElement('div');
    section.className = 'card mb-lg';

    const header = document.createElement('h2');
    header.textContent = 'GTO Range Presets';
    header.style.marginBottom = '1rem';
    section.appendChild(header);

    const presets = document.createElement('div');
    presets.className = 'range-presets';

    const rangePresets = [
        { label: 'UTG RFI (~15%)', range: ranges.RFI_RANGES.UTG },
        { label: 'HJ RFI (~18%)', range: ranges.RFI_RANGES.HJ },
        { label: 'CO RFI (~28%)', range: ranges.RFI_RANGES.CO },
        { label: 'BTN RFI (~48%)', range: ranges.RFI_RANGES.BTN },
        { label: 'SB RFI (~45%)', range: ranges.RFI_RANGES.SB },
        { label: '3-Bet vs UTG', range: ranges.THREE_BET_RANGES.vsUTG },
        { label: '3-Bet vs BTN', range: ranges.THREE_BET_RANGES.vsBTN },
        { label: 'BB vs UTG', range: ranges.BB_DEFENSE_RANGES.vsUTG },
        { label: 'BB vs BTN', range: ranges.BB_DEFENSE_RANGES.vsBTN },
        { label: 'BB vs SB', range: ranges.BB_DEFENSE_RANGES.vsSB }
    ];

    rangePresets.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'preset-button';
        btn.textContent = preset.label;
        btn.addEventListener('click', () => loadRange(preset.range));
        presets.appendChild(btn);
    });

    section.appendChild(presets);

    return section;
}

function createControls() {
    const section = document.createElement('div');
    section.className = 'card';
    section.style.marginTop = '1rem';

    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.gap = '1rem';
    buttons.style.flexWrap = 'wrap';

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-secondary';
    clearBtn.textContent = 'Clear All';
    clearBtn.addEventListener('click', () => {
        selectedRange = [];
        clearSelection(currentGrid);
        updateStats();
        showToast('Range cleared', 'info');
    });

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = 'Save Custom Range';
    saveBtn.addEventListener('click', saveCustomRange);

    buttons.appendChild(clearBtn);
    buttons.appendChild(saveBtn);

    section.appendChild(buttons);

    return section;
}

function handleHandClick(handString, shouldSelect, cell) {
    if (shouldSelect) {
        selectedRange.push(handString);
        cell.classList.add('selected');
    } else {
        selectedRange = selectedRange.filter(h => h !== handString);
        cell.classList.remove('selected');
    }

    updateStats();
}

function loadRange(range) {
    selectedRange = [...range];
    updateGridSelection(currentGrid, selectedRange);
    updateStats();
    showToast('Range loaded', 'success');
}

function updateStats() {
    const statsEl = document.getElementById('range-stats');
    if (!statsEl) return;

    const combos = ranges.getRangeSize(selectedRange);
    const percentage = ranges.getRangePercentage(selectedRange);

    statsEl.innerHTML = `
        <h2 style="margin-bottom: 1rem;">Range Statistics</h2>
        <div class="range-stats-panel">
            <div class="stat-box">
                <div class="stat-value">${selectedRange.length}</div>
                <div class="stat-label">Hand Types</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${combos}</div>
                <div class="stat-label">Combos</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${percentage.toFixed(1)}%</div>
                <div class="stat-label">Of All Hands</div>
            </div>
        </div>
    `;
}

function saveCustomRange() {
    if (selectedRange.length === 0) {
        showToast('Select some hands first', 'warning');
        return;
    }

    showPrompt({
        title: 'Save Custom Range',
        message: 'Enter a name for this range:',
        placeholder: 'e.g., My CO Open',
        onSubmit: (name) => {
            if (!name.trim()) {
                showToast('Please enter a name', 'warning');
                return;
            }

            const customRange = {
                id: Date.now().toString(),
                name: name.trim(),
                hands: [...selectedRange],
                createdAt: new Date().toISOString()
            };

            storage.saveCustomRange(customRange);
            showToast(`Range "${name}" saved!`, 'success');
        }
    });
}

export default {
    render
};
