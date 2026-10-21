/* Like a question · Challenge a friend (post to the class feed or share a link). */
import React, { useEffect, useState } from 'react';
import { useHub } from '../../app/HubContext';
import { LEVELS } from '../../data/subjects';
import { challengeLink } from '../../data/task';
import { IconHeart, IconPencil } from '../../ui/Icons';

let likesPromise = null;
export const fileKey = (k) => String(k).replace(/[^A-Za-z0-9_-]/g, '_');

export function QuestionBar({ q }) {
  const hub = useHub();
  const fk = fileKey(q.k);
  const guest = !hub.profile || hub.isGuest || hub.mode === 'off';
  const [n, setN] = useState(null);
  const [liked, setLiked] = useState(!!hub.liked[fk]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const lv = LEVELS[q.d] || LEVELS[0];
  const url = challengeLink(q.k);

  useEffect(() => {
    setLiked(!!hub.liked[fk]);
    setOpen(false);
    setMsg('');
    if (!hub.backend || !hub.backend.getLikes) {
      setN(0);
      return;
    }
    likesPromise = likesPromise || hub.backend.getLikes().catch(() => ({}));
    likesPromise.then((d) => setN(Math.max(0, (d || {})[fk] || 0)));
  }, [q.k]);

  const like = async () => {
    if (guest) {
      setMsg('Sign in with your school account to like questions.');
      return;
    }
    if (busy) return;
    const on = !liked;
    setBusy(true);
    setLiked(on);
    setN((x) => Math.max(0, (x || 0) + (on ? 1 : -1)));
    hub.setLiked(fk, on);
    likesPromise && likesPromise.then((d) => (d[fk] = Math.max(0, (d[fk] || 0) + (on ? 1 : -1))));
    try {
      await hub.backend.like(hub.user.uid, fk, on);
    } catch {
      setLiked(!on);
      setN((y) => Math.max(0, (y || 0) + (on ? -1 : 1)));
      setMsg('Couldn’t save your like. Try again.');
    }
    setBusy(false);
  };

  const toClass = async () => {
    if (guest || busy) return;
    setBusy(true);
    const o = { k: q.k, d: q.d, ck: q.sid + ':' + q.tc, at: Date.now() };
    try {
      await hub.backend.challenge(hub.user, o);
      const others = (hub.board || []).filter((x) => x.uid !== hub.user.uid);
      const me = (hub.board || []).find((x) => x.uid === hub.user.uid) || { uid: hub.user.uid, name: hub.profile.name, cls: hub.profile.cls };
      hub.setBoard(others.concat([{ ...me, chal: o }]));
      setMsg('Posted! Your class will see it in Class activity on the home screen.');
    } catch {
      setMsg('Couldn’t post the challenge. Try again.');
    }
    setBusy(false);
  };

  const share = async () => {
    const who = hub.profile && !hub.isGuest ? hub.profile.name : 'A classmate';
    const txt = who + ' challenges you to solve this ' + lv.label.toLowerCase() + ' question on A+ Maths Hub!';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'A+ Maths challenge', text: txt, url });
        return;
      }
    } catch (x) {
      if (x && x.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(txt + ' ' + url);
      setMsg('Link copied. Paste it to your friend.');
    } catch {
      setMsg('Copy this link: ' + url);
    }
  };

  return (
    <div className="card p-3 mt-3">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={like} aria-pressed={liked} className="btn btn-secondary btn-pill" style={liked ? { background: 'var(--color-pink-100)', borderColor: 'var(--color-pink-500)', color: 'var(--color-pink-500)' } : undefined}>
          <IconHeart size={18} filled={liked} /> {liked ? 'Liked' : 'Like'} <span className="tnum muted">{n === null ? '' : n}</span>
        </button>
        <button onClick={() => { setOpen(!open); setMsg(''); }} aria-expanded={open} className={'btn btn-pill ' + (open ? 'btn-navy' : 'btn-secondary')}>
          <IconPencil size={17} /> Challenge a friend
        </button>
      </div>
      {open && (
        <div className="grid gap-1.5 mt-2.5">
          <div className="muted text-[13px]">Dare a classmate to solve this <b style={{ color: lv.c }}>{lv.label.toLowerCase()}</b> question.</div>
          {!guest && <button disabled={busy} onClick={toClass} className="btn btn-navy">Challenge my class ({hub.profile.cls})</button>}
          <button onClick={share} className="btn btn-secondary">Send a link to a friend</button>
        </div>
      )}
      {msg && <div role="status" className="text-[12.5px] mt-2" style={{ color: 'var(--color-ok-500)', overflowWrap: 'anywhere' }}>{msg}</div>}
    </div>
  );
}
