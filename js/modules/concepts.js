// Concepts & Theory Module (hybrid blog-style)

import conceptsData from '../data/concepts.js';
import storage from '../utils/storage.js';

function render(route = {}) {
    const hash = route?.hash || window.location.hash.slice(1);
    const parts = (hash || '').split('/');
    const conceptId = parts[1] || null;

    if (conceptId) {
        return renderConceptArticle(conceptId);
    }

    return renderConceptsIndex();
}

function renderConceptsIndex() {
    const container = document.createElement('div');
    container.className = 'concepts-page';

    const header = document.createElement('div');
    header.className = 'concepts-page-header';
    header.innerHTML = '<h1>🧠 Poker Concepts & Theory</h1><p class="text-muted">Browse by category or search, then open a concept as a dedicated article.</p>';
    container.appendChild(header);

    const controlsCard = document.createElement('div');
    controlsCard.className = 'card mb-lg concepts-controls';
    controlsCard.innerHTML = `
        <div class="concepts-controls-row">
            <input id="concepts-search" class="concepts-search" type="text" placeholder="Search concepts (title + content)…" aria-label="Search concepts" />
            <button id="concepts-clear" class="btn btn-secondary">Clear</button>
        </div>
    `;
    container.appendChild(controlsCard);

    const nav = createCategoryNav();
    container.appendChild(nav);

    const listWrap = document.createElement('div');
    listWrap.className = 'concepts-index';
    container.appendChild(listWrap);

    const renderList = (query = '') => {
        listWrap.innerHTML = '';

        conceptsData.CONCEPT_CATEGORIES.forEach(category => {
            const section = document.createElement('section');
            section.id = `category-${category.id}`;
            section.className = 'card mb-lg concepts-category';

            const h2 = document.createElement('h2');
            h2.textContent = `${category.icon} ${category.title}`;
            section.appendChild(h2);

            const grid = document.createElement('div');
            grid.className = 'concepts-grid';
            section.appendChild(grid);

            let concepts = conceptsData.getConceptsByCategory(category.id);

            if (query) {
                const q = query.toLowerCase();
                concepts = concepts.filter(c =>
                    c.title.toLowerCase().includes(q) ||
                    c.content.toLowerCase().includes(q)
                );
            }

            if (concepts.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'text-muted';
                empty.textContent = 'No matching concepts in this category.';
                section.appendChild(empty);
            } else {
                concepts.forEach(concept => {
                    const card = createConceptCard(concept);
                    grid.appendChild(card);
                });
            }

            listWrap.appendChild(section);
        });
    };

    const search = controlsCard.querySelector('#concepts-search');
    const clearBtn = controlsCard.querySelector('#concepts-clear');

    search.addEventListener('input', () => renderList(search.value.trim()));
    clearBtn.addEventListener('click', () => {
        search.value = '';
        renderList('');
        search.focus();
    });

    renderList('');

    return container;
}

function createCategoryNav() {
    const nav = document.createElement('div');
    nav.className = 'card mb-lg concepts-nav';

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

function createConceptCard(concept) {
    const card = document.createElement('a');
    card.className = 'concept-card';
    card.href = `#concepts/${concept.id}`;

    const title = document.createElement('h3');
    title.textContent = concept.title;

    const excerpt = document.createElement('p');
    excerpt.className = 'text-muted';
    excerpt.textContent = makeExcerpt(concept.content, 160);

    const footer = document.createElement('div');
    footer.className = 'concept-card-footer';

    const pill = document.createElement('span');
    pill.className = 'concept-pill';
    pill.textContent = isStudied(concept.id) ? 'Studied' : 'New';

    const cta = document.createElement('span');
    cta.className = 'concept-cta';
    cta.textContent = 'Open →';

    footer.appendChild(pill);
    footer.appendChild(cta);

    card.appendChild(title);
    card.appendChild(excerpt);
    card.appendChild(footer);

    return card;
}

function renderConceptArticle(conceptId) {
    const concept = conceptsData.getConceptById(conceptId);
    if (!concept) {
        const err = document.createElement('div');
        err.className = 'card';
        err.innerHTML = `
            <h2>Concept not found</h2>
            <p class="text-muted">No concept exists with id: <code>${escapeHtml(conceptId)}</code></p>
            <a class="btn btn-primary" href="#concepts">Back to Concepts</a>
        `;
        return err;
    }

    markAsRead(concept.id);

    const container = document.createElement('div');
    container.className = 'concept-article-page';

    const topBar = document.createElement('div');
    topBar.className = 'concept-article-topbar';
    topBar.innerHTML = `
        <a class="btn btn-secondary btn-sm" href="#concepts">← All Concepts</a>
    `;

    const articleCard = document.createElement('article');
    articleCard.className = 'card concept-article';

    const title = document.createElement('h1');
    title.className = 'concept-article-title';
    title.textContent = concept.title;

    const layout = document.createElement('div');
    layout.className = 'concept-article-layout';

    const body = document.createElement('div');
    body.className = 'concept-article-body';
    body.innerHTML = renderConceptContentHtml(concept.content);

    // TOC: use bold headings in content (**Heading**) as sections.
    const toc = buildToc(body, concept.id);

    const main = document.createElement('div');
    main.className = 'concept-article-main';
    main.appendChild(body);

    layout.appendChild(main);
    if (toc) layout.appendChild(toc);

    articleCard.appendChild(title);
    articleCard.appendChild(layout);

    container.appendChild(topBar);
    container.appendChild(articleCard);

    return container;
}

function renderConceptContentHtml(content) {
    // Convert content (markdown-lite) to HTML
    const lines = content.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(rawLine => {
        let line = rawLine.trim();

        if (!line) {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += '<br>';
            return;
        }

        // Bold text: **text**
        line = escapeHtml(line).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // If the entire line is a bold heading, treat it like a section title.
        if (/^<strong>.*<\/strong>$/.test(line)) {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            const headingText = line.replace(/^<strong>|<\/strong>$/g, '');
            const id = slugify(headingText);
            html += `<h2 id="${id}">${headingText}</h2>`;
            return;
        }

        // List items
        if (line.startsWith('- ')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += `<li>${line.substring(2)}</li>`;
            return;
        }

        if (inList) {
            html += '</ul>';
            inList = false;
        }

        html += `<p>${line}</p>`;
    });

    if (inList) {
        html += '</ul>';
    }

    return html;
}

function buildToc(bodyEl, conceptId) {
    const headings = Array.from(bodyEl.querySelectorAll('h2'));
    if (headings.length < 2) return null;

    const toc = document.createElement('nav');
    toc.className = 'concept-toc';
    toc.setAttribute('aria-label', 'Table of contents');

    const title = document.createElement('div');
    title.className = 'concept-toc-title';
    title.textContent = 'On this page';
    toc.appendChild(title);

    const ul = document.createElement('ul');
    headings.forEach(h => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        // Keep a stable URL, do smooth scroll.
        a.href = `#concepts/${conceptId}`;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        a.textContent = h.textContent;
        li.appendChild(a);
        ul.appendChild(li);
    });
    toc.appendChild(ul);
    return toc;
}

function makeExcerpt(text, maxLen = 160) {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= maxLen) return cleaned;
    return cleaned.slice(0, maxLen - 1).trimEnd() + '…';
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 64);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function isStudied(conceptId) {
    const progress = storage.getProgress();
    return !!progress?.studiedConcepts?.includes(conceptId);
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
