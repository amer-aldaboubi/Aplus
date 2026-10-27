/* Left panel: subject switcher, paper + level filters, chapters with grouped questions — or the task list in task mode. */
import React, { useState } from 'react';
import { SUBJECTS, SUBJECT_IDS, LEVELS, CHAPTER_COLOURS, shortSeries, paperNumber, groupQuestions } from '../../data/subjects';
import { doneState } from '../../data/local';
import { IconDown, IconPrint, IconCheck } from '../../ui/Icons';

const dotColour = (st) => (st === 'full' ? '#16a34a' : st === 'part' ? '#d97706' : st === 'zero' ? '#dc2626' : 'transparent');

export function TaskSidebar({ task, questions, states, current, onPick, S }) {
  const done = questions.filter((q) => states[q.k] && states[q.k].done).length;
  return (
    <div className="flex flex-col h-full">
      <div className="label px-4 pt-4 pb-2">{task.title || (task.ch ? 'Challenge' : 'Your class task')} · {done} of {questions.length} done</div>
      <div className="px-3 grid gap-1.5">
        {questions.map((q, i) => {
          const on = current === q.k;
          const fin = states[q.k] && states[q.k].done;
          return (
            <button key={q.k} onClick={() => onPick(q.k)} className="text-left rounded-lg px-3 py-2.5 text-[14px] font-semibold" style={{ background: on ? S.accent : '#fff', color: on ? S.ink : 'var(--color-ink)', border: '1px solid ' + (on ? S.accent : 'var(--color-line)') }}>
              {fin ? '✓ ' : ''}{i + 1}. {q.s} · {q.p.replace('Paper ', 'P')} · Q{q.n} · {q.m}m <span className="opacity-60 tnum">· {q.code}</span>
            </button>
          );
        })}
      </div>
      <div className="muted text-[12px] p-4">Work on paper if you need to, type your answer, then tap Mark as done. Your teacher will release the mark scheme when the class is ready.</div>
    </div>
  );
}

export function ChapterSidebar({ sid, setSid, chapters, questions, paper, setPaper, level, setLevel, topic, setTopic, current, onPick, ordered, S }) {
  const [subjOpen, setSubjOpen] = useState(false);
  const filt = (q) => (paper === 'all' || paperNumber(q.p) === paper) && (level < 0 || q.d === level);
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2">
        <button onClick={() => setSubjOpen(!subjOpen)} className="w-full flex items-center gap-2 text-left rounded-xl px-3 py-2.5 font-bold text-[14px]" style={{ background: S.accent, color: S.ink }} aria-expanded={subjOpen}>
          <span className="flex-1">{S.title}</span>
          <span className="text-[11px] font-semibold opacity-80">change</span>
          <IconDown size={16} />
        </button>
        {subjOpen && (
          <div className="grid gap-1 mt-1.5 anim-fade-up">
            {SUBJECT_IDS.filter((x) => x !== sid).map((x) => (
              <button key={x} onClick={() => { setSubjOpen(false); setSid(x); }} className="text-left rounded-lg px-3 py-2 text-[13.5px] font-semibold flex items-center gap-2 hover:bg-brand-50" style={{ border: '1px solid var(--color-line)', background: '#fff' }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: SUBJECTS[x].accent }} /> {SUBJECTS[x].title}
              </button>
            ))}
          </div>
        )}
      </div>
      {S.hasPapers && (
        <div className="px-3 pb-2 grid grid-cols-3 gap-1.5">
          {[['all', 'Both'], ['1', 'Paper 1'], ['2', 'Paper 2']].map(([k, l]) => (
            <button key={k} onClick={() => setPaper(k)} className={'chip justify-center ' + (paper === k ? 'chip-on' : '')} style={{ borderRadius: 8 }}>{l}</button>
          ))}
        </div>
      )}
      <div className="px-3 pb-2 flex flex-wrap gap-1">
        <button onClick={() => setLevel(-1)} className={'chip ' + (level < 0 ? 'chip-on' : '')}>All levels</button>
        {LEVELS.map((l) => (
          <button key={l.id} onClick={() => setLevel(level === l.id ? -1 : l.id)} className="chip" style={{ background: level === l.id ? l.c : l.tint, color: level === l.id ? l.fg : 'var(--color-ink)', borderColor: l.c }}>{l.label} · Gr {l.grades}</button>
        ))}
      </div>
      <div className="label px-4 pt-1 pb-1.5">Chapters</div>
      <div className="flex-1 overflow-y-auto px-2 pb-5">
        {chapters.map((t, ti) => {
          const colour = CHAPTER_COLOURS[ti % CHAPTER_COLOURS.length];
          const open = topic === t.c;
          const list = questions.filter((q) => q.tc === t.c && filt(q));
          const marked = list.filter((q) => doneState(q.k)).length;
          return (
            <div key={t.c} className="mb-1">
              <button onClick={() => setTopic(open ? null : t.c)} disabled={!list.length} className="w-full flex items-center gap-2 text-left rounded-lg px-2.5 py-2" style={{ background: open ? '#fff' : 'transparent', border: '1px solid ' + (open ? colour : 'transparent'), opacity: list.length ? 1 : 0.35 }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: colour }} />
                <span className="flex-1 text-[13.5px] font-semibold">{t.c}. {t.n}</span>
                <span className="faint text-[12px] tnum">{marked}/{list.length}</span>
              </button>
              {open && (
                <div className="pl-2.5 pt-1.5 pb-1.5">
                  <a href={'pworksheets.html#' + sid + '/' + ti} className="btn btn-sm btn-navy mb-2 no-underline"><IconPrint size={14} /> Printable worksheets</a>
                  {groupQuestions(list, sid, t.c, level).map((g) =>
                    g.items.length ? (
                      <div key={g.label} className="mb-2">
                        <div className="label flex items-center gap-1.5 px-1 pb-1" style={{ color: g.id === 1 ? '#9A7B05' : g.c }}>
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: g.c }} /> {g.label} <span className="opacity-60">{g.items.length}</span>
                        </div>
                        <div className="grid gap-[3px]">
                          {g.items.map((q) => {
                            const lv = g.sub ? LEVELS[q.d] : g;
                            const on = current === q.k;
                            const st = doneState(q.k);
                            return (
                              <button key={q.k} onClick={() => onPick(q.k)} className="flex items-center gap-2 text-left rounded-lg px-2 py-1.5 text-[13px]" style={{ background: on ? lv.c : lv.tint || '#fff', color: on ? lv.fg || '#fff' : 'var(--color-ink)', borderLeft: '4px solid ' + lv.c }}>
                                <span className="w-[9px] h-[9px] rounded-full shrink-0" style={{ border: '1.5px solid ' + (on ? lv.fg || '#fff' : lv.c), background: dotColour(st) }} />
                                <span className="font-extrabold tnum" style={{ minWidth: 30 }}>{ordered.findIndex((x) => x.k === q.k) + 1}.</span>
                                <span className="flex-1">{shortSeries(q.s)} · {q.p.replace('Paper ', 'P')} · Q{q.n} <span className="tnum font-bold" style={{ opacity: 0.6, fontSize: 11 }}>{q.code}</span></span>
                                <span className="opacity-75 tnum">{q.m}m</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
