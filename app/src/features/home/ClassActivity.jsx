/*
  Class activity: the teacher picks questions per class, optionally split into
  Support / Core / Challenge groups, places each student in a group, and releases
  the mark schemes when ready. Students see only their group's questions.
  Data: news/current.acts[cls] = { keys, groups:{S,C,H}, asg:{uid:"S"|"C"|"H"}, at }
        news/current.rel[taskId] = timestamp | 0
*/
import React, { useEffect, useState } from 'react';
import { useHub } from '../../app/HubContext';
import { useRouter } from '../../app/router';
import { startTask, taskId } from '../../data/task';
import { lsSet } from '../../data/local';
import { questionLabel, subjectOfKey } from '../../data/subjects';
import { IconLock, IconUnlock, IconBack, IconSpark } from '../../ui/Icons';
import { INSPECTION } from '../../data/inspection';

export const GROUPS = [
  ['S', 'Support', '#3FAE5A', '#fff'],
  ['C', 'Core', '#E8B923', '#1F2430'],
  ['H', 'Challenge', '#3B82F6', '#fff'],
];
export const GROUP_NAME = { S: 'Support', C: 'Core', H: 'Challenge' };

export function uidOf(p) {
  return (p && (p.uid || p.email || p.name)) || '';
}

/** Short one-way key for an email, so a class list can be prepared before students sign in without exposing emails. */
export function emailKey(e) {
  const s = String(e || '').trim().toLowerCase();
  if (!s) return '';
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'e' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** A student's group: set by the teacher by hand (uid) first, then the prepared list (email key), else Core. */
export function groupOf(a, p) {
  const asg = (a && a.asg) || {};
  return asg[uidOf(p)] || asg[emailKey(p && p.email)] || 'C';
}

/** Normalises an activity record (old single-list form or grouped form). */
export function readActivity(a) {
  a = a || {};
  const gr = a.groups || ((a.keys || []).length ? { C: a.keys } : {});
  return {
    gr,
    asg: a.asg || {},
    all: [...new Set(['S', 'C', 'H'].flatMap((g) => gr[g] || []))],
    tids: ['S', 'C', 'H'].filter((g) => (gr[g] || []).length).map((g) => taskId(gr[g])),
  };
}

const FAIL = 'Couldn’t save. The Firestore rules need to allow your account to write to the news collection.';

export function ClassActivity({ news, setNews, feed }) {
  const hub = useHub();
  const { go } = useRouter();
  const p = hub.profile || {};
  const guest = hub.isGuest || !hub.profile;
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState('');
  const [students, setStudents] = useState([]);
  const acts = (news || {}).acts || {};
  const rel = (news || {}).rel || {};

  const save = async (c, v) => {
    try {
      await hub.backend.setActivity(c, v);
      setNews((n) => ({ ...(n || {}), acts: { ...((n || {}).acts || {}), [c]: v } }));
      setMsg('Saved.');
    } catch {
      setMsg(FAIL);
    }
  };
  const loadLesson = async (n) => {
    try {
      const at = Date.now();
      const set = {};
      for (const it of INSPECTION[n]) for (const c of it.classes) set[c] = it.groups ? { keys: it.groups.C || it.keys, at, title: it.title, groups: it.groups, asg: (it.asg || {})[c] || {} } : { keys: it.keys, at, title: it.title };
      await Promise.all(Object.entries(set).map(([c, v]) => hub.backend.setActivity(c, v)));
      setNews((nw) => ({ ...(nw || {}), acts: { ...((nw || {}).acts || {}), ...set } }));
      setMsg('Lesson ' + n + ' loaded into ' + Object.keys(set).join(', ') + '.');
    } catch {
      setMsg(FAIL);
    }
  };
  const start = (keys) => {
    startTask(keys);
    go({ name: 'practice', sid: subjectOfKey(keys[0]), task: true });
  };
  /** Teacher: choose questions for a class/group in the practice screen (tray). */
  const pick = (c, g) => {
    lsSet('ap-act-cls', c);
    lsSet('ap-act-grp', g || '');
    const keys = g ? readActivity(acts[c]).gr[g] || [] : [];
    lsSet('ap-tray', JSON.stringify(keys));
    go({ name: 'practice', sid: keys.length ? subjectOfKey(keys[0]) : 'm' });
  };

  useEffect(() => {
    if (hub.isTeacher && sel && hub.backend.getAll)
      hub.backend.getAll().then((r) => setStudents((r || []).map((x) => x.profile).filter((x) => x && x.cls === sel))).catch(() => setStudents([]));
  }, [sel]);

  const note = msg ? <div className="text-[12.5px] font-bold mt-2" style={{ color: msg.startsWith('Couldn') ? 'var(--color-bad-500)' : 'var(--color-ok-500)' }}>{msg}</div> : null;

  if (hub.isTeacher) {
    if (!sel)
      return (
        <div>
          <div className="rounded-xl px-4 py-3 mb-3" style={{ border: '1px solid var(--color-line)', background: 'var(--color-page)' }}>
            <div className="font-extrabold text-[14px]">Inspection week lessons</div>
            <div className="muted text-[12.5px] mt-0.5">Loads lesson 1’s Support, Core and Challenge questions into every class at once (10A–10C, FPM10, FPM11, Year 12/13). Mark schemes start locked.</div>
            <div className="flex gap-2 flex-wrap mt-2">
              {[1].map((n) => (
                <button key={n} onClick={() => loadLesson(n)} className="btn btn-navy btn-sm">Load lesson {n}</button>
              ))}
            </div>
          </div>
          <div className="muted text-[13px]">Choose a class to set an activity.</div>
          {hub.classes.map((c) => {
            const a = readActivity(acts[c]);
            return (
              <button key={c} onClick={() => { setSel(c); setMsg(''); }} className="block w-full text-left rounded-xl px-4 py-3 mt-2 hover:bg-brand-50" style={{ border: '1px solid var(--color-line)' }}>
                <b className="text-[15px]">{c}</b>
                <div className="muted text-[12px] mt-0.5">{a.all.length ? a.all.length + ' question' + (a.all.length > 1 ? 's' : '') + ' · mark schemes ' + (a.tids.every((t) => rel[t]) ? 'released' : 'locked') : 'No activity yet'}</div>
              </button>
            );
          })}
          {note}
        </div>
      );

    const a = readActivity(acts[sel]);
    const on = a.tids.length > 0 && a.tids.every((t) => rel[t]);
    const setAll = async (onn) => {
      try {
        const v = onn ? Date.now() : 0;
        await Promise.all(a.tids.map((t) => hub.backend.setRelease(t, v)));
        setNews((n) => ({ ...(n || {}), rel: { ...((n || {}).rel || {}), ...Object.fromEntries(a.tids.map((t) => [t, v])) } }));
        setMsg(onn ? 'Mark schemes released to all groups.' : 'Mark schemes locked.');
      } catch {
        setMsg(FAIL);
      }
    };
    const assign = (u, g) => {
      const o = acts[sel] || {};
      save(sel, { keys: a.gr.C || [], at: o.at || Date.now(), groups: a.gr, asg: { ...a.asg, [u]: g } });
    };
    return (
      <div>
        <button onClick={() => { setSel(null); setMsg(''); }} className="btn btn-secondary btn-sm"><IconBack size={16} /> Classes</button>
        <div className="font-extrabold text-[17px] mt-3">Class {sel}</div>
        <div className="muted text-[12.5px]">Choose different questions for each group, then put each student in a group. Students not placed are in Core.</div>
        {GROUPS.map(([id, nm, col]) => {
          const q = a.gr[id] || [];
          const cnt = students.filter((x) => groupOf(acts[sel], x) === id).length;
          return (
            <div key={id} className="rounded-xl px-4 py-3 mt-2" style={{ border: '1px solid var(--color-line)', borderLeft: '5px solid ' + col }}>
              <div className="flex justify-between gap-2 flex-wrap">
                <b className="text-[15px]">{nm} group</b>
                <span className="muted text-[12px]">{cnt} student{cnt === 1 ? '' : 's'} · {q.length} question{q.length === 1 ? '' : 's'}</span>
              </div>
              {q.length > 0 && <div className="mt-1">{q.map((k, i) => <div key={k} className="text-[12.5px] py-0.5">{i + 1}. {questionLabel(k)}</div>)}</div>}
              <div className="flex gap-2 flex-wrap mt-2">
                <button onClick={() => pick(sel, id)} className="btn btn-navy btn-sm">{q.length ? 'Change questions' : 'Choose questions'}</button>
                {q.length > 0 && <button onClick={() => start(q)} className="btn btn-secondary btn-sm">Preview as student</button>}
              </div>
            </div>
          );
        })}
        <div className="font-extrabold text-[14px] mt-4">Students</div>
        {students.length ? (
          students.slice().sort((x, y) => (x.name || '').localeCompare(y.name || '')).map((x) => (
            <div key={uidOf(x)} className="flex items-center justify-between gap-2 flex-wrap py-1.5" style={{ borderTop: '1px solid var(--color-line)' }}>
              <span className="text-[13.5px]">{x.name || x.email}</span>
              <span className="flex gap-1">
                {GROUPS.map(([id, nm, col, fg]) => {
                  const cur = groupOf(acts[sel], x) === id;
                  return (
                    <button key={id} onClick={() => assign(uidOf(x), id)} className="rounded-lg px-2.5 py-1 text-[12px] font-extrabold" style={{ background: cur ? col : 'var(--color-page)', color: cur ? fg : 'var(--color-ink)', border: '1px solid ' + (cur ? col : 'var(--color-line)') }}>{nm}</button>
                  );
                })}
              </span>
            </div>
          ))
        ) : (
          <div className="muted text-[12.5px] mt-1">No students from {sel} have signed in yet.</div>
        )}
        <div className="flex gap-2 flex-wrap mt-4">
          {a.tids.length > 0 && (
            <button onClick={() => setAll(!on)} className={'btn btn-sm ' + (on ? 'btn-danger' : 'btn-primary')}>
              {on ? <><IconLock size={15} /> Lock mark schemes</> : <><IconUnlock size={15} /> Release mark schemes (all groups)</>}
            </button>
          )}
          {a.tids.length > 0 && <button onClick={() => save(sel, null)} className="btn btn-secondary btn-sm">Clear activity</button>}
        </div>
        {note}
        <div className="faint text-[12px] mt-2">Each student sees only their group’s questions under Class activity. Mark schemes stay locked until you release them.</div>
      </div>
    );
  }

  // Student view
  const a = !guest && acts[p.cls];
  const gm = a && a.groups ? groupOf(a, p) : '';
  const keys = a ? (a.groups ? a.groups[gm] || [] : a.keys || []) : [];
  const released = !!(keys.length && rel[taskId(keys)]);
  return (
    <div>
      {keys.length > 0 && (
        <div className="rounded-xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg, var(--color-navy-800), var(--color-navy-600))' }}>
          <div className="label" style={{ color: 'var(--color-gold-500)' }}>Class activity</div>
          <div className="text-[15px] font-extrabold mt-1">{keys.length} question{keys.length > 1 ? 's' : ''} from your teacher{gm ? ' · ' + GROUP_NAME[gm] + ' group' : ''}</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,.75)' }}>{released ? 'Mark schemes released' : 'Mark schemes unlock when your teacher releases them'}</div>
          <button onClick={() => start(keys)} className="btn btn-sm mt-3" style={{ background: 'var(--color-gold-500)', color: '#1B2A4A', fontWeight: 800 }}>Start ›</button>
        </div>
      )}
      {feed}
    </div>
  );
}

/** Home-screen card for students: their class's current activity, styled like the Revision card. */
export function ActivityHomeCard() {
  const hub = useHub();
  const { go } = useRouter();
  const [news, setNews] = useState(null);
  const [open, setOpen] = useState(false);
  const p = hub.profile || {};
  useEffect(() => {
    if (!hub.isGuest && hub.profile && !hub.isTeacher && hub.backend && hub.backend.getNews) hub.backend.getNews().then((v) => setNews(v || {})).catch(() => {});
  }, [hub.profile]);
  const a = news && (news.acts || {})[p.cls];
  if (!a) return null;
  const gm = a.groups ? groupOf(a, p) : '';
  const keys = a.groups ? a.groups[gm] || [] : a.keys || [];
  if (!keys.length) return null;
  const released = !!((news.rel || {})[taskId(keys)]);
  const LV = ['Support', 'Core', 'Challenge'];
  const run = (ks) => {
    startTask(ks);
    go({ name: 'practice', sid: subjectOfKey(ks[0]), task: true });
  };
  return (
    <div className="card p-4" style={{ borderLeft: '5px solid #E8B923' }}>
      <div className="flex items-center gap-4">
        <div className="shrink-0 grid place-items-center rounded-xl" style={{ width: 48, height: 48, background: '#FFF4CC', color: '#8A6A00' }}>
          <IconSpark size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="label">Class activity{gm ? ' · ' + GROUP_NAME[gm] : ''}</div>
          <div className="font-extrabold text-[16px]">{a.title || 'Your class activity'}</div>
          <div className="muted text-[12.5px]">{keys.length} question{keys.length > 1 ? 's' : ''}, easiest first · {released ? 'mark schemes released' : 'mark schemes unlock when your teacher releases them'}</div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button onClick={() => run(keys)} className="btn btn-navy btn-sm">Start all</button>
          {keys.length > 1 && <button onClick={() => setOpen(!open)} className="btn btn-sm">{open ? 'Hide levels' : 'By level'}</button>}
        </div>
      </div>
      {open && (
        <div className="grid gap-2 mt-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))' }}>
          {keys.map((k, i) => (
            <button key={k} onClick={() => run([k])} className="card p-3 text-left" style={{ cursor: 'pointer' }}>
              <div className="label">{keys.length === 3 ? LV[i] : 'Question ' + (i + 1)}</div>
              <div className="font-bold text-[14px]">{questionLabel(k)}</div>
              <div className="muted text-[12.5px]">tap to start</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
