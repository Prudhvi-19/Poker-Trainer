// Statistics calculation utilities

import { calculateAccuracy } from './helpers.js';
import storage from './storage.js';

class Stats {
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
            if (session.results) {
                totalHands += session.results.length;
                correctAnswers += session.results.filter(r => r.isCorrect).length;
            }
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
            if (session.results) {
                totalHands += session.results.length;
                correctAnswers += session.results.filter(r => r.isCorrect).length;

                // By module
                const module = session.module;
                if (!byModule[module]) {
                    byModule[module] = { total: 0, correct: 0 };
                }
                byModule[module].total += session.results.length;
                byModule[module].correct += session.results.filter(r => r.isCorrect).length;

                // By position (if available)
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
            if (session.results) {
                total += session.results.length;
                correct += session.results.filter(r => r.isCorrect).length;
            }
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

            if (session.results) {
                byDate[date].total += session.results.length;
                byDate[date].correct += session.results.filter(r => r.isCorrect).length;
            }
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

        sessions.forEach(session => {
            if (session.results) {
                session.results.forEach(result => {
                    if (!result.isCorrect && result.scenario) {
                        const key = JSON.stringify({
                            hand: result.scenario.hand,
                            position: result.scenario.position,
                            action: result.scenario.action
                        });

                        if (!mistakes[key]) {
                            mistakes[key] = {
                                count: 0,
                                scenario: result.scenario,
                                correctAnswer: result.correctAnswer,
                                commonWrongAnswer: {}
                            };
                        }

                        mistakes[key].count++;

                        // Track common wrong answers
                        const wrongAnswer = result.userAnswer;
                        if (!mistakes[key].commonWrongAnswer[wrongAnswer]) {
                            mistakes[key].commonWrongAnswer[wrongAnswer] = 0;
                        }
                        mistakes[key].commonWrongAnswer[wrongAnswer]++;
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

        const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.accuracy, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.accuracy, 0) / secondHalf.length;

        return secondHalfAvg - firstHalfAvg;
    }
}

export default new Stats();
