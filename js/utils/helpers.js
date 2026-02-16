// General helper functions

import { RANKS, SUITS, POKER_QUOTES } from './constants.js';

// Generate unique ID
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// Get random item from array
export function randomItem(array) {
    if (!Array.isArray(array) || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

// Shuffle array
export function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get random poker quote
export function getRandomQuote() {
    return randomItem(POKER_QUOTES);
}

// Format percentage
export function formatPercentage(value, decimals = 1) {
    return `${(value * 100).toFixed(decimals)}%`;
}

// Format date
export function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format time
export function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format duration (milliseconds to minutes/seconds)
export function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
}

// Parse hand notation (e.g., "AKs" -> {rank1: 'A', rank2: 'K', suited: true})
export function parseHand(handString) {
    if (!handString || handString.length < 2) return null;

    const rank1 = handString[0];
    const rank2 = handString[1];
    const suited = handString.endsWith('s');

    return {
        rank1,
        rank2,
        suited,
        display: handString
    };
}

// Format hand object to string (e.g., {rank1: 'A', rank2: 'K', suited: true} -> "AKs")
export function formatHand(hand) {
    if (!hand) return '';

    const { rank1, rank2, suited } = hand;

    // Pair
    if (rank1 === rank2) {
        return `${rank1}${rank2}`;
    }

    // Ensure higher rank comes first
    const r1Index = RANKS.indexOf(rank1);
    const r2Index = RANKS.indexOf(rank2);

    const [first, second] = r1Index < r2Index ? [rank1, rank2] : [rank2, rank1];

    return `${first}${second}${suited ? 's' : 'o'}`;
}

// Check if hand is a pair
export function isPair(hand) {
    return hand.rank1 === hand.rank2;
}

// Check if hand is suited
export function isSuited(hand) {
    return hand.suited === true;
}

// Generate a random card
export function randomCard() {
    const rank = randomItem(RANKS);
    const suit = randomItem(Object.values(SUITS));
    return { rank, suit };
}

// Generate random hand with realistic poker probabilities
export function randomHand() {
    const rank1 = randomItem(RANKS);
    const rank2 = randomItem(RANKS);

    // CRITICAL: Pairs CANNOT be suited - there are only 6 combos (same rank, different suits)
    // Non-pairs: 4 suited combos (same suit) vs 12 offsuit combos (different suits)
    // So suited probability for non-pairs is 4/16 = 25%
    let suited;
    if (rank1 === rank2) {
        // Pairs are NEVER suited
        suited = false;
    } else {
        // Non-pairs: 25% chance of being suited (4 suited combos vs 12 offsuit = 4/16)
        suited = Math.random() < 0.25;
    }

    return {
        rank1,
        rank2,
        suited,
        display: formatHand({ rank1, rank2, suited })
    };
}

// Check if two hands are the same
export function handsEqual(hand1, hand2) {
    if (!hand1 || !hand2) return false;
    return formatHand(hand1) === formatHand(hand2);
}

// Check if position1 is in position (acts after) position2 postflop
export function isInPosition(position1, position2) {
    // Postflop acting order: SB, BB, UTG, HJ, CO, BTN
    // Higher index = acts later = has position
    const postflopOrder = ['SB', 'BB', 'UTG', 'HJ', 'CO', 'BTN'];

    const pos1Index = postflopOrder.indexOf(position1);
    const pos2Index = postflopOrder.indexOf(position2);

    if (pos1Index === -1 || pos2Index === -1) {
        return false;
    }

    // BB is in position vs SB postflop (BB acts after SB)
    return pos1Index > pos2Index;
}

// Debounce function
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Calculate accuracy
export function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return correct / total;
}

// Clamp value between min and max
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Wait for specified milliseconds (for async operations)
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Copy text to clipboard
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

// Download data as JSON file
export function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

// Parse uploaded JSON file
export function parseJSONFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(reader.error);

        reader.readAsText(file);
    });
}

// Create element helper
export function createElement(tag, className = '', attributes = {}) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    Object.keys(attributes).forEach(key => {
        if (key === 'text') {
            element.textContent = attributes[key];
        } else if (key === 'html') {
            element.innerHTML = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });

    return element;
}

// Show toast notification
export function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const toast = createElement('div', `toast ${type}`);
    // Use textContent to prevent XSS from message content
    const iconSpan = createElement('span', 'toast-icon');
    iconSpan.textContent = icons[type] || icons.info;
    const messageSpan = createElement('span', 'toast-message');
    messageSpan.textContent = message;
    const closeBtn = createElement('button', 'toast-close');
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00d7';
    toast.appendChild(iconSpan);
    toast.appendChild(messageSpan);
    toast.appendChild(closeBtn);

    closeBtn.addEventListener('click', () => {
        toast.remove();
    });

    container.appendChild(toast);

    if (duration > 0) {
        setTimeout(() => {
            toast.remove();
        }, duration);
    }
}

// Show/hide loading overlay
export function setLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }
}

// Scroll to top of page
export function scrollToTop(smooth = true) {
    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

// Parse card string to rank and suit (robust parsing)
export function parseCard(cardString) {
    if (!cardString || typeof cardString !== 'string') {
        return null;
    }

    // Card format: ${rank}${suit} where rank is 1 char, suit is 1 unicode char
    const rank = cardString.slice(0, -1);
    const suit = cardString.slice(-1);

    // Validate rank
    if (!RANKS.includes(rank)) {
        return null;
    }

    // Validate suit
    const validSuits = Object.values(SUITS);
    if (!validSuits.includes(suit)) {
        return null;
    }

    return { rank, suit };
}

// Format card from rank and suit to string
export function formatCard(rank, suit) {
    return `${rank}${suit}`;
}

// Parse array of card strings
export function parseCards(cardStrings) {
    if (!Array.isArray(cardStrings)) {
        return [];
    }

    return cardStrings.map(parseCard).filter(card => card !== null);
}
