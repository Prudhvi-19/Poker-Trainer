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
            if (error.name === 'QuotaExceededError') {
                // Handle storage quota exceeded
                console.warn('localStorage quota exceeded, attempting cleanup...');

                // Try to clean up old sessions
                if (key === STORAGE_KEYS.SESSIONS) {
                    const sessions = this.getSessions();
                    if (sessions.length > 50) {
                        // Keep only 50 most recent sessions
                        sessions.length = 50;
                        try {
                            localStorage.setItem(key, JSON.stringify(sessions));
                            return true;
                        } catch (retryError) {
                            console.error('Failed to save even after cleanup:', retryError);
                            return false;
                        }
                    }
                }

                console.error(`Storage full and cleanup failed for ${key}`);
                return false;
            }

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
        // Only remove poker trainer keys, not ALL localStorage
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing poker trainer data:', error);
            return false;
        }
    }

    // Specific data access methods
    getSettings() {
        // Merge stored settings with DEFAULT_SETTINGS to ensure new keys always exist.
        // Also return a fresh object to prevent mutation of the shared constant.
        const stored = this.get(STORAGE_KEYS.SETTINGS, null);
        return {
            ...DEFAULT_SETTINGS,
            ...(stored && typeof stored === 'object' ? stored : {})
        };
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

        // Keep only configured number of sessions (default 200)
        const settings = this.getSettings();
        const maxSessions = settings.maxStoredSessions || DEFAULT_SETTINGS.maxStoredSessions || 200;
        if (sessions.length > maxSessions) {
            sessions.length = maxSessions;
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
        // Deep merge nested objects instead of shallow spread
        const updatedProgress = { ...progress };
        for (const [key, value] of Object.entries(updates)) {
            if (value && typeof value === 'object' && !Array.isArray(value) && progress[key]) {
                updatedProgress[key] = { ...progress[key], ...value };
            } else {
                updatedProgress[key] = value;
            }
        }
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
            // Compute yesterday using calendar day subtraction (DST-safe)
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterday = yesterdayDate.toDateString();

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
