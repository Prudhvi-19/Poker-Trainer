// Concepts & Theory Module

import conceptsData from '../data/concepts.js';
import storage from '../utils/storage.js';

function render() {
    const container = document.createElement('div');

    // Header
    const header = document.createElement('div');
    header.innerHTML = '<h1>🧠 Poker Concepts & Theory</h1>';
    header.style.marginBottom = '2rem';
    container.appendChild(header);

    // Category navigation
    const nav = createCategoryNav();
    container.appendChild(nav);

    // Concepts sections
    conceptsData.CONCEPT_CATEGORIES.forEach(category => {
        const section = createConceptCategory(category);
        container.appendChild(section);
    });

    return container;
}

function createCategoryNav() {
    const nav = document.createElement('div');
    nav.className = 'card mb-lg concepts-nav';
    nav.style.display = 'flex';
    nav.style.gap = '1rem';
    nav.style.flexWrap = 'wrap';

    conceptsData.CONCEPT_CATEGORIES.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.innerHTML = `${category.icon} ${category.title}`;
        btn.addEventListener('click', () => {
            document.getElementById(`category-${category.id}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
        nav.appendChild(btn);
    });

    return nav;
}

function createConceptCategory(category) {
    const section = document.createElement('div');
    section.id = `category-${category.id}`;
    section.className = 'card mb-lg';

    const header = document.createElement('h2');
    header.innerHTML = `${category.icon} ${category.title}`;
    header.style.marginBottom = '1.5rem';
    section.appendChild(header);

    const concepts = conceptsData.getConceptsByCategory(category.id);

    concepts.forEach(concept => {
        const conceptEl = createConceptItem(concept);
        section.appendChild(conceptEl);
    });

    return section;
}

function createConceptItem(concept) {
    const item = document.createElement('div');
    item.className = 'concept-section';

    const headerBtn = document.createElement('div');
    headerBtn.className = 'concept-header';

    const title = document.createElement('h3');
    title.textContent = concept.title;
    title.style.margin = '0';

    const arrow = document.createElement('span');
    arrow.textContent = '▼';
    arrow.style.transition = 'transform 0.3s ease';

    headerBtn.appendChild(title);
    headerBtn.appendChild(arrow);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'concept-content';
    contentDiv.style.display = 'none';

    // Convert content (which may have markdown-like formatting) to HTML
    const lines = concept.content.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
        line = line.trim();

        if (!line) {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += '<br>';
            return;
        }

        // Bold text: **text**
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // List items
        if (line.startsWith('- ')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += `<li>${line.substring(2)}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<p>${line}</p>`;
        }
    });

    if (inList) {
        html += '</ul>';
    }

    contentDiv.innerHTML = html;

    // Toggle functionality
    let isExpanded = false;
    headerBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        if (isExpanded) {
            contentDiv.style.display = 'block';
            headerBtn.classList.add('expanded');
            arrow.style.transform = 'rotate(180deg)';
            markAsRead(concept.id);
        } else {
            contentDiv.style.display = 'none';
            headerBtn.classList.remove('expanded');
            arrow.style.transform = 'rotate(0deg)';
        }
    });

    item.appendChild(headerBtn);
    item.appendChild(contentDiv);

    return item;
}

function markAsRead(conceptId) {
    const progress = storage.getProgress();
    if (!progress.studiedConcepts) {
        progress.studiedConcepts = [];
    }

    if (!progress.studiedConcepts.includes(conceptId)) {
        progress.studiedConcepts.push(conceptId);
        storage.saveProgress(progress);
    }
}

export default {
    render
};
