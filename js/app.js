/* ==========================================================================
   MAIN ES MODULE APP ENTRY POINT
   ========================================================================== */

import { initAmbientParticles } from './background.js';
import { initSplitType, reSplitTypeAll } from './typewriter.js';
import { initNavigation, closeMobileMenu } from './navigation.js';
import { initLenis, initScrollTimeline, scrollToProgress } from './scroll.js';
import { toggleLanguage, copyDiscordTag } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    initLenis();

    // 2. Initialize SplitType Character Parser
    initSplitType();

    // 3. Initialize Multi-Layer Particle & Aurora Canvas
    initAmbientParticles();

    // 4. Initialize Navigation Controls
    initNavigation();

    // 5. Initialize GSAP Scroll Timeline Engine
    initScrollTimeline();

    // 6. Expose global window methods for inline click handlers
    window.scrollToProgress = scrollToProgress;
    window.closeMobileMenu = closeMobileMenu;
    window.copyDiscordTag = copyDiscordTag;
    window.toggleLanguage = () => {
        toggleLanguage(() => {
            reSplitTypeAll();
        });
    };
});
