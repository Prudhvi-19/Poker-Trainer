// Scenarios Library Module

import scenariosData from '../data/scenarios.js';
import storage from '../utils/storage.js';
import { showModal } from '../components/Modal.js';

function render() {
    const container = document.createElement('div');

    // Header
    const header = document.createElement('div');
    header.innerHTML = '<h1>📚 Scenarios Library</h1>';
    header.style.marginBottom = '2rem';
    container.appendChild(header);

    // Filters
    const filters = createFilters();
    container.appendChild(filters);

    // Scenarios list
    const listContainer = document.createElement('div');
    listContainer.id = 'scenarios-list';
    listContainer.className = 'scenario-list';
    container.appendChild(listContainer);

    renderScenarios();

    return container;
}

function createFilters() {
    const section = document.createElement('div');
    section.className = 'card mb-lg';

    const label = document.createElement('label');
    label.textContent = 'Filter by Category:';
    label.style.fontWeight = '600';
    label.style.marginRight = '1rem';

    const select = document.createElement('select');
    select.style.padding = '0.5rem 1rem';

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Categories';
    select.appendChild(allOption);

    Object.values(scenariosData.SCENARIO_CATEGORIES).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        renderScenarios(e.target.value);
    });

    section.appendChild(label);
    section.appendChild(select);

    return section;
}

function renderScenarios(filterCategory = 'all') {
    const listEl = document.getElementById('scenarios-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    const progress = storage.getProgress();
    const studiedScenarios = progress.studiedScenarios || [];

    let scenarios = scenariosData.SCENARIOS;

    if (filterCategory !== 'all') {
        scenarios = scenarios.filter(s => s.category === filterCategory);
    }

    if (scenarios.length === 0) {
        listEl.innerHTML = '<p class="text-muted">No scenarios found.</p>';
        return;
    }

    scenarios.forEach(scenario => {
        const item = createScenarioItem(scenario, studiedScenarios.includes(scenario.id));
        listEl.appendChild(item);
    });
}

function createScenarioItem(scenario, isStudied) {
    const item = document.createElement('div');
    item.className = `scenario-item${isStudied ? ' studied' : ''}`;

    const header = document.createElement('div');
    header.className = 'scenario-header';

    const category = document.createElement('span');
    category.className = 'scenario-category';
    category.textContent = scenario.category;

    const difficulty = document.createElement('span');
    difficulty.className = `badge badge-${scenario.difficulty === 'easy' ? 'success' : scenario.difficulty === 'medium' ? 'warning' : 'error'}`;
    difficulty.textContent = scenario.difficulty.toUpperCase();

    header.appendChild(category);
    header.appendChild(difficulty);

    const title = document.createElement('div');
    title.className = 'scenario-title';
    title.textContent = scenario.title;

    const description = document.createElement('div');
    description.style.color = 'var(--color-text-secondary)';
    description.style.fontSize = '0.875rem';
    description.style.marginTop = '0.5rem';
    description.textContent = scenario.question;

    item.appendChild(header);
    item.appendChild(title);
    item.appendChild(description);

    item.addEventListener('click', () => showScenarioDetail(scenario));

    return item;
}

function showScenarioDetail(scenario) {
    const content = document.createElement('div');

    content.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <span class="badge badge-info">${scenario.category}</span>
            <span class="badge badge-${scenario.difficulty === 'easy' ? 'success' : scenario.difficulty === 'medium' ? 'warning' : 'error'}" style="margin-left: 0.5rem;">
                ${scenario.difficulty.toUpperCase()}
            </span>
        </div>

        <h3 style="margin-bottom: 1rem;">${scenario.question}</h3>

        <div style="background: var(--color-bg-tertiary); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <strong>Setup:</strong><br>
            ${Object.entries(scenario.setup).map(([key, value]) =>
                `<div style="margin-top: 0.5rem;">• ${key}: ${value}</div>`
            ).join('')}
        </div>

        <div style="background: var(--color-success); background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--color-success); margin: 1rem 0;">
            <strong>✅ Correct Answer:</strong><br>
            <div style="margin-top: 0.5rem;">${scenario.correctAnswer}</div>
        </div>

        <div style="margin: 1rem 0;">
            <strong>Explanation:</strong><br>
            <p style="margin-top: 0.5rem; line-height: 1.6;">${scenario.explanation}</p>
        </div>

        ${scenario.commonMistakes && scenario.commonMistakes.length > 0 ? `
            <div style="margin: 1rem 0;">
                <strong>Common Mistakes:</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${scenario.commonMistakes.map(mistake => `<li style="margin: 0.5rem 0;">${mistake}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        ${scenario.concepts && scenario.concepts.length > 0 ? `
            <div style="margin-top: 1rem;">
                <strong>Key Concepts:</strong><br>
                <div style="margin-top: 0.5rem;">
                    ${scenario.concepts.map(concept =>
                        `<span class="badge badge-info" style="margin-right: 0.5rem;">${concept}</span>`
                    ).join('')}
                </div>
            </div>
        ` : ''}
    `;

    showModal({
        title: scenario.title,
        content,
        buttons: [
            {
                text: 'Mark as Studied',
                className: 'btn btn-success',
                onClick: () => markAsStudied(scenario.id)
            },
            {
                text: 'Close',
                className: 'btn btn-secondary'
            }
        ]
    });
}

function markAsStudied(scenarioId) {
    const progress = storage.getProgress();
    if (!progress.studiedScenarios) {
        progress.studiedScenarios = [];
    }

    if (!progress.studiedScenarios.includes(scenarioId)) {
        progress.studiedScenarios.push(scenarioId);
        storage.saveProgress(progress);
        renderScenarios();
    }
}

export default {
    render
};
