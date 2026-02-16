// Poker shortcut handler manager
//
// Trainers dispatch keyboard actions via the custom `poker-shortcut` event (see app.js).
// Historically, each trainer added its own `document.addEventListener('poker-shortcut', ...)`
// which could leak/stack across navigations.
//
// This module installs ONE global listener and allows modules to swap the active handler.

let listenerInstalled = false;
let activeHandler = null;

function ensureListenerInstalled() {
    if (listenerInstalled) return;

    document.addEventListener('poker-shortcut', (e) => {
        if (typeof activeHandler !== 'function') return;
        try {
            activeHandler(e);
        } catch (err) {
            console.error('Error in poker-shortcut handler:', err);
        }
    });

    listenerInstalled = true;
}

/**
 * Replace the active shortcut handler.
 * @param {(e: CustomEvent) => void} handler
 */
export function setPokerShortcutHandler(handler) {
    ensureListenerInstalled();
    activeHandler = handler;
}

/**
 * Clear the active shortcut handler.
 */
export function clearPokerShortcutHandler() {
    activeHandler = null;
}

export default {
    setPokerShortcutHandler,
    clearPokerShortcutHandler
};
