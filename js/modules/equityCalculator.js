// Equity Calculator Module
// Calculate hand vs hand equity and basic hand vs range equity

import { RANKS, SUITS } from '../utils/constants.js';
import { createCard } from '../components/Card.js';
import { randomItem } from '../utils/helpers.js';

// Hand evaluator ranks (simplif ied)
const HAND_RANKS = {
    HIGH_CARD: 1,
    PAIR: 2,
    TWO_PAIR: 3,
    THREE_OF_A_KIND: 4,
    STRAIGHT: 5,
    FLUSH: 6,
    FULL_HOUSE: 7,
    FOUR_OF_A_KIND: 8,
    STRAIGHT_FLUSH: 9
};

function render() {
    const container = document.createElement('div');
    container.className = 'trainer-container';

    // Header
    const header = document.createElement('div');
    header.className = 'trainer-header';
    header.innerHTML = '<h1>🎲 Equity Calculator</h1><p class="text-muted">Calculate hand vs hand equity using Monte Carlo simulation</p>';
    container.appendChild(header);

    // Calculator interface
    const calcCard = document.createElement('div');
    calcCard.className = 'card';
    calcCard.style.maxWidth = '800px';
    calcCard.style.margin = '0 auto';

    // Hand 1 input
    const hand1Section = createHandInput('hand1', 'Hand 1');
    calcCard.appendChild(hand1Section);

    // VS divider
    const vsDivider = document.createElement('div');
    vsDivider.textContent = 'VS';
    vsDivider.style.textAlign = 'center';
    vsDivider.style.fontSize = '1.5rem';
    vsDivider.style.fontWeight = 'bold';
    vsDivider.style.margin = '1.5rem 0';
    vsDivider.style.color = 'var(--color-text-secondary)';
    calcCard.appendChild(vsDivider);

    // Hand 2 input
    const hand2Section = createHandInput('hand2', 'Hand 2');
    calcCard.appendChild(hand2Section);

    // Board input (optional)
    const boardSection = createBoardInput();
    calcCard.appendChild(boardSection);

    // Calculate button
    const calculateBtn = document.createElement('button');
    calculateBtn.className = 'btn btn-primary btn-lg';
    calculateBtn.textContent = 'Calculate Equity';
    calculateBtn.style.width = '100%';
    calculateBtn.style.marginTop = '1.5rem';
    calculateBtn.addEventListener('click', calculateEquity);
    calcCard.appendChild(calculateBtn);

    // Results area
    const resultsArea = document.createElement('div');
    resultsArea.id = 'equity-results';
    resultsArea.style.marginTop = '2rem';
    calcCard.appendChild(resultsArea);

    container.appendChild(calcCard);

    return container;
}

function createHandInput(id, label) {
    const section = document.createElement('div');
    section.style.marginBottom = '1.5rem';

    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.style.fontWeight = '600';
    labelEl.style.marginBottom = '0.75rem';
    section.appendChild(labelEl);

    const inputRow = document.createElement('div');
    inputRow.style.display = 'grid';
    inputRow.style.gridTemplateColumns = 'repeat(2, 1fr)';
    inputRow.style.gap = '1rem';

    // Card 1
    const card1Select = createCardSelect(`${id}-card1`);
    inputRow.appendChild(card1Select);

    // Card 2
    const card2Select = createCardSelect(`${id}-card2`);
    inputRow.appendChild(card2Select);

    section.appendChild(inputRow);

    // Random button
    const randomBtn = document.createElement('button');
    randomBtn.className = 'btn btn-secondary';
    randomBtn.textContent = 'Random Hand';
    randomBtn.style.marginTop = '0.5rem';
    randomBtn.addEventListener('click', () => setRandomHand(id));
    section.appendChild(randomBtn);

    return section;
}

function createBoardInput() {
    const section = document.createElement('div');
    section.style.marginTop = '1.5rem';
    section.style.paddingTop = '1.5rem';
    section.style.borderTop = '1px solid var(--color-border)';

    const labelEl = document.createElement('div');
    labelEl.textContent = 'Board (Optional)';
    labelEl.style.fontWeight = '600';
    labelEl.style.marginBottom = '0.75rem';
    section.appendChild(labelEl);

    const inputRow = document.createElement('div');
    inputRow.style.display = 'grid';
    inputRow.style.gridTemplateColumns = 'repeat(5, 1fr)';
    inputRow.style.gap = '0.5rem';

    for (let i = 1; i <= 5; i++) {
        const cardSelect = createCardSelect(`board-card${i}`);
        inputRow.appendChild(cardSelect);
    }

    section.appendChild(inputRow);

    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-secondary';
    clearBtn.textContent = 'Clear Board';
    clearBtn.style.marginTop = '0.5rem';
    clearBtn.addEventListener('click', clearBoard);
    section.appendChild(clearBtn);

    return section;
}

function createCardSelect(id) {
    const select = document.createElement('select');
    select.id = id;
    select.style.padding = '0.5rem';
    select.style.width = '100%';

    // Empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '--';
    select.appendChild(emptyOption);

    // All cards
    RANKS.forEach(rank => {
        Object.values(SUITS).forEach(suit => {
            const option = document.createElement('option');
            option.value = `${rank}${suit}`;
            option.textContent = `${rank}${suit}`;
            select.appendChild(option);
        });
    });

    // Add change listener for real-time duplicate detection
    select.addEventListener('change', updateCardAvailability);

    return select;
}

function updateCardAvailability() {
    const usedCards = getUsedCards();
    const allSelects = [
        'hand1-card1', 'hand1-card2', 'hand2-card1', 'hand2-card2',
        'board-card1', 'board-card2', 'board-card3', 'board-card4', 'board-card5'
    ];

    allSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        const currentValue = select.value;

        // Re-enable all options first
        Array.from(select.options).forEach(option => {
            if (option.value === '') return; // Skip empty option

            // Disable if used by another dropdown (but not this one)
            if (usedCards.has(option.value) && option.value !== currentValue) {
                option.disabled = true;
                option.style.color = '#999';
            } else {
                option.disabled = false;
                option.style.color = '';
            }
        });
    });
}

function setRandomHand(handId) {
    const usedCards = getUsedCards();

    const availableCards = [];
    RANKS.forEach(rank => {
        Object.values(SUITS).forEach(suit => {
            const card = `${rank}${suit}`;
            if (!usedCards.has(card)) {
                availableCards.push(card);
            }
        });
    });

    if (availableCards.length < 2) return;

    const card1 = randomItem(availableCards);
    const remaining = availableCards.filter(c => c !== card1);
    const card2 = randomItem(remaining);

    document.getElementById(`${handId}-card1`).value = card1;
    document.getElementById(`${handId}-card2`).value = card2;
}

function clearBoard() {
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`board-card${i}`).value = '';
    }
}

function getUsedCards() {
    const used = new Set();

    ['hand1-card1', 'hand1-card2', 'hand2-card1', 'hand2-card2'].forEach(id => {
        const value = document.getElementById(id)?.value;
        if (value) used.add(value);
    });

    for (let i = 1; i <= 5; i++) {
        const value = document.getElementById(`board-card${i}`)?.value;
        if (value) used.add(value);
    }

    return used;
}

function calculateEquity() {
    const resultsEl = document.getElementById('equity-results');
    if (!resultsEl) return;

    // Get hands
    const hand1Card1 = document.getElementById('hand1-card1').value;
    const hand1Card2 = document.getElementById('hand1-card2').value;
    const hand2Card1 = document.getElementById('hand2-card1').value;
    const hand2Card2 = document.getElementById('hand2-card2').value;

    if (!hand1Card1 || !hand1Card2 || !hand2Card1 || !hand2Card2) {
        resultsEl.innerHTML = '<div class="text-error">Please select both cards for each hand</div>';
        return;
    }

    // Get board
    const board = [];
    for (let i = 1; i <= 5; i++) {
        const card = document.getElementById(`board-card${i}`).value;
        if (card) board.push(card);
    }

    // Check for duplicates
    const allCards = [hand1Card1, hand1Card2, hand2Card1, hand2Card2, ...board];
    const uniqueCards = new Set(allCards);
    if (allCards.length !== uniqueCards.size) {
        resultsEl.innerHTML = '<div class="text-error">Duplicate cards detected. Each card must be unique.</div>';
        return;
    }

    // Show loading
    resultsEl.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="text-muted">Calculating equity (running 10,000 simulations)...</div></div>';

    // Run Monte Carlo simulation with brief delay to show loading state
    setTimeout(() => {
        const result = runMonteCarloSimulation(
            [hand1Card1, hand1Card2],
            [hand2Card1, hand2Card2],
            board,
            10000
        );

        displayResults(result, [hand1Card1, hand1Card2], [hand2Card1, hand2Card2], board);
    }, 100);
}

function runMonteCarloSimulation(hand1, hand2, board, iterations) {
    let hand1Wins = 0;
    let hand2Wins = 0;
    let ties = 0;

    const usedCards = new Set([...hand1, ...hand2, ...board]);

    for (let i = 0; i < iterations; i++) {
        // Complete the board
        const fullBoard = [...board];
        while (fullBoard.length < 5) {
            const card = getRandomCard(usedCards);
            fullBoard.push(card);
            usedCards.add(card);
        }

        // Evaluate both hands
        const eval1 = evaluateHand([...hand1, ...fullBoard]);
        const eval2 = evaluateHand([...hand2, ...fullBoard]);

        if (eval1.rank > eval2.rank) {
            hand1Wins++;
        } else if (eval2.rank > eval1.rank) {
            hand2Wins++;
        } else {
            // Same rank, compare kickers
            const kickerCompare = compareKickers(eval1.kickers, eval2.kickers);
            if (kickerCompare > 0) {
                hand1Wins++;
            } else if (kickerCompare < 0) {
                hand2Wins++;
            } else {
                ties++;
            }
        }

        // Remove added cards for next iteration
        while (fullBoard.length > board.length) {
            usedCards.delete(fullBoard.pop());
        }
    }

    return {
        hand1Equity: ((hand1Wins + ties / 2) / iterations) * 100,
        hand2Equity: ((hand2Wins + ties / 2) / iterations) * 100,
        hand1Wins,
        hand2Wins,
        ties,
        iterations
    };
}

function getRandomCard(usedCards) {
    // Safety check to prevent infinite loop
    if (usedCards.size >= 52) {
        throw new Error('No cards available - all 52 cards are in use');
    }

    let card;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        if (attempts++ > maxAttempts) {
            throw new Error(`Failed to find available card after ${maxAttempts} attempts`);
        }
        const rank = randomItem(RANKS);
        const suit = randomItem(Object.values(SUITS));
        card = `${rank}${suit}`;
    } while (usedCards.has(card));

    return card;
}

function evaluateHand(cards) {
    // Simple 5-card evaluator
    const ranks = cards.map(c => RANKS.indexOf(c[0]));
    const suits = cards.map(c => c.slice(-1));

    const rankCounts = {};
    ranks.forEach(r => {
        rankCounts[r] = (rankCounts[r] || 0) + 1;
    });

    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const uniqueRanks = Object.keys(rankCounts).map(Number).sort((a, b) => b - a);

    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = checkStraight(uniqueRanks);

    if (isStraight && isFlush) {
        return { rank: HAND_RANKS.STRAIGHT_FLUSH, kickers: [uniqueRanks[0]] };
    }

    if (counts[0] === 4) {
        return { rank: HAND_RANKS.FOUR_OF_A_KIND, kickers: uniqueRanks };
    }

    if (counts[0] === 3 && counts[1] === 2) {
        return { rank: HAND_RANKS.FULL_HOUSE, kickers: uniqueRanks };
    }

    if (isFlush) {
        return { rank: HAND_RANKS.FLUSH, kickers: uniqueRanks };
    }

    if (isStraight) {
        return { rank: HAND_RANKS.STRAIGHT, kickers: [uniqueRanks[0]] };
    }

    if (counts[0] === 3) {
        return { rank: HAND_RANKS.THREE_OF_A_KIND, kickers: uniqueRanks };
    }

    if (counts[0] === 2 && counts[1] === 2) {
        return { rank: HAND_RANKS.TWO_PAIR, kickers: uniqueRanks };
    }

    if (counts[0] === 2) {
        return { rank: HAND_RANKS.PAIR, kickers: uniqueRanks };
    }

    return { rank: HAND_RANKS.HIGH_CARD, kickers: uniqueRanks };
}

function checkStraight(ranks) {
    const sorted = [...new Set(ranks)].sort((a, b) => b - a);
    if (sorted.length < 5) return false;

    for (let i = 0; i <= sorted.length - 5; i++) {
        const slice = sorted.slice(i, i + 5);
        if (slice[0] - slice[4] === 4) return true;
    }

    // Check for A-2-3-4-5 (wheel)
    // RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
    // Indices: A=0, 5=9, 4=10, 3=11, 2=12
    if (sorted.includes(0) && sorted.includes(9) && sorted.includes(10) && sorted.includes(11) && sorted.includes(12)) {
        return true;
    }

    return false;
}

function compareKickers(kickers1, kickers2) {
    for (let i = 0; i < Math.min(kickers1.length, kickers2.length); i++) {
        if (kickers1[i] > kickers2[i]) return 1;
        if (kickers1[i] < kickers2[i]) return -1;
    }
    return 0;
}

function displayResults(result, hand1, hand2, board) {
    const resultsEl = document.getElementById('equity-results');
    if (!resultsEl) return;

    resultsEl.innerHTML = '';

    const resultsCard = document.createElement('div');
    resultsCard.style.padding = '1.5rem';
    resultsCard.style.background = 'var(--color-bg-tertiary)';
    resultsCard.style.borderRadius = 'var(--border-radius)';

    // Title
    const title = document.createElement('div');
    title.textContent = 'Equity Results';
    title.style.fontSize = '1.25rem';
    title.style.fontWeight = '600';
    title.style.marginBottom = '1.5rem';
    title.style.textAlign = 'center';
    resultsCard.appendChild(title);

    // Hand 1 results
    const hand1Result = createHandResult('Hand 1', hand1, result.hand1Equity, result.hand1Wins);
    resultsCard.appendChild(hand1Result);

    // Hand 2 results
    const hand2Result = createHandResult('Hand 2', hand2, result.hand2Equity, result.hand2Wins);
    resultsCard.appendChild(hand2Result);

    // Ties
    if (result.ties > 0) {
        const tiesDiv = document.createElement('div');
        tiesDiv.style.textAlign = 'center';
        tiesDiv.style.marginTop = '1rem';
        tiesDiv.style.color = 'var(--color-text-secondary)';
        tiesDiv.textContent = `Ties: ${result.ties} (${((result.ties / result.iterations) * 100).toFixed(1)}%)`;
        resultsCard.appendChild(tiesDiv);
    }

    // Simulation info
    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = 'center';
    infoDiv.style.marginTop = '1rem';
    infoDiv.style.fontSize = '0.875rem';
    infoDiv.style.color = 'var(--color-text-muted)';
    infoDiv.textContent = `${result.iterations.toLocaleString()} simulations | Board: ${board.length > 0 ? board.join(' ') : 'None'}`;
    resultsCard.appendChild(infoDiv);

    resultsEl.appendChild(resultsCard);
}

function createHandResult(label, hand, equity, wins) {
    const container = document.createElement('div');
    container.style.marginBottom = '1rem';
    container.style.padding = '1rem';
    container.style.background = 'var(--color-bg-primary)';
    container.style.borderRadius = 'var(--border-radius)';

    const labelDiv = document.createElement('div');
    labelDiv.textContent = label;
    labelDiv.style.fontWeight = '600';
    labelDiv.style.marginBottom = '0.5rem';
    container.appendChild(labelDiv);

    const cardsDiv = document.createElement('div');
    cardsDiv.style.display = 'flex';
    cardsDiv.style.gap = '0.5rem';
    cardsDiv.style.marginBottom = '0.75rem';

    hand.forEach(cardStr => {
        const rank = cardStr.slice(0, -1);
        const suit = cardStr.slice(-1);
        const card = createCard({ rank, suit });
        cardsDiv.appendChild(card);
    });

    container.appendChild(cardsDiv);

    // Equity bar
    const barContainer = document.createElement('div');
    barContainer.style.width = '100%';
    barContainer.style.height = '30px';
    barContainer.style.background = 'var(--color-bg-secondary)';
    barContainer.style.borderRadius = 'var(--border-radius)';
    barContainer.style.overflow = 'hidden';
    barContainer.style.position = 'relative';

    const bar = document.createElement('div');
    bar.style.width = `${equity}%`;
    bar.style.height = '100%';
    bar.style.background = equity > 50 ? 'var(--color-success)' : 'var(--color-warning)';
    bar.style.transition = 'width 0.5s ease';
    barContainer.appendChild(bar);

    const barText = document.createElement('div');
    barText.textContent = `${equity.toFixed(1)}% (${wins} wins)`;
    barText.style.position = 'absolute';
    barText.style.top = '50%';
    barText.style.left = '50%';
    barText.style.transform = 'translate(-50%, -50%)';
    barText.style.fontWeight = '600';
    barText.style.fontSize = '0.875rem';
    barContainer.appendChild(barText);

    container.appendChild(barContainer);

    return container;
}

export default {
    render
};
