// Statistics calculation utilities

import { calculateAccuracy } from './helpers.js';
import storage from './storage.js';

class Stats {
    /**
     * Extract total and correct counts from a session, handling both formats:
     * - results format: [{isCorrect, scenario, ...}] (preflop/postflop trainers)
     * - hands format: [{decisions: [{isCorrect, ...}]}] (multistreet trainer)
     */
    _getSessionCounts(session) {
        if (session.results && session.results.length > 0) {
            const total = session.results.length;
            const correct = session.results.filter(r => r.isCorrect).length;
            return { total, correct };
        } else if (session.hands && session.hands.length > 0) {
            let total = 0;
            let correct = 0;
            session.hands.forEach(hand => {
                if (hand.decisions) {
                    total += hand.decisions.length;
                    correct += hand.decisions.filter(d => d.isCorrect).length;
                }
            });
            return { total, correct };
        }
        return { total: 0, correct: 0 };
    }

    /**
     * Public wrapper for extracting total/correct counts from a session.
     * Avoids other modules calling the private `_getSessionCounts` directly.
     */
    getSessionCounts(session) {
        return this._getSessionCounts(session);
    }

    // Get today's practice statistics
    getTodayStats() {
        const sessions = storage.getSessions();
        const today = new Date().toDateString();

        const todaySessions = sessions.filter(session => {
            const sessionDate = new Date(session.startTime).toDateString();
            return sessionDate === today;
        });

        let totalHands = 0;
        let correctAnswers = 0;

        todaySessions.forEach(session => {
            const { total, correct } = this._getSessionCounts(session);
            totalHands += total;
            correctAnswers += correct;
        });

        return {
            hands: totalHands,
            accuracy: calculateAccuracy(correctAnswers, totalHands),
            sessions: todaySessions.length
        };
    }

    // Get overall statistics
    getOverallStats() {
        const sessions = storage.getSessions();
        const progress = storage.getProgress();

        let totalHands = 0;
        let correctAnswers = 0;
        const byModule = {};
        const byPosition = {};

        sessions.forEach(session => {
            const { total, correct } = this._getSessionCounts(session);
            totalHands += total;
            correctAnswers += correct;

            // By module
            const module = session.module;
            if (!byModule[module]) {
                byModule[module] = { total: 0, correct: 0 };
            }
            byModule[module].total += total;
            byModule[module].correct += correct;

            // By position (if available) - results format
            if (session.results) {
                session.results.forEach(result => {
                    if (result.scenario && result.scenario.position) {
                        const pos = result.scenario.position;
                        if (!byPosition[pos]) {
                            byPosition[pos] = { total: 0, correct: 0 };
                        }
                        byPosition[pos].total++;
                        if (result.isCorrect) {
                            byPosition[pos].correct++;
                        }
                    }
                });
            }
            // Multistreet hands don't have position-per-decision, tracked at hand level
            if (session.hands) {
                session.hands.forEach(hand => {
                    if (hand.heroPosition && hand.decisions) {
                        const pos = hand.heroPosition;
                        if (!byPosition[pos]) {
                            byPosition[pos] = { total: 0, correct: 0 };
                        }
                        hand.decisions.forEach(d => {
                            byPosition[pos].total++;
                            if (d.isCorrect) byPosition[pos].correct++;
                        });
                    }
                });
            }
        });

        return {
            totalHands,
            accuracy: calculateAccuracy(correctAnswers, totalHands),
            byModule,
            byPosition,
            totalSessions: sessions.length
        };
    }

    // Calculate accuracy by module
    getModuleAccuracy(module) {
        const sessions = storage.getSessions();
        const moduleSessions = sessions.filter(s => s.module === module);

        let total = 0;
        let correct = 0;

        moduleSessions.forEach(session => {
            const counts = this._getSessionCounts(session);
            total += counts.total;
            correct += counts.correct;
        });

        return {
            total,
            correct,
            accuracy: calculateAccuracy(correct, total)
        };
    }

    // Calculate accuracy by position
    getPositionAccuracy(position) {
        const sessions = storage.getSessions();

        let total = 0;
        let correct = 0;

        sessions.forEach(session => {
            if (session.results) {
                session.results.forEach(result => {
                    if (result.scenario && result.scenario.position === position) {
                        total++;
                        if (result.isCorrect) correct++;
                    }
                });
            }
        });

        return {
            total,
            correct,
            accuracy: calculateAccuracy(correct, total)
        };
    }

    // Identify weakest areas
    getWeaknesses(limit = 5) {
        const stats = this.getOverallStats();
        const weaknesses = [];

        // Analyze by module
        Object.keys(stats.byModule).forEach(module => {
            const data = stats.byModule[module];
            if (data.total >= 10) { // Only include if enough data
                weaknesses.push({
                    type: 'module',
                    name: module,
                    accuracy: calculateAccuracy(data.correct, data.total),
                    total: data.total
                });
            }
        });

        // Analyze by position
        Object.keys(stats.byPosition).forEach(position => {
            const data = stats.byPosition[position];
            if (data.total >= 10) { // Only include if enough data
                weaknesses.push({
                    type: 'position',
                    name: position,
                    accuracy: calculateAccuracy(data.correct, data.total),
                    total: data.total
                });
            }
        });

        // Sort by accuracy (lowest first) and return top N
        weaknesses.sort((a, b) => a.accuracy - b.accuracy);
        return weaknesses.slice(0, limit);
    }

    // Get accuracy trend over time
    getAccuracyTrend(days = 30) {
        const sessions = storage.getSessions();
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const recentSessions = sessions.filter(session => {
            return new Date(session.startTime) > cutoffDate;
        });

        // Group by date
        const byDate = {};

        recentSessions.forEach(session => {
            const date = new Date(session.startTime).toDateString();

            if (!byDate[date]) {
                byDate[date] = { total: 0, correct: 0 };
            }

            const counts = this._getSessionCounts(session);
            byDate[date].total += counts.total;
            byDate[date].correct += counts.correct;
        });

        // Convert to array and calculate accuracy
        const trend = Object.keys(byDate).map(date => ({
            date,
            accuracy: calculateAccuracy(byDate[date].correct, byDate[date].total),
            total: byDate[date].total
        }));

        // Sort by date
        trend.sort((a, b) => new Date(a.date) - new Date(b.date));

        return trend;
    }

    // Calculate session statistics
    calculateSessionStats(results) {
        if (!results || results.length === 0) {
            return {
                totalHands: 0,
                correct: 0,
                incorrect: 0,
                accuracy: 0,
                averageResponseTime: 0
            };
        }

        const correct = results.filter(r => r.isCorrect).length;
        const totalTime = results.reduce((sum, r) => sum + (r.responseTimeMs || 0), 0);

        return {
            totalHands: results.length,
            correct,
            incorrect: results.length - correct,
            accuracy: calculateAccuracy(correct, results.length),
            averageResponseTime: totalTime / results.length
        };
    }

    // Get common mistakes
    getCommonMistakes(limit = 10) {
        const sessions = storage.getSessions();
        const mistakes = {};

        const trackMistake = (key, scenario, correctAnswer, wrongAnswer) => {
            if (!mistakes[key]) {
                mistakes[key] = {
                    count: 0,
                    scenario,
                    correctAnswer,
                    commonWrongAnswer: {}
                };
            }
            mistakes[key].count++;
            if (!mistakes[key].commonWrongAnswer[wrongAnswer]) {
                mistakes[key].commonWrongAnswer[wrongAnswer] = 0;
            }
            mistakes[key].commonWrongAnswer[wrongAnswer]++;
        };

        sessions.forEach(session => {
            if (session.results) {
                session.results.forEach(result => {
                    if (!result.isCorrect && result.scenario) {
                        const scenario = result.scenario;
                        const key = JSON.stringify({
                            // session.module is the most reliable module identifier we have
                            module: session.module,
                            scenarioType: scenario.type ?? null,
                            position: scenario.position ?? null,
                            villainPosition: scenario.villainPosition ?? null,
                            // Normalize hand identifier across trainers
                            hand: scenario.hand?.display ?? scenario.heroHand?.display ?? null,
                            correctAnswer: result.correctAnswer
                        });
                        trackMistake(key, result.scenario, result.correctAnswer, result.userAnswer);
                    }
                });
            }
            if (session.hands) {
                session.hands.forEach(hand => {
                    if (hand.decisions) {
                        hand.decisions.forEach(d => {
                            if (!d.isCorrect) {
                                const key = JSON.stringify({
                                    street: d.street,
                                    position: hand.heroPosition
                                });
                                trackMistake(key, { position: hand.heroPosition, street: d.street }, d.correctAction, d.action);
                            }
                        });
                    }
                });
            }
        });

        // Convert to array and sort by frequency
        const mistakesArray = Object.values(mistakes);
        mistakesArray.sort((a, b) => b.count - a.count);

        return mistakesArray.slice(0, limit);
    }

    // Get total study time
    getTotalStudyTime() {
        const sessions = storage.getSessions();

        let totalMs = 0;

        sessions.forEach(session => {
            if (session.startTime && session.endTime) {
                const duration = new Date(session.endTime) - new Date(session.startTime);
                totalMs += duration;
            }
        });

        return totalMs;
    }

    // Get recent sessions
    getRecentSessions(limit = 5) {
        const sessions = storage.getSessions();
        return sessions.slice(0, limit);
    }

    // Calculate improvement rate
    getImprovementRate(period = 7) {
        const trend = this.getAccuracyTrend(period * 2);

        if (trend.length < 2) {
            return 0;
        }

        const midpoint = Math.floor(trend.length / 2);
        const firstHalf = trend.slice(0, midpoint);
        const secondHalf = trend.slice(midpoint);

        // Safety check: prevent division by zero
        if (firstHalf.length === 0 || secondHalf.length === 0) {
            return 0;
        }

        const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.accuracy, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.accuracy, 0) / secondHalf.length;

        return secondHalfAvg - firstHalfAvg;
    }
}

export default new Stats();
