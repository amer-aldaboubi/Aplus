import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

/*
  The live site is the repository root: question image packs (packs/*.bin),
  the data files (pack-index.js, help.js, qhelp.js, qorder.js, qidea.js,
  calc.js, config.js, ws-data.js, ...) and the standalone pages
  (worksheets.html, exam.html, ...) all stay there, unchanged.

  This app lives in app/ and is built into app/dist/. At deploy time the
  GitHub Actions workflow copies the root assets next to the built files,
  so in production everything is served from one origin with relative URLs.

  In development this small middleware serves those root files (with HTTP
  Range support for the packs, exactly like GitHub Pages does) so the app
  behaves identically to production.
*/
const ROOT = path.resolve(import.meta.dirname, '..');
const MIME = {
  '.js': 'text/javascript', '.html': 'text/html; charset=utf-8', '.bin': 'application/octet-stream',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.css': 'text/css',
  '.webmanifest': 'application/manifest+json', '.json': 'application/json',
};

function serveRepoRoot() {
  return {
    name: 'aplus-serve-repo-root',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '/').split('?')[0]);
        if (url === '/' || url.startsWith('/@') || url.startsWith('/src/') || url.startsWith('/node_modules/')) return next();
        // `APLUS_DEMO=1 npm run dev` runs the app against the localStorage demo backend (no Google sign-in needed).
        if (url === '/config.js' && process.env.APLUS_DEMO === '1') {
          res.setHeader('Content-Type', 'text/javascript');
          res.end(fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8').replace("mode: 'firebase'", "mode: 'demo'"));
          return;
        }
        const file = path.join(ROOT, url);
        if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return next();
        const ext = path.extname(file).toLowerCase();
        const size = fs.statSync(file).size;
        res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
        res.setHeader('Accept-Ranges', 'bytes');
        const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
        if (range) {
          const start = +range[1];
          const end = range[2] ? Math.min(+range[2], size - 1) : size - 1;
          res.statusCode = 206;
          res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
          res.setHeader('Content-Length', end - start + 1);
          fs.createReadStream(file, { start, end }).pipe(res);
        } else {
          res.setHeader('Content-Length', size);
          fs.createReadStream(file).pipe(res);
        }
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), serveRepoRoot()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@firebase') || id.includes('node_modules/firebase')) return 'firebase';
          if (id.includes('node_modules/react')) return 'react';
        },
      },
    },
  },
});
