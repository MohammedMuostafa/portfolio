export function initNavigation() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!(toggleBtn instanceof HTMLButtonElement) || !mobileMenu) return;

    toggleBtn.addEventListener('click', () => {
        const isOpening = mobileMenu.hasAttribute('hidden');
        setMenuState(toggleBtn, mobileMenu, isOpening);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) {
            closeMobileMenu();
            toggleBtn.focus();
        }
    });

    document.addEventListener('click', (event) => {
        if (!(event.target instanceof Node)) return;
        if (!mobileMenu.contains(event.target) && !toggleBtn.contains(event.target)) {
            closeMobileMenu();
        }
    });

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    desktopQuery.addEventListener('change', ({ matches }) => {
        if (matches) closeMobileMenu();
    });
}

export function closeMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!(toggleBtn instanceof HTMLButtonElement) || !mobileMenu) return;
    setMenuState(toggleBtn, mobileMenu, false);
}

/**
 * @param {HTMLButtonElement} toggleBtn
 * @param {HTMLElement} mobileMenu
 * @param {boolean} isOpen
 */
function setMenuState(toggleBtn, mobileMenu, isOpen) {
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    mobileMenu.toggleAttribute('hidden', !isOpen);
}
