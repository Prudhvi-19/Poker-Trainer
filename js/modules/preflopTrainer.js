// Preflop Trainer Module

import { POSITIONS, ACTIONS, TRAINER_TYPES, MODULES } from '../utils/constants.js';
import { randomItem, generateId, formatPercentage, showToast } from '../utils/helpers.js';
import { createHandDisplay } from '../components/Card.js';
import ranges from '../data/ranges.js';
import storage from '../utils/storage.js';

let currentSession = null;

function render() {
    const container = document.createElement('div');
    container.className = 'trainer-container';

    // Header
    const header = document.createElement('div');
    header.className = 'trainer-header';
    header.innerHTML = '<h1>🎯 Preflop Trainer</h1>';
    container.appendChild(header);

    // Trainer type selector
    const typeSelector = createTypeSelector();
    container.appendChild(typeSelector);

    // Session stats
    const statsContainer = document.createElement('div');
    statsContainer.id = 'session-stats';
    container.appendChild(statsContainer);

    // Scenario area
    const scenarioContainer = document.createElement('div');
    scenarioContainer.id = 'scenario-container';
    container.appendChild(scenarioContainer);

    // Initialize session
    startNewSession(TRAINER_TYPES.RFI);

    return container;
}

function createTypeSelector() {
    const container = document.createElement('div');
    container.className = 'card mb-lg';

    const label = document.createElement('label');
    label.textContent = 'Training Mode:';
    label.style.fontWeight = '600';
    label.style.marginRight = '1rem';

    const select = document.createElement('select');
    select.style.padding = '0.5rem 1rem';
    select.style.fontSize = '1rem';

    const types = [
        { value: TRAINER_TYPES.RFI, label: 'RFI (Raise First In)' },
        { value: TRAINER_TYPES.THREE_BET, label: '3-Bet' },
        { value: TRAINER_TYPES.BB_DEFENSE, label: 'BB Defense' }
    ];

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.label;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        startNewSession(e.target.value);
    });

    container.appendChild(label);
    container.appendChild(select);

    return container;
}

function startNewSession(trainerType) {
    currentSession = {
        id: generateId(),
        module: `preflop-${trainerType}`,
        trainerType,
        startTime: new Date().toISOString(),
        results: []
    };

    updateStats();
    showNextScenario();
}

function updateStats() {
    const statsEl = document.getElementById('session-stats');
    if (!statsEl) return;

    const totalHands = currentSession.results.length;
    const correct = currentSession.results.filter(r => r.isCorrect).length;
    const accuracy = totalHands > 0 ? correct / totalHands : 0;

    statsEl.innerHTML = '';
    statsEl.className = 'session-stats';

    const handsEl = createStatBox(totalHands, 'Hands');
    const correctEl = createStatBox(correct, 'Correct');
    const accuracyEl = createStatBox(formatPercentage(accuracy, 0), 'Accuracy');

    statsEl.appendChild(handsEl);
    statsEl.appendChild(correctEl);
    statsEl.appendChild(accuracyEl);
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

function showNextScenario() {
    const scenarioEl = document.getElementById('scenario-container');
    if (!scenarioEl) return;

    scenarioEl.innerHTML = '';

    const scenario = generateScenario(currentSession.trainerType);

    const card = document.createElement('div');
    card.className = 'scenario-card';

    // Position badge
    if (scenario.position) {
        const badge = document.createElement('div');
        badge.className = 'position-badge';
        badge.textContent = scenario.position;
        card.appendChild(badge);
    }

    // Scenario description
    const description = document.createElement('div');
    description.className = 'action-description';
    description.textContent = scenario.description;
    card.appendChild(description);

    // Hand display
    const handDisplay = createHandDisplay(scenario.hand, true);
    card.appendChild(handDisplay);

    // Action buttons
    const buttons = document.createElement('div');
    buttons.className = 'action-buttons';

    scenario.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = `btn btn-${option.toLowerCase()}`;
        btn.textContent = option.toUpperCase();

        btn.addEventListener('click', () => handleAnswer(scenario, option));

        buttons.appendChild(btn);
    });

    card.appendChild(buttons);

    scenarioEl.appendChild(card);
}

function generateScenario(trainerType) {
    switch (trainerType) {
        case TRAINER_TYPES.RFI:
            return generateRFIScenario();
        case TRAINER_TYPES.THREE_BET:
            return generate3BetScenario();
        case TRAINER_TYPES.BB_DEFENSE:
            return generateBBDefenseScenario();
        default:
            return generateRFIScenario();
    }
}

function generateRFIScenario() {
    const position = randomItem(POSITIONS.filter(p => p !== 'BB'));
    const hand = randomHand();

    const correctAction = ranges.getRecommendedAction(hand.display, position, 'rfi');

    return {
        type: TRAINER_TYPES.RFI,
        position,
        hand,
        description: `You are ${position}. First to act. What do you do?`,
        options: [ACTIONS.RAISE, ACTIONS.FOLD],
        correctAction
    };
}

function generate3BetScenario() {
    const villainPos = randomItem(['UTG', 'HJ', 'CO', 'BTN']);
    const heroPos = randomItem(POSITIONS.filter(p => POSITIONS.indexOf(p) > POSITIONS.indexOf(villainPos)));
    const hand = randomHand();

    const posKey = `vs${villainPos}`;
    const correctAction = ranges.isInRange(hand.display, ranges.THREE_BET_RANGES[posKey]) ? ACTIONS.RAISE : ACTIONS.FOLD;

    return {
        type: TRAINER_TYPES.THREE_BET,
        position: heroPos,
        villainPosition: villainPos,
        hand,
        description: `You are ${heroPos}. ${villainPos} raises to 2.5bb. What do you do?`,
        options: [ACTIONS.RAISE, ACTIONS.CALL, ACTIONS.FOLD],
        correctAction
    };
}

function generateBBDefenseScenario() {
    const villainPos = randomItem(['UTG', 'HJ', 'CO', 'BTN', 'SB']);
    const hand = randomHand();

    const posKey = `vs${villainPos}`;
    const correctAction = ranges.isInRange(hand.display, ranges.BB_DEFENSE_RANGES[posKey]) ? ACTIONS.CALL : ACTIONS.FOLD;

    return {
        type: TRAINER_TYPES.BB_DEFENSE,
        position: 'BB',
        villainPosition: villainPos,
        hand,
        description: `You are BB. ${villainPos} raises to 2.5bb. What do you do?`,
        options: [ACTIONS.CALL, ACTIONS.RAISE, ACTIONS.FOLD],
        correctAction
    };
}

function randomHand() {
    const allHands = [
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s',
        'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s',
        'JTs', 'J9s', 'J8s', 'J7s',
        'T9s', 'T8s', 'T7s',
        '98s', '87s', '76s', '65s', '54s', '43s', '32s',
        'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o',
        'KQo', 'KJo', 'KTo', 'K9o',
        'QJo', 'QTo', 'Q9o',
        'JTo', 'J9o',
        'T9o', 'T8o',
        '98o', '87o', '76o', '65o'
    ];

    const handString = randomItem(allHands);
    const suited = handString.endsWith('s');
    const rank1 = handString[0];
    const rank2 = handString[1];

    return {
        rank1,
        rank2,
        suited,
        display: handString
    };
}

function handleAnswer(scenario, userAnswer) {
    const startTime = Date.now();

    const isCorrect = userAnswer === scenario.correctAction;

    const result = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        scenario,
        userAnswer,
        correctAnswer: scenario.correctAction,
        isCorrect,
        responseTimeMs: Date.now() - startTime
    };

    currentSession.results.push(result);

    showFeedback(scenario, userAnswer, isCorrect);
    updateStats();

    // Auto-advance after delay
    setTimeout(() => {
        showNextScenario();
    }, 2500);
}

function showFeedback(scenario, userAnswer, isCorrect) {
    const scenarioEl = document.getElementById('scenario-container');
    if (!scenarioEl) return;

    const feedback = document.createElement('div');
    feedback.className = `feedback-panel ${isCorrect ? 'correct' : 'incorrect'}`;

    const title = document.createElement('div');
    title.className = 'feedback-title';
    title.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect';

    const explanation = document.createElement('div');
    explanation.className = 'feedback-explanation';

    if (!isCorrect) {
        explanation.innerHTML = `
            <p>Your answer: <strong>${userAnswer.toUpperCase()}</strong></p>
            <p>Correct answer: <strong>${scenario.correctAction.toUpperCase()}</strong></p>
        `;
    } else {
        explanation.textContent = 'Great job!';
    }

    feedback.appendChild(title);
    feedback.appendChild(explanation);

    scenarioEl.appendChild(feedback);

    // Save to storage if session has enough hands
    if (currentSession.results.length >= 10) {
        currentSession.endTime = new Date().toISOString();
        storage.saveSession(currentSession);
    }
}

export default {
    render
};
