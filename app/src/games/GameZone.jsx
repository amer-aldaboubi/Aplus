/* Game Zone: menu, play passes / tokens, results, class tug board. */
import React, { useEffect, useRef, useState } from 'react';
import { useHub } from '../app/HubContext';
import { emit, EV } from '../data/bus';
import { lsGet, lsSet } from '../data/local';
import { weekKey } from '../data/dates';
import { Medal } from '../rewards/Medal';
import { Halo, GAME_CSS } from './gameKit';
import { Ninja, Escape, Tug } from './smallGames';
import { Runner, Sudoku } from './RunnerSudoku';
import { Sheet } from '../ui/primitives';
import { IconClose, IconBack } from '../ui/Icons';

export const GAMES = [
  { id: 'runner', n: 'Sigma Sprint', d: 'An endless runner. Jump the maths blocks and see how far you get.', t: 'b', g: { k: 'bolt' }, need: [], lock: '' },
  { id: 'sudoku', n: 'Sudoku', d: 'Classic logic puzzle in two sizes: quick 6×6 or full 9×9.', t: 's', g: { k: 'txt', v: '9' }, need: [], lock: '' },
  { id: 'ninja', n: 'Number Ninja', d: 'Tap the numbers that fit the rule before they float away.', t: 'b', g: { k: 'flame' }, need: ['b', 's', 'g', 'p'], lock: 'Earn any badge' },
  { id: 'escape', n: 'Equation Escape', d: 'Solve three equations to unlock three doors before time runs out.', t: 's', g: { k: 'door' }, need: ['s', 'g', 'p'], lock: 'Earn a silver badge' },
  { id: 'tug', n: 'Class Tug-of-War', d: 'Fast mental maths. Every point you score pulls for your class this week.', t: 'g', g: { k: 'rope' }, need: ['g', 'p'], lock: 'Earn a gold badge' },
];

function TugBoard() {
  const hub = useHub();
  const [d, setD] = useState(null);
  useEffect(() => {
    hub.backend && hub.backend.getTug ? hub.backend.getTug().then(setD).catch(() => setD({})) : setD({});
  }, []);
  if (!d) return null;
  const w = weekKey();
  const rows = Object.keys(d).filter((k) => k.indexOf(w + '|') === 0).map((k) => ({ c: k.split('|')[1], v: d[k] })).sort((a, b) => b.v - a.v);
  const mx = Math.max(1, ...rows.map((r) => r.v));
  if (!rows.length) return null;
  return (
    <div className="mt-4 text-left">
      <div className="label mb-1.5">Class tug totals this week</div>
      {rows.map((r, i) => (
        <div key={r.c} className="flex items-center gap-2 text-[13px] mb-1.5">
          <span className="font-bold" style={{ width: 64, color: i ? 'var(--color-ink)' : 'var(--color-gold-500)' }}>{r.c}</span>
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 9, background: 'var(--color-line)' }}>
            <div style={{ width: (r.v / mx) * 100 + '%', height: '100%', background: i ? 'var(--color-brand-400)' : 'var(--color-gold-500)' }} />
          </div>
          <span className="tnum text-right" style={{ width: 34 }}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

export function GameZone({ onClose }) {
  const hub = useHub();
  const c = hub.rewards;
  const [scr, setScr] = useState('menu');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const t0 = useRef(0);
  const TT = !!hub.isTeacher;
  const tok = c ? c.tok : 0;
  const tiers = c ? c.earned.map((b) => b.t) : [];
  const unlocked = (g) => TT || !g.need.length || g.need.some((t) => tiers.indexOf(t) >= 0);
  const pass = c ? c.pass : 0;
  const pcr = c ? c.pcr : 0;
  const canPlay = TT || pass > 0 || tok > 0;

  const play = async (g) => {
    if (busy || !canPlay || !unlocked(g)) return;
    setBusy(true);
    setErr('');
    try {
      if (!TT) await (pass > 0 ? hub.backend.usePass(hub.user.uid) : hub.backend.spend(hub.user.uid));
    } catch {
      setBusy(false);
      setErr('Couldn’t start the game. Check your connection and try again.');
      return;
    }
    emit(EV.REFRESH);
    t0.current = Date.now();
    setBusy(false);
    setRes(null);
    setScr(g.id);
  };
  const end = (r) => {
    const g = scr;
    const best = +lsGet('ap-best-' + g, 0) || 0;
    if (r.score > best) lsSet('ap-best-' + g, r.score);
    hub.backend && hub.backend.logGame && hub.backend.logGame(hub.user.uid, g, Math.round((Date.now() - t0.current) / 1e3)).catch(() => {});
    setRes({ ...r, g, best: Math.max(best, r.score), newBest: r.score > best });
    setScr('result');
  };
  const cur = GAMES.find((g) => g.id === scr) || GAMES.find((g) => res && g.id === res.g);
  const inGame = scr !== 'menu' && scr !== 'result';

  let body;
  if (scr === 'menu')
    body = (
      <div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {[['Play passes', TT ? '∞' : pass], ['Tokens', TT ? '∞' : tok]].map(([l, v]) => (
            <div key={l} className="rounded-xl px-3.5 py-2.5" style={{ background: 'var(--color-gold-100)', border: '1px solid var(--color-gold-500)' }}>
              <div className="label">{l}</div>
              <div className="text-[28px] font-extrabold tnum" style={{ color: '#8A6D12' }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="card px-3.5 py-2.5 mb-1.5">
          <div className="text-[13px] leading-snug">Earn a <b style={{ color: '#8A6D12' }}>play pass</b> by solving <b style={{ color: '#3FAE5A' }}>5 easy</b>, <b style={{ color: '#E8B923' }}>3 medium</b> or <b style={{ color: '#E0524D' }}>1 hard</b> question. Or use a token from your badges.</div>
          <div className="rounded-full overflow-hidden mt-2" style={{ height: 8, background: 'var(--color-line)' }}>
            <div style={{ width: (pcr / 15) * 100 + '%', height: '100%', background: 'linear-gradient(90deg,#3FAE5A,#E8B923,#E0524D)' }} />
          </div>
          <div className="faint text-[11.5px] mt-1">{Math.round((pcr / 15) * 100)}% of the way to your next pass</div>
        </div>
        {err && <div className="text-[13px] my-1.5" style={{ color: 'var(--color-bad-500)' }}>{err}</div>}
        <div className="flex flex-col gap-2 mt-2">
          {GAMES.map((g) => {
            const o = unlocked(g), can = o && canPlay;
            return (
              <div key={g.id} className="card flex gap-3 items-center p-3" style={{ opacity: o ? 1 : 0.7 }}>
                <Medal b={g} size={56} locked={!o} />
                <div className="flex-1 min-w-0">
                  <div className="text-[17px] font-bold" style={{ color: o ? '#8A6D12' : 'var(--color-ink)' }}>{g.n}</div>
                  <div className="muted text-[12px] leading-snug mt-0.5 mb-2">{g.d}</div>
                  {o ? (
                    <button disabled={!can || busy} onClick={() => play(g)} className={'btn btn-sm ' + (can ? '' : 'btn-secondary')} style={can ? { background: 'var(--color-gold-500)', color: '#1B2A4A', fontWeight: 800 } : undefined}>
                      {can ? (TT ? 'Play · unlimited' : pass > 0 ? 'Play · use a pass' : 'Play · 1 token') : 'Solve questions to play'}
                    </button>
                  ) : (
                    <div className="text-[12px] font-bold" style={{ color: 'var(--color-brand-500)' }}>Locked · {g.lock}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  else if (scr === 'result')
    body = (
      <div className="text-center pt-2">
        <Halo size={150}><Medal b={cur} size={100} /></Halo>
        <div className="muted text-[13px] mt-1">{res.line}</div>
        <div className="text-[44px] font-extrabold tnum" style={{ color: '#8A6D12' }}>{res.score}</div>
        <div className="muted text-[13px]">{res.newBest ? 'New personal best!' : 'Best: ' + res.best}</div>
        {res.tug && <TugBoard />}
        <div className="flex gap-2 mt-5">
          <button disabled={!canPlay || busy} onClick={() => play(cur)} className="btn btn-lg flex-1" style={canPlay ? { background: 'var(--color-gold-500)', color: '#1B2A4A', fontWeight: 800 } : undefined}>{canPlay ? (pass > 0 ? 'Play again · pass' : 'Play again · token') : 'No passes left'}</button>
          <button onClick={() => setScr('menu')} className="btn btn-secondary btn-lg flex-1">All games</button>
        </div>
        <div className="faint text-[12px] mt-3.5">Solve questions to earn more play passes.</div>
      </div>
    );
  else
    body = scr === 'runner' ? <Runner onEnd={end} /> : scr === 'sudoku' ? <Sudoku onEnd={end} /> : scr === 'ninja' ? <Ninja onEnd={end} /> : scr === 'escape' ? <Escape onEnd={end} /> : <Tug cls={(hub.profile || {}).cls || 'My class'} onEnd={end} />;

  return (
    <Sheet>
      <style>{GAME_CSS}</style>
      <div className="mx-auto px-4 pt-4 pb-8" style={{ maxWidth: 460 }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={inGame ? () => setScr('menu') : onClose} className="btn btn-secondary btn-sm">{inGame ? <><IconClose size={15} /> Quit game</> : scr === 'result' ? <><IconClose size={15} /> Close</> : <><IconBack size={15} /> Back</>}</button>
          <div className="font-bold" style={{ color: '#8A6D12' }}>{inGame ? cur.n : 'Game Zone'}</div>
        </div>
        {body}
      </div>
    </Sheet>
  );
}
