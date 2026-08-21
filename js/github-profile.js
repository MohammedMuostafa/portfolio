import { initUtilities } from './utils.js';

const USERNAME = 'MohammedMuostafa';
const DATA_URL = new URL('../data/github-profile.json', import.meta.url).href;
const BIO = {
    en: 'Computer Science student • Protocol Lead • Web3 Builder • Developer • Discord Server Builder',
    ar: 'طالب علوم الحاسب • قائد بروتوكول • باني Web3 • مطور • منشئ خوادم Discord',
};

/** @typedef {{date:string,count:number,level:number,weekday?:number}} ContributionDay */
/** @typedef {{commits:number,pullRequests:number,issues:number,reviews:number}} ActivityStats */
/** @typedef {{year:number,total:number,from?:string,to?:string,days:ContributionDay[],stats?:ActivityStats}} ContributionYear */
/** @typedef {{name:string,color?:string,size:number}} LanguageStat */
/** @typedef {{login?:string,name?:string,url:string,avatarUrl?:string}} Organization */
/** @typedef {{name:string,description?:string,url:string,homepageUrl?:string,stars?:number,forks?:number,language?:{name:string,color?:string},updatedAt?:string,isPrivate?:boolean}} Repository */
/** @typedef {{type:string,createdAt?:string,repo?:{name:string}}} GitHubEvent */
/** @typedef {{login?:string,name?:string,bio?:string,avatarUrl?:string,url?:string,location?:string,company?:string,websiteUrl?:string,followers?:number,following?:number,publicRepos?:number}} GitHubProfile */
/** @typedef {{generatedAt?:string,profile?:GitHubProfile,organizations?:Organization[],pinned?:Repository[],repositories?:Repository[],languages?:LanguageStat[],contributions?:ContributionYear[],recentActivity?:GitHubEvent[]}} GitHubProfileData */

/** @type {GitHubProfileData | null} */
let data = null;
/** @type {number | null} */
let selectedYear = null;
let initialized = false;
let utilitiesCleanup = () => {};
const pageController = new AbortController();

/** @param {string} en @param {string} ar */
function text(en, ar) {
    return document.documentElement.lang === 'ar' ? ar : en;
}

/** @param {unknown} value */
function safeNumber(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
}

/** @param {number} value */
function formatNumber(value) {
    return new Intl.NumberFormat(document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US', { notation: value >= 10000 ? 'compact' : 'standard' }).format(value);
}

/** @param {unknown} value */
function safeHttpsUrl(value) {
    if (typeof value !== 'string' || value.length > 500) return null;
    try {
        const url = new URL(value);
        if (url.protocol !== 'https:') return null;
        return url.href;
    } catch {
        return null;
    }
}

/** @param {unknown} value */
function safeGitHubAssetUrl(value) {
    const href = safeHttpsUrl(value);
    if (!href) return null;
    const { hostname } = new URL(href);
    if (hostname === 'github.com' || hostname === 'avatars.githubusercontent.com' || hostname.endsWith('.githubusercontent.com') || hostname.endsWith('.github.io')) {
        return href;
    }
    return null;
}

/** @param {string} id @param {string} value */
function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

/** @param {string} rowId @param {string} valueId @param {string | null | undefined} value */
function setOptionalRow(rowId, valueId, value) {
    const row = document.getElementById(rowId);
    const target = document.getElementById(valueId);
    if (!row || !target || !value) return;
    target.textContent = value;
    row.hidden = false;
}

/** @param {string} name */
function createIcon(name) {
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', name);
    icon.setAttribute('aria-hidden', 'true');
    return icon;
}

/** @param {Repository[]} repositories */
function publicRepositories(repositories) {
    return repositories.filter((repository) => repository && !repository.isPrivate && safeHttpsUrl(repository.url));
}

/** @param {GitHubProfileData} payload */
function renderProfile(payload) {
    const profile = payload.profile ?? {};
    const avatar = document.getElementById('github-avatar');
    const avatarUrl = safeGitHubAssetUrl(profile.avatarUrl);
    if (avatar instanceof HTMLImageElement && avatarUrl) avatar.src = avatarUrl;
    setText('github-name', profile.name || 'MOHMOS');
    setText('github-login', profile.login || USERNAME);
    setText('github-followers', profile.followers == null ? '—' : formatNumber(safeNumber(profile.followers)));
    setText('github-following', profile.following == null ? '—' : formatNumber(safeNumber(profile.following)));

    const bio = document.getElementById('github-bio');
    if (bio) bio.textContent = document.documentElement.lang === 'ar' ? BIO.ar : BIO.en;

    const profileLink = document.getElementById('github-profile-link');
    if (profileLink instanceof HTMLAnchorElement) {
        profileLink.href = safeHttpsUrl(profile.url) || `https://github.com/${USERNAME}`;
    }

    setOptionalRow('github-company-row', 'github-company', profile.company);
    setOptionalRow('github-location-row', 'github-location', profile.location);

    const websiteUrl = safeHttpsUrl(profile.websiteUrl);
    const websiteRow = document.getElementById('github-website-row');
    const websiteHost = document.getElementById('github-website');
    if (websiteUrl && websiteRow && websiteHost) {
        const link = document.createElement('a');
        link.href = websiteUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
        websiteHost.replaceChildren(link);
        websiteRow.hidden = false;
    }

    const orgs = document.getElementById('github-orgs');
    if (orgs) {
        orgs.replaceChildren();
        const organizations = Array.isArray(payload.organizations) ? payload.organizations : [];
        if (!organizations.length) {
            const empty = document.createElement('span');
            empty.className = 'github-empty';
            empty.textContent = text('No public organizations listed.', 'لا توجد منظمات عامة معروضة.');
            orgs.append(empty);
        } else {
            organizations.forEach((organization) => {
                const href = safeHttpsUrl(organization.url);
                if (!href) return;
                const link = document.createElement('a');
                link.className = 'github-org-chip';
                link.href = href;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                const imageUrl = safeGitHubAssetUrl(organization.avatarUrl);
                if (imageUrl) {
                    const image = document.createElement('img');
                    image.src = imageUrl;
                    image.alt = '';
                    image.width = 20;
                    image.height = 20;
                    link.append(image);
                }
                const label = document.createElement('span');
                label.textContent = organization.name || organization.login || 'GitHub';
                link.append(label);
                orgs.append(link);
            });
            if (!orgs.childElementCount) {
                const empty = document.createElement('span');
                empty.className = 'github-empty';
                empty.textContent = text('No public organizations listed.', 'لا توجد منظمات عامة معروضة.');
                orgs.append(empty);
            }
        }
    }
}

/** @param {GitHubProfileData} payload */
function renderMetrics(payload) {
    const repositories = publicRepositories(Array.isArray(payload.repositories) ? payload.repositories : []);
    const contributionYears = Array.isArray(payload.contributions) ? payload.contributions : [];
    const current = contributionYears.find((item) => item.year === selectedYear) ?? contributionYears[0];
    const totalStars = repositories.reduce((sum, repo) => sum + safeNumber(repo.stars), 0);
    const totalForks = repositories.reduce((sum, repo) => sum + safeNumber(repo.forks), 0);
    setText('metric-repos', formatNumber(safeNumber(payload.profile?.publicRepos ?? repositories.length)));
    setText('metric-stars', formatNumber(totalStars));
    setText('metric-forks', formatNumber(totalForks));
    setText('metric-contributions', current ? formatNumber(safeNumber(current.total)) : '—');
}

/** @param {Repository} repository */
function repoCard(repository) {
    const article = document.createElement('article');
    article.className = 'github-repo-card';

    const title = document.createElement('div');
    title.className = 'github-repo-title';
    title.append(createIcon('book-marked'));
    const link = document.createElement('a');
    link.href = /** @type {string} */ (safeHttpsUrl(repository.url));
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = repository.name;
    title.append(link);
    const badge = document.createElement('span');
    badge.className = 'github-repo-badge';
    badge.textContent = text('Public', 'عام');
    title.append(badge);

    const description = document.createElement('p');
    description.textContent = repository.description || text('No description provided.', 'لا يوجد وصف للمستودع.');

    const meta = document.createElement('div');
    meta.className = 'github-repo-meta';
    if (repository.language?.name) {
        const language = document.createElement('span');
        const dot = document.createElement('i');
        dot.className = 'github-language-dot';
        dot.style.setProperty('--language-color', repository.language.color || '#8b949e');
        language.append(dot, repository.language.name);
        meta.append(language);
    }
    const stars = document.createElement('span');
    stars.append(createIcon('star'), String(safeNumber(repository.stars)));
    const forks = document.createElement('span');
    forks.append(createIcon('git-fork'), String(safeNumber(repository.forks)));
    meta.append(stars, forks);
    if (repository.updatedAt) {
        const updated = new Date(repository.updatedAt);
        if (!Number.isNaN(updated.getTime())) {
            const time = document.createElement('time');
            time.dateTime = updated.toISOString();
            time.textContent = new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(updated);
            meta.append(time);
        }
    }

    article.append(title, description, meta);
    return article;
}

/** @param {GitHubProfileData} payload */
function renderPinned(payload) {
    const container = document.getElementById('github-pinned');
    if (!container) return;
    container.replaceChildren();
    const pinnedSource = Array.isArray(payload.pinned) && payload.pinned.length ? payload.pinned : (payload.repositories ?? []);
    const pinned = publicRepositories(pinnedSource);
    if (!pinned.length) {
        const empty = document.createElement('p');
        empty.className = 'github-empty';
        empty.textContent = text('No public repositories available.', 'لا توجد مستودعات عامة متاحة.');
        container.append(empty);
        return;
    }
    pinned.slice(0, 6).forEach((repository) => container.append(repoCard(repository)));
}

/** @param {ContributionDay} day @param {number} max */
function getLevel(day, max) {
    if (Number.isFinite(day.level)) return Math.max(0, Math.min(4, day.level));
    if (!day.count || !max) return 0;
    return Math.max(1, Math.min(4, Math.ceil((day.count / max) * 4)));
}

function bindYearTabs() {
    const tabs = document.getElementById('github-year-tabs');
    if (!tabs || tabs.dataset.bound === 'true') return;
    tabs.dataset.bound = 'true';
    tabs.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest('button[data-year]') : null;
        if (!(button instanceof HTMLButtonElement) || !data) return;
        const year = Number(button.dataset.year);
        if (!Number.isFinite(year) || year === selectedYear) return;
        selectedYear = year;
        renderYears(data);
        renderCalendar(data);
        renderOverview(data);
        renderMetrics(data);
        window.portfolioIcons?.create();
    }, { signal: pageController.signal });
}

/** @param {GitHubProfileData} payload */
function renderYears(payload) {
    const tabs = document.getElementById('github-year-tabs');
    if (!tabs) return;
    tabs.replaceChildren();
    const years = [...(payload.contributions ?? [])].sort((a, b) => b.year - a.year);
    if (!years.length) return;
    if (!selectedYear || !years.some((item) => item.year === selectedYear)) selectedYear = years[0].year;

    years.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.year = String(item.year);
        button.setAttribute('aria-pressed', String(item.year === selectedYear));
        button.textContent = String(item.year);
        tabs.append(button);
    });
}

/** @param {ContributionDay[]} days */
function renderMonths(days) {
    const container = document.getElementById('github-months');
    if (!container) return;
    container.replaceChildren();
    const seen = new Set();
    const firstDate = days.length ? new Date(`${days[0].date}T00:00:00`) : null;
    const baseSunday = firstDate ? new Date(firstDate) : null;
    if (baseSunday) baseSunday.setDate(baseSunday.getDate() - baseSunday.getDay());
    const formatter = new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short' });

    days.forEach((day) => {
        const date = new Date(`${day.date}T00:00:00`);
        if (Number.isNaN(date.getTime())) return;
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        if (seen.has(monthKey) || !baseSunday) return;
        seen.add(monthKey);
        const diffDays = Math.floor((date.getTime() - baseSunday.getTime()) / 86400000);
        const column = Math.max(1, Math.floor(diffDays / 7) + 1);
        const label = document.createElement('span');
        label.style.gridColumn = `${column} / span 4`;
        label.textContent = formatter.format(date);
        container.append(label);
    });
}

/** @param {GitHubProfileData} payload */
function renderCalendar(payload) {
    const yearData = (payload.contributions ?? []).find((item) => item.year === selectedYear);
    const calendar = document.getElementById('github-calendar');
    if (!calendar) return;
    calendar.replaceChildren();
    calendar.removeAttribute('aria-label');

    if (!yearData || !Array.isArray(yearData.days) || !yearData.days.length) {
        const empty = document.createElement('p');
        empty.className = 'github-empty';
        empty.textContent = text('Contribution history is not available from GitHub for this year.', 'سجل المساهمات غير متاح من GitHub لهذه السنة.');
        calendar.append(empty);
        setText('contribution-total', '—');
        setText('contribution-range', yearData ? String(yearData.year) : '');
        document.getElementById('github-months')?.replaceChildren();
        return;
    }

    const days = yearData.days;
    const max = days.reduce((maximum, day) => Math.max(maximum, safeNumber(day.count)), 0);
    calendar.setAttribute('role', 'img');
    calendar.setAttribute('aria-label', text(
        `Contribution calendar for ${yearData.year}, ${formatNumber(safeNumber(yearData.total))} contributions.`,
        `تقويم المساهمات لعام ${yearData.year}، ${formatNumber(safeNumber(yearData.total))} مساهمة.`,
    ));

    const firstDate = new Date(`${days[0].date}T00:00:00`);
    if (!Number.isNaN(firstDate.getTime())) {
        const leading = firstDate.getDay();
        for (let index = 0; index < leading; index += 1) {
            const spacer = document.createElement('span');
            spacer.className = 'github-day';
            spacer.setAttribute('aria-hidden', 'true');
            spacer.style.visibility = 'hidden';
            calendar.append(spacer);
        }
    }

    days.forEach((day) => {
        const cell = document.createElement('span');
        cell.className = 'github-day';
        cell.dataset.level = String(getLevel(day, max));
        cell.setAttribute('aria-hidden', 'true');
        const date = new Date(`${day.date}T00:00:00`);
        if (!Number.isNaN(date.getTime())) {
            const dateLabel = new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium' }).format(date);
            cell.title = document.documentElement.lang === 'ar'
                ? `${day.count} مساهمة في ${dateLabel}`
                : `${day.count} contribution${day.count === 1 ? '' : 's'} on ${dateLabel}`;
        }
        calendar.append(cell);
    });

    renderMonths(days);
    setText('contribution-total', formatNumber(safeNumber(yearData.total)));
    setText('metric-contributions', formatNumber(safeNumber(yearData.total)));
    const from = yearData.from ? new Date(`${yearData.from}T00:00:00`) : null;
    const to = yearData.to ? new Date(`${yearData.to}T00:00:00`) : null;
    const formatter = new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const fromValid = from && !Number.isNaN(from.getTime());
    const toValid = to && !Number.isNaN(to.getTime());
    setText('contribution-range', fromValid && toValid ? `${formatter.format(from)} — ${formatter.format(to)}` : String(yearData.year));
}

/** @param {GitHubProfileData} payload @returns {ActivityStats} */
function activityStats(payload) {
    const yearData = (payload.contributions ?? []).find((item) => item.year === selectedYear);
    return yearData?.stats ?? { commits: 0, pullRequests: 0, issues: 0, reviews: 0 };
}

/** @param {GitHubProfileData} payload */
function renderOverview(payload) {
    const stats = activityStats(payload);
    /** @type {Array<[string, number, string]>} */
    const entries = [
        ['commits', safeNumber(stats.commits), text('Commits', 'Commits')],
        ['pullRequests', safeNumber(stats.pullRequests), text('Pull requests', 'Pull requests')],
        ['issues', safeNumber(stats.issues), text('Issues', 'Issues')],
        ['reviews', safeNumber(stats.reviews), text('Code reviews', 'Code reviews')],
    ];
    const total = Math.max(1, entries.reduce((sum, entry) => sum + entry[1], 0));
    const maximum = Math.max(1, ...entries.map((entry) => entry[1]));
    const container = document.getElementById('github-activity-breakdown');
    if (container) {
        container.replaceChildren();
        entries.forEach(([, value, label]) => {
            const row = document.createElement('div');
            row.className = 'github-activity-row';
            const name = document.createElement('span');
            name.textContent = label;
            const progress = document.createElement('span');
            progress.className = 'github-progress';
            const bar = document.createElement('span');
            bar.style.setProperty('--progress', `${Math.round((value / maximum) * 100)}%`);
            progress.append(bar);
            const percent = document.createElement('strong');
            percent.textContent = `${Math.round((value / total) * 100)}%`;
            row.append(name, progress, percent);
            container.append(row);
        });
    }

    /** @param {number} value */
    const scale = (value) => 20 + (value / maximum) * 80;
    const top = 120 - scale(entries[3][1]);
    const right = 120 + scale(entries[2][1]);
    const bottom = 120 + scale(entries[1][1]);
    const left = 120 - scale(entries[0][1]);
    const polygon = document.getElementById('github-radar-value');
    if (polygon) polygon.setAttribute('points', `120,${top} ${right},120 120,${bottom} ${left},120`);
}

/** @param {GitHubProfileData} payload */
function renderLanguages(payload) {
    const container = document.getElementById('github-languages');
    if (!container) return;
    container.replaceChildren();
    const languages = Array.isArray(payload.languages) ? payload.languages.slice(0, 8) : [];
    const total = Math.max(1, languages.reduce((sum, item) => sum + safeNumber(item.size), 0));
    if (!languages.length) {
        const empty = document.createElement('p');
        empty.className = 'github-empty';
        empty.textContent = text('Language data is not available yet.', 'بيانات اللغات غير متاحة بعد.');
        container.append(empty);
        return;
    }
    languages.forEach((language) => {
        const percent = Math.max(1, Math.round((safeNumber(language.size) / total) * 100));
        const row = document.createElement('div');
        row.className = 'github-language-row';
        const name = document.createElement('span');
        name.textContent = language.name;
        const progress = document.createElement('span');
        progress.className = 'github-progress';
        progress.style.setProperty('--language-color', language.color || '#58a6ff');
        const bar = document.createElement('span');
        bar.style.setProperty('--progress', `${percent}%`);
        progress.append(bar);
        const value = document.createElement('strong');
        value.textContent = `${percent}%`;
        row.append(name, progress, value);
        container.append(row);
    });
}

/** @param {GitHubProfileData} payload @returns {Array<[string, string]>} */
function achievementData(payload) {
    const repositories = publicRepositories(Array.isArray(payload.repositories) ? payload.repositories : []);
    const contributions = Array.isArray(payload.contributions) ? payload.contributions : [];
    const totalContributions = contributions.reduce((sum, item) => sum + safeNumber(item.total), 0);
    const totalStars = repositories.reduce((sum, repo) => sum + safeNumber(repo.stars), 0);
    return [
        ['🧱', text('Public repositories', 'مستودعات عامة')],
        ['⚡', text(`${formatNumber(totalContributions)} tracked contributions`, `${formatNumber(totalContributions)} مساهمة مسجلة`)],
        ['📦', text(`${repositories.length} public repositories tracked`, `${repositories.length} مستودع عام متابع`)],
        ['⭐', text(`${formatNumber(totalStars)} repository stars`, `${formatNumber(totalStars)} نجمة على المستودعات`)],
    ];
}

/** @param {GitHubProfileData} payload */
function renderAchievements(payload) {
    const container = document.getElementById('github-achievements');
    if (!container) return;
    container.replaceChildren();
    achievementData(payload).forEach(([emoji, label]) => {
        const badge = document.createElement('span');
        badge.className = 'github-achievement';
        const icon = document.createElement('i');
        icon.textContent = emoji;
        const textNode = document.createElement('span');
        textNode.textContent = label;
        badge.append(icon, textNode);
        container.append(badge);
    });
}

/** @param {GitHubEvent} event */
function eventDescription(event) {
    const repo = event.repo?.name || 'GitHub';
    const link = safeHttpsUrl(`https://github.com/${repo}`) || 'https://github.com';
    /** @type {Record<string, [string, string]>} */
    const descriptions = {
        PushEvent: [text('Pushed commits to', 'رفع commits إلى'), 'git-commit-horizontal'],
        PullRequestEvent: [text('Updated a pull request in', 'حدّث pull request في'), 'git-pull-request'],
        IssuesEvent: [text('Updated an issue in', 'حدّث issue في'), 'circle-dot'],
        CreateEvent: [text('Created something in', 'أنشأ عنصراً في'), 'plus-circle'],
        ForkEvent: [text('Forked', 'أنشأ fork من'), 'git-fork'],
        WatchEvent: [text('Starred', 'أضاف نجمة إلى'), 'star'],
        ReleaseEvent: [text('Published a release in', 'نشر release في'), 'package'],
    };
    const [prefix, icon] = descriptions[event.type] ?? [text('Activity in', 'نشاط في'), 'activity'];
    return { prefix, repo, link, icon };
}

/** @param {GitHubProfileData} payload */
function renderRecent(payload) {
    const container = document.getElementById('github-recent');
    if (!container) return;
    container.replaceChildren();
    const events = Array.isArray(payload.recentActivity) ? payload.recentActivity.slice(0, 10) : [];
    if (!events.length) {
        const empty = document.createElement('p');
        empty.className = 'github-empty';
        empty.style.padding = '18px';
        empty.textContent = text('No recent public activity is available yet.', 'لا يوجد نشاط عام حديث متاح بعد.');
        container.append(empty);
        return;
    }
    events.forEach((event) => {
        const description = eventDescription(event);
        const row = document.createElement('article');
        row.className = 'github-activity-item';
        const icon = document.createElement('span');
        icon.className = 'github-activity-icon';
        icon.append(createIcon(description.icon));
        const paragraph = document.createElement('p');
        paragraph.append(`${description.prefix} `);
        const link = document.createElement('a');
        link.href = description.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = description.repo;
        paragraph.append(link);
        const time = document.createElement('time');
        if (event.createdAt) {
            const date = new Date(event.createdAt);
            if (!Number.isNaN(date.getTime())) {
                time.dateTime = date.toISOString();
                time.textContent = new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' }).format(date);
            }
        }
        row.append(icon, paragraph, time);
        container.append(row);
    });
}

/** @param {GitHubProfileData} payload */
function renderGenerated(payload) {
    if (!payload.generatedAt) return;
    const date = new Date(payload.generatedAt);
    if (Number.isNaN(date.getTime())) return;
    setText('github-generated', `${text('Updated', 'آخر تحديث')} ${new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium' }).format(date)}`);
}

function renderAll() {
    const payload = data;
    if (!payload) return;
    renderProfile(payload);
    bindYearTabs();
    renderYears(payload);
    renderCalendar(payload);
    renderMetrics(payload);
    renderPinned(payload);
    renderOverview(payload);
    renderLanguages(payload);
    renderAchievements(payload);
    renderRecent(payload);
    renderGenerated(payload);
    window.portfolioIcons?.create();
}

/** @returns {Promise<GitHubProfileData>} */
async function loadData() {
    const response = await fetch(DATA_URL, { cache: 'no-store', signal: pageController.signal });
    if (!response.ok) throw new Error(`GitHub profile data request failed: ${response.status}`);
    return /** @type {Promise<GitHubProfileData>} */ (response.json());
}

function showUnavailable() {
    const root = document.querySelector('[data-github-root]');
    root?.setAttribute('aria-busy', 'false');
    if (document.querySelector('.github-error')) return;
    const message = document.createElement('p');
    message.className = 'github-error';
    message.textContent = text('GitHub data is temporarily unavailable. The rest of the portfolio is still available.', 'بيانات GitHub غير متاحة مؤقتاً، ويمكنك متابعة باقي البورتفوليو بشكل طبيعي.');
    document.querySelector('.github-content')?.prepend(message);
}

async function initialize() {
    if (initialized) return;
    initialized = true;
    utilitiesCleanup = initUtilities();
    try {
        data = await loadData();
        selectedYear = data?.contributions?.[0]?.year ?? null;
        renderAll();
        document.querySelector('[data-github-root]')?.setAttribute('aria-busy', 'false');
    } catch {
        showUnavailable();
    }
}

window.addEventListener('portfolio:language-change', renderAll, { signal: pageController.signal });
window.addEventListener('pagehide', () => {
    utilitiesCleanup();
    pageController.abort();
    initialized = false;
}, { once: true });

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
    initialize();
}
