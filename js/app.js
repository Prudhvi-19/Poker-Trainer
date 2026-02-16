// Main Application Entry Point

import router from './router.js';
import { MODULES } from './utils/constants.js';
import storage from './utils/storage.js';
import { initNavigation, setActiveNavItem, updateStreakDisplay } from './components/Navigation.js';
import { showToast } from './utils/helpers.js';
import { showAlert, showConfirm } from './components/Modal.js';
import { maybeResumeSmartPractice } from './utils/smartPracticeSession.js';

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

// Postflop trainers
import boardTextureTrainer from './modules/boardTextureTrainer.js';
import cbetTrainer from './modules/cbetTrainer.js';
import betSizingTrainer from './modules/betSizingTrainer.js';
import potOddsTrainer from './modules/potOddsTrainer.js';

/**
 * Initialize the application
 */
function init() {
    console.log('🃏 GTO Poker Trainer - Initializing...');

    // ENH-003: Register PWA service worker (GitHub Pages + local static hosting)
    registerServiceWorker();

    // BUG-035: Provide an install UX (where supported) instead of relying on browser menus.
    initPwaInstallPrompt();

    // BUG-046: show online/offline status.
    initConnectivityIndicator();

    // BUG-045: resume smart practice if user refreshes mid-session.
    maybeResumeSmartPractice();

    // Global error handler for uncaught errors
    window.addEventListener('error', (event) => {
        console.error('Global error caught:', event.error);
        // Don't show error UI for every error, router handles module errors
        // This is just a safety net for unexpected errors
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault(); // Prevent console spam
    });

    // Initialize streak tracking
    const streak = storage.updateStreak();
    updateStreakDisplay(streak.current);

    // Initialize navigation
    initNavigation((moduleId) => {
        router.navigate(moduleId);
    });

    // Initialize router (sets up hashchange listener, but does NOT handle initial route yet)
    router.init('view-container');

    // Register all routes BEFORE starting the router
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

    // Postflop trainers
    router.register(MODULES.BOARD_TEXTURE_TRAINER, boardTextureTrainer.render);
    router.register(MODULES.CBET_TRAINER, cbetTrainer.render);
    router.register(MODULES.BET_SIZING_TRAINER, betSizingTrainer.render);
    router.register(MODULES.POT_ODDS_TRAINER, potOddsTrainer.render);

    // Now start routing (all routes registered, safe to handle initial route)
    router.start();

    // Update navigation active state on route change
    // NOTE: This listener persists for app lifetime (intentional, not a memory leak)
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

// --- BUG-046: Offline indicator ---

function ensureConnectivityBadge() {
    const footer = document.querySelector('.sidebar-footer');
    if (!footer) return null;

    let badge = document.getElementById('connectivity-badge');
    if (badge) return badge;

    badge = document.createElement('div');
    badge.id = 'connectivity-badge';
    badge.className = 'connectivity-badge';
    badge.style.marginTop = '0.5rem';
    badge.style.fontSize = '0.85rem';
    badge.style.color = 'var(--color-text-secondary)';
    badge.style.textAlign = 'center';
    footer.appendChild(badge);
    return badge;
}

function initConnectivityIndicator() {
    const badge = ensureConnectivityBadge();
    if (!badge) return;

    const render = () => {
        const online = navigator.onLine;
        badge.textContent = online ? '● Online' : '● Offline';
        badge.style.color = online ? 'var(--color-text-secondary)' : 'var(--color-warning)';
    };

    window.addEventListener('online', render);
    window.addEventListener('offline', render);
    render();
}

function registerServiceWorker() {
    try {
        if (!('serviceWorker' in navigator)) return;
        const hadControllerAtStart = !!navigator.serviceWorker.controller;
        // Service workers require a secure context (https) OR localhost.
        const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        const isSecure = location.protocol === 'https:';
        if (!isSecure && !isLocalhost) return;

        navigator.serviceWorker.register('./service-worker.js')
            .then((reg) => {
                // Optional: listen for updates.
                reg.addEventListener?.('updatefound', () => {
                    const newWorker = reg.installing;
                    if (!newWorker) return;
                    newWorker.addEventListener('statechange', () => {
                        // BUG-036: notify users when a new service worker version is available.
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            promptForRefreshOnce();
                        }
                    });
                });

                // Also handle the common "waiting" case (when skipWaiting isn't used).
                if (reg.waiting && navigator.serviceWorker.controller) {
                    promptForRefreshOnce();
                }

                // If controller changes, a new SW has taken over; prompt to reload to get new JS.
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    // Avoid showing an "Update available" dialog on the very first install.
                    if (!hadControllerAtStart) return;
                    promptForRefreshOnce({ controllerChanged: true });
                });
            })
            .catch((err) => {
                console.warn('[pwa] service worker registration failed:', err);
            });
    } catch (e) {
        console.warn('[pwa] service worker registration error:', e);
    }
}

// --- BUG-035: Install prompt UX ---

let deferredInstallPrompt = null;

function isStandaloneMode() {
    const isStandalone = window.matchMedia?.('(display-mode: standalone)')?.matches;
    const isIosStandalone = window.navigator.standalone === true; // iOS Safari
    return !!(isStandalone || isIosStandalone);
}

function isIosSafari() {
    const ua = navigator.userAgent || '';
    const isIos = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
    return isIos && isSafari;
}

function ensureInstallButton() {
    const footer = document.querySelector('.sidebar-footer');
    if (!footer) return null;

    let btn = document.getElementById('pwa-install-btn');
    if (btn) return btn;

    btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.className = 'btn btn-secondary btn-sm';
    btn.textContent = '⬇️ Install App';
    btn.style.marginTop = '0.75rem';
    btn.style.width = '100%';
    btn.style.display = 'none';
    footer.appendChild(btn);

    btn.addEventListener('click', async () => {
        // iOS doesn't support beforeinstallprompt.
        if (!deferredInstallPrompt) {
            if (isIosSafari() && !isStandaloneMode()) {
                showAlert({
                    title: 'Install on iPhone/iPad',
                    type: 'info',
                    message: 'To install: tap the Share button in Safari, then choose “Add to Home Screen”.'
                });
            }
            return;
        }

        try {
            deferredInstallPrompt.prompt();
            const choice = await deferredInstallPrompt.userChoice;
            if (choice?.outcome === 'accepted') {
                showToast('Installing…', 'success', 2500);
            }
        } catch (e) {
            console.warn('[pwa] install prompt failed:', e);
        } finally {
            deferredInstallPrompt = null;
            // Hide after use; it will re-appear if browser fires prompt event again.
            btn.style.display = 'none';
        }
    });

    return btn;
}

function showInstallButtonIfAvailable() {
    const btn = ensureInstallButton();
    if (!btn) return;
    if (isStandaloneMode()) {
        btn.style.display = 'none';
        return;
    }
    // Show when we have a deferred prompt, or for iOS Safari where we can show instructions.
    if (deferredInstallPrompt || isIosSafari()) {
        btn.style.display = 'inline-flex';
    } else {
        btn.style.display = 'none';
    }
}

function initPwaInstallPrompt() {
    // iOS Safari won't fire beforeinstallprompt, but we can still show instructions.
    showInstallButtonIfAvailable();

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar and save the event so we can trigger it via UI.
        e.preventDefault();
        deferredInstallPrompt = e;
        showInstallButtonIfAvailable();
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        showInstallButtonIfAvailable();
        showToast('App installed!', 'success', 3000);
    });
}

// --- BUG-036: Service worker update notification ---

let hasPromptedForRefresh = false;

function promptForRefreshOnce(meta = null) {
    if (hasPromptedForRefresh) return;
    hasPromptedForRefresh = true;

    // Prefer a modal so the user has a clear action.
    showConfirm({
        title: 'Update available',
        message: 'A new version of the app is available. Reload to update now?',
        confirmText: 'Reload',
        cancelText: 'Later',
        onConfirm: () => {
            // A hard reload is simplest for a static app.
            window.location.reload();
        },
        onCancel: () => {
            // Allow prompting again on the next update.
            hasPromptedForRefresh = false;
            if (meta?.controllerChanged) {
                showToast('App updated in background. Reload when convenient.', 'info', 5000);
            }
        }
    });
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

        const allowed = Object.keys(fontSizes);
        if (!allowed.includes(savedSettings.fontSize)) {
            // BUG-023: Reset invalid stored values and inform the user.
            const normalized = { ...savedSettings, fontSize: 'medium' };
            storage.saveSettings(normalized);
            document.documentElement.style.fontSize = fontSizes.medium;
            showToast('Your font size setting was invalid and has been reset to Medium.', 'warning', 5000);
        } else {
            document.documentElement.style.fontSize = fontSizes[savedSettings.fontSize] || '16px';
        }
    }
}

/**
 * Initialize global keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs or when modal is open
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' ||
            e.target.tagName === 'SELECT' || document.querySelector('.modal-overlay')) {
            return;
        }

        const key = e.key.toLowerCase();

        // BUG-015: If a button inside a feedback panel is focused, let Space trigger
        // the button click naturally (do NOT also dispatch a poker-shortcut).
        if (key === ' ' && document.activeElement?.tagName === 'BUTTON') {
            const inFeedback = document.activeElement.closest?.('.feedback-panel');
            if (inFeedback) {
                return;
            }
        }

        // Dispatch custom events for keyboard shortcuts
        switch (key) {
            // Postflop trainers often describe B=Bet. Map it to the same action as raise/bet.
            case 'b':
                document.dispatchEvent(new CustomEvent('poker-shortcut', { detail: { action: 'raise' } }));
                break;
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
