// Charts Reference Module

import { createHandGrid } from '../components/HandGrid.js';
import ranges from '../data/ranges.js';

function render() {
    const container = document.createElement('div');

    // Header
    const header = document.createElement('div');
    header.innerHTML = '<h1>📈 GTO Charts Reference</h1>';
    header.style.marginBottom = '2rem';
    container.appendChild(header);

    // Print button
    const printBtn = document.createElement('button');
    printBtn.className = 'btn btn-secondary mb-lg';
    printBtn.textContent = '🖨️ Print Charts';
    printBtn.addEventListener('click', () => window.print());
    container.appendChild(printBtn);

    // RFI Charts
    const rfiSection = createRFICharts();
    container.appendChild(rfiSection);

    // 3-Bet Charts
    const threeBetSection = create3BetCharts();
    container.appendChild(threeBetSection);

    // BB Defense Charts
    const bbDefenseSection = createBBDefenseCharts();
    container.appendChild(bbDefenseSection);

    return container;
}

function createRFICharts() {
    const section = document.createElement('div');
    section.className = 'chart-section';

    const header = document.createElement('h2');
    header.textContent = 'RFI (Raise First In) Ranges';
    header.style.marginBottom = '1.5rem';
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'charts-grid';

    const positions = [
        { name: 'UTG', range: ranges.RFI_RANGES.UTG, percentage: '~15%' },
        { name: 'HJ', range: ranges.RFI_RANGES.HJ, percentage: '~18%' },
        { name: 'CO', range: ranges.RFI_RANGES.CO, percentage: '~28%' },
        { name: 'BTN', range: ranges.RFI_RANGES.BTN, percentage: '~48%' },
        { name: 'SB', range: ranges.RFI_RANGES.SB, percentage: '~45%' }
    ];

    positions.forEach(pos => {
        const card = createRangeChart(pos.name, pos.range, pos.percentage);
        grid.appendChild(card);
    });

    section.appendChild(grid);

    return section;
}

function create3BetCharts() {
    const section = document.createElement('div');
    section.className = 'chart-section';

    const header = document.createElement('h2');
    header.textContent = '3-Bet Ranges';
    header.style.marginBottom = '1.5rem';
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'charts-grid';

    const ranges3bet = [
        { name: 'vs UTG', range: ranges.THREE_BET_RANGES.vsUTG, percentage: '~5%' },
        { name: 'vs HJ', range: ranges.THREE_BET_RANGES.vsHJ, percentage: '~6%' },
        { name: 'vs CO', range: ranges.THREE_BET_RANGES.vsCO, percentage: '~8%' },
        { name: 'vs BTN', range: ranges.THREE_BET_RANGES.vsBTN, percentage: '~11%' }
    ];

    ranges3bet.forEach(r => {
        const card = createRangeChart(`3-Bet ${r.name}`, r.range, r.percentage);
        grid.appendChild(card);
    });

    section.appendChild(grid);

    return section;
}

function createBBDefenseCharts() {
    const section = document.createElement('div');
    section.className = 'chart-section';

    const header = document.createElement('h2');
    header.textContent = 'BB Defense Ranges';
    header.style.marginBottom = '1.5rem';
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'charts-grid';

    const bbRanges = [
        { name: 'vs UTG', range: ranges.BB_DEFENSE_RANGES.vsUTG, percentage: '~15%' },
        { name: 'vs HJ', range: ranges.BB_DEFENSE_RANGES.vsHJ, percentage: '~20%' },
        { name: 'vs CO', range: ranges.BB_DEFENSE_RANGES.vsCO, percentage: '~27%' },
        { name: 'vs BTN', range: ranges.BB_DEFENSE_RANGES.vsBTN, percentage: '~40%' },
        { name: 'vs SB', range: ranges.BB_DEFENSE_RANGES.vsSB, percentage: '~55%' }
    ];

    bbRanges.forEach(r => {
        const card = createRangeChart(`BB ${r.name}`, r.range, r.percentage);
        grid.appendChild(card);
    });

    section.appendChild(grid);

    return section;
}

function createRangeChart(title, range, percentage) {
    const card = document.createElement('div');
    card.className = 'chart-card';

    const header = document.createElement('div');
    header.className = 'chart-header';

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;

    const percentEl = document.createElement('span');
    percentEl.className = 'badge badge-success';
    percentEl.textContent = percentage;

    header.appendChild(titleEl);
    header.appendChild(percentEl);

    card.appendChild(header);

    // Create non-interactive grid
    const grid = createHandGrid(range, null, false);
    grid.style.transform = 'scale(0.8)';
    grid.style.transformOrigin = 'top left';
    card.appendChild(grid);

    // Hand list
    const handList = document.createElement('div');
    handList.style.marginTop = '1rem';
    handList.style.fontSize = '0.875rem';
    handList.style.color = 'var(--color-text-secondary)';
    handList.textContent = range.join(', ');
    card.appendChild(handList);

    return card;
}

export default {
    render
};
