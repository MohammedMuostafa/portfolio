let currentLang = 'en';
let toastTimer = 0;

export function initUtilities() {
    const languageButton = document.getElementById('lang-toggle-btn');
    const copyButton = document.getElementById('copy-discord');
    const year = document.querySelector('[data-current-year]');

    if (year) year.textContent = String(new Date().getFullYear());

    languageButton?.addEventListener('click', toggleLanguage);
    copyButton?.addEventListener('click', copyDiscordTag);

    try {
        if (localStorage.getItem('portfolio-language') === 'ar') toggleLanguage();
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const isAr = currentLang === 'ar';

    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
        langLabel.textContent = isAr ? 'English' : 'العربية';
    }

    document.querySelectorAll('[data-lang-en]').forEach((element) => {
        const text = element.getAttribute(isAr ? 'data-lang-ar' : 'data-lang-en');
        if (text) element.textContent = text;
    });

    try {
        localStorage.setItem('portfolio-language', currentLang);
    } catch {
        // The selected language still applies for the current page view.
    }
}

async function copyDiscordTag() {
    const didCopy = await writeClipboard('mohmos');
    showToast(didCopy);
}

/** @param {string} value */
async function writeClipboard(value) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
            return true;
        }
        return copyWithFallback(value);
    } catch {
        return copyWithFallback(value);
    }
}

/** @param {string} value */
function copyWithFallback(value) {
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.setAttribute('readonly', '');
    textArea.className = 'clipboard-fallback';
    document.body.append(textArea);
    textArea.select();
    const didCopy = document.execCommand('copy');
    textArea.remove();
    return didCopy;
}

/** @param {boolean} didCopy */
function showToast(didCopy) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    const isAr = currentLang === 'ar';
    toastText.textContent = didCopy
        ? (isAr ? 'تم نسخ حساب ديسكورد mohmos.' : 'Discord username mohmos copied.')
        : (isAr ? 'تعذر النسخ. حساب ديسكورد هو mohmos.' : 'Could not copy. The Discord username is mohmos.');

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}
