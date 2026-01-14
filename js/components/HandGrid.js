// 13x13 Hand Range Grid Component

import { RANKS } from '../utils/constants.js';

/**
 * Create a 13x13 hand grid for range selection
 * @param {Array} selectedHands - Array of selected hand strings (e.g., ['AA', 'AKs', 'KQo'])
 * @param {Function} onHandClick - Callback when hand is clicked
 * @param {boolean} interactive - Whether the grid is interactive
 * @returns {HTMLElement} Hand grid element
 */
export function createHandGrid(selectedHands = [], onHandClick = null, interactive = true) {
    const grid = document.createElement('div');
    grid.className = 'hand-grid';

    // Create 13x13 grid
    // Row = first card rank, Col = second card rank
    // Diagonal = pairs, above diagonal = suited, below = offsuit

    for (let row = 0; row < 13; row++) {
        for (let col = 0; col < 13; col++) {
            const rank1 = RANKS[row];
            const rank2 = RANKS[col];

            let handString;
            let cellType;

            if (row === col) {
                // Diagonal - pairs
                handString = `${rank1}${rank2}`;
                cellType = 'pair';
            } else if (col > row) {
                // Above diagonal - suited
                handString = `${rank1}${rank2}s`;
                cellType = 'suited';
            } else {
                // Below diagonal - offsuit
                const r1 = RANKS[col]; // Swap to show higher rank first
                const r2 = RANKS[row];
                handString = `${r1}${r2}o`;
                cellType = 'offsuit';
            }

            const cell = createHandCell(handString, cellType, selectedHands.includes(handString));

            if (interactive && onHandClick) {
                cell.style.cursor = 'pointer';
                cell.addEventListener('click', () => {
                    const isSelected = cell.classList.contains('selected');
                    onHandClick(handString, !isSelected, cell);
                });
            }

            grid.appendChild(cell);
        }
    }

    return grid;
}

/**
 * Create a single hand cell
 * @param {string} handString - Hand notation (e.g., 'AKs')
 * @param {string} cellType - Type: 'pair', 'suited', or 'offsuit'
 * @param {boolean} selected - Whether the cell is selected
 * @returns {HTMLElement} Hand cell element
 */
function createHandCell(handString, cellType, selected = false) {
    const cell = document.createElement('div');
    cell.className = `hand-cell ${cellType}`;
    cell.dataset.hand = handString;

    // Display text (remove 's' and 'o' suffix for cleaner look in grid)
    let displayText = handString.replace(/[so]$/, '');
    cell.textContent = displayText;

    if (selected) {
        cell.classList.add('selected');
    }

    // Add tooltip
    cell.title = handString;

    return cell;
}

/**
 * Update grid selection
 * @param {HTMLElement} grid - The grid element
 * @param {Array} selectedHands - Array of selected hand strings
 */
export function updateGridSelection(grid, selectedHands) {
    const cells = grid.querySelectorAll('.hand-cell');

    cells.forEach(cell => {
        const handString = cell.dataset.hand;
        if (selectedHands.includes(handString)) {
            cell.classList.add('selected');
        } else {
            cell.classList.remove('selected');
        }
    });
}

/**
 * Get all selected hands from grid
 * @param {HTMLElement} grid - The grid element
 * @returns {Array} Array of selected hand strings
 */
export function getSelectedHands(grid) {
    const selectedCells = grid.querySelectorAll('.hand-cell.selected');
    return Array.from(selectedCells).map(cell => cell.dataset.hand);
}

/**
 * Clear all selections in grid
 * @param {HTMLElement} grid - The grid element
 */
export function clearSelection(grid) {
    const cells = grid.querySelectorAll('.hand-cell.selected');
    cells.forEach(cell => cell.classList.remove('selected'));
}

/**
 * Select all hands in grid
 * @param {HTMLElement} grid - The grid element
 */
export function selectAll(grid) {
    const cells = grid.querySelectorAll('.hand-cell');
    cells.forEach(cell => cell.classList.add('selected'));
}

/**
 * Toggle selection of a specific hand
 * @param {HTMLElement} grid - The grid element
 * @param {string} handString - Hand to toggle
 */
export function toggleHand(grid, handString) {
    const cell = grid.querySelector(`[data-hand="${handString}"]`);
    if (cell) {
        cell.classList.toggle('selected');
    }
}

/**
 * Create a compact range display (text list)
 * @param {Array} hands - Array of hand strings
 * @returns {HTMLElement} Range display element
 */
export function createRangeDisplay(hands) {
    const container = document.createElement('div');
    container.className = 'range-display';

    const text = hands.join(', ');
    container.textContent = text || 'No hands selected';

    return container;
}

/**
 * Get hand info for display
 * @param {string} handString - Hand notation
 * @returns {Object} Hand information
 */
export function getHandInfo(handString) {
    const isPair = handString.length === 2;
    const isSuited = handString.endsWith('s');
    const isOffsuit = handString.endsWith('o');

    let combos;
    if (isPair) {
        combos = 6; // C(4,2) = 6 combinations
    } else if (isSuited) {
        combos = 4; // 4 suited combinations
    } else {
        combos = 12; // 12 offsuit combinations
    }

    return {
        hand: handString,
        isPair,
        isSuited,
        isOffsuit,
        combos,
        type: isPair ? 'Pair' : (isSuited ? 'Suited' : 'Offsuit')
    };
}

export default {
    createHandGrid,
    updateGridSelection,
    getSelectedHands,
    clearSelection,
    selectAll,
    toggleHand,
    createRangeDisplay,
    getHandInfo
};
