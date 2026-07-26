import { initAmbientParticles } from './background.js';
import { initNavigation, closeMobileMenu } from './navigation.js';
import { initScrollExperience } from './scroll.js';
import { initUtilities } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initAmbientParticles();
    initNavigation();
    initScrollExperience();
    initUtilities();
});

window.addEventListener('hashchange', closeMobileMenu);
