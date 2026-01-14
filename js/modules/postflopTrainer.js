// Postflop Trainer Module

import { POSITIONS, ACTIONS, TRAINER_TYPES, BET_SIZES, RANKS, SUITS, SUIT_NAMES } from '../utils/constants.js';
import { randomItem, generateId, formatPercentage, showToast } from '../utils/helpers.js';
import { createHandDisplay, createCard } from '../components/Card.js';
import storage from '../utils/storage.js';
import { BOARD_TEXTURES, CBET_FREQUENCIES, DEFENSE_FREQUENCIES } from '../data/postflopRanges.js';

let currentSession = null;

function render() {
    const container = document.createElement('div');
    container.className = 'trainer-container';

    // Header
    const header = document.createElement('div');
    header.className = 'trainer-header';
    header.innerHTML = '<h1>🎲 Postflop Trainer</h1><p class="text-muted">Use keyboard: B=Bet/Raise, C=Call/Check, F=Fold, Space=Next</p>';
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
    startNewSession(TRAINER_TYPES.CBET);

    // Add keyboard shortcut listener
    const keyboardHandler = (e) => {
        const action = e.detail.action;
        const scenarioEl = document.getElementById('scenario-container');
        if (!scenarioEl) return;

        // Check if we're in feedback mode
        if (scenarioEl.querySelector('.feedback-panel')) {
            if (action === 'next') {
                showNextScenario();
            }
            return;
        }

        // Get current scenario from buttons
        const buttons = scenarioEl.querySelectorAll('.action-buttons .btn');
        if (buttons.length === 0) return;

        // Map action to button
        let targetButton = null;
        buttons.forEach(btn => {
            const btnText = btn.textContent.toLowerCase();
            if (btnText.includes(action) || (action === 'raise' && btnText.includes('bet'))) {
                targetButton = btn;
            }
        });

        if (targetButton) {
            targetButton.click();
        }
    };

    document.addEventListener('poker-shortcut', keyboardHandler);

    // Cleanup on navigation away
    window.addEventListener('hashchange', () => {
        document.removeEventListener('poker-shortcut', keyboardHandler);
    }, { once: true });

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
    select.id = 'postflop-trainer-type-select';
    select.style.padding = '0.5rem 1rem';
    select.style.fontSize = '1rem';

    const types = [
        { value: TRAINER_TYPES.CBET, label: 'C-Betting (As Aggressor)' },
        { value: TRAINER_TYPES.FACING_CBET, label: 'Facing C-Bet (As Caller)' },
        { value: TRAINER_TYPES.TURN_PLAY, label: 'Turn Play' },
        { value: TRAINER_TYPES.RIVER_PLAY, label: 'River Play' },
        { value: TRAINER_TYPES.BOARD_TEXTURE, label: 'Board Texture Quiz' }
    ];

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.label;
        select.appendChild(option);
    });

    // Set initial value to CBET
    select.value = TRAINER_TYPES.CBET;

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
        module: `postflop-${trainerType}`,
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

    // Position and situation info
    const situationInfo = document.createElement('div');
    situationInfo.className = 'situation-info';
    situationInfo.style.marginBottom = '1rem';
    situationInfo.style.padding = '1rem';
    situationInfo.style.background = 'var(--color-bg-tertiary)';
    situationInfo.style.borderRadius = 'var(--border-radius)';
    situationInfo.innerHTML = `
        <div><strong>Position:</strong> ${scenario.position}</div>
        <div><strong>Pot:</strong> ${scenario.pot}bb</div>
        ${scenario.effectiveStack ? `<div><strong>Effective Stack:</strong> ${scenario.effectiveStack}bb</div>` : ''}
    `;
    card.appendChild(situationInfo);

    // Board display
    const boardDisplay = createBoardDisplay(scenario.board);
    card.appendChild(boardDisplay);

    // Hero hand (if shown)
    if (scenario.heroHand) {
        const handLabel = document.createElement('div');
        handLabel.textContent = 'Your Hand:';
        handLabel.style.fontWeight = '600';
        handLabel.style.marginTop = '1rem';
        handLabel.style.marginBottom = '0.5rem';
        card.appendChild(handLabel);

        const handDisplay = createHandDisplay(scenario.heroHand, true);
        card.appendChild(handDisplay);
    }

    // Scenario description
    const description = document.createElement('div');
    description.className = 'action-description';
    description.textContent = scenario.description;
    description.style.marginTop = '1rem';
    card.appendChild(description);

    // Action buttons
    const buttons = document.createElement('div');
    buttons.className = 'action-buttons';

    scenario.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = `btn btn-${option.action.toLowerCase()}`;
        btn.textContent = option.label.toUpperCase();

        btn.addEventListener('click', () => handleAnswer(scenario, option.action));

        buttons.appendChild(btn);
    });

    card.appendChild(buttons);

    scenarioEl.appendChild(card);
}

function createBoardDisplay(board) {
    const container = document.createElement('div');
    container.style.marginTop = '1rem';

    const label = document.createElement('div');
    label.textContent = 'Board:';
    label.style.fontWeight = '600';
    label.style.marginBottom = '0.5rem';
    container.appendChild(label);

    const cardsContainer = document.createElement('div');
    cardsContainer.style.display = 'flex';
    cardsContainer.style.gap = '0.5rem';
    cardsContainer.style.flexWrap = 'wrap';

    board.forEach(cardString => {
        const rank = cardString.slice(0, -1);
        const suit = cardString.slice(-1);
        const card = createCard({ rank, suit });
        cardsContainer.appendChild(card);
    });

    container.appendChild(cardsContainer);

    return container;
}

function generateScenario(trainerType) {
    switch (trainerType) {
        case TRAINER_TYPES.CBET:
            return generateCBetScenario();
        case TRAINER_TYPES.FACING_CBET:
            return generateFacingCBetScenario();
        case TRAINER_TYPES.TURN_PLAY:
            return generateTurnScenario();
        case TRAINER_TYPES.RIVER_PLAY:
            return generateRiverScenario();
        case TRAINER_TYPES.BOARD_TEXTURE:
            return generateBoardTextureScenario();
        default:
            return generateCBetScenario();
    }
}

function generateCBetScenario() {
    const position = randomItem(['IP', 'OOP']);
    const board = generateBoard(3);
    const texture = classifyBoardTexture(board);
    const pot = 6; // Standard single raised pot
    const effectiveStack = 100;

    const frequency = CBET_FREQUENCIES[position][texture];
    const shouldCBet = Math.random() < frequency;

    // Generate a reasonable hand for the preflop raiser
    const heroHand = generatePreflopRaiserHand();

    // Simplify: just bet or check
    const correctAction = shouldCBet ? ACTIONS.BET : ACTIONS.CHECK;

    return {
        type: TRAINER_TYPES.CBET,
        position: position === 'IP' ? 'BTN' : 'BB',
        board,
        texture,
        heroHand,
        pot,
        effectiveStack,
        description: `You raised preflop and ${position === 'IP' ? 'have position' : 'are out of position'}. Villain calls. What do you do on the flop?`,
        options: [
            { action: ACTIONS.BET, label: 'Bet (50% pot)' },
            { action: ACTIONS.CHECK, label: 'Check' }
        ],
        correctAction
    };
}

function generateFacingCBetScenario() {
    const position = randomItem(['IP', 'OOP']);
    const board = generateBoard(3);
    const texture = classifyBoardTexture(board);
    const pot = 6;
    const effectiveStack = 100;
    const cBetSize = 3; // 50% pot

    const heroHand = generatePreflopCallerHand();

    const frequencies = DEFENSE_FREQUENCIES[position][texture];

    // Determine correct action based on frequencies
    const rand = Math.random();
    let correctAction;
    if (rand < frequencies.fold) {
        correctAction = ACTIONS.FOLD;
    } else if (rand < frequencies.fold + frequencies.call) {
        correctAction = ACTIONS.CALL;
    } else {
        correctAction = ACTIONS.RAISE;
    }

    return {
        type: TRAINER_TYPES.FACING_CBET,
        position: position === 'IP' ? 'BTN' : 'BB',
        board,
        texture,
        heroHand,
        pot: pot + cBetSize * 2,
        effectiveStack,
        description: `Villain raised preflop, you called. ${position === 'IP' ? 'You have position' : 'You are out of position'}. Villain bets ${cBetSize}bb (50% pot). What do you do?`,
        options: [
            { action: ACTIONS.RAISE, label: 'Raise' },
            { action: ACTIONS.CALL, label: 'Call' },
            { action: ACTIONS.FOLD, label: 'Fold' }
        ],
        correctAction
    };
}

function generateTurnScenario() {
    const position = randomItem(['IP', 'OOP']);
    const board = generateBoard(4);
    const texture = classifyBoardTexture(board.slice(0, 3)); // Classify based on flop
    const pot = 15; // After flop betting
    const effectiveStack = 85;

    const heroHand = generatePreflopRaiserHand();

    // Simplified: if we c-bet flop and got called, should we barrel turn?
    const shouldBarrel = Math.random() < 0.45; // Barrel ~45% of the time

    const correctAction = shouldBarrel ? ACTIONS.BET : ACTIONS.CHECK;

    return {
        type: TRAINER_TYPES.TURN_PLAY,
        position: position === 'IP' ? 'BTN' : 'BB',
        board,
        texture,
        heroHand,
        pot,
        effectiveStack,
        description: `You raised preflop, c-bet the flop, and villain called. ${position === 'IP' ? 'You have position' : 'You are out of position'}. What do you do on the turn?`,
        options: [
            { action: ACTIONS.BET, label: 'Bet (67% pot)' },
            { action: ACTIONS.CHECK, label: 'Check' }
        ],
        correctAction
    };
}

function generateRiverScenario() {
    const position = randomItem(['IP', 'OOP']);
    const board = generateBoard(5);
    const texture = classifyBoardTexture(board.slice(0, 3));
    const pot = 40;
    const effectiveStack = 60;

    const heroHand = generatePreflopRaiserHand();

    // Simplified: river betting is complex, so we'll use simplified heuristic
    const shouldBet = Math.random() < 0.40; // Bet river ~40% when checked to

    const correctAction = shouldBet ? ACTIONS.BET : ACTIONS.CHECK;

    return {
        type: TRAINER_TYPES.RIVER_PLAY,
        position: position === 'IP' ? 'BTN' : 'BB',
        board,
        texture,
        heroHand,
        pot,
        effectiveStack,
        description: `Multi-street action. ${position === 'IP' ? 'You have position' : 'You are out of position'}. Both players check the turn. What do you do on the river?`,
        options: [
            { action: ACTIONS.BET, label: 'Bet (75% pot)' },
            { action: ACTIONS.CHECK, label: 'Check' }
        ],
        correctAction
    };
}

function generateBoardTextureScenario() {
    const board = generateBoard(3);
    const actualTexture = classifyBoardTexture(board);

    // For quiz mode, we ask user to identify texture
    const options = [
        { action: 'DRY', label: 'Dry' },
        { action: 'WET', label: 'Wet' },
        { action: 'STATIC', label: 'Static' },
        { action: 'DYNAMIC', label: 'Dynamic' }
    ];

    return {
        type: TRAINER_TYPES.BOARD_TEXTURE,
        position: 'Quiz',
        board,
        texture: actualTexture,
        pot: 0,
        description: 'What is the texture of this board?',
        options,
        correctAction: actualTexture
    };
}

function generateBoard(numCards) {
    const cards = [];
    const usedCards = new Set();

    while (cards.length < numCards) {
        const rank = randomItem(RANKS);
        const suit = randomItem(Object.values(SUITS));
        const card = `${rank}${suit}`;

        if (!usedCards.has(card)) {
            cards.push(card);
            usedCards.add(card);
        }
    }

    return cards;
}

function classifyBoardTexture(board) {
    // Simplified texture classification
    const ranks = board.map(card => card.slice(0, -1));
    const suits = board.map(card => card.slice(-1));

    // Check for flush draws
    const suitCounts = {};
    suits.forEach(suit => {
        suitCounts[suit] = (suitCounts[suit] || 0) + 1;
    });
    const hasFlushDraw = Object.values(suitCounts).some(count => count >= 2);

    // Check for straight draws (simplified)
    const rankValues = ranks.map(rank => {
        const index = RANKS.indexOf(rank);
        return index !== -1 ? (12 - index) : 0;
    });
    rankValues.sort((a, b) => b - a);
    const spread = rankValues[0] - rankValues[rankValues.length - 1];
    const hasStraightDraw = spread <= 4;

    // Check for pairs
    const rankCounts = {};
    ranks.forEach(rank => {
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    const hasPair = Object.values(rankCounts).some(count => count >= 2);

    // Classify
    if (hasPair && !hasFlushDraw && !hasStraightDraw) {
        return 'STATIC';
    } else if (hasFlushDraw && hasStraightDraw) {
        return 'DYNAMIC';
    } else if (!hasFlushDraw && !hasStraightDraw && spread > 4) {
        return 'DRY';
    } else {
        return 'WET';
    }
}

function generatePreflopRaiserHand() {
    // Generate a typical raising hand
    const hands = [
        { rank1: 'A', rank2: 'K', suited: true },
        { rank1: 'A', rank2: 'Q', suited: true },
        { rank1: 'A', rank2: 'J', suited: true },
        { rank1: 'A', rank2: 'K', suited: false },
        { rank1: 'K', rank2: 'Q', suited: true },
        { rank1: 'Q', rank2: 'Q', suited: false },
        { rank1: 'J', rank2: 'J', suited: false },
        { rank1: 'T', rank2: 'T', suited: false },
        { rank1: 'A', rank2: '5', suited: true },
        { rank1: '8', rank2: '7', suited: true }
    ];

    const hand = randomItem(hands);
    const display = hand.rank1 === hand.rank2
        ? `${hand.rank1}${hand.rank2}`
        : `${hand.rank1}${hand.rank2}${hand.suited ? 's' : 'o'}`;

    return { ...hand, display };
}

function generatePreflopCallerHand() {
    // Generate a typical calling hand
    const hands = [
        { rank1: 'Q', rank2: 'J', suited: true },
        { rank1: 'J', rank2: 'T', suited: true },
        { rank1: 'T', rank2: '9', suited: true },
        { rank1: '9', rank2: '9', suited: false },
        { rank1: '8', rank2: '8', suited: false },
        { rank1: '7', rank2: '7', suited: false },
        { rank1: 'A', rank2: 'T', suited: true },
        { rank1: 'A', rank2: 'J', suited: false },
        { rank1: 'K', rank2: 'Q', suited: false },
        { rank1: '7', rank2: '6', suited: true }
    ];

    const hand = randomItem(hands);
    const display = hand.rank1 === hand.rank2
        ? `${hand.rank1}${hand.rank2}`
        : `${hand.rank1}${hand.rank2}${hand.suited ? 's' : 'o'}`;

    return { ...hand, display };
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
}

function showFeedback(scenario, userAnswer, isCorrect) {
    const scenarioEl = document.getElementById('scenario-container');
    if (!scenarioEl) return;

    const card = scenarioEl.querySelector('.scenario-card');
    if (!card) return;

    // Hide action buttons
    const buttons = card.querySelector('.action-buttons');
    if (buttons) {
        buttons.style.display = 'none';
    }

    // Create feedback panel
    const feedback = document.createElement('div');
    feedback.className = `feedback-panel ${isCorrect ? 'correct' : 'incorrect'}`;

    const title = document.createElement('div');
    title.className = 'feedback-title';
    title.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect';

    const explanation = document.createElement('div');
    explanation.className = 'feedback-explanation';

    if (!isCorrect) {
        let correctLabel = scenario.correctAction.toUpperCase();
        if (scenario.type === TRAINER_TYPES.BOARD_TEXTURE) {
            correctLabel = scenario.correctAction;
        }

        explanation.innerHTML = `
            <p>Your answer: <strong>${userAnswer.toUpperCase()}</strong></p>
            <p>Correct answer: <strong>${correctLabel}</strong></p>
            ${scenario.texture ? `<p>Board texture: <strong>${scenario.texture}</strong></p>` : ''}
        `;
    } else {
        explanation.innerHTML = `
            <p>Great job! Keep going!</p>
            ${scenario.texture ? `<p>Board texture: <strong>${scenario.texture}</strong></p>` : ''}
        `;
    }

    // Add next button
    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-primary';
    nextButton.textContent = 'Next Hand (Space)';
    nextButton.style.marginTop = '1rem';
    nextButton.addEventListener('click', () => {
        showNextScenario();
    });

    feedback.appendChild(title);
    feedback.appendChild(explanation);
    feedback.appendChild(nextButton);

    card.appendChild(feedback);

    // Save to storage if session has enough hands
    if (currentSession.results.length >= 10) {
        currentSession.endTime = new Date().toISOString();
        storage.saveSession(currentSession);
    }
}

export default {
    render
};
