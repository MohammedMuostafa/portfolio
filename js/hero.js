import { splitTextForReveal } from './motion.js';

const titles = {
    en: ['Developer', 'Web3 Builder', 'Discord Server Builder'],
    ar: ['مطور', 'باني Web3', 'منشئ خوادم Discord'],
};

/** @param {Promise<void>} introFinished */
export function initHero(introFinished) {
    const gsap = window.gsap;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    const hero = document.getElementById('home');
    const rotatingTitle = document.getElementById('rotating-title');
    const summary = hero?.querySelector('[data-hero-summary]');
    /** @type {ReturnType<typeof splitTextForReveal> | null} */
    let summarySplit = null;
    /** @type {ReturnType<NonNullable<Window['gsap']>['timeline']> | null} */
    let entrance = null;
    /** @type {ReturnType<NonNullable<Window['gsap']>['timeline']> | null} */
    let rotationTimeline = null;
    let rotationTimer = 0;
    let titleIndex = 0;
    let heroVisible = true;
    let active = true;
    let motionActive = Boolean(gsap) && !motionQuery.matches;

    if (!hero || !rotatingTitle || !(summary instanceof HTMLElement)) {
        document.documentElement.classList.remove('motion-pending');
        return () => {};
    }

    const currentLanguage = () => document.documentElement.lang === 'ar' ? 'ar' : 'en';
    const setInitialTitle = () => {
        titleIndex = motionActive ? 0 : 1;
        rotatingTitle.textContent = titles[currentLanguage()][titleIndex];
    };
    setInitialTitle();

    const handleBeforeLanguageChange = () => {
        summarySplit?.restore();
        summarySplit = null;
    };
    const handleLanguageChange = () => {
        rotationTimeline?.kill();
        rotationTimeline = null;
        gsap?.set(rotatingTitle, { clearProps: 'transform,opacity,visibility,filter' });
        setInitialTitle();
        if (!motionActive || !gsap) return;
        summarySplit = splitTextForReveal(summary, currentLanguage());
        gsap.set(summarySplit.units, { clearProps: 'all' });
    };
    const handleMotionChange = () => {
        if (!motionQuery.matches || !motionActive) return;
        motionActive = false;
        window.clearInterval(rotationTimer);
        entrance?.kill();
        rotationTimeline?.kill();
        entrance = null;
        rotationTimeline = null;
        summarySplit?.restore();
        summarySplit = null;
        gsap?.set(hero.querySelectorAll('*'), { clearProps: 'transform,opacity,visibility,filter' });
        setInitialTitle();
        document.documentElement.classList.remove('motion-pending');
    };
    window.addEventListener('portfolio:before-language-change', handleBeforeLanguageChange, { signal: controller.signal });
    window.addEventListener('portfolio:language-change', handleLanguageChange, { signal: controller.signal });
    motionQuery.addEventListener('change', handleMotionChange, { signal: controller.signal });

    if (!motionActive || !gsap) {
        document.documentElement.classList.remove('motion-pending');
        return () => {
            active = false;
            controller.abort();
        };
    }

    const titleCharacters = hero.querySelectorAll('.hero-title i');
    const label = hero.querySelector('[data-hero-label]');
    const role = hero.querySelector('[data-hero-role]');
    const identity = hero.querySelector('[data-hero-identity]');
    const actions = hero.querySelectorAll('[data-hero-actions] .button');
    const socialLinks = hero.querySelectorAll('[data-hero-socials] a');
    const visual = hero.querySelector('[data-hero-visual]');
    const orbit = hero.querySelector('[data-hero-orbit]');
    const chips = hero.querySelectorAll('[data-hero-chip]');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const isRtl = document.documentElement.dir === 'rtl';
    const textDirection = isRtl ? 1 : -1;

    summarySplit = splitTextForReveal(summary, currentLanguage());
    const initialSummaryUnits = summarySplit.units;
    const summaryStagger = initialSummaryUnits.length > 1
        ? Math.min(0.014, 0.42 / (initialSummaryUnits.length - 1))
        : 0;
    gsap.set(label, { y: 14, autoAlpha: 0 });
    gsap.set(titleCharacters, { yPercent: 120, rotationX: -70, autoAlpha: 0, filter: 'blur(10px)' });
    gsap.set(role, { x: isMobile ? 0 : textDirection * 42, y: isMobile ? 18 : 0, autoAlpha: 0 });
    gsap.set(identity, { y: 18, autoAlpha: 0 });
    gsap.set(initialSummaryUnits, { y: 12, autoAlpha: 0, filter: 'blur(3px)' });
    gsap.set([...actions, ...socialLinks], { y: 16, autoAlpha: 0 });
    gsap.set(visual, {
        x: isMobile ? 0 : -textDirection * 90,
        y: isMobile ? 55 : 0,
        rotationY: isMobile ? 0 : textDirection * 12,
        rotationZ: textDirection * 2.5,
        scale: 0.9,
        autoAlpha: 0,
        filter: 'blur(12px)',
        transformPerspective: 1000,
    });
    gsap.set(orbit, { scale: 0.78, autoAlpha: 0 });
    gsap.set(chips, { y: 14, scale: 0.9, autoAlpha: 0 });
    document.documentElement.classList.remove('motion-pending');

    const playEntrance = () => {
        if (!active || !motionActive) return;
        entrance = gsap.timeline({ onComplete: startRotation });
        entrance
            .to(label, { y: 0, autoAlpha: 1, duration: 0.38, ease: 'power3.out' }, 0)
            .to(titleCharacters, {
                yPercent: 0,
                rotationX: 0,
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: 0.62,
                stagger: 0.045,
                ease: 'power4.out',
            }, 0.08)
            .to(visual, {
                x: 0,
                y: 0,
                rotationY: 0,
                rotationZ: 0,
                scale: 1,
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: 1.05,
                ease: 'power4.out',
            }, 0.12)
            .to(role, { x: 0, y: 0, autoAlpha: 1, duration: 0.52, ease: 'power3.out' }, 0.42)
            .to(identity, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' }, 0.54)
            .to(initialSummaryUnits, {
                y: 0,
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: 0.42,
                stagger: summaryStagger,
                ease: 'power2.out',
            }, 0.62)
            .to(actions, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.08, ease: 'power3.out' }, 0.92)
            .to(socialLinks, { y: 0, autoAlpha: 1, duration: 0.34, stagger: 0.055, ease: 'back.out(1.7)' }, 1.02)
            .to(orbit, { scale: 1, autoAlpha: 1, duration: 0.75, ease: 'power3.out' }, 0.48)
            .to(chips, { y: 0, scale: 1, autoAlpha: 1, duration: 0.46, stagger: 0.1, ease: 'back.out(1.5)' }, 0.72);
    };

    const rotateTitle = () => {
        if (!active || !motionActive || !heroVisible || document.hidden || rotationTimeline?.isActive()) return;
        const languageTitles = titles[currentLanguage()];
        rotationTimeline = gsap.timeline();
        rotationTimeline
            .to(rotatingTitle, { yPercent: -115, autoAlpha: 0, filter: 'blur(8px)', duration: 0.28, ease: 'power2.in' })
            .add(() => {
                titleIndex = (titleIndex + 1) % languageTitles.length;
                rotatingTitle.textContent = languageTitles[titleIndex];
            })
            .set(rotatingTitle, { yPercent: 115 })
            .to(rotatingTitle, { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' });
    };

    function startRotation() {
        window.clearInterval(rotationTimer);
        rotationTimer = window.setInterval(rotateTitle, 2600);
    }

    const observer = new IntersectionObserver(([entry]) => {
        heroVisible = entry?.isIntersecting ?? false;
    }, { threshold: 0.12 });
    observer.observe(hero);

    introFinished.then(playEntrance);

    return () => {
        active = false;
        window.clearInterval(rotationTimer);
        observer.disconnect();
        entrance?.kill();
        rotationTimeline?.kill();
        controller.abort();
        summarySplit?.restore();
        gsap.set(hero.querySelectorAll('*'), { clearProps: 'transform,opacity,visibility,filter' });
    };
}
