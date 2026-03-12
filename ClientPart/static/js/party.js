const API_BASE_URL = `http://${window.location.hostname}:8080`;
const DEFAULT_TEXT = 'Текст по умолчанию';
const MODAL_ID = 'metroModal';
const OVERLAY_ID = 'modalOverlay';
const CONTENT_ID = 'modalContent';

const FALLBACK_METRO_DATA = {
    '123': {
        name: 'МЕТРОПОЛИТЕН',
        short_desc: DEFAULT_TEXT,
        full_desc_one: DEFAULT_TEXT,
        full_desc_two: DEFAULT_TEXT,
        scheme_desc: DEFAULT_TEXT,
        modern_desc: DEFAULT_TEXT,
        struct_desc: DEFAULT_TEXT,
        partnership_desc: DEFAULT_TEXT,
        safety_desc: DEFAULT_TEXT,
        acessable_desc: DEFAULT_TEXT
    }
};

const FALLBACK_COMPANY_DATA = {
    'default': {
        name: 'ПРЕДПРИЯТИЕ',
        short_desc: DEFAULT_TEXT,
        full_desc_one: DEFAULT_TEXT,
        full_desc_two: DEFAULT_TEXT,
        spec_desc: DEFAULT_TEXT,
        quality: DEFAULT_TEXT,
        contact: DEFAULT_TEXT
    }
};

function formatTextWithLineBreaks(text) {
    if (!text || typeof text !== 'string') return '';
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return escaped.replace(/\n/g, '<br>');
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    loadMetro();
    loadPredpriyatiya();
    initModal();
});

function initModal() {
    const modal = document.getElementById(MODAL_ID);
    const overlay = document.getElementById(OVERLAY_ID);
    if (!modal) return;

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openMetroModal(metroId, metroData) {
    const modal = document.getElementById(MODAL_ID);
    const modalContent = document.getElementById(CONTENT_ID);
    if (!modal || !modalContent) return;

    let dataToShow = metroData;
    if (metroData && metroData.status === 'content aint exists') {
        dataToShow = FALLBACK_METRO_DATA['123'] || FALLBACK_METRO_DATA[metroId];
    }

    modalContent.innerHTML = generateMetroContent(dataToShow, metroId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadModalAttachments(metroId);
}

function openPredpriyatiyaModal(companyId, companyData) {
    const modal = document.getElementById(MODAL_ID);
    const modalContent = document.getElementById(CONTENT_ID);
    if (!modal || !modalContent) return;

    let dataToShow = companyData;
    if (companyData && companyData.status === 'content aint exists') {
        dataToShow = FALLBACK_COMPANY_DATA['default'];
    }

    modalContent.innerHTML = generatePredpriyatiyaContent(dataToShow, companyId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadPredpriyatiyaModalAttachments(companyId);
}

function generateMetroContent(data, metroId) {
    const placeholder = 'data:image/svg+xml,Загрузка...';
    let html = `
        <div class="modal-hero">
            <div class="modal-hero__container">
                <div class="modal-hero__content">
                    <h1 class="modal-hero__title">${data.name || 'МЕТРОПОЛИТЕН'}</h1>
                    <p class="modal-hero__subtitle">${formatTextWithLineBreaks(data.short_desc)}</p>
                </div>
                <div class="modal-hero__logo">
                    <img src="${placeholder}" alt="Логотип" data-metro-id="${metroId}" data-attachment="logo" class="metro-attachment">
                </div>
            </div>
        </div>
    `;

    if (data.full_desc_one) {
        html += `
            <div class="modal-section modal-section--white">
                <div class="modal-section__container">
                    <div class="modal-section__image">
                        <img src="${placeholder}" alt="" data-metro-id="${metroId}" data-attachment="desc_one" class="metro-attachment">
                        <p class="modal-section__caption">Станция метро</p>
                    </div>
                    <div class="modal-section__text">
                        <h2 class="modal-section__title">ПОДРОБНО О МЕТРОПОЛИТЕНЕ</h2>
                        <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.full_desc_one)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    if (data.full_desc_two) {
        html += `
            <div class="modal-section modal-section--blue">
                <div class="modal-section__container">
                    <div class="modal-section__text">
                        <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.full_desc_two)}</p>
                    </div>
                    <div class="modal-section__image">
                        <img src="${placeholder}" alt="" data-metro-id="${metroId}" data-attachment="desc_two" class="metro-attachment">
                    </div>
                </div>
            </div>
        `;
    }

    if (data.scheme_desc) {
        html += `
            <div class="modal-section modal-section--white">
                <div class="modal-section__container">
                    <div class="modal-section__image">
                        <img src="${placeholder}" alt="" data-metro-id="${metroId}" data-attachment="scheme" class="metro-attachment">
                        <p class="modal-section__caption">Схема линий</p>
                    </div>
                    <div class="modal-section__text">
                        <h2 class="modal-section__title">СХЕМА ЛИНИЙ</h2>
                        <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.scheme_desc)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    if (data.modern_desc) {
        html += `
            <div class="modal-section modal-section--blue">
                <div class="modal-section__container">
                    <div class="modal-section__text">
                        <h2 class="modal-section__title">МОДЕРНИЗАЦИЯ</h2>
                        <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.modern_desc)}</p>
                    </div>
                    <div class="modal-section__image">
                        <img src="${placeholder}" alt="" data-metro-id="${metroId}" data-attachment="modern" class="metro-attachment">
                    </div>
                </div>
            </div>
        `;
    }

    if (data.struct_desc) {
        html += `
            <div class="modal-section modal-section--white">
                <div class="modal-section__container">
                    <div class="modal-section__image">
                        <img src="${placeholder}" alt="" data-metro-id="${metroId}" data-attachment="struct" class="metro-attachment">
                    </div>
                    <div class="modal-section__text">
                        <h2 class="modal-section__title">ИНФРАСТРУКТУРА</h2>
                        <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.struct_desc)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    if (data.partnership_desc) {
        html += `
            <div class="modal-section modal-section--blue">
                <div class="modal-section__container">
                    <div class="modal-section__text">
                        <h2 class="modal-section__title">РАЗВИТИЕ И ПАРТНЁРСТВО</h2>
                        <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.partnership_desc)}</p>
                    </div>
                    <div class="modal-section__image">
                        <img src="${placeholder}" alt="" data-metro-id="${metroId}" data-attachment="partnership" class="metro-attachment">
                    </div>
                </div>
            </div>
        `;
    }

    if (data.safety_desc || data.acessable_desc) {
        html += `
            <div class="modal-section modal-section--white modal-section--double-text">
                <div class="modal-section__container">
                    ${data.safety_desc ? `
                        <div class="modal-section__text-block">
                            <h2 class="modal-section__title">БЕЗОПАСНОСТЬ</h2>
                            <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.safety_desc)}</p>
                        </div>
                    ` : ''}
                    ${data.acessable_desc ? `
                        <div class="modal-section__text-block">
                            <h2 class="modal-section__title">ДОСТУПНОСТЬ</h2>
                            <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.acessable_desc)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    if (!document.querySelector('.modal-close')) {
        html += `<button class="modal-close" onclick="document.getElementById('${MODAL_ID}').classList.remove('active'); document.body.style.overflow = '';">×</button>`;
    }

    return html;
}

function generatePredpriyatiyaContent(data, companyId) {
    const placeholder = 'data:image/svg+xml,Загрузка...';
    
    let html = `
        <div class="modal-hero">
            <div class="modal-hero__container">
                <div class="modal-hero__content">
                    <h1 class="modal-hero__title">${data.name || 'ПРЕДПРИЯТИЕ'}</h1>
                    <p class="modal-hero__subtitle">${formatTextWithLineBreaks(data.short_desc)}</p>
                </div>
                <div class="modal-hero__logo">
                    <img src="${placeholder}" alt="Логотип" data-metro-id="${companyId}" data-attachment="logo" class="metro-attachment">
                </div>
            </div>
        </div>
    `;

    if (data.full_desc_one) {
        html += `
            <div class="modal-section modal-section--white">
                <div class="modal-section__container">
                    <div class="modal-section__image">
                        <img src="${placeholder}" alt="" data-metro-id="${companyId}" data-attachment="desc_one" class="metro-attachment">
                        <p class="modal-section__caption">Производство</p>
                    </div>
                    <div class="modal-section__text">
                        <h2 class="modal-section__title">О ПРЕДПРИЯТИИ</h2>
                        <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.full_desc_one)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    if (data.full_desc_two) {
        html += `
            <div class="modal-section modal-section--blue">
                <div class="modal-section__container">
                    <div class="modal-section__text">
                        <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.full_desc_two)}</p>
                    </div>
                    <div class="modal-section__image">
                        <img src="${placeholder}" alt="" data-metro-id="${companyId}" data-attachment="desc_two" class="metro-attachment">
                    </div>
                </div>
            </div>
        `;
    }

    if (data.spec_desc) {
        html += `
            <div class="modal-section modal-section--white">
                <div class="modal-section__container">
                    <div class="modal-section__image">
                        <img src="${placeholder}" alt="" data-metro-id="${companyId}" data-attachment="spec" class="metro-attachment">
                        <p class="modal-section__caption">Специализация</p>
                    </div>
                    <div class="modal-section__text">
                        <h2 class="modal-section__title">СПЕЦИАЛИЗАЦИЯ</h2>
                        <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.spec_desc)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    if (data.quality || data.contact) {
        html += `
            <div class="modal-section modal-section--blue modal-section--double-text">
                <div class="modal-section__container">
                    ${data.quality ? `
                        <div class="modal-section__text-block">
                            <h2 class="modal-section__title">КАЧЕСТВО</h2>
                            <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.quality)}</p>
                        </div>
                    ` : ''}
                    ${data.contact ? `
                        <div class="modal-section__text-block">
                            <h2 class="modal-section__title">КОНТАКТЫ</h2>
                            <p class="modal-section__paragraph">${formatTextWithLineBreaks(data.contact)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    if (!document.querySelector('.modal-close')) {
        html += `<button class="modal-close" onclick="document.getElementById('${MODAL_ID}').classList.remove('active'); document.body.style.overflow = '';">×</button>`;
    }

    return html;
}

function loadModalAttachments(metroId) {
    const images = document.querySelectorAll(`.metro-attachment[data-metro-id="${metroId}"]`);
    images.forEach(img => {
        if (img.dataset.loaded) return;
        const attachment = img.dataset.attachment;
        fetch(`${API_BASE_URL}/api/v1/content/метро/attachment?name=${encodeURIComponent(metroId)}&attachment=${encodeURIComponent(attachment)}`)
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.blob();
            })
            .then(blob => {
                const src = URL.createObjectURL(blob);
                img.src = src;
                img.dataset.loaded = 'true';
                img.onload = () => URL.revokeObjectURL(src);
            })
            .catch(() => {
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect fill="%23f0f0f0" width="600" height="400"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="24">Нет фото</text></svg>';
                img.dataset.loaded = 'true';
            });
    });
}

function loadPredpriyatiyaModalAttachments(companyId) {
    const images = document.querySelectorAll(`.metro-attachment[data-metro-id="${companyId}"]`);
    images.forEach(img => {
        if (img.dataset.loaded) return;
        const attachment = img.dataset.attachment;
        fetch(`${API_BASE_URL}/api/v1/content/предприятия/attachment?name=${encodeURIComponent(companyId)}&attachment=${encodeURIComponent(attachment)}`)
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.blob();
            })
            .then(blob => {
                const src = URL.createObjectURL(blob);
                img.src = src;
                img.dataset.loaded = 'true';
                img.onload = () => URL.revokeObjectURL(src);
            })
            .catch(() => {
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect fill="%23f0f0f0" width="600" height="400"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="24">Нет фото</text></svg>';
                img.dataset.loaded = 'true';
            });
    });
}

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
    } catch (e) {}
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
    } catch (e) {}
}

async function loadMetro() {
    const grid = document.getElementById('metro-grid');
    if (!grid) return;
    try {
        const listResp = await fetch(`${API_BASE_URL}/api/v1/content/метро/list`);
        if (!listResp.ok) throw new Error(`HTTP ${listResp.status}`);
        const listData = await listResp.json();
        const ids = Array.isArray(listData) ? listData : [];
        if (ids.length === 0) {
            grid.innerHTML = '<p class="no-data">Нет данных о метрополитенах</p>';
            return;
        }
        grid.innerHTML = '';
        for (const id of ids) {
            try {
                const contentResp = await fetch(
                    `${API_BASE_URL}/api/v1/content/метро/content?name=${encodeURIComponent(id)}`
                );
                if (!contentResp.ok) continue;
                const contentData = await contentResp.json();
                if (contentData.status === 'content aint exists') {
                    const fallbackData = { ...FALLBACK_METRO_DATA['123'], name: id };
                    const card = createMetroCard(id, fallbackData, id);
                    grid.appendChild(card);
                } else {
                    const name = contentData.name || id;
                    const card = createMetroCard(name, contentData, id);
                    grid.appendChild(card);
                }
                const img = grid.lastChild.querySelector('.metro-item__image img');
                if (img) {
                    loadMetroLogo(id, img);
                }
            } catch (e) {}
        }
    } catch (error) {
        grid.innerHTML = '<p class="error">Ошибка загрузки данных</p>';
    }
}

function loadMetroLogo(id, imgElement) {
    if (!imgElement || imgElement.dataset.loaded) return;
    fetch(`${API_BASE_URL}/api/v1/content/метро/attachment?name=${encodeURIComponent(id)}&attachment=logo`)
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.blob();
        })
        .then(blob => {
            const src = URL.createObjectURL(blob);
            imgElement.src = src;
            imgElement.dataset.loaded = 'true';
            imgElement.onload = () => URL.revokeObjectURL(src);
        })
        .catch(() => {
            imgElement.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect fill="%23e0e0e0" width="120" height="120"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">Нет лого</text></svg>';
            imgElement.dataset.loaded = 'true';
        });
}

function createMetroCard(name, data, id) {
    const card = document.createElement('div');
    card.className = 'metro-item';
    card.setAttribute('data-metro-id', id);
    card.style.cursor = 'pointer';
    card.innerHTML = `
        <div class="metro-item__image">
            <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect fill='%23e0e0e0' width='120' height='120'/></svg>" alt="${name}" loading="lazy">
        </div>
        <p class="metro-item__name">${name}</p>
    `;
    if (data.short_desc) card.title = data.short_desc;
    card.metroData = data;
    card.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        openMetroModal(id, this.metroData);
        return false;
    };
    return card;
}

async function loadPredpriyatiya() {
    const grid = document.getElementById('predpriyatiya-grid');
    if (!grid) return;
    try {
        const listResp = await fetch(`${API_BASE_URL}/api/v1/content/предприятия/list`);
        if (!listResp.ok) throw new Error(`HTTP ${listResp.status}`);
        const listData = await listResp.json();
        const ids = Array.isArray(listData) ? listData : [];
        if (ids.length === 0) {
            grid.innerHTML = '<p class="no-data">Нет данных о предприятиях</p>';
            return;
        }
        grid.innerHTML = '';
        for (const id of ids) {
            let contentData = {};
            let name = id;
            try {
                const contentResp = await fetch(
                    `${API_BASE_URL}/api/v1/content/предприятия/content?name=${encodeURIComponent(id)}`
                );
                if (contentResp.ok) {
                    contentData = await contentResp.json();
                    if (contentData.name) name = contentData.name;
                }
            } catch (e) {}
            const card = createPredpriyatiyaCard(name, contentData, id);
            grid.appendChild(card);
            const img = card.querySelector('.predpriyatiya-item__image img');
            if (img) {
                loadPredpriyatiyaLogo(id, img);
            }
        }
    } catch (error) {
        grid.innerHTML = '<p class="error">Ошибка загрузки данных</p>';
    }
}

function loadPredpriyatiyaLogo(id, imgElement) {
    if (!imgElement || imgElement.dataset.loaded) return;
    fetch(`${API_BASE_URL}/api/v1/content/предприятия/attachment?name=${encodeURIComponent(id)}&attachment=logo`)
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.blob();
        })
        .then(blob => {
            const src = URL.createObjectURL(blob);
            imgElement.src = src;
            imgElement.dataset.loaded = 'true';
            imgElement.onload = () => URL.revokeObjectURL(src);
        })
        .catch(() => {
            imgElement.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect fill="%23e0e0e0" width="120" height="120"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">Нет лого</text></svg>';
            imgElement.dataset.loaded = 'true';
        });
}

function createPredpriyatiyaCard(name, data, id) {
    const card = document.createElement('div');
    card.className = 'predpriyatiya-item';
    card.setAttribute('data-predpriyatiya-id', id);
    card.style.cursor = 'pointer';
    card.innerHTML = `
        <div class="predpriyatiya-item__image">
            <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect fill='%23e0e0e0' width='120' height='120'/></svg>" alt="${name}" loading="lazy">
        </div>
        <p class="predpriyatiya-item__name">${name}</p>
    `;
    if (data.short_desc) card.title = data.short_desc;
    card.predpriyatiyaData = data;
    card.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        openPredpriyatiyaModal(id, this.predpriyatiyaData);
        return false;
    };
    return card;
}