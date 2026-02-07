// Comprehensive GTO Charts Reference Module
// Professional-grade charting with multi-color visualization

import { createHandGrid, calculateRangeStats } from '../components/HandGrid.js';
import ranges from '../data/ranges.js';

// Constants for chart organization
const POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB'];
const OPPONENT_POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB'];

function render() {
    const container = document.createElement('div');
    container.className = 'charts-container';

    // Header
    const header = createHeader();
    container.appendChild(header);

    // Navigation tabs
    const nav = createNavigation();
    container.appendChild(nav);

    // Chart sections container
    const sectionsContainer = document.createElement('div');
    sectionsContainer.id = 'charts-sections';
    container.appendChild(sectionsContainer);

    // Create all sections (hidden by default except first)
    const sections = [
        { id: 'rfi', name: 'RFI Ranges', create: createRFISection },
        { id: '3bet', name: '3-Bet Ranges', create: create3BetSection },
        { id: 'bb-defense', name: 'BB Defense', create: createBBDefenseSection },
        { id: '4bet', name: '4-Bet Ranges', create: create4BetSection },
        { id: 'cold-call', name: 'Cold Call', create: createColdCallSection },
        { id: 'squeeze', name: 'Squeeze', create: createSqueezeSection }
    ];

    sections.forEach((section, index) => {
        const sectionEl = section.create();
        sectionEl.id = `section-${section.id}`;
        sectionEl.style.display = index === 0 ? 'block' : 'none';
        sectionsContainer.appendChild(sectionEl);
    });

    // Setup navigation events
    setupNavigation(container);

    return container;
}

function createHeader() {
    const header = document.createElement('div');
    header.className = 'charts-header';
    header.innerHTML = `
        <h1>GTO Charts Reference</h1>
        <p class="charts-subtitle">Complete preflop ranges for 6-max No Limit Hold'em cash games</p>
        <div class="charts-actions">
            <button class="btn btn-secondary btn-sm" id="print-charts-btn">Print Charts</button>
        </div>
    `;

    header.querySelector('#print-charts-btn').addEventListener('click', () => window.print());

    return header;
}

function createNavigation() {
    const nav = document.createElement('div');
    nav.className = 'charts-nav';
    nav.innerHTML = `
        <button class="charts-nav-btn active" data-section="rfi">RFI</button>
        <button class="charts-nav-btn" data-section="3bet">3-Bet</button>
        <button class="charts-nav-btn" data-section="bb-defense">BB Defense</button>
        <button class="charts-nav-btn" data-section="4bet">4-Bet</button>
        <button class="charts-nav-btn" data-section="cold-call">Cold Call</button>
        <button class="charts-nav-btn" data-section="squeeze">Squeeze</button>
    `;
    return nav;
}

function setupNavigation(container) {
    const navButtons = container.querySelectorAll('.charts-nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show selected section
            const sectionId = btn.dataset.section;
            const sections = container.querySelectorAll('#charts-sections > div');
            sections.forEach(s => {
                s.style.display = s.id === `section-${sectionId}` ? 'block' : 'none';
            });
        });
    });
}

// ============================================
// RFI (Raise First In) Section
// ============================================
function createRFISection() {
    const section = document.createElement('div');
    section.className = 'chart-section';

    // Section header with explanation
    section.appendChild(createSectionHeader(
        'RFI (Raise First In) Ranges',
        'When action folds to you, these are the hands to open-raise. Position matters: play tighter from early position, wider from late position.',
        [{ color: 'raise', label: 'Raise (2.5-3BB)' }]
    ));

    // Charts grid
    const grid = document.createElement('div');
    grid.className = 'charts-grid';

    POSITIONS.forEach(pos => {
        const range = ranges.RFI_RANGES[pos] || [];
        const stats = calculateRangeStats(range, []);
        const card = createChartCard(
            `${pos} Open`,
            `Open-raise from ${getPositionFullName(pos)}`,
            range,
            [],
            stats.totalPercent + '%'
        );
        grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
}

// ============================================
// 3-Bet Section
// ============================================
function create3BetSection() {
    const section = document.createElement('div');
    section.className = 'chart-section';

    section.appendChild(createSectionHeader(
        '3-Bet Ranges',
        'When an opponent opens the pot, these are hands to 3-bet (re-raise). 3-betting applies pressure and builds pots with strong hands. Charts show YOUR 3-bet range vs each opener position.',
        [{ color: 'raise', label: '3-Bet (3x open)' }]
    ));

    const grid = document.createElement('div');
    grid.className = 'charts-grid';

    OPPONENT_POSITIONS.forEach(pos => {
        const key = `vs${pos}`;
        const range = ranges.THREE_BET_RANGES[key] || [];
        const stats = calculateRangeStats(range, []);
        const card = createChartCard(
            `3-Bet vs ${pos}`,
            `Your 3-bet range when ${pos} opens`,
            range,
            [],
            stats.totalPercent + '%'
        );
        grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
}

// ============================================
// BB Defense Section (Multi-Color)
// ============================================
function createBBDefenseSection() {
    const section = document.createElement('div');
    section.className = 'chart-section';

    section.appendChild(createSectionHeader(
        'BB Defense Ranges',
        'When you\'re in the Big Blind facing a raise, you can 3-bet (green) or call (blue). Premium hands and bluffs should be 3-bet, medium-strength hands should call.',
        [
            { color: 'raise', label: '3-Bet' },
            { color: 'call', label: 'Call' }
        ]
    ));

    const grid = document.createElement('div');
    grid.className = 'charts-grid';

    OPPONENT_POSITIONS.forEach(pos => {
        const key = `vs${pos}`;
        const raiseRange = ranges.BB_3BET_RANGES?.[key] || [];
        const callRange = ranges.BB_DEFENSE_RANGES[key] || [];
        const stats = calculateRangeStats(raiseRange, callRange);

        const card = createChartCard(
            `BB vs ${pos}`,
            `Defend from BB when ${pos} opens`,
            raiseRange,
            callRange,
            stats.totalPercent + '%',
            `3-Bet: ${stats.raisePercent}% | Call: ${stats.callPercent}%`
        );
        grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
}

// ============================================
// 4-Bet Section (Multi-Color)
// ============================================
function create4BetSection() {
    const section = document.createElement('div');
    section.className = 'chart-section';

    section.appendChild(createSectionHeader(
        '4-Bet Ranges',
        'When you open and face a 3-bet, you can 4-bet (green) or call (blue). 4-betting is typically AA-QQ, AK for value, plus select bluffs like suited wheel aces.',
        [
            { color: 'raise', label: '4-Bet' },
            { color: 'call', label: 'Call 3-Bet' }
        ]
    ));

    const grid = document.createElement('div');
    grid.className = 'charts-grid';

    OPPONENT_POSITIONS.forEach(pos => {
        const key = `vs${pos}`;
        const fourBetRange = ranges.FOUR_BET_RANGES[key] || [];
        const callRange = ranges.CALL_3BET_RANGES[key] || [];
        const stats = calculateRangeStats(fourBetRange, callRange);

        const card = createChartCard(
            `vs ${pos} 3-Bet`,
            `Your response when ${pos} 3-bets you`,
            fourBetRange,
            callRange,
            stats.totalPercent + '%',
            `4-Bet: ${stats.raisePercent}% | Call: ${stats.callPercent}%`
        );
        grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
}

// ============================================
// Cold Call Section
// ============================================
function createColdCallSection() {
    const section = document.createElement('div');
    section.className = 'chart-section';

    section.appendChild(createSectionHeader(
        'Cold Call Ranges',
        'When someone opens and you\'re NOT in the blinds, you can cold call with these hands. Generally prefer 3-betting or folding; cold calling is position-dependent.',
        [{ color: 'call', label: 'Cold Call' }]
    ));

    const grid = document.createElement('div');
    grid.className = 'charts-grid';

    OPPONENT_POSITIONS.forEach(pos => {
        const key = `vs${pos}`;
        const range = ranges.COLD_CALL_RANGES[key] || [];
        const stats = calculateRangeStats([], range);

        const card = createChartCard(
            `Cold Call vs ${pos}`,
            `Call (not 3-bet) when ${pos} opens`,
            [],
            range,
            stats.callPercent + '%'
        );
        grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
}

// ============================================
// Squeeze Section
// ============================================
function createSqueezeSection() {
    const section = document.createElement('div');
    section.className = 'chart-section';

    section.appendChild(createSectionHeader(
        'Squeeze Ranges',
        'When someone opens and there\'s a caller, you can "squeeze" with a large 3-bet. This play leverages fold equity against both players. Use premium hands and select bluffs.',
        [{ color: 'raise', label: 'Squeeze (4x+ open)' }]
    ));

    const grid = document.createElement('div');
    grid.className = 'charts-grid';

    OPPONENT_POSITIONS.forEach(pos => {
        const key = `vs${pos}`;
        const range = ranges.SQUEEZE_RANGES[key] || [];
        const stats = calculateRangeStats(range, []);

        const card = createChartCard(
            `Squeeze vs ${pos}`,
            `Squeeze when ${pos} opens + caller`,
            range,
            [],
            stats.totalPercent + '%'
        );
        grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
}

// ============================================
// Helper Functions
// ============================================

function createSectionHeader(title, description, legendItems) {
    const header = document.createElement('div');
    header.className = 'section-header';

    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    header.appendChild(titleEl);

    const descEl = document.createElement('p');
    descEl.className = 'section-description';
    descEl.textContent = description;
    header.appendChild(descEl);

    // Legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';

    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        const colorBox = document.createElement('span');
        colorBox.className = `legend-color legend-${item.color}`;

        const label = document.createElement('span');
        label.className = 'legend-label';
        label.textContent = item.label;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    });

    // Add fold to legend
    const foldItem = document.createElement('div');
    foldItem.className = 'legend-item';
    foldItem.innerHTML = '<span class="legend-color legend-fold"></span><span class="legend-label">Fold</span>';
    legend.appendChild(foldItem);

    header.appendChild(legend);

    return header;
}

function createChartCard(title, subtitle, raiseHands, callHands, percentage, breakdown = null) {
    const card = document.createElement('div');
    card.className = 'chart-card';

    // Header
    const header = document.createElement('div');
    header.className = 'chart-card-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'chart-card-title';
    titleEl.textContent = title;

    const badge = document.createElement('span');
    badge.className = 'badge badge-success';
    badge.textContent = percentage;

    header.appendChild(titleEl);
    header.appendChild(badge);
    card.appendChild(header);

    // Subtitle
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'chart-card-subtitle';
    subtitleEl.textContent = subtitle;
    card.appendChild(subtitleEl);

    // Breakdown if provided
    if (breakdown) {
        const breakdownEl = document.createElement('div');
        breakdownEl.className = 'chart-card-breakdown';
        breakdownEl.textContent = breakdown;
        card.appendChild(breakdownEl);
    }

    // Hand grid with multi-color support
    const grid = createHandGrid({
        raiseHands: raiseHands,
        callHands: callHands,
        interactive: false
    });
    grid.classList.add('chart-grid-small');
    card.appendChild(grid);

    // Click to expand
    card.addEventListener('click', () => {
        showExpandedChart(title, subtitle, raiseHands, callHands, percentage, breakdown);
    });

    // Expand hint
    const hint = document.createElement('div');
    hint.className = 'chart-card-hint';
    hint.textContent = 'Click to expand';
    card.appendChild(hint);

    return card;
}

function showExpandedChart(title, subtitle, raiseHands, callHands, percentage, breakdown) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'chart-modal-overlay';

    // Modal content
    const content = document.createElement('div');
    content.className = 'chart-modal-content card';

    // Header
    const header = document.createElement('div');
    header.className = 'chart-modal-header';

    const titleEl = document.createElement('h2');
    titleEl.textContent = title;

    const badge = document.createElement('span');
    badge.className = 'badge badge-success chart-modal-badge';
    badge.textContent = percentage;

    header.appendChild(titleEl);
    header.appendChild(badge);
    content.appendChild(header);

    // Subtitle
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'chart-modal-subtitle';
    subtitleEl.textContent = subtitle;
    content.appendChild(subtitleEl);

    // Legend in modal
    const legend = document.createElement('div');
    legend.className = 'chart-legend chart-modal-legend';

    if (raiseHands.length > 0) {
        legend.innerHTML += '<div class="legend-item"><span class="legend-color legend-raise"></span><span class="legend-label">Raise/3-Bet/4-Bet</span></div>';
    }
    if (callHands.length > 0) {
        legend.innerHTML += '<div class="legend-item"><span class="legend-color legend-call"></span><span class="legend-label">Call</span></div>';
    }
    legend.innerHTML += '<div class="legend-item"><span class="legend-color legend-fold"></span><span class="legend-label">Fold</span></div>';
    content.appendChild(legend);

    // Full-size grid
    const grid = createHandGrid({
        raiseHands: raiseHands,
        callHands: callHands,
        interactive: false
    });
    grid.classList.add('chart-grid-large');
    content.appendChild(grid);

    // Stats
    const stats = calculateRangeStats(raiseHands, callHands);
    const statsEl = document.createElement('div');
    statsEl.className = 'chart-modal-stats';
    statsEl.innerHTML = `
        <div class="stat-item">
            <span class="stat-value">${raiseHands.length + callHands.length}</span>
            <span class="stat-label">Hand Types</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${stats.totalCombos}</span>
            <span class="stat-label">Combos</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${stats.totalPercent}%</span>
            <span class="stat-label">of Hands</span>
        </div>
    `;
    content.appendChild(statsEl);

    // Breakdown detail
    if (breakdown) {
        const breakdownEl = document.createElement('div');
        breakdownEl.className = 'chart-modal-breakdown';
        breakdownEl.textContent = breakdown;
        content.appendChild(breakdownEl);
    }

    // Hand list
    const handListSection = document.createElement('div');
    handListSection.className = 'chart-modal-hands';

    if (raiseHands.length > 0) {
        const raiseList = document.createElement('div');
        raiseList.className = 'hand-list raise-list';
        raiseList.innerHTML = `<strong>Raise/3-Bet:</strong> ${raiseHands.join(', ')}`;
        handListSection.appendChild(raiseList);
    }

    if (callHands.length > 0) {
        const callList = document.createElement('div');
        callList.className = 'hand-list call-list';
        callList.innerHTML = `<strong>Call:</strong> ${callHands.join(', ')}`;
        handListSection.appendChild(callList);
    }

    content.appendChild(handListSection);

    // Shared close function that cleans up escape handler
    const closeChartModal = () => {
        document.removeEventListener('keydown', escHandler);
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    };

    // Close on Escape
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeChartModal();
        }
    };

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-secondary chart-modal-close';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', closeChartModal);
    content.appendChild(closeBtn);

    modal.appendChild(content);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeChartModal();
        }
    });

    document.addEventListener('keydown', escHandler);

    document.body.appendChild(modal);
}

function getPositionFullName(pos) {
    const names = {
        'UTG': 'Under The Gun (first to act)',
        'HJ': 'Hijack (2 before button)',
        'CO': 'Cutoff (1 before button)',
        'BTN': 'Button (dealer)',
        'SB': 'Small Blind',
        'BB': 'Big Blind'
    };
    return names[pos] || pos;
}

export default {
    render
};
