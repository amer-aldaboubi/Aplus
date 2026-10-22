/* Subject catalogue and question index, read from window.PACK (pack-index.js at the repo root). */

const PACK = (typeof window !== 'undefined' && window.PACK) || { blobs: [], subjects: {} };

export const SUBJECT_IDS = ['m', 'f', 's', 'p', 'mm', 's2', 'ph', 'cm', 'bi', 'bs'];

export const SUBJECTS = {
  m: { id: 'm', title: 'Maths A (4MA1)', short: 'Maths A', sub: 'Year 10 • Higher tier', blurb: 'Past-paper questions by topic, with mark schemes', accent: '#D4A62A', soft: '#FDF3D6', dark: '#8A6D12', ink: '#1B2A4A', hasPapers: true, board: 'Pearson Edexcel International GCSE', emoji: '∑' },
  f: { id: 'f', title: 'Further Pure Maths (4PM1)', short: 'FPM', sub: 'Year 10 & Year 11', blurb: 'Past-paper questions by topic, Paper 1 & Paper 2', accent: '#2F8FD8', soft: '#E3F1FC', dark: '#1D6F93', ink: '#1B2A4A', hasPapers: true, board: 'Pearson Edexcel International GCSE', emoji: '∫' },
  s: { id: 's', title: 'Statistics 1 (WST01)', short: 'Stats 1', sub: 'Edexcel IAL • Year 12 & 13', blurb: 'Past-paper questions by topic, with mark schemes', accent: '#3FAE5A', soft: '#E3F6E8', dark: '#2F7D45', ink: '#12301a', hasPapers: false, board: 'Edexcel International A Level', emoji: 'σ' },
  p: { id: 'p', title: 'Pure Mathematics 1 (WMA11)', short: 'Pure 1', sub: 'Edexcel IAL • Year 12', blurb: 'Past-paper questions by topic, with mark schemes', accent: '#E05A8C', soft: '#FCE4EE', dark: '#A8456A', ink: '#3a1426', hasPapers: false, board: 'Edexcel International A Level', emoji: 'ƒ' },
  mm: { id: 'mm', title: 'Mechanics 1 (WME01)', short: 'Mechanics 1', sub: 'Edexcel IAL • Year 12 & 13', blurb: 'Past-paper questions by topic, with mark schemes', accent: '#E08A2E', soft: '#FCEBD8', dark: '#9A5B14', ink: '#3a2208', hasPapers: false, board: 'Edexcel International A Level', emoji: '⇀' },
  s2: { id: 's2', title: 'Statistics 2 (WST02)', short: 'Stats 2', sub: 'Edexcel IAL • Year 13', blurb: 'Past-paper questions by topic, with mark schemes', accent: '#2BA89C', soft: '#DCF4F1', dark: '#1F7A71', ink: '#0c2b28', hasPapers: false, board: 'Edexcel International A Level', emoji: 'μ' },
  ph: { id: 'ph', title: 'Physics (4PH1)', short: 'Physics', sub: 'Edexcel IGCSE • Year 10 & Year 11', blurb: 'Past-paper questions by topic, Paper 1P & Paper 2P', accent: '#6C6FE8', soft: '#E7E7FC', dark: '#3F49A8', ink: '#141a45', hasPapers: false, board: 'Pearson Edexcel International GCSE', emoji: '⚛' },
  cm: { id: 'cm', title: 'Chemistry (4CH1)', short: 'Chemistry', sub: 'Edexcel IGCSE • Year 10 & Year 11', blurb: 'Past-paper questions by topic, Paper 1C & Paper 2C', accent: '#22A77C', soft: '#DAF4EB', dark: '#1B7A5C', ink: '#0d2b21', hasPapers: false, board: 'Pearson Edexcel International GCSE', emoji: '⚗' },
  bi: { id: 'bi', title: 'Biology (4BI1)', short: 'Biology', sub: 'Edexcel IGCSE • Year 10 & Year 11', blurb: 'Past-paper questions by topic, Paper 1B & Paper 2B', accent: '#7FAE1F', soft: '#EDF5D9', dark: '#4F7A12', ink: '#1a2a08', hasPapers: false, board: 'Pearson Edexcel International GCSE', emoji: '🧬' },
  bs: { id: 'bs', title: 'Business (4BS1)', short: 'Business', sub: 'Edexcel IGCSE • Year 10 & Year 11', blurb: 'Past-paper questions by topic, Paper 1 & Paper 2', accent: '#E0762B', soft: '#FCE7D7', dark: '#9C4F0B', ink: '#2e1805', hasPapers: false, board: 'Pearson Edexcel International GCSE', emoji: '📈' },
};

/* Question codes: two-digit subject code + two-digit chapter + three-digit question number (in pack order),
   e.g. 1001001 = Maths A · Chapter 01 · question 1. Printed next to every question so a teacher can say
   "do 1001001" and students can type it into the search box. */
export const SUBJECT_CODES = { m: '10', f: '11', s: '12', p: '13', mm: '14', s2: '15', ph: '16', cm: '17', bi: '18', bs: '19' };
const CODE_TO_SID = Object.fromEntries(Object.entries(SUBJECT_CODES).map(([s, c]) => [c, s]));

export const CHAPTER_COLOURS = ['#D4A62A', '#E05A8C', '#2F8FD8', '#E08A2E', '#3FAE5A', '#8B6FD6'];

export const LEVELS = [
  { id: 0, label: 'Easy', grades: '3–4', c: '#3FAE5A', tint: 'rgba(63,174,90,0.13)', fg: '#fff' },
  { id: 1, label: 'Medium', grades: '5–6', c: '#E8B923', tint: 'rgba(232,185,35,0.17)', fg: '#1F2430' },
  { id: 2, label: 'Hard', grades: '7–8', c: '#E0524D', tint: 'rgba(224,82,77,0.13)', fg: '#fff' },
  { id: 3, label: 'Challenge', grades: '9', c: '#3B82F6', tint: 'rgba(59,130,246,0.13)', fg: '#fff' },
];

export const PACK_BLOBS = PACK.blobs;

export function chapters(sid) {
  const s = PACK.subjects[sid];
  return s ? s.topics : [];
}

export function questionCount(sid) {
  return chapters(sid).reduce((n, t) => n + t.q.length, 0);
}

export function chapterName(sid, code) {
  const t = chapters(sid).find((x) => x.c === code);
  return t ? t.n : code;
}

export function paperNumber(p) {
  const m = /Paper (\d)/.exec(p || '');
  return m ? m[1] : '';
}

/**
 * Flatten one subject into question records.
 * Pack rows are [blob, offset, lenQ, lenMS, series, paper, number, marks, difficulty, answer].
 * The key format must stay identical to the old app (it is stored in Firestore and in task links).
 */
const flatCache = {};
export function questionsOf(sid) {
  if (flatCache[sid]) return flatCache[sid];
  const out = [];
  chapters(sid).forEach((t, ti) =>
    t.q.forEach((r, qi) =>
      out.push({
        k: sid + t.c + '-' + r[4].replace(/\s/g, '') + '-' + r[5].replace(/\s/g, '') + '-' + r[6],
        code: SUBJECT_CODES[sid] + t.c + String(qi + 1).padStart(3, '0'),
        sid,
        tc: t.c,
        tn: t.n,
        col: CHAPTER_COLOURS[ti % CHAPTER_COLOURS.length],
        b: r[0], o: r[1], lq: r[2], lm: r[3],
        s: r[4], p: r[5], n: r[6], m: r[7],
        d: r[8] || 0,
        a: r[9] || null,
      }),
    ),
  );
  flatCache[sid] = out;
  return out;
}

/** Look a question up by its 7-digit code (also accepts a 6-digit code with a 2-digit question number, e.g. 100101). */
export function questionByCode(code) {
  const c = String(code || '').replace(/\D/g, '');
  if (c.length !== 7 && c.length !== 6) return null;
  const sid = CODE_TO_SID[c.slice(0, 2)];
  if (!sid) return null;
  const tc = c.slice(2, 4);
  const n = parseInt(c.slice(4), 10);
  return questionsOf(sid).find((q) => q.tc === tc && parseInt(q.code.slice(4), 10) === n) || null;
}

/** Look a question up by its key across all subjects (keys like "m01-June2023-Paper2H-7"). */
export function findQuestion(key) {
  for (const s of SUBJECT_IDS) {
    if (!key.startsWith(s)) continue;
    const q = questionsOf(s).find((x) => x.k === key);
    if (q) return q;
  }
  return null;
}

export function subjectOfKey(key) {
  const q = findQuestion(key);
  return q ? q.sid : key.charAt(0);
}

export function shortSeries(s) {
  return s.replace('January', 'Jan').replace('November', 'Nov').replace('October', 'Oct');
}

/** "m:03" -> "Maths A · 03 Algebra" (the chapter key used in progress.ch). */
export function chapterLabel(key) {
  const [sid, code] = key.split(':');
  const S = SUBJECTS[sid];
  return S ? S.short + ' · ' + code + ' ' + chapterName(sid, code) : key;
}

export function allChapterKeys() {
  const out = [];
  SUBJECT_IDS.forEach((s) => chapters(s).forEach((t) => out.push(s + ':' + t.c)));
  return out;
}

/** Human label for a question key, e.g. "June 2023 · Paper 2 · Q7". */
export function questionLabel(k) {
  const a = String(k).split('-');
  return a.length > 3
    ? a[1].replace(/([a-z])(\d)/i, '$1 $2') + ' · ' + a[2].replace(/([a-z])(\d)/i, '$1 $2') + ' · Q' + a[3]
    : String(k);
}

/* ---------- Answer checking (typed answer vs printed answer) ---------- */
function normaliseNumberText(t) {
  return (t || '')
    .replace(/[−–]/g, '-')
    .replace(/(\d)[ ,](?=\d{3}(\D|$))/g, '$1')
    .replace(/[£$€%°]/g, '');
}

/** Returns true/false, or null when there is nothing to compare. */
export function checkAnswer(spec, text) {
  if (!spec || !text || !text.trim()) return null;
  if (spec.t === 'w') return spec.a.indexOf(text.trim().toLowerCase().replace(/[^a-z]/g, '')) >= 0;
  const m = /-?\s?\d+(?:\.\d+)?/.exec(normaliseNumberText(text));
  if (!m) return false;
  const n = parseFloat(m[0].replace(/\s/g, ''));
  const close = (s) => {
    const v = parseFloat(s);
    return Math.abs(n - v) <= 1e-9 * Math.max(1, Math.abs(v));
  };
  if (spec.a.some(close)) return true;
  if (spec.r) {
    const lo = parseFloat(spec.r[0]), hi = parseFloat(spec.r[1]);
    if (n >= Math.min(lo, hi) && n <= Math.max(lo, hi)) return true;
  }
  return false;
}

/* ---------- Question ordering within a chapter ---------- */
function stableSort(list, byDifficulty) {
  return list
    .map((x, i) => [x, i])
    .sort((x, y) => (byDifficulty ? x[0].d - y[0].d : 0) || x[0].m - y[0].m || x[1] - y[1])
    .map((x) => x[0]);
}

/**
 * Groups a chapter's questions either by difficulty, or — when qorder.js / qidea.js
 * provide "idea" groups (window.APQS / window.APQG) and no level filter is active — by idea.
 */
export function groupQuestions(list, sid, tc, levelFilter) {
  const names = window.APQS && window.APQS[sid + tc];
  const map = window.APQG;
  const byLevel = () =>
    LEVELS.map((l) => ({ id: l.id, label: l.label, c: l.c, tint: l.tint, items: stableSort(list.filter((q) => q.d === l.id)) }));
  if (!names || !map || levelFilter >= 0 || !list.some((q) => map[q.k] != null)) return byLevel();
  const out = names.map((n, i) => ({ id: -1, sub: true, label: n, c: '#4B5680', tint: '', items: stableSort(list.filter((q) => map[q.k] === i), true) }));
  const rest = list.filter((q) => map[q.k] == null);
  if (rest.length) out.push({ id: -1, sub: true, label: 'More questions', c: '#4B5680', tint: '', items: stableSort(rest, true) });
  return out;
}

/** Flat ordered list for a chapter (used for numbering and prev/next). */
export function orderedQuestions(list, levelFilter) {
  const map = window.APQG;
  const useIdeas = !!map && levelFilter < 0 && list.some((q) => map[q.k] != null);
  return list
    .map((q, i) => [q, i])
    .sort((a, b) => {
      if (useIdeas) {
        const x = map[a[0].k] == null ? 99 : map[a[0].k];
        const y = map[b[0].k] == null ? 99 : map[b[0].k];
        if (x !== y) return x - y;
      }
      return a[0].d - b[0].d || a[0].m - b[0].m || a[1] - b[1];
    })
    .map((a) => a[0]);
}
