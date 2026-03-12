const API_BASE_URL = `http://${window.location.hostname}:8080`;

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    initDropdown();
    loadNews();
});

let currentFilter = 'all';
let newsData = [];
let newsPopupElement = null;

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

            filterItems.forEach(function(i) {
                i.classList.remove('active');
            });
            this.classList.add('active');

            const selectedSpan = filterButton.querySelector('.dropdown__selected');
            if (selectedSpan) {
                selectedSpan.textContent = filterText;
            }

            currentFilter = filterValue;
            renderNews(newsData);

            filterButton.classList.remove('active');
            filterMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(e) {
        if (!filterMenu.contains(e.target)) {
            filterButton.classList.remove('active');
            filterMenu.classList.remove('active');
        }
    });
}

async function loadNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    try {
        const listResp = await fetch(`${API_BASE_URL}/api/v1/content/новости/list`);
        if (!listResp.ok) {
            newsGrid.innerHTML = '<div class="news-grid__empty">Нет новостей</div>';
            return;
        }

        const ids = await listResp.json();
        const newsIds = Array.isArray(ids) ? ids : [];

        if (newsIds.length === 0) {
            newsGrid.innerHTML = '<div class="news-grid__empty">Нет новостей</div>';
            return;
        }

        newsData = [];

        for (const id of newsIds) {
            const contentData = await fetchNewsContent(id);
            if (contentData) {
                newsData.push({
                    id: id,
                    header: contentData.header || '',
                    body: contentData.body || '',
                    date: contentData.date || '',
                    year: extractYear(contentData.date)
                });
            }
        }

        renderNews(newsData);
    } catch (error) {
        console.error('Error loading news:', error);
        newsGrid.innerHTML = '<div class="news-grid__error">Ошибка загрузки новостей</div>';
    }
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

function extractYear(dateStr) {
    if (!dateStr) return '';
    try {
        const [year] = dateStr.split('-');
        return year;
    } catch {
        return '';
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

function createNewsCard(news) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.setAttribute('data-news-id', news.id);
    card.style.cursor = 'pointer';

    const content = document.createElement('div');
    content.className = 'news-card__content';

    const title = document.createElement('h3');
    title.className = 'news-card__title';
    title.textContent = news.header || 'Без названия';

    const date = document.createElement('p');
    date.className = 'news-card__date';
    date.textContent = formatDate(news.date);

    content.appendChild(title);
    content.appendChild(date);
    card.appendChild(content);

    loadNewsImage(news.id, 'mini').then(url => {
        if (url) {
            card.style.backgroundImage = `url('${url}')`;
        }
    });

    card.addEventListener('click', function(e) {
        e.preventDefault();
        openNewsPopup(news.id, news);
    });

    return card;
}

function renderNews(newsArray) {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    let filteredNews = newsArray;
    if (currentFilter !== 'all') {
        filteredNews = newsArray.filter(function(news) {
            return news.year === currentFilter;
        });
    }

    newsGrid.innerHTML = '';

    if (filteredNews.length === 0) {
        newsGrid.innerHTML = '<div class="news-grid__empty">Нет новостей за выбранный период</div>';
        return;
    }

    filteredNews.forEach(function(news) {
        newsGrid.appendChild(createNewsCard(news));
    });
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

async function loadHeader() {
    try {
        const response = await fetch('1header.html');
        if (!response.ok) return;
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const headerContent = doc.querySelector('.main-header');
        if (headerContent) {
            const headerBlock = document.getElementById('header-block');
            if (headerBlock) headerBlock.appendChild(headerContent);
        }
    } catch {}
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
            const footerBlock = document.getElementById('footer-block');
            if (footerBlock) footerBlock.appendChild(footerContent);
        }
    } catch {}
}