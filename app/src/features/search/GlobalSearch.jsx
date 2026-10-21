/* Global search across all subjects: subjects, chapters, questions (series / paper / number / marks) and the other Hub pages. */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SUBJECTS, SUBJECT_IDS, chapters, questionsOf, LEVELS } from '../../data/subjects';
import { useRouter } from '../../app/router';
import { useHub } from '../../app/HubContext';
import { LINKS } from '../../app/links';
import { IconSearch, IconClose, IconChevron } from '../../ui/Icons';

let INDEX = null;
function buildIndex() {
  if (INDEX) return INDEX;
  const items = [];
  SUBJECT_IDS.forEach((sid) => {
    const S = SUBJECTS[sid];
    items.push({ type: 'subject', sid, title: S.title, sub: S.sub, text: (S.title + ' ' + S.short + ' ' + S.sub).toLowerCase() });
    chapters(sid).forEach((t) => {
      items.push({ type: 'chapter', sid, tc: t.c, title: t.c + '. ' + t.n, sub: S.short + ' · ' + t.q.length + ' questions', text: (S.short + ' ' + S.title + ' ' + t.c + ' ' + t.n).toLowerCase() });
    });
    questionsOf(sid).forEach((q) => {
      const title = q.s + ' · ' + q.p + ' · Q' + q.n;
      items.push({ type: 'question', sid, tc: q.tc, key: q.k, d: q.d, title, sub: S.short + ' · ' + q.tc + ' ' + q.tn + ' · ' + q.m + ' mark' + (q.m === 1 ? '' : 's'), text: (S.short + ' ' + S.title + ' ' + q.tn + ' ' + title + ' ' + q.s.replace(/\s/g, '') + ' q' + q.n + ' ' + LEVELS[q.d].label).toLowerCase() });
    });
  });
  INDEX = items;
  return items;
}

function search(query, isGuest, isTeacher) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);
  const hits = [];
  const pages = Object.values(LINKS).filter((l) => (l.teacher ? isTeacher : isGuest ? l.guest : true));
  pages.forEach((l) => {
    if (words.every((w) => l.label.toLowerCase().includes(w))) hits.push({ type: 'page', title: l.label, sub: 'Open page', href: l.href, score: 5 });
  });
  for (const it of buildIndex()) {
    if (!words.every((w) => it.text.includes(w))) continue;
    const score = (it.type === 'subject' ? 3 : it.type === 'chapter' ? 2 : 0) + (it.title.toLowerCase().startsWith(q) ? 2 : 0);
    hits.push({ ...it, score });
    if (hits.length > 400) break;
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 40);
}

export function GlobalSearch({ onClose }) {
  const { go } = useRouter();
  const hub = useHub();
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const input = useRef(null);
  const results = useMemo(() => search(q, hub.isGuest, hub.isTeacher), [q, hub.isGuest, hub.isTeacher]);

  useEffect(() => {
    input.current && input.current.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  useEffect(() => setCursor(0), [q]);

  const open = (r) => {
    if (!r) return;
    if (r.type === 'page') location.href = r.href;
    else if (r.type === 'subject') go({ name: 'practice', sid: r.sid });
    else go({ name: 'practice', sid: r.sid, tc: r.tc, key: r.key });
    onClose();
  };

  const onKey = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') setCursor((c) => Math.min(results.length - 1, c + 1));
    else if (e.key === 'ArrowUp') setCursor((c) => Math.max(0, c - 1));
    else if (e.key === 'Enter') open(results[cursor]);
  };

  const colour = (r) => (r.sid ? SUBJECTS[r.sid].accent : 'var(--color-brand-500)');
  const tag = (r) => (r.type === 'question' ? LEVELS[r.d].label : r.type === 'chapter' ? 'Chapter' : r.type === 'subject' ? 'Subject' : 'Page');

  return (
    <div onClick={onClose} className="anim-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(15,30,61,.55)', padding: '6vh 12px', overflowY: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} className="card anim-pop mx-auto" style={{ maxWidth: 640, boxShadow: 'var(--shadow-pop)', overflow: 'hidden' }}>
        <div className="flex items-center gap-3 px-4" style={{ height: 56, borderBottom: '1px solid var(--color-line)' }}>
          <IconSearch size={20} style={{ color: 'var(--color-ink-muted)' }} />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search chapters, papers, questions… e.g. “vectors”, “June 2023 paper 2”, “stats 1 hypothesis”" className="flex-1 border-0 outline-none text-[16px] bg-transparent" aria-label="Search" />
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close"><IconClose size={20} /></button>
        </div>
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {!q && (
            <div className="p-4">
              <div className="label mb-2">Browse a subject</div>
              <div className="grid grid-cols-2 gap-2">
                {SUBJECT_IDS.map((s) => (
                  <button key={s} onClick={() => open({ type: 'subject', sid: s })} className="flex items-center gap-2 text-left rounded-lg px-3 py-2 hover:bg-brand-50" style={{ border: '1px solid var(--color-line)' }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: SUBJECTS[s].accent }} />
                    <span className="text-[13.5px] font-semibold">{SUBJECTS[s].title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {q && !results.length && <div className="p-6 text-center muted">No matches for “{q}”.</div>}
          {results.map((r, i) => (
            <button key={(r.key || r.href || r.sid + (r.tc || '')) + i} onMouseEnter={() => setCursor(i)} onClick={() => open(r)} className="flex items-center gap-3 w-full text-left px-4 py-2.5" style={{ background: i === cursor ? 'var(--color-brand-50)' : 'transparent', borderTop: '1px solid var(--color-line)' }}>
              <span className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ background: colour(r) + '22', color: colour(r), minWidth: 64, textAlign: 'center' }}>{tag(r)}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[14.5px] font-semibold truncate">{r.title}</span>
                <span className="block text-[12.5px] muted truncate">{r.sub}</span>
              </span>
              <IconChevron size={16} style={{ color: 'var(--color-ink-faint)' }} />
            </button>
          ))}
        </div>
        <div className="px-4 py-2 text-[11.5px] faint flex gap-4" style={{ borderTop: '1px solid var(--color-line)' }}>
          <span>↑↓ to move</span><span>Enter to open</span><span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
