/* Bento home: welcome card, noticeboard, subjects, quick links, reviews, site stats. */
import React from 'react';
import { useHub } from '../../app/HubContext';
import { useRouter } from '../../app/router';
import { LINKS } from '../../app/links';
import { SUBJECTS, SUBJECT_IDS, questionCount, questionsOf } from '../../data/subjects';
import { doneCount, doneStore, lsGet } from '../../data/local';
import { emit, EV } from '../../data/bus';
import { levelOf, LEVELS as RLEVELS } from '../../rewards/rewards';
import { Medal } from '../../rewards/Medal';
import { REVISIONS } from '../../data/revision';
import { startRevision } from '../../data/task';
import { subjectOfKey } from '../../data/subjects';
import { Noticeboard } from './Noticeboard';
import { Reviews } from './Reviews';
import { SiteStats } from '../auth/SignIn';
import { IconChevron, IconPrint, IconGame, IconChart, IconTeacher, IconFire, IconSpark } from '../../ui/Icons';
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
          <button onClick={() => go({ name: 'practice', sid: S.id })} className="btn btn-lg" style={{ background: '#fff', color: 'var(--color-navy-800)' }}>Continue {S.short} <IconChevron size={16} /></button>
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
        {!guest && <Item icon={IconGame} label="Game Zone" onClick={() => emit(EV.OPEN_GAMES)} colour="#D4A62A" />}
        {hub.isTeacher && <Item icon={IconTeacher} label="Teacher dashboard" onClick={() => go('teacher')} colour="#1B2F5E" />}
      </div>
    </div>
  );
}

function RevisionCard({ r }) {
  const { go } = useRouter();
  const start = () => {
    startRevision(r);
    go({ name: 'practice', sid: subjectOfKey(r.keys[0]), task: true });
  };
  return (
    <div className="card p-4 flex items-center gap-4" style={{ borderLeft: '5px solid #E8B923' }}>
      <div className="shrink-0 grid place-items-center rounded-xl" style={{ width: 48, height: 48, background: '#FFF4CC', color: '#8A6A00' }}>
        <IconSpark size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="label">Revision</div>
        <div className="font-extrabold text-[16px]">{r.title}</div>
        <div className="muted text-[12.5px]">{r.sub} · {r.keys.length} questions</div>
      </div>
      <button onClick={start} className="btn btn-navy btn-sm shrink-0">Start revision</button>
    </div>
  );
}

export function HomePage() {
  const hub = useHub();
  const total = SUBJECT_IDS.reduce((n, s) => n + questionCount(s), 0);
  return (
    <div className="mx-auto px-4 pt-5 pb-tabbar" style={{ maxWidth: 1200 }}>
      <WelcomeCard />

      <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
        <style>{`.bento-main{grid-column:span 12}.bento-side{grid-column:span 12}@media(min-width:900px){.bento-main{grid-column:span 8}.bento-side{grid-column:span 4}}`}</style>
        <div className="bento-main flex flex-col gap-4">
          {REVISIONS.map((r) => (
            <RevisionCard key={r.id} r={r} />
          ))}
          <Noticeboard />
          <div>
            <div className="flex flex-wrap items-end justify-between gap-x-3 mb-3">
              <h2 className="m-0 text-[18px] font-bold">Subjects</h2>
              <span className="muted text-[13px]">{total.toLocaleString()} past-paper questions with mark schemes</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(190px, 46%), 1fr))' }}>
              {SUBJECT_IDS.map((s, i) => (
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
          <QuickLinks />
          {!hub.isGuest && <Reviews />}
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
