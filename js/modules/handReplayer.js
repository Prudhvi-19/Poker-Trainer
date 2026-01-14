// Hand Replayer Module
// Review and replay hands from your training sessions

import storage from '../utils/storage.js';
import { createHandDisplay, createCard } from '../components/Card.js';
import { formatPercentage } from '../utils/helpers.js';

let allSessions = [];
let currentSessionIndex = null;
let currentHandIndex = null;

function render() {
    const container = document.createElement('div');
    container.className = 'trainer-container';

    // Header
    const header = document.createElement('div');
    header.className = 'trainer-header';
    header.innerHTML = '<h1>🎬 Hand Replayer</h1><p class="text-muted">Review your training hands and learn from your decisions</p>';
    container.appendChild(header);

    // Load sessions
    allSessions = storage.getSessions().reverse(); // Most recent first

    if (allSessions.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'card';
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = '3rem';
        emptyState.innerHTML = `
            <h2>No Sessions Yet</h2>
            <p class="text-muted" style="margin-top: 1rem;">Complete some training hands to see them here!</p>
            <button class="btn btn-primary" onclick="window.location.hash='preflop-trainer'" style="margin-top: 1.5rem;">
                Start Training
            </button>
        `;
        container.appendChild(emptyState);
        return container;
    }

    // Session selector
    const sessionSelector = createSessionSelector();
    container.appendChild(sessionSelector);

    // Replay area
    const replayArea = document.createElement('div');
    replayArea.id = 'replay-area';
    container.appendChild(replayArea);

    // Auto-select first session
    if (allSessions.length > 0) {
        currentSessionIndex = 0;
        showSession();
    }

    return container;
}

function createSessionSelector() {
    const card = document.createElement('div');
    card.className = 'card mb-lg';

    const label = document.createElement('label');
    label.textContent = 'Select Session:';
    label.style.fontWeight = '600';
    label.style.marginRight = '1rem';
    card.appendChild(label);

    const select = document.createElement('select');
    select.style.padding = '0.5rem 1rem';
    select.style.fontSize = '1rem';
    select.id = 'session-selector';

    allSessions.forEach((session, index) => {
        const option = document.createElement('option');
        option.value = index;

        const date = new Date(session.startTime);
        const moduleLabel = session.module || 'Unknown';
        const accuracy = session.results && session.results.length > 0
            ? formatPercentage(session.results.filter(r => r.isCorrect).length / session.results.length, 0)
            : '0%';

        option.textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${moduleLabel} - ${session.results?.length || 0} hands - ${accuracy} accuracy`;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        currentSessionIndex = parseInt(e.target.value);
        showSession();
    });

    card.appendChild(select);

    return card;
}

function showSession() {
    const replayArea = document.getElementById('replay-area');
    if (!replayArea || currentSessionIndex === null) return;

    replayArea.innerHTML = '';

    const session = allSessions[currentSessionIndex];

    if (!session.results || session.results.length === 0) {
        replayArea.innerHTML = '<div class="card text-center"><p class="text-muted">No hands in this session</p></div>';
        return;
    }

    // Session summary
    const summary = createSessionSummary(session);
    replayArea.appendChild(summary);

    // Hands list
    const handsCard = document.createElement('div');
    handsCard.className = 'card';

    const handsHeader = document.createElement('h2');
    handsHeader.textContent = 'Hands';
    handsHeader.style.marginBottom = '1.5rem';
    handsCard.appendChild(handsHeader);

    session.results.forEach((result, index) => {
        const handItem = createHandItem(result, index);
        handsCard.appendChild(handItem);
    });

    replayArea.appendChild(handsCard);
}

function createSessionSummary(session) {
    const card = document.createElement('div');
    card.className = 'card mb-lg';

    const title = document.createElement('h2');
    title.textContent = 'Session Summary';
    title.style.marginBottom = '1.5rem';
    card.appendChild(title);

    const statsGrid = document.createElement('div');
    statsGrid.className = 'session-stats';

    const totalHands = session.results.length;
    const correct = session.results.filter(r => r.isCorrect).length;
    const accuracy = totalHands > 0 ? correct / totalHands : 0;

    const handsBox = createStatBox(totalHands, 'Total Hands');
    const correctBox = createStatBox(correct, 'Correct');
    const wrongBox = createStatBox(totalHands - correct, 'Incorrect');
    const accuracyBox = createStatBox(formatPercentage(accuracy, 0), 'Accuracy');

    statsGrid.appendChild(handsBox);
    statsGrid.appendChild(correctBox);
    statsGrid.appendChild(wrongBox);
    statsGrid.appendChild(accuracyBox);

    card.appendChild(statsGrid);

    return card;
}

function createStatBox(value, label) {
    const box = document.createElement('div');
    box.className = 'stat-box';

    const valueEl = document.createElement('div');
    valueEl.className = 'stat-value';
    valueEl.textContent = value;

    const labelEl = document.createElement('div');
    labelEl.className = 'stat-label';
    labelEl.textContent = label;

    box.appendChild(valueEl);
    box.appendChild(labelEl);

    return box;
}

function createHandItem(result, index) {
    const item = document.createElement('div');
    item.style.padding = '1rem';
    item.style.marginBottom = '1rem';
    item.style.background = 'var(--color-bg-tertiary)';
    item.style.borderRadius = 'var(--border-radius)';
    item.style.borderLeft = `4px solid ${result.isCorrect ? 'var(--color-success)' : 'var(--color-error)'}`;
    item.style.cursor = 'pointer';
    item.style.transition = 'all 0.2s ease';

    item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--color-bg-secondary)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.background = 'var(--color-bg-tertiary)';
    });

    item.addEventListener('click', () => {
        currentHandIndex = index;
        showHandDetails(result, index);
    });

    // Header row
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.justifyContent = 'space-between';
    headerRow.style.alignItems = 'center';
    headerRow.style.marginBottom = '0.75rem';

    const handNumber = document.createElement('div');
    handNumber.textContent = `Hand #${index + 1}`;
    handNumber.style.fontWeight = '600';
    headerRow.appendChild(handNumber);

    const resultBadge = document.createElement('div');
    resultBadge.textContent = result.isCorrect ? '✅ Correct' : '❌ Incorrect';
    resultBadge.style.color = result.isCorrect ? 'var(--color-success)' : 'var(--color-error)';
    resultBadge.style.fontWeight = '600';
    headerRow.appendChild(resultBadge);

    item.appendChild(headerRow);

    // Hand details row
    const detailsRow = document.createElement('div');
    detailsRow.style.display = 'flex';
    detailsRow.style.gap = '1rem';
    detailsRow.style.fontSize = '0.875rem';
    detailsRow.style.color = 'var(--color-text-secondary)';

    if (result.scenario?.hand) {
        const handDisplay = document.createElement('div');
        handDisplay.textContent = `Hand: ${result.scenario.hand.display}`;
        handDisplay.style.fontWeight = '600';
        handDisplay.style.color = 'var(--color-text-primary)';
        detailsRow.appendChild(handDisplay);
    }

    if (result.scenario?.position) {
        const posDisplay = document.createElement('div');
        posDisplay.textContent = `Position: ${result.scenario.position}`;
        detailsRow.appendChild(posDisplay);
    }

    if (!result.isCorrect) {
        const actionDisplay = document.createElement('div');
        actionDisplay.innerHTML = `Your action: <strong>${result.userAnswer.toUpperCase()}</strong> | GTO: <strong>${result.correctAnswer.toUpperCase()}</strong>`;
        actionDisplay.style.color = 'var(--color-error)';
        detailsRow.appendChild(actionDisplay);
    }

    item.appendChild(detailsRow);

    return item;
}

function showHandDetails(result, index) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.background = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    modal.style.padding = '2rem';

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    const modalCard = document.createElement('div');
    modalCard.className = 'scenario-card';
    modalCard.style.maxWidth = '600px';
    modalCard.style.width = '100%';
    modalCard.style.maxHeight = '80vh';
    modalCard.style.overflow = 'auto';

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '1.5rem';

    const title = document.createElement('h2');
    title.textContent = `Hand #${index + 1}`;
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-secondary';
    closeBtn.textContent = '✕ Close';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    header.appendChild(closeBtn);

    modalCard.appendChild(header);

    // Result badge
    const resultBadge = document.createElement('div');
    resultBadge.className = `feedback-panel ${result.isCorrect ? 'correct' : 'incorrect'}`;
    resultBadge.style.marginBottom = '1.5rem';

    const badgeTitle = document.createElement('div');
    badgeTitle.className = 'feedback-title';
    badgeTitle.textContent = result.isCorrect ? '✅ Correct Decision' : '❌ Incorrect Decision';
    resultBadge.appendChild(badgeTitle);

    modalCard.appendChild(resultBadge);

    // Scenario info
    if (result.scenario) {
        const scenario = result.scenario;

        if (scenario.position) {
            const posDiv = document.createElement('div');
            posDiv.innerHTML = `<strong>Position:</strong> ${scenario.position}`;
            posDiv.style.marginBottom = '0.5rem';
            modalCard.appendChild(posDiv);
        }

        if (scenario.villainPosition) {
            const villainDiv = document.createElement('div');
            villainDiv.innerHTML = `<strong>Villain:</strong> ${scenario.villainPosition}`;
            villainDiv.style.marginBottom = '0.5rem';
            modalCard.appendChild(villainDiv);
        }

        if (scenario.description) {
            const descDiv = document.createElement('div');
            descDiv.innerHTML = `<strong>Situation:</strong> ${scenario.description}`;
            descDiv.style.marginBottom = '1rem';
            descDiv.style.padding = '1rem';
            descDiv.style.background = 'var(--color-bg-tertiary)';
            descDiv.style.borderRadius = 'var(--border-radius)';
            modalCard.appendChild(descDiv);
        }

        // Board (if postflop)
        if (scenario.board && scenario.board.length > 0) {
            const boardLabel = document.createElement('div');
            boardLabel.textContent = 'Board:';
            boardLabel.style.fontWeight = '600';
            boardLabel.style.marginTop = '1rem';
            boardLabel.style.marginBottom = '0.5rem';
            modalCard.appendChild(boardLabel);

            const boardDisplay = document.createElement('div');
            boardDisplay.style.display = 'flex';
            boardDisplay.style.gap = '0.5rem';
            boardDisplay.style.marginBottom = '1rem';

            scenario.board.forEach(cardStr => {
                const rank = cardStr.slice(0, -1);
                const suit = cardStr.slice(-1);
                const card = createCard({ rank, suit });
                boardDisplay.appendChild(card);
            });

            modalCard.appendChild(boardDisplay);
        }

        // Hero hand
        if (scenario.hand) {
            const handLabel = document.createElement('div');
            handLabel.textContent = 'Your Hand:';
            handLabel.style.fontWeight = '600';
            handLabel.style.marginTop = '1rem';
            handLabel.style.marginBottom = '0.5rem';
            modalCard.appendChild(handLabel);

            const handDisplay = createHandDisplay(scenario.hand, true);
            handDisplay.style.marginBottom = '1rem';
            modalCard.appendChild(handDisplay);
        }
    }

    // Actions
    const actionsDiv = document.createElement('div');
    actionsDiv.style.padding = '1rem';
    actionsDiv.style.background = result.isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    actionsDiv.style.borderRadius = 'var(--border-radius)';
    actionsDiv.style.marginTop = '1.5rem';

    const yourActionDiv = document.createElement('div');
    yourActionDiv.innerHTML = `<strong>Your Action:</strong> <span style="color: ${result.isCorrect ? 'var(--color-success)' : 'var(--color-error)'}; font-weight: 600;">${result.userAnswer.toUpperCase()}</span>`;
    yourActionDiv.style.marginBottom = '0.5rem';
    actionsDiv.appendChild(yourActionDiv);

    const correctActionDiv = document.createElement('div');
    correctActionDiv.innerHTML = `<strong>GTO Action:</strong> <span style="color: var(--color-success); font-weight: 600;">${result.correctAnswer.toUpperCase()}</span>`;
    actionsDiv.appendChild(correctActionDiv);

    modalCard.appendChild(actionsDiv);

    modal.appendChild(modalCard);
    document.body.appendChild(modal);
}

export default {
    render
};
