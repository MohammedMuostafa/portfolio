import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'assets', 'optimized');

const images = [
    { input: 'avatar.png', output: 'avatar.webp', width: 630, quality: 82 },
    { input: 'bag_guild.png', output: 'bag-guild.webp', width: 112, quality: 80 },
    { input: 'litclinic.png', output: 'litclinic.webp', width: 112, quality: 80 },
    { input: 'onchain.jpg', output: 'onchain.webp', width: 112, quality: 80 },
];

await mkdir(outputDirectory, { recursive: true });

await Promise.all(images.map(({ input, output, width, quality }) => (
    sharp(path.join(root, 'assets', input))
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, smartSubsample: true })
        .toFile(path.join(outputDirectory, output))
)));
