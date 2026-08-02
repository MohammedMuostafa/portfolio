import { getMotionLibraries, splitTextForReveal } from './motion.js';

export function initScrollExperience() {
    const controller = new AbortController();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationCleanup = () => {};

    const rebuild = () => {
        animationCleanup();
        animationCleanup = () => {};
        const libraries = getMotionLibraries();
        if (motionQuery.matches || !libraries) {
            document.documentElement.classList.remove('motion-pending', 'motion-ready');
            return;
        }
        animationCleanup = buildAnimations(libraries.gsap, libraries.ScrollTrigger);
    };

    const beforeLanguageChange = () => {
        animationCleanup();
        animationCleanup = () => {};
    };
    const afterLanguageChange = () => requestAnimationFrame(rebuild);

    motionQuery.addEventListener('change', rebuild, { signal: controller.signal });
    window.addEventListener('portfolio:before-language-change', beforeLanguageChange, { signal: controller.signal });
    window.addEventListener('portfolio:language-change', afterLanguageChange, { signal: controller.signal });
    rebuild();

    return () => {
        animationCleanup();
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
    const language = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    const isRtl = document.documentElement.dir === 'rtl';
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const travel = isMobile ? 24 : 46;
    /** @type {Array<ReturnType<typeof splitTextForReveal>>} */
    const splits = [];
    const context = gsap.context(() => {
        document.querySelectorAll('.content-section').forEach((section) => {
            const heading = section.querySelector('.section-heading h2, .connect-heading h2');
            const kicker = section.querySelector('.section-kicker');
            if (!(heading instanceof HTMLElement)) return;
            const split = splitTextForReveal(heading, language);
            splits.push(split);
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 82%',
                    toggleActions: 'play none none reverse',
                },
            });
            timeline
                .fromTo(kicker, { x: isRtl ? 18 : -18, autoAlpha: 0 }, {
                    x: 0,
                    autoAlpha: 1,
                    duration: 0.4,
                    ease: 'power3.out',
                })
                .fromTo(split.units, {
                    yPercent: 115,
                    autoAlpha: 0,
                    filter: 'blur(7px)',
                }, {
                    yPercent: 0,
                    autoAlpha: 1,
                    filter: 'blur(0px)',
                    duration: 0.58,
                    stagger: language === 'ar' ? 0.055 : 0.018,
                    ease: 'power4.out',
                }, 0.08);
        });

        setupAbout(gsap, isRtl, travel);
        setupProject(gsap, isRtl, travel);
        setupExperience(gsap, travel);
        setupEducation(gsap, isRtl, travel);
        setupSkills(gsap, travel);
        setupDetails(gsap, isRtl, travel);
        setupConnect(gsap, travel);
    }, document.body);

    requestAnimationFrame(() => {
        document.documentElement.classList.remove('motion-pending');
        ScrollTrigger.refresh();
    });

    return () => {
        context.revert();
        splits.forEach((split) => split.restore());
    };
}

/** @param {NonNullable<Window['gsap']>} gsap @param {boolean} isRtl @param {number} travel */
function setupAbout(gsap, isRtl, travel) {
    const section = document.getElementById('about');
    if (!section) return;
    const card = section.querySelector('.about-lead');
    const paragraphs = section.querySelectorAll('.about-story p');
    const timeline = gsap.timeline({ scrollTrigger: { trigger: '.about-layout', start: 'top 82%', toggleActions: 'play none none reverse' } });
    timeline
        .fromTo(card, { x: (isRtl ? 1 : -1) * travel, autoAlpha: 0, rotationY: isRtl ? -4 : 4 }, {
            x: 0,
            autoAlpha: 1,
            rotationY: 0,
            duration: 0.72,
            ease: 'power3.out',
            clearProps: 'transform',
        })
        .fromTo(paragraphs, { x: (isRtl ? -1 : 1) * (travel * 0.72), y: 10, autoAlpha: 0 }, {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 0.58,
            stagger: 0.14,
            ease: 'power3.out',
        }, 0.12);
}

/** @param {NonNullable<Window['gsap']>} gsap @param {boolean} isRtl @param {number} travel */
function setupProject(gsap, isRtl, travel) {
    const feature = document.querySelector('.project-feature');
    if (!feature) return;
    const logo = feature.querySelector('.project-logo');
    const identity = feature.querySelector('.project-identity > div:last-child');
    const description = feature.querySelector('.project-description');
    const chips = feature.querySelectorAll('.scope-list li');
    const timeline = gsap.timeline({ scrollTrigger: { trigger: feature, start: 'top 84%', toggleActions: 'play none none reverse' } });
    timeline
        .fromTo(feature, { y: travel, scale: 0.975, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform' })
        .fromTo(logo, { scale: 0.65, rotation: isRtl ? 16 : -16, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0.18)
        .fromTo(identity, { x: (isRtl ? -1 : 1) * 24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.48, ease: 'power3.out' }, 0.24)
        .fromTo(description, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, 0.32)
        .fromTo(chips, { y: 12, scale: 0.92, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.34, stagger: 0.055, ease: 'back.out(1.5)' }, 0.46);

    gsap.fromTo(logo, { y: -7 }, {
        y: 7,
        ease: 'none',
        scrollTrigger: { trigger: feature, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
    });
}

/** @param {NonNullable<Window['gsap']>} gsap @param {number} travel */
function setupExperience(gsap, travel) {
    const timeline = document.querySelector('.experience-timeline');
    const progress = timeline?.querySelector('[data-timeline-progress]');
    if (!timeline || !progress) return;
    gsap.to(progress, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: timeline, start: 'top 72%', end: 'bottom 72%', scrub: 0.35 },
    });

    timeline.querySelectorAll('.experience-entry').forEach((entry) => {
        const marker = entry.querySelector('.timeline-marker');
        const meta = entry.querySelector('.experience-meta');
        const title = entry.querySelector('h3');
        const description = entry.querySelector('.experience-copy p');
        const itemTimeline = gsap.timeline({ scrollTrigger: { trigger: entry, start: 'top 86%', toggleActions: 'play none none reverse' } });
        itemTimeline
            .fromTo(marker, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.34, ease: 'back.out(2)' })
            .fromTo(meta, { x: -18, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.42, ease: 'power3.out' }, 0.05)
            .fromTo(title, { y: travel * 0.55, autoAlpha: 0, filter: 'blur(5px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' }, 0.1)
            .fromTo(description, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.46, ease: 'power3.out' }, 0.2);
    });
}

/** @param {NonNullable<Window['gsap']>} gsap @param {boolean} isRtl @param {number} travel */
function setupEducation(gsap, isRtl, travel) {
    const card = document.querySelector('.education-card');
    if (!card) return;
    const icon = card.querySelector('.education-icon');
    const paragraph = card.querySelector('p');
    const topics = card.querySelectorAll('li');
    const timeline = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 84%', toggleActions: 'play none none reverse' } });
    timeline
        .fromTo(card, { x: (isRtl ? -1 : 1) * travel, autoAlpha: 0, scale: 0.975 }, { x: 0, autoAlpha: 1, scale: 1, duration: 0.68, ease: 'power3.out', clearProps: 'transform' })
        .fromTo(icon, { scale: 0.55, rotation: isRtl ? 14 : -14, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.48, ease: 'back.out(1.8)' }, 0.18)
        .fromTo(paragraph, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.46, ease: 'power3.out' }, 0.24)
        .fromTo(topics, { y: 10, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.3, stagger: 0.055, ease: 'power2.out' }, 0.34);
}

/** @param {NonNullable<Window['gsap']>} gsap @param {number} travel */
function setupSkills(gsap, travel) {
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        const icon = card.querySelector('.skill-card-heading svg');
        const chips = card.querySelectorAll('.tag-list li');
        const timeline = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' } });
        timeline
            .fromTo(card, { y: travel, autoAlpha: 0, scale: 0.98 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.58, delay: index * 0.04, ease: 'power3.out', clearProps: 'transform' })
            .fromTo(icon, { scale: 0.5, rotation: -14 }, { scale: 1, rotation: 0, duration: 0.38, ease: 'back.out(1.8)' }, 0.16)
            .fromTo(chips, { y: 10, scale: 0.92, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.28, stagger: 0.035, ease: 'power2.out' }, 0.22);
    });

    const tools = document.querySelector('.tools-panel');
    if (tools) gsap.fromTo(tools, { y: travel * 0.7, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.58,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: tools, start: 'top 90%', toggleActions: 'play none none reverse' },
    });
}

/** @param {NonNullable<Window['gsap']>} gsap @param {boolean} isRtl @param {number} travel */
function setupDetails(gsap, isRtl, travel) {
    document.querySelectorAll('.detail-card').forEach((card, index) => {
        const rows = card.querySelectorAll('dl > div');
        const icon = card.querySelector('.detail-heading svg');
        const timeline = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' } });
        timeline
            .fromTo(card, { x: (index === 0 ? -1 : 1) * (isRtl ? -travel : travel), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.62, ease: 'power3.out', clearProps: 'transform' })
            .fromTo(icon, { scale: 0.55, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.38, ease: 'back.out(1.8)' }, 0.15)
            .fromTo(rows, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.34, stagger: 0.09, ease: 'power2.out' }, 0.2);
    });
}

/** @param {NonNullable<Window['gsap']>} gsap @param {number} travel */
function setupConnect(gsap, travel) {
    const subtitle = document.querySelector('.connect-heading > p');
    if (subtitle) gsap.fromTo(subtitle, { y: 20, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: subtitle, start: 'top 88%', toggleActions: 'play none none reverse' },
    });

    document.querySelectorAll('.contact-card').forEach((card, index) => {
        const icon = card.querySelector('.contact-icon');
        const content = card.querySelector('.contact-icon + span');
        const timeline = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none reverse' } });
        timeline
            .fromTo(card, { y: travel * 0.7, autoAlpha: 0, scale: 0.985 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, delay: (index % 2) * 0.035, ease: 'power3.out', clearProps: 'transform' })
            .fromTo(icon, { scale: 0.5, rotation: -12, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.36, ease: 'back.out(1.8)' }, 0.12)
            .fromTo(content, { x: 12, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0.16);
    });
}
