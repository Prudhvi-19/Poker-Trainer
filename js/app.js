// Main Application Entry Point

import router from './router.js';
import { MODULES } from './utils/constants.js';
import storage from './utils/storage.js';
import { initNavigation, setActiveNavItem, updateStreakDisplay } from './components/Navigation.js';

// Import all modules
import dashboard from './modules/dashboard.js';
import preflopTrainer from './modules/preflopTrainer.js';
import postflopTrainer from './modules/postflopTrainer.js';
import multistreetTrainer from './modules/multistreetTrainer.js';
import equityCalculator from './modules/equityCalculator.js';
import handReplayer from './modules/handReplayer.js';
import rangeVisualizer from './modules/rangeVisualizer.js';
import charts from './modules/charts.js';
import scenarios from './modules/scenarios.js';
import concepts from './modules/concepts.js';
import sessionHistory from './modules/sessionHistory.js';
import settings from './modules/settings.js';

/**
 * Initialize the application
 */
function init() {
    console.log('🃏 GTO Poker Trainer - Initializing...');

    // Initialize streak tracking
    const streak = storage.updateStreak();
    updateStreakDisplay(streak.current);

    // Initialize navigation
    initNavigation((moduleId) => {
        router.navigate(moduleId);
    });

    // Initialize router
    router.init('view-container');

    // Register all routes
    router.register(MODULES.DASHBOARD, dashboard.render);
    router.register(MODULES.PREFLOP_TRAINER, preflopTrainer.render);
    router.register(MODULES.POSTFLOP_TRAINER, postflopTrainer.render);
    router.register(MODULES.MULTISTREET_TRAINER, multistreetTrainer.render);
    router.register(MODULES.EQUITY_CALCULATOR, equityCalculator.render);
    router.register(MODULES.HAND_REPLAYER, handReplayer.render);
    router.register(MODULES.RANGE_VISUALIZER, rangeVisualizer.render);
    router.register(MODULES.CHARTS, charts.render);
    router.register(MODULES.SCENARIOS, scenarios.render);
    router.register(MODULES.CONCEPTS, concepts.render);
    router.register(MODULES.HISTORY, sessionHistory.render);
    router.register(MODULES.SETTINGS, settings.render);

    // Update navigation active state on route change
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || MODULES.DASHBOARD;
        setActiveNavItem(hash);
    });

    // Set initial active state
    const initialModule = window.location.hash.slice(1) || MODULES.DASHBOARD;
    setActiveNavItem(initialModule);

    // Apply saved settings
    applySettings();

    // Initialize keyboard shortcuts
    initKeyboardShortcuts();

    console.log('✅ GTO Poker Trainer - Ready!');
}

/**
 * Apply saved settings to the app
 */
function applySettings() {
    const savedSettings = storage.getSettings();

    // Apply theme
    if (savedSettings.theme) {
        document.documentElement.setAttribute('data-theme', savedSettings.theme);
    }

    // Apply deck style
    if (savedSettings.deckStyle) {
        document.documentElement.setAttribute('data-deck-style', savedSettings.deckStyle);
    }

    // Apply font size
    if (savedSettings.fontSize) {
        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        document.documentElement.style.fontSize = fontSizes[savedSettings.fontSize] || '16px';
    }
}

/**
 * Initialize global keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }

        const key = e.key.toLowerCase();

        // Dispatch custom events for keyboard shortcuts
        switch (key) {
            case 'r':
                document.dispatchEvent(new CustomEvent('poker-shortcut', { detail: { action: 'raise' } }));
                break;
            case 'c':
                document.dispatchEvent(new CustomEvent('poker-shortcut', { detail: { action: 'call' } }));
                break;
            case 'f':
                document.dispatchEvent(new CustomEvent('poker-shortcut', { detail: { action: 'fold' } }));
                break;
            case ' ':
                e.preventDefault();
                document.dispatchEvent(new CustomEvent('poker-shortcut', { detail: { action: 'next' } }));
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                document.dispatchEvent(new CustomEvent('poker-shortcut', { detail: { action: 'bet-size', value: parseInt(key) } }));
                break;
        }
    });
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.PokerTrainer = {
    router,
    storage,
    version: '1.0.0'
};
