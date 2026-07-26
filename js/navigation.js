export function initNavigation() {
    const controller = new AbortController();
    const toggleButton = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!(toggleButton instanceof HTMLButtonElement) || !mobileMenu) return () => {};

    const closeMenu = () => setMenuState(toggleButton, mobileMenu, false);

    toggleButton.addEventListener('click', () => {
        setMenuState(toggleButton, mobileMenu, mobileMenu.hasAttribute('hidden'));
    }, { signal: controller.signal });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu, { signal: controller.signal });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || mobileMenu.hasAttribute('hidden')) return;
        closeMenu();
        toggleButton.focus();
    }, { signal: controller.signal });

    document.addEventListener('click', (event) => {
        if (!(event.target instanceof Node)) return;
        if (!mobileMenu.contains(event.target) && !toggleButton.contains(event.target)) closeMenu();
    }, { signal: controller.signal });

    window.matchMedia('(min-width: 1024px)').addEventListener('change', ({ matches }) => {
        if (matches) closeMenu();
    }, { signal: controller.signal });

    window.addEventListener('portfolio:language-change', () => {
        setMenuState(toggleButton, mobileMenu, !mobileMenu.hasAttribute('hidden'));
    }, { signal: controller.signal });

    closeMenu();
    return () => controller.abort();
}

/**
 * @param {HTMLButtonElement} toggleButton
 * @param {HTMLElement} mobileMenu
 * @param {boolean} isOpen
 */
function setMenuState(toggleButton, mobileMenu, isOpen) {
    const isArabic = document.documentElement.lang === 'ar';
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    toggleButton.setAttribute('aria-label', isOpen
        ? (isArabic ? 'إغلاق قائمة التنقل' : 'Close navigation')
        : (isArabic ? 'فتح قائمة التنقل' : 'Open navigation'));
    mobileMenu.toggleAttribute('hidden', !isOpen);
}
