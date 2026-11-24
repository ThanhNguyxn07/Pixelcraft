import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'website/out');
const port = Number(process.env.PORT || 4321);
const host = '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.txt': 'text/x-component; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

http
  .createServer((req, res) => {
    const url = new URL(req.url || '/', `http://${host}`);
    const pathname = decodeURIComponent(url.pathname);
    let filePath = path.join(root, pathname === '/' ? 'index.html' : pathname);
    let status = 200;

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const htmlAlt = `${filePath}.html`;
      const idxAlt = path.join(filePath, 'index.html');
      if (fs.existsSync(htmlAlt)) {
        filePath = htmlAlt;
      } else if (fs.existsSync(idxAlt)) {
        filePath = idxAlt;
      } else {
        filePath = path.join(root, '404.html');
        status = 404;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(status, {
      'content-type': MIME[ext] || 'application/octet-stream',
      'cache-control': ext === '.html' || ext === '.txt' ? 'no-cache' : 'public, max-age=3600',
    });
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(port, host, () => {
    console.log(`ready http://${host}:${port}/`);
  });
