// Pot Odds & MDF Trainer Module
// Master pot odds calculations and minimum defense frequency

import { showToast } from '../utils/helpers.js';
import storage from '../utils/storage.js';
import { applyDecisionRating, appendRatingHistory } from '../utils/rating.js';
import { computeEvFeedbackFromEvs } from '../utils/evFeedback.js';
import { buildScenarioKeyFromResult, upsertSrsResult } from '../utils/srs.js';
import { getCurrentKey, isSessionActive, advanceSession, incrementSessionStats } from '../utils/smartPracticeSession.js';

// Question types
const QUESTION_TYPES = {
    POT_ODDS: 'pot-odds',           // Given bet, calculate pot odds
    EQUITY_NEEDED: 'equity-needed', // What equity do you need to call?
    MDF: 'mdf',                     // Minimum defense frequency
    BLUFF_FREQUENCY: 'bluff-freq'   // How often should villain be bluffing?
};

let currentQuestion = null;
let stats = { correct: 0, total: 0, evLostBb: 0 };
let container = null;
let mainAreaEl = null;
let statsBarEl = null;

let smartPracticeActiveKey = null;

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
                <h4>Equity Needed (Pot Odds)</h4>
                <code>Call / (Pot + Bet + Call)</code>
                <p>Pot=20, Bet=10: 10/(20+10+10) = 25%</p>
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
            <div class="formula-item">
                <h4>Break-Even Bluff</h4>
                <code>Bet / (Pot + Bet)</code>
                <p>How often your bluff needs to work to break even</p>
            </div>
        </div>
        <div class="quick-reference">
            <h4>Quick Reference:</h4>
            <table class="reference-table">
                <tr><th>Bet Size</th><th>Equity Needed</th><th>MDF</th><th>Bluff %</th></tr>
                <tr><td>25% pot</td><td>17%</td><td>80%</td><td>20%</td></tr>
                <tr><td>33% pot</td><td>20%</td><td>75%</td><td>25%</td></tr>
                <tr><td>50% pot</td><td>25%</td><td>67%</td><td>33%</td></tr>
                <tr><td>66% pot</td><td>28%</td><td>60%</td><td>40%</td></tr>
                <tr><td>75% pot</td><td>30%</td><td>57%</td><td>43%</td></tr>
                <tr><td>100% pot</td><td>33%</td><td>50%</td><td>50%</td></tr>
                <tr><td>150% pot</td><td>38%</td><td>40%</td><td>60%</td></tr>
            </table>
        </div>
    `;
    container.appendChild(theoryCard);

    // Stats display
    statsBarEl = document.createElement('div');
    statsBarEl.className = 'stats-bar';
    container.appendChild(statsBarEl);

    // Main training area
    mainAreaEl = document.createElement('div');
    mainAreaEl.className = 'card training-card';
    container.appendChild(mainAreaEl);

    // Start first question
    smartPracticeActiveKey = isSessionActive() ? getCurrentKey() : null;
    generateQuestion();
    updateStats();

    return container;
}

function getSmartPracticeOverrideQuestion() {
    if (!smartPracticeActiveKey) return null;
    const srs = storage.getSrsState();
    const item = srs?.items?.[smartPracticeActiveKey] || null;
    const payload = item?.payload || null;
    const question = payload?.question || null;
    if (!question || typeof question !== 'object') return null;
    if (typeof question.correctAnswer !== 'number') return null;
    if (!Array.isArray(question.options) || question.options.length === 0) return null;
    return question;
}

function generateQuestion() {
    smartPracticeActiveKey = isSessionActive() ? getCurrentKey() : null;

    const override = getSmartPracticeOverrideQuestion();
    if (override) {
        currentQuestion = override;
        renderQuestion();
        return;
    }

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
    if (!mainAreaEl) return;
    const mainArea = mainAreaEl;

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

    // ENH-001: update skill rating after each decision
    updateRatingAfterDecision(isCorrect);

    // Stats tracked in-memory for this session

    // BUG-031: EV feedback parity (map numeric error to EV-loss-like score)
    const evFeedback = computeEvFeedback({
        correctAnswer: currentQuestion.correctAnswer,
        options: currentQuestion.options,
        userAnswer: answer,
        isCorrect
    });
    stats.evLostBb += evFeedback?.evLossBb || 0;

    // BUG-032: SRS integration
    const scenarioKey = smartPracticeActiveKey || buildScenarioKeyFromResult({
        module: 'pot-odds-trainer',
        trainerType: 'pot-odds',
        scenario: {
            type: currentQuestion?.type || null,
            // Reuse the key's “texture” field as a bet-size bucket so SRS splits by sizing.
            texture: typeof currentQuestion?.betPercent === 'number'
                ? `${Math.round(currentQuestion.betPercent * 100)}%pot`
                : null
        }
    });
    upsertSrsResult({
        scenarioKey,
        isCorrect,
        evFeedback,
        timestamp: new Date().toISOString(),
        payload: {
            module: 'pot-odds-trainer',
            question: currentQuestion
        }
    });
    if (isSessionActive() && smartPracticeActiveKey) {
        incrementSessionStats({ isCorrect, evFeedback });
    }

    showFeedback(isCorrect, answer, evFeedback);
    updateStats();
}

function updateRatingAfterDecision(isCorrect) {
    const rating = storage.getRating();
    const next = applyDecisionRating(rating.current, isCorrect, 1500);
    const updated = {
        ...rating,
        current: next,
        history: appendRatingHistory(rating.history, next),
        lastUpdated: new Date().toISOString()
    };
    storage.saveRating(updated);
}

function showFeedback(isCorrect, userAnswer, evFeedback) {
    if (!mainAreaEl) return;
    const mainArea = mainAreaEl;

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
    const evLoss = evFeedback?.evLossBb ?? (isCorrect ? 0 : null);
    const grade = evFeedback?.grade || (isCorrect
        ? { key: 'perfect', label: 'Perfect', icon: '✅' }
        : { key: 'blunder', label: 'Blunder', icon: '🔴' }
    );

    feedback.className = `feedback-section grade-${grade.key}`;

    feedback.innerHTML = `
        <div class="feedback-icon">${grade.icon}</div>
        <div class="feedback-text">
            <strong>${grade.label}${evLoss === null ? '' : ` (EV loss: ${evLoss.toFixed(2)}bb)`}</strong>
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
    nextBtn.textContent = smartPracticeActiveKey ? 'Next Review' : 'Next Question';
    nextBtn.style.marginTop = '1rem';
    nextBtn.addEventListener('click', () => {
        if (isSessionActive() && smartPracticeActiveKey) {
            const { done, nextRoute } = advanceSession();
            if (!done) {
                window.location.hash = nextRoute;
                return;
            }
        }
        generateQuestion();
    });
    feedback.appendChild(nextBtn);

    mainArea.appendChild(feedback);

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
        <div class="stat-item">
            <span class="stat-value">${stats.evLostBb.toFixed(1)}bb</span>
            <span class="stat-label">EV Lost</span>
        </div>
    `;
}

function computeEvFeedback({ correctAnswer, options, userAnswer, isCorrect }) {
    // For this knowledge-based trainer, we map “closeness” to an EV-like loss.
    // Scale: 1% error ~= 0.10bb loss, 5% error ~= 0.50bb, 20% error ~= 2.00bb.
    const correct = Number(correctAnswer);
    const opts = Array.isArray(options) ? options : [];

    const evByAction = {};
    for (const opt of opts) {
        const o = Number(opt);
        if (!Number.isFinite(o)) continue;
        evByAction[String(o)] = -Math.abs(o - correct) / 10;
    }

    return computeEvFeedbackFromEvs({
        evByAction,
        correctAction: String(correct),
        userAnswer: String(userAnswer),
        isCorrect,
        meta: { mapped: 'percent-error' }
    });
}

export default {
    render
};
