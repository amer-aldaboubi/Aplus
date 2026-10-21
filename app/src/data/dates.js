/* Date helpers shared with the Firestore data model (keys must stay byte-identical to the old app). */

/** Local calendar day as YYYY-MM-DD — the key used in progress.days. */
export function dayKey(d) {
  const e = d || new Date();
  return e.getFullYear() + '-' + String(e.getMonth() + 1).padStart(2, '0') + '-' + String(e.getDate()).padStart(2, '0');
}

/** ISO week as YYYY-Www — the key used in board.wk and stats/tug. */
export function weekKey(t) {
  const src = t || new Date();
  const e = new Date(Date.UTC(src.getFullYear(), src.getMonth(), src.getDate()));
  const dow = e.getUTCDay() || 7;
  e.setUTCDate(e.getUTCDate() + 4 - dow);
  const jan1 = new Date(Date.UTC(e.getUTCFullYear(), 0, 1));
  return e.getUTCFullYear() + '-W' + String(Math.ceil(((e - jan1) / 864e5 + 1) / 7)).padStart(2, '0');
}

export function ago(t) {
  const m = Math.round((Date.now() - t) / 6e4);
  return m < 60 ? Math.max(1, m) + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago';
}

export function daysAgoLabel(t) {
  if (!t) return '';
  const d = Math.floor((Date.now() - t) / 864e5);
  return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d + 'd ago';
}
