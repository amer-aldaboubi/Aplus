/* Shared pieces for the mini-games: HUD, numeric keypad, random helper, CSS. */
import React, { useEffect } from 'react';

export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

export const GAME_CSS = `
@keyframes apShake{0%,100%{transform:none}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}.ap-shake{animation:apShake .35s}
@keyframes apPopOut{to{transform:scale(1.6);opacity:0}}.ap-hit{animation:apPopOut .3s forwards}
@keyframes apOpen{from{transform:perspective(300px) rotateY(0)}to{transform:perspective(300px) rotateY(-70deg)}}.ap-door-open{animation:apOpen .6s forwards;transform-origin:left center}
@keyframes apRays{to{transform:rotate(360deg)}}.ap-rays{animation:apRays 14s linear infinite}
@keyframes apGlow{0%,100%{filter:drop-shadow(0 0 6px rgba(212,166,42,.5))}50%{filter:drop-shadow(0 0 18px rgba(212,166,42,.95))}}.ap-glow{animation:apGlow 2.2s ease-in-out infinite}
@keyframes apFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(105vh) rotate(540deg);opacity:.9}}.ap-conf{position:absolute;top:-16px;width:8px;height:14px;border-radius:2px;animation:apFall linear forwards}
@media (prefers-reduced-motion:reduce){.ap-shake,.ap-hit,.ap-door-open,.ap-rays,.ap-glow,.ap-conf{animation:none!important}.ap-conf{display:none}}`;

/** Score/lives/time strip. items: [[label, value, colour?], ...] */
export function Hud({ items }) {
  return (
    <div className="flex justify-between gap-1.5 mb-2.5">
      {items.map(([l, v, c]) => (
        <div key={l} className="flex-1 text-center rounded-xl py-1.5 px-0.5" style={{ background: '#fff', border: '1px solid var(--color-line)' }}>
          <div className="text-[19px] font-extrabold tnum" style={{ color: c || 'var(--color-gold-500)' }}>{v}</div>
          <div className="label" style={{ fontSize: 9.5 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/** On-screen keypad with keyboard support. v: current string; set(v); ok(): submit; neg: allow minus */
export function Pad({ v, set, ok, neg }) {
  const press = (k) => {
    if (k === '⌫') set(v.slice(0, -1));
    else if (k === '−') set(v.charAt(0) === '-' ? v.slice(1) : '-' + v);
    else if (k && v.replace('-', '').length < 4) set(v + k);
  };
  useEffect(() => {
    const f = (e) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('⌫');
      else if (e.key === '-' && neg) press('−');
      else if (e.key === 'Enter' && ok) ok();
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  });
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', neg ? '−' : '', '0', '⌫'];
  const kb = { padding: '13px 0', borderRadius: 12, fontSize: 20, fontWeight: 700, background: '#fff', border: '1px solid var(--color-line)', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' };
  return (
    <div>
      <div className="grid grid-cols-3 gap-[7px]">{keys.map((k, i) => (k ? <button key={i} onClick={() => press(k)} style={kb}>{k}</button> : <div key={i} />))}</div>
      {ok && <button onClick={ok} className="w-full mt-[7px]" style={{ ...kb, background: 'var(--color-brand-500)', color: '#fff', border: 0, fontSize: 17 }}>Check ✓</button>}
    </div>
  );
}

/** Rotating-rays halo behind a medal. */
export function Halo({ children, size = 150 }) {
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="ap-rays absolute inset-0 rounded-full" style={{ background: 'repeating-conic-gradient(rgba(212,166,42,.30) 0 9deg,transparent 9deg 22deg)', WebkitMaskImage: 'radial-gradient(circle,#000 30%,transparent 70%)', maskImage: 'radial-gradient(circle,#000 30%,transparent 70%)' }} />
      <div className="ap-glow relative">{children}</div>
    </div>
  );
}
