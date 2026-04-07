function initHeaderDropdown() {
    const mainHeader = document.querySelector('.main-header');
    const dropdowns = document.querySelectorAll('.nav__dropdown');
    const navItems = document.querySelectorAll('.nav__item');

    if (!mainHeader) return;

    function showDropdown(dropdownId) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });

        if (dropdownId) {
            const targetDropdown = document.getElementById('dropdown-' + dropdownId);
            if (targetDropdown) {
                targetDropdown.classList.add('active');
            }
        }
    }

    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const dropdownId = this.getAttribute('data-dropdown');
            showDropdown(dropdownId);
        });
    });

    mainHeader.addEventListener('mouseenter', function() {
        const firstDropdown = dropdowns[0];
        if (firstDropdown) {
            dropdowns.forEach(d => d.classList.remove('active'));
            firstDropdown.classList.add('active');
        }
    });

    mainHeader.addEventListener('mouseleave', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

function initHeaderSearch() {
    const searchBtn = document.querySelector('.header__search-btn');
    const search = document.getElementById('mobile-search');
    const overlay = search ? search.querySelector('.mobile-search__overlay') : null;
    const closeBtn = search ? search.querySelector('.mobile-search__close') : null;
    const input = search ? search.querySelector('.mobile-search__input') : null;
    const results = search ? search.querySelector('.mobile-search__results') : null;
    const hint = search ? search.querySelector('.mobile-search__hint') : null;

    if (!searchBtn || !search || !input || !results) return;
    if (searchBtn.dataset.headerSearchInitialized === 'true') return;
    searchBtn.dataset.headerSearchInitialized = 'true';

    searchBtn.setAttribute('aria-expanded', 'false');

    function getSearchIndex() {
        const links = Array.from(document.querySelectorAll(
            '.nav__link, .nav__dropdown-link, .mobile-nav__link'
        ));

        const seen = new Set();
        const items = [];

        links.forEach((a) => {
            const href = a.getAttribute('href') || '';
            const text = (a.textContent || '').trim();
            if (!href || !text) return;
            if (!/\.html(\b|#|\?)/i.test(href)) return;

            const key = `${href}||${text}`;
            if (seen.has(key)) return;
            seen.add(key);

            items.push({ href, text });
        });

        return items;
    }

    function openSearch() {
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
            mobileNav.classList.remove('mobile-nav--open');
        }

        search.classList.add('mobile-search--open');
        search.setAttribute('aria-hidden', 'false');
        searchBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        input.value = '';
        renderResults('');

        window.setTimeout(() => {
            input.focus();
        }, 0);
    }

    function closeSearch() {
        search.classList.remove('mobile-search--open');
        search.setAttribute('aria-hidden', 'true');
        searchBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function renderResults(query) {
        const q = (query || '').trim().toLowerCase();
        const index = getSearchIndex();

        results.innerHTML = '';

        if (hint) {
            hint.style.display = q ? 'none' : '';
        }

        if (!q) return;

        const matches = index
            .filter(item => item.text.toLowerCase().includes(q))
            .slice(0, 10);

        if (!matches.length) {
            const empty = document.createElement('div');
            empty.className = 'mobile-search__empty';
            empty.textContent = 'Ничего не найдено';
            results.appendChild(empty);
            return;
        }

        matches.forEach(item => {
            const a = document.createElement('a');
            a.className = 'mobile-search__result';
            a.href = item.href;
            a.textContent = item.text;
            a.addEventListener('click', () => {
                closeSearch();
            });
            results.appendChild(a);
        });
    }

    let inputTimer = null;

    searchBtn.addEventListener('click', () => {
        if (search.classList.contains('mobile-search--open')) {
            closeSearch();
        } else {
            openSearch();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', closeSearch);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSearch);
    }

    input.addEventListener('input', () => {
        if (inputTimer) window.clearTimeout(inputTimer);
        inputTimer = window.setTimeout(() => {
            renderResults(input.value);
        }, 120);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && search.classList.contains('mobile-search--open')) {
            closeSearch();
        }
    });
}

function initMobileHeader() {
    const burgerBtn = document.querySelector('.header__burger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = mobileNav ? mobileNav.querySelector('.mobile-nav__overlay') : null;
    const closeBtn = mobileNav ? mobileNav.querySelector('.mobile-nav__close') : null;
    const mobileLinks = mobileNav ? mobileNav.querySelectorAll('.mobile-nav__link') : [];

    if (!burgerBtn || !mobileNav) return;
    if (burgerBtn.dataset.mobileHeaderInitialized === 'true') return;
    burgerBtn.dataset.mobileHeaderInitialized = 'true';

    burgerBtn.setAttribute('aria-expanded', 'false');

    function openMenu() {
        mobileNav.classList.add('mobile-nav--open');
        document.body.style.overflow = 'hidden';
        burgerBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        mobileNav.classList.remove('mobile-nav--open');
        document.body.style.overflow = '';
        burgerBtn.setAttribute('aria-expanded', 'false');
    }

    burgerBtn.addEventListener('click', function() {
        if (mobileNav.classList.contains('mobile-nav--open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', function() {
            closeMenu();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeMenu();
        });
    }

    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
            closeMenu();
        }
    });
}

