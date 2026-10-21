/* Student reviews: 1–5 stars + short text; teacher can hide/show. */
import React, { useEffect, useState } from 'react';
import { useHub } from '../../app/HubContext';
import { daysAgoLabel } from '../../data/dates';
import { Empty } from '../../ui/primitives';

function Stars({ n, size = 15 }) {
  return <span style={{ color: 'var(--color-gold-500)', fontSize: size, letterSpacing: 1 }}>{'★'.repeat(n) + '☆'.repeat(5 - n)}</span>;
}

export function Reviews() {
  const hub = useHub();
  const p = hub.profile || {};
  const uid = (hub.user || {}).uid;
  const TT = !!hub.isTeacher;
  const [list, setList] = useState(null);
  const [st, setSt] = useState(0);
  const [hov, setHov] = useState(0);
  const [tx, setTx] = useState('');
  const [edit, setEdit] = useState(false);
  const [all, setAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = () => (hub.backend && hub.backend.getReviews ? hub.backend.getReviews().then((v) => setList(v || [])).catch(() => setList([])) : setList([]));
  useEffect(() => {
    load();
  }, []);
  if (list === null) return null;

  let first = (p.name || '').trim().split(/\s+/)[0] || 'Student';
  first = (first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()).slice(0, 20);
  const mine = list.find((r) => r.id === uid);
  const vis = list.filter((r) => TT || !r.hidden || r.id === uid).filter((r) => !r.hidden || TT);
  const ok = list.filter((r) => !r.hidden && r.stars >= 1);
  const avg = ok.length ? ok.reduce((a, r) => a + r.stars, 0) / ok.length : 0;
  const sorted = vis.slice().sort((a, b) => (b.at || 0) - (a.at || 0));
  const shown = all ? sorted.slice(0, 40) : sorted.slice(0, 3);
  const showForm = !TT && (!mine || edit);
  if (!showForm && !sorted.length && !mine && TT) return null;

  const submit = async () => {
    if (!st || busy) return;
    setBusy(true);
    setErr('');
    try {
      await hub.backend.saveReview(uid, { stars: st, text: tx.trim().slice(0, 200), first, at: Date.now() });
      setEdit(false);
      await load();
    } catch {
      setErr('Couldn’t send your review. Check your connection and try again.');
    }
    setBusy(false);
  };

  return (
    <div className="card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-bold text-[16px]">{showForm ? (mine ? 'Edit your review' : 'How do you find A+?') : 'What students say'}</div>
        {ok.length > 0 && (
          <div className="text-[13px] whitespace-nowrap"><Stars n={Math.round(avg)} size={14} /> <b>{avg.toFixed(1)}</b> <span className="muted">· {ok.length} review{ok.length === 1 ? '' : 's'}</span></div>
        )}
      </div>
      {showForm && (
        <div>
          <div className="muted text-[13px] my-1">Tap the stars, then add a comment if you like. Other students will see your first name only.</div>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} aria-label={n + ' star' + (n > 1 ? 's' : '')} onMouseEnter={() => setHov(n)} onMouseLeave={() => setHov(0)} onClick={() => setSt(n)} className="bg-transparent border-0 px-0.5" style={{ fontSize: 32, lineHeight: 1, color: n <= (hov || st) ? 'var(--color-gold-500)' : 'var(--color-line-strong)' }}>★</button>
            ))}
          </div>
          {st > 0 && (
            <div>
              <textarea value={tx} onChange={(e) => setTx(e.target.value.slice(0, 200))} placeholder="What do you like? What could be better? (optional)" rows={3} className="input" style={{ resize: 'vertical' }} />
              <div className="flex items-center justify-between mt-2 gap-2">
                <span className="faint text-[12px]">{tx.length}/200 · posted as {first}</span>
                <div className="flex gap-2">
                  {mine && <button onClick={() => { setEdit(false); setSt(0); }} className="btn btn-secondary btn-sm">Cancel</button>}
                  <button disabled={busy} onClick={submit} className="btn btn-primary btn-sm">{busy ? 'Sending…' : 'Send review'}</button>
                </div>
              </div>
            </div>
          )}
          {err && <div className="text-[13px] mt-2" style={{ color: 'var(--color-bad-500)' }}>{err}</div>}
        </div>
      )}
      {!showForm && mine && !TT && (
        <div className="text-[13px] my-1" style={{ color: 'var(--color-ok-500)' }}>
          Thanks, {first}! Your review is in.{' '}
          <button onClick={() => { setSt(mine.stars); setTx(mine.text || ''); setEdit(true); }} className="bg-transparent border-0 underline font-bold text-[13px]" style={{ color: 'var(--color-brand-500)' }}>Edit</button>
        </div>
      )}
      {shown.map((r) => (
        <div key={r.id} className="py-2.5" style={{ borderTop: '1px solid var(--color-line)', opacity: r.hidden ? 0.45 : 1 }}>
          <div className="flex justify-between items-center gap-2">
            <span><b className="text-[14px]">{r.first || 'Student'}</b> <Stars n={r.stars} size={13} /></span>
            <span className="faint text-[12px]">
              {daysAgoLabel(r.at)}
              {TT && !/^demo\d$/.test(r.id) && (
                <button onClick={async () => { try { await hub.backend.hideReview(r.id, !r.hidden); await load(); } catch {} }} className="ml-2 bg-transparent border-0 font-bold text-[12px]" style={{ color: 'var(--color-bad-500)' }}>{r.hidden ? 'Show' : 'Hide'}</button>
              )}
            </span>
          </div>
          {r.text && <div className="text-[14.5px] leading-snug mt-1">{r.text}</div>}
        </div>
      ))}
      {sorted.length > 3 && <button onClick={() => setAll((x) => !x)} className="bg-transparent border-0 font-bold text-[13px] mt-1" style={{ color: 'var(--color-brand-500)' }}>{all ? 'Show fewer' : 'See all ' + sorted.length + ' reviews'}</button>}
      {!sorted.length && !showForm && <Empty>No reviews yet.</Empty>}
    </div>
  );
}
