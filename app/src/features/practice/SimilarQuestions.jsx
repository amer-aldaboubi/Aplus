/* "Want similar questions?" — 5 generated variants under a question, each with an auto-marked typed answer. */
import React, { useEffect, useState } from 'react';

let cache = null;
const load = () => (cache ? Promise.resolve(cache) : import('../../data/similar.json').then((m) => (cache = m.default || m)).catch(() => (cache = {})));

const norm = (s) => String(s || '').toLowerCase().replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/\.$/, '');
function isRight(v, text) {
  const t = norm(text);
  if (!t) return null;
  if ((v.accept || []).some((a) => norm(a) === t)) return true;
  if (v.type === 'num' && typeof v.value === 'number') {
    const n = parseFloat(t.replace(/,/g, ''));
    if (!isNaN(n) && /^-?[\d.]+$/.test(t.replace(/,/g, ''))) return Math.abs(n - v.value) <= Math.max(0.01, Math.abs(v.value) * 0.005);
  }
  return false;
}

export function SimilarQuestions({ qk, S }) {
  const [vars, setVars] = useState(null);
  const [open, setOpen] = useState(false);
  const [ans, setAns] = useState({});
  const [res, setRes] = useState({});
  const [sol, setSol] = useState({});
  useEffect(() => {
    let alive = true;
    setOpen(false); setAns({}); setRes({}); setSol({});
    load().then((d) => alive && setVars(d[qk] || []));
    return () => { alive = false; };
  }, [qk]);
  if (!vars || !vars.length) return null;
  const right = Object.values(res).filter((x) => x === true).length;
  return (
    <div className="card p-3.5 mt-3.5" style={{ borderLeft: '5px solid ' + S.accent }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-extrabold text-[15px]">Want similar questions?</div>
          <div className="muted text-[12.5px]">{vars.length} new questions on the same skill, marked instantly{right ? ' · ' + right + ' of ' + vars.length + ' correct' : ''}</div>
        </div>
        <button onClick={() => setOpen(!open)} className="btn btn-sm" style={{ background: S.accent, color: S.ink }}>{open ? 'Hide' : 'Show'}</button>
      </div>
      {open && (
        <div className="grid gap-3 mt-3">
          {vars.map((v, i) => (
            <div key={i} className="rounded-xl p-3" style={{ border: '1px solid var(--color-line)' }}>
              <div className="label">Question {i + 1}{v.marks ? ' · ' + v.marks + ' mark' + (v.marks > 1 ? 's' : '') : ''}</div>
              <div className="text-[15px] font-semibold mt-1" style={{ whiteSpace: 'pre-wrap' }}>{v.q}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <input value={ans[i] || ''} onChange={(e) => setAns({ ...ans, [i]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && setRes({ ...res, [i]: isRight(v, ans[i]) })} placeholder="Type your answer" className="input flex-1" style={{ minWidth: 160 }} />
                <button onClick={() => setRes({ ...res, [i]: isRight(v, ans[i]) })} disabled={!(ans[i] || '').trim()} className="btn btn-navy btn-sm">Check</button>
              </div>
              {res[i] === true && <div className="text-[13.5px] font-bold mt-2" style={{ color: 'var(--color-ok-500)' }}>✅ Correct</div>}
              {res[i] === false && (
                <div className="mt-2">
                  <div className="text-[13.5px] font-bold" style={{ color: 'var(--color-bad-500)' }}>Not quite. Check your working and try again.</div>
                  <button onClick={() => setSol({ ...sol, [i]: true })} className="btn btn-sm mt-1.5">Show answer and working</button>
                </div>
              )}
              {res[i] === true && !sol[i] && <button onClick={() => setSol({ ...sol, [i]: true })} className="btn btn-sm mt-1.5">Show working</button>}
              {sol[i] && (
                <div className="rounded-lg p-2.5 mt-2 text-[13.5px]" style={{ background: 'var(--color-page)' }}>
                  <div><b>Answer:</b> {v.ans}</div>
                  <div className="mt-1" style={{ whiteSpace: 'pre-wrap' }}>{v.sol}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
