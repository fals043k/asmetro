// derec.js
const API_BASE_URL = `http://${window.location.hostname}:8080`;

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    loadTeamMembers();
});

async function loadHeader() {
    try {
        const response = await fetch('1header.html');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const headerContent = doc.querySelector('.main-header');
        
        if (headerContent) {
            const block = document.getElementById('header-block');
            if (block) block.appendChild(headerContent);
        }
        
        if (typeof initHeaderDropdown === 'function') initHeaderDropdown();
        if (typeof initMobileHeader === 'function') initMobileHeader();
    } catch (error) {
        console.error('Header load failed:', error);
    }
}

async function loadFooter() {
    try {
        const response = await fetch('2footer.html');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const footerContent = doc.querySelector('.footer');
        
        if (footerContent) {
            const block = document.getElementById('footer-block');
            if (block) block.appendChild(footerContent);
        }
    } catch (error) {
        console.error('Footer load failed:', error);
    }
}

async function loadTeamMembers() {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    try {
        const listResponse = await fetch(`${API_BASE_URL}/api/v1/content/команда/list`);
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
                const contentResponse = await fetch(
                    `${API_BASE_URL}/api/v1/content/команда/content?name=${encodeURIComponent(id)}`
                );
                if (contentResponse.ok) {
                    contentData = await contentResponse.json();
                    if (contentData.fullname) fullname = contentData.fullname;
                }
            } catch (error) {
                console.warn(`Content load failed for ${id}:`, error);
            }

            const card = createTeamCard(fullname, contentData, id);
            slider.appendChild(card);

            const img = card.querySelector('.slider__photo-img');
            if (img) loadTeamPhoto(id, img);

            const positionElement = card.querySelector('.slider__position');
            if (positionElement) {
                positionElement.textContent = contentData.post || contentData.position || '';
            }

            const contactElement = card.querySelector('.slider__contact');
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
        console.error('Team load failed:', error);
        const slider = document.querySelector('.slider');
        if (slider) {
            slider.innerHTML = '<div class="slider__error">Ошибка загрузки сотрудников</div>';
        }
    }
}

function createTeamCard(fullname, data, id) {
    const cardLink = document.createElement('a');
    cardLink.href = '#';
    cardLink.className = 'slider__link';
    cardLink.dataset.teamId = id;

    const cardItem = document.createElement('div');
    cardItem.className = 'slider__item';

    cardItem.innerHTML = `
        <div class="slider__photo">
            <img src="" alt="${escapeHtml(fullname)}" class="slider__photo-img">
        </div>
        <h3 class="slider__name">${escapeHtml(fullname)}</h3>
        <p class="slider__position">${escapeHtml(data.post || data.position || '')}</p>
        <ul class="slider__contact">
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
        const url = `${API_BASE_URL}/api/v1/content/команда/attachment?name=${encodeURIComponent(id)}&attachment=photo`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        imgElement.src = imageUrl;
        imgElement.onload = () => URL.revokeObjectURL(imageUrl);
    } catch (error) {
        console.warn(`Photo load failed for ${id}:`, error);
        imgElement.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23e0e0e0\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%23999\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' font-size=\'14\'%3EНет фото%3C/text%3E%3C/svg%3E';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}