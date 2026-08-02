import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'dist');
const publicFiles = [
    'index.html',
    'styles.css',
    'favicon.svg',
    'site.webmanifest',
    'robots.txt',
    'sitemap.xml',
];
const browserModules = [
    'app.js',
    'background.js',
    'boot.js',
    'hero.js',
    'interactions.js',
    'intro.js',
    'motion.js',
    'navigation.js',
    'scroll.js',
    'utils.js',
];

await rm(outputDirectory, { recursive: true, force: true });
await Promise.all([
    mkdir(outputDirectory, { recursive: true }),
    mkdir(path.join(outputDirectory, 'js'), { recursive: true }),
    mkdir(path.join(outputDirectory, 'vendor'), { recursive: true }),
]);

await Promise.all([
    ...publicFiles.map((file) => cp(path.join(root, file), path.join(outputDirectory, file))),
    ...browserModules.map((file) => cp(path.join(root, 'js', file), path.join(outputDirectory, 'js', file))),
    cp(path.join(root, 'assets', 'optimized'), path.join(outputDirectory, 'assets', 'optimized'), { recursive: true }),
    cp(path.join(root, 'node_modules', 'gsap', 'dist', 'gsap.min.js'), path.join(outputDirectory, 'vendor', 'gsap.min.js')),
    cp(path.join(root, 'node_modules', 'gsap', 'dist', 'ScrollTrigger.min.js'), path.join(outputDirectory, 'vendor', 'ScrollTrigger.min.js')),
    cp(path.join(root, 'vendor', 'lucide-icons.min.js'), path.join(outputDirectory, 'vendor', 'lucide-icons.min.js')),
]);
