/* Demo backend: everything in localStorage, with 12 generated students. Same interface as the Firebase backend. */
import { dayKey, weekKey } from '../data/dates';
import { allChapterKeys } from '../data/subjects';

const KEY = 'aplus-demo-v1';
const NAMES = ['Aisha M.', 'Omar K.', 'Layla S.', 'Yusuf A.', 'Mariam H.', 'Zaid R.', 'Noor T.', 'Hamza B.', 'Sara L.', 'Khalid D.', 'Dana W.', 'Ali N.'];
const EMPTY_PROGRESS = () => ({ ch: {}, days: {}, pts: 0 });

export function createDemoBackend(config) {
  let mem = {};
  const read = () => {
    try {
      const v = localStorage.getItem(KEY);
      if (v) return JSON.parse(v) || {};
    } catch {}
    return JSON.parse(JSON.stringify(mem));
  };
  const write = (s) => {
    mem = JSON.parse(JSON.stringify(s));
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {}
  };
  const prog = (s) => (s.progress = s.progress || EMPTY_PROGRESS());

  // Deterministic fake class
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647), seed / 2147483647);
  const fake = (() => {
    const keys = allChapterKeys();
    return NAMES.map((name, i) => {
      const ch = {}, days = {};
      let pts = 0;
      const skill = 0.3 + rnd() * 0.6;
      keys.forEach((k) => {
        if (rnd() < 0.6) {
          const a = 2 + Math.floor(rnd() * 9);
          let g = 0, p = 0, s = 0;
          for (let j = 0; j < a; j++) {
            const r = rnd();
            r < skill ? g++ : r < skill + 0.15 ? p++ : s++;
          }
          ch[k] = { a, g, p, s };
          pts += g * 2 + p;
        }
      });
      const nd = Math.floor(rnd() * 14);
      for (let j = 0; j < nd; j++) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(rnd() * 14));
        days[dayKey(d)] = 1 + Math.floor(rnd() * 8);
      }
      return {
        profile: { uid: 'fake' + i, name, cls: config.classes ? config.classes[i % config.classes.length] : '10A', email: 'fake' + i + '@demo' },
        progress: { ch, days, pts, last: Date.now() - Math.floor(rnd() * 10) * 864e5 },
      };
    });
  })();

  let listener = null;
  return {
    onUser(cb) {
      listener = cb;
      const s = read();
      setTimeout(() => cb(s.user || null), 50);
      return () => {};
    },
    async signIn(asTeacher) {
      const s = read();
      s.user = { uid: 'demo-me', email: asTeacher ? 'teacher@demo' : 'student@demo', displayName: 'Demo' };
      write(s);
      listener && listener(s.user);
    },
    async signOut() {
      const s = read();
      delete s.user;
      write(s);
      listener && listener(null);
    },
    async getProfile() {
      return read().profile || null;
    },
    async saveProfile(user, p) {
      const s = read();
      s.profile = { uid: user.uid, email: user.email, name: p.name, cls: p.cls };
      write(s);
      return s.profile;
    },
    async record(user, profile, r) {
      const s = read();
      const P = prog(s);
      const c = P.ch[r.key] || { a: 0, g: 0, p: 0, s: 0 };
      c.a++;
      c[r.res]++;
      P.ch[r.key] = c;
      P.days[dayKey()] = (P.days[dayKey()] || 0) + 1;
      P.pts += r.res === 'g' ? 2 : r.res === 'p' ? 1 : 0;
      P.pc = (P.pc || 0) + (r.res === 's' ? 0 : [3, 5, 15, 15][r.d] || 0);
      P.last = Date.now();
      write(s);
    },
    async getProgress() {
      return read().progress || {};
    },
    async getBoard() {
      const s = read();
      const me = s.profile
        ? [{ chal: s.chal, uid: 'demo-me', name: s.profile.name, cls: s.profile.cls, pts: (s.progress || {}).pts || 0, wk: { [weekKey()]: (s.progress || {}).pts || 0 } }]
        : [];
      return fake
        .map((f, i) => ({
          lastB: i % 7 === 0 ? { id: i ? 'q100' : 'chm', at: Date.now() - (i + 1) * 36e5 } : undefined,
          uid: f.profile.uid, name: f.profile.name, cls: f.profile.cls, pts: f.progress.pts,
          wk: { [weekKey()]: Math.round(f.progress.pts * 0.3) },
        }))
        .concat(me);
    },
    async getAll() {
      const s = read();
      return fake.concat(s.profile ? [{ profile: s.profile, progress: s.progress || {} }] : []);
    },
    async getStats() {
      return read().stats || { users: 12, guests: 3, solved: 240 };
    },
    async bump(field) {
      const s = read();
      s.stats = s.stats || { users: 12, guests: 3, solved: 240 };
      s.stats[field] = (s.stats[field] || 0) + 1;
      write(s);
    },
    async getNews() {
      const s = read();
      return (
        s.news || {
          items: [
            { id: 'd1', kind: 'task', cls: 'All', text: 'Practise 10 questions from Maths A Chapter 2: Indices, Surds & Standard Form', due: dayKey(new Date(Date.now() + 2 * 864e5)), at: Date.now() - 36e5 },
            { id: 'd2', kind: 'news', cls: 'All', text: 'Mock exams start on 3 November. Use A+ every day to revise!', at: Date.now() - 864e5 },
          ],
        }
      );
    },
    async saveNews(data) {
      const s = read();
      s.news = Object.assign({}, s.news || {}, data);
      write(s);
    },
    async setRelease(tid, v) {
      const s = read();
      s.news = s.news || {};
      s.news.rel = Object.assign({}, s.news.rel, { [tid]: v });
      write(s);
    },
    async setActivity(cls, v) {
      const s = read();
      s.news = s.news || {};
      s.news.acts = Object.assign({}, s.news.acts, { [cls]: v });
      write(s);
    },
    async saveBadge() {},
    async spend() {
      const s = read();
      const P = prog(s);
      P.tokSpent = (P.tokSpent || 0) + 1;
      write(s);
    },
    async logGame() {},
    async tug(cls, score) {
      const s = read();
      s.tug = s.tug || {};
      const k = weekKey() + '|' + cls;
      s.tug[k] = (s.tug[k] || 0) + score;
      write(s);
    },
    async getTug() {
      const s = read();
      const w = weekKey();
      return Object.assign({ [w + '|10B']: 34, [w + '|10C']: 21, [w + '|11A']: 12 }, s.tug || {});
    },
    async usePass() {
      const s = read();
      const P = prog(s);
      P.pcUsed = (P.pcUsed || 0) + 15;
      write(s);
    },
    async getLikes() {
      return Object.assign({}, read().likes || {});
    },
    async like(uid, fk, on) {
      const s = read();
      s.likes = s.likes || {};
      s.likes[fk] = Math.max(0, (s.likes[fk] || 0) + (on ? 1 : -1));
      const P = prog(s);
      P.liked = P.liked || {};
      P.liked[fk] = on;
      write(s);
    },
    async challenge(user, c) {
      const s = read();
      s.chal = c;
      write(s);
    },
    async getReviews() {
      const s = read();
      const now = Date.now();
      const seedRows = [
        ['demo1', 'Aisha', 5, 'Really easy to use and the mark schemes help a lot.', 3],
        ['demo2', 'Omar', 4, 'Good questions. I like the topics list.', 5],
        ['demo3', 'Layla', 5, 'The explanations after a 0 are great!', 1],
      ].map((x) => ({ id: x[0], first: x[1], stars: x[2], text: x[3], at: now - x[4] * 864e5 }));
      return seedRows.concat(Object.entries(s.reviews || {}).map(([id, v]) => ({ id, ...v })));
    },
    async saveReview(uid, r) {
      const s = read();
      s.reviews = s.reviews || {};
      s.reviews[uid] = { ...(s.reviews[uid] || {}), ...r };
      write(s);
    },
    async hideReview(id, hidden) {
      const s = read();
      s.reviews = s.reviews || {};
      if (s.reviews[id]) {
        s.reviews[id].hidden = hidden;
        write(s);
      }
    },
    async giveTokens(uid, n) {
      const s = read();
      s.gifts = s.gifts || {};
      s.gifts[uid] = (s.gifts[uid] || 0) + n;
      if (s.profile && s.profile.uid === uid) {
        const P = prog(s);
        P.tokGift = (P.tokGift || 0) + n;
      }
      write(s);
    },
    countVisit() {},
  };
}
