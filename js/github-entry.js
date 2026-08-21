export function initGitHubEntry() {
    const desktopNav = document.querySelector('.desktop-nav');
    const mobileNav = document.getElementById('mobile-menu');
    if (!desktopNav && !mobileNav) return () => {};

    /** @type {HTMLElement[]} */
    const created = [];

    /**
     * @param {Element | null} container
     * @param {string} [className]
     */
    const addLink = (container, className = '') => {
        if (!(container instanceof HTMLElement) || container.querySelector('[data-github-page-link]')) return;
        const link = document.createElement('a');
        link.href = 'github.html';
        link.dataset.githubPageLink = '';
        link.className = className;
        link.setAttribute('data-lang-en', 'GitHub');
        link.setAttribute('data-lang-ar', 'GitHub');
        link.textContent = 'GitHub';
        container.insertBefore(link, container.lastElementChild);
        created.push(link);
    };

    addLink(desktopNav);
    addLink(mobileNav);

    return () => created.forEach((element) => element.remove());
}
