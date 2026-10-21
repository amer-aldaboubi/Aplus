/* Turns a Firestore progress document into the numbers shown on the progress and teacher pages. */
import { dayKey } from './dates';
import { chapterLabel, allChapterKeys } from './subjects';

export function analyse(progress) {
  const p = progress || {};
  const ch = p.ch || {};
  const rows = [];
  let total = 0, got = 0, partly = 0, stuck = 0;
  Object.keys(ch).forEach((key) => {
    const c = ch[key];
    const a = c.a || 0, g = c.g || 0, pt = c.p || 0, s = c.s || 0;
    total += a; got += g; partly += pt; stuck += s;
    rows.push({ key, label: chapterLabel(key), a, g, p: pt, s, score: a ? (g + 0.5 * pt) / a : 0 });
  });

  const days = p.days || {};
  const days14 = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days14.push({ d: dayKey(d), n: days[dayKey(d)] || 0 });
  }

  let streak = 0;
  const cursor = new Date();
  if (!days[dayKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  while (days[dayKey(cursor)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const needs = rows.filter((r) => r.a >= 3 && r.score < 0.6).sort((x, y) => x.score - y.score).slice(0, 4);
  const tried = new Set(rows.map((r) => r.key));
  const untried = allChapterKeys().filter((k) => !tried.has(k)).slice(0, 3).map((key) => ({ key, label: chapterLabel(key) }));

  return {
    total, got, partly, stuck,
    acc: total ? Math.round(((got + 0.5 * partly) / total) * 100) : 0,
    rows: rows.sort((x, y) => y.a - x.a),
    needs, untried, days14, streak,
    pts: p.pts || 0,
    last: p.last || 0,
  };
}

export function scoreColour(frac) {
  return frac >= 0.75 ? '#16a34a' : frac >= 0.5 ? '#d97706' : '#dc2626';
}
