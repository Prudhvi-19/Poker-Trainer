// localStorage wrapper with error handling and default values

import { STORAGE_KEYS, DEFAULT_SETTINGS } from './constants.js';

class Storage {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
            return false;
        }
    }

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // Specific data access methods
    getSettings() {
        return this.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }

    saveSettings(settings) {
        return this.set(STORAGE_KEYS.SETTINGS, settings);
    }

    getSessions() {
        return this.get(STORAGE_KEYS.SESSIONS, []);
    }

    saveSession(session) {
        const sessions = this.getSessions();

        // Check if session already exists (by ID)
        const existingIndex = sessions.findIndex(s => s.id === session.id);
        if (existingIndex !== -1) {
            // Update existing session
            sessions[existingIndex] = session;
        } else {
            // Add new session to beginning
            sessions.unshift(session);
        }

        // Keep only last 100 sessions
        if (sessions.length > 100) {
            sessions.length = 100;
        }
        return this.set(STORAGE_KEYS.SESSIONS, sessions);
    }

    getProgress() {
        return this.get(STORAGE_KEYS.PROGRESS, {
            totalHands: 0,
            correctAnswers: 0,
            byModule: {},
            byPosition: {},
            weaknesses: [],
            studiedConcepts: [],
            studiedScenarios: []
        });
    }

    saveProgress(progress) {
        return this.set(STORAGE_KEYS.PROGRESS, progress);
    }

    updateProgress(updates) {
        const progress = this.getProgress();
        const updatedProgress = { ...progress, ...updates };
        return this.saveProgress(updatedProgress);
    }

    getCustomRanges() {
        return this.get(STORAGE_KEYS.CUSTOM_RANGES, []);
    }

    saveCustomRange(range) {
        const ranges = this.getCustomRanges();
        ranges.push(range);
        return this.set(STORAGE_KEYS.CUSTOM_RANGES, ranges);
    }

    deleteCustomRange(rangeId) {
        const ranges = this.getCustomRanges();
        const filtered = ranges.filter(r => r.id !== rangeId);
        return this.set(STORAGE_KEYS.CUSTOM_RANGES, filtered);
    }

    getStreak() {
        return this.get(STORAGE_KEYS.STREAK, {
            current: 0,
            longest: 0,
            lastVisit: null
        });
    }

    updateStreak() {
        const streak = this.getStreak();
        const today = new Date().toDateString();
        const lastVisit = streak.lastVisit;

        if (!lastVisit) {
            // First visit
            streak.current = 1;
            streak.longest = 1;
        } else {
            const lastDate = new Date(lastVisit).toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (lastDate === today) {
                // Already visited today, no change
                return streak;
            } else if (lastDate === yesterday) {
                // Visited yesterday, increment streak
                streak.current += 1;
                streak.longest = Math.max(streak.longest, streak.current);
            } else {
                // Streak broken
                streak.current = 1;
            }
        }

        streak.lastVisit = new Date().toISOString();
        this.set(STORAGE_KEYS.STREAK, streak);
        return streak;
    }

    // Export all data
    exportData() {
        return {
            sessions: this.getSessions(),
            settings: this.getSettings(),
            progress: this.getProgress(),
            customRanges: this.getCustomRanges(),
            streak: this.getStreak(),
            exportDate: new Date().toISOString()
        };
    }

    // Import data
    importData(data) {
        try {
            if (data.sessions) this.set(STORAGE_KEYS.SESSIONS, data.sessions);
            if (data.settings) this.set(STORAGE_KEYS.SETTINGS, data.settings);
            if (data.progress) this.set(STORAGE_KEYS.PROGRESS, data.progress);
            if (data.customRanges) this.set(STORAGE_KEYS.CUSTOM_RANGES, data.customRanges);
            if (data.streak) this.set(STORAGE_KEYS.STREAK, data.streak);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Reset all data
    resetAll() {
        return this.clear();
    }
}

export default new Storage();
