export function initNavigation() {
    const controller = new AbortController();
    const header = document.getElementById('site-header');
    const toggleButton = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let closeTimer = 0;
    let previousY = window.scrollY;
    let scrollFrame = 0;

    if (!(toggleButton instanceof HTMLButtonElement) || !mobileMenu || !header) return () => {};

    /** @param {boolean} isOpen @param {boolean} immediate */
    const setMenuState = (isOpen, immediate = false) => {
        window.clearTimeout(closeTimer);
        const isArabic = document.documentElement.lang === 'ar';
        toggleButton.setAttribute('aria-expanded', String(isOpen));
        toggleButton.setAttribute('aria-label', isOpen
            ? (isArabic ? 'إغلاق قائمة التنقل' : 'Close navigation')
            : (isArabic ? 'فتح قائمة التنقل' : 'Open navigation'));
        header.classList.toggle('menu-open', isOpen);

        if (isOpen) {
            header.classList.remove('is-hidden');
            mobileMenu.hidden = false;
            requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
            return;
        }

        mobileMenu.classList.remove('is-open');
        if (immediate || reducedMotion.matches) mobileMenu.hidden = true;
        else closeTimer = window.setTimeout(() => { mobileMenu.hidden = true; }, 260);
    };

    const closeMenu = () => setMenuState(false);
    toggleButton.addEventListener('click', () => {
        setMenuState(toggleButton.getAttribute('aria-expanded') !== 'true');
    }, { signal: controller.signal });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu, { signal: controller.signal });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || toggleButton.getAttribute('aria-expanded') !== 'true') return;
        closeMenu();
        toggleButton.focus();
    }, { signal: controller.signal });

    document.addEventListener('click', (event) => {
        if (!(event.target instanceof Node) || toggleButton.getAttribute('aria-expanded') !== 'true') return;
        if (!mobileMenu.contains(event.target) && !toggleButton.contains(event.target)) closeMenu();
    }, { signal: controller.signal });

    header.addEventListener('focusin', () => header.classList.remove('is-hidden'), { signal: controller.signal });

    window.matchMedia('(min-width: 1024px)').addEventListener('change', ({ matches }) => {
        if (matches) setMenuState(false, true);
    }, { signal: controller.signal });

    window.addEventListener('portfolio:language-change', () => {
        setMenuState(toggleButton.getAttribute('aria-expanded') === 'true', true);
    }, { signal: controller.signal });

    const updateHeader = () => {
        const currentY = window.scrollY;
        const hasHeaderFocus = header.contains(document.activeElement);
        header.classList.toggle('is-scrolled', currentY > 20);
        if (toggleButton.getAttribute('aria-expanded') !== 'true') {
            header.classList.toggle('is-hidden', !hasHeaderFocus && currentY > 320 && currentY > previousY + 7);
            if (hasHeaderFocus || currentY < previousY) header.classList.remove('is-hidden');
        }
        previousY = currentY;
        scrollFrame = 0;
    };

    window.addEventListener('scroll', () => {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(updateHeader);
    }, { passive: true, signal: controller.signal });

    const sections = [...document.querySelectorAll('[data-nav-section]')];
    const links = [...document.querySelectorAll('[data-nav-link]')];
    let activeSection = '';
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (!visible?.target.id || visible.target.id === activeSection) return;
        activeSection = visible.target.id;
        document.documentElement.dataset.activeSection = activeSection;
        window.dispatchEvent(new CustomEvent('portfolio:section-change', { detail: { id: activeSection } }));

        links.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${activeSection}`;
            link.classList.toggle('is-active', isCurrent);
            if (isCurrent) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }, {
        rootMargin: '-28% 0px -58%',
        threshold: [0, 0.2, 0.5],
    }) : null;

    sections.forEach((section) => observer?.observe(section));
    setMenuState(false, true);
    updateHeader();

    return () => {
        window.clearTimeout(closeTimer);
        window.cancelAnimationFrame(scrollFrame);
        observer?.disconnect();
        controller.abort();
    };
}
