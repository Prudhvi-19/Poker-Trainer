// Playing Card Component

import { SUITS, SUIT_NAMES } from '../utils/constants.js';

/**
 * Create a playing card element
 * @param {Object} card - Card object with rank and suit
 * @param {string} card.rank - Card rank (A, K, Q, etc.)
 * @param {string} card.suit - Card suit (♠, ♥, ♦, ♣)
 * @param {boolean} large - Whether to use large card style
 * @returns {HTMLElement} Card element
 */
export function createCard(card, large = false) {
    if (!card || !card.rank || !card.suit) {
        return createCardBack(large);
    }

    const cardEl = document.createElement('div');
    cardEl.className = `playing-card ${SUIT_NAMES[card.suit]}${large ? ' large' : ''}`;

    const rankEl = document.createElement('div');
    rankEl.className = 'rank';
    rankEl.textContent = card.rank;

    const suitEl = document.createElement('div');
    suitEl.className = 'suit';
    suitEl.textContent = card.suit;

    cardEl.appendChild(rankEl);
    cardEl.appendChild(suitEl);

    return cardEl;
}

/**
 * Create a card back (hidden card)
 * @param {boolean} large - Whether to use large card style
 * @returns {HTMLElement} Card back element
 */
export function createCardBack(large = false) {
    const cardEl = document.createElement('div');
    cardEl.className = `playing-card card-back${large ? ' large' : ''}`;
    cardEl.style.backgroundColor = '#2563eb';
    cardEl.style.background = 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';
    cardEl.textContent = '🂠';
    cardEl.style.fontSize = large ? '48px' : '32px';
    cardEl.style.display = 'flex';
    cardEl.style.alignItems = 'center';
    cardEl.style.justifyContent = 'center';

    return cardEl;
}

/**
 * Create a hand display (two cards)
 * @param {Object} hand - Hand object with rank1, rank2, suited
 * @param {boolean} large - Whether to use large cards
 * @returns {HTMLElement} Hand display element
 */
export function createHandDisplay(hand, large = false) {
    const container = document.createElement('div');
    container.className = 'hand-display';

    if (!hand) {
        container.appendChild(createCardBack(large));
        container.appendChild(createCardBack(large));
        return container;
    }

    // Determine suits based on whether hand is suited
    let suit1, suit2;

    if (hand.suited) {
        // Same suit - randomly pick one
        const suits = Object.values(SUITS);
        suit1 = suit2 = suits[Math.floor(Math.random() * suits.length)];
    } else {
        // Different suits
        const suits = Object.values(SUITS);
        suit1 = suits[Math.floor(Math.random() * suits.length)];
        // Pick a different suit for the second card
        do {
            suit2 = suits[Math.floor(Math.random() * suits.length)];
        } while (suit2 === suit1);
    }

    const card1 = createCard({ rank: hand.rank1, suit: suit1 }, large);
    const card2 = createCard({ rank: hand.rank2, suit: suit2 }, large);

    container.appendChild(card1);
    container.appendChild(card2);

    return container;
}

/**
 * Create a board display (flop, turn, river)
 * @param {Array} cards - Array of card objects
 * @param {boolean} large - Whether to use large cards
 * @returns {HTMLElement} Board display element
 */
export function createBoardDisplay(cards, large = false) {
    const container = document.createElement('div');
    container.className = 'board-display';

    if (!cards || cards.length === 0) {
        return container;
    }

    cards.forEach(card => {
        const cardEl = createCard(card, large);
        container.appendChild(cardEl);
    });

    return container;
}

/**
 * Create a hand notation display (e.g., "AKs")
 * @param {Object} hand - Hand object
 * @returns {HTMLElement} Hand notation element
 */
export function createHandNotation(hand) {
    const el = document.createElement('div');
    el.className = 'hand-notation';
    el.style.fontSize = '2rem';
    el.style.fontWeight = 'bold';
    el.style.fontFamily = 'monospace';
    el.textContent = hand.display || formatHandDisplay(hand);

    return el;
}

/**
 * Format hand for display
 * @param {Object} hand - Hand object
 * @returns {string} Formatted hand string
 */
function formatHandDisplay(hand) {
    if (!hand) return '';

    const { rank1, rank2, suited } = hand;

    if (rank1 === rank2) {
        return `${rank1}${rank2}`;
    }

    return `${rank1}${rank2}${suited ? 's' : 'o'}`;
}

export default {
    createCard,
    createCardBack,
    createHandDisplay,
    createBoardDisplay,
    createHandNotation
};
