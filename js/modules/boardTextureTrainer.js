// Board Texture Trainer Module
// Learn to quickly identify board textures and who they favor

import { createCard } from '../components/Card.js';
import { showToast } from '../utils/helpers.js';
import storage from '../utils/storage.js';

// Board texture categories
const TEXTURE_TYPES = {
    DRY: 'dry',
    WET: 'wet',
    SEMI_WET: 'semi-wet'
};

// Who the board favors
const BOARD_FAVOR = {
    RAISER: 'raiser',      // Preflop aggressor (opener/3-bettor)
    CALLER: 'caller',      // Preflop caller (defender)
    NEUTRAL: 'neutral'     // Neither has significant advantage
};

// Board characteristics
const CHARACTERISTICS = {
    PAIRED: 'paired',
    MONOTONE: 'monotone',         // 3 of same suit
    TWO_TONE: 'two-tone',         // 2 of same suit
    RAINBOW: 'rainbow',           // 3 different suits
    CONNECTED: 'connected',       // 3 cards within 4 ranks
    DISCONNECTED: 'disconnected', // Gaps between cards
    HIGH: 'high',                 // Contains 2+ broadway cards
    LOW: 'low',                   // All cards 8 or below
    MIXED: 'mixed'                // Mix of high and low
};

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['\u2660', '\u2665', '\u2666', '\u2663']; // ♠ ♥ ♦ ♣

let currentBoard = null;
let currentQuestion = null;
let stats = { correct: 0, total: 0 };
let container = null;

function render() {
    container = document.createElement('div');
    container.className = 'trainer-container';

    // Header
    const header = document.createElement('div');
    header.className = 'trainer-header';
    header.innerHTML = `
        <h1>Board Texture Trainer</h1>
        <p class="trainer-subtitle">Learn to quickly read flop textures and understand board dynamics</p>
    `;
    container.appendChild(header);

    // Stats display
    const statsEl = document.createElement('div');
    statsEl.id = 'texture-stats';
    statsEl.className = 'stats-bar';
    container.appendChild(statsEl);

    // Main training area
    const mainArea = document.createElement('div');
    mainArea.className = 'card training-card';
    mainArea.id = 'texture-main';
    container.appendChild(mainArea);

    // Start first question
    generateQuestion();
    updateStats();

    return container;
}

function generateQuestion() {
    // Generate a random flop
    currentBoard = generateRandomFlop();

    // Analyze the board
    const analysis = analyzeBoard(currentBoard);

    // Pick a random question type
    const questionTypes = ['texture', 'favor', 'characteristics'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    currentQuestion = {
        type: questionType,
        board: currentBoard,
        analysis: analysis
    };

    renderQuestion();
}

function generateRandomFlop() {
    const deck = [];
    for (const rank of RANKS) {
        for (const suit of SUITS) {
            deck.push({ rank, suit });
        }
    }

    // Shuffle and pick 3
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck.slice(0, 3);
}

function analyzeBoard(board) {
    const ranks = board.map(c => RANKS.indexOf(c.rank));
    const suits = board.map(c => c.suit);

    // Sort ranks descending
    ranks.sort((a, b) => b - a);

    // Check for pair
    const isPaired = ranks[0] === ranks[1] || ranks[1] === ranks[2] || ranks[0] === ranks[2];

    // Check suit distribution
    const suitCounts = {};
    suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
    const maxSuitCount = Math.max(...Object.values(suitCounts));

    let suitType;
    if (maxSuitCount === 3) suitType = CHARACTERISTICS.MONOTONE;
    else if (maxSuitCount === 2) suitType = CHARACTERISTICS.TWO_TONE;
    else suitType = CHARACTERISTICS.RAINBOW;

    // Check connectivity (gaps between cards)
    const spread = ranks[0] - ranks[2];
    const isConnected = spread <= 4 && !isPaired;

    // Check high/low
    const highCards = ranks.filter(r => r >= 9).length; // T or higher
    let heightType;
    if (highCards >= 2) heightType = CHARACTERISTICS.HIGH;
    else if (ranks[0] <= 7) heightType = CHARACTERISTICS.LOW;
    else heightType = CHARACTERISTICS.MIXED;

    // Determine overall texture
    let texture;
    let textureReason;

    if (isPaired) {
        texture = TEXTURE_TYPES.DRY;
        textureReason = 'Paired boards reduce drawing possibilities';
    } else if (suitType === CHARACTERISTICS.MONOTONE) {
        texture = TEXTURE_TYPES.WET;
        textureReason = 'Monotone boards have flush possibilities';
    } else if (suitType === CHARACTERISTICS.TWO_TONE && isConnected) {
        texture = TEXTURE_TYPES.WET;
        textureReason = 'Two-tone and connected = many draws possible';
    } else if (suitType === CHARACTERISTICS.RAINBOW && !isConnected) {
        texture = TEXTURE_TYPES.DRY;
        textureReason = 'Rainbow and disconnected = few draws';
    } else if (suitType === CHARACTERISTICS.TWO_TONE || isConnected) {
        texture = TEXTURE_TYPES.SEMI_WET;
        textureReason = 'Some drawing possibilities exist';
    } else {
        texture = TEXTURE_TYPES.DRY;
        textureReason = 'Limited drawing possibilities';
    }

    // Determine who the board favors
    let favor;
    let favorReason;

    if (heightType === CHARACTERISTICS.HIGH) {
        favor = BOARD_FAVOR.RAISER;
        favorReason = 'High boards hit preflop raiser\'s range (AK, AQ, KQ, etc.)';
    } else if (heightType === CHARACTERISTICS.LOW && isConnected) {
        favor = BOARD_FAVOR.CALLER;
        favorReason = 'Low connected boards hit caller\'s range (suited connectors, small pairs)';
    } else if (isPaired && ranks[0] >= 9) {
        favor = BOARD_FAVOR.RAISER;
        favorReason = 'High paired boards favor raiser\'s broadway holdings';
    } else if (isPaired && ranks[0] <= 6) {
        favor = BOARD_FAVOR.CALLER;
        favorReason = 'Low paired boards favor caller\'s wider range';
    } else {
        favor = BOARD_FAVOR.NEUTRAL;
        favorReason = 'Neither player has a significant range advantage';
    }

    return {
        texture,
        textureReason,
        favor,
        favorReason,
        isPaired,
        suitType,
        isConnected,
        heightType,
        spread
    };
}

function renderQuestion() {
    const mainArea = document.getElementById('texture-main');
    if (!mainArea) return;

    mainArea.innerHTML = '';

    // Board display
    const boardSection = document.createElement('div');
    boardSection.className = 'board-display';

    const boardLabel = document.createElement('div');
    boardLabel.className = 'board-label';
    boardLabel.textContent = 'FLOP';
    boardSection.appendChild(boardLabel);

    const boardCards = document.createElement('div');
    boardCards.className = 'board-cards';
    currentBoard.forEach(card => {
        const cardEl = createCard(card);
        cardEl.classList.add('board-card');
        boardCards.appendChild(cardEl);
    });
    boardSection.appendChild(boardCards);

    mainArea.appendChild(boardSection);

    // Question
    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    let questionText = '';
    let options = [];

    switch (currentQuestion.type) {
        case 'texture':
            questionText = 'What is the texture of this board?';
            options = [
                { value: TEXTURE_TYPES.DRY, label: 'Dry', desc: 'Few draws possible' },
                { value: TEXTURE_TYPES.SEMI_WET, label: 'Semi-Wet', desc: 'Some draws possible' },
                { value: TEXTURE_TYPES.WET, label: 'Wet', desc: 'Many draws possible' }
            ];
            break;

        case 'favor':
            questionText = 'Who does this board favor?';
            options = [
                { value: BOARD_FAVOR.RAISER, label: 'Preflop Raiser', desc: 'Opener/3-bettor' },
                { value: BOARD_FAVOR.CALLER, label: 'Preflop Caller', desc: 'Defender' },
                { value: BOARD_FAVOR.NEUTRAL, label: 'Neutral', desc: 'Neither has advantage' }
            ];
            break;

        case 'characteristics':
            questionText = 'Is this board connected?';
            options = [
                { value: 'connected', label: 'Yes - Connected', desc: 'Cards within 4 ranks' },
                { value: 'disconnected', label: 'No - Disconnected', desc: 'Gaps between cards' }
            ];
            break;
    }

    const questionEl = document.createElement('h2');
    questionEl.className = 'question-text';
    questionEl.textContent = questionText;
    questionSection.appendChild(questionEl);

    // Options
    const optionsEl = document.createElement('div');
    optionsEl.className = 'options-grid';

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

    let isCorrect = false;
    let correctAnswer = '';
    let explanation = '';

    switch (currentQuestion.type) {
        case 'texture':
            isCorrect = answer === currentQuestion.analysis.texture;
            correctAnswer = currentQuestion.analysis.texture.toUpperCase();
            explanation = currentQuestion.analysis.textureReason;
            break;

        case 'favor':
            isCorrect = answer === currentQuestion.analysis.favor;
            correctAnswer = currentQuestion.analysis.favor === BOARD_FAVOR.RAISER ? 'PREFLOP RAISER' :
                           currentQuestion.analysis.favor === BOARD_FAVOR.CALLER ? 'PREFLOP CALLER' : 'NEUTRAL';
            explanation = currentQuestion.analysis.favorReason;
            break;

        case 'characteristics':
            const userSaysConnected = answer === 'connected';
            isCorrect = userSaysConnected === currentQuestion.analysis.isConnected;
            correctAnswer = currentQuestion.analysis.isConnected ? 'CONNECTED' : 'DISCONNECTED';
            explanation = currentQuestion.analysis.isConnected
                ? `Spread is ${currentQuestion.analysis.spread} ranks (≤4 = connected)`
                : `Spread is ${currentQuestion.analysis.spread} ranks (>4 = disconnected)`;
            break;
    }

    if (isCorrect) {
        stats.correct++;
    }

    // Save stats
    // Stats tracked in-memory for this session

    // Show feedback
    showFeedback(isCorrect, correctAnswer, explanation);
    updateStats();
}

function showFeedback(isCorrect, correctAnswer, explanation) {
    const mainArea = document.getElementById('texture-main');
    if (!mainArea) return;

    // Disable buttons
    mainArea.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
    });

    // Add feedback section
    const feedback = document.createElement('div');
    feedback.className = `feedback-section ${isCorrect ? 'correct' : 'incorrect'}`;

    feedback.innerHTML = `
        <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
        <div class="feedback-text">
            <strong>${isCorrect ? 'Correct!' : 'Incorrect'}</strong>
            <p>The answer is: <strong>${correctAnswer}</strong></p>
            <p class="feedback-explanation">${explanation}</p>
        </div>
    `;

    // Board breakdown
    const breakdown = document.createElement('div');
    breakdown.className = 'board-breakdown';
    breakdown.innerHTML = `
        <h4>Board Analysis:</h4>
        <ul>
            <li><strong>Texture:</strong> ${currentQuestion.analysis.texture}</li>
            <li><strong>Suit:</strong> ${currentQuestion.analysis.suitType}</li>
            <li><strong>Height:</strong> ${currentQuestion.analysis.heightType}</li>
            <li><strong>Paired:</strong> ${currentQuestion.analysis.isPaired ? 'Yes' : 'No'}</li>
            <li><strong>Connected:</strong> ${currentQuestion.analysis.isConnected ? 'Yes' : 'No'} (spread: ${currentQuestion.analysis.spread})</li>
            <li><strong>Favors:</strong> ${currentQuestion.analysis.favor}</li>
        </ul>
    `;
    feedback.appendChild(breakdown);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = 'Next Board';
    nextBtn.style.marginTop = '1rem';
    nextBtn.addEventListener('click', generateQuestion);
    feedback.appendChild(nextBtn);

    mainArea.appendChild(feedback);

    // Scroll to feedback
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateStats() {
    const statsEl = document.getElementById('texture-stats');
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
