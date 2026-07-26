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
            instance.split({ types: 'chars' });
        }
    });
}
