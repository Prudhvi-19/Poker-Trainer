// Dashboard Module

import storage from '../utils/storage.js';
import stats from '../utils/stats.js';
import { getRandomQuote, formatPercentage, formatDuration } from '../utils/helpers.js';
import router from '../router.js';
import { MODULES } from '../utils/constants.js';

function render() {
    const container = document.createElement('div');
    container.className = 'dashboard';

    // Welcome section
    const welcome = createWelcomeSection();
    container.appendChild(welcome);

    // Today's stats
    const todayStats = createTodayStats();
    container.appendChild(todayStats);

    // Overall stats
    const overallStats = createOverallStats();
    container.appendChild(overallStats);

    // Weaknesses and recent sessions
    const bottomRow = document.createElement('div');
    bottomRow.className = 'grid grid-2';

    const weaknesses = createWeaknessesWidget();
    const recentSessions = createRecentSessionsWidget();

    bottomRow.appendChild(weaknesses);
    bottomRow.appendChild(recentSessions);

    container.appendChild(bottomRow);

    // Quick start buttons
    const quickStart = createQuickStartSection();
    container.appendChild(quickStart);

    return container;
}

function createWelcomeSection() {
    const section = document.createElement('div');
    section.className = 'card mb-lg';
    section.innerHTML = `
        <div style="text-align: center;">
            <h1 style="margin-bottom: 1rem;">🃏 Welcome to GTO Poker Trainer</h1>
            <p class="text-muted" style="font-size: 1.1rem; font-style: italic;">
                "${getRandomQuote()}"
            </p>
        </div>
    `;
    return section;
}

function createTodayStats() {
    const todayData = stats.getTodayStats();

    const section = document.createElement('div');
    section.className = 'card mb-lg';
    section.innerHTML = `
        <h2 style="margin-bottom: 1.5rem;">📅 Today's Practice</h2>
        <div class="quick-stats">
            <div class="stat-box">
                <div class="stat-value">${todayData.hands}</div>
                <div class="stat-label">Hands Practiced</div>
            </div>
            <div class="stat-box">
                <div class="stat-value${todayData.accuracy > 0 ? ' text-success' : ''}">
                    ${todayData.hands > 0 ? formatPercentage(todayData.accuracy, 0) : '-'}
                </div>
                <div class="stat-label">Accuracy</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${todayData.sessions}</div>
                <div class="stat-label">Sessions</div>
            </div>
        </div>
    `;
    return section;
}

function createOverallStats() {
    const overallData = stats.getOverallStats();
    const totalStudyTime = stats.getTotalStudyTime();

    const section = document.createElement('div');
    section.className = 'card mb-lg';
    section.innerHTML = `
        <h2 style="margin-bottom: 1.5rem;">📊 Overall Statistics</h2>
        <div class="quick-stats">
            <div class="stat-box">
                <div class="stat-value">${overallData.totalHands}</div>
                <div class="stat-label">Total Hands</div>
            </div>
            <div class="stat-box">
                <div class="stat-value${overallData.accuracy > 0 ? ' text-success' : ''}">
                    ${overallData.totalHands > 0 ? formatPercentage(overallData.accuracy, 0) : '-'}
                </div>
                <div class="stat-label">Overall Accuracy</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${overallData.totalSessions}</div>
                <div class="stat-label">Total Sessions</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${formatDuration(totalStudyTime)}</div>
                <div class="stat-label">Study Time</div>
            </div>
        </div>
    `;
    return section;
}

function createWeaknessesWidget() {
    const weaknesses = stats.getWeaknesses(5);

    const section = document.createElement('div');
    section.className = 'card';

    const header = document.createElement('h3');
    header.textContent = '⚠️ Areas to Improve';
    header.style.marginBottom = '1rem';
    section.appendChild(header);

    if (weaknesses.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'text-muted';
        emptyMsg.textContent = 'Practice more hands to identify weak areas';
        section.appendChild(emptyMsg);
    } else {
        const list = document.createElement('ul');
        list.className = 'weakness-list';

        weaknesses.forEach(weakness => {
            const item = document.createElement('li');
            item.className = 'weakness-item';

            const name = document.createElement('span');
            name.textContent = weakness.name;

            const accuracy = document.createElement('span');
            accuracy.className = 'text-error';
            accuracy.textContent = formatPercentage(weakness.accuracy, 0);

            item.appendChild(name);
            item.appendChild(accuracy);
            list.appendChild(item);
        });

        section.appendChild(list);
    }

    return section;
}

function createRecentSessionsWidget() {
    const recentSessions = stats.getRecentSessions(5);

    const section = document.createElement('div');
    section.className = 'card';

    const header = document.createElement('h3');
    header.textContent = '📜 Recent Sessions';
    header.style.marginBottom = '1rem';
    section.appendChild(header);

    if (recentSessions.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'text-muted';
        emptyMsg.textContent = 'No sessions yet. Start practicing!';
        section.appendChild(emptyMsg);
    } else {
        const list = document.createElement('ul');
        list.style.listStyle = 'none';

        recentSessions.forEach(session => {
            const item = document.createElement('li');
            item.style.padding = '0.5rem 0';
            item.style.borderBottom = '1px solid var(--color-border)';

            // Handle both results format (preflop/postflop) and hands format (multistreet)
            let sessionStats;
            if (session.results) {
                sessionStats = stats.calculateSessionStats(session.results);
            } else {
                const counts = stats._getSessionCounts(session);
                sessionStats = {
                    totalHands: counts.total,
                    correct: counts.correct,
                    accuracy: counts.total > 0 ? counts.correct / counts.total : 0
                };
            }

            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600;">${session.module}</div>
                        <div style="font-size: 0.875rem; color: var(--color-text-secondary);">
                            ${sessionStats.totalHands} hands
                        </div>
                    </div>
                    <div style="font-size: 1.25rem; font-weight: bold;" class="${sessionStats.accuracy >= 0.7 ? 'text-success' : ''}">
                        ${formatPercentage(sessionStats.accuracy, 0)}
                    </div>
                </div>
            `;

            list.appendChild(item);
        });

        section.appendChild(list);
    }

    return section;
}

function createQuickStartSection() {
    const section = document.createElement('div');
    section.className = 'card';

    const header = document.createElement('h2');
    header.textContent = '🚀 Quick Start';
    header.style.marginBottom = '1.5rem';
    section.appendChild(header);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'grid grid-3';
    buttonsContainer.style.gap = '1rem';

    const quickStartButtons = [
        { module: MODULES.PREFLOP_TRAINER, icon: '🎯', label: 'Preflop Trainer' },
        { module: MODULES.CHARTS, icon: '📈', label: 'View Charts' },
        { module: MODULES.RANGE_VISUALIZER, icon: '🎨', label: 'Range Visualizer' },
        { module: MODULES.SCENARIOS, icon: '📚', label: 'Study Scenarios' },
        { module: MODULES.CONCEPTS, icon: '🧠', label: 'Learn Theory' },
        { module: MODULES.HISTORY, icon: '📜', label: 'Session History' }
    ];

    quickStartButtons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'btn btn-secondary';
        button.style.padding = '1.5rem 1rem';
        button.style.fontSize = '1rem';
        button.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${btn.icon}</div>
            <div>${btn.label}</div>
        `;

        button.addEventListener('click', () => {
            router.navigate(btn.module);
        });

        buttonsContainer.appendChild(button);
    });

    section.appendChild(buttonsContainer);

    return section;
}

export default {
    render
};
