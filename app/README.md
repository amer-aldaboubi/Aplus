# A+ Maths Hub — app source

The student hub is a Vite + React app in this folder. Everything else at the repository
root (question packs in `packs/`, the data files, the standalone pages) is shared with it
and is copied next to the built app at deploy time by `.github/workflows/deploy.yml`.

```
npm install
npm run dev              # http://localhost:5173 against the real Firebase project
APLUS_DEMO=1 npm run dev # demo backend in localStorage, no Google sign-in needed
npm run build            # production build in app/dist
```

Layout:

- `src/app/` — session provider (`HubContext`), router, header + tab bar (`Shell`)
- `src/backend/` — Firebase and demo backends; same Firestore documents as before
- `src/data/` — subject catalogue (`pack-index.js`), pack image loader (HTTP Range), lazy loading, task links, analytics
- `src/features/` — home (Bento, noticeboard, class activity, reviews), practice, progress, teacher, search, auth
- `src/rewards/` — levels, badges, medals, popups, certificates
- `src/games/` — Game Zone and the five mini-games
- `src/ui/` — icons and small primitives; `src/index.css` holds the design tokens
