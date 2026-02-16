// ENH-004: Smart Practice session controller
//
// This module manages a cross-trainer SRS review session. It stores session state
// in localStorage so we can hop between modules via hash routing.

import router from '../router.js';
import storage from './storage.js';
import { MODULES, STORAGE_KEYS } from './constants.js';
import { showToast } from './helpers.js';

export function parseScenarioKey(key) {
    if (!key || typeof key !== 'string') return null;
    try {
        return JSON.parse(key);
    } catch {
        return null;
    }
}

export function getActiveSession() {
    const s = storage.get(STORAGE_KEYS.SRS_ACTIVE, null);
    if (!s || typeof s !== 'object') return null;
    if (!Array.isArray(s.keys) || typeof s.index !== 'number') return null;
    return s;
}

export function isSessionActive() {
    return !!getActiveSession();
}

export function stopSession() {
    storage.remove(STORAGE_KEYS.SRS_ACTIVE);
    storage.set(STORAGE_KEYS.SRS_AUTOSTART, false);
}

export function startSession({ keys }) {
    if (!Array.isArray(keys) || keys.length === 0) {
        showToast('No due SRS items to practice yet.', 'info');
        return false;
    }

    const state = {
        startedAt: new Date().toISOString(),
        keys,
        index: 0,
        // aggregate stats for this smart practice session
        total: 0,
        correct: 0,
        evLostBb: 0
    };

    storage.set(STORAGE_KEYS.SRS_ACTIVE, state);
    storage.set(STORAGE_KEYS.SRS_AUTOSTART, true);
    return true;
}

export function getCurrentKey() {
    const s = getActiveSession();
    if (!s) return null;
    return s.keys[s.index] || null;
}

export function getCurrentKeyObj() {
    const key = getCurrentKey();
    return parseScenarioKey(key);
}

export function getRouteForKeyObj(keyObj) {
    const module = keyObj?.module;
    if (typeof module !== 'string') return MODULES.DASHBOARD;

    if (module.startsWith('preflop-')) return MODULES.PREFLOP_TRAINER;
    if (module.startsWith('postflop-')) return MODULES.POSTFLOP_TRAINER;
    if (module === 'multistreet') return MODULES.MULTISTREET_TRAINER;
    if (module === 'cbet-trainer') return MODULES.CBET_TRAINER;
    if (module === 'bet-sizing-trainer') return MODULES.BET_SIZING_TRAINER;
    if (module === 'board-texture-trainer') return MODULES.BOARD_TEXTURE_TRAINER;
    if (module === 'pot-odds-trainer') return MODULES.POT_ODDS_TRAINER;
    return MODULES.DASHBOARD;
}

export function getRouteForKey(key) {
    return getRouteForKeyObj(parseScenarioKey(key));
}

export function incrementSessionStats({ isCorrect, evFeedback }) {
    const s = getActiveSession();
    if (!s) return;
    const next = {
        ...s,
        total: (s.total || 0) + 1,
        correct: (s.correct || 0) + (isCorrect ? 1 : 0),
        evLostBb: (s.evLostBb || 0) + (evFeedback?.evLossBb || 0)
    };
    storage.set(STORAGE_KEYS.SRS_ACTIVE, next);
}

export function advanceSession() {
    const s = getActiveSession();
    if (!s) return { done: true, nextKey: null, nextKeyObj: null, nextRoute: MODULES.DASHBOARD };

    const nextIndex = s.index + 1;
    if (nextIndex >= s.keys.length) {
        const summary = { total: s.total || 0, correct: s.correct || 0, evLostBb: s.evLostBb || 0 };
        stopSession();
        showToast(
            `Smart Practice complete: ${summary.correct}/${summary.total} correct, EV lost ${summary.evLostBb.toFixed(1)}bb`,
            'success',
            5000
        );
        return { done: true, nextKey: null, nextKeyObj: null, nextRoute: MODULES.DASHBOARD };
    }

    const nextKey = s.keys[nextIndex];
    const nextKeyObj = parseScenarioKey(nextKey);
    const nextRoute = getRouteForKeyObj(nextKeyObj);
    storage.set(STORAGE_KEYS.SRS_ACTIVE, { ...s, index: nextIndex });
    storage.set(STORAGE_KEYS.SRS_AUTOSTART, true);
    return { done: false, nextKey, nextKeyObj, nextRoute };
}

export function navigateToCurrentKeyRoute() {
    const keyObj = getCurrentKeyObj();
    const route = getRouteForKeyObj(keyObj);
    router.navigate(route);
}
