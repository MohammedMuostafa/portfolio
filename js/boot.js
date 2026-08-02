(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
        const language = localStorage.getItem('portfolio-language') === 'ar' ? 'ar' : 'en';
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        if (language === 'ar') document.documentElement.classList.add('language-pending');
    } catch {
        // English remains the source-language fallback when storage is unavailable.
    }

    if (!reducedMotion) {
        document.documentElement.classList.add('motion-pending');
        window.setTimeout(() => document.documentElement.classList.remove('motion-pending'), 2000);
    }

    try {
        const navigation = performance.getEntriesByType('navigation')[0];
        const restored = navigation instanceof PerformanceNavigationTiming && navigation.type === 'back_forward';
        const introSeen = sessionStorage.getItem('portfolio-intro-seen') === 'true';
        if (!reducedMotion && !window.location.hash && !restored && !introSeen) {
            document.documentElement.classList.add('intro-enabled');
        }
    } catch {
        // Intro eligibility must never prevent the portfolio from rendering.
    }

    window.setTimeout(() => {
        document.documentElement.classList.remove('language-pending', 'intro-enabled');
        window.dispatchEvent(new Event('portfolio:intro-timeout'));
    }, 2200);
})();
