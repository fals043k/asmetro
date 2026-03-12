const API_BASE_URL = `http://${window.location.hostname}:8080`;

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    loadTeamMembers();
});

async function loadHeader() {
    try {
        const response = await fetch('1header.html');
        if (!response.ok) throw new Error('Header error');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const headerContent = doc.querySelector('.main-header');
        if (headerContent) {
            const block = document.getElementById('header-block');
            if (block) block.appendChild(headerContent);
        }
    } catch (e) {
        console.error('Header:', e);
    }
}

async function loadFooter() {
    try {
        const response = await fetch('2footer.html');
        if (!response.ok) throw new Error('Footer error');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const footerContent = doc.querySelector('.footer');
        if (footerContent) {
            const block = document.getElementById('footer-block');
            if (block) block.appendChild(footerContent);
        }
    } catch (e) {
        console.error('Footer:', e);
    }
}

async function loadTeamMembers() {
    const slider = document.getElementById('team-slider');
    if (!slider) return;
    
    try {
        const listResp = await fetch(`${API_BASE_URL}/api/v1/content/команда/list`);
        if (!listResp.ok) throw new Error(`HTTP ${listResp.status}`);
        
        const listData = await listResp.json();
        const ids = Array.isArray(listData) ? listData : [];
        
        if (ids.length === 0) {
            slider.innerHTML = '<div class="slider__empty">Нет сотрудников</div>';
            return;
        }
        
        slider.innerHTML = '';
        
        for (const id of ids) {
            let contentData = {};
            let fullname = id;
            
            try {
                const contentResp = await fetch(
                    `${API_BASE_URL}/api/v1/content/команда/content?name=${encodeURIComponent(id)}`
                );
                if (contentResp.ok) {
                    contentData = await contentResp.json();
                    if (contentData.fullname) {
                        fullname = contentData.fullname;
                    }
                }
            } catch (e) {
                console.warn(`Content load failed for ${id}:`, e);
            }
            
            const card = createCard(fullname, contentData);
            slider.appendChild(card);
            
            const img = card.querySelector('.slider__photo-img');
            if (img) loadPhoto(id, img);
            
            const posEl = card.querySelector('.slider__position');
            const contactEl = card.querySelector('.slider__contact');
            if (posEl) posEl.textContent = contentData.post || contentData.position || '';
            if (contactEl) {
                let html = '';
                if (contentData.number || contentData.phone) html += `<li>${contentData.number || contentData.phone}</li>`;
                if (contentData.email) html += `<li>${contentData.email}</li>`;
                contactEl.innerHTML = html || '<li></li><li></li>';
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
        const slider = document.getElementById('team-slider');
        if (slider) slider.innerHTML = '<div class="slider__error">Ошибка загрузки</div>';
    }
}


function createCard(fullname, data) {
    const cardLink = document.createElement('a');
    cardLink.href = '#';
    cardLink.className = 'slider__link';
    
    const cardItem = document.createElement('div');
    cardItem.className = 'slider__item';
    
    cardItem.innerHTML = `
        <div class="slider__photo">
            <img src="" alt="${fullname}" class="slider__photo-img">
        </div>
        <h3 class="slider__name">${fullname}</h3>
        <p class="slider__position"></p>
        <ul class="slider__contact">
            <li></li>
            <li></li>
        </ul>
    `;
    
    cardLink.appendChild(cardItem);
    return cardLink;
}

async function loadPhoto(id, imgElement) {
    if (!imgElement || imgElement.dataset.loaded) return;
    imgElement.dataset.loaded = '1';
    
    try {
        const url = `${API_BASE_URL}/api/v1/content/команда/attachment?name=${encodeURIComponent(id)}&attachment=photo`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const blob = await response.blob();
        const src = URL.createObjectURL(blob);
        imgElement.src = src;
        imgElement.onload = () => URL.revokeObjectURL(src);
        
    } catch (e) {
        imgElement.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23e0e0e0" width="200" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">Нет фото</text></svg>';
    }
}
