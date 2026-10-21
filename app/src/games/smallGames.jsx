/* Number Ninja, Equation Escape and Class Tug-of-War. */
import React, { useEffect, useRef, useState } from 'react';
import { useHub } from '../app/HubContext';
import { Hud, Pad, rnd } from './gameKit';

/* ---------------- Number Ninja: tap the numbers that fit the rule ---------------- */
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
const RULES = [
  { t: 'multiples of 7', f: (n) => n % 7 === 0, g: () => rnd(2, 99) },
  { t: 'prime numbers', f: isPrime, g: () => rnd(2, 60) },
  { t: 'square numbers', f: (n) => Math.round(Math.sqrt(n)) ** 2 === n, g: () => rnd(1, 150) },
  { t: 'factors of 48', f: (n) => 48 % n === 0, g: () => rnd(1, 30) },
  { t: 'multiples of 6', f: (n) => n % 6 === 0, g: () => rnd(2, 90) },
];

export function Ninja({ onEnd }) {
  const [rule] = useState(() => RULES[rnd(0, RULES.length - 1)]);
  const S = useRef({ items: [], score: 0, lives: 3, time: 45, id: 0, done: false }).current;
  const [, tick] = useState(0);
  const spawn = () => {
    const want = Math.random() < 0.45;
    let v = rule.g();
    for (let k = 0; k < 40 && rule.f(v) !== want; k++) v = rule.g();
    return { id: ++S.id, v, x: rnd(3, 78), y: 104, s: 0.8 + Math.random() * 0.5 };
  };
  useEffect(() => {
    const start = performance.now();
    let last = start, until = 0, raf;
    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1e3), el = (t - start) / 1e3;
      last = t;
      S.time = Math.max(0, 45 - el);
      until -= dt;
      if (until <= 0) {
        until = Math.max(0.5, 0.95 - el * 0.012);
        S.items.push(spawn());
      }
      const speed = 13 + el * 0.45;
      S.items.forEach((it) => {
        if (!it.hitAt) it.y -= speed * dt * it.s;
      });
      S.items = S.items.filter((it) => it.y > -14 && !(it.hitAt && t - it.hitAt > 320));
      if (!S.done && (S.time <= 0 || S.lives <= 0)) {
        S.done = true;
        onEnd({ score: S.score, line: S.lives <= 0 ? 'Out of lives!' : 'Time’s up!' });
        return;
      }
      tick((x) => x + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const tap = (it) => {
    if (it.hitAt || S.done) return;
    it.hitAt = performance.now();
    if (rule.f(it.v)) {
      it.ok = true;
      S.score++;
    } else {
      it.ok = false;
      S.lives--;
    }
  };
  return (
    <div>
      <Hud items={[['Score', S.score], ['Lives', '♥'.repeat(Math.max(0, S.lives)) || '–', 'var(--color-pink-500)'], ['Time', Math.ceil(S.time) + 's', 'var(--color-brand-500)']]} />
      <div className="text-center text-[15px] mb-2">Tap the <b style={{ color: 'var(--color-gold-500)' }}>{rule.t}</b></div>
      <div className="relative rounded-2xl overflow-hidden" style={{ height: 'min(430px,58vh)', background: 'radial-gradient(circle at 50% 120%,rgba(47,111,228,.18),transparent 60%),#EEF2FA', border: '1px solid var(--color-line)', touchAction: 'manipulation' }}>
        {S.items.map((it) => (
          <button key={it.id} onPointerDown={(e) => { e.preventDefault(); tap(it); }} className={'absolute rounded-full tnum ' + (it.hitAt ? 'ap-hit' : '')} style={{ left: it.x + '%', top: it.y + '%', width: 60, height: 60, fontSize: 21, fontWeight: 800, color: it.hitAt ? (it.ok ? '#0E1830' : '#fff') : '#1B2A4A', background: it.hitAt ? (it.ok ? '#6FBF7F' : '#E07A9B') : 'radial-gradient(circle at 35% 30%,rgba(255,255,255,.35),rgba(111,196,232,.25) 45%,rgba(30,50,90,.9))', border: '1px solid rgba(255,255,255,.25)', boxShadow: '0 4px 14px rgba(0,0,0,.35)' }}>{it.v}</button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Equation Escape: solve three equations to open three doors ---------------- */
function equation(k) {
  const x = rnd(-6, 12) || 4;
  const sg = (n) => (n < 0 ? ' − ' : ' + ') + Math.abs(n);
  const num = (n) => (n < 0 ? '−' : '') + Math.abs(n);
  const co = (a) => (a === 1 ? '' : a === -1 ? '−' : num(a));
  if (k === 0) {
    const a = rnd(2, 9), b = rnd(-12, 15) || 5;
    return { x, t: a + 'x' + sg(b) + ' = ' + num(a * x + b) };
  }
  if (k === 1) {
    const a = rnd(2, 6), b = rnd(-5, 8) || 2;
    return { x, t: a + '(x' + sg(b) + ') = ' + num(a * (x + b)) };
  }
  const a = rnd(4, 9), c = rnd(1, a - 2), b = rnd(-10, 10) || 3, d = (a - c) * x + b;
  return { x, t: a + 'x' + sg(b) + ' = ' + co(c) + 'x' + (d ? sg(d) : '') };
}

export function Escape({ onEnd }) {
  const [door, setDoor] = useState(0);
  const [eq, setEq] = useState(() => equation(0));
  const [v, setV] = useState('');
  const [shake, setShake] = useState(0);
  const T = useRef({ left: 120, done: false }).current;
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (T.done) return;
      T.left = Math.max(0, T.left - 0.25);
      if (T.left <= 0) {
        T.done = true;
        onEnd({ score: door * 100, line: 'The clock beat you this time.' });
      }
      tick((x) => x + 1);
    }, 250);
    return () => clearInterval(id);
  }, [door]);
  const check = () => {
    if (T.done || v === '' || v === '-') return;
    if (parseInt(v, 10) === eq.x) {
      const nd = door + 1;
      setV('');
      if (nd >= 3) {
        T.done = true;
        setDoor(3);
        setTimeout(() => onEnd({ score: 300 + Math.round(T.left) * 2, line: 'You escaped with ' + Math.round(T.left) + ' seconds left!' }), 700);
      } else {
        setDoor(nd);
        setEq(equation(nd));
      }
    } else {
      T.left = Math.max(0, T.left - 5);
      setShake((s) => s + 1);
      setV('');
    }
  };
  const Door = (i) => {
    const open = i < door, cur = i === door;
    const gold = 'var(--color-gold-500)';
    return (
      <svg key={i} width="30%" viewBox="0 0 80 110" style={{ maxWidth: 96, overflow: 'visible' }}>
        <rect x="4" y="4" width="72" height="104" rx="36" ry="30" fill={open ? '#F3D77A' : '#0B1428'} stroke={cur ? gold : 'rgba(20,24,40,0.3)'} strokeWidth={cur ? 3 : 2} style={cur ? { filter: 'drop-shadow(0 0 8px rgba(212,175,55,.7))' } : null} />
        <g className={open ? 'ap-door-open' : ''}>
          <path d="M12 106V40a28 26 0 0 1 56 0v66z" fill={open ? '#7E620E' : cur ? '#2E4470' : '#1B2A4A'} />
          {!open && (
            <g fill="none" stroke={cur ? gold : 'rgba(20,24,40,0.45)'} strokeWidth="3">
              <rect x="31" y="62" width="18" height="14" rx="2" fill={cur ? gold : 'rgba(20,24,40,0.45)'} />
              <path d="M34 62v-5a6 6 0 0 1 12 0v5" />
            </g>
          )}
        </g>
        <text x="40" y="24" textAnchor="middle" fill={open ? '#4A3804' : 'var(--color-ink)'} style={{ fontSize: 11, fontWeight: 700 }}>{open ? 'OPEN' : 'Door ' + (i + 1)}</text>
      </svg>
    );
  };
  return (
    <div>
      <Hud items={[['Doors', Math.min(door, 3) + '/3'], ['Time', Math.ceil(T.left) + 's', T.left < 20 ? 'var(--color-pink-500)' : 'var(--color-brand-500)']]} />
      <div className="flex justify-around items-end my-1 mb-3.5">{[0, 1, 2].map(Door)}</div>
      {door < 3 && (
        <div key={shake} className={'card text-center px-2.5 py-3.5 mb-2.5 ' + (shake ? 'ap-shake' : '')}>
          <div className="label">Solve for x to unlock door {door + 1}</div>
          <div className="text-[27px] font-bold my-1.5 tnum">{eq.t}</div>
          <div className="text-[24px] font-extrabold tnum" style={{ color: 'var(--color-gold-500)', minHeight: 30 }}>x = {v ? v.replace('-', '−') : <span style={{ opacity: 0.3 }}>?</span>}</div>
        </div>
      )}
      {door < 3 && <Pad v={v} set={setV} ok={check} neg />}
      <div className="faint text-[11px] text-center mt-2">A wrong answer costs 5 seconds</div>
    </div>
  );
}

/* ---------------- Class Tug-of-War: fast mental maths pulls for your class ---------------- */
function tugQuestion() {
  const k = rnd(0, 2);
  if (k === 0) {
    const a = rnd(3, 12), b = rnd(3, 12);
    return { t: a + ' × ' + b, a: a * b };
  }
  if (k === 1) {
    const a = rnd(12, 79), b = rnd(11, 49);
    return { t: a + ' + ' + b, a: a + b };
  }
  const a = rnd(30, 99), b = rnd(6, a - 5);
  return { t: a + ' − ' + b, a: a - b };
}

export function Tug({ cls, onEnd }) {
  const hub = useHub();
  const [q, setQ] = useState(tugQuestion);
  const [v, setV] = useState('');
  const [shake, setShake] = useState(0);
  const S = useRef({ p: 0, left: 60, score: 0, done: false, pull: 0 }).current;
  const [, tick] = useState(0);
  const finish = (win, line) => {
    if (S.done) return;
    S.done = true;
    const sc = S.score + (win ? 5 : 0);
    hub.backend && hub.backend.tug && hub.backend.tug(cls, sc).catch(() => {});
    setTimeout(() => onEnd({ score: sc, line, tug: true }), 500);
  };
  useEffect(() => {
    const id = setInterval(() => {
      if (S.done) return;
      S.left = Math.max(0, S.left - 0.25);
      S.pull += 0.25;
      if (S.pull >= 2.5) {
        S.pull = 0;
        S.p -= 1;
        if (S.p <= -6) finish(false, 'The clock won the tug this time.');
      }
      if (S.left <= 0) finish(S.p > 0, S.p > 0 ? 'Time’s up — your class was ahead!' : 'Time’s up!');
      tick((x) => x + 1);
    }, 250);
    return () => clearInterval(id);
  }, []);
  const set = (nv) => {
    if (S.done) return;
    setV(nv);
    if (nv.length >= String(q.a).length) {
      if (parseInt(nv, 10) === q.a) {
        S.score++;
        S.p += 1;
        setQ(tugQuestion());
        setV('');
        if (S.p >= 6) finish(true, 'You pulled the clock over the line! +5 bonus');
      } else {
        setShake((s) => s + 1);
        setTimeout(() => setV(''), 150);
      }
    }
  };
  const fx = 150 + Math.max(-6, Math.min(6, S.p)) * 19;
  return (
    <div>
      <Hud items={[['Pulls', S.score], ['Time', Math.ceil(S.left) + 's', 'var(--color-brand-500)']]} />
      <svg viewBox="0 0 300 90" style={{ width: '100%', display: 'block', margin: '2px 0 10px' }}>
        <rect x="0" y="0" width="300" height="90" rx="14" fill="#fff" stroke="var(--color-line)" />
        <line x1="36" y1="8" x2="36" y2="66" stroke="#E07A9B" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="264" y1="8" x2="264" y2="66" stroke="#6FBF7F" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="150" y1="12" x2="150" y2="78" stroke="rgba(20,24,40,0.25)" strokeWidth="1" />
        <path d="M14 50 Q80 44 150 50 T286 50" fill="none" stroke="#C98146" strokeWidth="5" strokeLinecap="round" />
        <g transform={`translate(${fx} 0)`} style={{ transition: 'transform .25s' }}>
          <line x1="0" y1="50" x2="0" y2="22" stroke="#1F2430" strokeWidth="2" />
          <polygon points="0,22 18,28 0,34" fill="#8A6D12" />
        </g>
        <text x="36" y="83" textAnchor="middle" fill="#E07A9B" style={{ fontSize: 11, fontWeight: 700 }}>Clock</text>
        <text x="264" y="83" textAnchor="middle" fill="#6FBF7F" style={{ fontSize: 11, fontWeight: 700 }}>{cls}</text>
      </svg>
      <div key={shake} className={'card text-center px-2.5 py-3 mb-2.5 ' + (shake ? 'ap-shake' : '')}>
        <div className="text-[30px] font-bold tnum">{q.t} =</div>
        <div className="text-[26px] font-extrabold tnum" style={{ color: 'var(--color-gold-500)', minHeight: 32 }}>{v || <span style={{ opacity: 0.3 }}>?</span>}</div>
      </div>
      <Pad v={v} set={set} />
      <div className="faint text-[11px] text-center mt-2">Answers check themselves. Each right answer pulls the rope toward {cls}.</div>
    </div>
  );
}
