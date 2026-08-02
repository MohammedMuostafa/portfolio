/** @returns {{ gsap: NonNullable<Window['gsap']>, ScrollTrigger: NonNullable<Window['ScrollTrigger']> } | null} */
export function getMotionLibraries() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return null;
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
}

/**
 * Splits English into characters and Arabic into whole words without breaking letter shaping.
 * @param {HTMLElement} element
 * @param {'en' | 'ar'} language
 */
export function splitTextForReveal(element, language) {
    const text = element.textContent?.trim() ?? '';
    /** @type {HTMLElement[]} */
    const units = [];
    element.textContent = '';
    element.setAttribute('aria-label', text);

    /** @param {string} token */
    const createUnit = (token) => {
        const unit = document.createElement('span');
        unit.className = 'text-reveal-unit';
        unit.setAttribute('aria-hidden', 'true');
        unit.textContent = token;
        units.push(unit);
        return unit;
    };

    text.split(/(\s+)/u).forEach((token) => {
        if (token === '') return;
        if (/^\s+$/u.test(token)) {
            element.append(document.createTextNode(token));
            return;
        }

        if (language === 'ar') {
            element.append(createUnit(token));
            return;
        }

        const word = document.createElement('span');
        word.className = 'text-reveal-word';
        Array.from(token).forEach((character) => word.append(createUnit(character)));
        element.append(word);
    });

    return {
        units,
        restore() {
            element.textContent = text;
            element.removeAttribute('aria-label');
        },
    };
}

/** @param {number} value @param {number} minimum @param {number} maximum */
export function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
}

/** @param {number} current @param {number} target @param {number} amount */
export function lerp(current, target, amount) {
    return current + ((target - current) * amount);
}
