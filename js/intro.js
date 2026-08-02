export function initIntro() {
    const root = document.documentElement;
    const overlay = document.getElementById('intro-overlay');
    const controller = new AbortController();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    /** @type {ReturnType<NonNullable<Window['gsap']>['timeline']> | null} */
    let timeline = null;
    let resolved = false;
    let resolveFinished = () => {};
    /** @type {Promise<void>} */
    const finished = new Promise((resolve) => {
        resolveFinished = () => resolve();
    });

    const complete = () => {
        if (resolved) return;
        resolved = true;
        root.classList.remove('intro-enabled');
        overlay?.setAttribute('hidden', '');
        resolveFinished();
    };

    const finishImmediately = () => {
        timeline?.kill();
        window.gsap?.set(overlay, { clearProps: 'opacity,visibility,clipPath' });
        complete();
    };

    const handleMotionChange = () => {
        if (motionQuery.matches) finishImmediately();
    };
    motionQuery.addEventListener('change', handleMotionChange, { signal: controller.signal });
    window.addEventListener('portfolio:intro-timeout', finishImmediately, { signal: controller.signal });

    if (!root.classList.contains('intro-enabled') || !overlay || !window.gsap || motionQuery.matches) {
        complete();
        return {
            finished,
            cleanup() {
                controller.abort();
                finishImmediately();
            },
        };
    }

    try {
        sessionStorage.setItem('portfolio-intro-seen', 'true');
    } catch {
        // The intro can still run when storage is restricted.
    }

    const gsap = window.gsap;
    const characters = overlay.querySelectorAll('.intro-wordmark span');
    const dot = overlay.querySelector('.intro-wordmark i');
    const signal = overlay.querySelector('.intro-signal');
    const rule = overlay.querySelector('.intro-rule');
    const grid = overlay.querySelector('.intro-grid');

    timeline = gsap.timeline({ onComplete: complete });
    timeline
        .set(overlay, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' })
        .fromTo(grid, { scale: 1.08, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.55, ease: 'power2.out' }, 0)
        .fromTo(signal, { y: -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.24, ease: 'power2.out' }, 0.04)
        .fromTo(rule, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.4, ease: 'power3.out' }, 0.12)
        .fromTo(characters, {
            yPercent: 120,
            rotationX: -75,
            autoAlpha: 0,
            filter: 'blur(12px)',
        }, {
            yPercent: 0,
            rotationX: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.52,
            stagger: 0.045,
            ease: 'power4.out',
        }, 0.18)
        .fromTo(dot, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.24, ease: 'back.out(2)' }, 0.55)
        .to('.intro-lockup', { scale: 1.035, duration: 0.28, ease: 'power2.inOut' }, 0.78)
        .to(overlay, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.48, ease: 'power3.inOut' }, 0.9);

    const accelerate = () => timeline?.timeScale(2.5);
    window.addEventListener('wheel', accelerate, { once: true, passive: true });
    window.addEventListener('touchmove', accelerate, { once: true, passive: true });
    window.addEventListener('keydown', accelerate, { once: true });

    return {
        finished,
        cleanup() {
            window.removeEventListener('wheel', accelerate);
            window.removeEventListener('touchmove', accelerate);
            window.removeEventListener('keydown', accelerate);
            controller.abort();
            finishImmediately();
        },
    };
}
