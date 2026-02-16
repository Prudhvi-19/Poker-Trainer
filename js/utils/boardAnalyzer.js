// Shared Board Texture Analyzer
// Single source of truth for board classification - replaces 6 duplicate implementations

import { RANKS } from './constants.js';

/**
 * Analyze a board's texture, connectivity, and who it favors
 * @param {Array<{rank: string, suit: string}|string>} board - board cards (objects or strings)
 * @returns {Object} comprehensive board analysis
 */
export function analyzeBoard(board) {
    // Normalize cards: accept both objects and strings
    const cards = board.map(c => {
        if (typeof c === 'string') {
            return { rank: c.slice(0, -1), suit: c.slice(-1) };
        }
        return c;
    });

    const ranks = cards.map(c => RANKS.indexOf(c.rank));
    const suits = cards.map(c => c.suit);

    // Sort ranks (lower index = higher rank in RANKS array)
    const sortedRanks = [...ranks].sort((a, b) => a - b);

    // --- Pairing ---
    const rankCounts = {};
    ranks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);
    const isPaired = Object.values(rankCounts).some(count => count >= 2);
    const isTrips = Object.values(rankCounts).some(count => count >= 3);

    // --- Suit analysis ---
    const suitCounts = {};
    suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
    const maxSuitCount = Math.max(...Object.values(suitCounts));

    const isMonotone = maxSuitCount >= 3;
    const isTwoTone = maxSuitCount === 2;
    const isRainbow = maxSuitCount === 1;

    // --- Connectivity ---
    const uniqueRanks = [...new Set(sortedRanks)];
    const spread = uniqueRanks[uniqueRanks.length - 1] - uniqueRanks[0];

    // Count gaps <= 2 between adjacent sorted unique ranks
    let connectedPairs = 0;
    for (let i = 0; i < uniqueRanks.length - 1; i++) {
        if (uniqueRanks[i + 1] - uniqueRanks[i] <= 2) {
            connectedPairs++;
        }
    }

    const isConnected = connectedPairs >= 2 || (spread <= 4 && !isPaired);
    const hasStraightDraw = spread <= 5 && connectedPairs >= 1;

    // --- Height ---
    const highCards = ranks.filter(r => r <= 4).length; // A=0, K=1, Q=2, J=3, T=4
    const isHigh = highCards >= 2;
    const isLow = sortedRanks[0] >= 5; // All cards 9 or lower (index 5+)
    const isMixed = !isHigh && !isLow;

    // --- Texture classification ---
    let texture;
    let textureReason;

    if (isPaired && !isMonotone && !isConnected) {
        texture = 'STATIC';
        textureReason = 'Paired board with limited draws - equity rarely shifts on later streets';
    } else if ((isMonotone || isTwoTone) && isConnected) {
        texture = 'DYNAMIC';
        textureReason = 'Connected + flush draw possible - equity can shift dramatically on turn/river';
    } else if (isMonotone || (isTwoTone && hasStraightDraw) || (isConnected && !isPaired)) {
        texture = 'WET';
        textureReason = 'Multiple draws available - many turn cards change hand equities';
    } else if (!isTwoTone && !isConnected && spread > 5) {
        texture = 'DRY';
        textureReason = 'Rainbow, disconnected - few draws, stable equity on later streets';
    } else if (isTwoTone || hasStraightDraw) {
        texture = 'WET';
        textureReason = 'Some draw potential exists - board is somewhat coordinated';
    } else {
        texture = 'DRY';
        textureReason = 'Limited drawing possibilities - equity is relatively stable';
    }

    // --- Range advantage ---
    let favor;
    let favorReason;

    if (isHigh) {
        favor = 'raiser';
        favorReason = 'High boards connect with preflop raiser\'s range (AK, AQ, KQ, broadway pairs)';
    } else if (isLow && isConnected) {
        favor = 'caller';
        favorReason = 'Low connected boards favor caller\'s range (suited connectors, small pairs for sets)';
    } else if (isPaired && sortedRanks[0] <= 4) {
        favor = 'raiser';
        favorReason = 'High paired boards favor raiser\'s broadway holdings';
    } else if (isPaired && sortedRanks[0] >= 8) {
        favor = 'caller';
        favorReason = 'Low paired boards favor caller\'s wider range';
    } else {
        favor = 'neutral';
        favorReason = 'Neither player has a significant range advantage on this board';
    }

    return {
        texture,
        textureReason,
        favor,
        favorReason,
        isPaired,
        isTrips,
        isMonotone,
        isTwoTone,
        isRainbow,
        isConnected,
        hasStraightDraw,
        isHigh,
        isLow,
        isMixed,
        spread,
        sortedRanks,
        suitCounts,
        rankCounts
    };
}

/**
 * Simplified texture for display (dry/semi-wet/wet)
 * @param {Object} analysis - result from analyzeBoard
 * @returns {string}
 */
export function getSimpleTexture(analysis) {
    if (analysis.texture === 'DRY' || analysis.texture === 'STATIC') return 'dry';
    if (analysis.texture === 'DYNAMIC') return 'wet';
    return analysis.texture === 'WET' ? 'wet' : 'semi-wet';
}

export default {
    analyzeBoard,
    getSimpleTexture
};
