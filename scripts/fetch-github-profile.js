import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const USERNAME = process.env.GITHUB_PROFILE_USERNAME || 'MohammedMuostafa';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'data', 'github-profile.json');
const currentYear = new Date().getUTCFullYear();
const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

/** @param {string} url @param {RequestInit} [options] @returns {Promise<any>} */
async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`${url} returned ${response.status}`);
    return response.json();
}

/** @param {number} year */
function dateRange(year) {
    const today = new Date();
    const from = `${year}-01-01T00:00:00Z`;
    const end = year === currentYear
        ? today.toISOString()
        : `${year}-12-31T23:59:59Z`;
    return { from, to: end };
}

function buildQuery() {
    const collections = years.map((year) => {
        const { from, to } = dateRange(year);
        return `
          y${year}: contributionsCollection(from: "${from}", to: "${to}") {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays { contributionCount date weekday }
              }
            }
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalPullRequestReviewContributions
          }`;
    }).join('\n');

    return `
      query PortfolioGitHubProfile {
        user(login: "${USERNAME}") {
          login
          name
          bio
          avatarUrl(size: 320)
          url
          location
          company
          websiteUrl
          createdAt
          followers { totalCount }
          following { totalCount }
          repositories(privacy: PUBLIC, ownerAffiliations: OWNER, first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
            totalCount
            nodes {
              name
              description
              url
              homepageUrl
              stargazerCount
              forkCount
              isFork
              isArchived
              updatedAt
              primaryLanguage { name color }
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges { size node { name color } }
              }
            }
          }
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name description url homepageUrl stargazerCount forkCount
                primaryLanguage { name color }
              }
            }
          }
          organizations(first: 12) {
            nodes { login name url avatarUrl(size: 40) }
          }
          ${collections}
        }
      }`;
}

/** @param {number} count @param {number} max */
function contributionLevel(count, max) {
    if (!count || !max) return 0;
    return Math.max(1, Math.min(4, Math.ceil((count / max) * 4)));
}

/** @param {any} repository */
function normalizeRepository(repository) {
    return {
        name: repository.name,
        description: repository.description,
        url: repository.url,
        homepageUrl: repository.homepageUrl,
        stars: repository.stargazerCount,
        forks: repository.forkCount,
        language: repository.primaryLanguage,
        updatedAt: repository.updatedAt,
        isFork: Boolean(repository.isFork),
        isArchived: Boolean(repository.isArchived),
    };
}

/** @param {any[]} repositories */
function aggregateLanguages(repositories) {
    /** @type {Map<string, {name:string,color?:string,size:number}>} */
    const totals = new Map();
    repositories.forEach((repository) => {
        const edges = /** @type {any[]} */ (repository.languages?.edges ?? []);
        edges.forEach((edge) => {
            if (!edge?.node?.name || !edge.size) return;
            const existing = totals.get(edge.node.name) || { name: edge.node.name, color: edge.node.color, size: 0 };
            existing.size += edge.size;
            if (!existing.color && edge.node.color) existing.color = edge.node.color;
            totals.set(edge.node.name, existing);
        });
    });
    return [...totals.values()].sort((a, b) => b.size - a.size).slice(0, 10);
}

/** @returns {Promise<any[]>} */
async function fetchRecentActivity() {
    /** @type {Record<string, string>} */
    const headers = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'MOHMOS-Portfolio',
    };
    if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
    try {
        const events = /** @type {any[]} */ (await fetchJson(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`, { headers }));
        return events.slice(0, 16).map((event) => ({
            id: event.id,
            type: event.type,
            createdAt: event.created_at,
            repo: event.repo ? { name: event.repo.name } : null,
        }));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[github:data] Recent activity unavailable: ${message}`);
        return [];
    }
}

/** @returns {Promise<any | null>} */
async function buildData() {
    if (!TOKEN) {
        try {
            JSON.parse(await readFile(outputPath, 'utf8'));
            console.warn('[github:data] No GITHUB_TOKEN found. Keeping committed fallback data.');
            return null;
        } catch {
            throw new Error('GITHUB_TOKEN is missing and no fallback data/github-profile.json exists.');
        }
    }

    const response = await fetchJson('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'MOHMOS-Portfolio',
        },
        body: JSON.stringify({ query: buildQuery() }),
    });

    const errors = /** @type {any[]} */ (response.errors ?? []);
    if (errors.length) throw new Error(errors.map((item) => item.message).join('; '));
    const user = response.data?.user;
    if (!user) throw new Error(`GitHub user ${USERNAME} was not found.`);

    const repositories = (user.repositories?.nodes ?? []).filter(Boolean);
    const contributions = years.map((year) => {
        const collection = user[`y${year}`];
        const weeks = /** @type {any[]} */ (collection?.contributionCalendar?.weeks ?? []);
        const days = /** @type {any[]} */ (weeks.flatMap((week) => week.contributionDays));
        const max = days.reduce((value, day) => Math.max(value, day.contributionCount), 0);
        const range = dateRange(year);
        return {
            year,
            total: collection?.contributionCalendar?.totalContributions ?? 0,
            from: range.from.slice(0, 10),
            to: range.to.slice(0, 10),
            days: days.map((day) => ({
                date: day.date,
                count: day.contributionCount,
                weekday: day.weekday,
                level: contributionLevel(day.contributionCount, max),
            })),
            stats: {
                commits: collection?.totalCommitContributions ?? 0,
                pullRequests: collection?.totalPullRequestContributions ?? 0,
                issues: collection?.totalIssueContributions ?? 0,
                reviews: collection?.totalPullRequestReviewContributions ?? 0,
            },
        };
    });

    return {
        generatedAt: new Date().toISOString(),
        profile: {
            login: user.login,
            name: user.name || 'MOHMOS',
            bio: 'Protocol Lead • Web3 Builder • Developer • Discord Server Builder',
            avatarUrl: user.avatarUrl,
            url: user.url,
            location: user.location,
            company: user.company,
            websiteUrl: user.websiteUrl,
            createdAt: user.createdAt,
            followers: user.followers?.totalCount ?? 0,
            following: user.following?.totalCount ?? 0,
            publicRepos: user.repositories?.totalCount ?? repositories.length,
        },
        organizations: (user.organizations?.nodes ?? []).filter(Boolean),
        pinned: /** @type {any[]} */ (user.pinnedItems?.nodes ?? []).filter(Boolean).map(normalizeRepository),
        repositories: repositories.map(normalizeRepository),
        languages: aggregateLanguages(repositories),
        contributions,
        recentActivity: await fetchRecentActivity(),
    };
}

const data = await buildData();
if (data) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log(`[github:data] Wrote ${path.relative(root, outputPath)} for ${USERNAME}.`);
}
