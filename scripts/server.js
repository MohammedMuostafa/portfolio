import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const pagesBasePath = '/portfolio';
const contentTypes = new Map([
    ['.css', 'text/css; charset=utf-8'],
    ['.html', 'text/html; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.svg', 'image/svg+xml'],
    ['.webmanifest', 'application/manifest+json'],
    ['.webp', 'image/webp'],
    ['.xml', 'application/xml; charset=utf-8'],
]);

const server = createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? '/', 'http://localhost');
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === pagesBasePath) pathname = '/';
    else if (pathname.startsWith(`${pagesBasePath}/`)) pathname = pathname.slice(pagesBasePath.length);

    const relativePath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    const filePath = path.resolve(root, `.${relativePath}`);

    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403).end('Forbidden');
        return;
    }

    try {
        const file = await stat(filePath);
        if (!file.isFile()) throw new Error('Not a file');

        response.writeHead(200, {
            'Content-Type': contentTypes.get(path.extname(filePath)) ?? 'application/octet-stream',
            'Content-Length': file.size,
            'Cache-Control': filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=3600',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        });
        createReadStream(filePath).pipe(response);
    } catch {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    }
});

server.listen(port);

export { server };
