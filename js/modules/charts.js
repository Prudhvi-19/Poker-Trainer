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
        { name: 'vs BTN', range: ranges.THREE_BET_RANGES.vsBTN, percentage: '~11%' },
        { name: 'vs SB (BB)', range: ranges.THREE_BET_RANGES.vsSB, percentage: '~14%' }
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
    card.style.cursor = 'pointer';
    card.style.transition = 'all 0.2s ease';

    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
    });

    // Add click to expand
    card.addEventListener('click', () => {
        showExpandedChart(title, range, percentage);
    });

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

    // Create non-interactive grid (improved readability)
    const grid = createHandGrid(range, null, false);
    grid.style.transform = 'scale(0.9)';
    grid.style.transformOrigin = 'top center';
    grid.style.margin = '0 auto';
    card.appendChild(grid);

    // Add "Click to expand" hint
    const hint = document.createElement('div');
    hint.style.textAlign = 'center';
    hint.style.marginTop = '0.5rem';
    hint.style.fontSize = '0.875rem';
    hint.style.color = 'var(--color-text-muted)';
    hint.textContent = 'Click to expand';
    card.appendChild(hint);

    return card;
}

function showExpandedChart(title, range, percentage) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.background = 'rgba(0, 0, 0, 0.85)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    modal.style.padding = '2rem';

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Create modal content
    const content = document.createElement('div');
    content.className = 'card';
    content.style.maxWidth = '800px';
    content.style.width = '100%';
    content.style.maxHeight = '90vh';
    content.style.overflow = 'auto';

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '1.5rem';

    const titleEl = document.createElement('h2');
    titleEl.textContent = title;

    const percentEl = document.createElement('span');
    percentEl.className = 'badge badge-success';
    percentEl.style.fontSize = '1.25rem';
    percentEl.style.padding = '0.5rem 1rem';
    percentEl.textContent = percentage;

    header.appendChild(titleEl);
    header.appendChild(percentEl);

    content.appendChild(header);

    // Full-size grid
    const grid = createHandGrid(range, null, false);
    grid.style.margin = '0 auto';
    content.appendChild(grid);

    // Hand count
    const countDiv = document.createElement('div');
    countDiv.style.textAlign = 'center';
    countDiv.style.marginTop = '1.5rem';
    countDiv.style.color = 'var(--color-text-secondary)';
    countDiv.textContent = `${range.length} hand combinations`;
    content.appendChild(countDiv);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-secondary';
    closeBtn.textContent = '✕ Close';
    closeBtn.style.marginTop = '1.5rem';
    closeBtn.style.width = '100%';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    content.appendChild(closeBtn);

    modal.appendChild(content);
    document.body.appendChild(modal);
}

export default {
    render
};
