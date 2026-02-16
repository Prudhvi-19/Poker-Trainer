// Shared Hand Evaluator
// Single source of truth for hand strength evaluation
// Replaces 4+ duplicate implementations across modules

import { RANKS, SUITS } from './constants.js';

/**
 * Hand strength categories (strongest to weakest)
 */
export const HAND_STRENGTH = {
    MONSTER: 'MONSTER',           // Sets, two pair, straights, flushes
    STRONG: 'STRONG',             // Overpairs, top pair top kicker
    MEDIUM_STRONG: 'MEDIUM_STRONG', // Top pair weaker kicker
    MEDIUM: 'MEDIUM',             // Second pair, weak top pair
    STRONG_DRAW: 'STRONG_DRAW',   // Combo draws (flush + straight)
    DRAW: 'DRAW',                 // Flush draw or open-ended straight draw
    OVERCARDS: 'OVERCARDS',       // Two overcards (e.g., AK on 752)
    AIR: 'AIR'                    // No pair, no draw
};

/**
 * Evaluate hand strength against a board
 * @param {Object} hand - { rank1, rank2, suited } or [{rank, suit}, {rank, suit}]
 * @param {Array} board - board cards as [{rank, suit}] or strings like "A♠"
 * @returns {Object} detailed hand evaluation
 */
export function evaluateHandBoard(hand, board) {
    // Normalize hand
    let r1, r2, handSuited, handSuits;
    if (Array.isArray(hand)) {
        r1 = hand[0].rank;
        r2 = hand[1].rank;
        handSuits = [hand[0].suit, hand[1].suit];
        handSuited = handSuits[0] === handSuits[1];
    } else {
        r1 = hand.rank1;
        r2 = hand.rank2;
        handSuited = hand.suited;
        handSuits = null; // Suits not tracked for abstract hands
    }

    // Normalize board
    const boardCards = board.map(c => {
        if (typeof c === 'string') {
            return { rank: c.slice(0, -1), suit: c.slice(-1) };
        }
        return c;
    });

    const boardRanks = boardCards.map(c => c.rank);
    const boardSuits = boardCards.map(c => c.suit);
    const boardRankIndices = boardRanks.map(r => RANKS.indexOf(r));

    const r1Index = RANKS.indexOf(r1);
    const r2Index = RANKS.indexOf(r2);
    const isPair = r1 === r2;
    const minBoardRankIndex = Math.min(...boardRankIndices);

    // --- Made hands ---
    const hasSet = isPair && boardRanks.includes(r1);
    const hasPairOnBoard1 = boardRanks.includes(r1);
    const hasPairOnBoard2 = boardRanks.includes(r2);
    const hasPairOnBoard = hasPairOnBoard1 || hasPairOnBoard2;

    // Two pair: both cards paired with the board
    const hasTwoPair = !isPair && hasPairOnBoard1 && hasPairOnBoard2;

    const hasOverpair = isPair && r1Index < minBoardRankIndex;
    const hasTopPair = !isPair && (
        (hasPairOnBoard1 && r1Index === minBoardRankIndex) ||
        (hasPairOnBoard2 && r2Index === minBoardRankIndex)
    );
    const hasSecondPair = !hasTopPair && hasPairOnBoard;

    // --- Draws ---
    let hasFlushDraw = false;
    if (handSuits && handSuited) {
        // Count how many board cards share the hero's suit
        const heroSuit = handSuits[0];
        const matchingSuits = boardSuits.filter(s => s === heroSuit).length;
        hasFlushDraw = matchingSuits >= 2; // 2 on board + 2 in hand = 4 to flush
    } else if (handSuited && !handSuits) {
        // Abstract hand - check if any suit on the board has 2+ of the same
        // Use a deterministic suit assignment based on hand ranks
        const suitValues = Object.values(SUITS);
        const hash = (r1.charCodeAt(0) + r2.charCodeAt(0)) % suitValues.length;
        const assignedSuit = suitValues[hash];
        const matchingSuits = boardSuits.filter(s => s === assignedSuit).length;
        hasFlushDraw = matchingSuits >= 2;
    }

    const hasStraightDraw = checkStraightDraw(r1, r2, boardRanks);
    const hasOvercards = r1Index < minBoardRankIndex && r2Index < minBoardRankIndex;

    // Backdoor flush draw (3 to a flush)
    let hasBackdoorFlush = false;
    if (handSuits && handSuited) {
        const heroSuit = handSuits[0];
        const matchingSuits = boardSuits.filter(s => s === heroSuit).length;
        hasBackdoorFlush = matchingSuits >= 1 && !hasFlushDraw;
    }

    // --- Categorize strength ---
    let strength;
    if (hasSet || hasTwoPair) {
        strength = HAND_STRENGTH.MONSTER;
    } else if (hasOverpair) {
        strength = HAND_STRENGTH.STRONG;
    } else if (hasTopPair) {
        strength = HAND_STRENGTH.MEDIUM_STRONG;
    } else if (hasSecondPair) {
        strength = HAND_STRENGTH.MEDIUM;
    } else if (hasFlushDraw && hasStraightDraw) {
        strength = HAND_STRENGTH.STRONG_DRAW;
    } else if (hasFlushDraw || hasStraightDraw) {
        strength = HAND_STRENGTH.DRAW;
    } else if (hasOvercards) {
        strength = HAND_STRENGTH.OVERCARDS;
    } else {
        strength = HAND_STRENGTH.AIR;
    }

    return {
        strength,
        hasSet,
        hasTwoPair,
        hasOverpair,
        hasTopPair,
        hasSecondPair,
        hasPairOnBoard,
        hasFlushDraw,
        hasStraightDraw,
        hasOvercards,
        hasBackdoorFlush,
        isPair
    };
}

/**
 * Check for straight draws (open-ended or gutshot)
 */
function checkStraightDraw(r1, r2, boardRanks) {
    const allRanks = [r1, r2, ...boardRanks];
    const rankValues = allRanks.map(r => RANKS.indexOf(r)).sort((a, b) => a - b);
    const unique = [...new Set(rankValues)];

    // Check for 4-card straight (within a span of 4)
    for (let i = 0; i <= unique.length - 4; i++) {
        const span = unique[i + 3] - unique[i];
        if (span <= 4) return true;
    }

    // Check wheel draw (A-2-3-4-5): A is index 0, but also plays as low
    if (unique.includes(0)) {
        // Need at least 4 out of 5 cards from {A,2,3,4,5} to have a wheel straight draw.
        // Using our rank encoding: A=0, 5=9, 4=10, 3=11, 2=12
        const wheelLow = [9, 10, 11, 12];
        const lowCount = wheelLow.filter(v => unique.includes(v)).length;
        if (lowCount >= 3) return true;
    }

    return false;
}

/**
 * Human-readable strength labels
 */
export const STRENGTH_LABELS = {
    [HAND_STRENGTH.MONSTER]: 'Monster (Set/Two Pair+)',
    [HAND_STRENGTH.STRONG]: 'Strong (Overpair)',
    [HAND_STRENGTH.MEDIUM_STRONG]: 'Medium-Strong (Top Pair)',
    [HAND_STRENGTH.MEDIUM]: 'Medium (Second Pair)',
    [HAND_STRENGTH.STRONG_DRAW]: 'Strong Draw (Flush + Straight)',
    [HAND_STRENGTH.DRAW]: 'Draw (Flush or Straight)',
    [HAND_STRENGTH.OVERCARDS]: 'Overcards',
    [HAND_STRENGTH.AIR]: 'Air (No pair, no draw)'
};

export default {
    HAND_STRENGTH,
    STRENGTH_LABELS,
    evaluateHandBoard
};
