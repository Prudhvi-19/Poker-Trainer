// Pot Odds & MDF Trainer Module
// Master pot odds calculations and minimum defense frequency

import { showToast } from '../utils/helpers.js';
import storage from '../utils/storage.js';

// Question types
const QUESTION_TYPES = {
    POT_ODDS: 'pot-odds',           // Given bet, calculate pot odds
    EQUITY_NEEDED: 'equity-needed', // What equity do you need to call?
    MDF: 'mdf',                     // Minimum defense frequency
    BLUFF_FREQUENCY: 'bluff-freq'   // How often should villain be bluffing?
};

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
        <h1>Pot Odds & MDF Trainer</h1>
        <p class="trainer-subtitle">Master the math behind calling, folding, and bluffing decisions</p>
    `;
    container.appendChild(header);

    // Theory card
    const theoryCard = document.createElement('div');
    theoryCard.className = 'card info-card mb-lg';
    theoryCard.innerHTML = `
        <h3>Key Formulas</h3>
        <div class="formula-grid">
            <div class="formula-item">
                <h4>Pot Odds</h4>
                <code>Call / (Pot + Call)</code>
                <p>Example: 10 into 30 = 10/(30+10) = 25%</p>
            </div>
            <div class="formula-item">
                <h4>Equity Needed</h4>
                <code>Same as Pot Odds</code>
                <p>You need at least this equity to break-even call</p>
            </div>
            <div class="formula-item">
                <h4>MDF (Minimum Defense)</h4>
                <code>Pot / (Pot + Bet)</code>
                <p>How often you must continue to prevent profitable bluffs</p>
            </div>
            <div class="formula-item">
                <h4>Bluff-to-Value Ratio</h4>
                <code>Bet / (Pot + Bet)</code>
                <p>How often villain should bluff given their bet size</p>
            </div>
        </div>
        <div class="quick-reference">
            <h4>Quick Reference:</h4>
            <table class="reference-table">
                <tr><th>Bet Size</th><th>Pot Odds</th><th>MDF</th><th>Bluff %</th></tr>
                <tr><td>25% pot</td><td>20%</td><td>80%</td><td>20%</td></tr>
                <tr><td>33% pot</td><td>25%</td><td>75%</td><td>25%</td></tr>
                <tr><td>50% pot</td><td>33%</td><td>67%</td><td>33%</td></tr>
                <tr><td>66% pot</td><td>40%</td><td>60%</td><td>40%</td></tr>
                <tr><td>75% pot</td><td>43%</td><td>57%</td><td>43%</td></tr>
                <tr><td>100% pot</td><td>50%</td><td>50%</td><td>50%</td></tr>
                <tr><td>150% pot</td><td>60%</td><td>40%</td><td>60%</td></tr>
            </table>
        </div>
    `;
    container.appendChild(theoryCard);

    // Stats display
    const statsEl = document.createElement('div');
    statsEl.id = 'odds-stats';
    statsEl.className = 'stats-bar';
    container.appendChild(statsEl);

    // Main training area
    const mainArea = document.createElement('div');
    mainArea.className = 'card training-card';
    mainArea.id = 'odds-main';
    container.appendChild(mainArea);

    // Start first question
    generateQuestion();
    updateStats();

    return container;
}

function generateQuestion() {
    const types = Object.values(QUESTION_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];

    // Generate realistic pot and bet sizes
    const potSize = Math.floor(Math.random() * 80 + 20); // 20-100
    const betPercentages = [0.25, 0.33, 0.5, 0.66, 0.75, 1.0, 1.5];
    const betPercent = betPercentages[Math.floor(Math.random() * betPercentages.length)];
    const betSize = Math.round(potSize * betPercent);

    // Calculate correct answers
    const potAfterBet = potSize + betSize;
    const potOdds = (betSize / (potAfterBet + betSize)) * 100;
    const mdf = (potSize / potAfterBet) * 100;
    const bluffFreq = (betSize / potAfterBet) * 100;

    let question, correctAnswer, options, explanation;

    switch (type) {
        case QUESTION_TYPES.POT_ODDS:
            question = `The pot is ${potSize} BB. Villain bets ${betSize} BB (${Math.round(betPercent * 100)}% pot). What are your pot odds?`;
            correctAnswer = Math.round(potOdds);
            options = generateOptions(correctAnswer, 5, 60);
            explanation = `Pot odds = Call / (Pot + Call) = ${betSize} / (${potSize} + ${betSize} + ${betSize}) = ${betSize} / ${potAfterBet + betSize} = ${correctAnswer}%`;
            break;

        case QUESTION_TYPES.EQUITY_NEEDED:
            question = `The pot is ${potSize} BB. Villain bets ${betSize} BB. What equity do you need to call?`;
            correctAnswer = Math.round(potOdds);
            options = generateOptions(correctAnswer, 5, 60);
            explanation = `You need equity ≥ pot odds to break even. Equity needed = ${betSize} / ${potAfterBet + betSize} = ${correctAnswer}%`;
            break;

        case QUESTION_TYPES.MDF:
            question = `The pot is ${potSize} BB. Villain bets ${betSize} BB. What is your Minimum Defense Frequency (MDF)?`;
            correctAnswer = Math.round(mdf);
            options = generateOptions(correctAnswer, 30, 90);
            explanation = `MDF = Pot / (Pot + Bet) = ${potSize} / ${potAfterBet} = ${correctAnswer}%. You must continue at least ${correctAnswer}% of the time to prevent villain from profiting with any two cards.`;
            break;

        case QUESTION_TYPES.BLUFF_FREQUENCY:
            question = `The pot is ${potSize} BB. Villain bets ${betSize} BB. If villain is balanced, what % of their range should be bluffs?`;
            correctAnswer = Math.round(bluffFreq);
            options = generateOptions(correctAnswer, 10, 70);
            explanation = `Optimal bluff frequency = Bet / (Pot + Bet) = ${betSize} / ${potAfterBet} = ${correctAnswer}%. This makes you indifferent to calling with bluff-catchers.`;
            break;
    }

    currentQuestion = {
        type,
        potSize,
        betSize,
        betPercent,
        question,
        correctAnswer,
        options,
        explanation
    };

    renderQuestion();
}

function generateOptions(correct, min, max) {
    const options = new Set([correct]);

    // Generate wrong answers that are close but different
    const offsets = [-15, -10, -5, 5, 10, 15];

    while (options.size < 4) {
        const offset = offsets[Math.floor(Math.random() * offsets.length)];
        let newOption = correct + offset;

        // Keep within reasonable bounds
        newOption = Math.max(min, Math.min(max, newOption));

        if (newOption !== correct) {
            options.add(newOption);
        }
    }

    // Convert to array and shuffle
    const optionsArray = Array.from(options);
    for (let i = optionsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
    }

    return optionsArray;
}

function renderQuestion() {
    const mainArea = document.getElementById('odds-main');
    if (!mainArea) return;

    mainArea.innerHTML = '';

    // Question type badge
    const typeBadge = document.createElement('div');
    typeBadge.className = 'question-type-badge';
    const typeLabels = {
        [QUESTION_TYPES.POT_ODDS]: 'POT ODDS',
        [QUESTION_TYPES.EQUITY_NEEDED]: 'EQUITY NEEDED',
        [QUESTION_TYPES.MDF]: 'MINIMUM DEFENSE',
        [QUESTION_TYPES.BLUFF_FREQUENCY]: 'BLUFF FREQUENCY'
    };
    typeBadge.innerHTML = `<span class="type-badge">${typeLabels[currentQuestion.type]}</span>`;
    mainArea.appendChild(typeBadge);

    // Visual pot representation
    const potVisual = document.createElement('div');
    potVisual.className = 'pot-visual';
    potVisual.innerHTML = `
        <div class="pot-display">
            <div class="pot-circle">
                <span class="pot-amount">${currentQuestion.potSize}</span>
                <span class="pot-label">POT</span>
            </div>
            <div class="bet-arrow">→</div>
            <div class="bet-circle">
                <span class="bet-amount">${currentQuestion.betSize}</span>
                <span class="bet-label">BET</span>
            </div>
        </div>
        <div class="bet-percent">${Math.round(currentQuestion.betPercent * 100)}% pot bet</div>
    `;
    mainArea.appendChild(potVisual);

    // Question
    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    const questionEl = document.createElement('h2');
    questionEl.className = 'question-text';
    questionEl.textContent = currentQuestion.question;
    questionSection.appendChild(questionEl);

    // Options
    const optionsEl = document.createElement('div');
    optionsEl.className = 'options-grid options-4';

    currentQuestion.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn option-number';
        btn.innerHTML = `<span class="option-value">${opt}%</span>`;
        btn.addEventListener('click', () => handleAnswer(opt));
        optionsEl.appendChild(btn);
    });

    questionSection.appendChild(optionsEl);
    mainArea.appendChild(questionSection);
}

function handleAnswer(answer) {
    stats.total++;

    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
        stats.correct++;
    }

    storage.saveTrainerStats('potOdds', stats);

    showFeedback(isCorrect, answer);
    updateStats();
}

function showFeedback(isCorrect, userAnswer) {
    const mainArea = document.getElementById('odds-main');
    if (!mainArea) return;

    // Disable buttons
    mainArea.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';

        // Highlight correct answer
        const value = parseInt(btn.querySelector('.option-value').textContent);
        if (value === currentQuestion.correctAnswer) {
            btn.classList.add('correct-answer');
        } else if (value === userAnswer && !isCorrect) {
            btn.classList.add('wrong-answer');
        }
    });

    // Feedback
    const feedback = document.createElement('div');
    feedback.className = `feedback-section ${isCorrect ? 'correct' : 'incorrect'}`;

    feedback.innerHTML = `
        <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
        <div class="feedback-text">
            <strong>${isCorrect ? 'Correct!' : 'Incorrect'}</strong>
            <p>The answer is: <strong>${currentQuestion.correctAnswer}%</strong></p>
            <p class="feedback-explanation">${currentQuestion.explanation}</p>
        </div>
    `;

    // Practical application
    const practical = document.createElement('div');
    practical.className = 'practical-tip';

    switch (currentQuestion.type) {
        case QUESTION_TYPES.POT_ODDS:
        case QUESTION_TYPES.EQUITY_NEEDED:
            practical.innerHTML = `
                <h4>Practical Application:</h4>
                <p>With a flush draw (~35% equity) or open-ended straight draw (~32% equity), you can profitably call if pot odds are ${currentQuestion.correctAnswer}% or better.</p>
            `;
            break;
        case QUESTION_TYPES.MDF:
            practical.innerHTML = `
                <h4>Practical Application:</h4>
                <p>If you fold more than ${100 - currentQuestion.correctAnswer}% of your range, villain profits by bluffing with any two cards. Defend with your best ${currentQuestion.correctAnswer}% of hands.</p>
            `;
            break;
        case QUESTION_TYPES.BLUFF_FREQUENCY:
            practical.innerHTML = `
                <h4>Practical Application:</h4>
                <p>On the river, if villain bets this size optimally, ${currentQuestion.correctAnswer}% of their range should be bluffs. If they bluff more, call more. If they bluff less, fold more.</p>
            `;
            break;
    }
    feedback.appendChild(practical);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = 'Next Question';
    nextBtn.style.marginTop = '1rem';
    nextBtn.addEventListener('click', generateQuestion);
    feedback.appendChild(nextBtn);

    mainArea.appendChild(feedback);

    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateStats() {
    const statsEl = document.getElementById('odds-stats');
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
