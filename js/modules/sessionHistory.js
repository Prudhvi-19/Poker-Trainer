// Session History Module

import storage from '../utils/storage.js';
import stats from '../utils/stats.js';
import { formatDate, formatTime, formatPercentage, downloadJSON } from '../utils/helpers.js';
import { showConfirm, showModal } from '../components/Modal.js';

function render() {
    const container = document.createElement('div');

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '2rem';

    const title = document.createElement('h1');
    title.textContent = '📜 Session History';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-secondary';
    exportBtn.textContent = '📥 Export Data';
    exportBtn.addEventListener('click', exportData);

    header.appendChild(title);
    header.appendChild(exportBtn);

    container.appendChild(header);

    // Stats overview
    const statsOverview = createStatsOverview();
    container.appendChild(statsOverview);

    // Sessions list
    const sessionsList = createSessionsList();
    container.appendChild(sessionsList);

    return container;
}

function createStatsOverview() {
    const section = document.createElement('div');
    section.className = 'card mb-lg';

    const overallStats = stats.getOverallStats();

    section.innerHTML = `
        <h2 style="margin-bottom: 1.5rem;">Overall Performance</h2>
        <div class="grid grid-3">
            <div class="card-hover" style="text-align: center; padding: 1.5rem; background: var(--color-bg-tertiary); border-radius: 8px;">
                <div style="font-size: 2rem; font-weight: bold;">${overallStats.totalHands}</div>
                <div style="color: var(--color-text-secondary);">Total Hands</div>
            </div>
            <div class="card-hover" style="text-align: center; padding: 1.5rem; background: var(--color-bg-tertiary); border-radius: 8px;">
                <div style="font-size: 2rem; font-weight: bold; color: var(--color-success);">
                    ${overallStats.totalHands > 0 ? formatPercentage(overallStats.accuracy, 0) : '-'}
                </div>
                <div style="color: var(--color-text-secondary);">Overall Accuracy</div>
            </div>
            <div class="card-hover" style="text-align: center; padding: 1.5rem; background: var(--color-bg-tertiary); border-radius: 8px;">
                <div style="font-size: 2rem; font-weight: bold;">${overallStats.totalSessions}</div>
                <div style="color: var(--color-text-secondary);">Total Sessions</div>
            </div>
        </div>
    `;

    return section;
}

function createSessionsList() {
    const section = document.createElement('div');
    section.className = 'card';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '1.5rem';

    const title = document.createElement('h2');
    title.textContent = 'All Sessions';
    title.style.margin = '0';

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-danger btn-sm';
    clearBtn.textContent = 'Clear History';
    clearBtn.addEventListener('click', clearHistory);

    header.appendChild(title);
    header.appendChild(clearBtn);

    section.appendChild(header);

    const sessions = storage.getSessions();

    if (sessions.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-muted';
        empty.textContent = 'No sessions yet. Start practicing to build your history!';
        section.appendChild(empty);
        return section;
    }

    const list = document.createElement('div');
    list.className = 'session-list';

    sessions.forEach(session => {
        const item = createSessionItem(session);
        list.appendChild(item);
    });

    section.appendChild(list);

    return section;
}

function createSessionItem(session) {
    const item = document.createElement('div');
    item.className = 'session-item';

    const sessionStats = stats.calculateSessionStats(session.results);

    const info = document.createElement('div');
    info.className = 'session-info';

    const date = document.createElement('div');
    date.className = 'session-date';
    date.textContent = `${formatDate(session.startTime)} at ${formatTime(session.startTime)}`;

    const module = document.createElement('div');
    module.className = 'session-module';
    module.textContent = session.module;

    const statsLine = document.createElement('div');
    statsLine.className = 'session-stats-inline';
    statsLine.textContent = `${sessionStats.totalHands} hands • ${sessionStats.correct} correct • ${sessionStats.incorrect} incorrect`;

    info.appendChild(date);
    info.appendChild(module);
    info.appendChild(statsLine);

    const accuracy = document.createElement('div');
    accuracy.className = `session-accuracy${sessionStats.accuracy >= 0.7 ? ' text-success' : sessionStats.accuracy >= 0.5 ? ' text-warning' : ' text-error'}`;
    accuracy.textContent = formatPercentage(sessionStats.accuracy, 0);

    item.appendChild(info);
    item.appendChild(accuracy);

    item.addEventListener('click', () => showSessionDetail(session));

    return item;
}

function showSessionDetail(session) {
    const sessionStats = stats.calculateSessionStats(session.results);

    const content = document.createElement('div');

    content.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h3>${session.module}</h3>
            <div style="color: var(--color-text-secondary); margin-top: 0.5rem;">
                ${formatDate(session.startTime)} at ${formatTime(session.startTime)}
            </div>
        </div>

        <div class="grid grid-3" style="margin-bottom: 1.5rem;">
            <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold;">${sessionStats.totalHands}</div>
                <div style="color: var(--color-text-secondary); font-size: 0.875rem;">Hands</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--color-success);">
                    ${formatPercentage(sessionStats.accuracy, 0)}
                </div>
                <div style="color: var(--color-text-secondary); font-size: 0.875rem;">Accuracy</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold;">
                    ${sessionStats.averageResponseTime.toFixed(0)}ms
                </div>
                <div style="color: var(--color-text-secondary); font-size: 0.875rem;">Avg Time</div>
            </div>
        </div>

        <h4 style="margin-bottom: 1rem;">Hand Results</h4>
        <div style="max-height: 400px; overflow-y: auto;">
            <table class="table">
                <thead>
                    <tr>
                        <th>Hand</th>
                        <th>Your Answer</th>
                        <th>Correct</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    ${session.results.map(result => `
                        <tr>
                            <td>${result.scenario.hand?.display || 'N/A'}</td>
                            <td>${result.userAnswer}</td>
                            <td>${result.correctAnswer}</td>
                            <td>${result.isCorrect ?
                                '<span class="badge badge-success">✓</span>' :
                                '<span class="badge badge-error">✗</span>'
                            }</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    showModal({
        title: 'Session Details',
        content,
        buttons: [
            {
                text: 'Close',
                className: 'btn btn-secondary'
            }
        ]
    });
}

function clearHistory() {
    showConfirm({
        title: 'Clear History',
        message: 'Are you sure you want to delete all session history? This cannot be undone.',
        confirmText: 'Delete All',
        onConfirm: () => {
            storage.set('poker_trainer_sessions', []);
            location.reload();
        }
    });
}

function exportData() {
    const data = storage.exportData();
    downloadJSON(data, `poker-trainer-export-${Date.now()}.json`);
}

export default {
    render
};
