/* Teacher tools on the practice screen: the "class activity" tray and mark-scheme release polling. */
import React, { useEffect, useState } from 'react';
import { useHub } from '../../app/HubContext';
import { lsGet, lsRemove, lsSet } from '../../data/local';
import { taskId, taskLink } from '../../data/task';
import { GROUP_NAME } from '../home/ClassActivity';
import { IconLink, IconLock, IconUnlock, IconPlus, IconCheck } from '../../ui/Icons';

const FAIL = 'Couldn’t save. The Firestore rules need to allow your account to write to the news collection.';

/**
 * Tracks whether the mark schemes for a set of questions are released.
 * Students in task mode poll every 5 s; teachers every 20 s.
 */
export function useRelease(keys, task) {
  const hub = useHub();
  const tid = keys && keys.length ? taskId(keys) : '';
  const [rel, setRel] = useState(0);
  useEffect(() => {
    if (!task) lsSet('ap-tray', JSON.stringify(keys || []));
  }, [tid]);
  useEffect(() => {
    let alive = true, t;
    const poll = () => {
      if (!tid || !hub.backend || !hub.backend.getNews) return;
      hub.backend.getNews().then((n) => alive && setRel(((n || {}).rel || {})[tid] || 0)).catch(() => {});
    };
    poll();
    if (task || hub.isTeacher) t = setInterval(poll, task ? 5e3 : 2e4);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [tid]);
  return {
    tid,
    rel,
    set: async (on) => {
      await hub.backend.setRelease(tid, on ? Date.now() : 0);
      setRel(on ? Date.now() : 0);
    },
  };
}

/** Yellow bar shown when the teacher is choosing questions for a class activity (started from the home screen). */
export function ActivityBar({ tray, onHome }) {
  const hub = useHub();
  const [sent, setSent] = useState('');
  const [err, setErr] = useState('');
  const ac = lsGet('ap-act-cls', '');
  if (!ac || !hub.isTeacher) return null;
  const ag = lsGet('ap-act-grp', '');
  const clear = () => {
    lsRemove('ap-act-cls');
    lsRemove('ap-act-grp');
  };
  const send = () => {
    (ag
      ? hub.backend.getNews().then((n) => {
          const o = ((n || {}).acts || {})[ac] || {};
          const g = Object.assign({}, o.groups || {});
          if (!o.groups && (o.keys || []).length) g.C = o.keys.slice();
          g[ag] = tray.slice();
          return hub.backend.setActivity(ac, { keys: g.C || [], at: Date.now(), groups: g, asg: o.asg || {} });
        })
      : hub.backend.setActivity(ac, { keys: tray.slice(), at: Date.now() })
    )
      .then(() => {
        clear();
        setSent(ac + (ag ? ' (' + GROUP_NAME[ag] + ' group)' : ''));
      })
      .catch(() => setErr(FAIL));
  };
  if (sent)
    return (
      <div className="rounded-xl px-4 py-3 mb-3 text-[14px] font-semibold" style={{ background: 'var(--color-ok-100)', color: 'var(--color-ok-500)', border: '1px solid var(--color-ok-500)' }}>
        <IconCheck size={16} /> Activity sent to {sent}. Students will see it under Class activity on their home screen.
        <button onClick={onHome} className="btn btn-sm btn-secondary ml-3">Back to home</button>
      </div>
    );
  return (
    <div className="rounded-xl px-4 py-3 mb-3" style={{ background: 'var(--color-gold-100)', border: '1px solid var(--color-gold-500)', color: '#3b2f00' }}>
      <div className="font-extrabold text-[14px]">Class activity for {ac}{ag ? ' · ' + GROUP_NAME[ag] + ' group' : ''} · {tray.length} question{tray.length === 1 ? '' : 's'} chosen</div>
      <div className="text-[12.5px] mt-0.5" style={{ opacity: 0.85 }}>{tray.length ? 'Open more questions and tap “Add to class activity”, or send now.' : 'Open a chapter, open a question, then tap “Add to class activity”.'}</div>
      {err && <div className="text-[12.5px] mt-1.5 font-bold" style={{ color: 'var(--color-bad-500)' }}>{err}</div>}
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {tray.length > 0 && <button onClick={send} className="btn btn-success btn-sm">Send to {ac}{ag ? ' ' + GROUP_NAME[ag] : ''} ({tray.length})</button>}
        <button onClick={() => { clear(); onHome(); }} className="btn btn-secondary btn-sm">Cancel</button>
      </div>
    </div>
  );
}

/** Buttons under the question title for teachers: add to tray, copy link, share to Classroom, release. */
export function TrayButtons({ q, tray, setTray, release }) {
  const [cp, setCp] = useState('');
  const inTray = tray.includes(q.k);
  const link = () => taskLink(tray);
  const copy = () => {
    const j = link();
    try {
      navigator.clipboard.writeText(j).then(() => setCp('Link copied')).catch(() => prompt('Copy this link', j));
    } catch {
      prompt('Copy this link', j);
    }
  };
  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      <button onClick={() => { setCp(''); setTray((t) => (t.includes(q.k) ? t.filter((k) => k !== q.k) : t.length >= 10 ? t : [...t, q.k])); }} className={'btn btn-sm ' + (inTray ? 'btn-success' : 'btn-navy')}>
        {inTray ? <><IconCheck size={15} /> In activity</> : <><IconPlus size={15} /> Add to class activity</>}
      </button>
      {tray.length > 0 && (
        <>
          <button onClick={copy} className="btn btn-sm" style={{ background: 'var(--color-gold-500)', color: '#1B2A4A' }}><IconLink size={15} /> Copy link ({tray.length})</button>
          <button onClick={() => window.open('https://classroom.google.com/share?url=' + encodeURIComponent(link()) + '&title=' + encodeURIComponent('A+ Class task (' + tray.length + ' question' + (tray.length > 1 ? 's' : '') + ')'), '_blank')} className="btn btn-sm btn-success">🎓 Share to Classroom</button>
          <button onClick={() => { setTray([]); setCp(''); }} className="btn btn-sm btn-secondary">Clear</button>
          {release.tid && (
            <button onClick={() => release.set(!release.rel).then(() => setCp(release.rel ? 'Mark schemes locked' : 'Mark schemes released to students')).catch(() => setCp(FAIL))} className={'btn btn-sm ' + (release.rel ? 'btn-danger' : 'btn-primary')}>
              {release.rel ? <><IconLock size={15} /> Lock mark schemes</> : <><IconUnlock size={15} /> Release mark schemes</>}
            </button>
          )}
        </>
      )}
      {cp && <span className="text-[12px] font-bold" style={{ color: cp.startsWith('Couldn') ? 'var(--color-bad-500)' : 'var(--color-ok-500)' }}>{cp}</span>}
    </div>
  );
}
