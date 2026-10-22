/*
  Class-task and challenge links.
    #t=key1~key2~key3   a class task set by the teacher (kept in sessionStorage so it survives reloads)
    #c=key              a single "challenge" question shared by a classmate (mark scheme available at once)
  Parsed once at start-up, exactly like the old inline scripts in index.html.
*/
import { ssGet, ssSet, ssRemove } from './local';
import { findQuestion, subjectOfKey, questionByCode } from './subjects';

let current = null;

let openQuestion = null;
/** A #q=1001001 link opens that question in normal practice mode. */
export function parseOpenFromUrl() {
  try {
    const m = /[#&]q=(\d{6,7})/.exec(location.hash);
    if (m) {
      const q = questionByCode(m[1]);
      history.replaceState(null, '', location.pathname + location.search);
      if (q) openQuestion = q;
    }
  } catch {}
  return openQuestion;
}
export function questionLink(q) {
  return location.origin + location.pathname + '#q=' + q.code;
}

export function parseTaskFromUrl() {
  try {
    const c = /[#&]c=([^&]+)/.exec(location.hash);
    if (c) {
      const k = decodeURIComponent(c[1]);
      history.replaceState(null, '', location.pathname + location.search);
      current = { keys: [k], sid: subjectOfKey(k), ch: true };
      return current;
    }
    const m = /[#&]t=([^&]+)/.exec(location.hash);
    let raw = m ? m[1] : null;
    if (raw) ssSet('aplus-task', raw);
    else raw = ssGet('aplus-task');
    if (raw) {
      const keys = raw.split('~').map(decodeURIComponent).filter(Boolean).slice(0, 30);
      if (keys.length) current = { keys, sid: subjectOfKey(keys[0]) };
    }
  } catch {}
  return current;
}

export function currentTask() {
  return current;
}

/** Start a task in this session (teacher preview / student "Start" button). */
export function startTask(keys) {
  ssSet('aplus-task', keys.map(encodeURIComponent).join('~'));
  current = { keys: keys.slice(), sid: subjectOfKey(keys[0]) };
  return current;
}

export function startChallenge(key) {
  current = { keys: [key], sid: subjectOfKey(key), ch: true };
  return current;
}

export function clearTask() {
  current = null;
  ssRemove('aplus-task');
}

export function taskQuestions(task) {
  return task.keys.map(findQuestion).filter(Boolean);
}

export function taskLink(keys) {
  return location.origin + location.pathname + '#t=' + keys.map(encodeURIComponent).join('~');
}

export function challengeLink(key) {
  return location.origin + location.pathname + '#c=' + encodeURIComponent(key);
}

/** Stable id of a question set (djb2 hash) — the key under news/current.rel. Must match the old app. */
export function taskId(keys) {
  let x = 5381;
  const t = (keys || []).join('~');
  for (let i = 0; i < t.length; i++) x = ((x * 33) ^ t.charCodeAt(i)) >>> 0;
  return x.toString(36);
}
