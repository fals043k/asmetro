const API_BASE_URL = `http://${window.location.hostname}:8080`;

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    initDropdown();
    loadEvents();
});

let currentFilter = 'all';
let eventsData = [];

async function loadHeader() {
    try {
        const response = await fetch('1header.html');
        if (!response.ok) return;
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const headerContent = doc.querySelector('.main-header');
        if (headerContent) {
            const block = document.getElementById('header-block');
            if (block) block.appendChild(headerContent);
        }
    } catch (e) {}
}

async function loadFooter() {
    try {
        const response = await fetch('2footer.html');
        if (!response.ok) return;
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const footerContent = doc.querySelector('.footer');
        if (footerContent) {
            const block = document.getElementById('footer-block');
            if (block) block.appendChild(footerContent);
        }
    } catch (e) {}
}

function initDropdown() {
    const filterButton = document.getElementById('filter-button');
    const filterMenu = document.getElementById('filter-menu');
    const filterItems = document.querySelectorAll('.dropdown__item');

    if (!filterButton || !filterMenu) return;

    filterButton.addEventListener('click', function(e) {
        e.stopPropagation();
        filterButton.classList.toggle('active');
        filterMenu.classList.toggle('active');
    });

    filterItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            const filterText = this.textContent;

            filterItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const selectedSpan = filterButton.querySelector('.dropdown__selected');
            if (selectedSpan) selectedSpan.textContent = filterText;

            currentFilter = filterValue;
            renderEvents(eventsData);

            filterButton.classList.remove('active');
            filterMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(e) {
        if (!filterMenu.contains(e.target) && !filterButton.contains(e.target)) {
            filterButton.classList.remove('active');
            filterMenu.classList.remove('active');
        }
    });
}

async function loadEvents() {
    const eventsGrid = document.getElementById('events-grid');
    if (!eventsGrid) return;

    try {
        const listResp = await fetch(`${API_BASE_URL}/api/v1/content/мероприятия/list`);
        
        if (!listResp.ok) {
            eventsGrid.innerHTML = '<div class="news-grid__error">Ошибка загрузки</div>';
            return;
        }
        
        const ids = await listResp.json();
        
        const eventIds = Array.isArray(ids) ? ids : [];
        if (!eventIds.length) {
            eventsGrid.innerHTML = '<div class="news-grid__empty">Нет мероприятий</div>';
            return;
        }

        eventsData = [];
        for (const id of eventIds) {
            try {
                const contentData = await fetchEventContent(id);
                if (contentData) {
                    eventsData.push({
                        id: id,
                        title: contentData.header || 'Без названия',
                        datetime: formatEventDate(contentData.date),
                        year: extractYear(contentData.date),
                        body: contentData.body || '',
                        dateRaw: contentData.date
                    });
                }
            } catch (e) {}
        }

        renderEvents(eventsData);
        
    } catch (error) {
        eventsGrid.innerHTML = '<div class="news-grid__error">Ошибка загрузки</div>';
    }
}

async function fetchEventContent(id) {
    try {
        const resp = await fetch(
            `${API_BASE_URL}/api/v1/content/мероприятия/content?name=${encodeURIComponent(id)}`
        );
        if (!resp.ok) return null;
        return await resp.json();
    } catch {
        return null;
    }
}

function formatEventDate(dateStr) {
    if (!dateStr) return '';
    try {
        const parts = dateStr.split('T');
        const datePart = parts[0];
        const timePart = parts[1] || '';
        const [year, month, day] = datePart.split('-');
        let result = `${day}.${month}.${year}`;
        if (timePart) {
            const [hours, minutes] = timePart.split(':');
            result += ` в ${hours}:${minutes}`;
        }
        return result;
    } catch {
        return dateStr;
    }
}

function extractYear(dateStr) {
    if (!dateStr) return '';
    try {
        return dateStr.split('-')[0];
    } catch {
        return '';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createEventsCard(event) {
    return `
        <div class="events-card" data-event-id="${escapeHtml(event.id)}">
            <h3 class="events-card__title">${escapeHtml(event.title)}</h3>
            <div class="events-card__footer">
                <p class="events-card__date">${escapeHtml(event.datetime)}</p>
                <div class="events-card__button">
                    <img src="img/arrow-right (2).svg" alt="→">
                </div>
            </div>
        </div>
    `;
}

function renderEvents(eventsArray) {
    const eventsGrid = document.getElementById('events-grid');
    if (!eventsGrid) return;

    let filteredEvents = eventsArray;
    if (currentFilter !== 'all') {
        filteredEvents = eventsArray.filter(event => event.year === currentFilter);
    }

    if (!filteredEvents.length) {
        eventsGrid.innerHTML = '<div class="news-grid__empty">Нет мероприятий за выбранный период</div>';
        return;
    }

    eventsGrid.innerHTML = filteredEvents.map(createEventsCard).join('');
    initEventsCardClicks();
}

function initEventsCardClicks() {
    const eventsCards = document.querySelectorAll('.events-card');
    
    eventsCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const eventId = this.getAttribute('data-event-id');
            
            const eventData = eventsData.find(e => e.id === eventId);
            if (eventData) {
                openEventPopup(eventData);
            }
        });
    });
}

let eventsPopupElement = null;

function createEventPopup() {
    const popup = document.createElement('div');
    popup.className = 'events-popup';
    popup.id = 'event-popup-dynamic';
    popup.innerHTML = `
        <div class="events-popup__content">
            <button class="events-popup__close" id="event-popup-close-btn">
                <img src="img/cross-icon.svg" alt="Закрыть">
            </button>
            <h3 class="events-popup__title"></h3>
            <p class="events-popup__datetime"></p>
            <div class="events-popup__text"></div>
        </div>
    `;
    document.body.appendChild(popup);
    return popup;
}

function initEventPopupHandlers() {
    if (eventsPopupElement) {
        const closeBtn = eventsPopupElement.querySelector('#event-popup-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeEventPopup);
        }
        eventsPopupElement.addEventListener('click', (e) => {
            if (e.target === eventsPopupElement) closeEventPopup();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && eventsPopupElement.classList.contains('active')) {
                closeEventPopup();
            }
        });
    }
}

function closeEventPopup() {
    if (eventsPopupElement) {
        eventsPopupElement.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function formatBodyContent(text) {
    if (!text) return '';
    
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    
    const urlRegex = /(?:https?:\/\/|www\.)[^\s<]+/gi;
    
    return paragraphs.map(paragraph => {
        let processed = paragraph.trim();
        processed = processed.replace(urlRegex, (url) => {
            const href = url.startsWith('http') ? url : `https://${url}`;
            return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
        return `<p>${processed}</p>`;
    }).join('');
}

async function openEventPopup(eventData) {
    if (!eventsPopupElement) {
        eventsPopupElement = createEventPopup();
        initEventPopupHandlers();
    }

    let content = eventData;
    if (!content.body) {
        const fresh = await fetchEventContent(eventData.id);
        if (fresh) content = fresh;
    }

    const titleEl = eventsPopupElement.querySelector('.events-popup__title');
    const datetimeEl = eventsPopupElement.querySelector('.events-popup__datetime');
    const bodyEl = eventsPopupElement.querySelector('.events-popup__text');

    if (titleEl) titleEl.textContent = content.header || eventData.title || '';
    if (datetimeEl && (content.date || eventData.dateRaw)) {
        datetimeEl.textContent = formatEventDate(content.date || eventData.dateRaw);
    }
    if (bodyEl && content.body) {
        bodyEl.innerHTML = formatBodyContent(content.body);
    }

    eventsPopupElement.classList.add('active');
    
    document.body.style.overflow = 'hidden';
}