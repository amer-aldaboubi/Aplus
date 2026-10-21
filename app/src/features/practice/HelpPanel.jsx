/* "Need help with this question?" — chapter key points, worked example, per-question steps and a similar question. */
import React, { useEffect, useState } from 'react';
import { loadHelp } from '../../data/lazy';
import { IconBulb } from '../../ui/Icons';

const Steps = ({ list }) => (
  <ol className="text-[16px] leading-relaxed mt-1 pl-6">
    {list.map((y, i) => <li key={i} className="mb-1.5">{y}</li>)}
  </ol>
);
const H = ({ children }) => <div className="label mt-4 mb-2" style={{ color: '#8A6D12', fontSize: 12.5 }}>{children}</div>;

export function HelpPanel({ q, got }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(got === 0);
  const [sol, setSol] = useState(false);
  const [kp, setKp] = useState(false);
  useEffect(() => {
    loadHelp().then(setData).catch(() => setData({ help: {}, qhelp: {} }));
  }, []);
  useEffect(() => {
    if (got === 0) setOpen(true);
  }, [got]);
  useEffect(() => {
    setOpen(got === 0);
    setSol(false);
    setKp(false);
  }, [q.k]);
  if (!data) return null;
  const h = data.help[q.sid + q.tc];
  const qh = data.qhelp[q.k];
  if (!h && !qh) return null;
  const btn = 'btn btn-secondary mt-2';
  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="btn w-full mt-3" style={{ gridColumn: '1 / -1', background: 'var(--color-gold-100)', color: '#6b5410', border: '1px solid rgba(212,166,42,.6)', padding: 13, fontSize: 16 }}>
        <IconBulb size={18} /> Need help with this question?
      </button>
    );
  return (
    <div className="anim-fade-up rounded-[14px] p-4 mt-3" style={{ gridColumn: '1 / -1', background: 'var(--color-gold-100)', border: '1px solid rgba(212,166,42,.5)' }}>
      <div className="text-[20px] font-extrabold">{got === 0 ? 'Let’s fix this one' : 'Help with this question'}</div>
      {got === 0 && <div className="text-[15px] mt-1" style={{ opacity: 0.85 }}>You scored 0 on this one. That’s fine — follow the steps below, then try a similar question.</div>}
      {qh && (
        <>
          <H>Step-by-step explanation of this question</H>
          <Steps list={qh.e} />
          <H>Now try a similar question</H>
          <div className="card text-[16px] font-bold px-3.5 py-3">{qh.s.q}</div>
          {sol ? (
            <div>
              <H>Step-by-step solution</H>
              <Steps list={qh.s.st} />
              <div className="mt-2 text-[19px] font-extrabold rounded-xl px-3.5 py-2.5" style={{ color: 'var(--color-ok-500)', background: 'var(--color-ok-100)' }}>Answer: {String(qh.s.a)}</div>
            </div>
          ) : (
            <button onClick={() => setSol(true)} className={btn}>Tried it? Show the step-by-step solution</button>
          )}
        </>
      )}
      {h && (
        <>
          <button onClick={() => setKp((y) => !y)} className={btn + ' mt-4'}>{(kp ? 'Hide' : 'Show') + ' key points: ' + h.t}</button>
          {kp && (
            <div>
              <ul className="text-[16px] leading-relaxed mt-2 pl-5">{h.k.map((x, i) => <li key={i}>{x}</li>)}</ul>
              <H>Worked example</H>
              <div className="text-[16px] font-bold">{h.ex.q}</div>
              <Steps list={h.ex.s} />
            </div>
          )}
        </>
      )}
      <div className="muted text-[13px] mt-3">Still stuck? Ask your teacher in class.</div>
      {got !== 0 && <button onClick={() => setOpen(false)} className="btn btn-ghost btn-sm mt-1" style={{ color: '#6b5410' }}>Hide help</button>}
    </div>
  );
}
