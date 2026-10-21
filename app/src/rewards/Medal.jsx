import React, { useId } from 'react';
import { TIERS } from './rewards';

function hexPoints(r, cy) {
  const p = [];
  for (let k = 0; k < 6; k++) {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    p.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
  }
  return p.join(' ');
}

function starPoints(cx, cy, R, r) {
  const p = [];
  for (let k = 0; k < 10; k++) {
    const a = ((-90 + 36 * k) * Math.PI) / 180;
    const q = k % 2 ? r : R;
    p.push((cx + q * Math.cos(a)).toFixed(1) + ',' + (cy + q * Math.sin(a)).toFixed(1));
  }
  return p.join(' ');
}

function Glyph({ g, ink }) {
  const sw = { fill: 'none', stroke: ink, strokeWidth: 3.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (g.k) {
    case 'txt':
      return (
        <text x="50" y="61" textAnchor="middle" dominantBaseline="central" fill={ink} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: g.v.length > 2 ? 20 : g.v.length > 1 ? 26 : 31 }}>
          {g.v}
        </text>
      );
    case 'flame':
      return <path d="M50 43c4 7 12 11 12 20a12 12 0 0 1-24 0c0-6 3-9 6-11 0 4 2 7 5 7-2-6-1-11 1-16z" fill={ink} />;
    case 'target':
      return (
        <g>
          <circle cx="50" cy="60" r="13" {...sw} />
          <circle cx="50" cy="60" r="7" {...sw} />
          <circle cx="50" cy="60" r="2.6" fill={ink} />
        </g>
      );
    case 'compass':
      return (
        <g>
          <circle cx="50" cy="60" r="14" {...sw} />
          <polygon points="50,48 55,60 50,62" fill={ink} />
          <polygon points="50,72 45,60 50,58" fill={ink} opacity="0.45" />
        </g>
      );
    case 'book':
      return (
        <g {...sw}>
          <path d="M36 50c5-2 10-1 14 2v19c-4-3-9-4-14-2z" />
          <path d="M64 50c-5-2-10-1-14 2v19c4-3 9-4 14-2z" />
        </g>
      );
    case 'cal':
      return (
        <g>
          <rect x="37" y="48" width="26" height="24" rx="3" {...sw} />
          <line x1="37" y1="55" x2="63" y2="55" {...sw} />
          <text x="50" y="64.5" textAnchor="middle" dominantBaseline="central" fill={ink} style={{ fontWeight: 800, fontSize: 13 }}>7</text>
        </g>
      );
    case 'star':
      return <polygon points={starPoints(50, 61, 15, 6.5)} fill={ink} />;
    case 'bolt':
      return <polygon points="55,41 40,63 50,63 45,79 61,55 51,55" fill={ink} />;
    case 'door':
      return (
        <g>
          <path d="M39 77V52a11 11 0 0 1 22 0v25z" {...sw} />
          <circle cx="55" cy="66" r="2.2" fill={ink} />
        </g>
      );
    case 'rope':
      return (
        <g>
          <path d="M33 66 Q42 54 50 61 T67 55" {...sw} />
          <circle cx="33" cy="66" r="3.5" fill={ink} />
          <circle cx="67" cy="55" r="3.5" fill={ink} />
        </g>
      );
    case 'stars':
      return (
        <g fill={ink}>
          <polygon points={starPoints(50, 55, 9, 4)} />
          <polygon points={starPoints(40, 68, 7, 3)} />
          <polygon points={starPoints(60, 68, 7, 3)} />
        </g>
      );
    default:
      return null;
  }
}

/** A medal (ribbon) or hexagonal level badge. b = { t: tier, g: glyph } */
export function Medal({ b, size = 56, locked = false, shape }) {
  const tk = locked ? 'x' : b.t;
  const T = TIERS[tk];
  const hex = shape === 'hex';
  const cy = hex ? 50 : 62;
  // Gradient ids must be unique per instance: a medal inside a hidden container would otherwise
  // capture the id and leave every other medal on the page unpainted.
  const gid = 'apm-' + tk + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', flexShrink: 0, overflow: 'visible' }} aria-hidden="true">
      <defs>
        <linearGradient id={gid + 'r'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={T.hi} />
          <stop offset=".55" stopColor={T.mid} />
          <stop offset="1" stopColor={T.lo} />
        </linearGradient>
        <radialGradient id={gid + 'f'} cx=".38" cy=".32" r=".85">
          <stop offset="0" stopColor={T.hi} />
          <stop offset=".7" stopColor={T.mid} />
          <stop offset="1" stopColor={T.lo} />
        </radialGradient>
      </defs>
      {!hex && (
        <g>
          <polygon points="28,0 46,0 56,34 40,38" fill={T.r1} />
          <polygon points="72,0 54,0 44,34 60,38" fill={T.r2} />
          <rect x="28" y="0" width="44" height="4" fill={T.r2} opacity="0.6" />
        </g>
      )}
      {hex ? <polygon points={hexPoints(40, cy)} fill={`url(#${gid}r)`} /> : <circle cx="50" cy={cy} r="34" fill={`url(#${gid}r)`} />}
      {hex ? (
        <polygon points={hexPoints(32, cy)} fill={`url(#${gid}f)`} stroke={T.lo} strokeOpacity="0.35" strokeWidth="1" />
      ) : (
        <circle cx="50" cy={cy} r="27" fill={`url(#${gid}f)`} stroke={T.lo} strokeOpacity="0.35" strokeWidth="1" />
      )}
      {hex ? (
        <polygon points={hexPoints(27, cy)} fill="none" stroke={T.lo} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 3" />
      ) : (
        <circle cx="50" cy={cy} r="23" fill="none" stroke={T.lo} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 3" />
      )}
      <g transform={`translate(0 ${cy - 60})`} opacity={locked ? 0.55 : 1}>
        <Glyph g={b.g} ink={T.ink} />
      </g>
      <ellipse cx="39" cy={cy - 14} rx="13" ry="5" fill="#fff" opacity={locked ? 0.08 : 0.32} transform={`rotate(-28 39 ${cy - 14})`} />
    </svg>
  );
}
