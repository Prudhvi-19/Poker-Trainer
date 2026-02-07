// C-Bet Strategy Trainer Module
// Learn when to continuation bet and what sizing to use

import { createCard } from '../components/Card.js';
import { showToast } from '../utils/helpers.js';
import storage from '../utils/storage.js';

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['\u2660', '\u2665', '\u2666', '\u2663']; // ♠ ♥ ♦ ♣

// C-bet decisions
const CBET_ACTIONS = {
    BET_SMALL: 'bet-small',    // 25-33% pot
    BET_MEDIUM: 'bet-medium',  // 50-66% pot
    BET_LARGE: 'bet-large',    // 75-100% pot
    CHECK: 'check'
};

// Positions
const POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

let currentScenario = null;
let stats = { correct: 0, total: 0 };
let container = null;

function render() {
    container = document.createElement('div');
    container.className = 'trainer-container';

    // Header
    const header = document.createElement('div');
    header.className = 'trainer-header';
    header.innerHTML = `
        <h1>C-Bet Strategy Trainer</h1>
        <p class="trainer-subtitle">Learn when to continuation bet and what sizing to use</p>
    `;
    container.appendChild(header);

    // Info card
    const infoCard = document.createElement('div');
    infoCard.className = 'card info-card mb-lg';
    infoCard.innerHTML = `
        <h3>C-Bet Sizing Guide</h3>
        <div class="sizing-guide">
            <div class="sizing-item">
                <span class="sizing-label">Small (25-33%)</span>
                <span class="sizing-desc">Dry boards, range advantage, many bluffs</span>
            </div>
            <div class="sizing-item">
                <span class="sizing-label">Medium (50-66%)</span>
                <span class="sizing-desc">Semi-wet boards, balanced range</span>
            </div>
            <div class="sizing-item">
                <span class="sizing-label">Large (75-100%)</span>
                <span class="sizing-desc">Wet boards, polarized range, protection needed</span>
            </div>
            <div class="sizing-item">
                <span class="sizing-label">Check</span>
                <span class="sizing-desc">Board favors opponent, weak range, trap with monsters</span>
            </div>
        </div>
    `;
    container.appendChild(infoCard);

    // Stats display
    const statsEl = document.createElement('div');
    statsEl.id = 'cbet-stats';
    statsEl.className = 'stats-bar';
    container.appendChild(statsEl);

    // Main training area
    const mainArea = document.createElement('div');
    mainArea.className = 'card training-card';
    mainArea.id = 'cbet-main';
    container.appendChild(mainArea);

    // Start first scenario
    generateScenario();
    updateStats();

    return container;
}

function generateScenario() {
    // Generate scenario components
    const heroPosition = getRandomPosition(['UTG', 'HJ', 'CO', 'BTN']);
    const villainPosition = 'BB'; // Most common c-bet scenario
    const board = generateRandomFlop();
    const heroHand = generateHeroHand(board);
    const potSize = Math.floor(Math.random() * 15 + 6); // 6-20 BB

    // Analyze the situation
    const boardAnalysis = analyzeBoard(board);
    const handStrength = analyzeHandStrength(heroHand, board);

    // Determine correct action
    const { action, reason } = determineCorrectCbet(boardAnalysis, handStrength, heroPosition);

    currentScenario = {
        heroPosition,
        villainPosition,
        board,
        heroHand,
        potSize,
        boardAnalysis,
        handStrength,
        correctAction: action,
        correctReason: reason
    };

    renderScenario();
}

function getRandomPosition(positions) {
    return positions[Math.floor(Math.random() * positions.length)];
}

function generateRandomFlop() {
    const deck = [];
    for (const rank of RANKS) {
        for (const suit of SUITS) {
            deck.push({ rank, suit });
        }
    }

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck.slice(0, 3);
}

function generateHeroHand(board) {
    const usedCards = new Set(board.map(c => `${c.rank}${c.suit}`));
    const deck = [];

    for (const rank of RANKS) {
        for (const suit of SUITS) {
            const card = `${rank}${suit}`;
            if (!usedCards.has(card)) {
                deck.push({ rank, suit });
            }
        }
    }

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Generate realistic preflop raising hands
    const handTypes = [
        // Premium hands
        { ranks: ['A', 'A'] },
        { ranks: ['K', 'K'] },
        { ranks: ['Q', 'Q'] },
        { ranks: ['A', 'K'] },
        // Broadway
        { ranks: ['A', 'Q'] },
        { ranks: ['A', 'J'] },
        { ranks: ['K', 'Q'] },
        // Medium pairs
        { ranks: ['J', 'J'] },
        { ranks: ['T', 'T'] },
        { ranks: ['9', '9'] },
        // Suited connectors
        { ranks: ['J', 'T'] },
        { ranks: ['T', '9'] },
        { ranks: ['9', '8'] },
        // Air / missed
        { ranks: ['A', '5'] },
        { ranks: ['K', '7'] },
        { ranks: ['Q', '8'] }
    ];

    const selectedType = handTypes[Math.floor(Math.random() * handTypes.length)];

    // Find cards matching the ranks
    const hand = [];
    const availableCards = [...deck];

    for (const targetRank of selectedType.ranks) {
        const idx = availableCards.findIndex(c => c.rank === targetRank);
        if (idx !== -1) {
            hand.push(availableCards.splice(idx, 1)[0]);
        } else {
            // Fallback to random card
            hand.push(availableCards.shift());
        }
    }

    return hand;
}

function analyzeBoard(board) {
    const ranks = board.map(c => RANKS.indexOf(c.rank));
    const suits = board.map(c => c.suit);

    ranks.sort((a, b) => b - a);

    // Paired?
    const isPaired = ranks[0] === ranks[1] || ranks[1] === ranks[2] || ranks[0] === ranks[2];

    // Suits
    const suitCounts = {};
    suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
    const maxSuitCount = Math.max(...Object.values(suitCounts));

    const isMonotone = maxSuitCount === 3;
    const isTwoTone = maxSuitCount === 2;

    // Connectivity
    const spread = ranks[0] - ranks[2];
    const isConnected = spread <= 4 && !isPaired;

    // Height
    const highCards = ranks.filter(r => r >= 9).length;
    const isHigh = highCards >= 2;
    const isLow = ranks[0] <= 7;

    // Texture
    let texture;
    if (isPaired || (!isTwoTone && !isMonotone && !isConnected)) {
        texture = 'dry';
    } else if (isMonotone || (isTwoTone && isConnected)) {
        texture = 'wet';
    } else {
        texture = 'semi-wet';
    }

    // Who it favors
    let favorRaiser = isHigh;
    let favorCaller = isLow && isConnected;

    return {
        isPaired,
        isMonotone,
        isTwoTone,
        isConnected,
        isHigh,
        isLow,
        texture,
        favorRaiser,
        favorCaller,
        spread
    };
}

function analyzeHandStrength(hand, board) {
    const handRanks = hand.map(c => RANKS.indexOf(c.rank));
    const boardRanks = board.map(c => RANKS.indexOf(c.rank));
    const allRanks = [...handRanks, ...boardRanks];

    // Check for pairs, sets, etc.
    const rankCounts = {};
    allRanks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);

    const counts = Object.values(rankCounts);
    const hasSet = counts.includes(3);
    const hasTwoPair = counts.filter(c => c >= 2).length >= 2;
    const hasOverpair = handRanks[0] === handRanks[1] && handRanks[0] > Math.max(...boardRanks);
    const hasTopPair = handRanks.some(r => r === Math.max(...boardRanks));
    const hasPair = counts.includes(2);

    // Check for draws
    const handSuits = hand.map(c => c.suit);
    const boardSuits = board.map(c => c.suit);
    const allSuits = [...handSuits, ...boardSuits];
    const suitCounts = {};
    allSuits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
    const hasFlushDraw = Object.values(suitCounts).some(c => c >= 4);

    // Overcards
    const hasOvercards = handRanks.some(r => r > Math.max(...boardRanks));

    // Backdoor draws (simplified)
    const hasBackdoorFlush = handSuits[0] === handSuits[1] && boardSuits.includes(handSuits[0]);

    let strength;
    if (hasSet || hasTwoPair) {
        strength = 'monster';
    } else if (hasOverpair || hasTopPair) {
        strength = 'strong';
    } else if (hasPair || hasFlushDraw) {
        strength = 'medium';
    } else if (hasOvercards || hasBackdoorFlush) {
        strength = 'weak-with-equity';
    } else {
        strength = 'air';
    }

    return {
        strength,
        hasSet,
        hasTwoPair,
        hasOverpair,
        hasTopPair,
        hasPair,
        hasFlushDraw,
        hasOvercards,
        hasBackdoorFlush
    };
}

function determineCorrectCbet(boardAnalysis, handStrength, position) {
    // Decision tree for c-betting

    // Strong made hands - usually bet for value
    if (handStrength.strength === 'monster') {
        if (boardAnalysis.texture === 'wet') {
            return {
                action: CBET_ACTIONS.BET_LARGE,
                reason: 'Monster hand on wet board - bet large for protection and value'
            };
        } else {
            return {
                action: CBET_ACTIONS.BET_SMALL,
                reason: 'Monster hand on dry board - bet small to keep opponent in'
            };
        }
    }

    if (handStrength.strength === 'strong') {
        if (boardAnalysis.texture === 'wet') {
            return {
                action: CBET_ACTIONS.BET_MEDIUM,
                reason: 'Strong hand on wet board - bet medium for value and protection'
            };
        } else if (boardAnalysis.texture === 'dry') {
            return {
                action: CBET_ACTIONS.BET_SMALL,
                reason: 'Strong hand on dry board - small bet is efficient, opponent has few draws'
            };
        } else {
            return {
                action: CBET_ACTIONS.BET_MEDIUM,
                reason: 'Strong hand on semi-wet board - standard value bet'
            };
        }
    }

    // Medium hands - context dependent
    if (handStrength.strength === 'medium') {
        if (boardAnalysis.favorRaiser && boardAnalysis.texture === 'dry') {
            return {
                action: CBET_ACTIONS.BET_SMALL,
                reason: 'Medium hand on dry raiser-favored board - small c-bet for thin value'
            };
        } else if (boardAnalysis.favorCaller) {
            return {
                action: CBET_ACTIONS.CHECK,
                reason: 'Medium hand on caller-favored board - check to control pot'
            };
        } else {
            return {
                action: CBET_ACTIONS.BET_SMALL,
                reason: 'Medium hand - small c-bet to maintain initiative'
            };
        }
    }

    // Weak hands with equity - can bluff or check
    if (handStrength.strength === 'weak-with-equity') {
        if (boardAnalysis.texture === 'dry' && boardAnalysis.favorRaiser) {
            return {
                action: CBET_ACTIONS.BET_SMALL,
                reason: 'Overcards on dry raiser-favored board - small c-bet as bluff'
            };
        } else if (handStrength.hasFlushDraw || handStrength.hasBackdoorFlush) {
            return {
                action: CBET_ACTIONS.BET_SMALL,
                reason: 'Draw with equity - small c-bet to build pot and potentially take it down'
            };
        } else {
            return {
                action: CBET_ACTIONS.CHECK,
                reason: 'Weak hand - check and realize equity, consider bluffing later streets'
            };
        }
    }

    // Air - check most of the time, occasionally bluff
    if (handStrength.strength === 'air') {
        if (boardAnalysis.texture === 'dry' && boardAnalysis.favorRaiser && !boardAnalysis.favorCaller) {
            // Can bluff on dry boards that favor us
            return {
                action: CBET_ACTIONS.BET_SMALL,
                reason: 'Air on dry raiser-favored board - small c-bet bluff is profitable'
            };
        } else {
            return {
                action: CBET_ACTIONS.CHECK,
                reason: 'Air on unfavorable board - give up and check, save chips'
            };
        }
    }

    // Default
    return {
        action: CBET_ACTIONS.CHECK,
        reason: 'Default - check when unsure'
    };
}

function renderScenario() {
    const mainArea = document.getElementById('cbet-main');
    if (!mainArea) return;

    mainArea.innerHTML = '';

    // Scenario info
    const scenarioInfo = document.createElement('div');
    scenarioInfo.className = 'scenario-info';
    scenarioInfo.innerHTML = `
        <div class="scenario-detail">
            <span class="detail-label">Your Position:</span>
            <span class="detail-value">${currentScenario.heroPosition}</span>
        </div>
        <div class="scenario-detail">
            <span class="detail-label">Opponent:</span>
            <span class="detail-value">${currentScenario.villainPosition}</span>
        </div>
        <div class="scenario-detail">
            <span class="detail-label">Pot:</span>
            <span class="detail-value">${currentScenario.potSize} BB</span>
        </div>
        <div class="scenario-detail">
            <span class="detail-label">Action:</span>
            <span class="detail-value">You raised preflop, BB called. Flop is dealt.</span>
        </div>
    `;
    mainArea.appendChild(scenarioInfo);

    // Hero hand
    const handSection = document.createElement('div');
    handSection.className = 'hand-section';

    const handLabel = document.createElement('div');
    handLabel.className = 'section-label';
    handLabel.textContent = 'YOUR HAND';
    handSection.appendChild(handLabel);

    const handCards = document.createElement('div');
    handCards.className = 'hand-cards';
    currentScenario.heroHand.forEach(card => {
        const cardEl = createCard(card);
        handCards.appendChild(cardEl);
    });
    handSection.appendChild(handCards);
    mainArea.appendChild(handSection);

    // Board
    const boardSection = document.createElement('div');
    boardSection.className = 'board-display';

    const boardLabel = document.createElement('div');
    boardLabel.className = 'board-label';
    boardLabel.textContent = 'FLOP';
    boardSection.appendChild(boardLabel);

    const boardCards = document.createElement('div');
    boardCards.className = 'board-cards';
    currentScenario.board.forEach(card => {
        const cardEl = createCard(card);
        cardEl.classList.add('board-card');
        boardCards.appendChild(cardEl);
    });
    boardSection.appendChild(boardCards);
    mainArea.appendChild(boardSection);

    // Question
    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    const questionEl = document.createElement('h2');
    questionEl.className = 'question-text';
    questionEl.textContent = 'What\'s your c-bet action?';
    questionSection.appendChild(questionEl);

    // Options
    const optionsEl = document.createElement('div');
    optionsEl.className = 'options-grid options-4';

    const options = [
        { value: CBET_ACTIONS.CHECK, label: 'Check', desc: 'Give up / trap' },
        { value: CBET_ACTIONS.BET_SMALL, label: 'Small Bet', desc: '25-33% pot' },
        { value: CBET_ACTIONS.BET_MEDIUM, label: 'Medium Bet', desc: '50-66% pot' },
        { value: CBET_ACTIONS.BET_LARGE, label: 'Large Bet', desc: '75-100% pot' }
    ];

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span class="option-label">${opt.label}</span>
            <span class="option-desc">${opt.desc}</span>
        `;
        btn.addEventListener('click', () => handleAnswer(opt.value));
        optionsEl.appendChild(btn);
    });

    questionSection.appendChild(optionsEl);
    mainArea.appendChild(questionSection);
}

function handleAnswer(answer) {
    stats.total++;

    const isCorrect = answer === currentScenario.correctAction;
    if (isCorrect) {
        stats.correct++;
    }

    // Stats tracked in-memory for this session

    showFeedback(isCorrect, answer);
    updateStats();
}

function showFeedback(isCorrect, userAnswer) {
    const mainArea = document.getElementById('cbet-main');
    if (!mainArea) return;

    // Disable buttons
    mainArea.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
    });

    const actionLabels = {
        [CBET_ACTIONS.CHECK]: 'Check',
        [CBET_ACTIONS.BET_SMALL]: 'Small Bet (25-33%)',
        [CBET_ACTIONS.BET_MEDIUM]: 'Medium Bet (50-66%)',
        [CBET_ACTIONS.BET_LARGE]: 'Large Bet (75-100%)'
    };

    // Feedback section
    const feedback = document.createElement('div');
    feedback.className = `feedback-section ${isCorrect ? 'correct' : 'incorrect'}`;

    feedback.innerHTML = `
        <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
        <div class="feedback-text">
            <strong>${isCorrect ? 'Correct!' : 'Incorrect'}</strong>
            <p>Best action: <strong>${actionLabels[currentScenario.correctAction]}</strong></p>
            <p class="feedback-explanation">${currentScenario.correctReason}</p>
        </div>
    `;

    // Analysis breakdown
    const breakdown = document.createElement('div');
    breakdown.className = 'board-breakdown';
    breakdown.innerHTML = `
        <h4>Situation Analysis:</h4>
        <ul>
            <li><strong>Board Texture:</strong> ${currentScenario.boardAnalysis.texture}</li>
            <li><strong>Board Favors:</strong> ${currentScenario.boardAnalysis.favorRaiser ? 'Raiser' : currentScenario.boardAnalysis.favorCaller ? 'Caller' : 'Neutral'}</li>
            <li><strong>Your Hand Strength:</strong> ${currentScenario.handStrength.strength}</li>
            ${currentScenario.handStrength.hasTopPair ? '<li>You have top pair</li>' : ''}
            ${currentScenario.handStrength.hasOverpair ? '<li>You have an overpair</li>' : ''}
            ${currentScenario.handStrength.hasFlushDraw ? '<li>You have a flush draw</li>' : ''}
            ${currentScenario.handStrength.hasOvercards ? '<li>You have overcards</li>' : ''}
        </ul>
    `;
    feedback.appendChild(breakdown);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = 'Next Scenario';
    nextBtn.style.marginTop = '1rem';
    nextBtn.addEventListener('click', generateScenario);
    feedback.appendChild(nextBtn);

    mainArea.appendChild(feedback);

    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateStats() {
    const statsEl = document.getElementById('cbet-stats');
    if (!statsEl) return;

    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

    statsEl.innerHTML = `
        <div class="stat-item">
            <span class="stat-value">${stats.correct}</span>
            <span class="stat-label">Correct</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${stats.total}</span>
            <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${accuracy}%</span>
            <span class="stat-label">Accuracy</span>
        </div>
    `;
}

export default {
    render
};
