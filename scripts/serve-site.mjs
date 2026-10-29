import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, realpath } from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages as publicPages, isPublicAsset } from './public-files.mjs';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// All routes are built together. Never serve raw source fragments as independent pages.
const root = join(site, 'dist');
const port = Number(process.env.GYMMANAGER_SITE_PORT || 8765);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4', '.vtt': 'text/vtt; charset=utf-8' };
const pages = new Set(publicPages);
const inside = (path) => { const rel = relative(root, path); return rel !== '..' && !rel.startsWith('..\\') && !rel.startsWith('../') && !isAbsolute(rel); };

createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname);
    if (publicPages.includes(pathname.slice(1) + '/index.html')) {
      response.writeHead(308, { Location: pathname + '/', 'Cache-Control': 'no-store' }).end();
      return;
    }
    const requested = pathname.endsWith('/') ? pathname.slice(1) + 'index.html' : pathname.replace(/^\/+/, '');
    // Never expose raw uploads, local handoff, scripts, or QA files over HTTP.
    if (!pages.has(requested) && !isPublicAsset(requested)) throw new Error('Not public');
    const candidate = await realpath(resolve(root, requested));
    if (!inside(candidate) || !types[extname(candidate)]) throw new Error('Not public');
    const info = await stat(candidate);
    if (!info.isFile()) throw new Error('Not a file');
    const headers = { 'Content-Type': types[extname(candidate)], 'Content-Length': info.size, 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff' };
    let start = 0;
    let end = info.size - 1;
    let status = 200;
    if (request.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (match && (match[1] || match[2])) {
        start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
        end = match[1] && match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1;
      } else start = -1;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= info.size) {
        response.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end();
        return;
      }
      status = 206;
      headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
      headers['Content-Length'] = end - start + 1;
    }
    response.writeHead(status, headers);
    if (request.method === 'HEAD') return response.end();
    const stream = createReadStream(candidate, { start, end });
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  } catch {
    if (!response.headersSent) response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`GymManager Website: http://127.0.0.1:${port}/ (${root})`);
});
