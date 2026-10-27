/* Practice screen: chapter list, question / mark-scheme viewer, answer tools, self-marking, help, likes and challenges. */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHub } from '../../app/HubContext';
import { useRouter } from '../../app/router';
import { SUBJECTS, LEVELS, chapters, questionsOf, chapterName, paperNumber, orderedQuestions, checkAnswer } from '../../data/subjects';
import { useQuestionImage, loadImage } from '../../data/packs';
import { loadOrdering, loadCalculator } from '../../data/lazy';
import { lsGet, lsSet, lsJson, setDone } from '../../data/local';
import { currentTask, clearTask, taskQuestions } from '../../data/task';
import { GraphTool, TableTool, hasWorking } from './GraphTool';
import { HelpPanel } from './HelpPanel';
import { QuestionBar } from './QuestionBar';
import { ActivityBar, TrayButtons, useRelease } from './teacherTools';
import { ChapterSidebar, TaskSidebar } from './Sidebar';
import { IconMenu, IconHome, IconZoomIn, IconZoomOut, IconCalc, IconLock, IconChevron, IconBack } from '../../ui/Icons';

const MOTIVATION = ['You can do this!', 'Every mistake is a step forward', 'Practice makes progress', 'Aim high – go for the A*', 'Think. Try. Check. Improve.', 'Believe in your brain', 'Small steps every day', 'Hard work beats talent'];
const EMPTY = { txt: '', paper: false, shown: false, view: 'q', got: null };

function useWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return w;
}
function useBoxWidth(ref) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const f = () => ref.current && setW(ref.current.clientWidth);
    f();
    const ro = window.ResizeObserver ? new ResizeObserver(f) : null;
    ro && ro.observe(ref.current);
    window.addEventListener('resize', f);
    return () => {
      ro && ro.disconnect();
      window.removeEventListener('resize', f);
    };
  });
  return w;
}

/** Diagonal repeating watermark (name + site address) drawn over every question and mark-scheme image. */
const WATERMARK = 'url("data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260"><g transform="rotate(-28 210 130)" font-family="Arial,Helvetica,sans-serif" font-weight="700" fill="#1B2A4A" fill-opacity="0.15" text-anchor="middle"><text x="210" y="125" font-size="34">A+ Maths Hub</text><text x="210" y="155" font-size="17">amer-aldaboubi.github.io/Aplus</text></g></svg>') + '")';

/** The question / mark-scheme image, sized to the box and the zoom level. */
function PageImage({ src, zoom, boxW }) {
  const [nat, setNat] = useState(0);
  const w = nat && boxW ? Math.round(Math.min((boxW - 8) * zoom, nat * 2 * zoom)) : 0;
  return (
    <div style={{ position: 'relative', width: w ? w + 'px' : 'auto', margin: '0 auto' }}>
      <img key={src} className="anim-fade-in" src={src} alt="" loading="lazy" decoding="async" draggable={false} onLoad={(e) => setNat(e.target.naturalWidth)} style={{ display: 'block', maxWidth: 'none', height: 'auto', width: w ? w + 'px' : 'auto', visibility: w ? 'visible' : 'hidden' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', userSelect: 'none', backgroundImage: WATERMARK, backgroundRepeat: 'repeat', backgroundSize: '420px 260px' }} />
    </div>
  );
}

/** The question's 7-digit code with a copy button. */
function CodeChip({ code }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(code).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); });
    } catch {}
  };
  return (
    <button onClick={copy} title="Question code — tap to copy. Students can type it into Search." className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-extrabold tnum" style={{ background: 'var(--color-navy-800)', color: '#fff', fontSize: 12.5, letterSpacing: '.04em' }}>
      {done ? 'Copied' : 'Code ' + code}
    </button>
  );
}

function Welcome({ S, topic, wide, onOpen }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((c) => (c + 1) % MOTIVATION.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="card anim-fade-up flex items-center justify-center text-center p-7" style={{ minHeight: wide ? 'calc(100vh - 200px)' : '60vh', borderTop: '4px solid ' + S.accent }}>
      <div style={{ maxWidth: 520 }}>
        <div className="mx-auto flex items-center justify-center rounded-[26px] font-extrabold text-[44px]" style={{ width: 96, height: 96, background: S.soft, color: S.dark }}>{S.emoji}</div>
        <div className="label mt-4" style={{ color: S.dark }}>{S.board}</div>
        <h1 className="m-0 mt-1 font-extrabold" style={{ fontSize: wide ? 30 : 24, color: S.dark }}>{S.title}</h1>
        <div className="h-9 mt-3"><div key={i} className="anim-fade-up text-[18px] font-bold">{MOTIVATION[i]}</div></div>
        <p className="muted text-[15px] mt-3">{topic ? 'Now pick a question from the list.' : wide ? 'Pick a chapter on the left, then a question.' : 'Open the chapters, pick one, then a question.'}</p>
        {!wide && <button onClick={onOpen} className="btn btn-lg mt-2" style={{ background: S.accent, color: S.ink }}><IconMenu size={18} /> Open chapters</button>}
        <div className="faint text-[13px] mt-6">Created by Dr. Amer Al-Daboubi</div>
      </div>
    </div>
  );
}

export function PracticePage({ sid0, tc0, key0 }) {
  const hub = useHub();
  const { go } = useRouter();
  const task = currentTask();
  const home = () => {
    if (task) clearTask();
    go('home');
  };

  const [sid, setSid] = useState(sid0);
  const [topic, setTopic] = useState(tc0 || null);
  const [paper, setPaper] = useState('all');
  const [level, setLevel] = useState(-1);
  const [cur, setCur] = useState(key0 || (task ? task.keys[0] : null));
  const [states, setStates] = useState({});
  const [drawer, setDrawer] = useState(false);
  const [, bump] = useState(0);
  const [zoom, setZoom] = useState(() => {
    const z = parseFloat(lsGet('aplus-zq', '0'));
    return z >= 0.75 && z <= 3 ? z : 0;
  });
  const [tray, setTray] = useState(() => {
    const t = lsJson('ap-tray', []);
    return Array.isArray(t) ? t.slice(0, 10) : [];
  });
  const [calcReady, setCalcReady] = useState(false);
  const box = useRef(null);
  const boxW = useBoxWidth(box);
  const wide = useWidth() >= 900;

  const S = SUBJECTS[sid];
  const chaps = chapters(sid);
  const all = useMemo(() => questionsOf(sid), [sid]);
  const release = useRelease(task ? task.keys : tray, task);
  const released = !!(task && (task.ch || release.rel));

  useEffect(() => {
    loadOrdering().then(() => bump((x) => x + 1)).catch(() => {});
  }, []);
  useEffect(() => {
    if (!task) lsSet('aplus-last-sid', sid);
  }, [sid]);

  // Visible, ordered question list
  const filt = (q) => q.tc === topic && (paper === 'all' || paperNumber(q.p) === paper) && (level < 0 || q.d === level);
  const list = task ? taskQuestions(task) : topic ? orderedQuestions(all.filter(filt), level) : [];
  const idx = cur ? list.findIndex((q) => q.k === cur) : -1;
  const q = idx >= 0 ? list[idx] : null;
  const st = q ? states[q.k] || EMPTY : null;
  const patch = (p) => setStates((s) => ({ ...s, [q.k]: { ...(s[q.k] || EMPTY), ...p } }));

  const qImg = useQuestionImage(q, 'q', !!q);
  const msImg = useQuestionImage(q, 'ms', !!(q && st && st.shown));
  const narrow = boxW && boxW < 600;
  const zq = zoom || 1;
  const zms = zoom || (narrow ? 2.3 : 1);

  useEffect(() => {
    box.current && (box.current.scrollTop = 0);
    window.scrollTo(0, 0);
  }, [cur, st && st.view]);
  useEffect(() => {
    // Prefetch the next question's image while the current one is being answered.
    q && list[idx + 1] && loadImage(list[idx + 1], 'q').catch(() => {});
  }, [cur]);

  const changeSubject = (s) => {
    setSid(s);
    setTopic(null);
    setCur(null);
    setPaper('all');
    setTray([]);
  };
  const pick = (k) => {
    setCur(k);
    setDrawer(false);
  };
  const move = (d) => list[idx + d] && setCur(list[idx + d].k);
  const setZ = (d) => {
    const z = Math.max(0.75, Math.min(3, Math.round(((zoom || 1) + d) * 100) / 100));
    setZoom(z);
    lsSet('aplus-zq', String(z));
  };
  const openCalc = () => {
    loadCalculator().then((ui) => {
      setCalcReady(true);
      ui && ui.toggle();
    });
  };

  const hasAnswer = st && (st.txt.trim().length > 0 || st.paper || hasWorking(st));
  const match = q && q.a && st ? checkAnswer(q.a, st.txt) : null;
  const classTask = task && !released; // "mark as done" mode: mark scheme locked

  const mark = (marks) => {
    if (st.got !== null) return;
    patch({ got: marks });
    const frac = q.m ? marks / q.m : 0;
    const res = frac >= 0.75 ? 'g' : frac >= 0.4 ? 'p' : 's';
    setDone(q.k, { g: marks, m: q.m, t: Date.now() });
    bump((x) => x + 1);
    hub.record({ key: q.sid + ':' + q.tc, qid: q.k, res, d: q.d, rev: task && task.rev ? task.rev : undefined });
  };

  const sidebar = task ? (
    <TaskSidebar teacher={hub.isTeacher} task={task} questions={list} states={states} current={cur} onPick={pick} S={S} />
  ) : (
    <ChapterSidebar sid={sid} setSid={changeSubject} chapters={chaps} questions={all} paper={paper} setPaper={(p) => { setPaper(p); setCur(null); }} level={level} setLevel={(l) => { setLevel(l); setCur(null); }} topic={topic} setTopic={(t) => { setTopic(t); setCur(null); }} current={cur} onPick={pick} ordered={list} S={S} />
  );

  const title = q ? (task ? (task.title || (task.ch ? 'Challenge' : 'Class task')) : topic + '. ' + chapterName(sid, topic)) : S.title;
  const tool = (st && st.tool) || 'type';
  const Tab = ({ on, children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="btn btn-sm" style={{ background: on ? S.accent : '#fff', color: on ? S.ink : 'var(--color-ink)', border: '1px solid ' + (on ? S.accent : 'var(--color-line-strong)'), opacity: disabled ? 0.4 : 1 }}>{children}</button>
  );

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
      {wide && (
        <aside className="shrink-0 sticky overflow-y-auto" style={{ width: 316, top: 60, height: 'calc(100vh - 60px)', background: '#fff', borderRight: '1px solid var(--color-line)' }}>
          <div className="flex items-center justify-between px-3 pt-3">
            <button onClick={home} className="btn btn-secondary btn-sm"><IconHome size={15} /> Home</button>
            <span className="font-extrabold" style={{ color: S.dark }}>A+</span>
          </div>
          {sidebar}
        </aside>
      )}
      {!wide && drawer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex' }}>
          <div className="anim-slide-in overflow-y-auto" style={{ width: '88vw', maxWidth: 340, background: '#fff', height: '100%' }}>
            <div className="flex items-center justify-between px-3 pt-3">
              <button onClick={home} className="btn btn-secondary btn-sm"><IconHome size={15} /> Home</button>
              <button onClick={() => setDrawer(false)} className="btn btn-ghost btn-sm">Close</button>
            </div>
            {sidebar}
          </div>
          <div className="anim-fade-in flex-1" onClick={() => setDrawer(false)} style={{ background: 'rgba(15,30,61,.5)' }} />
        </div>
      )}

      <main className="flex-1 min-w-0 pb-tabbar" style={{ padding: wide ? '18px 24px 24px' : '12px 12px 24px' }}>
        <div className="mx-auto" style={{ maxWidth: 980 }}>
          <ActivityBar tray={tray} onHome={home} />

          <div className="flex items-center gap-2.5 flex-wrap mb-3">
            {!wide && <button onClick={() => setDrawer(true)} className="btn" style={{ background: S.accent, color: S.ink }}><IconMenu size={18} /> {task ? 'Questions' : 'Chapters'}</button>}
            {!wide && task && <button onClick={home} className="btn btn-secondary btn-sm"><IconBack size={15} /> Home</button>}
            <div className="min-w-0" style={{ flex: wide ? 1 : '1 1 100%' }}>
              <div className="font-bold" style={{ fontSize: wide ? 21 : 16, color: S.dark }}>{title}</div>
              {q && (
                <div className="muted text-[13px] flex flex-wrap items-center gap-x-1.5">
                  <span>{q.s} • {q.p} • Question {q.n} • {q.m} mark{q.m === 1 ? '' : 's'} • {idx + 1} of {list.length}</span>
                  <CodeChip code={q.code} />
                  <span className="rounded-full px-2 py-0.5 text-[11.5px] font-extrabold" style={{ background: LEVELS[q.d].c, color: LEVELS[q.d].fg }}>{LEVELS[q.d].label}</span>
                </div>
              )}
            </div>
            {q && hub.isTeacher && !task && <TrayButtons q={q} tray={tray} setTray={setTray} release={release} />}
            {q && (
              <div className="flex gap-1.5">
                <button onClick={() => setZ(-0.25)} className="btn btn-secondary btn-sm" aria-label="Smaller"><IconZoomOut size={16} /></button>
                <button onClick={() => setZ(0.25)} className="btn btn-secondary btn-sm" aria-label="Larger"><IconZoomIn size={16} /></button>
              </div>
            )}
          </div>

          {!q && <Welcome S={S} topic={topic} wide={wide} onOpen={() => setDrawer(true)} />}

          {q && (
            <div key={q.k} className="anim-fade-up">
              <div className="flex gap-2 mb-2.5">
                <Tab on={st.view === 'q'} onClick={() => patch({ view: 'q' })}>Question</Tab>
                <Tab on={st.view === 'ms'} onClick={() => patch({ view: 'ms' })} disabled={!(st.shown && !classTask)}>Mark scheme</Tab>
              </div>
              <div ref={box} className="card" style={{ border: '3px solid ' + S.accent, height: wide ? 'calc(100vh - 300px)' : '68vh', minHeight: 320, overflow: 'auto', WebkitOverflowScrolling: 'touch', padding: 4 }}>
                {st.view === 'q' ? (
                  qImg.url ? <PageImage src={qImg.url} zoom={zq} boxW={boxW} /> : <div className="p-12 text-center muted">{qImg.err ? 'Could not load this question. Check your connection and try again.' : <><div className="spinner mb-3" />Loading question…</>}</div>
                ) : msImg.url ? (
                  <PageImage src={msImg.url} zoom={zms} boxW={boxW} />
                ) : (
                  <div className="p-12 text-center muted">{msImg.err ? 'Could not load the mark scheme.' : <><div className="spinner mb-3" />Loading mark scheme…</>}</div>
                )}
              </div>

              <div className="grid gap-3 mt-3.5" style={{ gridTemplateColumns: wide ? '1fr 1fr' : '1fr' }}>
                <div className="card p-3.5" style={{ gridColumn: wide && tool !== 'type' ? '1 / -1' : undefined }}>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <span className="label mr-1">Your answer</span>
                    {[['type', '⌨️ Type'], ['graph', '📈 Graph / sketch'], ['table', '▦ Table']].map(([k, l]) => (
                      <button key={k} onClick={() => patch({ tool: k })} className={'chip ' + (tool === k ? '' : '')} style={tool === k ? { background: S.accent, color: S.ink, borderColor: S.accent } : undefined}>{l}</button>
                    ))}
                    <button onClick={openCalc} className="chip chip-on"><IconCalc size={14} /> Calculator</button>
                  </div>
                  {tool === 'graph' && <GraphTool value={st.g} onChange={(g) => patch({ g })} locked={st.shown} />}
                  {tool === 'table' && <TableTool value={st.tb} onChange={(tb) => patch({ tb })} locked={st.shown} />}
                  {tool === 'type' &&
                    (q.a ? (
                      <input value={st.txt} readOnly={st.shown} onChange={(e) => patch({ txt: e.target.value })} placeholder="Type your final answer" className="input" style={{ fontSize: 18, borderColor: S.accent, borderWidth: 2 }} />
                    ) : (
                      <textarea value={st.txt} readOnly={st.shown} onChange={(e) => patch({ txt: e.target.value })} rows={3} placeholder="Type your answer, or the key steps and final answers." className="input" style={{ borderColor: S.accent, borderWidth: 2, resize: 'vertical' }} />
                    ))}
                  {!st.shown && (
                    <label className="flex items-center gap-2 mt-2.5 text-[13px]">
                      <input type="checkbox" checked={st.paper} onChange={(e) => patch({ paper: e.target.checked })} style={{ width: 17, height: 17 }} /> I worked it out on paper (graph, drawing or long working)
                    </label>
                  )}
                  {st.shown ? (
                    <button onClick={() => patch({ view: st.view === 'ms' ? 'q' : 'ms' })} className="btn btn-secondary btn-lg w-full mt-3">{st.view === 'ms' ? '← Back to the question' : 'View the mark scheme'}</button>
                  ) : (
                    <button disabled={!hasAnswer} onClick={classTask ? () => { patch({ done: true }); idx < list.length - 1 && move(1); } : () => patch({ shown: true, view: 'ms' })} className="btn btn-lg w-full mt-3" style={{ background: S.accent, color: S.ink }}>
                      {classTask ? (st.done ? '✓ Done (tap to update)' : hasAnswer ? 'Mark as done' : 'Write your answer first') : hasAnswer ? 'Show mark scheme' : 'Write your answer first'}
                    </button>
                  )}
                  {classTask && <div className="muted text-[13px] font-semibold mt-2 text-center flex items-center justify-center gap-1"><IconLock size={14} /> The mark scheme unlocks when your teacher releases it.</div>}
                  {st.shown && q.a && match !== null && (
                    <div className="anim-fade-up rounded-xl px-3 py-2.5 mt-3 text-[14px] font-semibold" style={{ background: match ? 'var(--color-ok-100)' : 'var(--color-warn-100)', border: '1px solid ' + (match ? 'var(--color-ok-500)' : 'var(--color-warn-500)') }}>
                      {match ? '✅ Your answer matches the printed answer.' : 'ℹ️ Your answer doesn’t match the printed answer. Check the scheme: other forms may be accepted.'}
                    </div>
                  )}
                </div>

                {!classTask && (
                  <div className="card p-3.5" style={{ opacity: st.shown ? 1 : 0.5 }}>
                    <div className="text-[14px] font-bold mb-1">Mark yourself honestly</div>
                    <div className="muted text-[12px] mb-2.5">{st.shown ? 'How many marks did you earn? Out of ' + q.m + '. Method marks count even if the final answer is wrong.' : 'Unlocks after you view the mark scheme.'}</div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: q.m + 1 }, (_, i) => {
                        const on = st.got === i;
                        const c = i === q.m ? '#16a34a' : i === 0 ? '#dc2626' : '#d97706';
                        return (
                          <button key={i} disabled={!st.shown} onClick={() => mark(i)} className={'tnum ' + (on ? 'anim-pop' : '')} style={{ minWidth: 46, padding: '11px 0', borderRadius: 11, fontWeight: 800, fontSize: 16, border: '2px solid ' + c, background: on ? c : '#fff', color: on ? '#fff' : 'var(--color-ink)', opacity: st.got !== null && !on ? 0.35 : 1 }}>{i}</button>
                        );
                      })}
                    </div>
                    {st.got !== null && <div className="anim-fade-up text-[13px] mt-2.5 font-semibold" style={{ color: 'var(--color-ok-500)' }}>✓ Saved: {st.got}/{q.m}{hub.mode === 'off' ? '' : ' (added to your progress)'}</div>}
                  </div>
                )}

                {!task && <HelpPanel q={q} got={st.got} />}
              </div>

              <QuestionBar q={q} />

              <div className="flex justify-between gap-2.5 mt-3.5">
                <button disabled={idx <= 0} onClick={() => move(-1)} className="btn btn-secondary btn-lg"><IconBack size={16} /> Previous</button>
                <button disabled={idx >= list.length - 1} onClick={() => move(1)} className="btn btn-lg" style={{ background: S.accent, color: S.ink }}>Next <IconChevron size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
