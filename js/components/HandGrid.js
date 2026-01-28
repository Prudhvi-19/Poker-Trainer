// 13x13 Hand Range Grid Component
// Supports multi-color display for different actions (raise, call, fold)

import { RANKS } from '../utils/constants.js';

/**
 * Create a 13x13 hand grid for range visualization
 * Supports both legacy format and new multi-action format
 *
 * Legacy: createHandGrid(selectedHands, onHandClick, interactive)
 * New: createHandGrid({ raiseHands, callHands, onHandClick, interactive })
 *
 * @param {Object|Array} options - Configuration options or legacy selectedHands array
 * @returns {HTMLElement} Hand grid element
 */
export function createHandGrid(options = {}, legacyOnHandClick = null, legacyInteractive = true) {
    // Support legacy format: createHandGrid(selectedHands, onHandClick, interactive)
    let raiseHands = [];
    let callHands = [];
    let onHandClick = null;
    let interactive = true;

    if (Array.isArray(options)) {
        // Legacy format
        raiseHands = options || [];
        onHandClick = legacyOnHandClick;
        interactive = legacyInteractive !== false;
    } else {
        // New format
        raiseHands = options.raiseHands || options.selectedHands || [];
        callHands = options.callHands || [];
        onHandClick = options.onHandClick || null;
        interactive = options.interactive !== false;
    }

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

            // Determine action type
            let actionType = 'fold'; // default
            if (raiseHands.includes(handString)) {
                actionType = 'raise';
            } else if (callHands.includes(handString)) {
                actionType = 'call';
            }

            const cell = createHandCell(handString, cellType, actionType);

            if (interactive && onHandClick) {
                cell.style.cursor = 'pointer';
                cell.addEventListener('click', () => {
                    const currentAction = cell.dataset.action;
                    onHandClick(handString, currentAction !== 'fold', cell);
                });
            }

            grid.appendChild(cell);
        }
    }

    return grid;
}

/**
 * Create a single hand cell with action coloring
 * @param {string} handString - Hand notation (e.g., 'AKs')
 * @param {string} cellType - Type: 'pair', 'suited', or 'offsuit'
 * @param {string} actionType - Action: 'raise', 'call', or 'fold'
 * @returns {HTMLElement} Hand cell element
 */
function createHandCell(handString, cellType, actionType = 'fold') {
    const cell = document.createElement('div');
    cell.className = `hand-cell ${cellType}`;
    cell.dataset.hand = handString;
    cell.dataset.action = actionType;

    // Apply action-specific styling
    if (actionType === 'raise') {
        cell.classList.add('action-raise');
    } else if (actionType === 'call') {
        cell.classList.add('action-call');
    }

    // Display text (remove 's' and 'o' suffix for cleaner look in grid)
    let displayText = handString.replace(/[so]$/, '');
    cell.textContent = displayText;

    // Add tooltip with full hand notation and action
    const actionLabel = actionType === 'fold' ? 'Fold' : actionType.charAt(0).toUpperCase() + actionType.slice(1);
    cell.title = `${handString} - ${actionLabel}`;

    return cell;
}

/**
 * Create a multi-action hand grid with raise and call colors
 * @param {Array} raiseHands - Hands to 3-bet/raise (green)
 * @param {Array} callHands - Hands to call (amber)
 * @param {boolean} interactive - Whether clickable
 * @returns {HTMLElement} Hand grid element
 */
export function createMultiActionGrid(raiseHands = [], callHands = [], interactive = false) {
    return createHandGrid({
        raiseHands,
        callHands,
        interactive
    });
}

/**
 * Update grid with new hand selections
 * @param {HTMLElement} grid - The grid element
 * @param {Array} raiseHands - Hands to mark as raise
 * @param {Array} callHands - Hands to mark as call
 */
export function updateGridActions(grid, raiseHands = [], callHands = []) {
    const cells = grid.querySelectorAll('.hand-cell');

    cells.forEach(cell => {
        const handString = cell.dataset.hand;

        // Remove existing action classes
        cell.classList.remove('action-raise', 'action-call', 'selected');

        // Apply new action
        if (raiseHands.includes(handString)) {
            cell.classList.add('action-raise');
            cell.dataset.action = 'raise';
        } else if (callHands.includes(handString)) {
            cell.classList.add('action-call');
            cell.dataset.action = 'call';
        } else {
            cell.dataset.action = 'fold';
        }
    });
}

/**
 * Update grid selection (legacy support)
 * @param {HTMLElement} grid - The grid element
 * @param {Array} selectedHands - Array of selected hand strings
 */
export function updateGridSelection(grid, selectedHands) {
    updateGridActions(grid, selectedHands, []);
}

/**
 * Get all selected hands from grid
 * @param {HTMLElement} grid - The grid element
 * @returns {Array} Array of selected hand strings (for legacy compatibility)
 */
export function getSelectedHands(grid) {
    const selectedCells = grid.querySelectorAll('.hand-cell.action-raise, .hand-cell.action-call, .hand-cell.selected');
    return Array.from(selectedCells).map(cell => cell.dataset.hand);
}

/**
 * Get hands by action type
 * @param {HTMLElement} grid - The grid element
 * @returns {Object} Object with raiseHands and callHands arrays
 */
export function getHandsByAction(grid) {
    const raiseHands = [];
    const callHands = [];

    const cells = grid.querySelectorAll('.hand-cell');
    cells.forEach(cell => {
        const hand = cell.dataset.hand;
        const action = cell.dataset.action;

        if (action === 'raise') {
            raiseHands.push(hand);
        } else if (action === 'call') {
            callHands.push(hand);
        }
    });

    return { raiseHands, callHands };
}

/**
 * Clear all selections in grid
 * @param {HTMLElement} grid - The grid element
 */
export function clearSelection(grid) {
    const cells = grid.querySelectorAll('.hand-cell');
    cells.forEach(cell => {
        cell.classList.remove('action-raise', 'action-call', 'selected');
        cell.dataset.action = 'fold';
    });
}

/**
 * Select all hands in grid as raise
 * @param {HTMLElement} grid - The grid element
 */
export function selectAll(grid) {
    const cells = grid.querySelectorAll('.hand-cell');
    cells.forEach(cell => {
        cell.classList.add('action-raise');
        cell.dataset.action = 'raise';
    });
}

/**
 * Toggle selection of a specific hand
 * @param {HTMLElement} grid - The grid element
 * @param {string} handString - Hand to toggle
 */
export function toggleHand(grid, handString) {
    const cell = grid.querySelector(`[data-hand="${handString}"]`);
    if (cell) {
        if (cell.dataset.action === 'fold') {
            cell.classList.add('action-raise');
            cell.dataset.action = 'raise';
        } else {
            cell.classList.remove('action-raise', 'action-call', 'selected');
            cell.dataset.action = 'fold';
        }
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

/**
 * Calculate range statistics
 * @param {Array} raiseHands - Raise hands
 * @param {Array} callHands - Call hands
 * @returns {Object} Statistics
 */
export function calculateRangeStats(raiseHands = [], callHands = []) {
    const calcCombos = (hands) => {
        let total = 0;
        hands.forEach(hand => {
            if (hand.length === 2) total += 6; // Pair
            else if (hand.endsWith('s')) total += 4; // Suited
            else total += 12; // Offsuit
        });
        return total;
    };

    const raiseCombos = calcCombos(raiseHands);
    const callCombos = calcCombos(callHands);
    const totalCombos = raiseCombos + callCombos;
    const totalPossible = 1326;

    return {
        raiseHands: raiseHands.length,
        callHands: callHands.length,
        raiseCombos,
        callCombos,
        totalCombos,
        raisePercent: ((raiseCombos / totalPossible) * 100).toFixed(1),
        callPercent: ((callCombos / totalPossible) * 100).toFixed(1),
        totalPercent: ((totalCombos / totalPossible) * 100).toFixed(1)
    };
}

export default {
    createHandGrid,
    createMultiActionGrid,
    updateGridActions,
    updateGridSelection,
    getSelectedHands,
    getHandsByAction,
    clearSelection,
    selectAll,
    toggleHand,
    createRangeDisplay,
    getHandInfo,
    calculateRangeStats
};
