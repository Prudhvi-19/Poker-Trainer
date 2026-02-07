// Preflop Trainer Module

import { POSITIONS, ACTIONS, TRAINER_TYPES, MODULES } from '../utils/constants.js';
import { randomItem, generateId, formatPercentage, showToast, randomHand } from '../utils/helpers.js';
import { createHandDisplay } from '../components/Card.js';
import ranges from '../data/ranges.js';
import storage from '../utils/storage.js';

let currentSession = null;
let statsContainerEl = null;
let scenarioContainerEl = null;

function render() {
    const container = document.createElement('div');
    container.className = 'trainer-container';

    // Header
    const header = document.createElement('div');
    header.className = 'trainer-header';
    header.innerHTML = '<h1>🎯 Preflop Trainer</h1><p class="text-muted">Use keyboard: R=Raise, C=Call, F=Fold, Space=Next</p>';
    container.appendChild(header);

    // Trainer type selector
    const typeSelector = createTypeSelector();
    container.appendChild(typeSelector);

    // Session stats
    statsContainerEl = document.createElement('div');
    container.appendChild(statsContainerEl);

    // Scenario area
    scenarioContainerEl = document.createElement('div');
    container.appendChild(scenarioContainerEl);

    // Initialize session
    startNewSession(TRAINER_TYPES.RFI);

    // Add keyboard shortcut listener
    const keyboardHandler = (e) => {
        const action = e.detail.action;
        const scenarioEl = document.getElementById('scenario-container');
        if (!scenarioEl) return;

        // Check if we're in feedback mode
        if (scenarioEl.querySelector('.feedback-panel')) {
            // In feedback mode, space advances
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
            if (btnText === action) {
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
    select.id = 'trainer-type-select';
    select.style.padding = '0.5rem 1rem';
    select.style.fontSize = '1rem';

    const types = [
        { value: TRAINER_TYPES.RFI, label: 'RFI (Raise First In)' },
        { value: TRAINER_TYPES.THREE_BET, label: '3-Bet' },
        { value: TRAINER_TYPES.FOUR_BET, label: '4-Bet vs 3-Bet' },
        { value: TRAINER_TYPES.COLD_CALL, label: 'Cold Call' },
        { value: TRAINER_TYPES.SQUEEZE, label: 'Squeeze' },
        { value: TRAINER_TYPES.BB_DEFENSE, label: 'BB Defense' }
    ];

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.label;
        select.appendChild(option);
    });

    // Set initial value to RFI
    select.value = TRAINER_TYPES.RFI;

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
    if (!statsContainerEl) return;

    const totalHands = currentSession.results.length;
    const correct = currentSession.results.filter(r => r.isCorrect).length;
    const accuracy = totalHands > 0 ? correct / totalHands : 0;

    statsContainerEl.innerHTML = '';
    statsContainerEl.className = 'session-stats';

    const handsEl = createStatBox(totalHands, 'Hands');
    const correctEl = createStatBox(correct, 'Correct');
    const accuracyEl = createStatBox(formatPercentage(accuracy, 0), 'Accuracy');

    statsContainerEl.appendChild(handsEl);
    statsContainerEl.appendChild(correctEl);
    statsContainerEl.appendChild(accuracyEl);
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

// Track when scenario is shown for response time measurement
let scenarioStartTime = null;

function showNextScenario() {
    if (!scenarioContainerEl) return;
    const scenarioEl = scenarioContainerEl;

    scenarioEl.innerHTML = '';

    // Start timer when scenario is shown
    scenarioStartTime = Date.now();

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
        case TRAINER_TYPES.FOUR_BET:
            return generate4BetScenario();
        case TRAINER_TYPES.COLD_CALL:
            return generateColdCallScenario();
        case TRAINER_TYPES.SQUEEZE:
            return generateSqueezeScenario();
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
        description: `You are ${position}. Folded to you. What do you do?`,
        options: [ACTIONS.RAISE, ACTIONS.FOLD],
        correctAction
    };
}

function generate3BetScenario() {
    const villainPos = randomItem(['UTG', 'HJ', 'CO', 'BTN']);
    const heroPos = randomItem(POSITIONS.filter(p => POSITIONS.indexOf(p) > POSITIONS.indexOf(villainPos)));
    const hand = randomHand();

    const posKey = `vs${villainPos}`;

    // Determine correct action: 3-bet, call (cold call), or fold
    let correctAction = ACTIONS.FOLD;
    if (ranges.isInRange(hand.display, ranges.THREE_BET_RANGES[posKey])) {
        correctAction = ACTIONS.RAISE;
    } else if (ranges.isInRange(hand.display, ranges.COLD_CALL_RANGES[posKey])) {
        correctAction = ACTIONS.CALL;
    }

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

    // Check 3-bet range first (premiums), then call range
    let correctAction = ACTIONS.FOLD;
    if (ranges.BB_3BET_RANGES && ranges.isInRange(hand.display, ranges.BB_3BET_RANGES[posKey])) {
        correctAction = ACTIONS.RAISE;
    } else if (ranges.isInRange(hand.display, ranges.BB_DEFENSE_RANGES[posKey])) {
        correctAction = ACTIONS.CALL;
    }

    return {
        type: TRAINER_TYPES.BB_DEFENSE,
        position: 'BB',
        villainPosition: villainPos,
        hand,
        description: `You are BB. ${villainPos} raises to 2.5bb. What do you do?`,
        options: [ACTIONS.RAISE, ACTIONS.CALL, ACTIONS.FOLD],
        correctAction
    };
}

function generate4BetScenario() {
    // Hero opens first (RFI), so hero must be in an EARLIER position than villain
    // Villain 3-bets from a later position
    const heroPos = randomItem(['UTG', 'HJ', 'CO', 'BTN']);

    // Villain must be in a later position to 3-bet hero's open
    const validVillainPositions = POSITIONS.filter(p => POSITIONS.indexOf(p) > POSITIONS.indexOf(heroPos));
    if (validVillainPositions.length === 0) {
        return generate4BetScenario(); // Retry if no valid positions
    }
    const villainPos = randomItem(validVillainPositions);

    const hand = randomHand();

    // posKey represents who 3-bet us (villain's position tells us their 3-bet range)
    const posKey = `vs${villainPos}`;

    // Determine correct action: 4-bet, call, or fold
    let correctAction = ACTIONS.FOLD;
    if (ranges.isInRange(hand.display, ranges.FOUR_BET_RANGES[posKey])) {
        correctAction = ACTIONS.RAISE;
    } else if (ranges.isInRange(hand.display, ranges.CALL_3BET_RANGES[posKey])) {
        correctAction = ACTIONS.CALL;
    }

    return {
        type: TRAINER_TYPES.FOUR_BET,
        position: heroPos,
        villainPosition: villainPos,
        hand,
        description: `You are ${heroPos}. You raised to 2.5bb, ${villainPos} 3-bet to 9bb. What do you do?`,
        options: [ACTIONS.RAISE, ACTIONS.CALL, ACTIONS.FOLD],
        correctAction
    };
}

function generateColdCallScenario() {
    const villainPos = randomItem(['UTG', 'HJ', 'CO', 'BTN', 'SB']);
    const heroPos = randomItem(POSITIONS.filter(p => POSITIONS.indexOf(p) > POSITIONS.indexOf(villainPos)));
    const hand = randomHand();

    const posKey = `vs${villainPos}`;

    // Determine correct action: 3-bet, cold call, or fold
    let correctAction = ACTIONS.FOLD;
    const threeBetKey = `vs${villainPos}`;
    if (ranges.isInRange(hand.display, ranges.THREE_BET_RANGES[threeBetKey])) {
        correctAction = ACTIONS.RAISE;
    } else if (ranges.isInRange(hand.display, ranges.COLD_CALL_RANGES[posKey])) {
        correctAction = ACTIONS.CALL;
    }

    return {
        type: TRAINER_TYPES.COLD_CALL,
        position: heroPos,
        villainPosition: villainPos,
        hand,
        description: `You are ${heroPos}. ${villainPos} raises to 2.5bb. What do you do?`,
        options: [ACTIONS.RAISE, ACTIONS.CALL, ACTIONS.FOLD],
        correctAction
    };
}

function generateSqueezeScenario() {
    // Raiser can be UTG through CO (not BTN/SB - need room for caller and hero)
    const raiserPos = randomItem(['UTG', 'HJ', 'CO']);
    // Caller must be after raiser, but leave room for hero
    const validCallers = POSITIONS.filter(p =>
        POSITIONS.indexOf(p) > POSITIONS.indexOf(raiserPos) &&
        POSITIONS.indexOf(p) < POSITIONS.length - 1
    );
    if (validCallers.length === 0) {
        // Fallback if no valid callers
        return generateSqueezeScenario();
    }
    const callerPos = randomItem(validCallers);

    // Hero must be after caller
    const validHeroPositions = POSITIONS.filter(p =>
        POSITIONS.indexOf(p) > POSITIONS.indexOf(callerPos)
    );
    if (validHeroPositions.length === 0) {
        return generateSqueezeScenario();
    }
    const heroPos = randomItem(validHeroPositions);

    const hand = randomHand();
    const posKey = `vs${raiserPos}`;
    const correctAction = ranges.isInRange(hand.display, ranges.SQUEEZE_RANGES[posKey]) ? ACTIONS.RAISE : ACTIONS.FOLD;

    return {
        type: TRAINER_TYPES.SQUEEZE,
        position: heroPos,
        villainPosition: raiserPos,
        callerPosition: callerPos,
        hand,
        description: `You are ${heroPos}. ${raiserPos} raises to 2.5bb, ${callerPos} calls. What do you do?`,
        options: [ACTIONS.RAISE, ACTIONS.FOLD],
        correctAction
    };
}

function handleAnswer(scenario, userAnswer) {
    // Calculate response time from when scenario was shown
    const responseTimeMs = scenarioStartTime ? Date.now() - scenarioStartTime : 0;

    const isCorrect = userAnswer === scenario.correctAction;

    const result = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        scenario,
        userAnswer,
        correctAnswer: scenario.correctAction,
        isCorrect,
        responseTimeMs
    };

    currentSession.results.push(result);

    showFeedback(scenario, userAnswer, isCorrect);
    updateStats();
}

function showFeedback(scenario, userAnswer, isCorrect) {
    if (!scenarioContainerEl) return;
    const scenarioEl = scenarioContainerEl;

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

    // Generate explanation based on scenario type
    const getExplanation = () => {
        const hand = scenario.hand.display;
        const pos = scenario.position;
        const villainPos = scenario.villainPosition;
        const action = scenario.correctAction.toUpperCase();

        switch (scenario.type) {
            case TRAINER_TYPES.RFI:
                if (action === 'RAISE') {
                    return `${hand} is in your RFI range from ${pos}. Always raise for value/stealing.`;
                }
                return `${hand} is too weak to open from ${pos}. Fold and wait for better spots.`;

            case TRAINER_TYPES.BB_DEFENSE:
                if (action === 'RAISE') {
                    return `${hand} is strong enough to 3-bet vs ${villainPos} for value. Build the pot!`;
                }
                if (action === 'CALL') {
                    return `${hand} has good playability vs ${villainPos}'s range. Call and see a flop.`;
                }
                return `${hand} doesn't have enough equity vs ${villainPos}'s tight opening range.`;

            case TRAINER_TYPES.THREE_BET:
                if (action === 'RAISE') {
                    return `${hand} is a 3-bet for value or as a bluff with blockers vs ${villainPos}.`;
                }
                if (action === 'CALL') {
                    return `${hand} plays well postflop. Cold call to see a flop vs ${villainPos}'s range.`;
                }
                return `${hand} is not strong enough to continue vs ${villainPos}'s opening range.`;

            case TRAINER_TYPES.FOUR_BET:
                if (action === 'RAISE') {
                    return `${hand} is strong enough to 4-bet vs ${villainPos}'s 3-bet. Build the pot with premium value or blocker bluffs.`;
                }
                if (action === 'CALL') {
                    return `${hand} has enough equity to call ${villainPos}'s 3-bet. Too strong to fold, but not strong enough to 4-bet.`;
                }
                return `${hand} cannot profitably continue vs ${villainPos}'s 3-bet range. Fold and save chips.`;

            case TRAINER_TYPES.COLD_CALL:
                if (action === 'RAISE') {
                    return `${hand} is strong enough to 3-bet vs ${villainPos}. Raise for value or as a bluff with blockers.`;
                }
                if (action === 'CALL') {
                    return `${hand} plays well postflop vs ${villainPos}'s range. Cold call to see a flop.`;
                }
                return `${hand} is too weak to continue vs ${villainPos}'s opening range from ${pos}.`;

            case TRAINER_TYPES.SQUEEZE:
                if (action === 'RAISE') {
                    return `${hand} is strong enough to squeeze vs ${villainPos}'s raise + caller. The dead money makes raising profitable.`;
                }
                return `${hand} is not strong enough to squeeze. With a raiser and caller, you need a strong hand to enter the pot.`;

            default:
                return action === 'RAISE' ? 'This hand is in your raising range.' :
                       action === 'CALL' ? 'This hand has enough equity to call.' :
                       'This hand should be folded.';
        }
    };

    if (!isCorrect) {
        explanation.innerHTML = `
            <p>Your answer: <strong>${userAnswer.toUpperCase()}</strong></p>
            <p>Correct answer: <strong>${scenario.correctAction.toUpperCase()}</strong></p>
            <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">${getExplanation()}</p>
        `;
    } else {
        explanation.innerHTML = `
            <p>Great job! Keep going!</p>
            <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">${getExplanation()}</p>
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

    // Save session after every hand (storage handles deduplication by ID)
    // This ensures sessions are saved even if user plays < 10 hands
    currentSession.endTime = new Date().toISOString();
    storage.saveSession(currentSession);
}

export default {
    render
};
