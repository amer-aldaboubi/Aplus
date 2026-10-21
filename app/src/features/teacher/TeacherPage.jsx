/* Teacher dashboard: noticeboard editor, class overview, per-student drill-down, tokens, CSV export. */
import React, { useEffect, useState } from 'react';
import { useHub } from '../../app/HubContext';
import { useRouter } from '../../app/router';
import { analyse, scoreColour } from '../../data/analytics';
import { dayKey } from '../../data/dates';
import { ChapterBars, DaysChart, NeedsWork } from '../progress/ProgressPage';
import { Card, SectionTitle, StatTile, Empty } from '../../ui/primitives';
import { IconBack, IconDownload, IconFire } from '../../ui/Icons';

const FAIL = 'Couldn’t save. The Firestore rules need to allow your account to write to the news collection.';

function NewsEditor() {
  const hub = useHub();
  const [items, setItems] = useState(null);
  const [f, setF] = useState({ kind: 'task', cls: 'All', text: '', due: '', link: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    hub.backend.getNews ? hub.backend.getNews().then((v) => setItems((v || {}).items || [])).catch(() => setItems([])) : setItems([]);
  }, []);
  const save = async (list) => {
    setBusy(true);
    setMsg('');
    try {
      await hub.backend.saveNews({ items: list, updated: Date.now() });
      setItems(list);
      setMsg('Saved. Students see it on their home screen.');
    } catch {
      setMsg(FAIL);
    }
    setBusy(false);
  };
  const post = () => {
    if (!f.text.trim()) return;
    const it = { id: 'n' + Date.now(), kind: f.kind, cls: f.cls, text: f.text.trim(), at: Date.now() };
    if (f.kind === 'task' && f.due) it.due = f.due;
    if (f.link.trim()) it.link = f.link.trim();
    save([it].concat(items || []).slice(0, 30)).then(() => setF({ ...f, text: '', due: '', link: '' }));
  };
  const Lab = ({ children }) => <div className="label mt-3 mb-1">{children}</div>;
  return (
    <Card className="p-4">
      <div className="text-[17px] font-bold">Student noticeboard</div>
      <div className="muted text-[12px] mt-0.5">Post a task or news. It appears on students’ home screens.</div>
      <div className="flex gap-1.5 mt-2.5">
        {[['task', 'Task'], ['news', 'News']].map(([k, l]) => <button key={k} onClick={() => setF({ ...f, kind: k })} className={'chip ' + (f.kind === k ? 'chip-on' : '')}>{l}</button>)}
      </div>
      <Lab>For</Lab>
      <select value={f.cls} onChange={(e) => setF({ ...f, cls: e.target.value })} className="input">{['All'].concat(hub.classes).map((c) => <option key={c} value={c}>{c === 'All' ? 'All classes' : c}</option>)}</select>
      <Lab>{f.kind === 'task' ? 'What should they do?' : 'Message'}</Lab>
      <textarea rows={3} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} placeholder={f.kind === 'task' ? 'e.g. Do 10 questions from Chapter 4: Sequences' : 'e.g. Mock exams start on 3 November'} className="input" style={{ resize: 'vertical' }} />
      {f.kind === 'task' && (
        <div>
          <Lab>Due date (optional)</Lab>
          <input type="date" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} className="input" />
        </div>
      )}
      <Lab>Link (optional)</Lab>
      <input value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} placeholder="Paste a task link from Aplus or any website" className="input" />
      <button disabled={busy || !f.text.trim()} onClick={post} className="btn btn-primary btn-lg w-full mt-3">{busy ? 'Saving…' : 'Post to students'}</button>
      {msg && <div className="text-[12.5px] mt-2" style={{ color: msg.startsWith('Couldn') ? 'var(--color-bad-500)' : 'var(--color-ok-500)' }}>{msg}</div>}
      {items && items.length > 0 && (
        <div className="mt-3.5">
          <Lab>Posted</Lab>
          {items.map((i) => (
            <div key={i.id} className="flex gap-2 items-start py-2 text-[13px]" style={{ borderTop: '1px solid var(--color-line)' }}>
              <span className="text-[10px] font-extrabold mt-0.5" style={{ color: i.kind === 'task' ? 'var(--color-gold-500)' : 'var(--color-brand-500)' }}>{i.kind === 'task' ? 'TASK' : 'NEWS'}</span>
              <div className="flex-1 min-w-0" style={{ overflowWrap: 'anywhere' }}>
                {i.text}
                <div className="faint text-[11px]">{i.cls === 'All' ? 'All classes' : i.cls}{i.due ? ' · due ' + i.due : ''}</div>
              </div>
              <button disabled={busy} onClick={() => save(items.filter((x) => x.id !== i.id))} className="bg-transparent border-0 text-[12px] font-bold" style={{ color: 'var(--color-bad-500)' }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function GiveTokens({ name, gifted, onGive }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const go = async (k) => {
    if (busy) return;
    setBusy(true);
    setMsg('');
    try {
      await onGive(k);
      setMsg('Gave ' + k + ' token' + (k > 1 ? 's' : '') + ' to ' + name);
    } catch {
      setMsg('Couldn’t save. Republish the Firestore rules, then try again.');
    }
    setBusy(false);
  };
  return (
    <div className="rounded-xl px-3 py-2.5 mt-3" style={{ background: 'var(--color-gold-100)', border: '1px solid rgba(212,166,42,.5)' }}>
      <div className="label" style={{ color: '#8A6D12' }}>Game tokens</div>
      <div className="text-[13px] my-1">Given so far: <b>{gifted || 0}</b> · each token lets {name} play one game</div>
      <div className="flex gap-2 flex-wrap">{[1, 3, 5].map((k) => <button key={k} disabled={busy} onClick={() => go(k)} className="btn btn-sm" style={{ background: 'var(--color-gold-500)', color: '#1B2A4A', fontWeight: 800 }}>+{k}</button>)}</div>
      {msg && <div className="text-[13px] mt-2" style={{ color: msg.startsWith('Couldn') ? 'var(--color-bad-500)' : 'var(--color-ok-500)' }}>{msg}</div>}
    </div>
  );
}

function GiveAll({ count, onGive }) {
  const [st, setSt] = useState(0);
  const [msg, setMsg] = useState('');
  const run = async () => {
    if (st === 0) {
      setSt(1);
      setTimeout(() => setSt((x) => (x === 1 ? 0 : x)), 5000);
      return;
    }
    setSt(2);
    try {
      await onGive(1);
      setMsg('Gave 1 token to ' + count + ' student' + (count === 1 ? '' : 's'));
    } catch {
      setMsg('Couldn’t save. Republish the Firestore rules, then try again.');
    }
    setSt(0);
  };
  if (!count) return null;
  return (
    <div className="mt-3 flex items-center gap-2.5 flex-wrap">
      <button disabled={st === 2} onClick={run} className="btn btn-sm" style={{ background: st === 1 ? 'var(--color-pink-500)' : 'var(--color-gold-500)', color: st === 1 ? '#fff' : '#1B2A4A', fontWeight: 800 }}>
        {st === 1 ? 'Tap again to confirm: +1 token for ' + count + ' students' : st === 2 ? 'Giving…' : '🎟 Give +1 token to everyone shown (' + count + ')'}
      </button>
      {msg && <span className="text-[13px]" style={{ color: msg.startsWith('Couldn') ? 'var(--color-bad-500)' : 'var(--color-ok-500)' }}>{msg}</span>}
    </div>
  );
}

export function TeacherPage() {
  const hub = useHub();
  const { go } = useRouter();
  const [all, setAll] = useState(null);
  const [cls, setCls] = useState('all');
  const [sort, setSort] = useState('name');
  const [open, setOpen] = useState(null);
  useEffect(() => {
    hub.backend.getAll().then(setAll).catch(() => setAll([]));
  }, []);
  const wrap = (children) => (
    <div className="mx-auto px-4 pt-5 pb-tabbar" style={{ maxWidth: 820 }}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => go('home')} className="btn btn-secondary btn-sm"><IconBack size={15} /> Home</button>
        <h1 className="m-0 text-[20px] font-extrabold">Teacher dashboard</h1>
      </div>
      {children}
    </div>
  );
  if (!all) return wrap(<div className="text-center mt-16"><div className="spinner" /></div>);

  const d = all.filter((s) => cls === 'all' || s.profile.cls === cls).map((s) => ({ ...s, an: analyse(s.progress) }));
  const sorters = {
    name: (a, b) => a.profile.name.localeCompare(b.profile.name),
    score: (a, b) => a.an.acc - b.an.acc,
    qs: (a, b) => b.an.total - a.an.total,
    last: (a, b) => (a.an.last || 0) - (b.an.last || 0),
  };
  d.sort(sorters[sort]);
  const DAY = 864e5, now = Date.now();
  const inactive = d.filter((s) => !s.an.last || now - s.an.last > 7 * DAY).length;
  const avg = d.length ? Math.round(d.reduce((n, s) => n + s.an.acc, 0) / d.length) : 0;
  const agg = {};
  d.forEach((s) =>
    s.an.rows.forEach((r) => {
      const y = agg[r.key] || (agg[r.key] = { key: r.key, label: r.label, a: 0, g: 0, p: 0, s: 0 });
      y.a += r.a; y.g += r.g; y.p += r.p; y.s += r.s;
    }),
  );
  const weakest = Object.values(agg).map((r) => ({ ...r, score: r.a ? (r.g + 0.5 * r.p) / r.a : 0 })).filter((r) => r.a >= 8).sort((a, b) => a.score - b.score).slice(0, 4);

  const exportCsv = () => {
    const rows = [['Name', 'Class', 'Email', 'Questions', 'Score %', 'Got it', 'Partly', 'Stuck', 'Streak', 'Last active']].concat(
      d.map((s) => [s.profile.name, s.profile.cls, s.profile.email || '', s.an.total, s.an.acc, s.an.got, s.an.partly, s.an.stuck, s.an.streak, s.an.last ? dayKey(new Date(s.an.last)) : '']),
    );
    const csv = rows.map((r) => r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aplus-progress-' + dayKey() + '.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const giveTo = (uids, k) =>
    setAll((L) => L.map((o) => (uids.includes(o.profile.uid) ? { ...o, progress: { ...o.progress, tokGift: ((o.progress || {}).tokGift || 0) + k } } : o)));
  const Head = ({ k, children }) => (
    <button onClick={() => setSort(k)} className="label bg-transparent border-0 text-left" style={{ color: sort === k ? 'var(--color-brand-500)' : undefined }}>{children}{sort === k ? ' ▾' : ''}</button>
  );

  return wrap(
    <>
      <NewsEditor />
      <div className="flex flex-wrap gap-1.5 mt-4 items-center">
        {['all'].concat(hub.classes).map((c) => <button key={c} onClick={() => { setCls(c); setOpen(null); }} className={'chip ' + (cls === c ? 'chip-on' : '')}>{c === 'all' ? 'All classes' : c}</button>)}
        <button onClick={exportCsv} className="btn btn-secondary btn-sm ml-auto"><IconDownload size={15} /> Export CSV</button>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <StatTile value={d.length} label="Students" />
        <StatTile value={avg + '%'} label="Average score" colour="#16a34a" />
        <StatTile value={inactive} label="Inactive 7+ days" colour={inactive ? '#dc2626' : '#16a34a'} />
      </div>
      {weakest.length > 0 && (
        <div>
          <SectionTitle>Weakest chapters for this group</SectionTitle>
          {weakest.map((r) => (
            <div key={r.key} className="flex justify-between rounded-xl px-3 py-2 mb-1.5 text-[14px]" style={{ background: 'var(--color-bad-100)', border: '1px solid rgba(220,38,38,.35)' }}>
              <span>{r.label}</span><b className="tnum">{Math.round(r.score * 100)}%</b>
            </div>
          ))}
        </div>
      )}
      <GiveAll count={d.length} onGive={async (k) => { for (const s of d) await hub.backend.giveTokens(s.profile.uid, k); giveTo(d.map((s) => s.profile.uid), k); }} />
      <SectionTitle>Students</SectionTitle>
      <Card className="p-2">
        <div className="grid gap-1.5 px-3 pb-1.5" style={{ gridTemplateColumns: '2fr 1fr 1fr 1.2fr' }}>
          <Head k="name">Name</Head><Head k="qs">Qs</Head><Head k="score">Score</Head><Head k="last">Last active</Head>
        </div>
        {d.map((s) => {
          const days = s.an.last ? Math.floor((now - s.an.last) / DAY) : null;
          const isOpen = open === s.profile.uid;
          return (
            <div key={s.profile.uid}>
              <button onClick={() => setOpen(isOpen ? null : s.profile.uid)} className="w-full grid gap-1.5 text-left rounded-lg px-3 py-2.5 text-[14px]" style={{ gridTemplateColumns: '2fr 1fr 1fr 1.2fr', background: isOpen ? 'var(--color-brand-50)' : 'transparent' }}>
                <span><b>{s.profile.name}</b> <span className="faint text-[12px]">{s.profile.cls === 'All students' ? s.profile.email || '' : s.profile.cls}</span></span>
                <span className="tnum">{s.an.total}</span>
                <span className="tnum font-bold" style={{ color: s.an.total ? scoreColour(s.an.acc / 100) : undefined }}>{s.an.total ? s.an.acc + '%' : '–'}</span>
                <span style={{ color: days === null || days > 7 ? 'var(--color-bad-500)' : undefined }}>{days === null ? 'never' : days === 0 ? 'today' : days + 'd ago'}</span>
              </button>
              {isOpen && (
                <div className="rounded-xl px-3 pt-3 pb-4 mb-2" style={{ background: 'var(--color-page)', border: '1px solid var(--color-line)' }}>
                  <div className="grid grid-cols-4 gap-2">
                    <StatTile value={s.an.total} label="Questions" />
                    <StatTile value={s.an.acc + '%'} label="Score" colour="#16a34a" />
                    <StatTile value={s.an.streak} label="Streak" colour="#d97706" icon={<IconFire size={14} />} />
                    <StatTile value={s.an.pts} label="Points" colour="var(--color-brand-500)" />
                  </div>
                  <GiveTokens name={s.profile.name} gifted={(s.progress || {}).tokGift} onGive={async (k) => { await hub.backend.giveTokens(s.profile.uid, k); giveTo([s.profile.uid], k); }} />
                  <SectionTitle>Needs work</SectionTitle>
                  <NeedsWork an={s.an} />
                  <SectionTitle>By chapter</SectionTitle>
                  <ChapterBars rows={s.an.rows} />
                  <SectionTitle>Last 14 days</SectionTitle>
                  <DaysChart days={s.an.days14} />
                </div>
              )}
            </div>
          );
        })}
        {!d.length && <Empty>No students in this class yet.</Empty>}
      </Card>
    </>,
  );
}
