(() => {
    try {
        const language = localStorage.getItem('portfolio-language') === 'ar' ? 'ar' : 'en';
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        if (language === 'ar') document.documentElement.classList.add('language-pending');
    } catch {
        // English remains the source-language fallback when storage is unavailable.
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('motion-pending');
        window.setTimeout(() => document.documentElement.classList.remove('motion-pending'), 2000);
    }

    window.setTimeout(() => document.documentElement.classList.remove('language-pending'), 2000);
})();
