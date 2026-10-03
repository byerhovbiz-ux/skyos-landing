// Local preview only. The site deploys through the Vercel CLI, not from a
// server — this exists so changes can be checked before `vercel --prod`.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PORT = 4321;
const ROOT = import.meta.dirname;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/vnd.microsoft.icon',
  '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  const path = req.url.split('?')[0];
  let rel = normalize(path === '/' ? 'index.html' : path.replace(/^\//, ''));
  // Keep traversal inside the folder — normalize resolves ".." before this.
  if (rel.startsWith('..')) { res.writeHead(403).end('forbidden'); return; }
  // /privacy serves privacy.html, as cleanUrls in vercel.json does.
  if (!extname(rel)) rel += '.html';

  try {
    const body = await readFile(join(ROOT, rel));
    res.writeHead(200, {
      'Content-Type': TYPES[extname(rel)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(PORT, () => console.log(`landing → http://localhost:${PORT}`));
