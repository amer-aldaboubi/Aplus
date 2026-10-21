/*
  Loads the signed-in student's progress and class board, computes level/badges/tokens,
  shows the welcome-back / badge-unlocked / level-up popups and the "play pass earned" toast,
  and opens the Game Zone on request.
*/
import React, { useEffect, useRef, useState } from 'react';
import { useHub } from '../app/HubContext';
import { on, EV } from '../data/bus';
import { lsJson, lsSet, ssGet, ssSet } from '../data/local';
import { computeRewards, LEVELS } from './rewards';
import { Medal } from './Medal';
import { Halo, GAME_CSS } from '../games/gameKit';
import { GameZone } from '../games/GameZone';
import { Modal, Toast, ProgressBar } from '../ui/primitives';

export function LevelBar({ L, pts, light }) {
  return (
    <div>
      <ProgressBar frac={L.frac} colour="linear-gradient(90deg,#D4A62A,#F3D77A)" height={9} track={light ? 'rgba(255,255,255,.18)' : 'var(--color-line)'} />
      <div className="text-[12px] mt-1.5" style={{ opacity: 0.75 }}>{L.next ? L.next.p - pts + ' points to ' + L.next.n : 'Top level reached!'}</div>
    </div>
  );
}

function Popup({ kind, c, newB, lvUp, firstEver, profile, onClose, onGames }) {
  const won = kind === 'won';
  const cols = ['#D4AF37', '#6FC4E8', '#E07A9B', '#6FBF7F', '#F3D77A'];
  const L = c.L, pts = c.an.pts;
  const one = newB.length === 1 && !lvUp;
  return (
    <Modal onClose={onClose} dark maxWidth={380}>
      <style>{GAME_CSS}</style>
      {won && Array.from({ length: 26 }, (_, i) => <span key={i} className="ap-conf" style={{ left: ((i * 37) % 100) + '%', background: cols[i % 5], animationDuration: 2.2 + (i % 5) * 0.35 + 's', animationDelay: (i % 7) * 0.12 + 's' }} />)}
      <div className="text-center px-5 pt-6 pb-5">
        <div className="label" style={{ color: '#FFD86B' }}>{won ? (lvUp && !newB.length ? 'Level up!' : newB.length > 1 || (lvUp && newB.length) ? 'New rewards!' : 'Badge unlocked!') : firstEver ? 'Welcome to A+ rewards' : 'Welcome back'}</div>
        <div className="text-[22px] font-bold mt-1">{won ? (one ? newB[0].n : lvUp ? 'You are now ' + L.cur.n : 'Great work, ' + profile.name) : profile.name}</div>
        {won && one ? (
          <div className="my-2.5">
            <Halo size={170}><Medal b={newB[0]} size={118} /></Halo>
            <div className="text-[14px]" style={{ opacity: 0.75 }}>{newB[0].d}</div>
          </div>
        ) : (
          <div className="my-3">
            <Halo size={150}><Medal b={L.cur} size={104} shape="hex" /></Halo>
            <div className="text-[19px] font-bold" style={{ color: '#FFD86B' }}>{L.cur.n}</div>
            <div className="text-[12px]" style={{ opacity: 0.6 }}>Level {L.idx + 1} of {LEVELS.length} · {pts} points</div>
          </div>
        )}
        {!(won && one) && <div className="mt-2 mx-1 text-left"><LevelBar L={L} pts={pts} light /></div>}
        {newB.length > 0 && !one && (
          <div className="mt-4">
            <div className="label mb-2" style={{ color: 'rgba(255,255,255,.6)' }}>{won ? 'Badges unlocked' : 'New since your last visit'}</div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {newB.map((b) => (
                <div key={b.id} style={{ width: 76 }}>
                  <div className="flex justify-center"><Medal b={b} size={56} /></div>
                  <div className="text-[11px] font-bold mt-1 leading-tight" style={{ color: '#FFD86B' }}>{b.n}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!won && !newB.length && (
          <div className="mt-3.5">
            <div className="text-[13px] mb-2" style={{ opacity: 0.75 }}>You have {c.earned.length} of {c.bs.length} badges</div>
            {c.earned.length > 0 && <div className="flex flex-wrap justify-center gap-1">{c.earned.slice(-6).map((b) => <Medal key={b.id} b={b} size={34} />)}</div>}
          </div>
        )}
        <button onClick={onClose} autoFocus className="btn btn-lg w-full mt-5" style={{ background: 'linear-gradient(90deg,#D4AF37,#F3D77A)', color: '#1B2A4A', fontWeight: 800 }}>{won ? 'Keep going' : 'Let’s practise'}</button>
        {c.tok > 0 && onGames && <button onClick={onGames} className="btn w-full mt-2" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>Play a game · {c.tok} token{c.tok > 1 ? 's' : ''} to spend</button>}
      </div>
    </Modal>
  );
}

export function RewardsWatcher() {
  const hub = useHub();
  const [pop, setPop] = useState(null);
  const [games, setGames] = useState(false);
  const [toast, setToast] = useState(false);
  const passRef = useRef(-1);
  const boardRef = useRef([]);
  const ok = !!(hub.user && hub.profile && !hub.isGuest && hub.backend);
  const uid = ok ? hub.user.uid : '';

  useEffect(() => {
    if (!ok) return;
    let alive = true;
    const key = 'ap-seen-' + uid;
    const run = async (first) => {
      const prog = await hub.backend.getProgress(uid).catch(() => ({}));
      if (first) boardRef.current = await hub.backend.getBoard().catch(() => []);
      if (!alive) return;
      const c = computeRewards(prog, boardRef.current, uid, hub.profile.cls);
      hub.setRewards({ c, board: boardRef.current, liked: (prog || {}).liked || {} });
      if (!first && passRef.current >= 0 && c.pass > passRef.current) {
        setToast(true);
        setTimeout(() => setToast(false), 6e3);
      }
      passRef.current = c.pass;
      const seen = lsJson(key, null);
      const newB = seen ? c.earned.filter((b) => (seen.b || []).indexOf(b.id) < 0) : [];
      const lvUp = !!seen && c.L.idx > (seen.l || 0);
      lsSet(key, JSON.stringify({ b: c.earned.map((b) => b.id), l: c.L.idx }));
      if (newB.length) {
        const lb = newB[newB.length - 1];
        hub.backend.saveBadge && hub.backend.saveBadge(hub.user, { id: lb.id, at: Date.now() }).catch(() => {});
      }
      if (first) {
        const shown = ssGet('ap-welcome-' + uid) === '1';
        ssSet('ap-welcome-' + uid, '1');
        if (!shown) {
          setPop({ kind: 'welcome', c, newB, lvUp, firstEver: !seen });
          return;
        }
      }
      if (newB.length || lvUp) setPop({ kind: 'won', c, newB, lvUp });
    };
    run(true);
    const offs = [on(EV.RECORDED, () => run(false)), on(EV.REFRESH, () => run(false)), on(EV.OPEN_GAMES, () => setGames(true))];
    return () => {
      alive = false;
      offs.forEach((f) => f());
    };
  }, [uid]);

  // Guests: still allow the games button to do something sensible (it is hidden, but the event may fire).
  useEffect(() => {
    if (ok) return;
    return on(EV.OPEN_GAMES, () => {});
  }, [ok]);

  return (
    <>
      {pop && <Popup {...pop} profile={hub.profile} onClose={() => setPop(null)} onGames={() => { setPop(null); setGames(true); }} />}
      {games && ok && <GameZone onClose={() => setGames(false)} />}
      {toast && !games && (
        <Toast action="Play" onAction={() => { setToast(false); setGames(true); }}>
          <b style={{ color: '#F3D77A' }}>Play pass earned!</b> Nice solving.
        </Toast>
      )}
    </>
  );
}
