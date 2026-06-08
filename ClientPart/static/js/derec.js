import * as AdminAPI from '/js/admin-integration.js'


async function applyIdText(id, text, bool) {
    if (text) {
        let object = document.getElementById(id);
        object.innerHTML = (bool) ? text.replaceAll('\n', '<br>') : text;
    }
}

async function useLocale() {
    const locale = await AdminAPI.getLocale('дирекция');

    await applyIdText('title', locale.название, false);
    await applyIdText('description', locale.описание, false);
    await applyIdText('name', locale.фио, false);
    await applyIdText('advantages', locale.заслуги, false);
    await applyIdText('education', locale.образование, false);
    await applyIdText('experience', locale.опыт, true);
    await applyIdText('facts', locale.факты, false);
    
    await applyIdText('members', locale.коллектив, true);
    await applyIdText('purposes', locale.цели, true);
    await applyIdText('tasks', locale.задачи, false);
}

async function addTeam() {
    const slider = document.querySelector(".slider");

    const teamOrder = await AdminAPI.getBlockList("команда");

    for (const id of teamOrder) {
        const cardBack = document.createElement('a');
        cardBack.href = '#';
        cardBack.className = 'slider__link'


        const card = document.createElement('div');
        card.classList = 'slider__item';

        const content = await AdminAPI.getBlockContent("команда", id);

        card.innerHTML = `
            <div class="slider__photo">
                <img src="${await AdminAPI.getBlockFileLink("команда", id, "photo")}" alt="Фото" class="slider__photo-img">
            </div>
            <h3 class="slider__name">${content.fullname}</h3>
            <p class="slider__position">${content.post}</p>
            <ul class="slider__contact">
                <li>${content.number}</li>
                <li>${content.email}</li>
            </ul>`

        cardBack.appendChild(card);
        slider.appendChild(cardBack);
    }
}

async function init() {
    useLocale();
    addTeam();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}