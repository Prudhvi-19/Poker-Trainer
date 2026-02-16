// ENH-001: Simple ELO-like rating system
//
// Notes:
// - We keep it deterministic and lightweight (no external deps).
// - For now, each decision is treated as binary (correct/incorrect).
//   Later (ENH-002), this can be extended to EV-based grading.

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}

export function expectedScore(playerRating, opponentRating) {
    // Standard ELO expected score
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

export function kFactor(rating) {
    // Simple scaling: newer/weaker players move faster, stronger players move slower.
    if (rating < 1000) return 40;
    if (rating < 1600) return 24;
    return 16;
}

// BUG-043: Difficulty mapping so all trainers don't use a fixed "1500" opponent rating.
// This keeps the rating system more honest: easy drills = lower opponent rating,
// harder multi-street decisions = higher opponent rating.
export function opponentRatingForContext({ module = null, trainerType = null, street = null } = {}) {
    const m = typeof module === 'string' ? module : '';
    const t = typeof trainerType === 'string' ? trainerType : '';
    const s = typeof street === 'string' ? street : '';

    // Multi-street tends to be the hardest.
    if (m === 'multistreet') {
        if (s === 'river') return 1850;
        if (s === 'turn') return 1800;
        if (s === 'flop') return 1750;
        if (s === 'preflop') return 1600;
        return 1800;
    }

    // Preflop drills are generally easier.
    if (m.startsWith('preflop-')) {
        if (t === 'rfi') return 1350;
        if (t === 'bb-defense') return 1450;
        if (t === '3bet') return 1500;
        if (t === '4bet') return 1550;
        if (t === 'cold-call') return 1500;
        if (t === 'squeeze') return 1550;
        return 1450;
    }

    // Postflop trainers.
    if (m.startsWith('postflop-')) return 1650;
    if (m === 'cbet-trainer') return 1650;
    if (m === 'bet-sizing-trainer') return 1700;
    if (m === 'board-texture-trainer') return 1550;
    if (m === 'pot-odds-trainer') return 1500;

    return 1500;
}

/**
 * Adjust rating for a single decision.
 * @param {number} currentRating
 * @param {boolean} isCorrect
 * @param {number} [opponentRating=1500] - acts as “difficulty” baseline
 */
export function applyDecisionRating(currentRating, isCorrect, opponentRating = 1500) {
    const r = Number.isFinite(currentRating) ? currentRating : 1200;
    const actual = isCorrect ? 1 : 0;
    const exp = expectedScore(r, opponentRating);
    const k = kFactor(r);
    const next = Math.round(r + k * (actual - exp));
    return clamp(next, 0, 3000);
}

/**
 * Append a rating sample to history.
 * Keeps history capped to avoid localStorage bloat.
 */
export function appendRatingHistory(history, rating, maxEntries = 500) {
    const safeHistory = Array.isArray(history) ? history : [];
    const next = [...safeHistory, { t: new Date().toISOString(), r: rating }];
    if (next.length > maxEntries) {
        return next.slice(next.length - maxEntries);
    }
    return next;
}

export function getRatingTier(rating) {
    const r = Number.isFinite(rating) ? rating : 1200;
    if (r < 1000) return { key: 'bronze', label: 'Bronze' };
    if (r < 1400) return { key: 'silver', label: 'Silver' };
    if (r < 1800) return { key: 'gold', label: 'Gold' };
    if (r < 2200) return { key: 'platinum', label: 'Platinum' };
    if (r < 2600) return { key: 'diamond', label: 'Diamond' };
    return { key: 'master', label: 'Master' };
}
