import { initNetworkBackground } from './background.js';
import { initHero } from './hero.js';
import { initInteractions } from './interactions.js';
import { initIntro } from './intro.js';
import { initNavigation } from './navigation.js';
import { initScrollExperience } from './scroll.js';
import { initUtilities } from './utils.js';

/** @type {Array<() => void>} */
let cleanups = [];
let initialized = false;

function initialize() {
    if (initialized) return;
    initialized = true;

    window.portfolioIcons?.create();
    const utilitiesCleanup = initUtilities();
    const intro = initIntro();
    cleanups = [
        utilitiesCleanup,
        initNavigation(),
        initNetworkBackground(),
        initScrollExperience(),
        initInteractions(),
        initHero(intro.finished),
        intro.cleanup,
    ];
}

function cleanup() {
    cleanups.reverse().forEach((dispose) => dispose());
    cleanups = [];
    initialized = false;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
    initialize();
}

window.addEventListener('pagehide', (event) => {
    if (!event.persisted) cleanup();
});

window.addEventListener('pageshow', initialize);
