// Client-side Router

import { MODULES } from './utils/constants.js';
import { scrollToTop } from './utils/helpers.js';

class Router {
    constructor() {
        this.routes = {};
        this.currentModule = null;
        this.container = null;
        this.hashChangeHandler = null;
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

        // Handle initial route
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
        const module = hash || MODULES.DASHBOARD; // Default to dashboard

        console.log(`🔍 Looking for route: "${module}"`);
        console.log(`📋 Available routes:`, Object.keys(this.routes));

        // Check if route exists
        if (!this.routes[module]) {
            console.warn(`❌ Route not found: ${module}`);
            this.navigate(MODULES.DASHBOARD);
            return;
        }

        console.log(`✅ Route found: ${module}`);

        // Call the route handler
        try {
            this.currentModule = module;

            // Clear container
            this.container.innerHTML = '';

            // Show loading
            this.container.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="spinner"></div></div>';

            // Get module content
            const content = await this.routes[module]();

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
            console.error(`Error loading module ${module}:`, error);
            this.container.innerHTML = `
                <div class="card" style="text-align: center; padding: 2rem;">
                    <h2>⚠️ Error Loading Module</h2>
                    <p>Sorry, there was an error loading this module.</p>
                    <p class="text-muted">${error.message}</p>
                    <button class="btn btn-primary" onclick="window.location.hash='dashboard'">
                        Go to Dashboard
                    </button>
                </div>
            `;
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
