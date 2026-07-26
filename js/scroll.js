export function initScrollExperience() {
    const sections = [...document.querySelectorAll('[data-reveal-section]')];
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!motionQuery.matches && 'IntersectionObserver' in window) {
        const hashTarget = window.location.hash
            ? document.getElementById(window.location.hash.slice(1))
            : null;

        sections.slice(1).forEach((section) => {
            if (section === hashTarget) section.classList.add('is-visible');
            else section.classList.add('reveal-pending');
        });

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -10%', threshold: 0.08 });

        sections.slice(1).forEach((section) => revealObserver.observe(section));
    }

    const navLinks = [...document.querySelectorAll('[data-nav-link]')];
    if (!('IntersectionObserver' in window)) return;

    const activeObserver = new IntersectionObserver((entries) => {
        const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry?.target.id) return;
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${visibleEntry.target.id}`;
            link.classList.toggle('is-active', isActive);
            if (isActive) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }, { rootMargin: '-35% 0px -55%', threshold: [0, 0.1, 0.5] });

    sections.forEach((section) => activeObserver.observe(section));
}
