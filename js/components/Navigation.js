// Navigation Component

import { NAVIGATION_ITEMS } from '../utils/constants.js';

/**
 * Initialize navigation
 * @param {Function} onNavigate - Callback when navigation item is clicked
 */
export function initNavigation(onNavigate) {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    // Accessibility: mark this as a navigation landmark
    nav.setAttribute('role', 'navigation');

    // Create navigation items
    NAVIGATION_ITEMS.forEach(item => {
        const navItem = createNavItem(item, onNavigate);
        nav.appendChild(navItem);
    });

    // Initialize sidebar toggle for mobile
    initSidebarToggle();
}

/**
 * Create a navigation item
 * @param {Object} item - Navigation item config
 * @param {Function} onNavigate - Click handler
 * @returns {HTMLElement} Navigation item element
 */
function createNavItem(item, onNavigate) {
    const li = document.createElement('li');
    li.className = 'nav-item';

    const link = document.createElement('a');
    link.href = `#${item.id}`;
    link.className = 'nav-link';
    link.dataset.module = item.id;
    link.setAttribute('aria-label', `Navigate to ${item.label}`);

    const icon = document.createElement('span');
    icon.className = 'nav-icon';
    icon.textContent = item.icon;

    const label = document.createElement('span');
    label.className = 'nav-label';
    label.textContent = item.label;

    link.appendChild(icon);
    link.appendChild(label);

    // Click handler
    link.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNavItem(item.id);

        if (onNavigate) {
            onNavigate(item.id);
        }

        // Close sidebar on mobile after navigation
        closeSidebarOnMobile();
    });

    li.appendChild(link);
    return li;
}

/**
 * Set active navigation item
 * @param {string} moduleId - Module ID to set as active
 */
export function setActiveNavItem(moduleId) {
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        if (link.dataset.module === moduleId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Get current active module from URL hash
 * @returns {string} Module ID
 */
export function getActiveModule() {
    const hash = window.location.hash.slice(1); // Remove '#'
    return hash || 'dashboard'; // Default to dashboard
}

/**
 * Initialize sidebar toggle for mobile
 */
function initSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });
}

/**
 * Close sidebar on mobile after navigation
 */
function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    }
}

/**
 * Update streak display in sidebar
 * @param {number} streakDays - Number of consecutive days
 */
export function updateStreakDisplay(streakDays) {
    const streakEl = document.getElementById('streak-count');
    if (streakEl) {
        streakEl.textContent = streakDays;
    }
}

export default {
    initNavigation,
    setActiveNavItem,
    getActiveModule,
    updateStreakDisplay
};
