/* Navy header, desktop menus, mobile bottom tab bar, and the global search overlay. */
import React, { useEffect, useRef, useState } from 'react';
import { useHub } from './HubContext';
import { useRouter } from './router';
import { SUBJECTS, SUBJECT_IDS } from '../data/subjects';
import { emit, EV } from '../data/bus';
import { levelOf } from '../rewards/rewards';
import { Medal } from '../rewards/Medal';
import { GlobalSearch } from '../features/search/GlobalSearch';
import { LINKS } from './links';
import { IconHome, IconGrid, IconSearch, IconChart, IconGame, IconDown, IconDoc, IconSlides, IconCalendar, IconTarget, IconChat, IconExam, IconLogout, IconTeacher, IconUser, IconPrint, IconLock, IconMenu, IconClose, IconSpark } from '../ui/Icons';


function useOutside(ref, onOut) {
  useEffect(() => {
    const f = (e) => ref.current && !ref.current.contains(e.target) && onOut();
    document.addEventListener('pointerdown', f);
    return () => document.removeEventListener('pointerdown', f);
  }, [ref, onOut]);
}

function Dropdown({ label, children, icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="nav-item" aria-expanded={open}>
        {icon}
        {label}
        <IconDown size={14} />
      </button>
      {open && (
        <div onClick={() => setOpen(false)} className="card anim-fade-up" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, minWidth: 240, padding: 6, zIndex: 60, boxShadow: 'var(--shadow-pop)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function MenuItem({ onClick, href, icon: Icon, children, colour }) {
  const cls = 'flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-[14px] font-medium hover:bg-brand-50 text-ink no-underline';
  const inner = (
    <>
      {Icon && (
        <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: colour ? colour + '22' : 'var(--color-page)', color: colour || 'var(--color-ink-muted)' }}>
          <Icon size={17} />
        </span>
      )}
      <span>{children}</span>
    </>
  );
  return href ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <button onClick={onClick} className={cls}>{inner}</button>
  );
}

export function GamesBadge({ dark }) {
  const hub = useHub();
  const t = hub.isTeacher ? '∞' : hub.rewards ? hub.rewards.tok + hub.rewards.pass : 0;
  return (
    <span className="tnum" style={{ minWidth: 18, height: 18, borderRadius: 9, background: t ? 'var(--color-gold-500)' : dark ? 'rgba(255,255,255,.25)' : 'var(--color-line)', color: '#1B2A4A', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
      {t}
    </span>
  );
}

export function Header({ onSearch }) {
  const hub = useHub();
  const { route, go } = useRouter();
  const [menu, setMenu] = useState(false);
  const p = hub.profile || {};
  const guest = hub.isGuest;
  const L = hub.rewards ? hub.rewards.L : levelOf(0);
  const extra = Object.entries(LINKS).filter(([, l]) => (l.teacher ? hub.isTeacher : guest ? l.guest : true));

  return (
    <>
      <style>{`
        .nav-item{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:9px;font-size:14px;font-weight:600;color:rgba(255,255,255,.88);background:transparent;text-decoration:none;white-space:nowrap}
        .nav-item:hover{background:rgba(255,255,255,.1);color:#fff}
        .nav-item.on{background:rgba(255,255,255,.16);color:#fff}
        .hdr-desktop{display:none}
        @media (min-width:900px){.hdr-desktop{display:flex}.hdr-mobile{display:none!important}}
      `}</style>
      <header className="no-print" style={{ background: 'var(--color-navy-800)', color: '#fff', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 0 rgba(255,255,255,.06), 0 2px 12px rgba(15,30,61,.25)' }}>
        <div className="mx-auto flex items-center gap-2 px-4" style={{ maxWidth: 1200, height: 60 }}>
          <button onClick={() => go('home')} className="flex items-center gap-2.5 bg-transparent border-0 p-0 text-white" aria-label="A+ Maths Hub home">
            <span className="flex items-center justify-center rounded-[10px] font-extrabold" style={{ width: 36, height: 36, background: 'var(--color-brand-500)', fontSize: 16 }}>A+</span>
            <span className="font-bold text-[17px] tracking-tight whitespace-nowrap">Maths Hub</span>
          </button>

          <nav className="hdr-desktop items-center gap-1 ml-4">
            <button onClick={() => go('home')} className={'nav-item ' + (route.name === 'home' ? 'on' : '')}>
              <IconHome size={17} /> Home
            </button>
            <Dropdown label="Subjects" icon={<IconGrid size={17} />}>
              {SUBJECT_IDS.map((s) => (
                <MenuItem key={s} onClick={() => go({ name: 'practice', sid: s })} colour={SUBJECTS[s].accent} icon={({ size }) => <span style={{ fontSize: 15, fontWeight: 800 }}>{SUBJECTS[s].emoji}</span>}>
                  {SUBJECTS[s].title}
                </MenuItem>
              ))}
            </Dropdown>
            <a href="worksheets.html" className="nav-item"><IconDoc size={17} /> Worksheets</a>
            <a href="exam.html" className="nav-item"><IconExam size={17} /> Exam practice</a>
            <Dropdown label="More">
              {extra.filter(([k]) => k !== 'worksheets' && k !== 'exam').map(([k, l]) => (
                <MenuItem key={k} href={l.href} icon={l.icon}>{l.label}</MenuItem>
              ))}
              <MenuItem href="pworksheets.html" icon={IconPrint}>Printable worksheets</MenuItem>
              {hub.isTeacher && <MenuItem onClick={() => go('teacher')} icon={IconTeacher} colour="#2F6FE4">Teacher dashboard</MenuItem>}
            </Dropdown>
          </nav>

          <div className="flex-1" />

          <button onClick={onSearch} className="hdr-desktop items-center gap-2 rounded-[10px] px-3 text-left" style={{ height: 38, width: 240, background: 'rgba(255,255,255,.12)', color: 'rgba(255,255,255,.75)', fontSize: 14 }}>
            <IconSearch size={17} />
            <span className="whitespace-nowrap">Search questions…</span>
            <span className="ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,.14)' }}>/</span>
          </button>
          <button onClick={onSearch} className="hdr-mobile btn btn-ghost btn-sm text-white" aria-label="Search" style={{ color: '#fff' }}>
            <IconSearch size={22} />
          </button>

          {!guest && (
            <button onClick={() => emit(EV.OPEN_GAMES)} className="hdr-desktop nav-item" title="Game Zone">
              <IconGame size={18} /> Games <GamesBadge dark />
            </button>
          )}

          <div className="hdr-desktop items-center gap-2 ml-1">
            {guest ? (
              <button onClick={hub.signOut} className="btn btn-sm" style={{ background: 'var(--color-brand-500)', color: '#fff' }}>Sign in</button>
            ) : (
              <>
                <button onClick={() => go('progress')} className="flex items-center gap-2 rounded-[10px] px-2 py-1 text-left text-white" style={{ background: route.name === 'progress' ? 'rgba(255,255,255,.16)' : 'transparent' }} title="My progress">
                  <Medal b={L.cur} size={32} shape="hex" />
                  <span className="leading-tight">
                    <span className="block text-[13px] font-bold">{p.name}</span>
                    <span className="block text-[11px]" style={{ color: 'rgba(255,255,255,.7)' }}>{L.cur.n}{p.cls && p.cls !== 'All students' ? ' · ' + p.cls : ''}</span>
                  </span>
                </button>
                <button onClick={hub.signOut} className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,.75)' }} title="Sign out"><IconLogout size={18} /></button>
              </>
            )}
          </div>

          <button onClick={() => setMenu(true)} className="hdr-mobile btn btn-ghost btn-sm" aria-label="Menu" style={{ color: '#fff' }}>
            <IconMenu size={24} />
          </button>
        </div>
      </header>

      {menu && (
        <div className="hdr-mobile" style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex' }}>
          <div onClick={() => setMenu(false)} style={{ flex: 1, background: 'rgba(15,30,61,.5)' }} />
          <div className="anim-slide-in bg-card" style={{ width: '82vw', maxWidth: 340, height: '100%', overflowY: 'auto', animationName: 'fade-in', borderLeft: '1px solid var(--color-line)' }}>
            <div className="flex items-center justify-between p-4" style={{ background: 'var(--color-navy-800)', color: '#fff' }}>
              <div className="flex items-center gap-3">
                {!guest ? <Medal b={L.cur} size={40} shape="hex" /> : <IconUser size={28} />}
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-[12px]" style={{ color: 'rgba(255,255,255,.7)' }}>{guest ? 'Guest' : L.cur.n + (p.cls && p.cls !== 'All students' ? ' · ' + p.cls : '')}</div>
                </div>
              </div>
              <button onClick={() => setMenu(false)} className="btn btn-ghost btn-sm" style={{ color: '#fff' }} aria-label="Close"><IconClose size={22} /></button>
            </div>
            <div className="p-2" onClick={() => setMenu(false)}>
              <div className="label px-3 pt-2 pb-1">Subjects</div>
              {SUBJECT_IDS.map((s) => (
                <MenuItem key={s} onClick={() => go({ name: 'practice', sid: s })} colour={SUBJECTS[s].accent} icon={() => <span style={{ fontSize: 15, fontWeight: 800 }}>{SUBJECTS[s].emoji}</span>}>{SUBJECTS[s].title}</MenuItem>
              ))}
              <div className="label px-3 pt-3 pb-1">More</div>
              {extra.map(([k, l]) => (
                <MenuItem key={k} href={l.href} icon={l.icon}>{l.label}</MenuItem>
              ))}
              <MenuItem href="pworksheets.html" icon={IconPrint}>Printable worksheets</MenuItem>
              {hub.isTeacher && <MenuItem onClick={() => go('teacher')} icon={IconTeacher} colour="#2F6FE4">Teacher dashboard</MenuItem>}
              <div className="border-t my-2" style={{ borderColor: 'var(--color-line)' }} />
              <MenuItem onClick={hub.signOut} icon={guest ? IconUser : IconLogout}>{guest ? 'Sign in' : 'Sign out'}</MenuItem>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function BottomTabs({ onSearch }) {
  const hub = useHub();
  const { route, go } = useRouter();
  const guest = hub.isGuest;
  const Tab = ({ on, onClick, icon, label, badge }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-0.5 flex-1 bg-transparent border-0 relative" style={{ color: on ? 'var(--color-brand-500)' : 'var(--color-ink-muted)', fontSize: 11, fontWeight: 600, padding: '8px 0 4px' }}>
      <span style={{ position: 'relative' }}>
        {icon}
        {badge && <span style={{ position: 'absolute', top: -6, right: -12 }}>{badge}</span>}
      </span>
      {label}
    </button>
  );
  return (
    <nav className="hdr-mobile no-print" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50, background: '#fff', borderTop: '1px solid var(--color-line)', paddingBottom: 'env(safe-area-inset-bottom, 0px)', boxShadow: '0 -4px 16px rgba(15,30,61,.06)' }}>
      <div className="flex">
        <Tab on={route.name === 'home'} onClick={() => go('home')} icon={<IconHome size={22} />} label="Home" />
        <Tab on={route.name === 'practice'} onClick={() => go({ name: 'practice', sid: route.sid || 'm' })} icon={<IconGrid size={22} />} label="Subjects" />
        <Tab onClick={onSearch} icon={<IconSearch size={22} />} label="Search" />
        {guest ? (
          <Tab onClick={hub.signOut} icon={<IconUser size={22} />} label="Sign in" />
        ) : (
          <Tab on={route.name === 'progress'} onClick={() => go('progress')} icon={<IconChart size={22} />} label="Progress" />
        )}
        {!guest && <Tab onClick={() => emit(EV.OPEN_GAMES)} icon={<IconGame size={22} />} label="Games" badge={<GamesBadge />} />}
      </div>
    </nav>
  );
}
