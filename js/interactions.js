import { lerp } from './motion.js';

export function initInteractions() {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionQuery.matches || !finePointer) return () => {};

    const controller = new AbortController();
    let cardFrame = 0;
    /** @type {HTMLElement[]} */
    const cards = [...document.querySelectorAll('.surface-card')].filter((card) => card instanceof HTMLElement);
    /** @param {HTMLElement} card */
    const resetCard = (card) => {
        card.style.setProperty('--card-rx', '0deg');
        card.style.setProperty('--card-ry', '0deg');
        card.style.setProperty('--spot-x', '50%');
        card.style.setProperty('--spot-y', '50%');
    };
    cards.forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            if (!(event instanceof PointerEvent) || motionQuery.matches) return;
            window.cancelAnimationFrame(cardFrame);
            cardFrame = window.requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.style.setProperty('--spot-x', `${x * 100}%`);
                card.style.setProperty('--spot-y', `${y * 100}%`);
                card.style.setProperty('--card-rx', `${(0.5 - y) * 2.4}deg`);
                card.style.setProperty('--card-ry', `${(x - 0.5) * 3.2}deg`);
            });
        }, { passive: true, signal: controller.signal });
        card.addEventListener('pointerleave', () => {
            window.cancelAnimationFrame(cardFrame);
            cardFrame = 0;
            resetCard(card);
        }, { signal: controller.signal });
    });

    const avatar = document.querySelector('[data-avatar-tilt]');
    const highlight = document.querySelector('[data-avatar-highlight]');
    const avatarElement = avatar instanceof HTMLElement ? avatar : null;
    const highlightElement = highlight instanceof HTMLElement ? highlight : null;
    let avatarFrame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const animateAvatar = () => {
        currentX = lerp(currentX, targetX, 0.12);
        currentY = lerp(currentY, targetY, 0.12);
        avatarElement?.style.setProperty('--avatar-rx', `${-currentY * 5}deg`);
        avatarElement?.style.setProperty('--avatar-ry', `${currentX * 7}deg`);
        if (Math.abs(currentX - targetX) + Math.abs(currentY - targetY) > 0.002) {
            avatarFrame = window.requestAnimationFrame(animateAvatar);
        }
    };

    if (avatarElement) {
        avatarElement.addEventListener('pointermove', (event) => {
            if (motionQuery.matches) return;
            const rect = avatarElement.getBoundingClientRect();
            targetX = ((event.clientX - rect.left) / rect.width) - 0.5;
            targetY = ((event.clientY - rect.top) / rect.height) - 0.5;
            highlightElement?.style.setProperty('--avatar-light-x', `${(targetX + 0.5) * 100}%`);
            highlightElement?.style.setProperty('--avatar-light-y', `${(targetY + 0.5) * 100}%`);
            avatarElement.classList.add('is-active');
            window.cancelAnimationFrame(avatarFrame);
            avatarFrame = window.requestAnimationFrame(animateAvatar);
        }, { passive: true, signal: controller.signal });
        avatarElement.addEventListener('pointerleave', () => {
            targetX = 0;
            targetY = 0;
            avatarElement.classList.remove('is-active');
            window.cancelAnimationFrame(avatarFrame);
            avatarFrame = window.requestAnimationFrame(animateAvatar);
        }, { signal: controller.signal });
    }

    const resetMotion = () => {
        window.cancelAnimationFrame(cardFrame);
        window.cancelAnimationFrame(avatarFrame);
        cardFrame = 0;
        avatarFrame = 0;
        cards.forEach(resetCard);
        currentX = 0;
        currentY = 0;
        targetX = 0;
        targetY = 0;
        avatarElement?.style.setProperty('--avatar-rx', '0deg');
        avatarElement?.style.setProperty('--avatar-ry', '0deg');
        avatarElement?.classList.remove('is-active');
        highlightElement?.style.setProperty('--avatar-light-x', '50%');
        highlightElement?.style.setProperty('--avatar-light-y', '50%');
    };
    motionQuery.addEventListener('change', () => {
        if (motionQuery.matches) resetMotion();
    }, { signal: controller.signal });

    return () => {
        resetMotion();
        controller.abort();
    };
}
