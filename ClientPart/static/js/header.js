function initHeaderDropdown() {
    const mainHeader = document.querySelector('.main-header');
    const dropdowns = document.querySelectorAll('.nav__dropdown');
    const navItems = document.querySelectorAll('.nav__item');
    if (!mainHeader || mainHeader.dataset.dropdownBound === 'true') return false;
    mainHeader.dataset.dropdownBound = 'true';

    function showDropdown(id) {
        dropdowns.forEach(d => d.classList.remove('active'));
        if (id) {
            const target = document.getElementById('dropdown-' + id);
            if (target) target.classList.add('active');
        }
    }
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => showDropdown(item.dataset.dropdown));
    });
    mainHeader.addEventListener('mouseenter', () => {
        dropdowns.forEach(d => d.classList.remove('active'));
        if (dropdowns[0]) dropdowns[0].classList.add('active');
    });
    mainHeader.addEventListener('mouseleave', () => {
        dropdowns.forEach(d => d.classList.remove('active'));
    });

    return true;
}

function initMobileHeader() {
    const burgerBtn = document.querySelector('.header__burger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (!burgerBtn || !mobileNav) return false;
    if (mobileNav.dataset.mobileMenuBound === 'true') return true;

    mobileNav.dataset.mobileMenuBound = 'true';

    const overlay = mobileNav.querySelector('.mobile-nav__overlay');
    const closeBtn = mobileNav.querySelector('.mobile-nav__close');
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');

    function openMenu() {
        mobileNav.classList.add('mobile-nav--open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileNav.classList.remove('mobile-nav--open');
        document.body.style.overflow = '';
    }

    burgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openMenu();
    });
    if (overlay) overlay.addEventListener('click', closeMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => setTimeout(closeMenu, 150));
    });

    return true;
}

function initHeaderFeatures() {
    const dropdownReady = initHeaderDropdown();
    const mobileReady = initMobileHeader();
    return dropdownReady || mobileReady;
}

function startHeaderAutoInit() {
    if (initHeaderFeatures()) return;

    const observer = new MutationObserver(() => {
        if (initHeaderFeatures()) {
            observer.disconnect();
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startHeaderAutoInit);
} else {
    startHeaderAutoInit();
}
