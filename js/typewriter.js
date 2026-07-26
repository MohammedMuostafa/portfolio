/* ==========================================================================
   TYPEWRITER MODULE: SPLIT-TYPE CHARACTER PARSING & STATE MANAGER
   ========================================================================== */

export const splitTypeInstances = new Map();

export function initSplitType() {
    document.querySelectorAll('.split-type-target').forEach(el => {
        const instance = new SplitType(el, { types: 'chars' });
        splitTypeInstances.set(el, instance);
    });
}

export function reSplitTypeAll() {
    document.querySelectorAll('.split-type-target').forEach(el => {
        const instance = splitTypeInstances.get(el);
        if (instance) {
            instance.revert();
        }

        const isAr = document.documentElement.lang === 'ar';
        const text = isAr 
            ? (el.getAttribute('data-lang-ar') || el.textContent)
            : (el.getAttribute('data-lang-en') || el.textContent);
            
        if (text) {
            el.textContent = text;
        }

        const newInstance = new SplitType(el, { types: 'chars' });
        splitTypeInstances.set(el, newInstance);
    });
}
