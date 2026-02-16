// Multi-Street Trainer Module
// Full hand progression: Preflop → Flop → Turn → River

import { ACTIONS, SUITS, STREET } from '../utils/constants.js';
import { generateId, formatPercentage, randomHand, isInPosition } from '../utils/helpers.js';
import { createHandDisplay, createCard } from '../components/Card.js';
import ranges from '../data/ranges.js';
import storage from '../utils/storage.js';
import { createDeck, shuffle } from '../utils/deckManager.js';
import { analyzeBoard as sharedAnalyzeBoard } from '../utils/boardAnalyzer.js';
import { evaluateHandBoard } from '../utils/handEvaluator.js';

let currentSession = null;
let currentHand = null;

// Store element references to avoid getElementById timing issues
let statsEl = null;
let handInfoEl = null;
let scenarioEl = null;

function render() {
    const container = document.createElement('div');
    container.className = 'trainer-container';

    // Header
    const header = document.createElement('div');
    header.className = 'trainer-header';
    header.innerHTML = '<h1>🎰 Multi-Street Trainer</h1><p class="text-muted">Play complete hands from preflop through river. Make GTO decisions on every street.</p>';
    container.appendChild(header);

    // Session stats - store reference directly
    statsEl = document.createElement('div');
    statsEl.id = 'multistreet-stats';
    container.appendChild(statsEl);

    // Hand info - store reference directly
    handInfoEl = document.createElement('div');
    handInfoEl.id = 'hand-info';
    handInfoEl.className = 'card mb-lg';
    container.appendChild(handInfoEl);

    // Scenario area - store reference directly
    scenarioEl = document.createElement('div');
    scenarioEl.id = 'scenario-container';
    container.appendChild(scenarioEl);

    // Initialize session (now uses stored references)
    startNewSession();

    // Add keyboard shortcut listener
    const keyboardHandler = (e) => {
        const action = e.detail.action;
        if (!scenarioEl) return;

        // Check if we're in feedback mode
        if (scenarioEl.querySelector('.feedback-panel')) {
            if (action === 'next') {
                const nextBtn = scenarioEl.querySelector('.btn-primary');
                if (nextBtn) nextBtn.click();
            }
            return;
        }

        // Get current scenario from buttons
        const buttons = scenarioEl.querySelectorAll('.action-buttons .btn');
        if (buttons.length === 0) return;

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

    window.addEventListener('hashchange', () => {
        document.removeEventListener('poker-shortcut', keyboardHandler);
    }, { once: true });

    return container;
}

function startNewSession() {
    currentSession = {
        id: generateId(),
        module: 'multistreet',
        startTime: new Date().toISOString(),
        hands: [],
        totalDecisions: 0,
        correctDecisions: 0
    };

    updateStats();
    startNewHand();
}

function startNewHand() {
    currentHand = generateNewHand();
    updateHandInfo();
    showCurrentStreet();
}

function generateNewHand() {
    // For production-grade training determinism and correct range lookups,
    // constrain to a supported, well-defined heads-up configuration (BTN vs BB).
    // We still randomize which seat the hero is in so we can train both:
    // - BTN RFI (open) and
    // - BB defense vs BTN open

    const heroIsAggressor = Math.random() > 0.5;
    const heroPosition = heroIsAggressor ? 'BTN' : 'BB';
    const villainPosition = heroIsAggressor ? 'BB' : 'BTN';

    // Generate hero hand
    const heroHand = randomHand();

    // Generate actual cards with suits for the hero hand
    const heroCards = generateHeroCards(heroHand);

    // Pre-generate full board at hand start to ensure consistency
    const fullBoard = generateFullBoard(heroCards);

    // Heads-up blinds model (BTN is SB in HU)
    const blinds = { BTN: 0.5, BB: 1.0 };
    const heroBlind = blinds[heroPosition] ?? 0;
    const villainBlind = blinds[villainPosition] ?? 0;

    const hand = {
        id: generateId(),
        heroPosition,
        villainPosition,
        heroHand,
        heroCards,
        heroIsAggressor,
        currentStreet: STREET.PREFLOP,
        // Keep pot/stacks internally consistent (fixes BUG-009)
        pot: heroBlind + villainBlind,
        heroStack: 100 - heroBlind,
        villainStack: 100 - villainBlind,
        heroContribution: heroBlind,
        villainContribution: villainBlind,
        board: [],
        fullBoard, // All 5 cards pre-generated, revealed incrementally
        actions: [],
        decisions: []
    };

    // If villain is opening (hero is BB defending), apply the villain's open
    // immediately so the displayed pot/stack state matches the scenario text.
    if (!heroIsAggressor) {
        applyVillainOpen(hand, 2.5);
    }

    return hand;
}

function applyVillainOpen(hand, openSize) {
    const add = openSize - (hand.villainContribution ?? 0);
    if (add > 0) {
        hand.pot += add;
        hand.villainStack -= add;
        hand.villainContribution = openSize;
    }
    hand.actions.push(`${hand.villainPosition} raises to ${openSize}bb`);
}

function generateHeroCards(hand) {
    // Generate actual card objects with specific suits
    let suit1, suit2;

    if (hand.suited) {
        // Same suit - randomly pick one
        const suits = Object.values(SUITS);
        suit1 = suit2 = suits[Math.floor(Math.random() * suits.length)];
    } else if (hand.rank1 === hand.rank2) {
        // Pair - different suits
        const suits = Object.values(SUITS);
        suit1 = suits[Math.floor(Math.random() * suits.length)];
        do {
            suit2 = suits[Math.floor(Math.random() * suits.length)];
        } while (suit2 === suit1);
    } else {
        // Offsuit - different suits
        const suits = Object.values(SUITS);
        suit1 = suits[Math.floor(Math.random() * suits.length)];
        do {
            suit2 = suits[Math.floor(Math.random() * suits.length)];
        } while (suit2 === suit1);
    }

    return [
        `${hand.rank1}${suit1}`,
        `${hand.rank2}${suit2}`
    ];
}

function updateHandInfo() {
    if (!handInfoEl) return;

    const streetLabels = {
        [STREET.PREFLOP]: 'Preflop',
        [STREET.FLOP]: 'Flop',
        [STREET.TURN]: 'Turn',
        [STREET.RIVER]: 'River'
    };

    handInfoEl.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
            <div>
                <div style="color: var(--color-text-secondary); font-size: 0.875rem;">Street</div>
                <div style="font-weight: 600; font-size: 1.125rem;">${streetLabels[currentHand.currentStreet]}</div>
            </div>
            <div>
                <div style="color: var(--color-text-secondary); font-size: 0.875rem;">Position</div>
                <div style="font-weight: 600; font-size: 1.125rem;">${currentHand.heroPosition}</div>
            </div>
            <div>
                <div style="color: var(--color-text-secondary); font-size: 0.875rem;">Pot</div>
                <div style="font-weight: 600; font-size: 1.125rem;">${currentHand.pot.toFixed(1)}bb</div>
            </div>
            <div>
                <div style="color: var(--color-text-secondary); font-size: 0.875rem;">Stack</div>
                <div style="font-weight: 600; font-size: 1.125rem;">${currentHand.heroStack.toFixed(1)}bb</div>
            </div>
        </div>
    `;
}

function showCurrentStreet() {
    if (!scenarioEl) return;

    scenarioEl.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'scenario-card';

    // Show board if postflop
    if (currentHand.currentStreet !== STREET.PREFLOP) {
        const boardDisplay = createBoardDisplay(currentHand.board);
        card.appendChild(boardDisplay);
    }

    // Show hero hand
    const handLabel = document.createElement('div');
    handLabel.textContent = 'Your Hand:';
    handLabel.style.fontWeight = '600';
    handLabel.style.marginTop = '1rem';
    handLabel.style.marginBottom = '0.5rem';
    card.appendChild(handLabel);

    // Use actual hero cards to prevent showing different cards each render
    const handContainer = document.createElement('div');
    handContainer.className = 'hand-display';
    if (currentHand.heroCards) {
        currentHand.heroCards.forEach(cardStr => {
            const rank = cardStr.slice(0, -1);
            const suit = cardStr.slice(-1);
            const cardEl = createCard({ rank, suit }, true);
            handContainer.appendChild(cardEl);
        });
    } else {
        // Fallback to old method if heroCards not available
        const handDisplay = createHandDisplay(currentHand.heroHand, true);
        card.appendChild(handDisplay);
    }
    if (currentHand.heroCards) {
        card.appendChild(handContainer);
    }

    // Show action history
    if (currentHand.actions.length > 0) {
        const historyLabel = document.createElement('div');
        historyLabel.textContent = 'Action:';
        historyLabel.style.fontWeight = '600';
        historyLabel.style.marginTop = '1rem';
        historyLabel.style.marginBottom = '0.5rem';
        card.appendChild(historyLabel);

        const history = document.createElement('div');
        history.style.padding = '0.5rem';
        history.style.background = 'var(--color-bg-tertiary)';
        history.style.borderRadius = 'var(--border-radius)';
        history.style.fontSize = '0.875rem';
        history.textContent = currentHand.actions.join(' → ');
        card.appendChild(history);
    }

    // Generate decision scenario
    const scenario = generateCurrentDecision();

    // Description
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
        btn.textContent = option.label;

        btn.addEventListener('click', () => handleDecision(scenario, option.action));

        buttons.appendChild(btn);
    });

    card.appendChild(buttons);
    scenarioEl.appendChild(card);
}

function generateCurrentDecision() {
    const street = currentHand.currentStreet;

    if (street === STREET.PREFLOP) {
        return generatePreflopDecision();
    } else {
        return generatePostflopDecision();
    }
}

function generatePreflopDecision() {
    // Simplified: just practice opening or facing a raise
    if (currentHand.heroIsAggressor) {
        // Hero opens
        const openSize = 2.5;
        const correctAction = ranges.getRecommendedAction(
            currentHand.heroHand.display,
            currentHand.heroPosition,
            'rfi'
        );

        return {
            street: STREET.PREFLOP,
            correctAction,
            description: `You are ${currentHand.heroPosition}. Folded to you. What do you do?`,
            openSize,
            options: [
                { action: ACTIONS.RAISE, label: 'Raise 2.5bb' },
                { action: ACTIONS.FOLD, label: 'Fold' }
            ]
        };
    } else {
        // Hero faces a raise (villain open). Since we constrain to BTN vs BB,
        // the correct response is BB defense vs BTN open.
        const openSize = 2.5;
        const threeBetSize = 9;
        const correctAction = ranges.getRecommendedAction(
            currentHand.heroHand.display,
            currentHand.villainPosition, // BTN
            'bb-defense'
        );

        return {
            street: STREET.PREFLOP,
            correctAction,
            description: `${currentHand.villainPosition} raises to 2.5bb. You are ${currentHand.heroPosition}. What do you do?`,
            openSize,
            threeBetSize,
            options: [
                { action: ACTIONS.CALL, label: 'Call 2.5bb' },
                { action: ACTIONS.RAISE, label: '3-Bet to 9bb' },
                { action: ACTIONS.FOLD, label: 'Fold' }
            ]
        };
    }
}

function generatePostflopDecision() {
    const heroHasPosition = isInPosition(currentHand.heroPosition, currentHand.villainPosition);

    // Evaluate hand strength on current board
    const handStrength = evaluateHandStrength(currentHand.heroHand, currentHand.board);
    const boardTexture = classifyTexture(currentHand.board);

    if (currentHand.heroIsAggressor) {
        // Should we bet/c-bet?
        const correctAction = determineBettingAction(handStrength, boardTexture, heroHasPosition);

        return {
            street: currentHand.currentStreet,
            correctAction,
            handStrength,
            description: `You raised preflop and villain called. ${heroHasPosition ? 'You have position' : 'You are OOP'}. What do you do?`,
            options: [
                { action: ACTIONS.BET, label: `Bet ${(currentHand.pot * 0.67).toFixed(1)}bb` },
                { action: ACTIONS.CHECK, label: 'Check' }
            ]
        };
    } else {
        // Facing a bet
        const betSize = (currentHand.pot * 0.67).toFixed(1);
        const correctAction = determineDefenseAction(handStrength, boardTexture, heroHasPosition);

        return {
            street: currentHand.currentStreet,
            correctAction,
            handStrength,
            description: `Villain bets ${betSize}bb. What do you do?`,
            options: [
                { action: ACTIONS.CALL, label: `Call ${betSize}bb` },
                { action: ACTIONS.RAISE, label: 'Raise' },
                { action: ACTIONS.FOLD, label: 'Fold' }
            ]
        };
    }
}

// Evaluate hand strength relative to board using shared evaluator
function evaluateHandStrength(hand, board) {
    if (!board || board.length === 0) return 'UNKNOWN';

    // Use hero's actual cards if available for accurate draw detection
    const heroCards = currentHand.heroCards
        ? currentHand.heroCards.map(c => ({ rank: c.slice(0, -1), suit: c.slice(-1) }))
        : hand; // fallback to abstract hand

    const result = evaluateHandBoard(heroCards, board);

    // Map shared strength to categories used in this module
    if (result.strength === 'MONSTER') return 'MONSTER';
    if (result.strength === 'STRONG') return 'STRONG';
    if (result.strength === 'MEDIUM_STRONG') return 'MEDIUM_STRONG';
    if (result.strength === 'MEDIUM') return 'MEDIUM';
    if (result.strength === 'STRONG_DRAW') return 'DRAW';
    if (result.strength === 'DRAW') return 'DRAW';
    if (result.strength === 'OVERCARDS') return 'OVERCARDS';
    return 'AIR';
}

// Classify board texture using shared analyzer (analyzes ALL board cards, not just flop)
function classifyTexture(board) {
    if (!board || board.length < 3) return 'UNKNOWN';

    const analysis = sharedAnalyzeBoard(board);
    return analysis.texture; // DRY, WET, STATIC, DYNAMIC
}

// Determine betting action based on hand strength
function determineBettingAction(strength, texture, hasPosition) {
    // Value hands always bet
    if (['MONSTER', 'STRONG', 'MEDIUM_STRONG'].includes(strength)) {
        return ACTIONS.BET;
    }

    // Medium hands: bet on dry boards, check on wet
    if (strength === 'MEDIUM') {
        return texture === 'DRY' || texture === 'STATIC' ? ACTIONS.BET : ACTIONS.CHECK;
    }

    // Draws: semi-bluff to build pot and apply pressure
    if (strength === 'DRAW') {
        return ACTIONS.BET; // Semi-bluff with draws - bet for equity and fold equity
    }

    // Overcards: semi-bluff sometimes
    if (strength === 'OVERCARDS') {
        return hasPosition && (texture === 'DRY' || texture === 'STATIC') ? ACTIONS.BET : ACTIONS.CHECK;
    }

    // Air: bluff on good textures with position
    if (strength === 'AIR') {
        return hasPosition && texture === 'DRY' ? ACTIONS.BET : ACTIONS.CHECK;
    }

    return ACTIONS.CHECK;
}

// Determine defense action when facing a bet
function determineDefenseAction(strength, texture, hasPosition) {
    // Strong hands raise for value
    if (strength === 'MONSTER') return ACTIONS.RAISE;
    if (strength === 'STRONG') return hasPosition ? ACTIONS.RAISE : ACTIONS.CALL;

    // Medium-strong hands call
    if (['MEDIUM_STRONG', 'MEDIUM'].includes(strength)) {
        return ACTIONS.CALL;
    }

    // Draws: call to realize equity (good pot odds vs 67% pot bet)
    if (strength === 'DRAW') {
        return ACTIONS.CALL;
    }

    // Overcards with equity can call on dry boards
    if (strength === 'OVERCARDS') {
        return texture === 'DRY' && hasPosition ? ACTIONS.CALL : ACTIONS.FOLD;
    }

    // Air folds
    return ACTIONS.FOLD;
}

function handleDecision(scenario, userAction) {
    const isCorrect = userAction === scenario.correctAction;

    currentSession.totalDecisions++;
    if (isCorrect) {
        currentSession.correctDecisions++;
    }

    currentHand.decisions.push({
        street: currentHand.currentStreet,
        action: userAction,
        correctAction: scenario.correctAction,
        isCorrect
    });

    // Update pot/stack based on action
    updatePotAndStack(userAction, scenario);

    showDecisionFeedback(scenario, userAction, isCorrect);
    updateStats();
}

function updatePotAndStack(action, scenario) {
    if (currentHand.currentStreet === STREET.PREFLOP) {
        const openSize = scenario?.openSize ?? 2.5;
        const threeBetSize = scenario?.threeBetSize ?? 9;

        const putInTotal = (player, total) => {
            if (player === 'hero') {
                const already = currentHand.heroContribution ?? 0;
                const add = total - already;
                if (add > 0) {
                    currentHand.pot += add;
                    currentHand.heroStack -= add;
                    currentHand.heroContribution = total;
                }
            } else {
                const already = currentHand.villainContribution ?? 0;
                const add = total - already;
                if (add > 0) {
                    currentHand.pot += add;
                    currentHand.villainStack -= add;
                    currentHand.villainContribution = total;
                }
            }
        };

        if (action === ACTIONS.RAISE) {
            if (currentHand.heroIsAggressor) {
                // Hero opens, villain calls (simplified)
                putInTotal('hero', openSize);
                putInTotal('villain', openSize);
                currentHand.actions.push(`${currentHand.heroPosition} raises to ${openSize}bb, ${currentHand.villainPosition} calls`);
            } else {
                // Villain opened, hero 3-bets, villain calls (simplified)
                // Villain open already applied before the decision (see generateNewHand)
                putInTotal('hero', threeBetSize);
                putInTotal('villain', threeBetSize);
                currentHand.actions.push(`${currentHand.heroPosition} 3-bets to ${threeBetSize}bb, ${currentHand.villainPosition} calls`);
            }
            return;
        }

        if (action === ACTIONS.CALL) {
            // Facing an open, hero calls (simplified)
            // Villain open already applied before the decision (see generateNewHand)
            putInTotal('hero', openSize);
            currentHand.actions.push(`${currentHand.heroPosition} calls`);
            return;
        }

        if (action === ACTIONS.FOLD) {
            // If it was folded to hero, they simply fold and lose their blind.
            // If hero was facing an open, villain open was already applied.
            currentHand.actions.push(`${currentHand.heroPosition} folds`);
            return;
        }

        // Check shouldn't be possible preflop in our scenarios
        return;
    }

    if (action === ACTIONS.CALL) {
        // Hero calls a bet/raise postflop
        const callSize = currentHand.pot * 0.67;
        // Add villain's bet first (it wasn't added when the scenario was generated)
        currentHand.pot += callSize;
        currentHand.villainStack -= callSize;
        // Then add hero's call
        currentHand.pot += callSize;
        currentHand.heroStack -= callSize;
        currentHand.actions.push(`Villain bets ${callSize.toFixed(1)}bb, ${currentHand.heroPosition} calls`);
    } else if (action === ACTIONS.RAISE && currentHand.currentStreet !== STREET.PREFLOP) {
        // Hero raises villain's bet postflop
        const villainBet = currentHand.pot * 0.67;
        // Villain's bet
        currentHand.pot += villainBet;
        currentHand.villainStack -= villainBet;
        // Hero raises (~3x villain's bet)
        const raiseSize = villainBet * 3;
        currentHand.pot += raiseSize;
        currentHand.heroStack -= raiseSize;
        // Villain calls the raise (simplified)
        currentHand.pot += (raiseSize - villainBet);
        currentHand.villainStack -= (raiseSize - villainBet);
        currentHand.actions.push(`Villain bets ${villainBet.toFixed(1)}bb, ${currentHand.heroPosition} raises to ${raiseSize.toFixed(1)}bb, Villain calls`);
    } else if (action === ACTIONS.BET) {
        // Hero bets, villain will call (simplified for training)
        const betSize = currentHand.pot * 0.67;
        currentHand.pot += betSize; // Hero's bet
        currentHand.heroStack -= betSize;
        // Villain calls
        currentHand.pot += betSize;
        currentHand.villainStack -= betSize;
        currentHand.actions.push(`${currentHand.heroPosition} bets ${betSize.toFixed(1)}bb, Villain calls`);
    } else if (action === ACTIONS.CHECK) {
        currentHand.actions.push(`${currentHand.heroPosition} checks`);
    } else if (action === ACTIONS.FOLD) {
        currentHand.actions.push(`${currentHand.heroPosition} folds`);
    }
}

function showDecisionFeedback(scenario, userAction, isCorrect) {
    if (!scenarioEl) return;

    const card = scenarioEl.querySelector('.scenario-card');
    if (!card) return;

    const buttons = card.querySelector('.action-buttons');
    if (buttons) {
        buttons.style.display = 'none';
    }

    const feedback = document.createElement('div');
    feedback.className = `feedback-panel ${isCorrect ? 'correct' : 'incorrect'}`;

    const title = document.createElement('div');
    title.className = 'feedback-title';
    title.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect';

    const explanation = document.createElement('div');
    explanation.className = 'feedback-explanation';

    // Format hand strength for explanation
    const strengthLabels = {
        'MONSTER': 'Monster hand (Set/Two Pair+)',
        'STRONG': 'Strong hand (Overpair)',
        'MEDIUM_STRONG': 'Top pair',
        'MEDIUM': 'Medium hand (Second pair)',
        'DRAW': 'Drawing hand (Flush/Straight draw)',
        'OVERCARDS': 'Overcards only',
        'AIR': 'No made hand'
    };
    const strengthLabel = scenario.handStrength ? strengthLabels[scenario.handStrength] || scenario.handStrength : null;

    if (!isCorrect) {
        explanation.innerHTML = `
            <p>Your action: <strong>${userAction.toUpperCase()}</strong></p>
            <p>GTO action: <strong>${scenario.correctAction.toUpperCase()}</strong></p>
            ${strengthLabel ? `<p style="margin-top: 0.5rem; color: var(--color-text-secondary);">Hand strength: ${strengthLabel}</p>` : ''}
        `;
    } else {
        explanation.innerHTML = `
            <p>Good decision! Continuing to next street...</p>
            ${strengthLabel ? `<p style="margin-top: 0.5rem; color: var(--color-text-secondary);">Hand strength: ${strengthLabel}</p>` : ''}
        `;
    }

    feedback.appendChild(title);
    feedback.appendChild(explanation);

    // Determine next action
    const canContinue = userAction !== ACTIONS.FOLD && canAdvanceStreet();

    if (canContinue) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-primary';
        nextBtn.textContent = 'Continue to Next Street';
        nextBtn.style.marginTop = '1rem';
        nextBtn.addEventListener('click', () => advanceStreet());
        feedback.appendChild(nextBtn);
    } else {
        const newHandBtn = document.createElement('button');
        newHandBtn.className = 'btn btn-primary';
        newHandBtn.textContent = userAction === ACTIONS.FOLD ? 'New Hand (Folded)' : 'New Hand (Complete)';
        newHandBtn.style.marginTop = '1rem';
        newHandBtn.addEventListener('click', () => {
            saveHandToSession();
            startNewHand();
        });
        feedback.appendChild(newHandBtn);
    }

    card.appendChild(feedback);
}

function canAdvanceStreet() {
    const streets = [STREET.PREFLOP, STREET.FLOP, STREET.TURN, STREET.RIVER];
    const currentIndex = streets.indexOf(currentHand.currentStreet);
    return currentIndex < streets.length - 1;
}

function advanceStreet() {
    const streets = [STREET.PREFLOP, STREET.FLOP, STREET.TURN, STREET.RIVER];
    const currentIndex = streets.indexOf(currentHand.currentStreet);

    if (currentIndex < streets.length - 1) {
        currentHand.currentStreet = streets[currentIndex + 1];

        // Reveal pre-generated board cards
        if (currentHand.currentStreet === STREET.FLOP) {
            currentHand.board = currentHand.fullBoard.slice(0, 3);
        } else if (currentHand.currentStreet === STREET.TURN) {
            currentHand.board = currentHand.fullBoard.slice(0, 4);
        } else if (currentHand.currentStreet === STREET.RIVER) {
            currentHand.board = currentHand.fullBoard.slice(0, 5);
        }

        updateHandInfo();
        showCurrentStreet();
    }
}

function generateFullBoard(heroCards) {
    // Pre-generate all 5 board cards at hand start, excluding hero's cards
    const usedCards = new Set(heroCards);
    const deck = createDeck()
        .map(c => `${c.rank}${c.suit}`)
        .filter(c => !usedCards.has(c));
    shuffle(deck);
    return deck.slice(0, 5);
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

function saveHandToSession() {
    currentSession.hands.push(currentHand);

    // Save session after every hand (storage handles deduplication by ID)
    // This ensures sessions are saved even if user plays < 5 hands
    currentSession.endTime = new Date().toISOString();
    storage.saveSession(currentSession);
}

function updateStats() {
    if (!statsEl) return;

    const accuracy = currentSession.totalDecisions > 0
        ? currentSession.correctDecisions / currentSession.totalDecisions
        : 0;

    statsEl.innerHTML = '';
    statsEl.className = 'session-stats';

    const handsEl = createStatBox(currentSession.hands.length, 'Hands');
    const decisionsEl = createStatBox(currentSession.totalDecisions, 'Decisions');
    const correctEl = createStatBox(currentSession.correctDecisions, 'Correct');
    const accuracyEl = createStatBox(formatPercentage(accuracy, 0), 'Accuracy');

    statsEl.appendChild(handsEl);
    statsEl.appendChild(decisionsEl);
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

export default {
    render
};
