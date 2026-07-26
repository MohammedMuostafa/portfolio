import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'dist');
const files = [
    'index.html',
    'styles.css',
    'favicon.svg',
    'site.webmanifest',
    'robots.txt',
    'sitemap.xml',
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all(files.map((file) => (
    cp(path.join(root, file), path.join(outputDirectory, file))
)));

await Promise.all([
    cp(path.join(root, 'js'), path.join(outputDirectory, 'js'), { recursive: true }),
    cp(path.join(root, 'assets', 'optimized'), path.join(outputDirectory, 'assets', 'optimized'), { recursive: true }),
]);
