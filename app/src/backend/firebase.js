/*
  Firebase backend. Every document path and field name is identical to the previous app,
  so existing student data keeps working:

    profiles/{uid}   { uid, email, name, cls, joined }
    progress/{uid}   { ch:{"m:01":{a,g,p,s}}, qs:{...}, days:{YYYY-MM-DD:n}, pts, pc, pcUsed,
                       tokSpent, tokGift, liked:{fk:bool}, gm:{game:{n,s}}, last }
    board/{uid}      { uid, name, cls, pts, wk:{YYYY-Www:n}, lastB:{id,at}, chal:{k,d,ck,at} }
    news/current     { items:[...], rel:{tid:ts}, acts:{cls:{keys,groups,asg,at}}, updated }
    stats/global     { users, guests, solved, visits }
    stats/tug        { "YYYY-Www|10A": n }
    stats/likes      { fk: n }
    reviews/{uid}    { stars, text, first, at, hidden }
*/
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { getFirestore, doc, collection, getDoc, getDocs, setDoc, increment } from 'firebase/firestore';
import { dayKey, weekKey } from '../data/dates';

const PASS_CREDIT = [3, 5, 15, 15]; // play-pass credit by difficulty (easy, medium, hard, challenge)

export function createFirebaseBackend(config) {
  const app = initializeApp(config.firebase);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const domain = (config.domain || '').toLowerCase().replace(/^@/, '');
  const allowed = (email) => !domain || (email || '').toLowerCase().endsWith('@' + domain);
  const d = (c, id) => doc(db, c, id);
  const merge = (ref, data) => setDoc(ref, data, { merge: true });

  return {
    onUser(onChange, onError) {
      return onAuthStateChanged(auth, (u) => {
        if (u && !allowed(u.email)) {
          fbSignOut(auth);
          onError('Please sign in with your school account (@' + domain + ').');
          return;
        }
        onChange(u ? { uid: u.uid, email: u.email, displayName: u.displayName } : null);
      });
    },
    async signIn() {
      const provider = new GoogleAuthProvider();
      if (domain) provider.setCustomParameters({ hd: domain, prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    },
    signOut() {
      return fbSignOut(auth);
    },

    async getProfile(uid) {
      const s = await getDoc(d('profiles', uid));
      return s.exists() ? s.data() : null;
    },
    async saveProfile(user, p) {
      const data = { uid: user.uid, email: user.email, name: p.name, cls: p.cls, joined: Date.now() };
      await merge(d('profiles', user.uid), data);
      return data;
    },

    /** res: "g" got it, "p" partly, "s" stuck. key: "m:01". qid: question key. dif: 0-3 */
    async record(user, profile, r) {
      const pts = r.res === 'g' ? 2 : r.res === 'p' ? 1 : 0;
      const credit = r.res === 's' ? 0 : PASS_CREDIT[r.d] || 0;
      await merge(d('progress', user.uid), {
        pc: increment(credit),
        uid: user.uid,
        ch: { [r.key]: { a: increment(1), [r.res]: increment(1) } },
        ...(r.qid
          ? { qs: { [String(r.qid).replace(/[.\/\[\]*`~]/g, '_')]: { a: increment(1), w: increment(r.res === 'g' ? 0 : 1), l: r.res, t: Date.now() } } }
          : {}),
        ...(r.rev && r.qid ? { rv: { [String(r.rev).replace(/[.\/\[\]*`~]/g, '_')]: { [String(r.qid).replace(/[.\/\[\]*`~]/g, '_')]: { r: r.res, t: Date.now() } } } } : {}),
        days: { [dayKey()]: increment(1) },
        pts: increment(pts),
        last: Date.now(),
      });
      await merge(d('board', user.uid), { uid: user.uid, name: profile.name, cls: profile.cls, pts: increment(pts), wk: { [weekKey()]: increment(pts) } });
    },
    async getProgress(uid) {
      const s = await getDoc(d('progress', uid));
      return s.exists() ? s.data() : {};
    },
    async getBoard() {
      return (await getDocs(collection(db, 'board'))).docs.map((x) => x.data());
    },
    async getAll() {
      const [profiles, progress] = await Promise.all([getDocs(collection(db, 'profiles')), getDocs(collection(db, 'progress'))]);
      const byId = {};
      progress.docs.forEach((x) => (byId[x.id] = x.data()));
      merge(d('stats', 'global'), { users: profiles.docs.length }).catch(() => {});
      return profiles.docs.map((x) => ({ profile: x.data(), progress: byId[x.id] || {} }));
    },

    async getStats() {
      const s = await getDoc(d('stats', 'global'));
      return s.exists() ? s.data() : {};
    },
    async bump(field) {
      await merge(d('stats', 'global'), { [field]: increment(1) });
    },

    async getNews() {
      const s = await getDoc(d('news', 'current'));
      return s.exists() ? s.data() : {};
    },
    async saveNews(data) {
      await merge(d('news', 'current'), data);
    },
    async setRelease(tid, value) {
      await merge(d('news', 'current'), { rel: { [tid]: value } });
    },
    async setActivity(cls, value) {
      await merge(d('news', 'current'), { acts: { [cls]: value } });
    },

    async saveBadge(user, badge) {
      await merge(d('board', user.uid), { lastB: badge });
    },
    async spend(uid) {
      await merge(d('progress', uid), { tokSpent: increment(1) });
    },
    async logGame(uid, game, seconds) {
      await merge(d('progress', uid), { gm: { [game]: { n: increment(1), s: increment(seconds) } } });
    },
    async tug(cls, score) {
      await merge(d('stats', 'tug'), { [weekKey() + '|' + cls]: increment(score) });
    },
    async getTug() {
      const s = await getDoc(d('stats', 'tug'));
      return s.exists() ? s.data() : {};
    },
    async usePass(uid) {
      await merge(d('progress', uid), { pcUsed: increment(15) });
    },
    async getLikes() {
      const s = await getDoc(d('stats', 'likes'));
      return s.exists() ? s.data() : {};
    },
    async like(uid, fk, on) {
      await Promise.all([merge(d('stats', 'likes'), { [fk]: increment(on ? 1 : -1) }), merge(d('progress', uid), { liked: { [fk]: on } })]);
    },
    async challenge(user, c) {
      await merge(d('board', user.uid), { chal: c });
    },
    async giveTokens(uid, n) {
      await merge(d('progress', uid), { tokGift: increment(n) });
    },

    async getReviews() {
      return (await getDocs(collection(db, 'reviews'))).docs.map((x) => ({ id: x.id, ...x.data() }));
    },
    async saveReview(uid, r) {
      await merge(d('reviews', uid), r);
    },
    async hideReview(id, hidden) {
      await merge(d('reviews', id), { hidden });
    },

    /** Anonymous site-visit counter (works before sign-in, like the old inline script). */
    countVisit() {
      const p = config.firebase.projectId, k = config.firebase.apiKey;
      return fetch('https://firestore.googleapis.com/v1/projects/' + p + '/databases/(default)/documents:commit?key=' + k, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ writes: [{ transform: { document: 'projects/' + p + '/databases/(default)/documents/stats/global', fieldTransforms: [{ fieldPath: 'visits', increment: { integerValue: '1' } }] } }] }),
      }).catch(() => {});
    },
  };
}
