/* Bento home: welcome card, noticeboard, subjects, quick links, reviews, site stats. */
import React, { useState } from 'react';
import { useHub } from '../../app/HubContext';
import { useRouter } from '../../app/router';
import { LINKS } from '../../app/links';
import { SUBJECTS, SUBJECT_IDS, questionCount, questionsOf } from '../../data/subjects';
import { doneCount, doneStore, lsGet, lsSet, lsJson } from '../../data/local';
import { emit, EV } from '../../data/bus';
import { levelOf, LEVELS as RLEVELS } from '../../rewards/rewards';
import { Medal } from '../../rewards/Medal';
import { REVISIONS } from '../../data/revision';
import { THIS_WEEK } from '../../data/thisweek';
import { startRevision } from '../../data/task';
import { subjectOfKey, chapterName, chapters, questionByCode } from '../../data/subjects';
import { Noticeboard } from './Noticeboard';
export { ActivityHomeCard } from './ClassActivity';
import { Reviews } from './Reviews';
import { SiteStats } from '../auth/SignIn';
import { IconChevron, IconBook, IconPrint, IconGame, IconChart, IconTeacher, IconFire, IconSpark } from '../../ui/Icons';
import { ProgressBar } from '../../ui/primitives';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

function LevelRing({ frac, size = 84, children }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FFD86B" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0.02, Math.min(1, frac)))} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset .6s' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function WelcomeCard() {
  const hub = useHub();
  const { go } = useRouter();
  const p = hub.profile || {};
  const guest = hub.isGuest;
  const c = hub.rewards;
  const L = c ? c.L : levelOf(0);
  const first = guest ? '' : (p.name || '').split(' ')[0];
  const lastSid = lsGet('aplus-last-sid', 'm');
  const S = SUBJECTS[lastSid] || SUBJECTS.m;
  const last = lsJson('aplus-last', null);
  const lastTopic = last && SUBJECTS[last.sid] ? chapters(last.sid).find((t) => t.c === last.tc) : null;
  return (
    <div className="rounded-[18px] p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-navy-800) 0%, var(--color-navy-600) 100%)' }}>
      <div className="absolute rounded-full" style={{ right: -60, bottom: -90, width: 300, height: 300, background: 'rgba(255,255,255,.06)' }} />
      <div className="relative flex flex-wrap items-center gap-5">
        {!guest && (
          <LevelRing frac={L.frac}>
            <Medal b={L.cur} size={52} shape="hex" />
          </LevelRing>
        )}
        <div className="flex-1 min-w-[200px]">
          <div className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,.75)' }}>{greeting()}{p.cls && p.cls !== 'All students' && p.cls !== 'Guest' ? ' · ' + p.cls : ''}</div>
          <h1 className="m-0 mt-0.5 font-extrabold leading-tight" style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>Welcome back{first ? ', ' + first : ''}</h1>
          {guest ? (
            <p className="m-0 mt-2 text-[14px]" style={{ color: 'rgba(255,255,255,.85)' }}>You’re practising as a guest. Sign in with your school account to save progress, earn medals and join the class leaderboard.</p>
          ) : c ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[14px]">
              <span><b style={{ color: '#FFD86B' }}>{L.cur.n}</b> · {c.an.pts} points</span>
              <span className="inline-flex items-center gap-1"><IconFire size={15} /> {c.an.streak} day streak</span>
              <span>{c.an.total} questions · {c.an.acc}% score</span>
              {L.next && <span style={{ color: 'rgba(255,255,255,.75)' }}>{L.next.p - c.an.pts} pts to {L.next.n}</span>}
            </div>
          ) : (
            <p className="m-0 mt-2 text-[14px]" style={{ color: 'rgba(255,255,255,.85)' }}>Pick a subject below and mark yourself honestly after each question.</p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => (lastTopic ? go({ name: 'practice', sid: last.sid, tc: last.tc, key: last.key }) : go({ name: 'practice', sid: S.id }))} className="btn btn-lg" style={{ background: '#fff', color: 'var(--color-navy-800)' }}>{lastTopic ? 'Continue where you left off' : 'Continue ' + S.short} <IconChevron size={16} /></button>
          {guest ? (
            <button onClick={hub.signOut} className="btn btn-lg" style={{ background: 'var(--color-brand-500)', color: '#fff' }}>Sign in</button>
          ) : (
            <button onClick={() => go('progress')} className="btn btn-lg" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }}><IconChart size={17} /> My progress</button>
          )}
        </div>
      </div>
    </div>
  );
}

const PATHS = [
  { id: 'igcse', label: 'IGCSE Maths & FPM', sids: ['m', 'f'] },
  { id: 'ial', label: 'A Level (S1, P1, M1, S2)', sids: ['s', 'p', 'mm', 's2'] },
  { id: 'sci', label: 'Sciences', sids: ['ph', 'cm', 'bi', 'bs', 'hi'] },
];
function useFocus() {
  const hub = useHub();
  const cls = String((hub.profile || {}).cls || '');
  const dflt = /1[23]/.test(cls) ? 'ial' : 'igcse';
  const [f, setF] = useState(() => lsGet('aplus-focus', ''));
  const cur = PATHS.find((x) => x.id === f) ? f : f === 'all' ? 'all' : dflt;
  return [cur, (v) => { setF(v); lsSet('aplus-focus', v); }];
}
function sidsOf(focus) {
  const p = PATHS.find((x) => x.id === focus);
  return p ? p.sids : SUBJECT_IDS;
}

function QuickActions({ focus }) {
  const { go } = useRouter();
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const sids = sidsOf(focus);
  const main = sids[0];
  const quick10 = () => {
    const pool = sids.flatMap((s) => questionsOf(s));
    const picks = [];
    const used = new Set();
    while (picks.length < Math.min(10, pool.length)) {
      const q = pool[Math.floor(Math.random() * pool.length)];
      if (!used.has(q.k)) { used.add(q.k); picks.push(q.k); }
    }
    startRevision({ id: 'quick10', title: 'Quick 10' }, picks, 'Quick 10');
    go({ name: 'practice', sid: subjectOfKey(picks[0]), task: true });
  };
  const find = (e) => {
    e.preventDefault();
    const q = questionByCode(code);
    if (q) go({ name: 'practice', sid: q.sid || subjectOfKey(q.k), tc: q.tc, key: q.k });
    else setErr('No question with that code. A code is 7 digits, like 1001001.');
  };
  const Big = ({ onClick, title, sub, colour }) => (
    <button onClick={onClick} className="card text-left p-4 flex flex-col gap-1 hover:-translate-y-0.5 transition-transform" style={{ borderLeft: '5px solid ' + colour, minHeight: 84 }}>
      <span className="font-extrabold text-[17px] leading-tight">{title}</span>
      <span className="muted text-[13px]">{sub}</span>
    </button>
  );
  return (
    <div className="mt-4">
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(230px, 100%), 1fr))' }}>
        <Big colour="#2F6FE4" title="Practise a topic" sub="Pick a chapter, solve, then check the mark scheme" onClick={() => go({ name: 'practice', sid: main })} />
        <Big colour="#16A34A" title="Quick 10" sub="10 mixed questions, started in one tap" onClick={quick10} />
        <form onSubmit={find} className="card p-4 flex flex-col gap-2" style={{ borderLeft: '5px solid #D97706', minHeight: 84 }}>
          <label htmlFor="codebox" className="font-extrabold text-[17px] leading-tight">Find a question by code</label>
          <div className="flex gap-2">
            <input id="codebox" inputMode="numeric" value={code} onChange={(e) => { setCode(e.target.value); setErr(''); }} placeholder="e.g. 1001001" className="flex-1 min-w-0 rounded-lg px-3 py-2 text-[16px]" style={{ border: '1px solid var(--color-line-strong)' }} />
            <button type="submit" className="btn btn-navy">Go</button>
          </div>
          {err && <span className="text-[12.5px]" style={{ color: 'var(--color-bad-500)' }}>{err}</span>}
        </form>
      </div>
    </div>
  );
}

function FocusChips({ focus, setFocus }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4" role="group" aria-label="What are you studying?">
      <span className="label mr-1">I’m studying</span>
      {PATHS.map((p) => (
        <button key={p.id} onClick={() => setFocus(p.id)} className={'chip ' + (focus === p.id ? 'chip-on' : '')}>{p.label}</button>
      ))}
      <button onClick={() => setFocus('all')} className={'chip ' + (focus === 'all' ? 'chip-on' : '')}>Show everything</button>
    </div>
  );
}

function ThisWeekCard() {
  const { go } = useRouter();
  const w = THIS_WEEK;
  if (!w || !w.keys || !w.keys.length) return null;
  const start = () => {
    startRevision({ id: 'thisweek', title: w.title }, w.keys, w.title);
    go({ name: 'practice', sid: subjectOfKey(w.keys[0]), task: true });
  };
  return (
    <div className="card p-4 mt-4 flex items-center gap-4 flex-wrap" style={{ borderLeft: '5px solid #E8B923' }}>
      <div className="min-w-0 flex-1">
        <div className="label">This week{w.due ? ' · due ' + w.due : ''}</div>
        <div className="font-extrabold text-[17px]">{w.title}</div>
        {w.note && <div className="muted text-[13px]">{w.note} · {w.keys.length} questions</div>}
      </div>
      <button onClick={start} className="btn btn-navy btn-lg">Start</button>
    </div>
  );
}

function SubjectTile({ sid, i }) {
  const { go } = useRouter();
  const S = SUBJECTS[sid];
  const total = questionCount(sid);
  const done = doneStore();
  const marked = questionsOf(sid).filter((q) => done[q.k]).length;
  return (
    <button onClick={() => go({ name: 'practice', sid })} className="card text-left p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform anim-fade-up" style={{ animationDelay: i * 40 + 'ms', borderTop: '4px solid ' + S.accent }}>
      <div className="flex items-center justify-between">
        <span className="flex items-center justify-center rounded-xl font-extrabold text-[18px]" style={{ width: 40, height: 40, background: S.soft, color: S.dark }}>{S.emoji}</span>
        <span className="label">{total} q</span>
      </div>
      <div>
        <div className="font-bold text-[15px] leading-tight">{S.title}</div>
        <div className="muted text-[12px] mt-0.5">{S.sub}</div>
      </div>
      {marked > 0 && (
        <div className="mt-auto">
          <ProgressBar frac={marked / total} colour={S.accent} height={6} />
          <div className="faint text-[11px] mt-1">{marked} marked</div>
        </div>
      )}
    </button>
  );
}

function QuickLinks() {
  const hub = useHub();
  const { go } = useRouter();
  const guest = hub.isGuest;
  const links = Object.entries(LINKS).filter(([, l]) => (l.teacher ? hub.isTeacher : guest ? l.guest : true));
  const colours = ['#2F6FE4', '#7C3AED', '#0D9488', '#D97706', '#DB2777', '#16A34A', '#DC2626'];
  const Item = ({ icon: Icon, label, href, onClick, colour }) => {
    const inner = (
      <>
        <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 40, height: 40, background: colour + '1f', color: colour }}><Icon size={20} /></span>
        <span className="font-semibold text-[14px]">{label}</span>
        <IconChevron size={16} className="ml-auto" style={{ marginLeft: 'auto', color: 'var(--color-ink-faint)' }} />
      </>
    );
    const cls = 'flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-brand-50 no-underline text-ink';
    return href ? <a href={href} className={cls}>{inner}</a> : <button onClick={onClick} className={cls}>{inner}</button>;
  };
  return (
    <div className="card p-3">
      <div className="label px-2 pt-1 pb-2">Quick links</div>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
        {links.map(([k, l], i) => (
          <Item key={k} icon={l.icon} label={l.label} href={l.href} colour={colours[i % colours.length]} />
        ))}
        <Item icon={IconPrint} label="Printable worksheets" href="pworksheets.html" colour="#64748B" />
        <Item icon={IconBook} label="Notes (worksheets & homework)" href="notes.html" colour="#2E7D4F" />
        {!guest && <Item icon={IconGame} label="Game Zone" onClick={() => emit(EV.OPEN_GAMES)} colour="#D4A62A" />}
        {hub.isTeacher && <Item icon={IconTeacher} label="Teacher dashboard" onClick={() => go('teacher')} colour="#1B2F5E" />}
      </div>
    </div>
  );
}

function revisionParts(r) {
  if (r.groups) return r.groups.map((g) => ({ ...g, sid: subjectOfKey(g.keys[0]), label: 'Ch ' + g.code }));
  const m = new Map();
  r.keys.forEach((k) => {
    const sid = subjectOfKey(k);
    const code = k.slice(sid.length, sid.length + 2);
    if (!m.has(code)) m.set(code, { code, sid, keys: [] });
    m.get(code).keys.push(k);
  });
  return [...m.values()].sort((x, y) => x.code.localeCompare(y.code)).map((p) => ({ ...p, name: chapterName(p.sid, p.code) }));
}

export function RevisionCard({ r }) {
  const { go } = useRouter();
  const [open, setOpen] = useState(false);
  const parts = revisionParts(r);
  const start = (keys, label) => {
    startRevision(r, keys, label);
    go({ name: 'practice', sid: subjectOfKey(keys[0]), task: true });
  };
  return (
    <div className="card p-4" style={{ borderLeft: '5px solid #E8B923' }}>
      <div className="flex items-center gap-4">
        <div className="shrink-0 grid place-items-center rounded-xl" style={{ width: 48, height: 48, background: '#FFF4CC', color: '#8A6A00' }}>
          <IconSpark size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="label">Revision</div>
          <div className="font-extrabold text-[16px]">{r.title}</div>
          <div className="muted text-[12.5px]">{r.sub} · {r.keys.length} questions</div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button onClick={() => start(r.keys)} className="btn btn-navy btn-sm">Start all</button>
          <button onClick={() => setOpen(!open)} className="btn btn-sm">{open ? 'Hide topics' : 'By topic'}</button>
        </div>
      </div>
      {open && (
        <div className="grid gap-2 mt-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))' }}>
          {parts.map((p) => (
            <button key={p.code} onClick={() => start(p.keys, p.label ? p.label + ' ' + p.name : 'Ch ' + p.code + ' ' + p.name)} className="card p-3 text-left" style={{ cursor: 'pointer' }}>
              <div className="label">{p.label || 'Chapter ' + p.code}</div>
              <div className="font-bold text-[14px]">{p.name}</div>
              <div className="muted text-[12.5px]">{p.keys.length} questions · tap to start</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function BreakingNewsCard() {
  return (
    <a href="revision.html" className="bn-card" style={{ textDecoration: 'none', color: '#fff' }}>
      <style>{`.bn-card{display:block;border-radius:14px;overflow:hidden;background:#12161f;box-shadow:0 2px 10px rgba(0,0,0,.18)}
.bn-top{display:flex;align-items:center;gap:10px;background:#C8102E;padding:7px 14px}
.bn-tag{background:#fff;color:#C8102E;font-weight:900;letter-spacing:.08em;font-size:12px;padding:3px 9px;border-radius:4px}
.bn-dot{width:9px;height:9px;border-radius:50%;background:#fff;animation:bnp 1.1s infinite}
@keyframes bnp{0%,100%{opacity:1}50%{opacity:.25}}
.bn-live{font-weight:800;font-size:12px;letter-spacing:.1em}
.bn-body{padding:14px 16px 12px}
.bn-h{font-size:clamp(20px,4.6vw,28px);font-weight:900;line-height:1.15;margin:0 0 6px;text-transform:uppercase}
.bn-p{margin:0 0 10px;font-size:14px;opacity:.9}
.bn-btn{display:inline-block;background:#FFD200;color:#12161f;font-weight:900;border-radius:8px;padding:8px 14px;font-size:14px}
.bn-tick{background:#000;color:#FFD200;font-weight:700;font-size:12.5px;padding:6px 0;white-space:nowrap;overflow:hidden}
.bn-tick span{display:inline-block;padding-left:100%;animation:bnt 28s linear infinite}
@keyframes bnt{to{transform:translateX(-100%)}}
@media (prefers-reduced-motion:reduce){.bn-dot,.bn-tick span{animation:none}.bn-tick span{padding-left:12px}}`}</style>
      <div className="bn-top"><span className="bn-tag">BREAKING</span><span className="bn-dot" /><span className="bn-live">YEAR 10 · TERM 1 FINAL EXAM REVISION</span></div>
      <div className="bn-body">
        <h3 className="bn-h">Term 1 final exam revision is now open</h3>
        <p className="bn-p">28 topics with worked examples and past-paper questions. Try the worksheet, then check yourself with the mark scheme.</p>
        <span className="bn-btn">Start revising →</span>
      </div>
      <div className="bn-tick"><span>NUMBER · ALGEBRA · EQUATIONS · SURDS · INDICES · ANGLES · PYTHAGORAS · CIRCLES · AREA · GRAPHS · GRADIENTS  ★  WORKSHEETS + MARK SCHEMES READY  ★  PRACTISE NOW, SIT THE EXAM WITH CONFIDENCE  ★</span></div>
    </a>
  );
}

export function HomePage() {
  const hub = useHub();
  const [focus, setFocus] = useFocus();
  const [showAll, setShowAll] = useState(false);
  const total = SUBJECT_IDS.reduce((n, s) => n + questionCount(s), 0);
  const sids = sidsOf(focus);
  return (
    <div className="mx-auto px-4 pt-5 pb-tabbar" style={{ maxWidth: 1200 }}>
      <WelcomeCard />
      <ThisWeekCard />
      <QuickActions focus={focus} />
      <FocusChips focus={focus} setFocus={setFocus} />

      <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
        <style>{`.bento-main{grid-column:span 12}.bento-side{grid-column:span 12}@media(min-width:900px){.bento-main{grid-column:span 8}.bento-side{grid-column:span 4}}`}</style>
        <div className="bento-main flex flex-col gap-4">
          <Noticeboard />
          <div>
            <div className="flex flex-wrap items-end justify-between gap-x-3 mb-3">
              <h2 className="m-0 text-[18px] font-bold">Subjects</h2>
              <span className="muted text-[13px]">{sids.reduce((n, s) => n + questionCount(s), 0).toLocaleString()} past-paper questions with mark schemes</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(190px, 46%), 1fr))' }}>
              {sids.map((s, i) => (
                <SubjectTile key={s} sid={s} i={i} />
              ))}
            </div>
          </div>
        </div>
        <div className="bento-side flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center"><div className="text-[20px] font-extrabold tnum">{total.toLocaleString()}</div><div className="label">Questions</div></div>
            <div className="card p-3 text-center"><div className="text-[20px] font-extrabold tnum">{total.toLocaleString()}</div><div className="label">Mark schemes</div></div>
            <div className="card p-3 text-center"><div className="text-[20px] font-extrabold tnum" style={{ color: 'var(--color-ok-500)' }}>{doneCount()}</div><div className="label">You’ve marked</div></div>
          </div>
          {!hub.isGuest && <Reviews />}
          <QuickLinks />
          <div className="card p-3">
            <div className="label mb-2">A+ Maths Hub</div>
            <SiteStats compact />
            <div className="faint text-[12px] mt-3">Created by Dr. Amer Al-Daboubi · Pearson Edexcel IGCSE &amp; IAL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
