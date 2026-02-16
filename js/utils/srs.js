// ENH-004: Spaced Repetition System (SRS)
//
// Goals:
// - Deterministic scheduling
// - Works across all poker-action trainers
// - Stores a compact per-scenario-key state in localStorage
//
// We intentionally implement a simplified SM-2 variant:
// - We only use a binary “quality” derived from EV grade/isCorrect
// - Each item has: intervalDays, ease, dueAt, reps, lapses
//

import storage from './storage.js';

export const SRS_GRADES = {
    PERFECT: 5,
    GOOD: 4,
    MISTAKE: 2,
    BLUNDER: 1,
    INCORRECT: 1
};

function nowIso() {
    return new Date().toISOString();
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}

export function buildScenarioKeyFromResult({ module, trainerType = null, scenario = null, decision = null }) {
    // module: session.module (e.g. "preflop-rfi", "postflop-cbet", "multistreet")
    // scenario: trainer scenario object (preflop/postflop/cbet/betsize)
    // decision: multistreet decision entry

    const family = typeof module === 'string'
        ? (module.startsWith('preflop-') ? 'preflop'
            : module.startsWith('postflop-') ? 'postflop'
                : module === 'multistreet' ? 'multistreet'
                    : module === 'cbet-trainer' ? 'cbet'
                        : module === 'bet-sizing-trainer' ? 'bet-sizing'
                            : 'other')
        : 'other';

    // Preflop/postflop format
    if (scenario) {
        // Prefer a stable hand identifier (ONLY for preflop; other modules would explode key count)
        const hand = family === 'preflop' ? (scenario.hand?.display || null) : null;

        // Preflop has position/villainPosition and type
        const position = scenario.position || null;
        const villainPosition = scenario.villainPosition || null;
        const callerPosition = scenario.callerPosition || null;
        const type = scenario.type || trainerType || null;

        // Postflop-style scenarios have board + heroHand display.
        // Keep key bounded: use texture + handStrength when available.
        const texture = scenario.texture || scenario.boardAnalysis?.texture || scenario.analysis?.texture || null;
        const handStrength = scenario.handStrength?.strength || scenario.handStrength || scenario.analysis?.strength || null;

        const street = scenario.street || null;
        const heroIsAggressor = typeof scenario.heroIsAggressor === 'boolean' ? scenario.heroIsAggressor : null;

        return JSON.stringify({
            v: 1,
            family,
            module,
            type,
            street,
            heroIsAggressor,
            position,
            villainPosition,
            callerPosition,
            hand,
            texture,
            handStrength
        });
    }

    // Multistreet decision format
    if (decision) {
        return JSON.stringify({
            v: 1,
            module,
            street: decision.street || null,
            position: decision.position || null
        });
    }

    // Fallback
    return JSON.stringify({ v: 1, module, trainerType });
}

export function qualityFromFeedback({ isCorrect, evFeedback }) {
    // Map the 4-tier EV grade to SM-2 style quality.
    const key = evFeedback?.grade?.key;
    if (key === 'perfect') return SRS_GRADES.PERFECT;
    if (key === 'good') return SRS_GRADES.GOOD;
    if (key === 'mistake') return SRS_GRADES.MISTAKE;
    if (key === 'blunder') return SRS_GRADES.BLUNDER;
    return isCorrect ? SRS_GRADES.GOOD : SRS_GRADES.INCORRECT;
}

export function upsertSrsResult({ scenarioKey, isCorrect, evFeedback, timestamp = null, payload = null }) {
    if (!scenarioKey) return null;
    const state = storage.getSrsState();
    const items = state.items || {};

    const q = qualityFromFeedback({ isCorrect, evFeedback });
    const reviewedAt = timestamp || nowIso();

    const prev = items[scenarioKey] || {
        reps: 0,
        lapses: 0,
        ease: 2.3,
        intervalDays: 0,
        dueAt: reviewedAt,
        lastReviewedAt: null,
        lastQuality: null,
        payload: null
    };

    const nextPayload = payload ?? prev.payload ?? null;

    // Simplified SM-2:
    // - quality < 3 => reset interval (lapse)
    // - quality >= 3 => increase interval
    let ease = prev.ease;
    ease = clamp(ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)), 1.3, 2.8);

    let intervalDays = prev.intervalDays;
    let reps = prev.reps;
    let lapses = prev.lapses;

    if (q < 3) {
        // Lapse
        lapses += 1;
        reps = 0;
        intervalDays = 0; // due immediately (same session)
    } else {
        reps += 1;
        if (reps === 1) intervalDays = 1;
        else if (reps === 2) intervalDays = 3;
        else intervalDays = Math.round(intervalDays * ease);
    }

    const dueAt = addDays(new Date(reviewedAt), intervalDays).toISOString();

    const next = {
        reps,
        lapses,
        ease,
        intervalDays,
        dueAt,
        lastReviewedAt: reviewedAt,
        lastQuality: q,
        payload: nextPayload
    };

    items[scenarioKey] = next;
    storage.saveSrsState({ ...state, items });
    return next;
}

export function getDueScenarioKeys({ limit = 25, asOf = new Date() } = {}) {
    const state = storage.getSrsState();
    const items = state.items || {};
    const now = new Date(asOf);

    const due = [];
    for (const [key, item] of Object.entries(items)) {
        const dueAt = item?.dueAt ? new Date(item.dueAt) : null;
        if (!dueAt || dueAt <= now) {
            due.push({ key, dueAt: dueAt ? dueAt.getTime() : 0, ease: item?.ease || 2.3 });
        }
    }

    // Earliest due first
    due.sort((a, b) => a.dueAt - b.dueAt);
    return due.slice(0, limit).map(d => d.key);
}

export function getDueItems({ limit = 25, asOf = new Date() } = {}) {
    const state = storage.getSrsState();
    const items = state.items || {};
    const now = new Date(asOf);

    const due = [];
    for (const [key, item] of Object.entries(items)) {
        const dueAt = item?.dueAt ? new Date(item.dueAt) : null;
        if (!dueAt || dueAt <= now) {
            due.push({ key, dueAt: dueAt ? dueAt.getTime() : 0, item });
        }
    }
    due.sort((a, b) => a.dueAt - b.dueAt);
    return due.slice(0, limit);
}

export function setItemPayload({ scenarioKey, payload }) {
    if (!scenarioKey) return false;
    const state = storage.getSrsState();
    const items = state.items || {};
    const prev = items[scenarioKey] || null;
    if (!prev) return false;
    items[scenarioKey] = { ...prev, payload };
    return storage.saveSrsState({ ...state, items });
}
