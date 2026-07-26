export function initScrollExperience() {
    const controller = new AbortController();
    const navigationCleanup = initNavigationSpy();
    const headerCleanup = initHeaderBehavior();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationCleanup = () => {};

    const rebuild = () => {
        animationCleanup();
        animationCleanup = () => {};

        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        if (motionQuery.matches || !gsap || !ScrollTrigger) {
            document.documentElement.classList.remove('motion-pending', 'motion-ready');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        animationCleanup = buildAnimations(gsap, ScrollTrigger);
    };

    const handleBeforeLanguageChange = () => {
        animationCleanup();
        animationCleanup = () => {};
    };
    const handleLanguageChange = () => requestAnimationFrame(rebuild);

    motionQuery.addEventListener('change', rebuild, { signal: controller.signal });
    window.addEventListener('portfolio:before-language-change', handleBeforeLanguageChange, { signal: controller.signal });
    window.addEventListener('portfolio:language-change', handleLanguageChange, { signal: controller.signal });
    rebuild();

    return () => {
        animationCleanup();
        navigationCleanup();
        headerCleanup();
        controller.abort();
        document.documentElement.classList.remove('motion-pending', 'motion-ready');
    };
}

/**
 * @param {NonNullable<Window['gsap']>} gsap
 * @param {NonNullable<Window['ScrollTrigger']>} ScrollTrigger
 */
function buildAnimations(gsap, ScrollTrigger) {
    document.documentElement.classList.add('motion-ready');
    const context = gsap.context(() => {
        const heroItems = [...document.querySelectorAll('#home [data-reveal]')];
        gsap.fromTo(heroItems, {
            y: 28,
            autoAlpha: 0,
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.09,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
        });

        document.querySelectorAll('.content-section').forEach((section) => {
            const revealItems = [...section.querySelectorAll(':scope [data-reveal]')];
            if (revealItems.length === 0) return;

            gsap.fromTo(revealItems, {
                y: 34,
                autoAlpha: 0,
            }, {
                y: 0,
                autoAlpha: 1,
                duration: 0.75,
                stagger: 0.08,
                ease: 'power3.out',
                clearProps: 'transform,opacity,visibility',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            });
        });

        const projectLogo = document.querySelector('.project-logo');
        const projectSection = document.getElementById('current-project');
        if (projectLogo && projectSection) {
            gsap.fromTo(projectLogo, { y: -10 }, {
                y: 10,
                ease: 'none',
                scrollTrigger: {
                    trigger: projectSection,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.6,
                },
            });
        }
    }, document.body);

    requestAnimationFrame(() => {
        document.documentElement.classList.remove('motion-pending');
        ScrollTrigger.refresh();
    });

    return () => context.revert();
}

function initHeaderBehavior() {
    const header = document.getElementById('site-header');
    if (!header) return () => {};

    let previousY = window.scrollY;
    let ticking = false;

    const update = () => {
        const currentY = window.scrollY;
        header.classList.toggle('is-scrolled', currentY > 20);
        header.classList.toggle('is-hidden', currentY > 320 && currentY > previousY + 6);
        if (currentY < previousY) header.classList.remove('is-hidden');
        previousY = currentY;
        ticking = false;
    };

    const handleScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', handleScroll);
}

function initNavigationSpy() {
    const sections = [...document.querySelectorAll('[data-nav-section]')];
    const links = [...document.querySelectorAll('[data-nav-link]')];
    if (!('IntersectionObserver' in window) || sections.length === 0) return () => {};

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (!visible?.target.id) return;

        links.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${visible.target.id}`;
            link.classList.toggle('is-active', isCurrent);
            if (isCurrent) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }, {
        rootMargin: '-28% 0px -58%',
        threshold: [0, 0.2, 0.5],
    });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
}
