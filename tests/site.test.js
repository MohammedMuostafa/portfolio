import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** @param {string} file */
const readSource = (file) => readFile(path.join(root, file), 'utf8');
const [html, variablesCss, layoutCss, componentCss, animationCss, stylesCss, bootJs, navigationJs, scrollJs, backgroundJs, heroJs, introJs, interactionsJs, manifestText, buildScript, tailwindConfig] = await Promise.all([
    readSource('index.html'),
    readSource('css/variables.css'),
    readSource('css/layout.css'),
    readSource('css/components.css'),
    readSource('css/animations.css'),
    readSource('styles.css'),
    readSource('js/boot.js'),
    readSource('js/navigation.js'),
    readSource('js/scroll.js'),
    readSource('js/background.js'),
    readSource('js/hero.js'),
    readSource('js/intro.js'),
    readSource('js/interactions.js'),
    readSource('site.webmanifest'),
    readSource('scripts/build-site.js'),
    readSource('tailwind.config.cjs'),
]);
const allRuntimeSource = [html, layoutCss, componentCss, animationCss, scrollJs].join('\n');
const decodedHtml = html.replaceAll('&amp;', '&');

test('page follows the CV section order and ends with a normal footer', () => {
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    const sectionIds = ['home', 'about', 'current-project', 'experience', 'education', 'skills', 'details', 'connect'];
    const positions = sectionIds.map((id) => html.indexOf(`id="${id}"`));
    assert.ok(positions.every((position) => position >= 0));
    assert.deepEqual([...positions].sort((first, second) => first - second), positions);
    assert.ok(html.indexOf('<footer') > html.indexOf('id="connect"'));
});

test('identity, current project, experience, education, and personal details match the CV', () => {
    const requiredFacts = [
        'Protocol Lead | LitVM Ecosystem',
        'Developer',
        'Web3 Builder',
        'Discord Server Builder',
        'Currently serving as Protocol Lead at Lit Clinic.',
        'Protocol Lead',
        'Core Contributor',
        'Contributor & Community Leader',
        '2026 – Present',
        '2022 – 2025',
        "Bachelor's Degree in CS",
        '20 Years Old',
        'Egyptian',
        'A2–B1',
    ];
    requiredFacts.forEach((fact) => assert.ok(decodedHtml.includes(fact), `Missing CV fact: ${fact}`));
});

test('stale claims, old dates, and the former ending copy are absent', () => {
    const prohibited = [
        ['Co', 'Founder'].join('-'),
        ['Product', 'Lead'].join(' '),
        ['Full', 'Stack Developer'].join('-'),
        ['Full', 'Stack'].join(' '),
        ['Senior', 'Developer'].join(' '),
        ['Blockchain', 'Expert'].join(' '),
        ['Web3 Community', 'Support'].join(' '),
        ['Content', 'Creator'].join(' '),
        ["Let's build", 'the next signal'].join(' '),
        ['Let’s build', 'the next signal'].join(' '),
        ['2025', '2026'].join(' — '),
        ['2025', '2026'].join(' – '),
    ];
    prohibited.forEach((claim) => assert.ok(!allRuntimeSource.toLowerCase().includes(claim.toLowerCase()), `Found stale claim: ${claim}`));
});

test('English, Arabic, metadata, and RTL support are present and synchronized', () => {
    assert.match(html, /<html lang="en" dir="ltr">/);
    assert.equal((html.match(/data-lang-en=/g) ?? []).length, (html.match(/data-lang-ar=/g) ?? []).length);
    assert.match(html, /data-lang-ar="قائد البروتوكول"/);
    assert.match(html, /<bdi dir="ltr">LitVM Ecosystem<\/bdi>/);
    assert.match(html, /data-lang-ar="درجة البكالوريوس في علوم الحاسب"/);
    assert.match(html, /<span class="sr-only">MOHMOS<\/span>/);
    assert.doesNotMatch(html, /data-lang-ar="[^"]*موهموس/i);
    assert.match(html, /data-meta-ar=/);
    assert.match(html, /data-aria-ar=/);
    assert.match(html, /data-alt-ar=/);
});

test('metadata and structured data use only the verified identity and profiles', () => {
    assert.match(html, /<link rel="canonical" href="https:\/\/mohammedmuostafa\.github\.io\/portfolio\/"/);
    const structuredDataMatch = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
    assert.ok(structuredDataMatch);
    const structuredData = JSON.parse(structuredDataMatch[1]);
    assert.equal(structuredData.name, 'MOHMOS');
    assert.equal(structuredData.jobTitle, 'Protocol Lead | LitVM Ecosystem');
    assert.deepEqual(structuredData.sameAs, [
        'https://linktr.ee/moh.mos',
        'https://github.com/MohammedMuostafa',
        'https://x.com/mohmos_base',
        'https://t.me/MOHMOS_base',
        'https://www.youtube.com/@MOH-MOS',
        'https://kick.com/moh-mos',
    ]);
});

test('social links and external-link protections match the CV', () => {
    const requiredProfiles = [
        'https://litclinic.xyz',
        'https://linktr.ee/moh.mos',
        'https://github.com/MohammedMuostafa',
        'https://x.com/mohmos_base',
        'https://t.me/MOHMOS_base',
        'https://www.youtube.com/@MOH-MOS',
        'https://kick.com/moh-mos',
    ];
    requiredProfiles.forEach((profile) => assert.ok(html.includes(profile), `Missing profile: ${profile}`));
    assert.ok(!html.includes(['https://x.com/', 'mohmos', '"'].join('')));
    const externalTargets = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
    assert.ok(externalTargets.length > 0);
    externalTargets.forEach((anchor) => assert.match(anchor, /rel="noopener noreferrer"/));
    ['github', 'x', 'telegram', 'youtube', 'kick', 'discord', 'linktree'].forEach((brand) => {
        assert.match(html, new RegExp(`id="brand-${brand}"`));
    });
    assert.match(html, /id="brand-kick"[^>]*viewBox="0 0 24 24"/);
    assert.match(html, /M1\.333 0h8v5\.333H12/);
    assert.doesNotMatch(html, /data-lucide="(?:video|at-sign|send|play|code-2)"/);
});

test('background and motion preserve native scrolling and reduced motion', () => {
    assert.match(html, /<canvas id="network-canvas"/);
    assert.match(backgroundJs, /prefers-reduced-motion: reduce/);
    assert.match(backgroundJs, /document\.hidden/);
    assert.match(backgroundJs, /Math\.min\(window\.devicePixelRatio \|\| 1, 1\.5\)/);
    assert.match(backgroundJs, /portfolio:section-change/);
    assert.match(backgroundJs, /targetScrollVelocity/);
    assert.doesNotMatch(scrollJs, /preventDefault\(\)/);
    assert.doesNotMatch(scrollJs, /scrollTo\(/);
    assert.doesNotMatch(scrollJs, /\bpin\s*:/);
    assert.doesNotMatch(allRuntimeSource, /(?:300|400|420|440)s?vh/);
    assert.match(animationCss, /prefers-reduced-motion: reduce/);
    assert.match(introJs, /intro-enabled/);
    assert.match(introJs, /portfolio:intro-timeout/);
    assert.match(bootJs, /portfolio:intro-timeout/);
    assert.match(heroJs, /Discord Server Builder/);
    assert.match(heroJs, /rotationY/);
    assert.match(heroJs, /portfolio:before-language-change/);
    assert.match(heroJs, /clearProps: 'transform,opacity,visibility,filter'/);
    assert.match(interactionsJs, /--avatar-rx/);
    assert.match(interactionsJs, /--card-rx/);
    assert.match(componentCss, /\.text-reveal-unit\s*{[^}]*display: inline-block/s);
    assert.match(componentCss, /\.text-reveal-word\s*{[^}]*white-space: nowrap/s);
    assert.match(componentCss, /transform: perspective\(1000px\)[^;]*--card-rx[^;]*--card-ry/);
    assert.match(componentCss, /\.timeline-progress\s*{[^}]*transform: scaleY\(0\)/s);
    assert.match(layoutCss, /\.site-header\.is-hidden:focus-within/);
    assert.match(layoutCss, /\.skip-link\s*{[^}]*background: var\(--accent-action\)/s);
    assert.match(navigationJs, /addEventListener\('focusin'/);
    assert.match(tailwindConfig, /preflight: false/);
    assert.match(stylesCss, /body\s*{[^}]*line-height: 1\.65/s);
});

test('primary action colors meet WCAG AA contrast against white text', () => {
    /** @param {string} hex */
    const contrastWithWhite = (hex) => {
        const channels = hex.match(/[a-f\d]{2}/gi)?.map((channel) => Number.parseInt(channel, 16) / 255) ?? [];
        const [red, green, blue] = channels.map((channel) => channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4);
        const luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
        return 1.05 / (luminance + 0.05);
    };
    const colors = ['--accent-action', '--accent-action-hover'].map((property) => {
        const match = variablesCss.match(new RegExp(`${property}:\\s*(#[a-f\\d]{6})`, 'i'));
        assert.ok(match, `Missing ${property}`);
        return match[1];
    });
    colors.forEach((color) => assert.ok(contrastWithWhite(color) >= 4.5, `${color} does not meet 4.5:1 contrast`));
});

test('all local assets exist and deployable URLs stay relative for Pages', async () => {
    const references = [...html.matchAll(/(?:href|src)="((?!https?:|#|mailto:)[^"]+)"/g)]
        .map((match) => match[1])
        .filter((reference) => !reference.startsWith('data:') && !reference.startsWith('vendor/'));
    await Promise.all(references.map((reference) => access(path.join(root, reference))));
    references.forEach((reference) => assert.ok(!reference.startsWith('/'), `Root-relative asset can break Pages: ${reference}`));

    const manifest = JSON.parse(manifestText);
    assert.equal(manifest.start_url, '/portfolio/');
    assert.equal(manifest.scope, '/portfolio/');
    assert.match(buildScript, /background\.js/);
    ['hero.js', 'interactions.js', 'intro.js', 'motion.js'].forEach((module) => assert.ok(buildScript.includes(module)));
    assert.doesNotMatch(buildScript, /cp\(path\.join\(root, 'js'\).*recursive/);
});
