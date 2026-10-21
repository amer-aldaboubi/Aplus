/* Levels, badges, tokens and play passes. Pure functions over the progress document and class board. */
import { analyse } from '../data/analytics';
import { weekKey } from '../data/dates';

export const TIERS = {
  b: { hi: '#F6C994', mid: '#C98146', lo: '#6E4220', ink: '#4A2A10', r1: '#1B2A4A', r2: '#2E4470' },
  s: { hi: '#FFFFFF', mid: '#B9C4D2', lo: '#5E6A7C', ink: '#243042', r1: '#4FA8C9', r2: '#2F7FA0' },
  g: { hi: '#FFF1B8', mid: '#D4AF37', lo: '#7E620E', ink: '#4A3804', r1: '#B23A48', r2: '#86232F' },
  p: { hi: '#EAFBFF', mid: '#7FD3EE', lo: '#25627F', ink: '#0B3044', r1: '#6C4AB6', r2: '#4B3191' },
  x: { hi: '#9AA1B0', mid: '#646C7D', lo: '#353C4A', ink: '#262B36', r1: '#4A5160', r2: '#363C49' },
};

export const LEVELS = [
  { n: 'Beginner', p: 0, t: 'b', g: { k: 'txt', v: '1' } },
  { n: 'Explorer', p: 20, t: 'b', g: { k: 'txt', v: '2' } },
  { n: 'Problem Solver', p: 60, t: 's', g: { k: 'txt', v: '3' } },
  { n: 'Achiever', p: 150, t: 's', g: { k: 'txt', v: '4' } },
  { n: 'Expert', p: 300, t: 'g', g: { k: 'txt', v: '5' } },
  { n: 'Master', p: 600, t: 'g', g: { k: 'txt', v: '6' } },
  { n: 'Legend', p: 1000, t: 'p', g: { k: 'txt', v: '7' } },
];

export function levelOf(pts) {
  let k = 0;
  LEVELS.forEach((L, j) => {
    if (pts >= L.p) k = j;
  });
  const cur = LEVELS[k], next = LEVELS[k + 1] || null;
  return { idx: k, cur, next, frac: next ? (pts - cur.p) / (next.p - cur.p) : 1 };
}

export function maxStreak(days) {
  const keys = Object.keys(days || {}).filter((k) => days[k] > 0).sort();
  let best = 0, run = 0, prev = null;
  keys.forEach((k) => {
    const d = new Date(k + 'T12:00:00');
    run = prev && Math.round((d - prev) / 864e5) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  });
  return best;
}

export function weeksWon(board, uid, cls) {
  const mine = (board.find((b) => b.uid === uid) || {}).wk || {};
  const cur = weekKey();
  let won = 0;
  Object.keys(mine).forEach((w) => {
    if (w === cur || !mine[w]) return;
    const top = Math.max(0, ...board.filter((b) => b.cls === cls).map((b) => (b.wk || {})[w] || 0));
    if (mine[w] >= top) won++;
  });
  return won;
}

/** Star of last week for a class. */
export function starOfWeek(board, cls) {
  const w = weekKey(new Date(Date.now() - 7 * 864e5));
  const c = board.filter((b) => b.cls === cls && ((b.wk || {})[w] || 0) > 0).sort((x, y) => (y.wk[w] || 0) - (x.wk[w] || 0));
  return c.length ? { name: c[0].name, uid: c[0].uid, v: c[0].wk[w], week: w } : null;
}

export function badgesFor(an, streak, won) {
  const mastered = an.rows.filter((r) => r.a >= 10 && r.score >= 0.8).length;
  const tried = an.rows.length;
  const T = an.total;
  return [
    { id: 'q1', t: 'b', g: { k: 'txt', v: '1' }, n: 'First step', d: 'Solve your first question', ok: T >= 1, pr: [T, 1] },
    { id: 'q10', t: 'b', g: { k: 'txt', v: '10' }, n: 'Ten down', d: 'Solve 10 questions', ok: T >= 10, pr: [T, 10] },
    { id: 'st3', t: 'b', g: { k: 'flame' }, n: 'On fire', d: 'Practise 3 days in a row', ok: streak >= 3, pr: [streak, 3] },
    { id: 'ex5', t: 'b', g: { k: 'compass' }, n: 'Explorer', d: 'Try 5 different chapters', ok: tried >= 5, pr: [tried, 5] },
    { id: 'q50', t: 's', g: { k: 'txt', v: '50' }, n: 'Half century', d: 'Solve 50 questions', ok: T >= 50, pr: [T, 50] },
    { id: 'st7', t: 's', g: { k: 'cal' }, n: 'Full week', d: 'Practise 7 days in a row', ok: streak >= 7, pr: [streak, 7] },
    { id: 'acc', t: 's', g: { k: 'target' }, n: 'Sharpshooter', d: '20+ questions at 80%+', ok: T >= 20 && an.acc >= 80, pr: [T >= 20 ? an.acc : 0, 80] },
    { id: 'chm', t: 's', g: { k: 'book' }, n: 'Chapter master', d: '80%+ on a chapter (10+ q)', ok: mastered >= 1, pr: [mastered, 1] },
    { id: 'q100', t: 'g', g: { k: 'txt', v: '100' }, n: 'Century', d: 'Solve 100 questions', ok: T >= 100, pr: [T, 100] },
    { id: 'sow', t: 'g', g: { k: 'star' }, n: 'Star of the week', d: 'Top of your class for a week', ok: won >= 1, pr: [won, 1] },
    { id: 'q250', t: 'p', g: { k: 'txt', v: '250' }, n: '250 Club', d: 'Solve 250 questions', ok: T >= 250, pr: [T, 250] },
    { id: 'sow3', t: 'p', g: { k: 'stars' }, n: 'Superstar', d: 'Star of the week 3 times', ok: won >= 3, pr: [won, 3] },
  ];
}

export function badgeMeta(id) {
  return badgesFor({ rows: [], total: 0, acc: 0 }, 0, 0).find((b) => b.id === id);
}

/** Everything the rewards UI needs, from a progress document and the class board. */
export function computeRewards(progress, board, uid, cls) {
  const p = progress || {};
  const an = analyse(p);
  const L = levelOf(an.pts);
  const bs = badgesFor(an, maxStreak(p.days), weeksWon(board || [], uid, cls));
  const earned = bs.filter((b) => b.ok);
  const credit = Math.max(0, (p.pc || 0) - (p.pcUsed || 0));
  return {
    an, L, bs, earned,
    tok: Math.max(0, earned.length + L.idx * 2 + (p.tokGift || 0) - (p.tokSpent || 0)),
    pass: Math.floor(credit / 15),
    pcr: credit % 15,
  };
}
