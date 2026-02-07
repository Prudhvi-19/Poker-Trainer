// Shared Deck Manager - single source of truth for card generation
// Eliminates duplicate deck/deal/shuffle logic across 5+ modules

import { RANKS, SUITS } from './constants.js';

const SUIT_VALUES = Object.values(SUITS);

/**
 * Create a full 52-card deck
 * @returns {Array<{rank: string, suit: string}>}
 */
export function createDeck() {
    const deck = [];
    for (const rank of RANKS) {
        for (const suit of SUIT_VALUES) {
            deck.push({ rank, suit });
        }
    }
    return deck;
}

/**
 * Fisher-Yates shuffle (in-place)
 * @param {Array} array
 * @returns {Array} the same array, shuffled
 */
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Generate a random board of N cards, excluding specified cards
 * @param {number} numCards - number of cards to deal (3=flop, 4=turn, 5=river)
 * @param {Array} excludeCards - cards already in use [{rank, suit}]
 * @returns {Array<{rank: string, suit: string}>}
 */
export function generateBoard(numCards, excludeCards = []) {
    const usedCards = new Set(excludeCards.map(c => `${c.rank}${c.suit}`));
    const deck = createDeck().filter(c => !usedCards.has(`${c.rank}${c.suit}`));
    shuffle(deck);
    return deck.slice(0, numCards);
}

/**
 * Generate a hero hand from a specific hand type list, excluding board cards
 * @param {Array<{rank: string, suit: string}>} board - current board cards
 * @param {Array<string[]>} handTypes - e.g. [['A','K'], ['Q','Q']]
 * @returns {Array<{rank: string, suit: string}>}
 */
export function generateHeroHand(board, handTypes) {
    const usedCards = new Set(board.map(c => `${c.rank}${c.suit}`));
    const deck = createDeck().filter(c => !usedCards.has(`${c.rank}${c.suit}`));
    shuffle(deck);

    const selectedType = handTypes[Math.floor(Math.random() * handTypes.length)];

    const hand = [];
    const available = [...deck];

    for (const targetRank of selectedType) {
        const idx = available.findIndex(c => c.rank === targetRank);
        if (idx !== -1) {
            hand.push(available.splice(idx, 1)[0]);
        } else {
            // Fallback to random card
            hand.push(available.shift());
        }
    }

    return hand;
}

/**
 * Format a card object as a string
 * @param {{rank: string, suit: string}} card
 * @returns {string} e.g. "A♠"
 */
export function cardToString(card) {
    return `${card.rank}${card.suit}`;
}

/**
 * Parse a card string to an object
 * @param {string} cardStr - e.g. "A♠"
 * @returns {{rank: string, suit: string}}
 */
export function parseCardString(cardStr) {
    if (!cardStr || cardStr.length < 2) return null;
    return {
        rank: cardStr.slice(0, -1),
        suit: cardStr.slice(-1)
    };
}

export default {
    createDeck,
    shuffle,
    generateBoard,
    generateHeroHand,
    cardToString,
    parseCardString
};
