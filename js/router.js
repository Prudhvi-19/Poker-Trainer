// Client-side Router

import { MODULES } from './utils/constants.js';
import { scrollToTop } from './utils/helpers.js';
import { clearPokerShortcutHandler } from './utils/shortcutManager.js';

class Router {
    constructor() {
        this.routes = {};
        this.currentModule = null;
        this.container = null;
        this.hashChangeHandler = null;
        this._routeGeneration = 0; // Guard against concurrent route handling
    }

    /**
     * Initialize the router
     * @param {string} containerId - ID of the container element for views
     */
    init(containerId = 'view-container') {
        this.container = document.getElementById(containerId);

        if (!this.container) {
            console.error(`Container element #${containerId} not found`);
            return;
        }

        // Listen for hash changes
        // Store handler reference for potential cleanup
        this.hashChangeHandler = () => this.handleRoute();
        window.addEventListener('hashchange', this.hashChangeHandler);

        // NOTE: Do NOT call handleRoute() here. Routes are not registered yet.
        // The caller (app.js) must call router.start() after all routes are registered.
    }

    /**
     * Start routing after all routes have been registered
     */
    start() {
        this.handleRoute();
    }

    /**
     * Register a route
     * @param {string} module - Module ID
     * @param {Function} handler - Function that returns HTML or renders the module
     */
    register(module, handler) {
        this.routes[module] = handler;
        console.log(`✅ Registered route: ${module}`);
    }

    /**
     * Navigate to a module
     * @param {string} module - Module ID to navigate to
     */
    navigate(module) {
        window.location.hash = module;
    }

    /**
     * Handle route change
     */
    async handleRoute() {
        const hash = window.location.hash.slice(1); // Remove '#'
        // Support simple subroutes like "concepts/4betting".
        // The module is always the first segment.
        const [moduleSegment] = (hash || '').split('/');
        const module = moduleSegment || MODULES.DASHBOARD; // Default to dashboard

        // Ensure shortcuts never leak from a previous module.
        // Trainers will re-register a handler during render.
        clearPokerShortcutHandler();

        // Check if route exists
        if (!this.routes[module]) {
            this.navigate(MODULES.DASHBOARD);
            return;
        }

        // Guard against concurrent route handling (rapid navigation)
        const generation = ++this._routeGeneration;

        // Call the route handler
        try {
            this.currentModule = module;

            // Show loading
            this.container.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="spinner"></div></div>';

            // Get module content (handler can inspect window.location.hash for subroutes)
            const content = await this.routes[module]({ hash });

            // If another route was triggered while we were loading, abort
            if (generation !== this._routeGeneration) return;

            // Clear loading and render content
            this.container.innerHTML = '';

            if (typeof content === 'string') {
                this.container.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                this.container.appendChild(content);
            }

            // Scroll to top
            scrollToTop(true);

        } catch (error) {
            // If another route was triggered, don't show error for stale route
            if (generation !== this._routeGeneration) return;

            console.error(`Error loading module ${module}:`, error);
            // Safely escape error message to prevent XSS
            const errorMsg = document.createElement('p');
            errorMsg.className = 'text-muted';
            errorMsg.textContent = error.message;

            const errorCard = document.createElement('div');
            errorCard.className = 'card';
            errorCard.style.textAlign = 'center';
            errorCard.style.padding = '2rem';

            const heading = document.createElement('h2');
            heading.textContent = 'Error Loading Module';
            errorCard.appendChild(heading);

            const desc = document.createElement('p');
            desc.textContent = 'Sorry, there was an error loading this module.';
            errorCard.appendChild(desc);
            errorCard.appendChild(errorMsg);

            const btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            btn.textContent = 'Go to Dashboard';
            btn.addEventListener('click', () => { window.location.hash = 'dashboard'; });
            errorCard.appendChild(btn);

            this.container.innerHTML = '';
            this.container.appendChild(errorCard);
        }
    }

    /**
     * Get current active module
     * @returns {string} Current module ID
     */
    getCurrentModule() {
        return this.currentModule;
    }

    /**
     * Refresh current route
     */
    refresh() {
        this.handleRoute();
    }

    /**
     * Cleanup router (remove event listeners)
     */
    cleanup() {
        if (this.hashChangeHandler) {
            window.removeEventListener('hashchange', this.hashChangeHandler);
        }
    }
}

// Create singleton instance
const router = new Router();

export default router;
