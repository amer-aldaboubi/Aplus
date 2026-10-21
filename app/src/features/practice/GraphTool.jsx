/* Graph / sketch answer tool: pen, straight line, plotted points, 4 colours, 5 axis presets, snap-to-grid, undo. */
import React, { useRef, useState } from 'react';

const COLOURS = ['#1F2430', '#2563EB', '#DC2626', '#16A34A'];
const AXES = [
  ['±5', [-5, 5, -5, 5]],
  ['±10', [-10, 10, -10, 10]],
  ['±20', [-20, 20, -20, 20]],
  ['0–10', [0, 10, 0, 10]],
  ['0–20', [0, 20, 0, 20]],
];
const step = (span) => (span <= 12 ? 1 : span <= 25 ? 2 : span <= 60 ? 5 : 10);
const W = 600, H = 600, PAD = 34;

export function GraphTool({ value, onChange, locked }) {
  const v = value || { rng: [-10, 10, -10, 10], s: [] };
  const [rng, strokes] = [v.rng, v.s];
  const [tool, setTool] = useState('pen');
  const [col, setCol] = useState(0);
  const [snap, setSnap] = useState(true);
  const [draft, setDraft] = useState(null);
  const [cursor, setCursor] = useState(null);
  const svg = useRef(null);
  const [x0, x1, y0, y1] = rng;
  const X = (x) => PAD + ((x - x0) / (x1 - x0)) * (W - 2 * PAD);
  const Y = (y) => H - PAD - ((y - y0) / (y1 - y0)) * (H - 2 * PAD);
  const pt = (e) => {
    const r = svg.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const py = ((e.clientY - r.top) / r.height) * H;
    let x = x0 + ((px - PAD) / (W - 2 * PAD)) * (x1 - x0);
    let y = y0 + ((H - PAD - py) / (H - 2 * PAD)) * (y1 - y0);
    if (snap && tool !== 'pen') {
      x = Math.round(x * 2) / 2;
      y = Math.round(y * 2) / 2;
    }
    return [x, y];
  };
  const set = (patch) => onChange({ ...v, ...patch });
  const down = (e) => {
    if (locked) return;
    e.preventDefault();
    try {
      svg.current.setPointerCapture(e.pointerId);
    } catch {}
    const p = pt(e);
    if (tool === 'pt') {
      set({ s: [...strokes, { t: 'pt', c: col, p: [p] }] });
      return;
    }
    setDraft({ t: tool, c: col, p: [p] });
  };
  const move = (e) => {
    const p = pt(e);
    setCursor(p);
    if (draft) setDraft(draft.t === 'pen' ? { ...draft, p: [...draft.p, p] } : { ...draft, p: [draft.p[0], p] });
  };
  const up = () => {
    if (draft) {
      if (draft.p.length > 1) set({ s: [...strokes, draft] });
      setDraft(null);
    }
  };
  const sx = step(x1 - x0), sy = step(y1 - y0);
  const gx = [], gy = [];
  for (let x = Math.ceil(x0 / sx) * sx; x <= x1; x += sx) gx.push(x);
  for (let y = Math.ceil(y0 / sy) * sy; y <= y1; y += sy) gy.push(y);
  const axX = x0 <= 0 && x1 >= 0 ? X(0) : X(x0);
  const axY = y0 <= 0 && y1 >= 0 ? Y(0) : Y(y0);
  const render = (s, key) => {
    const c = COLOURS[s.c];
    if (s.t === 'pt') {
      const [px, py] = s.p[0];
      const cx = X(px), cy = Y(py);
      return (
        <g key={key} stroke={c} strokeWidth="3" strokeLinecap="round">
          <line x1={cx - 7} y1={cy - 7} x2={cx + 7} y2={cy + 7} />
          <line x1={cx - 7} y1={cy + 7} x2={cx + 7} y2={cy - 7} />
        </g>
      );
    }
    return <polyline key={key} points={s.p.map(([px, py]) => X(px).toFixed(1) + ',' + Y(py).toFixed(1)).join(' ')} fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
  };
  const Btn = ({ on, children, onClick }) => (
    <button onClick={onClick} className={'chip ' + (on ? 'chip-on' : '')}>{children}</button>
  );
  return (
    <div>
      {!locked && (
        <div className="flex flex-wrap gap-1.5 mb-2 items-center">
          <Btn on={tool === 'pen'} onClick={() => setTool('pen')}>✏️ Pen</Btn>
          <Btn on={tool === 'line'} onClick={() => setTool('line')}>📏 Line</Btn>
          <Btn on={tool === 'pt'} onClick={() => setTool('pt')}>✕ Point</Btn>
          <span className="w-px h-5 mx-1" style={{ background: 'var(--color-line-strong)' }} />
          {COLOURS.map((c, i) => (
            <button key={c} onClick={() => setCol(i)} aria-label={'Colour ' + (i + 1)} className="rounded-full" style={{ width: 24, height: 24, background: c, border: col === i ? '3px solid var(--color-gold-500)' : '2px solid #fff', boxShadow: '0 0 0 1px rgba(20,24,40,.3)' }} />
          ))}
          <span className="w-px h-5 mx-1" style={{ background: 'var(--color-line-strong)' }} />
          <Btn onClick={() => set({ s: strokes.slice(0, -1) })}>↶ Undo</Btn>
          <Btn onClick={() => set({ s: [] })}>Clear</Btn>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 mb-2 items-center text-[12px]">
        <span className="muted">Axes:</span>
        {AXES.map(([l, r]) => (
          <button key={l} disabled={locked} onClick={() => set({ rng: r })} className="rounded-lg px-2 py-1 font-bold text-[12px]" style={{ background: rng.join() === r.join() ? 'var(--color-navy-800)' : 'var(--color-page)', color: rng.join() === r.join() ? '#fff' : 'var(--color-ink)', border: '1px solid var(--color-line)' }}>{l}</button>
        ))}
        {!locked && (
          <label className="ml-1 flex gap-1 items-center">
            <input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} /> Snap to grid (line / point)
          </label>
        )}
        <span className="ml-auto muted tnum">{cursor ? '(' + cursor[0].toFixed(1) + ', ' + cursor[1].toFixed(1) + ')' : ''}</span>
      </div>
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={() => { up(); setCursor(null); }} style={{ width: '100%', maxWidth: 560, display: 'block', margin: '0 auto', background: '#fff', border: '2px solid var(--color-line-strong)', borderRadius: 12, touchAction: 'none', cursor: locked ? 'default' : tool === 'pen' ? 'crosshair' : 'cell' }}>
        {gx.map((x) => <line key={'gx' + x} x1={X(x)} y1={PAD} x2={X(x)} y2={H - PAD} stroke="rgba(20,24,40,.12)" />)}
        {gy.map((y) => <line key={'gy' + y} x1={PAD} y1={Y(y)} x2={W - PAD} y2={Y(y)} stroke="rgba(20,24,40,.12)" />)}
        <line x1={PAD} y1={axY} x2={W - PAD} y2={axY} stroke="#1F2430" strokeWidth="2" />
        <line x1={axX} y1={PAD} x2={axX} y2={H - PAD} stroke="#1F2430" strokeWidth="2" />
        {gx.filter((x) => x !== 0).map((x) => <text key={'tx' + x} x={X(x)} y={Math.min(H - 8, axY + 16)} fontSize="12" textAnchor="middle" fill="#445">{x}</text>)}
        {gy.filter((y) => y !== 0).map((y) => <text key={'ty' + y} x={Math.max(14, axX - 6)} y={Y(y) + 4} fontSize="12" textAnchor="end" fill="#445">{y}</text>)}
        <text x={W - PAD + 4} y={axY - 6} fontSize="15" fontStyle="italic" fill="#1F2430">x</text>
        <text x={axX + 6} y={PAD - 8} fontSize="15" fontStyle="italic" fill="#1F2430">y</text>
        {strokes.map(render)}
        {draft && render(draft, 'draft')}
      </svg>
      <div className="faint text-[12px] mt-1.5 text-center">{locked ? 'Your sketch is kept while you check the mark scheme.' : 'Pen = free drawing. Line = drag from start to end. Point = tap to plot ×.'}</div>
    </div>
  );
}

/** Table answer tool: up to 12×12 cells, first column for labels. */
export function TableTool({ value, onChange, locked }) {
  const v = value || { r: 3, c: 6, v: {} };
  const cell = (r, c) => v.v[r + ',' + c] || '';
  const setCell = (r, c, t) => onChange({ ...v, v: { ...v.v, [r + ',' + c]: t } });
  const B = ({ label, onClick, disabled }) => (
    <button disabled={disabled || locked} onClick={onClick} className="chip">{label}</button>
  );
  return (
    <div>
      {!locked && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          <B label="+ Row" onClick={() => onChange({ ...v, r: v.r + 1 })} disabled={v.r >= 12} />
          <B label="− Row" onClick={() => onChange({ ...v, r: v.r - 1 })} disabled={v.r <= 1} />
          <B label="+ Column" onClick={() => onChange({ ...v, c: v.c + 1 })} disabled={v.c >= 12} />
          <B label="− Column" onClick={() => onChange({ ...v, c: v.c - 1 })} disabled={v.c <= 1} />
          <B label="Clear" onClick={() => onChange({ ...v, v: {} })} />
        </div>
      )}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
          <tbody>
            {Array.from({ length: v.r }, (_, r) => (
              <tr key={r}>
                {Array.from({ length: v.c }, (_, c) => (
                  <td key={c} style={{ border: '1.5px solid #1F2430', padding: 0, background: c === 0 ? 'var(--color-gold-100)' : '#fff' }}>
                    <input value={cell(r, c)} readOnly={locked} onChange={(e) => setCell(r, c, e.target.value)} aria-label={'Row ' + (r + 1) + ' column ' + (c + 1)} style={{ width: 62, boxSizing: 'border-box', padding: '9px 6px', border: 0, textAlign: 'center', fontSize: 15, background: 'transparent', color: '#1F2430', fontWeight: c === 0 ? 700 : 400, outline: 'none' }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="faint text-[12px] mt-1.5 text-center">Tip: first column is for labels such as x and y.</div>
    </div>
  );
}

export function hasWorking(state) {
  return state ? !!((state.g && state.g.s && state.g.s.length) || (state.tb && Object.values(state.tb.v || {}).some((e) => String(e).trim()))) : false;
}
