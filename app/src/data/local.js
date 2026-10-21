/* Small localStorage helpers. Keys are unchanged from the old app so existing devices keep their data. */

export function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}
export function lsSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}
export function lsRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}
export function lsJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}
export function ssGet(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
export function ssSet(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {}
}
export function ssRemove(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {}
}

/* ---- "done" store: marks the student gave themselves, per question key, on this device ---- */
const DONE_KEY = 'aplus-pack-done-v1';
let doneCache = null;
export function doneStore() {
  if (!doneCache) doneCache = lsJson(DONE_KEY, {}) || {};
  return doneCache;
}
export function setDone(key, value) {
  const d = doneStore();
  d[key] = value;
  lsSet(DONE_KEY, JSON.stringify(d));
}
export function doneCount() {
  return Object.keys(doneStore()).length;
}
/** "full" | "part" | "zero" | null */
export function doneState(key) {
  const g = doneStore()[key];
  return g ? (g.g >= g.m ? 'full' : g.g > 0 ? 'part' : 'zero') : null;
}
