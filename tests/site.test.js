import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'index.html'), 'utf8');

test('page has one main heading and complete social metadata', () => {
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, /<link\s+rel="canonical"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card"/);
    assert.match(html, /application\/ld\+json/);
});

test('page avoids fragile inline handlers and unsafe external targets', () => {
    assert.doesNotMatch(html, /\sonclick=/);
    const externalTargets = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
    assert.ok(externalTargets.length > 0);
    externalTargets.forEach((anchor) => assert.match(anchor, /rel="noopener noreferrer"/));
});

test('all referenced local assets exist', async () => {
    const references = [...html.matchAll(/(?:href|src)="((?!https?:|#|mailto:)[^"]+)"/g)]
        .map((match) => match[1])
        .filter((reference) => !reference.startsWith('data:'));

    await Promise.all(references.map((reference) => access(path.join(root, reference))));
});
