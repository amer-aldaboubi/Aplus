/* Home noticeboard: From your teacher · Class activity · What's new */
import React, { useEffect, useState } from 'react';
import { useHub } from '../../app/HubContext';
import { useRouter } from '../../app/router';
import { ClassActivity } from './ClassActivity';
import { lsGet, lsSet } from '../../data/local';
import { ago } from '../../data/dates';
import { chapterLabel, LEVELS, subjectOfKey } from '../../data/subjects';
import { startChallenge } from '../../data/task';
import { badgeMeta } from '../../rewards/rewards';
import { Medal } from '../../rewards/Medal';
import { IconPencil } from '../../ui/Icons';
import { Empty } from '../../ui/primitives';

export const WHATS_NEW = [
  { d: 'Oct 2026', t: 'New look', x: 'A cleaner, faster Hub with a search box across every subject and a mobile tab bar.' },
  { d: '10 Oct', t: 'Medals and levels', x: 'Earn 12 medals and climb 7 levels as you practise. Tap your level on the home screen to see them.' },
  { d: '10 Oct', t: 'Game Zone', x: 'Every new badge gives you a token to spend on maths mini-games.' },
  { d: '10 Oct', t: 'Certificates', x: 'Print a certificate for every level you reach, signed by your teacher.' },
];

function Chip({ children, bg, fg }) {
  return <span className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-wider mt-0.5" style={{ background: bg, color: fg }}>{children}</span>;
}

export function Noticeboard() {
  const hub = useHub();
  const { go } = useRouter();
  const p = hub.profile || {};
  const guest = hub.isGuest;
  const [news, setNews] = useState(null);
  const [tab, setTab] = useState(null);
  const [seen, setSeen] = useState(() => +lsGet('ap-news-seen', 0) || 0);

  useEffect(() => {
    hub.backend && hub.backend.getNews ? hub.backend.getNews().then((v) => setNews(v || {})).catch(() => setNews({})) : setNews({});
  }, []);

  const items = ((news || {}).items || []).filter((i) => i.cls === 'All' || i.cls === p.cls || hub.isTeacher).sort((a, b) => (b.at || 0) - (a.at || 0));
  const feed = guest
    ? []
    : []
        .concat(
          ...(hub.board || [])
            .filter((b) => b.cls === p.cls)
            .map((b) => [
              b.lastB && Date.now() - b.lastB.at < 7 * 864e5 ? { t: 'b', b, at: b.lastB.at } : null,
              b.chal && Date.now() - b.chal.at < 4 * 864e5 ? { t: 'c', b, at: b.chal.at } : null,
            ]),
        )
        .filter(Boolean)
        .sort((a, b) => b.at - a.at)
        .slice(0, 8);
  const unseen = items.filter((i) => (i.at || 0) > seen).length;
  const tabs = [['teacher', 'From your teacher', unseen], ['badges', 'Class activity', 0], ['new', 'What’s new', 0]].filter((t) => !guest || t[0] !== 'badges');
  const cur = tab || (items.length ? 'teacher' : feed.length ? 'badges' : 'new');

  useEffect(() => {
    if (cur === 'teacher' && items.length) {
      const n = Date.now();
      lsSet('ap-news-seen', n);
    }
  }, [cur, items.length]);

  const row = { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderTop: '1px solid var(--color-line)' };

  let body;
  if (cur === 'teacher') {
    body = items.length ? (
      items.slice(0, 4).map((i) => {
        const due = i.due ? new Date(i.due + 'T23:59:00') : null;
        const soon = due && due - Date.now() < 1.5 * 864e5;
        return (
          <div key={i.id} style={row}>
            {i.kind === 'task' ? <Chip bg="var(--color-navy-800)" fg="#FFD86B">TASK</Chip> : <Chip bg="var(--color-brand-100)" fg="var(--color-brand-500)">NEWS</Chip>}
            <div className="flex-1 min-w-0">
              <div className="text-[14px] leading-snug" style={{ overflowWrap: 'anywhere' }}>
                {(i.at || 0) > seen && <span className="inline-block w-[7px] h-[7px] rounded-full mr-1.5 align-middle" style={{ background: 'var(--color-bad-500)' }} />}
                {i.text}
              </div>
              <div className="muted text-[12px] mt-1 flex gap-3 flex-wrap items-center">
                {due && <span style={{ color: soon ? 'var(--color-bad-500)' : undefined, fontWeight: soon ? 700 : 400 }}>Due {due.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>}
                {i.cls !== 'All' && <span>{i.cls}</span>}
                {i.link && (
                  <a
                    href={i.link}
                    onClick={(ev) => {
                      ev.preventDefault();
                      const u = new URL(i.link, location.href);
                      if (u.origin === location.origin && u.pathname === location.pathname) {
                        location.hash = u.hash;
                        location.reload();
                      } else window.open(u.href, '_blank', 'noopener');
                    }}
                    className="font-extrabold no-underline"
                    style={{ color: 'var(--color-brand-500)' }}
                  >
                    Start ›
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <Empty>No tasks or news from your teacher right now.</Empty>
    );
  } else if (cur === 'badges') {
    const feedEl = feed.length ? (
      feed.map((it) => {
        const b = it.b;
        const me = hub.user && b.uid === hub.user.uid;
        if (it.t === 'c') {
          const c = b.chal;
          const lv = LEVELS[c.d] || LEVELS[0];
          return (
            <div key={'c' + b.uid} style={{ ...row, alignItems: 'center' }}>
              <span className="flex items-center justify-center shrink-0 rounded-lg text-white" style={{ width: 30, height: 30, background: lv.c }}><IconPencil size={16} /></span>
              <div className="flex-1 min-w-0 text-[14px]">
                <b>{me ? 'You' : b.name}</b> challenged the class
                <div className="muted text-[12px]"><b style={{ color: lv.c }}>{lv.label}</b> · {chapterLabel(c.ck)} · {ago(c.at)}</div>
              </div>
              <button onClick={() => { startChallenge(c.k); go({ name: 'practice', sid: subjectOfKey(c.k), task: true }); }} className="btn btn-navy btn-sm">Solve ›</button>
            </div>
          );
        }
        const m = badgeMeta(b.lastB.id);
        return m ? (
          <div key={'b' + b.uid} style={{ ...row, alignItems: 'center' }}>
            <Medal b={m} size={30} />
            <div className="flex-1 text-[14px]"><b>{me ? 'You' : b.name}</b> earned <b style={{ color: 'var(--color-gold-500)' }}>{m.n}</b></div>
            <span className="faint text-[11px]">{ago(b.lastB.at)}</span>
          </div>
        ) : null;
      })
    ) : (
      <Empty>Nothing yet this week. Earn a badge or challenge your class!</Empty>
    );
    body = <ClassActivity news={news} setNews={setNews} feed={feedEl} />;
  } else {
    body = WHATS_NEW.map((w) => (
      <div key={w.t} style={row}>
        <Chip bg="var(--color-gold-100)" fg="#7E620E">NEW</Chip>
        <div className="flex-1">
          <div className="text-[14px] font-bold">{w.t}</div>
          <div className="muted text-[13px] leading-snug">{w.x}</div>
        </div>
        <span className="faint text-[11px] shrink-0">{w.d}</span>
      </div>
    ));
  }

  return (
    <div className="card p-4">
      <div className="flex gap-1.5 flex-wrap mb-2">
        {tabs.map(([k, l, n]) => (
          <button key={k} onClick={() => setTab(k)} className={'chip ' + (cur === k ? 'chip-on' : '')}>
            {l}
            {n > 0 && <span className="rounded-full text-white text-[10.5px] px-1.5 inline-flex items-center justify-center" style={{ minWidth: 17, height: 17, background: 'var(--color-bad-500)' }}>{n}</span>}
          </button>
        ))}
      </div>
      <div>{body}</div>
    </div>
  );
}
