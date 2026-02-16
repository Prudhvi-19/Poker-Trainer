// ENH-002: EV-based feedback utilities
//
// We use a lightweight, approximate chip-EV model (in bb) driven by Monte Carlo
// equity estimates (see js/utils/equity.js).

export const DECISION_GRADES = {
    PERFECT: { key: 'perfect', label: 'Perfect', icon: '✅' },
    GOOD: { key: 'good', label: 'Good', icon: '🟢' },
    MISTAKE: { key: 'mistake', label: 'Mistake', icon: '🟠' },
    BLUNDER: { key: 'blunder', label: 'Blunder', icon: '🔴' }
};

/**
 * Convert EV loss (bb) to a 4-tier grade.
 * Thresholds align with openBugs.md ENH-002 spec.
 */
export function gradeFromEvLoss(evLossBb) {
    const loss = Math.max(0, Number(evLossBb) || 0);
    if (loss <= 0.1) return DECISION_GRADES.PERFECT;
    if (loss < 0.5) return DECISION_GRADES.GOOD;
    if (loss <= 2.0) return DECISION_GRADES.MISTAKE;
    return DECISION_GRADES.BLUNDER;
}

export function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}

/**
 * EV of folding at decision point (we ignore sunk costs).
 */
export function evFold() {
    return 0;
}

/**
 * EV of calling a bet and realizing equity to showdown immediately.
 *
 * @param {number} equity - 0..1
 * @param {number} potNow - current pot (includes villain's bet if already made)
 * @param {number} callCost - amount hero must put in to call
 */
export function evCallToShowdown({ equity, potNow, callCost }) {
    const e = clamp(equity, 0, 1);
    const pot = Math.max(0, Number(potNow) || 0);
    const cost = Math.max(0, Number(callCost) || 0);
    // If hero calls, pot grows by callCost.
    const potAfterCall = pot + cost;
    return e * potAfterCall - (1 - e) * cost;
}

/**
 * EV of checking and getting to showdown without further investment.
 * NOTE: This is an approximation used for trainer feedback.
 */
export function evCheckToShowdown({ equity, potNow }) {
    const e = clamp(equity, 0, 1);
    const pot = Math.max(0, Number(potNow) || 0);
    return e * pot;
}

/**
 * EV of betting/raising with optional fold equity.
 *
 * @param {number} equity - 0..1 if called
 * @param {number} potNow - current pot BEFORE hero bet/raise is added
 * @param {number} invest - how many bb hero puts in with the bet/raise
 * @param {number} villainCallExtra - how many bb villain adds when calling (0 if always folds)
 * @param {number} foldEquity - 0..1 chance villain folds to bet/raise
 */
export function evBetRaise({ equity, potNow, invest, villainCallExtra, foldEquity }) {
    const e = clamp(equity, 0, 1);
    const pot = Math.max(0, Number(potNow) || 0);
    const inv = Math.max(0, Number(invest) || 0);
    const callExtra = Math.max(0, Number(villainCallExtra) || 0);
    const fe = clamp(foldEquity, 0, 1);

    // If villain folds, hero wins the current pot.
    const evFoldBranch = pot;

    // If villain calls, pot grows by hero invest + villain extra.
    const potAfterCall = pot + inv + callExtra;
    const evCallBranch = e * potAfterCall - (1 - e) * inv;

    return fe * evFoldBranch + (1 - fe) * evCallBranch;
}

/**
 * Compute EV loss given best EV and chosen EV.
 */
export function evLossBb(bestEvBb, chosenEvBb) {
    const best = Number(bestEvBb);
    const chosen = Number(chosenEvBb);
    if (!Number.isFinite(best) || !Number.isFinite(chosen)) return 0;
    return Math.max(0, best - chosen);
}

/**
 * Given EV estimates for all available actions, compute EV loss + grade.
 *
 * Convention: actions are keyed by the ACTIONS values (e.g. 'fold', 'call', 'raise', 'bet', 'check')
 * or a module-specific action key.
 */
export function computeEvFeedbackFromEvs({ evByAction, correctAction, userAnswer, isCorrect, meta = null }) {
    if (!evByAction || typeof evByAction !== 'object') return null;
    if (correctAction == null || userAnswer == null) return null;

    const evGto = evByAction[correctAction];
    const evUser = evByAction[userAnswer];
    if (!Number.isFinite(evGto) || !Number.isFinite(evUser)) return null;

    let loss = isCorrect ? 0 : evLossBb(evGto, evUser);
    if (!isCorrect) {
        // Prevent a wrong action from ever showing “Perfect” due to approximate modeling.
        loss = Math.max(loss, 0.15);
    }

    return {
        evLossBb: loss,
        grade: gradeFromEvLoss(loss),
        meta,
        evGto,
        evUser
    };
}
