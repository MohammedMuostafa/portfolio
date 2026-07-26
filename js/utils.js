/* ==========================================================================
   UTILS MODULE: LANGUAGE SWITCHER, CLIPBOARD & TOAST HELPERS
   ========================================================================== */

export let currentLang = 'en';

export function toggleLanguage(onLanguageChangedCallback) {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const isAr = currentLang === 'ar';

    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
        langLabel.textContent = isAr ? 'English' : 'العربية';
    }

    document.querySelectorAll('[data-lang-en]').forEach(el => {
        if (!el.classList.contains('split-type-target')) {
            const text = isAr ? el.getAttribute('data-lang-ar') : el.getAttribute('data-lang-en');
            if (text) el.textContent = text;
        } else {
            const text = isAr ? el.getAttribute('data-lang-ar') : el.getAttribute('data-lang-en');
            if (text) {
                el.textContent = text;
            }
        }
    });

    const toastText = document.getElementById('toast-text');
    if (toastText) {
        toastText.innerHTML = isAr 
            ? 'تم نسخ حساب ديسكورد <strong class="text-red-400">mohmos</strong> إلى الحافظة!'
            : 'Discord tag <strong class="text-red-400">mohmos</strong> copied to clipboard!';
    }

    if (onLanguageChangedCallback) {
        onLanguageChangedCallback(currentLang);
    }
}

export function copyDiscordTag() {
    navigator.clipboard.writeText('mohmos');
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}
