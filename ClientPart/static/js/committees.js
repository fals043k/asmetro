import * as AdminAPI from '/js/admin-integration.js'


async function addCommittees() {
    const grid = document.getElementById('comitet-grid');
    if (!grid) {
        return;
    } 

    const dataOrder = await AdminAPI.getBlockList("комитеты");
    if (!dataOrder || !Array.isArray(dataOrder)) {
        grid.innerHTML = `<p class="no-data">Не удалось получить данные о комитетах</p>`;
        return;
    }
    
    for (const id of dataOrder) {
        const content = await AdminAPI.getBlockContent("комитеты", id);
        let name = "Ненезванный комитет";        
        if (content.name) name = content.name;

                grid.insertAdjacentHTML('beforeend',
        `
        <div class="comitet-item__image">
            <img src="blob:https://asmetro.ru/af712f17-1db6-4563-bc48-dba7ab199133" alt="${name}">
        </div>
        `
        );
    }
}

async function addMagazines() {
    const grid = document.getElementById('magazine-grid');
    if (!grid) {
        return;
    }

    const dataOrder = await AdminAPI.getFolderList("журналы");
    if (!dataOrder || !Array.isArray(dataOrder)) {
        grid.innerHTML = `<p class="no-data">Не удалось получить данные о журналах</p>`;
        return;
    }

    for (const id of dataOrder) {
        grid.insertAdjacentHTML('beforeend', `<a class="magazine__name" href="${await AdminAPI.getFolderFileLink("журналы", id)}">${id}</a>`);
    }
}

async function init() {
    await addCommittees();
    await addMagazines();
}



if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}