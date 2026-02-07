// Bet Sizing Trainer Module
// Learn optimal bet sizing for different situations

import { createCard } from '../components/Card.js';
import { showToast } from '../utils/helpers.js';
import { generateBoard, generateHeroHand } from '../utils/deckManager.js';
import { analyzeBoard as sharedAnalyzeBoard, getSimpleTexture } from '../utils/boardAnalyzer.js';
import { evaluateHandBoard } from '../utils/handEvaluator.js';

// Bet sizing categories
const BET_SIZES = {
    SMALL: { label: '25-33%', value: 0.3, desc: 'Thin value, many bluffs' },
    MEDIUM: { label: '50-66%', value: 0.58, desc: 'Balanced, standard' },
    LARGE: { label: '75-100%', value: 0.85, desc: 'Polarized, protection' },
    OVERBET: { label: '125%+', value: 1.5, desc: 'Very polarized, nuts or air' }
};

// Scenario types
const SCENARIOS = ['flop-cbet', 'turn-bet', 'river-value', 'river-bluff'];

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
        <h1>Bet Sizing Trainer</h1>
        <p class="trainer-subtitle">Master optimal bet sizing for every street and situation</p>
    `;
    container.appendChild(header);

    // Theory card
    const theoryCard = document.createElement('div');
    theoryCard.className = 'card info-card mb-lg';
    theoryCard.innerHTML = `
        <h3>Bet Sizing Principles</h3>
        <div class="theory-grid">
            <div class="theory-item">
                <h4>Small Bets (25-33%)</h4>
                <ul>
                    <li>Dry, static boards</li>
                    <li>Range advantage situations</li>
                    <li>Thin value with many bluffs</li>
                    <li>Keep villain's calling range wide</li>
                </ul>
            </div>
            <div class="theory-item">
                <h4>Medium Bets (50-66%)</h4>
                <ul>
                    <li>Semi-wet boards</li>
                    <li>Balanced value/bluff ratio</li>
                    <li>Standard, versatile sizing</li>
                    <li>When unsure, default here</li>
                </ul>
            </div>
            <div class="theory-item">
                <h4>Large Bets (75-100%)</h4>
                <ul>
                    <li>Wet, dynamic boards</li>
                    <li>Polarized range (strong or bluff)</li>
                    <li>Need protection from draws</li>
                    <li>Building pot with value hands</li>
                </ul>
            </div>
            <div class="theory-item">
                <h4>Overbets (125%+)</h4>
                <ul>
                    <li>Nut advantage situations</li>
                    <li>Very polarized (nuts or air)</li>
                    <li>River with capped villain range</li>
                    <li>Maximum pressure spots</li>
                </ul>
            </div>
        </div>
    `;
    container.appendChild(theoryCard);

    // Stats display
    const statsEl = document.createElement('div');
    statsEl.id = 'sizing-stats';
    statsEl.className = 'stats-bar';
    container.appendChild(statsEl);

    // Main training area
    const mainArea = document.createElement('div');
    mainArea.className = 'card training-card';
    mainArea.id = 'sizing-main';
    container.appendChild(mainArea);

    // Start first scenario
    generateScenario();
    updateStats();

    return container;
}

// Hand types for different scenario contexts
const SCENARIO_HAND_TYPES = {
    'river-value': [
        ['A', 'A'], ['K', 'K'], ['Q', 'Q'],
        ['A', 'K'], ['A', 'Q'], ['K', 'Q'],
        ['J', 'J'], ['T', 'T']
    ],
    'river-bluff': [
        ['A', '5'], ['A', '4'], ['K', '7'],
        ['Q', '8'], ['J', '7'], ['T', '6'],
        ['9', '8'], ['8', '7'], ['7', '6']
    ],
    default: [
        ['A', 'A'], ['K', 'K'], ['A', 'K'],
        ['Q', 'Q'], ['J', 'J'], ['A', 'Q'],
        ['T', '9'], ['9', '8'], ['7', '6']
    ]
};

// Map scenario type to number of board cards
const BOARD_SIZES = {
    'flop-cbet': 3,
    'turn-bet': 4,
    'river-value': 5,
    'river-bluff': 5
};

function generateScenario() {
    const scenarioType = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    const numCards = BOARD_SIZES[scenarioType] || 3;
    const board = generateBoard(numCards);
    const handTypes = SCENARIO_HAND_TYPES[scenarioType] || SCENARIO_HAND_TYPES.default;
    const heroHand = generateHeroHand(board, handTypes);
    const potSize = Math.floor(Math.random() * 30 + 10);

    const analysis = analyzeScenario(scenarioType, board, heroHand);

    currentScenario = {
        type: scenarioType,
        board,
        heroHand,
        potSize,
        analysis,
        correctSize: analysis.recommendedSize,
        correctReason: analysis.reason
    };

    renderScenario();
}

/**
 * Map shared hand evaluator output to bet sizing strength categories
 */
function mapToLocalStrength(handEval) {
    const { strength } = handEval;
    if (strength === 'MONSTER') return 'monster';
    if (strength === 'STRONG' || strength === 'MEDIUM_STRONG') return 'strong';
    return 'weak';
}

function analyzeScenario(type, board, hand) {
    // Use shared board analyzer
    const boardAnalysis = sharedAnalyzeBoard(board);
    const simpleTexture = getSimpleTexture(boardAnalysis);

    // Use shared hand evaluator
    const handEval = evaluateHandBoard(hand, board);
    const strength = mapToLocalStrength(handEval);

    // Determine sizing based on scenario type, texture, and hand strength
    let recommendedSize;
    let reason;

    switch (type) {
        case 'flop-cbet':
            if (simpleTexture === 'dry') {
                recommendedSize = 'SMALL';
                reason = 'Dry flop - small c-bet is efficient. Few draws threaten you, villain folds same hands to any size.';
            } else if (simpleTexture === 'wet') {
                recommendedSize = 'LARGE';
                reason = 'Wet flop - large bet protects against draws and charges maximum for equity. Villain has many draws.';
            } else {
                recommendedSize = 'MEDIUM';
                reason = 'Semi-wet flop - medium sizing is balanced. Some draws exist but not overwhelming.';
            }
            break;

        case 'turn-bet':
            if (strength === 'monster') {
                if (simpleTexture === 'wet') {
                    recommendedSize = 'LARGE';
                    reason = 'Monster on wet turn - bet large for protection and value. Draws need to pay.';
                } else {
                    recommendedSize = 'MEDIUM';
                    reason = 'Monster on dry turn - medium bet extracts value while keeping villain in.';
                }
            } else if (strength === 'strong') {
                recommendedSize = 'MEDIUM';
                reason = 'Strong hand on turn - standard medium sizing for value. Build the pot for river.';
            } else {
                recommendedSize = 'SMALL';
                reason = 'Weaker hand on turn - small sizing as a block bet or thin value.';
            }
            break;

        case 'river-value':
            if (strength === 'monster') {
                recommendedSize = 'OVERBET';
                reason = 'Monster on river - overbet for maximum value. Villain\'s range is capped, exploit with large sizing.';
            } else if (strength === 'strong') {
                recommendedSize = 'LARGE';
                reason = 'Strong hand on river - large value bet. Get paid by worse hands.';
            } else {
                recommendedSize = 'MEDIUM';
                reason = 'Medium strength on river - standard value sizing. Target specific worse hands.';
            }
            break;

        case 'river-bluff':
            if (boardAnalysis.isPaired || simpleTexture === 'dry') {
                recommendedSize = 'OVERBET';
                reason = 'Bluff on static river - overbet applies maximum pressure. Villain\'s bluff-catchers are uncomfortable.';
            } else {
                recommendedSize = 'LARGE';
                reason = 'Bluff on river - large bet creates fold equity. Need significant pressure to fold better hands.';
            }
            break;
    }

    return {
        texture: boardAnalysis.texture,
        strength,
        isPaired: boardAnalysis.isPaired,
        isHighBoard: boardAnalysis.isHigh,
        isConnected: boardAnalysis.isConnected,
        recommendedSize,
        reason
    };
}

function renderScenario() {
    const mainArea = document.getElementById('sizing-main');
    if (!mainArea) return;

    mainArea.innerHTML = '';

    // Scenario type label
    const typeLabel = document.createElement('div');
    typeLabel.className = 'scenario-type-label';
    const typeLabels = {
        'flop-cbet': 'FLOP C-BET',
        'turn-bet': 'TURN BET',
        'river-value': 'RIVER VALUE BET',
        'river-bluff': 'RIVER BLUFF'
    };
    typeLabel.innerHTML = `<span class="type-badge">${typeLabels[currentScenario.type]}</span>`;
    mainArea.appendChild(typeLabel);

    // Pot info
    const potInfo = document.createElement('div');
    potInfo.className = 'pot-info';
    potInfo.innerHTML = `<span class="pot-label">Pot:</span> <span class="pot-value">${currentScenario.potSize} BB</span>`;
    mainArea.appendChild(potInfo);

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

    const streetLabels = {
        3: 'FLOP',
        4: 'TURN',
        5: 'RIVER'
    };

    const boardLabel = document.createElement('div');
    boardLabel.className = 'board-label';
    boardLabel.textContent = streetLabels[currentScenario.board.length] || 'BOARD';
    boardSection.appendChild(boardLabel);

    const boardCards = document.createElement('div');
    boardCards.className = 'board-cards';
    currentScenario.board.forEach((card, idx) => {
        const cardEl = createCard(card);
        cardEl.classList.add('board-card');
        // Highlight latest card
        if (idx === currentScenario.board.length - 1 && currentScenario.board.length > 3) {
            cardEl.classList.add('new-card');
        }
        boardCards.appendChild(cardEl);
    });
    boardSection.appendChild(boardCards);
    mainArea.appendChild(boardSection);

    // Question
    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    const questionEl = document.createElement('h2');
    questionEl.className = 'question-text';
    questionEl.textContent = 'What bet size should you use?';
    questionSection.appendChild(questionEl);

    // Options
    const optionsEl = document.createElement('div');
    optionsEl.className = 'options-grid options-4';

    const options = [
        { value: 'SMALL', label: BET_SIZES.SMALL.label, desc: BET_SIZES.SMALL.desc },
        { value: 'MEDIUM', label: BET_SIZES.MEDIUM.label, desc: BET_SIZES.MEDIUM.desc },
        { value: 'LARGE', label: BET_SIZES.LARGE.label, desc: BET_SIZES.LARGE.desc },
        { value: 'OVERBET', label: BET_SIZES.OVERBET.label, desc: BET_SIZES.OVERBET.desc }
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

    const isCorrect = answer === currentScenario.correctSize;
    if (isCorrect) {
        stats.correct++;
    }

    // Stats tracked in-memory for this session

    showFeedback(isCorrect, answer);
    updateStats();
}

function showFeedback(isCorrect, userAnswer) {
    const mainArea = document.getElementById('sizing-main');
    if (!mainArea) return;

    // Disable buttons
    mainArea.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
    });

    // Feedback
    const feedback = document.createElement('div');
    feedback.className = `feedback-section ${isCorrect ? 'correct' : 'incorrect'}`;

    feedback.innerHTML = `
        <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
        <div class="feedback-text">
            <strong>${isCorrect ? 'Correct!' : 'Incorrect'}</strong>
            <p>Optimal sizing: <strong>${BET_SIZES[currentScenario.correctSize].label}</strong></p>
            <p class="feedback-explanation">${currentScenario.correctReason}</p>
        </div>
    `;

    // Analysis
    const analysis = document.createElement('div');
    analysis.className = 'board-breakdown';
    analysis.innerHTML = `
        <h4>Analysis:</h4>
        <ul>
            <li><strong>Board Texture:</strong> ${currentScenario.analysis.texture}</li>
            <li><strong>Hand Strength:</strong> ${currentScenario.analysis.strength}</li>
            <li><strong>Board Paired:</strong> ${currentScenario.analysis.isPaired ? 'Yes' : 'No'}</li>
            <li><strong>High Board:</strong> ${currentScenario.analysis.isHighBoard ? 'Yes' : 'No'}</li>
        </ul>
    `;
    feedback.appendChild(analysis);

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
    const statsEl = document.getElementById('sizing-stats');
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
