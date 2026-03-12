const API_BASE_URL = `http://${window.location.hostname}:8080`;

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    initAboutPopup();
    loadNews();
    loadEvents();
});

async function loadHeader() {
    try {
        const response = await fetch('1header.html');
        if (!response.ok) return;
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const headerContent = doc.querySelector('.main-header');
        if (headerContent) {
            const block = document.getElementById('header-block');
            if (block) block.appendChild(headerContent);
        }
    } catch {}
}

async function loadFooter() {
    try {
        const response = await fetch('2footer.html');
        if (!response.ok) return;
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const footerContent = doc.querySelector('.footer');
        if (footerContent) {
            const block = document.getElementById('footer-block');
            if (block) block.appendChild(footerContent);
        }
    } catch {}
}

function initAboutPopup() {
    const aboutBtn = document.querySelector('.about__btn');
    const aboutPopup = document.getElementById('about-popup');
    const aboutPopupClose = document.getElementById('about-popup-close');
    
    if (!aboutBtn || !aboutPopup) return;
    
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        aboutPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    if (aboutPopupClose) {
        aboutPopupClose.addEventListener('click', () => {
            aboutPopup.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && aboutPopup.classList.contains('active')) {
            aboutPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

let newsPopupElement = null;

async function loadNews() {
    const newsList = document.querySelector('.news__list');
    if (!newsList) return;

    const allNewsItems = newsList.querySelectorAll('a.news__item');
    if (!allNewsItems.length) return;

    try {
        const listResp = await fetch(`${API_BASE_URL}/api/v1/content/новости/list`);
        if (!listResp.ok) return;
        
        const ids = await listResp.json();
        const newsIds = Array.isArray(ids) ? ids : [];
        
        allNewsItems.forEach(item => item.style.display = 'none');

        if (!newsIds.length) return;

        for (let i = 0; i < newsIds.length && i < allNewsItems.length; i++) {
            const id = newsIds[i];
            const item = allNewsItems[i];
            
            const contentData = await fetchNewsContent(id);
            if (!contentData) continue;
            
            updateNewsCard(item, id, contentData);
            item.style.display = 'flex';
        }
    } catch {}
}

async function fetchNewsContent(id) {
    try {
        const resp = await fetch(
            `${API_BASE_URL}/api/v1/content/новости/content?name=${encodeURIComponent(id)}`
        );
        if (!resp.ok) return null;
        return await resp.json();
    } catch {
        return null;
    }
}

function updateNewsCard(item, id, data) {
    const titleEl = item.querySelector('.news__title');
    if (titleEl && data.header) {
        titleEl.textContent = data.header;
    }
    
    const dateEl = item.querySelector('.news__date');
    if (dateEl && data.date) {
        dateEl.textContent = formatDate(data.date);
    }
    
    if (data.header) {
        loadNewsImage(id, 'mini').then(url => {
            if (url) {
                item.style.backgroundImage = `url('${url}')`;
            }
        });
    }
    
    item.onclick = (e) => {
        e.preventDefault();
        openNewsPopup(id, data);
    };
    item.style.cursor = 'pointer';
}

async function loadNewsImage(id, type = 'mini') {
    try {
        const url = `${API_BASE_URL}/api/v1/content/новости/attachment?name=${encodeURIComponent(id)}&attachment=${type}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch {
        return null;
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    } catch {
        return dateStr;
    }
}

function createNewsPopup() {
    const popup = document.createElement('div');
    popup.className = 'news-popup';
    popup.id = 'news-popup-dynamic';
    popup.innerHTML = `
        <div class="news-popup__content">
            <button class="news-popup__close" id="news-popup-close-btn">
                <img src="img/cross-icon.svg" alt="Закрыть">
            </button>
            <div class="news-popup__text-wrapper">
                <h3 class="news-popup__title"></h3>
                <p class="news-popup__subtitle"></p>
                <div class="news-popup__section">
                    <div class="news-popup__body-content"></div>
                </div>
            </div>
            <div class="news-popup__image">
                <img src="" alt="">
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    return popup;
}

function initNewsPopupHandlers() {
    if (newsPopupElement) {
        const closeBtn = newsPopupElement.querySelector('#news-popup-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeNewsPopup);
        }
        
        newsPopupElement.addEventListener('click', (e) => {
            if (e.target === newsPopupElement) {
                closeNewsPopup();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && newsPopupElement.classList.contains('active')) {
                closeNewsPopup();
            }
        });
    }
}

function closeNewsPopup() {
    if (newsPopupElement) {
        newsPopupElement.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function formatBodyContent(text) {
    if (!text) return '';
    let formatted = text.replace(/\n/g, '<br>');
    const urlRegex = /(?:https?:\/\/|www\.)[^\s<]+/gi;
    return formatted.replace(urlRegex, (url) => {
        const href = url.startsWith('http') ? url : `https://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="news-popup__link">${url}</a>`;
    });
}

async function openNewsPopup(id, cachedData) {
    if (!newsPopupElement) {
        newsPopupElement = createNewsPopup();
        initNewsPopupHandlers();
    }
    
    let contentData = cachedData;
    if (!contentData || !contentData.body) {
        contentData = await fetchNewsContent(id);
        if (!contentData) return;
    }
    
    const titleEl = newsPopupElement.querySelector('.news-popup__title');
    const subtitleEl = newsPopupElement.querySelector('.news-popup__subtitle');
    const bodyEl = newsPopupElement.querySelector('.news-popup__body-content');
    const imgEl = newsPopupElement.querySelector('.news-popup__image img');
    
    if (titleEl) titleEl.textContent = contentData.header || '';
    
    if (subtitleEl) {
        subtitleEl.textContent = '';
    }
    
    if (bodyEl && contentData.body) {
        bodyEl.innerHTML = formatBodyContent(contentData.body);
    }
    
    if (imgEl) {
        const fullUrl = await loadNewsImage(id, 'full');
        if (fullUrl) {
            imgEl.src = fullUrl;
            imgEl.alt = contentData.header || '';
        }
    }
    
    newsPopupElement.classList.add('active');
    document.body.style.overflow = 'hidden';
}

let eventsPopupElement = null;

async function loadEvents() {
    const eventsList = document.querySelector('.events__list');
    if (!eventsList) return;

    const allEventItems = eventsList.querySelectorAll('.events__item');
    if (!allEventItems.length) return;

    try {
        const listResp = await fetch(`${API_BASE_URL}/api/v1/content/мероприятия/list`);
        if (!listResp.ok) return;
        
        const ids = await listResp.json();
        const eventIds = Array.isArray(ids) ? ids : [];
        
        allEventItems.forEach(item => item.style.display = 'none');

        if (!eventIds.length) return;

        for (let i = 0; i < eventIds.length && i < allEventItems.length; i++) {
            const id = eventIds[i];
            const item = allEventItems[i];
            
            const contentData = await fetchEventContent(id);
            if (!contentData) continue;
            
            updateEventCard(item, id, contentData);
            item.style.display = 'flex';
        }
    } catch {}
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

function updateEventCard(item, id, data) {
    const titleEl = item.querySelector('.events__title');
    if (titleEl && data.header) {
        titleEl.textContent = data.header;
    }
    
    const dateEl = item.querySelector('.events__date');
    if (dateEl && data.date) {
        dateEl.textContent = formatEventDate(data.date);
    }
    
    item.onclick = (e) => {
        e.preventDefault();
        openEventPopup(id, data);
    };
    item.style.cursor = 'pointer';
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

function createEventPopup() {
    const popup = document.createElement('div');
    popup.className = 'events-popup';
    popup.id = 'events-popup-dynamic';
    popup.innerHTML = `
        <div class="events-popup__content">
            <button class="events-popup__close" id="events-popup-close-btn">
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

function initEventsPopupHandlers() {
    if (eventsPopupElement) {
        const closeBtn = eventsPopupElement.querySelector('#events-popup-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeEventsPopup);
        }
        
        eventsPopupElement.addEventListener('click', (e) => {
            if (e.target === eventsPopupElement) {
                closeEventsPopup();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && eventsPopupElement.classList.contains('active')) {
                closeEventsPopup();
            }
        });
    }
}

function closeEventsPopup() {
    if (eventsPopupElement) {
        eventsPopupElement.classList.remove('active');
        document.body.style.overflow = '';
    }
}

async function openEventPopup(id, cachedData) {
    if (!eventsPopupElement) {
        eventsPopupElement = createEventPopup();
        initEventsPopupHandlers();
    }
    
    let contentData = cachedData;
    if (!contentData || !contentData.body) {
        contentData = await fetchEventContent(id);
        if (!contentData) return;
    }
    
    const titleEl = eventsPopupElement.querySelector('.events-popup__title');
    const datetimeEl = eventsPopupElement.querySelector('.events-popup__datetime');
    const bodyEl = eventsPopupElement.querySelector('.events-popup__text');
    
    if (titleEl) titleEl.textContent = contentData.header || '';
    
    if (datetimeEl && contentData.date) {
        datetimeEl.textContent = formatEventDate(contentData.date);
    }
    
    if (bodyEl && contentData.body) {
        bodyEl.innerHTML = formatBodyContent(contentData.body);
    }
    
    eventsPopupElement.classList.add('active');
    document.body.style.overflow = 'hidden';
}