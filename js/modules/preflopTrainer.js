// Preflop Trainer Module

import { POSITIONS, ACTIONS, TRAINER_TYPES, MODULES } from '../utils/constants.js';
import { randomItem, generateId, formatPercentage, showToast, randomHand, parseHand } from '../utils/helpers.js';
import { createHandDisplay } from '../components/Card.js';
import ranges from '../data/ranges.js';
import storage from '../utils/storage.js';
import { setPokerShortcutHandler } from '../utils/shortcutManager.js';
import { applyDecisionRating, appendRatingHistory, opponentRatingForContext } from '../utils/rating.js';
import { handCodeToConcreteCards, simulateEquityVsRange } from '../utils/equity.js';
import { gradeFromEvLoss, evBetRaise, evCallToShowdown, evFold, evLossBb } from '../utils/evFeedback.js';
import { buildScenarioKeyFromResult, upsertSrsResult } from '../utils/srs.js';
import { getCurrentKey, isSessionActive, advanceSession, incrementSessionStats } from '../utils/smartPracticeSession.js';

let currentSession = null;
let statsContainerEl = null;
let scenarioContainerEl = null;

let smartPracticeActiveKey = null;

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
    scenarioContainerEl.id = 'scenario-container';
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
            // In feedback mode, let the rendered Next button handle smart-practice routing.
            if (action === 'next') {
                const nextBtn = scenarioEl.querySelector('.feedback-panel .btn-primary');
                if (nextBtn) nextBtn.click();
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

    // Install/replace active shortcut handler (single global listener)
    setPokerShortcutHandler(keyboardHandler);

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

    // ENH-004: if Smart Practice is active, force the trainer type for the due item.
    // We only support preflop due items in this module.
    const activeKey = isSessionActive() ? getCurrentKey() : null;
    smartPracticeActiveKey = activeKey;
    if (activeKey) {
        try {
            const keyObj = JSON.parse(activeKey);
            if (keyObj?.module && typeof keyObj.module === 'string' && keyObj.module.startsWith('preflop-')) {
                const dueType = keyObj.module.replace('preflop-', '');
                currentSession.trainerType = dueType;
                currentSession.module = `preflop-${dueType}`;
                const select = document.getElementById('trainer-type-select');
                if (select) select.value = dueType;
            }
        } catch {
            // ignore
        }
    }

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

function getSmartPracticeTarget() {
    if (!smartPracticeActiveKey) return null;
    try {
        return JSON.parse(smartPracticeActiveKey);
    } catch {
        return null;
    }
}

function generateScenario(trainerType) {
    const target = getSmartPracticeTarget();
    // If we have a specific preflop target, generate that exact spot.
    if (target?.family === 'preflop' && target?.hand) {
        const hand = parseHand(target.hand) || randomHand();
        const position = target.position || null;
        const villainPosition = target.villainPosition || null;
        const callerPosition = target.callerPosition || null;

        switch (trainerType) {
            case TRAINER_TYPES.RFI: {
                const pos = position && POSITIONS.includes(position) ? position : randomItem(POSITIONS.filter(p => p !== 'BB'));
                const correctAction = ranges.getRecommendedAction(hand.display, pos, 'rfi');
                return {
                    type: TRAINER_TYPES.RFI,
                    position: pos,
                    hand,
                    description: `You are ${pos}. Folded to you. What do you do?`,
                    options: [ACTIONS.RAISE, ACTIONS.FOLD],
                    correctAction
                };
            }

            case TRAINER_TYPES.BB_DEFENSE: {
                const v = villainPosition || randomItem(['UTG', 'HJ', 'CO', 'BTN', 'SB']);
                const posKey = `vs${v}`;
                let correctAction = ACTIONS.FOLD;
                if (ranges.BB_3BET_RANGES && ranges.isInRange(hand.display, ranges.BB_3BET_RANGES[posKey])) {
                    correctAction = ACTIONS.RAISE;
                } else if (ranges.isInRange(hand.display, ranges.BB_DEFENSE_RANGES[posKey])) {
                    correctAction = ACTIONS.CALL;
                }
                return {
                    type: TRAINER_TYPES.BB_DEFENSE,
                    position: 'BB',
                    villainPosition: v,
                    hand,
                    description: `You are BB. ${v} raises to 2.5bb. What do you do?`,
                    options: [ACTIONS.RAISE, ACTIONS.CALL, ACTIONS.FOLD],
                    correctAction
                };
            }

            // For other preflop modes, fall back to random scenario generation for now.
            default:
                break;
        }
    }

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
    // Cold call requires hero to be in position vs the opener.
    // If villain is the last position (BB), there are no valid hero positions,
    // so exclude it to avoid empty arrays / recursion crashes (BUG-014).
    const villainPos = randomItem(['UTG', 'HJ', 'CO', 'BTN', 'SB']);
    const validHeroPositions = POSITIONS.filter(p => POSITIONS.indexOf(p) > POSITIONS.indexOf(villainPos));
    if (validHeroPositions.length === 0) {
        // Deterministic fallback: regenerate with a new villain position.
        return generateColdCallScenario();
    }
    const heroPos = randomItem(validHeroPositions);
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

    const id = generateId();
    const evFeedback = computeEvFeedback({ scenario, userAnswer, isCorrect, seed: `preflop:${id}` });

    const result = {
        id,
        timestamp: new Date().toISOString(),
        scenario,
        userAnswer,
        correctAnswer: scenario.correctAction,
        isCorrect,
        responseTimeMs,
        evFeedback
    };

    currentSession.results.push(result);

    // ENH-004: record spaced repetition outcome
    const scenarioKey = smartPracticeActiveKey || buildScenarioKeyFromResult({
        module: currentSession.module,
        trainerType: currentSession.trainerType,
        scenario
    });
    upsertSrsResult({
        scenarioKey,
        isCorrect,
        evFeedback,
        timestamp: result.timestamp,
        payload: {
            module: currentSession.module,
            trainerType: currentSession.trainerType,
            // Keep payload small but actionable
            position: scenario.position || null,
            villainPosition: scenario.villainPosition || null,
            hand: scenario.hand?.display || null
        }
    });
    if (isSessionActive() && smartPracticeActiveKey) {
        incrementSessionStats({ isCorrect, evFeedback });
    }

    // ENH-001: update skill rating after each decision
    updateRatingAfterDecision(isCorrect);

    showFeedback(result);
    updateStats();
}

function updateRatingAfterDecision(isCorrect) {
    const rating = storage.getRating();
    const opp = opponentRatingForContext({ module: currentSession?.module, trainerType: currentSession?.trainerType });
    const next = applyDecisionRating(rating.current, isCorrect, opp);
    const updated = {
        ...rating,
        current: next,
        history: appendRatingHistory(rating.history, next),
        lastUpdated: new Date().toISOString()
    };
    storage.saveRating(updated);
}

function showFeedback(result) {
    if (!scenarioContainerEl) return;
    const scenarioEl = scenarioContainerEl;

    const { scenario, userAnswer, isCorrect, evFeedback } = result;

    const card = scenarioEl.querySelector('.scenario-card');
    if (!card) return;

    // Hide action buttons
    const buttons = card.querySelector('.action-buttons');
    if (buttons) {
        buttons.style.display = 'none';
    }

    const evLoss = evFeedback?.evLossBb ?? (isCorrect ? 0 : null);
    const grade = evFeedback?.grade || (isCorrect ? { key: 'perfect', label: 'Perfect', icon: '✅' } : { key: 'blunder', label: 'Blunder', icon: '🔴' });

    // Create feedback panel
    const feedback = document.createElement('div');
    feedback.className = `feedback-panel grade-${grade.key}`;

    const title = document.createElement('div');
    title.className = 'feedback-title';
    title.textContent = evLoss === null
        ? `${isCorrect ? '✅ Correct!' : '❌ Incorrect'}`
        : `${grade.icon} ${grade.label} (EV loss: ${evLoss.toFixed(2)}bb)`;

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

    const evMeta = evFeedback?.meta;
    const evDetailsHtml = evMeta
        ? `<p style="margin-top: 0.5rem; color: var(--color-text-secondary); font-size: 0.95em;">
                Est. equity vs range: <strong>${Math.round(evMeta.equity * 100)}%</strong>
                ${Number.isFinite(evMeta.iterations) && evMeta.iterations > 0 ? `(${evMeta.iterations} sims)` : ''}
           </p>`
        : '';

    explanation.innerHTML = `
        ${!isCorrect ? `
            <p>Your answer: <strong>${userAnswer.toUpperCase()}</strong></p>
            <p>Recommended: <strong>${scenario.correctAction.toUpperCase()}</strong></p>
        ` : `<p>Keep going!</p>`}
        ${evLoss !== null ? `<p>EV impact: <strong>-${evLoss.toFixed(2)}bb</strong> vs recommended line</p>` : ''}
        ${evDetailsHtml}
        <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">${getExplanation()}</p>
    `;

    // Add next button
    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-primary';
    nextButton.textContent = smartPracticeActiveKey ? 'Next Review (Space)' : 'Next Hand (Space)';
    nextButton.style.marginTop = '1rem';
    nextButton.addEventListener('click', () => {
        if (isSessionActive() && smartPracticeActiveKey) {
            const { done, nextRoute } = advanceSession();
            if (!done) {
                window.location.hash = nextRoute;
                return;
            }
        }
        smartPracticeActiveKey = isSessionActive() ? getCurrentKey() : null;
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

function computeEvFeedback({ scenario, userAnswer, isCorrect, seed }) {
    // If correct, we treat EV loss as 0 (avoid model disagreeing with trainer answer).
    // If incorrect, we compute an approximate EV loss vs the recommended action.

    // BUG-038: Extend EV feedback coverage to COLD_CALL and SQUEEZE.
    const supported = new Set([
        TRAINER_TYPES.RFI,
        TRAINER_TYPES.THREE_BET,
        TRAINER_TYPES.BB_DEFENSE,
        TRAINER_TYPES.FOUR_BET,
        TRAINER_TYPES.COLD_CALL,
        TRAINER_TYPES.SQUEEZE
    ]);

    if (!supported.has(scenario.type)) return null;

    const HANDS = {
        openSize: 2.5,
        threeBetSize: 9,
        fourBetSize: 22,
        blindsPot: 1.5
    };

    // BUG-037: These fold equity numbers are rough 100bb cash-game approximations.
    // They are NOT calibrated to tournaments / short stacks / specific populations.
    // Long-term improvement: make these configurable in Settings.
    const OPEN_FOLD_EQUITY = {
        UTG: 0.20,
        HJ: 0.25,
        CO: 0.35,
        BTN: 0.45,
        SB: 0.35,
        BB: 0
    };

    const THREE_BET_FOLD_EQUITY = {
        UTG: 0.35,
        HJ: 0.32,
        CO: 0.30,
        BTN: 0.28,
        SB: 0.30,
        BB: 0.30
    };

    const heroHandCode = scenario.hand?.display;
    if (!heroHandCode) return null;

    const heroCards = handCodeToConcreteCards(heroHandCode, new Set(), seed);
    if (!heroCards) return null;

    function unionRange(a, b) {
        const arrA = Array.isArray(a) ? a : [];
        const arrB = Array.isArray(b) ? b : [];
        return Array.from(new Set([...arrA, ...arrB]));
    }

    function estimateEquity(villainRange, subSeed) {
        const res = simulateEquityVsRange({
            heroCards,
            villainRange,
            board: [],
            iterations: 2000,
            seed: `${seed}:${subSeed}`
        });
        return { equity: res.equity, iterations: res.iterations };
    }

    function actionEvs() {
        switch (scenario.type) {
            case TRAINER_TYPES.RFI: {
                const pos = scenario.position;
                const bbKey = `vs${pos}`;
                const villainRange = ranges.BB_DEFENSE_RANGES?.[bbKey] || [];
                const { equity, iterations } = estimateEquity(villainRange, 'rfi');
                const fe = OPEN_FOLD_EQUITY[pos] ?? 0.30;
                const evRaise = evBetRaise({
                    equity,
                    potNow: HANDS.blindsPot,
                    invest: HANDS.openSize,
                    villainCallExtra: 1.5,
                    foldEquity: fe
                });
                return {
                    meta: { equity, iterations },
                    evByAction: {
                        [ACTIONS.FOLD]: evFold(),
                        [ACTIONS.RAISE]: evRaise
                    }
                };
            }

            case TRAINER_TYPES.THREE_BET: {
                const villainPos = scenario.villainPosition;
                const heroPos = scenario.position;
                const openRange = ranges.RFI_RANGES?.[villainPos] || [];
                const contRange = unionRange(
                    ranges.FOUR_BET_RANGES?.[`vs${heroPos}`],
                    ranges.CALL_3BET_RANGES?.[`vs${heroPos}`]
                );

                const callEq = estimateEquity(openRange, '3b-call');
                const raiseEq = estimateEquity(contRange, '3b-raise');
                const fe = THREE_BET_FOLD_EQUITY[villainPos] ?? 0.30;

                const potNow = HANDS.blindsPot + HANDS.openSize; // 1.5 + 2.5
                const evCall = evCallToShowdown({ equity: callEq.equity, potNow, callCost: HANDS.openSize });
                const evRaise = evBetRaise({
                    equity: raiseEq.equity,
                    potNow,
                    invest: HANDS.threeBetSize,
                    villainCallExtra: HANDS.threeBetSize - HANDS.openSize,
                    foldEquity: fe
                });

                return {
                    meta: { equity: callEq.equity, iterations: callEq.iterations },
                    evByAction: {
                        [ACTIONS.FOLD]: evFold(),
                        [ACTIONS.CALL]: evCall,
                        [ACTIONS.RAISE]: evRaise
                    }
                };
            }

            case TRAINER_TYPES.BB_DEFENSE: {
                const villainPos = scenario.villainPosition;
                const openRange = ranges.RFI_RANGES?.[villainPos] || [];
                const contRange = unionRange(
                    ranges.FOUR_BET_RANGES?.['vsBB'],
                    ranges.CALL_3BET_RANGES?.['vsBB']
                );
                // Fallback: if we don't have vsBB keys, just use opener's call-3bet vs BTN
                const effectiveCont = contRange.length > 0 ? contRange : unionRange(
                    ranges.FOUR_BET_RANGES?.['vsBTN'],
                    ranges.CALL_3BET_RANGES?.['vsBTN']
                );

                const callEq = estimateEquity(openRange, 'bb-call');
                const raiseEq = estimateEquity(effectiveCont, 'bb-raise');
                const fe = THREE_BET_FOLD_EQUITY[villainPos] ?? 0.30;

                const potNow = HANDS.blindsPot + HANDS.openSize; // includes BB posted
                const evCall = evCallToShowdown({ equity: callEq.equity, potNow, callCost: 1.5 });
                const evRaise = evBetRaise({
                    equity: raiseEq.equity,
                    potNow,
                    invest: HANDS.threeBetSize - 1, // BB already posted 1bb
                    villainCallExtra: HANDS.threeBetSize - HANDS.openSize,
                    foldEquity: fe
                });
                return {
                    meta: { equity: callEq.equity, iterations: callEq.iterations },
                    evByAction: {
                        [ACTIONS.FOLD]: evFold(),
                        [ACTIONS.CALL]: evCall,
                        [ACTIONS.RAISE]: evRaise
                    }
                };
            }

            case TRAINER_TYPES.FOUR_BET: {
                const heroPos = scenario.position;
                const villain3betRange = ranges.THREE_BET_RANGES?.[`vs${heroPos}`] || [];
                const fiveBetRange = ['AA', 'KK', 'QQ', 'AKs', 'AKo'];

                const callEq = estimateEquity(villain3betRange, '4b-call');
                const raiseEq = estimateEquity(fiveBetRange, '4b-raise');
                const potNow = HANDS.blindsPot + HANDS.openSize + HANDS.threeBetSize; // at decision (approx)

                const evCall = evCallToShowdown({ equity: callEq.equity, potNow, callCost: HANDS.threeBetSize - HANDS.openSize });
                const evRaise = evBetRaise({
                    equity: raiseEq.equity,
                    potNow,
                    invest: HANDS.fourBetSize - HANDS.openSize,
                    villainCallExtra: HANDS.fourBetSize - HANDS.threeBetSize,
                    foldEquity: 0.45
                });

                return {
                    meta: { equity: callEq.equity, iterations: callEq.iterations },
                    evByAction: {
                        [ACTIONS.FOLD]: evFold(),
                        [ACTIONS.CALL]: evCall,
                        [ACTIONS.RAISE]: evRaise
                    }
                };
            }

            case TRAINER_TYPES.COLD_CALL: {
                const villainPos = scenario.villainPosition;
                const heroPos = scenario.position;
                const posKey = `vs${villainPos}`;

                // Approximate opener range.
                const openRange = ranges.RFI_RANGES?.[villainPos] || [];

                // Approximate what continues vs a 3-bet from heroPos.
                const contRange = unionRange(
                    ranges.FOUR_BET_RANGES?.[`vs${heroPos}`],
                    ranges.CALL_3BET_RANGES?.[`vs${heroPos}`]
                );

                const callEq = estimateEquity(openRange, 'cc-call');
                const raiseEq = estimateEquity(contRange, 'cc-raise');

                const potNow = HANDS.blindsPot + HANDS.openSize; // 1.5 + 2.5
                const evCall = evCallToShowdown({ equity: callEq.equity, potNow, callCost: HANDS.openSize });

                const fe = THREE_BET_FOLD_EQUITY[villainPos] ?? 0.30;
                const evRaise = evBetRaise({
                    equity: raiseEq.equity,
                    potNow,
                    invest: HANDS.threeBetSize,
                    villainCallExtra: HANDS.threeBetSize - HANDS.openSize,
                    foldEquity: fe
                });

                return {
                    meta: { equity: callEq.equity, iterations: callEq.iterations },
                    evByAction: {
                        [ACTIONS.FOLD]: evFold(),
                        [ACTIONS.CALL]: evCall,
                        [ACTIONS.RAISE]: evRaise
                    }
                };
            }

            case TRAINER_TYPES.SQUEEZE: {
                const raiserPos = scenario.villainPosition;
                const heroPos = scenario.position;

                // Approximate raiser open range.
                const openRange = ranges.RFI_RANGES?.[raiserPos] || [];

                // Approximate continue range vs a squeeze from heroPos.
                const contRange = unionRange(
                    ranges.FOUR_BET_RANGES?.[`vs${heroPos}`],
                    ranges.CALL_3BET_RANGES?.[`vs${heroPos}`]
                );
                const raiseEq = estimateEquity(contRange, 'sq-raise');

                // Dead money: opener + caller already in for 2.5 each plus blinds.
                const potNow = HANDS.blindsPot + (HANDS.openSize * 2);

                // Multiway fold equity is higher due to two players needing to continue,
                // but we keep this conservative since ranges are approximations.
                const fe = 0.38;
                const evRaise = evBetRaise({
                    equity: raiseEq.equity,
                    potNow,
                    invest: HANDS.threeBetSize,
                    villainCallExtra: HANDS.threeBetSize - HANDS.openSize,
                    foldEquity: fe
                });

                return {
                    meta: { equity: raiseEq.equity, iterations: raiseEq.iterations },
                    evByAction: {
                        [ACTIONS.FOLD]: evFold(),
                        [ACTIONS.RAISE]: evRaise
                    }
                };
            }

            default:
                return null;
        }
    }

    const evs = actionEvs();
    if (!evs || !evs.evByAction) return null;

    const evGto = evs.evByAction[scenario.correctAction];
    const evUser = evs.evByAction[userAnswer];
    if (!Number.isFinite(evGto) || !Number.isFinite(evUser)) return null;

    const loss = isCorrect ? 0 : evLossBb(evGto, evUser);

    return {
        evLossBb: loss,
        grade: gradeFromEvLoss(loss),
        meta: evs.meta || null,
        evGto,
        evUser
    };
}

export default {
    render
};
