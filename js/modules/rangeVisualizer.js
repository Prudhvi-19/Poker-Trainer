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
        // RFI Ranges
        { label: 'UTG RFI (~15%)', range: ranges.RFI_RANGES.UTG, category: 'RFI' },
        { label: 'HJ RFI (~20%)', range: ranges.RFI_RANGES.HJ, category: 'RFI' },
        { label: 'CO RFI (~29%)', range: ranges.RFI_RANGES.CO, category: 'RFI' },
        { label: 'BTN RFI (~48%)', range: ranges.RFI_RANGES.BTN, category: 'RFI' },
        { label: 'SB RFI (~41%)', range: ranges.RFI_RANGES.SB, category: 'RFI' },

        // 3-Bet Ranges (comprehensive!)
        { label: '3-Bet vs UTG', range: ranges.THREE_BET_RANGES.vsUTG, category: '3-Bet' },
        { label: '3-Bet vs HJ', range: ranges.THREE_BET_RANGES.vsHJ, category: '3-Bet' },
        { label: '3-Bet vs CO', range: ranges.THREE_BET_RANGES.vsCO, category: '3-Bet' },
        { label: '3-Bet vs BTN', range: ranges.THREE_BET_RANGES.vsBTN, category: '3-Bet' },
        { label: '3-Bet vs SB', range: ranges.THREE_BET_RANGES.vsSB, category: '3-Bet' },

        // BB Defense Ranges (comprehensive!)
        { label: 'BB vs UTG', range: ranges.BB_DEFENSE_RANGES.vsUTG, category: 'BB Defense' },
        { label: 'BB vs HJ', range: ranges.BB_DEFENSE_RANGES.vsHJ, category: 'BB Defense' },
        { label: 'BB vs CO', range: ranges.BB_DEFENSE_RANGES.vsCO, category: 'BB Defense' },  // USER REQUESTED!
        { label: 'BB vs BTN', range: ranges.BB_DEFENSE_RANGES.vsBTN, category: 'BB Defense' },
        { label: 'BB vs SB', range: ranges.BB_DEFENSE_RANGES.vsSB, category: 'BB Defense' },

        // BB 3-Bet Ranges
        { label: 'BB 3-Bet vs UTG', range: ranges.BB_3BET_RANGES.vsUTG, category: 'BB 3-Bet' },
        { label: 'BB 3-Bet vs HJ', range: ranges.BB_3BET_RANGES.vsHJ, category: 'BB 3-Bet' },
        { label: 'BB 3-Bet vs CO', range: ranges.BB_3BET_RANGES.vsCO, category: 'BB 3-Bet' },
        { label: 'BB 3-Bet vs BTN', range: ranges.BB_3BET_RANGES.vsBTN, category: 'BB 3-Bet' },
        { label: 'BB 3-Bet vs SB', range: ranges.BB_3BET_RANGES.vsSB, category: 'BB 3-Bet' },

        // 4-Bet Ranges
        { label: '4-Bet vs UTG', range: ranges.FOUR_BET_RANGES.vsUTG, category: '4-Bet' },
        { label: '4-Bet vs HJ', range: ranges.FOUR_BET_RANGES.vsHJ, category: '4-Bet' },
        { label: '4-Bet vs CO', range: ranges.FOUR_BET_RANGES.vsCO, category: '4-Bet' },
        { label: '4-Bet vs BTN', range: ranges.FOUR_BET_RANGES.vsBTN, category: '4-Bet' },

        // Call 3-Bet Ranges
        { label: 'Call 3-Bet vs UTG', range: ranges.CALL_3BET_RANGES.vsUTG, category: 'Call 3-Bet' },
        { label: 'Call 3-Bet vs HJ', range: ranges.CALL_3BET_RANGES.vsHJ, category: 'Call 3-Bet' },
        { label: 'Call 3-Bet vs CO', range: ranges.CALL_3BET_RANGES.vsCO, category: 'Call 3-Bet' },
        { label: 'Call 3-Bet vs BTN', range: ranges.CALL_3BET_RANGES.vsBTN, category: 'Call 3-Bet' },
        { label: 'Call 3-Bet vs SB', range: ranges.CALL_3BET_RANGES.vsSB, category: 'Call 3-Bet' },

        // Cold Call Ranges
        { label: 'Cold Call vs UTG', range: ranges.COLD_CALL_RANGES.vsUTG, category: 'Cold Call' },
        { label: 'Cold Call vs HJ', range: ranges.COLD_CALL_RANGES.vsHJ, category: 'Cold Call' },
        { label: 'Cold Call vs CO', range: ranges.COLD_CALL_RANGES.vsCO, category: 'Cold Call' },
        { label: 'Cold Call vs BTN', range: ranges.COLD_CALL_RANGES.vsBTN, category: 'Cold Call' },

        // Squeeze Ranges
        { label: 'Squeeze vs UTG', range: ranges.SQUEEZE_RANGES.vsUTG, category: 'Squeeze' },
        { label: 'Squeeze vs HJ', range: ranges.SQUEEZE_RANGES.vsHJ, category: 'Squeeze' },
        { label: 'Squeeze vs CO', range: ranges.SQUEEZE_RANGES.vsCO, category: 'Squeeze' },
        { label: 'Squeeze vs BTN', range: ranges.SQUEEZE_RANGES.vsBTN, category: 'Squeeze' }
    ];

    // Group presets by category
    const categories = ['RFI', '3-Bet', 'BB Defense', 'BB 3-Bet', '4-Bet', 'Call 3-Bet', 'Cold Call', 'Squeeze'];

    categories.forEach(category => {
        const categoryPresets = rangePresets.filter(p => p.category === category);
        if (categoryPresets.length === 0) return;

        // Category header
        const categoryHeader = document.createElement('div');
        categoryHeader.style.marginTop = category === 'RFI' ? '0' : '1.5rem';
        categoryHeader.style.marginBottom = '0.5rem';
        categoryHeader.style.fontWeight = '600';
        categoryHeader.style.fontSize = '0.875rem';
        categoryHeader.style.textTransform = 'uppercase';
        categoryHeader.style.color = 'var(--color-text-secondary)';
        categoryHeader.textContent = category;
        presets.appendChild(categoryHeader);

        // Category buttons
        const categoryRow = document.createElement('div');
        categoryRow.style.display = 'flex';
        categoryRow.style.gap = '0.5rem';
        categoryRow.style.flexWrap = 'wrap';

        categoryPresets.forEach(preset => {
            const btn = document.createElement('button');
            btn.className = 'preset-button';
            btn.textContent = preset.label;
            btn.addEventListener('click', () => loadRange(preset.range));
            categoryRow.appendChild(btn);
        });

        presets.appendChild(categoryRow);
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
