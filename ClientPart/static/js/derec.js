const DerecPageApp = (() => {
    'use strict';

    const CONFIG = {
        API_BASE_URL: `http://${window.location.hostname}:8080`,
        SELECTORS: {
            HEADER_BLOCK: '#header-block',
            FOOTER_BLOCK: '#footer-block',
            HERO_TITLE: '.hero__title',
            HERO_SUBTITLE: '.hero__subtitle',
            TEAM_MAIN_NAME: '.team__main-name',
            TEAM_MAIN_LIST: '.team__main-list:first-of-type',
            TEAM_MAIN_SECTION: '.team__main-section',
            TEAM_MAIN_TEXT: '.team__main-text',
            TEAM_MAIN_LIST_DOTS: '.team__main-list--dots',
            TASKS_TEXT: '.tasks__text:first-of-type',
            TASKS_LIST: '.tasks__list',
            TASKS_CONTENT: '.tasks__content p:nth-of-type(2)',
            SLIDER: '.slider',
            SLIDER_LINK: '.slider__link',
            SLIDER_PHOTO_IMG: '.slider__photo-img',
            SLIDER_POSITION: '.slider__position',
            SLIDER_CONTACT: '.slider__contact'
        },
        API_ENDPOINTS: {
            LOCALE_DEREC: '/api/v1/locale/derec',
            TEAM_ORDER: '/api/v1/block/команда/order',
            TEAM_CONTENT: '/api/v1/block/команда/content',
            TEAM_ATTACHMENT: '/api/v1/block/команда/attachment'
        },
        TIMEOUT_MS: 10000,
        PLACEHOLDER_SVG: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23e0e0e0\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%23999\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' font-size=\'14\'%3EНет фото%3C/text%3E%3C/svg%3E'
    };

    let state = {
        objectUrls: []
    };

    function init() {
        document.addEventListener('DOMContentLoaded', async () => {
            await Promise.all([
                loadComponent(CONFIG.SELECTORS.HEADER_BLOCK, '1header.html', '.main-header'),
                loadComponent(CONFIG.SELECTORS.FOOTER_BLOCK, '2footer.html', '.footer')
            ]);
            
            await loadMainTexts();
            await loadTeamMembers();
            initSliderScroll();
        });
    }

    async function loadComponent(blockSelector, filePath, contentSelector) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);
            
            const response = await fetch(filePath, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const content = doc.querySelector(contentSelector);
            
            if (content) {
                const block = document.querySelector(blockSelector);
                if (block) block.appendChild(content);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(`Component load failed: ${filePath}`, error);
            }
        }
    }

    async function loadMainTexts() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);
            
            const response = await fetch(
                `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.LOCALE_DEREC}`,
                { signal: controller.signal }
            );
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.warn('Не удалось загрузить тексты для страницы дирекции');
                return;
            }
            
            const data = await response.json();
            
            updateTextContent(CONFIG.SELECTORS.HERO_TITLE, data.название);
            updateTextContent(CONFIG.SELECTORS.HERO_SUBTITLE, data.описание);
            updateTextContent(CONFIG.SELECTORS.TEAM_MAIN_NAME, data.фио);
            
            if (data.заслуги) {
                updateListContent(CONFIG.SELECTORS.TEAM_MAIN_LIST, data.заслуги, 'newline');
            }
            
            if (data.образование) {
                const educationSection = document.querySelector(`${CONFIG.SELECTORS.TEAM_MAIN_SECTION}:nth-of-type(1) ${CONFIG.SELECTORS.TEAM_MAIN_LIST}`);
                if (educationSection) {
                    updateListContent(educationSection, data.образование, 'newline');
                }
            }
            
            if (data.опыт) {
                updateParagraphContent(`${CONFIG.SELECTORS.TEAM_MAIN_SECTION}:nth-of-type(2)`, data.опыт, CONFIG.SELECTORS.TEAM_MAIN_TEXT);
            }
            
            if (data.факты) {
                const factsSection = document.querySelector(`${CONFIG.SELECTORS.TEAM_MAIN_SECTION}:nth-of-type(2) ${CONFIG.SELECTORS.TEAM_MAIN_LIST_DOTS}`);
                if (factsSection) {
                    updateListContent(factsSection, data.факты, 'newline');
                }
            }
            
            if (data.коллектив) {
                updateParagraphContent(`${CONFIG.SELECTORS.TEAM_MAIN_SECTION}:nth-of-type(3)`, data.коллектив, CONFIG.SELECTORS.TEAM_MAIN_TEXT);
            }
            
            updateTextContent(CONFIG.SELECTORS.TASKS_TEXT, data.цель);
            
            if (data.задачи) {
                updateTasksLists(data.задачи);
            }
            
            updateTextContent(CONFIG.SELECTORS.TASKS_CONTENT, data.кроме_того);
            
        } catch (error) {
            console.error('Ошибка загрузки текстов для страницы дирекции:', error);
        }
    }

    function updateTextContent(selector, text) {
        if (!text) return;
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    }

    function updateListContent(container, text, delimiter = 'newline') {
        if (!container) return;
        
        const items = delimiter === 'newline' 
            ? text.split('\n').filter(item => item.trim() !== '')
            : text.split('\n\n').filter(item => item.trim() !== '');
        
        container.innerHTML = items.map(item => `<li>${escapeHtml(item.trim())}</li>`).join('');
    }

    function updateParagraphContent(sectionSelector, text, paragraphClass) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;
        
        const title = section.querySelector('.team__main-section-title');
        section.innerHTML = '';
        if (title) section.appendChild(title);
        
        const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
        paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.className = paragraphClass;
            p.textContent = paragraph.trim();
            section.appendChild(p);
        });
    }

    function updateTasksLists(text) {
        const tasksLists = document.querySelectorAll(CONFIG.SELECTORS.TASKS_LIST);
        if (tasksLists.length < 2) return;
        
        const allTasks = text.split('\n').filter(task => task.trim() !== '');
        const кромеТогоIndex = allTasks.findIndex(task => 
            task.toLowerCase().includes('кроме того') || 
            task.toLowerCase().includes('кроме того,')
        );
        
        if (кромеТогоIndex !== -1) {
            const firstTasks = allTasks.slice(0, кромеТогоIndex);
            const secondTasks = allTasks.slice(кромеТогоIndex + 1);
            
            tasksLists[0].innerHTML = firstTasks.map(task => `<li>${escapeHtml(task.trim())}</li>`).join('');
            tasksLists[1].innerHTML = secondTasks.map(task => `<li>${escapeHtml(task.trim())}</li>`).join('');
        } else {
            const mid = Math.floor(allTasks.length / 2);
            tasksLists[0].innerHTML = allTasks.slice(0, mid).map(task => `<li>${escapeHtml(task.trim())}</li>`).join('');
            tasksLists[1].innerHTML = allTasks.slice(mid).map(task => `<li>${escapeHtml(task.trim())}</li>`).join('');
        }
    }

    async function loadTeamMembers() {
        const slider = document.querySelector(CONFIG.SELECTORS.SLIDER);
        if (!slider) return;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);
            
            const listResponse = await fetch(
                `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.TEAM_ORDER}`,
                { signal: controller.signal }
            );
            clearTimeout(timeoutId);
            
            if (!listResponse.ok) throw new Error(`HTTP ${listResponse.status}`);

            const ids = await listResponse.json();
            if (!Array.isArray(ids) || ids.length === 0) {
                slider.innerHTML = '<div class="slider__empty">Нет сотрудников</div>';
                return;
            }

            slider.innerHTML = '';

            for (const id of ids) {
                let contentData = {};
                let fullname = id;

                try {
                    const contentController = new AbortController();
                    const contentTimeout = setTimeout(() => contentController.abort(), CONFIG.TIMEOUT_MS);
                    
                    const contentResponse = await fetch(
                        `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.TEAM_CONTENT}?name=${encodeURIComponent(id)}`,
                        { signal: contentController.signal }
                    );
                    clearTimeout(contentTimeout);
                    
                    if (contentResponse.ok) {
                        contentData = await contentResponse.json();
                        if (contentData.fullname) fullname = contentData.fullname;
                    }
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.warn(`Content load failed for ${id}:`, error);
                    }
                }

                const card = createTeamCard(fullname, contentData, id);
                slider.appendChild(card);

                const img = card.querySelector(CONFIG.SELECTORS.SLIDER_PHOTO_IMG);
                if (img) loadTeamPhoto(id, img);

                const positionElement = card.querySelector(CONFIG.SELECTORS.SLIDER_POSITION);
                if (positionElement) {
                    positionElement.textContent = contentData.post || contentData.position || '';
                }

                const contactElement = card.querySelector(CONFIG.SELECTORS.SLIDER_CONTACT);
                if (contactElement) {
                    const phone = contentData.number || contentData.phone || '';
                    const email = contentData.email || '';
                    
                    contactElement.innerHTML = `
                        <li>${escapeHtml(phone)}</li>
                        <li>${escapeHtml(email)}</li>
                    `;
                }

                card.addEventListener('click', (event) => {
                    event.preventDefault();
                });
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Team load failed:', error);
                const slider = document.querySelector(CONFIG.SELECTORS.SLIDER);
                if (slider) {
                    slider.innerHTML = '<div class="slider__error">Ошибка загрузки сотрудников</div>';
                }
            }
        }
    }

    function createTeamCard(fullname, data, id) {
        const cardLink = document.createElement('a');
        cardLink.href = '#';
        cardLink.className = CONFIG.SELECTORS.SLIDER_LINK.replace('.', '');
        cardLink.dataset.teamId = id;

        const cardItem = document.createElement('div');
        cardItem.className = 'slider__item';

        cardItem.innerHTML = `
            <div class="slider__photo">
                <img src="" alt="${escapeHtml(fullname)}" class="${CONFIG.SELECTORS.SLIDER_PHOTO_IMG.replace('.', '')}">
            </div>
            <h3 class="slider__name">${escapeHtml(fullname)}</h3>
            <p class="${CONFIG.SELECTORS.SLIDER_POSITION.replace('.', '')}">${escapeHtml(data.post || data.position || '')}</p>
            <ul class="${CONFIG.SELECTORS.SLIDER_CONTACT.replace('.', '')}">
                <li>${escapeHtml(data.number || data.phone || '')}</li>
                <li>${escapeHtml(data.email || '')}</li>
            </ul>
        `;

        cardLink.appendChild(cardItem);
        return cardLink;
    }

    async function loadTeamPhoto(id, imgElement) {
        if (!imgElement || imgElement.dataset.loaded) return;
        
        imgElement.dataset.loaded = 'true';

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);
            
            const url = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.TEAM_ATTACHMENT}?name=${encodeURIComponent(id)}&attachment=photo`;
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            state.objectUrls.push(imageUrl);
            imgElement.src = imageUrl;
            imgElement.onload = () => URL.revokeObjectURL(imageUrl);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.warn(`Photo load failed for ${id}:`, error);
            }
            imgElement.src = CONFIG.PLACEHOLDER_SVG;
        }
    }

    function initSliderScroll() {
        const slider = document.querySelector(CONFIG.SELECTORS.SLIDER);
        if (!slider) return;

        slider.addEventListener('wheel', (event) => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.preventDefault();
                slider.scrollLeft += event.deltaY;
            }
        }, { passive: false });
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function cleanup() {
        state.objectUrls.forEach(url => URL.revokeObjectURL(url));
        state.objectUrls = [];
    }

    window.addEventListener('beforeunload', cleanup);

    return { init };
})();

DerecPageApp.init();