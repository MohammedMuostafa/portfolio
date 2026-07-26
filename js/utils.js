/** @type {'en' | 'ar'} */
let currentLanguage = document.documentElement.lang === 'ar' ? 'ar' : 'en';
let toastTimer = 0;

export function initUtilities() {
    const controller = new AbortController();
    const languageButton = document.getElementById('lang-toggle-btn');
    const copyButton = document.getElementById('copy-discord');
    const year = document.querySelector('[data-current-year]');

    if (year) year.textContent = String(new Date().getFullYear());
    applyLanguage(currentLanguage, false);

    languageButton?.addEventListener('click', () => {
        applyLanguage(currentLanguage === 'en' ? 'ar' : 'en', true);
    }, { signal: controller.signal });
    copyButton?.addEventListener('click', copyDiscordUsername, { signal: controller.signal });

    return () => {
        window.clearTimeout(toastTimer);
        controller.abort();
    };
}

/**
 * @param {'en' | 'ar'} language
 * @param {boolean} persist
 */
function applyLanguage(language, persist) {
    if (persist) window.dispatchEvent(new CustomEvent('portfolio:before-language-change'));

    currentLanguage = language;
    const isArabic = language === 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-lang-en]').forEach((element) => {
        const text = element.getAttribute(isArabic ? 'data-lang-ar' : 'data-lang-en');
        if (text !== null) element.textContent = text;

        const forcedDirection = element.getAttribute('data-direction');
        const direction = forcedDirection ?? (isArabic ? 'rtl' : 'ltr');
        element.setAttribute('dir', direction);
        element.setAttribute('lang', direction === 'ltr' && isArabic ? 'en' : language);
    });

    updateLocalizedAttribute('[data-aria-en]', 'aria-label', isArabic ? 'data-aria-ar' : 'data-aria-en');
    updateLocalizedAttribute('[data-alt-en]', 'alt', isArabic ? 'data-alt-ar' : 'data-alt-en');

    const pageTitle = document.querySelector('[data-title-en]');
    const title = pageTitle?.getAttribute(isArabic ? 'data-title-ar' : 'data-title-en');
    if (title) document.title = title;

    document.querySelectorAll('[data-meta-en]').forEach((meta) => {
        const content = meta.getAttribute(isArabic ? 'data-meta-ar' : 'data-meta-en');
        if (content !== null) meta.setAttribute('content', content);
    });

    const languageLabel = document.getElementById('lang-label');
    const languageButton = document.getElementById('lang-toggle-btn');
    const copyButton = document.getElementById('copy-discord');
    if (languageLabel) languageLabel.textContent = isArabic ? 'English' : 'العربية';
    languageButton?.setAttribute('aria-label', isArabic ? 'Switch to English' : 'التبديل إلى العربية');
    copyButton?.setAttribute('aria-label', isArabic ? 'نسخ اسم Discord: mohmos' : 'Copy Discord username mohmos');
    document.documentElement.classList.remove('language-pending');

    if (!persist) return;

    try {
        localStorage.setItem('portfolio-language', language);
    } catch {
        // The selected language still applies to the current page.
    }

    window.dispatchEvent(new CustomEvent('portfolio:language-change'));
}

/**
 * @param {string} selector
 * @param {string} targetAttribute
 * @param {string} sourceAttribute
 */
function updateLocalizedAttribute(selector, targetAttribute, sourceAttribute) {
    document.querySelectorAll(selector).forEach((element) => {
        const value = element.getAttribute(sourceAttribute);
        if (value !== null) element.setAttribute(targetAttribute, value);
    });
}

async function copyDiscordUsername() {
    showToast(await writeClipboard('mohmos'));
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
    const focusedElement = document.activeElement;
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.setAttribute('readonly', '');
    textArea.className = 'clipboard-fallback';
    document.body.append(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    textArea.remove();
    if (focusedElement instanceof HTMLElement) focusedElement.focus();
    return copied;
}

/** @param {boolean} copied */
function showToast(copied) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    const isArabic = currentLanguage === 'ar';
    toastText.textContent = copied
        ? (isArabic ? 'تم نسخ اسم Discord: mohmos.' : 'Discord username mohmos copied.')
        : (isArabic ? 'تعذر النسخ. اسم Discord هو mohmos.' : 'Could not copy. The Discord username is mohmos.');

    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
}
