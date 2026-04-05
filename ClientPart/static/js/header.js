// Функция для десктопного выпадающего меню (показ групп по наведению)
window.initHeaderDropdown = function() {
    const mainHeader = document.getElementById('main-header');
    const dropdown = document.getElementById('nav-dropdown');
    const navItemsWithDropdown = document.querySelectorAll('.nav__item[data-dropdown]');
    const groups = document.querySelectorAll('.nav__group');

    if (!mainHeader || !dropdown) return;

    function showGroup(groupName) {
        groups.forEach(group => {
            if (group.dataset.group === groupName) {
                group.classList.add('active-group');
            } else {
                group.classList.remove('active-group');
            }
        });
    }

    function hideAllGroups() {
        groups.forEach(group => group.classList.remove('active-group'));
    }

    // Наведение на пункты с data-dropdown
    navItemsWithDropdown.forEach(item => {
        const dropdownName = item.getAttribute('data-dropdown');
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) {
                showGroup(dropdownName);
            }
        });
    });

    // При наведении на хедер – показываем группу "about" по умолчанию
    mainHeader.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1024) {
            const anyActive = Array.from(groups).some(g => g.classList.contains('active-group'));
            if (!anyActive) {
                showGroup('about');
            }
        }
    });

    mainHeader.addEventListener('mouseleave', () => {
        if (window.innerWidth > 1024) {
            hideAllGroups();
        }
    });

    if (dropdown) {
        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 1024) {
                hideAllGroups();
            }
        });
    }
};

// Функция для мобильного меню (бургер и подменю)
window.initMobileHeader = function() {
    const burgerBtn = document.querySelector('.header__burger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = mobileNav ? mobileNav.querySelector('.mobile-nav__overlay') : null;
    const closeBtn = mobileNav ? mobileNav.querySelector('.mobile-nav__close') : null;
    const mobileLinks = mobileNav ? mobileNav.querySelectorAll('.mobile-nav__link') : [];

    if (!burgerBtn || !mobileNav) return;

    function openMenu() {
        mobileNav.classList.add('mobile-nav--open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileNav.classList.remove('mobile-nav--open');
        document.body.style.overflow = '';
        // Закрываем все открытые подменю
        document.querySelectorAll('.mobile-nav__submenu').forEach(sub => {
            sub.classList.remove('mobile-nav__submenu--open');
        });
        document.querySelectorAll('.mobile-nav__link--parent').forEach(link => {
            link.setAttribute('aria-expanded', 'false');
        });
    }

    burgerBtn.addEventListener('click', openMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Обычные ссылки закрывают меню при клике
    mobileLinks.forEach(link => {
        if (!link.classList.contains('mobile-nav__link--parent')) {
            link.addEventListener('click', closeMenu);
        }
    });

    // Раскрытие подменю в мобильном меню
    const parentLinks = document.querySelectorAll('.mobile-nav__link--parent');
    parentLinks.forEach(parent => {
        parent.addEventListener('click', function(e) {
            e.preventDefault();
            const submenuId = this.getAttribute('data-submenu');
            const submenu = document.getElementById(submenuId);
            if (submenu) {
                const isOpen = submenu.classList.contains('mobile-nav__submenu--open');
                // Закрыть все остальные подменю (опционально)
                document.querySelectorAll('.mobile-nav__submenu').forEach(sub => {
                    if (sub !== submenu) sub.classList.remove('mobile-nav__submenu--open');
                });
                document.querySelectorAll('.mobile-nav__link--parent').forEach(link => {
                    if (link !== this) link.setAttribute('aria-expanded', 'false');
                });
                if (isOpen) {
                    submenu.classList.remove('mobile-nav__submenu--open');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    submenu.classList.add('mobile-nav__submenu--open');
                    this.setAttribute('aria-expanded', 'true');
                }
            }
        });
    });

    // Ссылки внутри подменю закрывают всё меню
    const submenuLinks = document.querySelectorAll('.mobile-nav__sublink');
    submenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // При ресайзе окна, если ширина больше 1024px – закрываем мобильное меню
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && mobileNav.classList.contains('mobile-nav--open')) {
            closeMenu();
        }
    });
};