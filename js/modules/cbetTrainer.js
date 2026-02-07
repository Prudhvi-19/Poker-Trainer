// C-Bet Strategy Trainer Module
// Learn when to continuation bet and what sizing to use

import { createCard } from '../components/Card.js';
import { showToast } from '../utils/helpers.js';
import { generateBoard, generateHeroHand as generateHeroHandFromDeck } from '../utils/deckManager.js';
import { analyzeBoard as sharedAnalyzeBoard } from '../utils/boardAnalyzer.js';
import { evaluateHandBoard } from '../utils/handEvaluator.js';

// C-bet decisions
const CBET_ACTIONS = {
    BET_SMALL: 'bet-small',    // 25-33% pot
    BET_MEDIUM: 'bet-medium',  // 50-66% pot
    BET_LARGE: 'bet-large',    // 75-100% pot
    CHECK: 'check'
};

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

// Hero hand types for c-bet scenarios (preflop raiser range)
const RAISER_HAND_TYPES = [
    ['A', 'A'], ['K', 'K'], ['Q', 'Q'], ['A', 'K'],
    ['A', 'Q'], ['A', 'J'], ['K', 'Q'],
    ['J', 'J'], ['T', 'T'], ['9', '9'],
    ['J', 'T'], ['T', '9'], ['9', '8'],
    ['A', '5'], ['K', '7'], ['Q', '8']
];

function generateScenario() {
    const positions = ['UTG', 'HJ', 'CO', 'BTN'];
    const heroPosition = positions[Math.floor(Math.random() * positions.length)];
    const villainPosition = 'BB';
    const board = generateBoard(3);
    const heroHand = generateHeroHandFromDeck(board, RAISER_HAND_TYPES);
    const potSize = Math.floor(Math.random() * 15 + 6); // 6-20 BB

    // Use shared analyzers
    const boardAnalysis = sharedAnalyzeBoard(board);
    const handEval = evaluateHandBoard(heroHand, board);

    // Map shared strength to local categories for c-bet decision tree
    const handStrength = mapToLocalStrength(handEval, heroHand, board);

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

/**
 * Map shared hand evaluator output to c-bet specific strength categories
 */
function mapToLocalStrength(handEval, hand, board) {
    const { strength, hasFlushDraw, hasOvercards, hasBackdoorFlush, hasTopPair, hasOverpair, hasSet, hasTwoPair } = handEval;
    let localStrength;

    if (strength === 'MONSTER') localStrength = 'monster';
    else if (strength === 'STRONG' || strength === 'MEDIUM_STRONG') localStrength = 'strong';
    else if (strength === 'MEDIUM' || strength === 'DRAW') localStrength = 'medium';
    else if (strength === 'STRONG_DRAW' || strength === 'OVERCARDS') localStrength = 'weak-with-equity';
    else localStrength = 'air';

    return {
        strength: localStrength,
        hasSet,
        hasTwoPair,
        hasOverpair,
        hasTopPair,
        hasPair: handEval.hasPairOnBoard,
        hasFlushDraw,
        hasOvercards,
        hasBackdoorFlush
    };
}

function determineCorrectCbet(boardAnalysis, handStrength, position) {
    // Map shared texture to simple categories for decision tree
    const tex = boardAnalysis.texture; // DRY, WET, STATIC, DYNAMIC
    const isWet = tex === 'WET' || tex === 'DYNAMIC';
    const isDry = tex === 'DRY' || tex === 'STATIC';
    const favorRaiser = boardAnalysis.favor === 'raiser';
    const favorCaller = boardAnalysis.favor === 'caller';

    // Strong made hands - usually bet for value
    if (handStrength.strength === 'monster') {
        if (isWet) {
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
        if (isWet) {
            return {
                action: CBET_ACTIONS.BET_MEDIUM,
                reason: 'Strong hand on wet board - bet medium for value and protection'
            };
        } else if (isDry) {
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
        if (favorRaiser && isDry) {
            return {
                action: CBET_ACTIONS.BET_SMALL,
                reason: 'Medium hand on dry raiser-favored board - small c-bet for thin value'
            };
        } else if (favorCaller) {
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
        if (isDry && favorRaiser) {
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
        if (isDry && favorRaiser && !favorCaller) {
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
            <li><strong>Board Favors:</strong> ${currentScenario.boardAnalysis.favor === 'raiser' ? 'Raiser' : currentScenario.boardAnalysis.favor === 'caller' ? 'Caller' : 'Neutral'}</li>
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
