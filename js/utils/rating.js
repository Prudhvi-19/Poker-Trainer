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
