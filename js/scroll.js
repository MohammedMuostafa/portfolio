/* ==========================================================================
   SCROLL ENGINE MODULE: LENIS SMOOTH SCROLL, GSAP SCRUB & CASCADING STACK
   ========================================================================== */

import { splitTypeInstances } from './typewriter.js';

export let lenis;
export const completedScenes = new Set();
export let isUnlockedNormalFlow = false;

export function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

export function initScrollTimeline() {
    const pinTrack = document.getElementById('gsap-scroll-track');
    const introOverlay = document.getElementById('intro-name-overlay');
    const introName = document.getElementById('intro-name');
    const introPrompt = document.getElementById('intro-scroll-prompt');
    const navbar = document.getElementById('main-navbar');
    const sceneWrappers = Array.from(document.querySelectorAll('.scene-stage-wrapper'));

    function updateTimeline() {
        if (!pinTrack) return;
        const trackRect = pinTrack.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollableDistance = trackRect.height - windowHeight;

        let totalP = -trackRect.top / scrollableDistance;
        totalP = Math.max(0, Math.min(1, totalP)); // Master float 0.0 -> 1.0

        // UNLOCKED NORMAL FLOW & CASCADING STACK SETTLEMENT (Requirement 4)
        if (totalP >= 0.98 && !isUnlockedNormalFlow) {
            isUnlockedNormalFlow = true;
            document.body.classList.add('unlocked-normal-flow');
            for (let i = 0; i < sceneWrappers.length; i++) {
                completedScenes.add(i);
            }

            // Trigger satisfying cascading collapse animation
            if (window.gsap) {
                window.gsap.from('.scene-stage-wrapper', {
                    y: 60,
                    opacity: 0,
                    filter: 'blur(10px)',
                    stagger: 0.12,
                    duration: 0.9,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity,filter'
                });
            }
        }

        // If page has unlocked normal flow, preserve 100% finished state
        if (isUnlockedNormalFlow) {
            if (navbar) {
                navbar.classList.remove('hidden');
                navbar.style.opacity = '1';
                navbar.style.pointerEvents = 'auto';
            }
            if (introOverlay) introOverlay.style.display = 'none';

            sceneWrappers.forEach((scene) => {
                scene.style.opacity = '1';
                scene.style.pointerEvents = 'auto';

                const visualLeft = scene.querySelector('.scene-visual-left');
                const contentRight = scene.querySelector('.scene-content-right');
                if (visualLeft) {
                    visualLeft.style.transform = 'none';
                    visualLeft.style.filter = 'none';
                    visualLeft.style.opacity = '1';
                }
                if (contentRight) {
                    contentRight.style.transform = 'none';
                    contentRight.style.filter = 'none';
                    contentRight.style.opacity = '1';
                }

                const targets = scene.querySelectorAll('.split-type-target');
                targets.forEach(targetEl => {
                    const instance = splitTypeInstances.get(targetEl);
                    if (instance && instance.chars) {
                        instance.chars.forEach(charSpan => {
                            charSpan.classList.add('char-typed');
                            charSpan.classList.remove('char-cursor');
                        });
                    }
                });
            });
            return;
        }

        // STAGE 0: INTRO ZOOM (totalP 0.00 to 0.06)
        if (totalP <= 0.06) {
            if (introOverlay) {
                introOverlay.style.display = 'flex';
                introOverlay.style.pointerEvents = 'auto';
                introOverlay.style.opacity = '1';
            }

            const zoomP = totalP / 0.06; // 0.0 -> 1.0
            const scale = 0.4 + (zoomP * 1.0); // 0.4 -> 1.4
            const blur = (1 - zoomP) * 8;

            if (introName) {
                introName.style.transform = `scale(${scale})`;
                introName.style.opacity = Math.min(1, zoomP * 2.5).toString();
                introName.style.filter = `blur(${blur}px)`;
            }
            if (introPrompt) {
                introPrompt.style.opacity = Math.max(0, 1 - (zoomP * 4)).toString();
            }

            if (navbar) {
                navbar.style.opacity = '0';
                navbar.style.pointerEvents = 'none';
            }
            sceneWrappers.forEach(s => s.style.opacity = '0');
            return;
        } else {
            if (introOverlay) {
                introOverlay.style.display = 'none';
                introOverlay.style.pointerEvents = 'none';
            }
        }

        // 6 STAGES MAPPING (totalP 0.06 to 1.00)
        const remainingP = (totalP - 0.06) / 0.94; // 0.0 -> 1.0
        const sceneCount = sceneWrappers.length; // 6 scenes
        const rawIdx = remainingP * sceneCount;
        const activeIdx = Math.min(sceneCount - 1, Math.floor(rawIdx));
        const localP = Math.max(0, Math.min(1, rawIdx - activeIdx)); // 0.0 -> 1.0

        // Reveal Navbar after Hero entrance
        if (totalP > 0.09 && navbar) {
            navbar.classList.remove('hidden');
            navbar.style.opacity = '1';
            navbar.style.pointerEvents = 'auto';
        } else if (navbar) {
            navbar.style.opacity = '0';
            navbar.style.pointerEvents = 'none';
        }

        // Mark completed scenes
        if (localP >= 0.80) {
            completedScenes.add(activeIdx);
        }

        // Update each scene stage
        sceneWrappers.forEach((scene, idx) => {
            const isCompleted = completedScenes.has(idx);

            if (idx === activeIdx) {
                scene.style.pointerEvents = 'auto';

                // Requirement 2 & 3: 1-Second Read Pause & Smooth Fade
                let stageOpacity = 1;
                if (localP < 0.12 && !isCompleted) {
                    stageOpacity = localP / 0.12;
                } else if (localP > 0.88) {
                    stageOpacity = (1 - localP) / 0.12;
                }
                scene.style.opacity = stageOpacity.toString();

                const visualLeft = scene.querySelector('.scene-visual-left');
                const contentRight = scene.querySelector('.scene-content-right');

                let entranceP = isCompleted ? 1 : Math.min(1, localP / 0.20);
                let blurVal = (1 - entranceP) * 10;
                let scaleVal = 0.94 + (entranceP * 0.06);
                let yOffset = (1 - entranceP) * 25;
                let rotateDeg = -180 * (1 - entranceP);

                const isRtl = document.documentElement.dir === 'rtl';
                if (isRtl) rotateDeg = -rotateDeg;

                if (visualLeft) {
                    visualLeft.style.transform = `scale(${scaleVal}) rotate(${rotateDeg}deg)`;
                    visualLeft.style.filter = `blur(${blurVal}px)`;
                    visualLeft.style.opacity = entranceP.toString();
                }

                if (contentRight) {
                    contentRight.style.transform = `translateY(${yOffset}px) scale(${scaleVal})`;
                    contentRight.style.filter = `blur(${blurVal}px)`;
                    contentRight.style.opacity = entranceP.toString();
                }

                // Typewriter finishes early (localP 0.20 -> 0.55), leaving localP 0.55 -> 0.88 for reading pause!
                let typeP = 0;
                if (isCompleted) {
                    typeP = 1;
                } else if (localP >= 0.20) {
                    typeP = Math.min(1, (localP - 0.20) / 0.35);
                }

                const targets = scene.querySelectorAll('.split-type-target');
                targets.forEach(targetEl => {
                    const instance = splitTypeInstances.get(targetEl);
                    if (!instance || !instance.chars) return;

                    const totalChars = instance.chars.length;
                    const visibleCount = Math.floor(typeP * totalChars);

                    instance.chars.forEach((charSpan, charIdx) => {
                        if (charIdx < visibleCount) {
                            charSpan.classList.add('char-typed');
                        } else {
                            charSpan.classList.remove('char-typed');
                        }

                        if (charIdx === visibleCount - 1 && visibleCount < totalChars && typeP > 0) {
                            charSpan.classList.add('char-cursor');
                        } else {
                            charSpan.classList.remove('char-cursor');
                        }
                    });
                });

            } else if (isCompleted && idx < activeIdx) {
                scene.style.opacity = '0';
                scene.style.pointerEvents = 'none';

                const targets = scene.querySelectorAll('.split-type-target');
                targets.forEach(targetEl => {
                    const instance = splitTypeInstances.get(targetEl);
                    if (instance && instance.chars) {
                        instance.chars.forEach(charSpan => {
                            charSpan.classList.add('char-typed');
                            charSpan.classList.remove('char-cursor');
                        });
                    }
                });
            } else {
                scene.style.opacity = '0';
                scene.style.pointerEvents = 'none';
            }
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateTimeline);
    }, { passive: true });

    window.addEventListener('resize', () => {
        requestAnimationFrame(updateTimeline);
    });

    updateTimeline();
}

export function scrollToProgress(targetProgress) {
    const pinTrack = document.getElementById('gsap-scroll-track');
    if (!pinTrack) return;
    const trackRect = pinTrack.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollableDistance = trackRect.height - windowHeight;
    const targetScrollY = window.scrollY + trackRect.top + (targetProgress * scrollableDistance);

    if (lenis) {
        lenis.scrollTo(targetScrollY, { duration: 1.2 });
    } else {
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
}
