// Board Texture Trainer Module
// Learn to quickly identify board textures and who they favor

import { createCard } from '../components/Card.js';
import { showToast } from '../utils/helpers.js';
import { generateBoard } from '../utils/deckManager.js';
import { analyzeBoard as sharedAnalyzeBoard } from '../utils/boardAnalyzer.js';

let currentBoard = null;
let currentQuestion = null;
let stats = { correct: 0, total: 0 };
let container = null;
let mainAreaEl = null;
let statsBarEl = null;

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
    statsBarEl = document.createElement('div');
    statsBarEl.className = 'stats-bar';
    container.appendChild(statsBarEl);

    // Main training area
    mainAreaEl = document.createElement('div');
    mainAreaEl.className = 'card training-card';
    container.appendChild(mainAreaEl);

    // Start first question
    generateQuestion();
    updateStats();

    return container;
}

function generateQuestion() {
    // Generate a random flop using shared deck manager
    currentBoard = generateBoard(3);

    // Analyze the board using shared analyzer
    const analysis = sharedAnalyzeBoard(currentBoard);

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

// Map shared texture categories to display-friendly format
function mapSuitType(analysis) {
    if (analysis.isMonotone) return 'monotone';
    if (analysis.isTwoTone) return 'two-tone';
    return 'rainbow';
}

function mapHeightType(analysis) {
    if (analysis.isHigh) return 'high';
    if (analysis.isLow) return 'low';
    return 'mixed';
}

// Map shared texture to simple dry/semi-wet/wet for this trainer's quiz
function mapTextureForQuiz(analysis) {
    const tex = analysis.texture;
    if (tex === 'DRY' || tex === 'STATIC') return 'dry';
    if (tex === 'WET' || tex === 'DYNAMIC') return 'wet';
    return 'semi-wet';
}

function renderQuestion() {
    if (!mainAreaEl) return;

    mainAreaEl.innerHTML = '';

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

    mainAreaEl.appendChild(boardSection);

    // Question
    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    let questionText = '';
    let options = [];

    switch (currentQuestion.type) {
        case 'texture':
            questionText = 'What is the texture of this board?';
            options = [
                { value: 'dry', label: 'Dry', desc: 'Few draws possible' },
                { value: 'semi-wet', label: 'Semi-Wet', desc: 'Some draws possible' },
                { value: 'wet', label: 'Wet', desc: 'Many draws possible' }
            ];
            break;

        case 'favor':
            questionText = 'Who does this board favor?';
            options = [
                { value: 'raiser', label: 'Preflop Raiser', desc: 'Opener/3-bettor' },
                { value: 'caller', label: 'Preflop Caller', desc: 'Defender' },
                { value: 'neutral', label: 'Neutral', desc: 'Neither has advantage' }
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
    mainAreaEl.appendChild(questionSection);
}

function handleAnswer(answer) {
    stats.total++;

    let isCorrect = false;
    let correctAnswer = '';
    let explanation = '';

    const simpleTexture = mapTextureForQuiz(currentQuestion.analysis);

    switch (currentQuestion.type) {
        case 'texture':
            isCorrect = answer === simpleTexture;
            correctAnswer = simpleTexture.toUpperCase();
            explanation = currentQuestion.analysis.textureReason;
            break;

        case 'favor':
            isCorrect = answer === currentQuestion.analysis.favor;
            correctAnswer = currentQuestion.analysis.favor === 'raiser' ? 'PREFLOP RAISER' :
                           currentQuestion.analysis.favor === 'caller' ? 'PREFLOP CALLER' : 'NEUTRAL';
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
    if (!mainAreaEl) return;

    // Disable buttons
    mainAreaEl.querySelectorAll('.option-btn').forEach(btn => {
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
    const a = currentQuestion.analysis;
    breakdown.innerHTML = `
        <h4>Board Analysis:</h4>
        <ul>
            <li><strong>Texture:</strong> ${a.texture}</li>
            <li><strong>Suit:</strong> ${mapSuitType(a)}</li>
            <li><strong>Height:</strong> ${mapHeightType(a)}</li>
            <li><strong>Paired:</strong> ${a.isPaired ? 'Yes' : 'No'}</li>
            <li><strong>Connected:</strong> ${a.isConnected ? 'Yes' : 'No'} (spread: ${a.spread})</li>
            <li><strong>Favors:</strong> ${a.favor}</li>
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

    mainAreaEl.appendChild(feedback);

    // Scroll to feedback
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateStats() {
    if (!statsBarEl) return;

    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

    statsBarEl.innerHTML = `
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
