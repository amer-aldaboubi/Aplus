/* A+ Calc core: expression parser, polynomial tools, solver, stats. No eval. */
(function (root) {
  'use strict';
  const FN1 = {
    sin: 1, cos: 1, tan: 1, asin: 1, acos: 1, atan: 1, sinh: 1, cosh: 1, tanh: 1,
    sqrt: 1, cbrt: 1, abs: 1, log: 1, ln: 1, exp: 1, fact: 1, floor: 1, ceil: 1, conj: 1, arg: 1, re: 1, im: 1,
  };
  const FN2 = { logb: 1, root: 1, npr: 1, ncr: 1, max: 1, min: 1 };
  const WORDS = Object.keys(FN1).concat(Object.keys(FN2), ['pi', 'ans', 'diff', 'integ']).sort((a, b) => b.length - a.length);

  function norm(s) {
    return String(s).toLowerCase()
      .replace(/×|·|⋅/g, '*').replace(/÷/g, '/').replace(/[−–—]/g, '-')
      .replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/ℯ/g, 'e')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/\s+/g, '')
      .replace(/(\d|\))exp(?=[-+]?\d)/g, '$1*10^').replace(/×10\^/g, '*10^');
  }
  function tokenize(src) {
    const s = norm(src), t = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.]/.test(c)) {
        let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++;
        const v = parseFloat(s.slice(i, j));
        if (isNaN(v)) throw new Error('Syntax ERROR');
        t.push({ k: 'n', v }); i = j;
      } else if (/[a-z]/.test(c)) {
        let hit = null;
        for (const w of WORDS) if (s.startsWith(w, i)) { hit = w; break; }
        if (hit) { t.push({ k: hit === 'pi' ? 'c' : hit === 'ans' ? 'a' : 'f', v: hit }); i += hit.length; }
        else { t.push({ k: 'v', v: c }); i++; }          // e, x, y ...
      } else if ('+-*/^()!%,='.includes(c)) { t.push({ k: 'o', v: c }); i++; }
      else throw new Error('Syntax ERROR');
    }
    return t;
  }

  // parse -> closure evaluating with env {x,y,ans,deg}
  function parse(src) {
    const t = tokenize(src); let p = 0;
    const peek = () => t[p];
    const isO = (v) => t[p] && t[p].k === 'o' && t[p].v === v;
    function expr() {
      let l = term();
      while (isO('+') || isO('-')) {
        const op = t[p++].v, r = term(), a = l;
        l = op === '+' ? (e) => a(e) + r(e) : (e) => a(e) - r(e);
      }
      return l;
    }
    function startsPrimary() {
      const x = t[p];
      return x && (x.k === 'n' || x.k === 'f' || x.k === 'c' || x.k === 'a' || x.k === 'v' || (x.k === 'o' && x.v === '('));
    }
    function term() {
      let l = unary();
      for (;;) {
        if (isO('*') || isO('/')) {
          const op = t[p++].v, r = unary(), a = l;
          l = op === '*' ? (e) => a(e) * r(e) : (e) => { const d = r(e); if (d === 0) throw new Error('Math ERROR'); return a(e) / d; };
        } else if (startsPrimary()) {
          const r = unary(), a = l; l = (e) => a(e) * r(e);
        } else break;
      }
      return l;
    }
    function unary() {
      if (isO('-')) { p++; const a = unary(); return (e) => -a(e); }
      if (isO('+')) { p++; return unary(); }
      return power();
    }
    function power() {
      const b = postfix();
      if (isO('^')) {
        p++;
        const ex = unary(); // right assoc, allows 2^-3
        return (e) => { const r = Math.pow(b(e), ex(e)); if (!isFinite(r)) throw new Error('Math ERROR'); return r; };
      }
      return b;
    }
    function postfix() {
      let a = primary();
      while (isO('!') || isO('%')) {
        const op = t[p++].v, b = a;
        a = op === '!' ? (e) => factorial(b(e)) : (e) => b(e) / 100;
      }
      return a;
    }
    function args(n) {
      if (!isO('(')) { // sin30, sqrt9 style
        if (n === 1) { const a = power(); return [a]; }
        throw new Error('Syntax ERROR');
      }
      p++; const out = [expr()];
      while (isO(',')) { p++; out.push(expr()); }
      if (isO(')')) p++;         // missing ")" at the end is allowed
      if (out.length !== n) throw new Error('Argument ERROR');
      return out;
    }
    function primary() {
      const x = t[p];
      if (!x) throw new Error('Syntax ERROR');
      if (x.k === 'n') { p++; return () => x.v; }
      if (x.k === 'c') { p++; return () => Math.PI; }
      if (x.k === 'a') { p++; return (e) => e.ans || 0; }
      if (x.k === 'v') { p++; const nm = x.v; return (e) => { if (nm === 'e' && !(e && 'e' in e)) return Math.E; if (e && nm in e) return e[nm]; throw new Error('Variable ERROR'); }; }
      if (x.k === 'o' && x.v === '(') { p++; const a = expr(); if (isO(')')) p++; return a; }
      if (x.k === 'f') {
        p++; const nm = x.v;
        if (nm === 'diff' || nm === 'integ') {
          if (!isO('(')) throw new Error('Syntax ERROR');
          p++; const body = expr(), rest = [];
          while (isO(',')) { p++; rest.push(expr()); }
          if (isO(')')) p++;
          if (rest.length !== (nm === 'diff' ? 1 : 2)) throw new Error('Argument ERROR');
          return (e) => {
            const F = (t) => body(Object.assign({}, e, { x: t }));
            return nm === 'diff' ? numDiff(F, rest[0](e)) : numInt(F, rest[0](e), rest[1](e));
          };
        }
        if (FN1[nm]) { const [a] = args(1); return (e) => fn1(nm, a(e), e); }
        const [a, b] = args(2); return (e) => fn2(nm, a(e), b(e));
      }
      throw new Error('Syntax ERROR');
    }
    const f = expr();
    if (p < t.length) throw new Error('Syntax ERROR');
    return f;
  }

  function factorial(n) {
    if (n < 0 || Math.abs(n - Math.round(n)) > 1e-9 || n > 170) throw new Error('Math ERROR');
    let r = 1; for (let i = 2; i <= Math.round(n); i++) r *= i; return r;
  }
  function snap(v) { const r = Math.round(v); if (Math.abs(v - r) < 1e-12 * Math.max(1, Math.abs(v))) return r; return parseFloat(v.toPrecision(13)); }
  function fn1(n, v, e) {
    const D = e && e.deg !== false, k = Math.PI / 180;
    let r;
    switch (n) {
      case 'sin': r = Math.sin(D ? v * k : v); if (D && Math.abs(v % 180) < 1e-12) r = 0; break;
      case 'cos': r = Math.cos(D ? v * k : v); if (D && Math.abs((v - 90) % 180) < 1e-12) r = 0; break;
      case 'tan':
        if (D && Math.abs((v - 90) % 180) < 1e-12) throw new Error('Math ERROR');
        r = Math.tan(D ? v * k : v); if (D && Math.abs(v % 180) < 1e-12) r = 0; break;
      case 'asin': if (Math.abs(v) > 1) throw new Error('Math ERROR'); r = Math.asin(v); if (D) r /= k; break;
      case 'acos': if (Math.abs(v) > 1) throw new Error('Math ERROR'); r = Math.acos(v); if (D) r /= k; break;
      case 'atan': r = Math.atan(v); if (D) r /= k; break;
      case 'sinh': r = Math.sinh(v); break; case 'cosh': r = Math.cosh(v); break; case 'tanh': r = Math.tanh(v); break;
      case 'sqrt': if (v < 0) throw new Error('Math ERROR'); r = Math.sqrt(v); break;
      case 'cbrt': r = Math.cbrt(v); break;
      case 'abs': r = Math.abs(v); break;
      case 'log': if (v <= 0) throw new Error('Math ERROR'); r = Math.log10(v); break;
      case 'ln': if (v <= 0) throw new Error('Math ERROR'); r = Math.log(v); break;
      case 'exp': r = Math.exp(v); break;
      case 'fact': r = factorial(v); break;
      case 'floor': r = Math.floor(v); break; case 'ceil': r = Math.ceil(v); break;
      case 'conj': case 're': r = v; break; case 'im': r = 0; break;
      case 'arg': r = v >= 0 ? 0 : (D ? 180 : Math.PI); break;
    }
    if (!isFinite(r)) throw new Error('Math ERROR');
    return snap(r);
  }
  function fn2(n, a, b) {
    let r;
    switch (n) {
      case 'logb': if (a <= 0 || a === 1 || b <= 0) throw new Error('Math ERROR'); r = Math.log(b) / Math.log(a); break; // logb(base, x)
      case 'root': if (a === 0) throw new Error('Math ERROR'); r = (b < 0 && Math.round(a) % 2 === 1) ? -Math.pow(-b, 1 / a) : Math.pow(b, 1 / a); break; // root(n, x)
      case 'npr': r = factorial(a) / factorial(a - b); break;
      case 'ncr': r = factorial(a) / (factorial(b) * factorial(a - b)); break;
      case 'max': r = Math.max(a, b); break; case 'min': r = Math.min(a, b); break;
    }
    if (!isFinite(r)) throw new Error('Math ERROR');
    return snap(r);
  }

  function loose(v) {
    if (!isFinite(v)) throw new Error('Math ERROR');
    const r = Math.round(v); if (Math.abs(v - r) < 1e-7 * Math.max(1, Math.abs(v))) return r;
    return parseFloat(v.toPrecision(10));
  }
  function numDiff(F, x0) {
    const h0 = 1e-2 * Math.max(1, Math.abs(x0));
    const D = (h) => (F(x0 + h) - F(x0 - h)) / (2 * h);
    // Richardson extrapolation
    let a = D(h0), b = D(h0 / 2), c = D(h0 / 4);
    const r1 = (4 * b - a) / 3, r2 = (4 * c - b) / 3;
    return loose((16 * r2 - r1) / 15);
  }
  function numInt(F, a, b) {
    if (a === b) return 0;
    let sign = 1; if (a > b) { const t = a; a = b; b = t; sign = -1; }
    const simpson = (fa, fm, fb, l, r) => (r - l) / 6 * (fa + 4 * fm + fb);
    function rec(l, r, fl, fm, fr, whole, tol, depth) {
      const m = (l + r) / 2, lm = (l + m) / 2, rm = (m + r) / 2, flm = F(lm), frm = F(rm);
      const left = simpson(fl, flm, fm, l, m), right = simpson(fm, frm, fr, m, r);
      if (depth <= 0 || Math.abs(left + right - whole) <= 15 * tol) return left + right + (left + right - whole) / 15;
      return rec(l, m, fl, flm, fm, left, tol / 2, depth - 1) + rec(m, r, fm, frm, fr, right, tol / 2, depth - 1);
    }
    const fa = F(a), fb = F(b), fm = F((a + b) / 2);
    return loose(sign * rec(a, b, fa, fm, fb, simpson(fa, fm, fb, a, b), 1e-11, 30));
  }

  function calc(src, opts) {
    const f = parse(src);
    const v = f({ ans: opts && opts.ans, deg: !(opts && opts.deg === false) });
    if (!isFinite(v) || isNaN(v)) throw new Error('Math ERROR');
    return v;
  }

  // ---------- formatting ----------
  function fmt(v) {
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e10 || a < 1e-9) {
      const [m, ex] = v.toExponential(9).split('e');
      return (+m).toString() + '×10^' + (+ex);
    }
    return String(parseFloat(v.toPrecision(10)));
  }
  function frac(v, maxDen) {
    maxDen = maxDen || 10000;
    if (!isFinite(v) || Number.isInteger(v)) return null;
    const s = v < 0 ? -1 : 1; let x = Math.abs(v);
    let h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = x;
    for (let i = 0; i < 40; i++) {
      const a = Math.floor(b), h2 = a * h1 + h0, k2 = a * k1 + k0;
      if (k2 > maxDen) return null;
      h0 = h1; h1 = h2; k0 = k1; k1 = k2;
      if (Math.abs(x - h1 / k1) < 1e-11 * Math.max(1, x)) return { n: s * h1, d: k1 };
      const fr = b - a; if (fr < 1e-14) break; b = 1 / fr;
    }
    return null;
  }
  const fracStr = (f) => (f ? f.n + '/' + f.d : null);

  // ---------- polynomials ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = (n) => String(n).split('').map((c) => SUP[c]).join('');
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; };

  // return {c:[c0..cd] rational-scaled to integers (Number), scale} or throws
  function polyOf(src, v) {
    v = v || 'x';
    const f = parse(src);
    const F = (x) => { const e = { ans: 0, deg: true }; e[v] = x; return f(e); };
    const MAXD = 6, pts = []; for (let i = 0; i <= MAXD + 1; i++) pts.push(i);
    const ys = pts.map(F);
    // finite differences to find degree
    let d = -1, diff = ys.slice();
    const scale = Math.max(1, ...ys.map(Math.abs));
    for (let k = 0; k <= MAXD + 1; k++) {
      if (diff.every((q) => Math.abs(q) < 1e-9 * scale * (k + 1))) { d = Math.max(0, k - 1); break; }
      diff = diff.slice(1).map((q, i) => q - diff[i]);
    }
    if (d < 0) throw new Error('Not a polynomial');
    // solve Vandermonde (points 0..d)
    const n = d + 1, M = [];
    for (let i = 0; i < n; i++) { const row = []; for (let j = 0; j < n; j++) row.push(Math.pow(i, j)); row.push(ys[i]); M.push(row); }
    for (let i = 0; i < n; i++) {
      let pv = i; for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[pv][i])) pv = r;
      [M[i], M[pv]] = [M[pv], M[i]];
      for (let r = 0; r < n; r++) if (r !== i) { const q = M[r][i] / M[i][i]; for (let c = i; c <= n; c++) M[r][c] -= q * M[i][c]; }
    }
    let c = M.map((row, i) => row[n] / row[i]);
    // verify at other points
    const chk = [-1.5, 2.5, 8.3, -4, 20.7, -13.3];
    for (const x of chk) {
      const pv = c.reduce((s, cj, j) => s + cj * Math.pow(x, j), 0);
      if (Math.abs(pv - F(x)) > 1e-9 * Math.max(1, Math.abs(pv))) throw new Error('Not a polynomial');
    }
    // make integer by scaling
    let m = 0;
    for (let s = 1; s <= 720; s++) if (c.every((q) => Math.abs(q * s - Math.round(q * s)) < 1e-6 * Math.max(1, s))) { m = s; break; }
    const real = c.slice();
    while (real.length > 1 && Math.abs(real[real.length - 1]) < 1e-9) real.pop();
    if (!m) return { c: real, scale: 1, exact: false };
    c = c.map((q) => Math.round(q * m));
    while (c.length > 1 && c[c.length - 1] === 0) c.pop();
    return { c, scale: m, exact: true, real: real };
  }

  function polyStr(c, v) {
    v = v || 'x';
    let out = '';
    for (let i = c.length - 1; i >= 0; i--) {
      let a = c[i]; if (a === 0 || a === 0n) continue;
      a = Number(a);
      const neg = a < 0, ab = Math.abs(a);
      const co = (ab === 1 && i > 0) ? '' : String(ab);
      const term = i === 0 ? String(ab) : co + v + (i > 1 ? sup(i) : '');
      out += out === '' ? (neg ? '−' : '') + term : (neg ? ' − ' : ' + ') + term;
    }
    return out || '0';
  }

  const divisors = (n) => {
    n = Number(n < 0n ? -n : n); const r = [];
    for (let i = 1; i * i <= n && i <= 1e6; i++) if (n % i === 0) { r.push(i); if (i * i !== n) r.push(n / i); }
    return r.map(BigInt);
  };
  function evalBig(c, p, q) { // q^d f(p/q)
    const d = c.length - 1; let s = 0n;
    for (let i = 0; i <= d; i++) s += c[i] * p ** BigInt(i) * q ** BigInt(d - i);
    return s;
  }
  function divLin(c, p, q) { // divide by (q x - p)
    const d = c.length - 1, b = new Array(d);
    let carry = 0n;
    for (let i = d; i >= 1; i--) {
      const num = c[i] + carry;
      if (num % q !== 0n) return null;
      b[i - 1] = num / q; carry = p * b[i - 1];
    }
    if (c[0] + carry !== 0n) return null;
    return b;
  }
  // factor integer poly (array of Number) -> {k, lin:[{p,q,m}], rest:[BigInt..]}
  function rationalFactor(cNum) {
    let c = cNum.map((x) => BigInt(Math.round(x)));
    const lin = [];
    let k = 0n; // power of x
    while (c.length > 1 && c[0] === 0n) { c = c.slice(1); k++; }
    let guard = 0;
    outer: while (c.length > 2 && guard++ < 40) {
      const P = divisors(c[0]), Q = divisors(c[c.length - 1]);
      for (const q of Q) for (const p0 of P) for (const sg of [1n, -1n]) {
        const p = p0 * sg;
        if (gcd(p, q) !== 1n) continue;
        if (evalBig(c, p, q) === 0n) {
          const nb = divLin(c, p, q);
          if (nb) { lin.push({ p, q }); c = nb; continue outer; }
        }
      }
      break;
    }
    // c.length==2 -> linear remainder (rational root)
    if (c.length === 2) {
      const a = c[1], b0 = c[0]; const g = gcd(a, b0) || 1n;
      lin.push({ p: -b0 / g * (a < 0n ? -1n : 1n), q: (a < 0n ? -a : a) / g });
      c = [a < 0n ? -g : g];
    }
    return { k: Number(k), lin, rest: c };
  }

  function linStr(l, v) {
    v = v || 'x';
    const p = Number(l.p), q = Number(l.q);
    const lead = q === 1 ? v : q + v;
    return p === 0 ? lead : '(' + lead + (p > 0 ? ' − ' + p : ' + ' + (-p)) + ')';
  }
  function factorise(src) {
    const P = polyOf(src, 'x');
    if (!P.exact) throw new Error('Cannot factorise');
    if (P.c.length === 1) return { text: String(P.c[0]), expanded: String(P.c[0]) };
    const g0 = P.c.map((x) => BigInt(x)).reduce((a, b) => gcd(a, b), 0n);
    const R = rationalFactor(P.c);
    const parts = [];
    const counts = new Map();
    if (R.k > 0) counts.set('x', R.k);
    for (const l of R.lin) { const key = linStr(l); counts.set(key, (counts.get(key) || 0) + 1); }
    // constant: leading of P.c sign and content
    let lead = 1n;
    const rest = R.rest.slice();
    let restStr = '';
    if (rest.length === 1) { lead = rest[0]; }
    else {
      const cg = rest.reduce((a, b) => gcd(a, b), 0n);
      const sg = rest[rest.length - 1] < 0n ? -1n : 1n;
      lead = cg * sg;
      const prim = rest.map((x) => x / lead);
      restStr = polyStr(prim.map(Number));
    }
    // fold the content: R.lin factors are primitive, so constant = lead
    let text = '';
    if (lead === -1n) text = '−'; else if (lead !== 1n) text = String(lead);
    for (const [k, n] of counts) text += k.startsWith('(') ? k + (n > 1 ? sup(n) : '') : (n > 1 ? k + sup(n) : k);
    if (restStr) text += '(' + restStr + ')';
    // if every factor is bare x and lead==1 text may be 'x'
    if (P.scale !== 1) text = '(1/' + P.scale + ') × ' + text;
    void g0; void parts;
    return { text, expanded: polyStr(P.c), irreducibleLeft: !!restStr, scale: P.scale };
  }
  function expand(src) {
    const P = polyOf(src, 'x');
    if (P.exact) return polyStr(P.c) + (P.scale !== 1 ? '  (all ÷ ' + P.scale + ')' : '');
    return polyStr(P.c.map((q) => +q.toFixed(6)));
  }

  // ---------- solving ----------
  function simplifySurd(D) { // D positive integer -> [k, m] with sqrt(D)=k*sqrt(m)
    let k = 1, m = D;
    for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; }
    return [k, m];
  }
  const rtStr = (n) => (n === 1 ? '' : String(n));
  function quadSolve(a, b, c) {
    const D = b * b - 4 * a * c;
    if (D < 0) return { lines: ['No real solutions (discriminant < 0)'], roots: [] };
    const sD = Math.sqrt(D), r1 = (-b + sD) / (2 * a), r2 = (-b - sD) / (2 * a);
    const lines = [];
    if (D === 0 || frac(sD, 1000) || Number.isInteger(sD)) {
      const lo = Math.min(r1, r2), hi = Math.max(r1, r2), R = (v) => { const f = frac(v, 100000); return f ? fracStr(f).replace(/\/1$/, '') : fmt(v); };
      return { lines: D === 0 ? ['x = ' + R(r1) + ' (repeated)'] : ['x = ' + R(lo), 'x = ' + R(hi)], roots: D === 0 ? [r1] : [lo, hi] };
    }
    if (Number.isInteger(D)) {
      const [k, m] = simplifySurd(D);
      let A = -b, B = k, Cc = 2 * a;
      let g = Number(gcd(BigInt(A), gcd(BigInt(B), BigInt(Cc)))); if (g === 0) g = 1;
      A /= g; B /= g; Cc /= g; if (Cc < 0) { A = -A; Cc = -Cc; /* B sign irrelevant with ± */ }
      const num = (A === 0 ? '' : A) + (A === 0 ? '±' : ' ± ') + rtStr(B) + '√' + m;
      lines.push('x = ' + (Cc === 1 ? num.replace(/^(-?\d+) ± /, '$1 ± ') : '(' + num + ')/' + Cc));
      lines.push('x ≈ ' + fmt(r1) + '  or  x ≈ ' + fmt(r2));
    } else lines.push('x ≈ ' + fmt(r1), 'x ≈ ' + fmt(r2));
    return { lines, roots: [r1, r2] };
  }
  function durand(c) { // c[0..d] real, return real roots
    const d = c.length - 1, a = c.map((x) => x / c[d]);
    let z = []; for (let i = 0; i < d; i++) z.push([Math.cos(0.9 + i * 2 * Math.PI / d) * 2, Math.sin(0.9 + i * 2 * Math.PI / d) * 2]);
    const mul = (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]];
    const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
    const dv = (p, q) => { const n = q[0] * q[0] + q[1] * q[1]; return [(p[0] * q[0] + p[1] * q[1]) / n, (p[1] * q[0] - p[0] * q[1]) / n]; };
    for (let it = 0; it < 500; it++) {
      for (let i = 0; i < d; i++) {
        let pv = [1, 0]; for (let j = d - 1; j >= 0; j--) pv = [mul(pv, z[i])[0] + a[j], mul(pv, z[i])[1]];
        let den = [1, 0]; for (let j = 0; j < d; j++) if (j !== i) den = mul(den, sub(z[i], z[j]));
        z[i] = sub(z[i], dv(pv, den));
      }
    }
    return z.filter((q) => Math.abs(q[1]) < 1e-7).map((q) => q[0]).sort((x, y) => x - y);
  }
  function numericRoots(F, lo, hi) {
    const roots = [], step = 0.01; let px = lo, pf = null;
    try { pf = F(px); } catch (e) { pf = NaN; }
    for (let x = lo + step; x <= hi + 1e-9; x += step) {
      let fx; try { fx = F(x); } catch (e) { fx = NaN; }
      if (isFinite(pf) && isFinite(fx)) {
        if (fx === 0) roots.push(x);
        else if (pf * fx < 0 && Math.abs(pf - fx) < 1e6) {
          let a = px, b = x, fa = pf;
          for (let i = 0; i < 80; i++) { const m = (a + b) / 2, fm = F(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
          roots.push((a + b) / 2);
        }
      }
      px = x; pf = fx;
    }
    return roots.filter((r, i) => i === 0 || Math.abs(r - roots[i - 1]) > 1e-6).slice(0, 12);
  }

  function solve(src, opts) {
    const nEq = (String(src).match(/=/g) || []).length;
    const eqs = String(src).split(nEq >= 2 ? /[;\n,]/ : /[;\n]/).map((s) => s.trim()).filter(Boolean);
    const toF = (s) => {
      const parts = s.replace(/==/g, '=').split('=');
      if (parts.length > 2) throw new Error('Syntax ERROR');
      const L = parse(parts[0]), R = parts[1] !== undefined ? parse(parts[1]) : () => 0;
      return (e) => L(e) - R(e);
    };
    const ed = (extra) => Object.assign({ ans: (opts && opts.ans) || 0, deg: !(opts && opts.deg === false) }, extra);
    // simultaneous
    if (eqs.length === 2) {
      const f1 = toF(eqs[0]), f2 = toF(eqs[1]);
      const co = (f) => {
        const c0 = f(ed({ x: 0, y: 0 })), a = f(ed({ x: 1, y: 0 })) - c0, b = f(ed({ x: 0, y: 1 })) - c0;
        if (Math.abs(f(ed({ x: 2, y: 3 })) - (c0 + 2 * a + 3 * b)) > 1e-7) throw new Error('Only linear simultaneous equations');
        return [a, b, -c0];
      };
      const [a1, b1, k1] = co(f1), [a2, b2, k2] = co(f2);
      const det = a1 * b2 - a2 * b1;
      if (Math.abs(det) < 1e-12) return { lines: ['No unique solution (parallel or identical lines)'] };
      const x = (k1 * b2 - k2 * b1) / det, y = (a1 * k2 - a2 * k1) / det;
      const sf = (v) => { const f = frac(v); return fmt(v) + (f ? '  =  ' + fracStr(f) : ''); };
      return { lines: ['x = ' + sf(x), 'y = ' + sf(y)], vals: [x, y] };
    }
    if (eqs.length !== 1) throw new Error('Enter one equation, or two separated by ;');
    const f = toF(eqs[0]);
    // polynomial?
    let P = null;
    try { P = polyOf(eqs[0].includes('=') ? eqs[0].split('=')[0] + '-(' + eqs[0].split('=')[1] + ')' : eqs[0], 'x'); } catch (e) { P = null; }
    if (P && P.c.length > 1) {
      if (P.exact) {
        const R = rationalFactor(P.c);
        const roots = [], lines = [];
        const seen = new Set();
        if (R.k > 0) { roots.push(0); lines.push('x = 0' + (R.k > 1 ? ' (repeated)' : '')); }
        for (const l of R.lin) {
          const key = l.p + '/' + l.q; if (seen.has(key)) continue; seen.add(key);
          const v = Number(l.p) / Number(l.q); roots.push(v);
          const rep = R.lin.filter((z) => z.p === l.p && z.q === l.q).length > 1 ? ' (repeated)' : '';
          lines.push('x = ' + (Number(l.q) === 1 ? Number(l.p) : Number(l.p) + '/' + Number(l.q)) + (Number(l.q) !== 1 ? '  = ' + fmt(v) : '') + rep);
        }
        if (R.rest.length === 3) { const q = quadSolve(Number(R.rest[2]), Number(R.rest[1]), Number(R.rest[0])); if (q.roots.length === 0 && !roots.length) lines.push(...q.lines); else { lines.push(...q.lines.filter((l) => !/^No real/.test(l))); roots.push(...q.roots); } }
        else if (R.rest.length > 3) { const rr = durand(R.rest.map(Number)); rr.forEach((v) => { roots.push(v); lines.push('x ≈ ' + fmt(v)); }); }
        if (!lines.length) lines.push('No real solutions');
        return { lines, roots };
      }
      const rr = P.c.length <= 3 ? [] : durand(P.c);
      if (P.c.length === 3) return quadSolve(P.c[2], P.c[1], P.c[0]);
      return { lines: rr.length ? rr.map((v) => 'x ≈ ' + fmt(v)) : ['No real solutions'], roots: rr };
    }
    if (P && P.c.length === 1) return { lines: [Math.abs(P.c[0]) < 1e-9 ? 'All values of x satisfy this' : 'No solution'] };
    const rt = numericRoots((x) => f(ed({ x })), -50, 50);
    return { lines: rt.length ? rt.map((v) => 'x ≈ ' + fmt(+v.toFixed(9))) : ['No solution found for −50 ≤ x ≤ 50'], roots: rt, numeric: true };
  }

  // ---------- statistics ----------
  function parseList(s) {
    const t = String(s).replace(/[;\n]/g, ',').split(/[,\s]+/).filter(Boolean);
    return t.map((q) => { const v = calc(q); return v; });
  }
  function stats(xs, fs) {
    if (!xs.length) throw new Error('No data');
    if (fs && fs.length && fs.length !== xs.length) throw new Error('Data and frequency lists must be the same length');
    const f = fs && fs.length ? fs : xs.map(() => 1);
    if (f.some((q) => q < 0 || !Number.isInteger(q))) throw new Error('Frequencies must be whole numbers ≥ 0');
    const pairs = xs.map((x, i) => [x, f[i]]).sort((a, b) => a[0] - b[0]);
    const n = pairs.reduce((s, p) => s + p[1], 0);
    if (n === 0) throw new Error('No data');
    const sx = pairs.reduce((s, p) => s + p[0] * p[1], 0), sx2 = pairs.reduce((s, p) => s + p[0] * p[0] * p[1], 0);
    const mean = sx / n;
    const at = (k) => { let c = 0; for (const [x, q] of pairs) { c += q; if (c >= k) return x; } }; // k-th (1-based) value
    const med = (lo, hi) => { const m = lo + hi; return (m % 2 === 0) ? at(m / 2) : (at((m - 1) / 2) + at((m + 1) / 2)) / 2; };
    // median of 1..n via positions
    const posMed = (a, b) => { const len = b - a + 1, mid = a + (len - 1) / 2; return Number.isInteger(mid) ? at(mid) : (at(Math.floor(mid)) + at(Math.ceil(mid))) / 2; };
    void med;
    const median = posMed(1, n);
    const half = Math.floor(n / 2);
    const q1 = n > 1 ? posMed(1, half) : median;
    const q3 = n > 1 ? posMed(n - half + 1, n) : median;
    const pop = Math.sqrt(Math.max(0, sx2 / n - mean * mean));
    const samp = n > 1 ? Math.sqrt(Math.max(0, (sx2 - n * mean * mean) / (n - 1))) : NaN;
    const Sxx = sx2 - n * mean * mean;
    return {
      n, sum: sx, sumSq: sx2, mean, median, q1, q3, min: pairs[0][0], max: pairs[pairs.length - 1][0],
      range: pairs[pairs.length - 1][0] - pairs[0][0], iqr: q3 - q1, popSD: pop, sampSD: samp, Sxx,
      popVar: pop * pop, sampVar: samp * samp,
    };
  }

  function termStr(num, den, k, v) {
    v = v || 'x';
    let n = BigInt(num), d = BigInt(den); if (n === 0n) return null;
    const g = gcd(n, d); n /= g; d /= g; if (d < 0n) { n = -n; d = -d; }
    const neg = n < 0n; if (neg) n = -n;
    const xs = k === 0 ? '' : v + (k > 1 ? sup(k) : '');
    let body;
    if (k === 0) body = d === 1n ? String(n) : n + '/' + d;
    else if (d === 1n) body = (n === 1n ? '' : String(n)) + xs;
    else body = (n === 1n ? '' : String(n)) + xs + '/' + d;
    return { neg, body };
  }
  function joinTerms(ts) {
    let out = '';
    ts.filter(Boolean).forEach((t, i) => { out += i === 0 ? (t.neg ? '−' : '') + t.body : (t.neg ? ' − ' : ' + ') + t.body; });
    return out || '0';
  }
  function derivative(src, x0txt, opts) {
    if (!x0txt || !x0txt.trim()) throw new Error('Enter the value of x');
    const f = parse(src), x0 = calc(x0txt, opts), dg = !(opts && opts.deg === false);
    const v = numDiff((t) => f({ x: t, ans: 0, deg: dg }), x0);
    return { value: v, lines: ['d/dx f(x) at x = ' + fmt(x0), '= ' + fmt(v)] };
  }
  function integral(src, loTxt, hiTxt, opts) {
    if (!loTxt || !loTxt.trim() || !hiTxt || !hiTxt.trim()) throw new Error('Enter the lower and upper limits');
    const f = parse(src), a = calc(loTxt, opts), b = calc(hiTxt, opts), dg = !(opts && opts.deg === false);
    const v = numInt((t) => f({ x: t, ans: 0, deg: dg }), a, b);
    return { value: v, lines: ['∫ f(x) dx from ' + fmt(a) + ' to ' + fmt(b), '= ' + fmt(v)] };
  }
  function primeFactors(n) {
    if (!Number.isInteger(n) || n < 2 || n > 1e12) throw new Error('Enter a whole number from 2 to 10^12');
    const out = []; let m = n;
    for (let p = 2; p * p <= m; p += p === 2 ? 1 : 2) { let e = 0; while (m % p === 0) { m /= p; e++; } if (e) out.push([p, e]); }
    if (m > 1) out.push([m, 1]);
    if (out.length === 1 && out[0][1] === 1) return { text: n + ' is a prime number', factors: out };
    return { text: n + ' = ' + out.map(([p, e]) => p + (e > 1 ? sup(e) : '')).join(' × '), factors: out };
  }
  const rat = (v) => { const f = frac(v, 100000); return f ? (f.d === 1 ? String(f.n) : f.n + '/' + f.d) : fmt(v); };
  function quad(aT, bT, cT, opts) {
    const a = calc(aT, opts), b = calc(bT, opts), c = calc(cT, opts);
    if (a === 0) throw new Error('a must not be 0');
    const lines = [];
    lines.push(polyStr([c, b, a]) + ' = 0');
    const D = b * b - 4 * a * c;
    if (D >= 0) {
      const q = quadSolve(a, b, c); let ql = q.lines.slice();
      if (q.roots.length === 2 && /^x = /.test(ql[0]) && /^x = /.test(ql[1]) && !/±/.test(ql[0])) ql = ['x₁ = ' + ql[0].slice(4), 'x₂ = ' + ql[1].slice(4)];
      else if (q.roots.length === 1) ql = ['x₁ = x₂ = ' + ql[0].slice(4).replace(' (repeated)', '')];
      lines.push(...ql);
    } else { const re = -b / (2 * a), im = Math.sqrt(-D) / (2 * Math.abs(a)); lines.push('x₁ = ' + fmt(re) + ' + ' + fmt(im) + 'i', 'x₂ = ' + fmt(re) + ' − ' + fmt(im) + 'i'); }
    if (opts && opts.rootsOnly) return { lines: lines.slice(1) };
    lines.push('Δ = b²−4ac = ' + fmt(D));
    // factorise via scaling to integers
    const fa = frac(a, 1000), fb = frac(b, 1000), fc = frac(c, 1000);
    let fac = null;
    if ((fa || Number.isInteger(a)) && (fb || Number.isInteger(b)) && (fc || Number.isInteger(c))) {
      const dn = [a, b, c].map((q) => { const f = frac(q, 1000); return f ? f.d : 1; });
      const L = dn.reduce((x, y) => x * y / Number(gcd(BigInt(x), BigInt(y))), 1);
      const ic = [c, b, a].map((q) => Math.round(q * L));
      try { fac = factorise(polyStr(ic).replace(/−/g, '-').replace(/[²]/g, '^2')); } catch (e) { fac = null; }
      if (fac && L !== 1) fac.text = '(1/' + L + ') × ' + fac.text.replace(/^\(1\/\d+\) × /, '');
    }
    if (fac && !fac.irreducibleLeft) lines.push('Factorised: ' + fac.text);
    else lines.push('Does not factorise over the integers' + (D < 0 ? ' (no real roots)' : ''));
    const h = -b / (2 * a), k = c - b * b / (4 * a);
    lines.push('Turning point: (' + rat(h) + ', ' + rat(k) + ')');
    const ac = a === 1 ? '' : a === -1 ? '−' : (Number.isInteger(a) ? rat(a) : '(' + rat(a) + ')'), inner = h === 0 ? 'x' : '(x ' + (h < 0 ? '+ ' + rat(-h) : '− ' + rat(h)) + ')';
    lines.push('Completed square: ' + ac + (h === 0 ? 'x²' : inner + '²') + (k === 0 ? '' : k < 0 ? ' − ' + rat(-k) : ' + ' + rat(k)));
    lines.push('y-intercept: ' + fmt(c));
    return { lines };
  }


  // ---------- complex numbers (CMPLX mode) ----------
  const cAdd = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const cSub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const cMul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const cDiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; if (d === 0) throw new Error('Math ERROR'); return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  const cAbs = (a) => Math.hypot(a[0], a[1]);
  const cArgR = (a) => Math.atan2(a[1], a[0]);
  const cExp = (a) => { const m = Math.exp(a[0]); return [m * Math.cos(a[1]), m * Math.sin(a[1])]; };
  const cLn = (a) => { if (a[0] === 0 && a[1] === 0) throw new Error('Math ERROR'); return [Math.log(cAbs(a)), cArgR(a)]; };
  function cPow(a, b) {
    if (b[1] === 0 && Number.isInteger(b[0]) && Math.abs(b[0]) <= 64) {
      let n = Math.abs(b[0]), r = [1, 0], base = a;
      while (n) { if (n & 1) r = cMul(r, base); base = cMul(base, base); n >>= 1; }
      return b[0] < 0 ? cDiv([1, 0], r) : r;
    }
    if (a[0] === 0 && a[1] === 0) { if (b[0] > 0) return [0, 0]; throw new Error('Math ERROR'); }
    return cExp(cMul(b, cLn(a)));
  }
  function cSqrt(a) { const r = cAbs(a), t = cArgR(a) / 2, s = Math.sqrt(r); return [s * Math.cos(t), s * Math.sin(t)]; }
  function ccalc(src, opts) {
    const t = tokenize(src); let p = 0; const D = !(opts && opts.deg === false);
    const isO = (v) => t[p] && t[p].k === 'o' && t[p].v === v;
    const starts = () => { const x = t[p]; return x && (x.k === 'n' || x.k === 'f' || x.k === 'c' || x.k === 'a' || x.k === 'v' || (x.k === 'o' && x.v === '(')); };
    function expr() { let l = term(); while (isO('+') || isO('-')) { const op = t[p++].v, r = term(); l = op === '+' ? cAdd(l, r) : cSub(l, r); } return l; }
    function term() {
      let l = unary();
      for (;;) {
        if (isO('*') || isO('/')) { const op = t[p++].v, r = unary(); l = op === '*' ? cMul(l, r) : cDiv(l, r); }
        else if (starts()) l = cMul(l, unary());
        else break;
      }
      return l;
    }
    function unary() { if (isO('-')) { p++; const a = unary(); return [-a[0] + 0, -a[1] + 0]; } if (isO('+')) { p++; return unary(); } return power(); }
    function power() { const b = primary(); if (isO('^')) { p++; return cPow(b, unary()); } return b; }
    function primary() {
      const x = t[p]; if (!x) throw new Error('Syntax ERROR');
      if (x.k === 'n') { p++; return [x.v, 0]; }
      if (x.k === 'c') { p++; return [Math.PI, 0]; }
      if (x.k === 'a') { p++; return (opts && opts.ansC) || [0, 0]; }
      if (x.k === 'v') { p++; if (x.v === 'i') return [0, 1]; if (x.v === 'e') return [Math.E, 0]; throw new Error('Variable ERROR'); }
      if (x.k === 'o' && x.v === '(') { p++; const a = expr(); if (isO(')')) p++; return a; }
      if (x.k === 'f') {
        p++; const nm = x.v; let a;
        if (isO('(')) { p++; a = expr(); if (isO(')')) p++; } else a = power();
        switch (nm) {
          case 'abs': return [cAbs(a), 0];
          case 'arg': return [D ? cArgR(a) * 180 / Math.PI : cArgR(a), 0];
          case 'conj': return [a[0], -a[1]];
          case 're': return [a[0], 0]; case 'im': return [a[1], 0];
          case 'sqrt': return cSqrt(a); case 'exp': return cExp(a); case 'ln': return cLn(a);
          case 'log': return cDiv(cLn(a), [Math.LN10, 0]);
          default: throw new Error('Not available in CMPLX');
        }
      }
      throw new Error('Syntax ERROR');
    }
    const r = expr(); if (p < t.length) throw new Error('Syntax ERROR');
    const cl = (v) => (Math.abs(v) < 1e-12 * Math.max(1, Math.abs(r[0]), Math.abs(r[1])) ? 0 : v);
    return [cl(r[0]), cl(r[1])];
  }
  function cFmt(z, f) {
    f = f || fmt; const a = z[0], b = z[1];
    const bs = Math.abs(b) === 1 ? '' : f(Math.abs(b));
    if (b === 0) return f(a);
    if (a === 0) return (b < 0 ? '−' : '') + bs + 'i';
    return f(a) + (b < 0 ? ' − ' : ' + ') + bs + 'i';
  }
  function cPolar(z, deg, f) {
    f = f || fmt; const r = cAbs(z); let th = cArgR(z); if (deg !== false) th = th * 180 / Math.PI;
    if (Math.abs(th) < 1e-10) th = 0;
    return f(r) + '∠' + f(th) + (deg !== false ? '°' : '');
  }

  root.APCalc = { ccalc, cFmt, cPolar, primeFactors, derivative, integral, quad, numDiff, numInt, calc, parse, fmt, frac, fracStr, polyOf, factorise, expand, solve, stats, parseList, polyStr };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.APCalc;
})(typeof window !== 'undefined' ? window : globalThis);
/* A+ Scientific UI: floating calculator, scientific-calculator layout with a MODE menu (vanilla JS) */
(function () {
  if (typeof document === 'undefined') return;
  const C = window.APCalc;
  const css = `
#apc-fab{position:fixed;right:16px;bottom:16px;z-index:99990;width:58px;height:58px;border-radius:50%;border:0;cursor:pointer;
 background:linear-gradient(145deg,#33363c,#151618);color:#fff;font:800 15px/1 system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.45);
 display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;transition:transform .15s}
#apc-fab:hover{transform:scale(1.07)} #apc-fab small{font-size:9px;font-weight:600;opacity:.8;letter-spacing:.5px;color:#f4c430}
#apc{position:fixed;right:16px;bottom:84px;max-height:calc(100vh - 100px);overflow-y:auto;overscroll-behavior:contain;z-index:99991;width:min(94vw,348px);
 background:linear-gradient(165deg,#34373d 0%,#1f2125 50%,#141517 100%);border-radius:26px 26px 40px 40px;border:1px solid #4b515c;
 box-shadow:0 14px 40px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.12);font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#fff;display:none;user-select:none;-webkit-user-select:none;touch-action:manipulation}
#apc.open{display:block;animation:apcin .18s ease-out} @keyframes apcin{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
#apc .hd{display:flex;align-items:center;justify-content:space-between;padding:12px 14px 6px;cursor:move;touch-action:none}
#apc .brand{display:flex;flex-direction:column;line-height:1.15}
#apc .brand b{font-size:17px;letter-spacing:1px;color:#e9ebef;font-weight:800} #apc .brand b span{color:#f4c430}
#apc .brand em{font-style:italic;font-size:10px;color:#aeb3bd;font-weight:600;letter-spacing:.3px}
#apc .solar{width:96px;height:34px;border-radius:5px;background:repeating-linear-gradient(90deg,#2b2320 0 23px,#0c0a09 23px 24px);border:2px solid #0c0a09;box-shadow:inset 0 0 8px rgba(255,170,90,.2)}
#apc .xbtn{position:absolute;top:6px;right:6px;z-index:2;background:rgba(255,255,255,.14);border:0;color:#fff;width:22px;height:22px;border-radius:7px;cursor:pointer;font-size:12px;line-height:1;padding:0}
#apc .scr{margin:6px 14px 8px;background:linear-gradient(180deg,#7ea79e,#6d978d);color:#10241f;border-radius:6px;padding:6px 9px;min-height:120px;border:5px solid #0e0f11;box-shadow:inset 0 2px 8px rgba(0,0,0,.4);font-family:ui-monospace,Menlo,Consolas,monospace;user-select:text;-webkit-user-select:text;position:relative}
#apc .chips{display:flex;gap:5px;font-size:9px;font-weight:800;margin-bottom:3px;align-items:center} #apc .chips span{background:#10241f;color:#cfe5de;border-radius:3px;padding:1px 5px;cursor:pointer} #apc .chips .md{margin-left:auto;background:none;color:#10241f;cursor:default;letter-spacing:.5px}
#apc .ed{width:100%;box-sizing:border-box;min-height:34px;font:600 19px ui-monospace,Menlo,Consolas,monospace;color:#10241f;outline:0;padding:2px 0;white-space:nowrap;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;cursor:text;line-height:1.5}
#apc .ed::-webkit-scrollbar{display:none} #apc .ed .ph{color:rgba(16,36,31,.4);font-size:14px}
#apc .cur{display:inline-block;width:2px;height:1.15em;background:#10241f;vertical-align:text-bottom;margin:0 -1px;animation:apcblink 1s steps(1) infinite} @keyframes apcblink{50%{opacity:0}}
#apc .fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;margin:0 3px;line-height:1.15}
#apc .fr .n{border-bottom:2px solid currentColor;padding:0 4px 1px;min-width:10px} #apc .fr .d{padding:1px 4px 0;min-width:10px}
#apc .sp{font-size:.66em;vertical-align:.55em;line-height:0} #apc .rad{border-top:2px solid currentColor;padding:0 2px;margin-left:1px}
#apc .bx{display:inline-block;width:.6em;height:.9em;border:1.5px dashed rgba(16,36,31,.55);vertical-align:middle;margin:0 1px}
#apc .out .fr .n,#apc .out .fr .d{font-size:.8em}
#apc label.lb{font-size:10px;font-weight:700;opacity:.75;display:block;margin-top:1px}
#apc .out{font-size:13px;line-height:1.45;text-align:right;word-break:break-word;white-space:pre-wrap;max-height:104px;overflow-y:auto} #apc .out.big{font-size:24px;font-weight:700}
#apc .pgi{position:absolute;right:6px;top:34px;display:flex;flex-direction:column;gap:2px;font-size:11px;line-height:1;font-weight:800;opacity:.85}
#apc .out.err{color:#8a1111;font-weight:800} #apc .out.left{text-align:left} #apc .out .mi{cursor:pointer;padding:2px 0} #apc .out .mi:hover{background:rgba(16,36,31,.14)}
#apc .keys{padding:4px 14px 16px;display:grid;gap:9px}
#apc .row{display:grid;gap:7px} #apc .r5{grid-template-columns:repeat(5,1fr)} #apc .r6{grid-template-columns:repeat(6,1fr)} #apc .top{grid-template-columns:1fr 1fr 1.5fr 1fr 1fr;align-items:center}
#apc .k{position:relative;border:0;border-radius:6px 6px 10px 10px;padding:13px 0 0;height:42px;font:700 13px system-ui;cursor:pointer;background:#2a2c31;color:#fff;box-shadow:0 3px 0 #0a0a0b,inset 0 1px 0 rgba(255,255,255,.14);transition:transform .06s}
#apc .k:active{transform:translateY(2px);box-shadow:0 1px 0 #0a0a0b}
#apc .k i{position:absolute;top:2px;left:0;right:0;font:700 9px system-ui;font-style:normal;color:#f4c430;text-align:center;pointer-events:none;white-space:nowrap}
#apc .keys.shifted .k i{background:#f4c430;color:#17181a;border-radius:3px;margin:1px 3px 0}
#apc .k.num{background:#8d9097;color:#fff;font-size:20px;font-weight:600;box-shadow:0 3px 0 #4d4f54,inset 0 1px 0 rgba(255,255,255,.35)}
#apc .k.del{background:#8fd14f;color:#10200a;box-shadow:0 3px 0 #4b7a25}
#apc .k.sh{background:#d5d8de;color:#17181a;padding-top:0;font-size:11px;box-shadow:0 3px 0 #7d8088} #apc .k.sh.on{background:#f4c430;outline:2px solid #fff}
#apc .k.ctl{background:#d5d8de;color:#17181a;padding-top:0;height:32px;font-size:11px;box-shadow:0 3px 0 #7d8088;border-radius:16px}
#apc .k.eq{background:#8d9097;color:#fff;font-size:20px;font-weight:600;box-shadow:0 3px 0 #4d4f54}
#apc .k.sm{font-size:12px}
#apc .dp{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);width:74px;height:74px;margin:0 auto;border-radius:50%;background:radial-gradient(circle,#0c0c0d 0 30%,#3a3d44 31% 100%);box-shadow:0 2px 0 #000}
#apc .dp button{border:0;background:transparent;color:#e6e8ec;font-size:13px;cursor:pointer;padding:0} #apc .dp button:active{color:#f4c430}
#apc .foot{font-size:9px;text-align:center;opacity:.45;padding:0 0 10px;letter-spacing:.5px}
@media(max-width:480px){#apc{right:3vw;bottom:80px}}
`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ----- state -----
  let cur = 'comp';           // comp | factor | solve | stat | eqn
  let sub = '';               // eqn: simul | quad | cubic
  let scr = 'input';          // input | menu | result
  let ansC = [0, 0], deg = true, fracMode = true, shift = false, ans = 0, last = null, lastExpr = '';
  let menu = null, wiz = null;

  const root = document.createElement('div'); root.id = 'apc';
  const fab = document.createElement('button'); fab.id = 'apc-fab'; fab.innerHTML = 'A+<small>CALC</small>'; fab.title = 'Calculator';
  fab.setAttribute('aria-label', 'Open calculator');

  const K = (l, v, c, sl, sv) => ({ l, v, c: c || '', sl, sv });
  const TOP = [K('SHIFT', '@sh', 'sh'), K('SETUP', '@setup', 'ctl'), 'DP', K('MODE', '@mode', 'ctl'), K('EXIT', '@exit', 'ctl')];
  const R6 = [
    [K('x⁻¹', '^(-1)', '', 'x!', '!'), K('∫', 'integ(', '', 'd/dx', 'diff('), K('logₐ□', 'logb(', 'sm', 'nCr', 'ncr('), K('π', 'π', '', 'e', 'e'), K('%', '%', '', 'nPr', 'npr('), K('S⇔D', '@sd', 'sm', 'FACT', '@fact')],
    [K('a/b', '@frac', '', 'x', 'x'), K('√', '@sqrt', '', '∛', 'cbrt('), K('x²', '^2', '', 'x³', '^3'), K('xⁿ', '@pow', '', 'y', 'y'), K('log', 'log(', '', '10ˣ', '10^('), K('ln', 'ln(', '', 'eˣ', 'exp(')],
    [K('(−)', '-', '', '=', '='), K('(', '(', '', ',', ','), K(')', ')', '', '|x|', 'abs('), K('sin', 'sin(', '', 'sin⁻¹', 'asin('), K('cos', 'cos(', '', 'cos⁻¹', 'acos('), K('tan', 'tan(', '', 'tan⁻¹', 'atan(')],
  ];
  const R5 = [
    [K('7', '7', 'num'), K('8', '8', 'num'), K('9', '9', 'num'), K('DEL', '@del', 'del'), K('AC', '@ac', 'del')],
    [K('4', '4', 'num'), K('5', '5', 'num'), K('6', '6', 'num'), K('×', '×', 'num', 'Re', 're('), K('÷', '÷', 'num', 'Im', 'im(')],
    [K('1', '1', 'num'), K('2', '2', 'num'), K('3', '3', 'num'), K('+', '+', 'num'), K('−', '−', 'num')],
    [K('0', '0', 'num', 'Conj', 'conj('), K('.', '.', 'num'), K('×10ˣ', '×10^(', 'num sm', 'Arg', 'arg('), K('Ans', 'Ans', 'num sm', 'i', 'i'), K('=', '@exe', 'eq')],
  ];

  root.innerHTML = `
  <button class="xbtn" aria-label="Close">✕</button>
  <div class="hd"><div class="brand"><b>A<span>+</span> SCIENTIFIC</b><em>NATURAL DISPLAY</em></div><div class="solar"></div></div>
  <div class="scr">
    <div class="chips"><span data-c="deg">DEG</span><span data-c="frac">DEC</span><span data-c="sh" style="display:none">S</span><span class="md" id="apc-md">COMP</span></div>
    <label class="lb" id="apc-l1"></label><div class="ed" id="apc-in" tabindex="0" role="textbox" aria-label="Expression"></div>
    <div class="out" id="apc-hist" style="font-size:11px"></div><div class="pgi" id="apc-pg"></div><div class="out big" id="apc-out"></div>
  </div>
  <div class="keys" id="apc-keys"></div>
  <div class="foot">Type with your keyboard or tap the keys · Practice tool. Use your approved calculator in exams.</div>`;
  document.body.appendChild(root); document.body.appendChild(fab);
  const $ = (id) => root.querySelector('#' + id);
  const edEl = $('apc-in'), out = $('apc-out'), histEl = $('apc-hist'), keysEl = $('apc-keys'), lb = $('apc-l1');
  const touch = 'ontouchstart' in window;

  // ----- natural display: the input is a text buffer drawn with stacked fractions, powers and roots -----
  let buf = '', pos = 0, phTxt = '';
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const disp = (c) => (c === '*' ? '×' : c === '/' ? '÷' : c === '-' ? '−' : c);
  function matchClose(str, i) { let d = 0; for (let j = i; j < str.length; j++) { if (str[j] === '(') d++; else if (str[j] === ')') { d--; if (d === 0) return j; } } return -1; }
  function richInput(str, caretPos) {
    let cp = caretPos, used = false;
    const CUR = '<span class="cur"></span>';
    function range(a, b, incl) {
      let h = '', i = a;
      const mark = (k) => { if (!used && cp === k) { used = true; return CUR; } return ''; };
      while (i < b) {
        h += mark(i);
        const c = str[i];
        if (c === '(') {
          const j = matchClose(str, i);
          if (j > 0 && j < b && str[j + 1] === '/' && str[j + 2] === '(') {
            const k = matchClose(str, j + 2);
            if (k > 0 && k < b) {
              if (cp === j + 1 || cp === j + 2) cp = j + 3;
              const N = range(i + 1, j, true) || '<span class="bx"></span>', D = range(j + 3, k, true) || '<span class="bx"></span>';
              h += '<span class="fr"><span class="n">' + N + '</span><span class="d">' + D + '</span></span>';
              i = k + 1; continue;
            }
          }
        }
        if (c === '^') {
          if (str[i + 1] === '(') {
            const j = matchClose(str, i + 1);
            if (j > 0 && j < b) {
              if (cp === i + 1) cp = i + 2;
              h += '<span class="sp">' + (range(i + 2, j, true) || '<span class="bx"></span>') + '</span>'; i = j + 1; continue;
            }
          }
          const m = /^-?\d+(\.\d+)?/.exec(str.slice(i + 1, b));
          if (m) { h += '<span class="sp">' + esc(m[0].replace('-', '−')) + '</span>'; i += 1 + m[0].length; continue; }
        }
        if (c === '√' && str[i + 1] === '(') {
          const j = matchClose(str, i + 1);
          if (j > 0 && j < b) { if (cp === i + 1) cp = i + 2; h += '√<span class="rad">' + (range(i + 2, j, true) || '<span class="bx"></span>') + '</span>'; i = j + 1; continue; }
        }
        h += esc(disp(c)); i++;
      }
      if (incl) h += mark(b);
      return h;
    }
    return range(0, str.length, true);
  }
  function render() {
    const body = richInput(buf, pos);
    edEl.innerHTML = buf === '' ? '<span class="cur"></span><span class="ph">' + esc(phTxt) + '</span>' : body;
    const cu = edEl.querySelector('.cur');
    if (cu) { const l = cu.offsetLeft; if (l > edEl.scrollLeft + edEl.clientWidth - 24) edEl.scrollLeft = l - edEl.clientWidth + 24; else if (l < edEl.scrollLeft) edEl.scrollLeft = Math.max(0, l - 24); }
  }
  const inp = {
    get value() { return buf; }, set value(v) { buf = String(v); pos = buf.length; render(); },
    get selectionStart() { return pos; }, get selectionEnd() { return pos; },
    setSelectionRange(a) { pos = Math.max(0, Math.min(buf.length, a)); render(); },
    focus() { edEl.focus(); }, style: edEl.style, set placeholder(v) { phTxt = v; render(); }, setAttribute() {},
  };
  // rich text for results: a/b becomes a stacked fraction
  const richText = (t) => esc(String(t)).replace(/(-?)(\d+)\/(\d+)/g, (m, sg, n, d) => (sg ? '−' : '') + '<span class="fr"><span class="n">' + n + '</span><span class="d">' + d + '</span></span>');

  // ----- keypad -----
  function keyBtn(k) {
    const b = document.createElement('button');
    const useSh = shift && k.sl;
    b.className = 'k ' + k.c + (k.v === '@sh' && shift ? ' on' : '');
    b.innerHTML = (k.sl ? '<i>' + k.sl + '</i>' : '') + '<span>' + k.l + '</span>';
    b.dataset.v = useSh ? k.sv : k.v;
    if (!k.sl) b.style.paddingTop = '0';
    return b;
  }
  function drawPad() {
    keysEl.innerHTML = ''; keysEl.classList.toggle('shifted', shift);
    const addRow = (cls, arr) => {
      const r = document.createElement('div'); r.className = 'row ' + cls;
      arr.forEach((k) => {
        if (k === 'DP') {
          const d = document.createElement('div'); d.className = 'dp';
          d.innerHTML = '<span></span><button data-v="@up" aria-label="Up">▲</button><span></span><button data-v="@left" aria-label="Left">◀</button><span></span><button data-v="@right" aria-label="Right">▶</button><span></span><button data-v="@down" aria-label="Down">▼</button><span></span>';
          r.appendChild(d);
        } else r.appendChild(keyBtn(k));
      });
      keysEl.appendChild(r);
    };
    addRow('top', TOP); R6.forEach((r) => addRow('r6', r)); R5.forEach((r) => addRow('r5', r));
  }
  keysEl.addEventListener('mousedown', (e) => e.preventDefault());
  keysEl.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const v = b.dataset.v; if (v === undefined) return;
    press(v);
  });

  function press(v) {
    if (v === '@sh') { shift = !shift; drawPad(); chips(); return; }
    if (shift) { shift = false; drawPad(); chips(); }
    if (scr === 'menu' && /^[0-9]$/.test(v)) { pickMenu(+v); return; }
    switch (v) {
      case '@del': del(); return;
      case '@ac': if (scr === 'menu') { exit(); return; } inp.value = ''; if (scr === 'input' && !wiz) { out.textContent = ''; out.className = 'out big'; histEl.textContent = ''; } return;
      case '@exe': exe(); return;
      case '@sd': fracMode = !fracMode; chips(); showLast(); return;
      case '@fact': fact(); return;
      case '@frac': tmpl('frac'); return;
      case '@pow': tmpl('pow'); return;
      case '@sqrt': tmpl('sqrt'); return;
      case '@left': moveCaret(-1); return;
      case '@right': moveCaret(1); return;
      case '@up': up(); return;
      case '@down': down(); return;
      case '@mode': openMode(); return;
      case '@setup': openSetup(); return;
      case '@exit': exit(); return;
      default: insert(v);
    }
  }

  function insert(t) {
    if (scr !== 'input') { if (scr === 'result' && wiz) return; exit(); }
    if (fresh) { fresh = false; if (wiz) inp.value = ''; }
    const el = inp, s = el.selectionStart == null ? el.value.length : el.selectionStart, e2 = el.selectionEnd == null ? s : el.selectionEnd;
    if (cur === 'comp' && !wiz && last !== null && el.value === '' && /^[+\-×÷^*\/]/.test(t)) t = 'Ans' + t;
    el.value = el.value.slice(0, s) + t + el.value.slice(e2);
    const pos = s + t.length; try { el.setSelectionRange(pos, pos); } catch (x) { /* ignore */ }
    if (!touch) el.focus();
  }
  function del() {
    if (scr !== 'input') return;
    if (fresh) { fresh = false; if (wiz) { inp.value = ''; return; } }
    const el = inp; let s = el.selectionStart == null ? el.value.length : el.selectionStart; const e2 = el.selectionEnd == null ? s : el.selectionEnd;
    const v0 = el.value;
    if (s === e2 && s >= 3 && v0.slice(s - 3, s) === ')/(') { el.setSelectionRange(s - 3); return; }
    if (s === e2 && s >= 1 && v0[s - 1] === '(' && v0[s] === ')') {
      if (v0.slice(s - 1, s + 5) === '()/()') { el.value = v0.slice(0, s - 1) + v0.slice(s + 5); el.setSelectionRange(s - 1); return; }
      const st = v0[s - 2] === '^' ? s - 2 : s - 1; el.value = v0.slice(0, st) + v0.slice(s + 1); el.setSelectionRange(st); return;
    }
    if (s === e2) { if (s === 0) return; const m = el.value.slice(0, s).match(/(sin|cos|tan|asin|acos|atan|log|ln|exp|sqrt|√|cbrt|abs|logb|root|ncr|npr|integ|diff|conj|arg|re|im|Ans)\($|Ans$/); const n = m ? m[0].length : 1; el.value = el.value.slice(0, s - n) + el.value.slice(s); s -= n; }
    else { el.value = el.value.slice(0, s) + el.value.slice(e2); }
    try { el.setSelectionRange(s, s); } catch (x) { /* ignore */ }
  }
  function tmpl(kind) {
    if (scr !== 'input') return;
    if (fresh) { fresh = false; if (wiz) inp.value = ''; }
    const el = inp; let v = el.value;
    let s = el.selectionStart == null ? v.length : el.selectionStart, e = el.selectionEnd == null ? s : el.selectionEnd;
    if (kind === 'pow' || kind === 'sqrt') { s = e; if (kind === 'pow' && cur === 'comp' && !wiz && last !== null && v === '') { v = 'Ans'; s = e = 3; } }
    const sel = kind === 'frac' ? v.slice(s, e) : '';
    const ins = kind === 'frac' ? '(' + sel + ')/()' : kind === 'pow' ? '^()' : '√()';
    el.value = v.slice(0, s) + ins + v.slice(e);
    const pos = kind === 'frac' ? (sel ? s + sel.length + 4 : s + 1) : s + 2;
    try { el.setSelectionRange(pos, pos); } catch (x) { /* ignore */ }
    if (!touch) el.focus();
  }
  function moveCaret(d) {
    if (scr !== 'input') return;
    fresh = false;
    let p = inp.selectionStart == null ? inp.value.length : inp.selectionStart; const v = inp.value;
    if (d > 0) { if (v.startsWith(')/(', p)) p += 3; else if (v[p] === ')') p += 1; else p = Math.min(v.length, p + 1); }
    else if (v.slice(Math.max(0, p - 3), p) === ')/(') p -= 3;
    else if (v[p - 1] === '(' && v[p - 2] === '^') p -= 2;
    else p = Math.max(0, p - 1);
    try { inp.setSelectionRange(p, p); } catch (x) { /* ignore */ }
    if (!touch) inp.focus();
  }
  const hist = []; let hIdx = 0; let fresh = false; // fresh: a prefilled entry is replaced by the next key
  function up() {
    if (scr === 'input' && wiz) { if (wiz.idx > 0) { wiz.vals[wiz.fields[wiz.idx].k] = inp.value; wiz.idx--; showWiz(); } return; }
    if (scr === 'result') { if (wiz && wiz.pages) { if (wiz.pg > 0) { wiz.pg--; showPage(); } } else out.scrollTop -= 40; return; }
    if (cur === 'comp' && scr === 'input') {
      if (hIdx > 0) { hIdx--; inp.value = hist[hIdx]; } else if (out.scrollHeight > out.clientHeight) out.scrollTop -= 40;
    }
  }
  function down() {
    if (scr === 'input' && wiz) { if (wiz.idx < wiz.fields.length - 1) { wiz.vals[wiz.fields[wiz.idx].k] = inp.value; wiz.idx++; showWiz(); } return; }
    if (scr === 'result') { if (wiz && wiz.pages) { if (wiz.pg < wiz.pages.length - 1) { wiz.pg++; showPage(); } } else out.scrollTop += 40; return; }
    if (cur === 'comp' && scr === 'input') {
      if (hIdx < hist.length - 1) { hIdx++; inp.value = hist[hIdx]; } else if (hIdx === hist.length - 1) { hIdx = hist.length; inp.value = ''; } else if (out.scrollHeight > out.clientHeight) out.scrollTop += 40;
    }
  }

  // ----- display helpers -----
  function chips() {
    root.querySelector('[data-c=deg]').textContent = deg ? 'DEG' : 'RAD';
    root.querySelector('[data-c=frac]').textContent = fracMode ? 'FRAC' : 'DEC';
    root.querySelector('[data-c=sh]').style.display = shift ? '' : 'none';
    $('apc-md').textContent = cur === 'comp' ? 'COMP' : cur === 'eqn' ? 'EQN' : cur === 'factor' ? 'FACTOR' : cur === 'solve' ? 'SOLVE' : cur === 'cmplx' ? 'CMPLX' : 'STAT';
  }
  root.querySelector('.chips').addEventListener('click', (e) => {
    const c = e.target.dataset.c; if (!c) return;
    if (c === 'deg') deg = !deg; if (c === 'frac') { fracMode = !fracMode; showLast(); } chips();
  });
  function setErr(m) { if (scr === 'menu') scr = 'input'; out.className = 'out big err'; out.style.fontSize = ''; out.textContent = m; }
  function showOut(text, big, left, fs) { out.className = 'out' + (big ? ' big' : '') + (left ? ' left' : ''); out.style.fontSize = fs || ''; out.innerHTML = richText(text); }
  const valStr = (v) => { if (fracMode) { const f = C.frac(v); if (f) return C.fracStr(f); } return C.fmt(v); };
  function showLast() { if (cur === 'comp' && last !== null && scr === 'input' && !wiz) showOut(valStr(last), true); }

  function setInputVisible(v) { inp.style.display = v ? '' : 'none'; }
  function resetScreen() { $('apc-pg').innerHTML = ''; out.style.maxHeight = ''; out.textContent = ''; out.className = 'out big'; out.style.fontSize = ''; histEl.textContent = ''; }

  // ----- menus (MODE / SETUP) -----
  function showMenu(title, items) {
    menu = { title, items }; scr = 'menu'; setInputVisible(false); lb.textContent = title; lb.style.display = '';
    histEl.textContent = '';
    out.className = 'out left'; out.style.fontSize = '13px'; out.innerHTML = '';
    items.forEach((it, i) => { const d = document.createElement('div'); d.className = 'mi'; d.dataset.i = i + 1; d.textContent = (i + 1) + ':' + it.label; out.appendChild(d); });
  }
  out.addEventListener('click', (e) => { const m = e.target.closest('.mi'); if (m && scr === 'menu') pickMenu(+m.dataset.i); });
  function pickMenu(n) { const it = menu && menu.items[n - 1]; if (it) it.fn(); }
  function openMode() {
    showMenu('MODE', [
      { label: 'COMP  (calculate)', fn: () => startMode('comp') },
      { label: 'EQN  (solve equations)', fn: () => showMenu('EQN', [
        { label: 'Simultaneous  a₁x+b₁y=c₁', fn: () => startMode('eqn', 'simul') },
        { label: 'Quadratic  ax²+bx+c=0', fn: () => startMode('eqn', 'quad') },
        { label: 'Cubic  ax³+bx²+cx+d=0', fn: () => startMode('eqn', 'cubic') },
      ]) },
      { label: 'CMPLX  (complex numbers)', fn: () => startMode('cmplx') },
      { label: 'STAT  (mean, median, SD)', fn: () => startMode('stat') },
      { label: 'PRIME  (prime factors of a number)', fn: () => startMode('factor') },
      { label: 'SOLVE  (any equation in x)', fn: () => startMode('solve') },
    ]);
  }
  function openSetup() {
    showMenu('SETUP', [
      { label: 'Angle: Degree', fn: () => { deg = true; chips(); exit(true); } },
      { label: 'Angle: Radian', fn: () => { deg = false; chips(); exit(true); } },
      { label: 'Answers: fractions a/b', fn: () => { fracMode = true; chips(); exit(true); } },
      { label: 'Answers: decimals', fn: () => { fracMode = false; chips(); exit(true); } },
    ]);
  }
  function exit(keep) {
    menu = null; scr = 'input';
    if (wiz) { setInputVisible(true); showWiz(); return; }
    startMode(cur, sub, keep);
  }

  // ----- modes -----
  const WIZ = {
    quad: { title: 'ax² + bx + c = 0', f: [['a', 'a'], ['b', 'b'], ['c', 'c']] },
    cubic: { title: 'ax³ + bx² + cx + d = 0', f: [['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd']] },
    simul: { title: 'a₁x + b₁y = c₁ ; a₂x + b₂y = c₂', f: [['a1', 'a₁'], ['b1', 'b₁'], ['c1', 'c₁'], ['a2', 'a₂'], ['b2', 'b₂'], ['c2', 'c₂']] },
    stat: { title: '1-VAR statistics', f: [['d', 'Data x  (commas)'], ['f', 'Freq (optional)']] },
  };
  const PH = {
    comp: ['', 'e.g. sin(30)+2^3'],
    factor: ['Whole number → prime factors', 'e.g. 360'],
    cmplx: ['Complex numbers: SHIFT Ans = i', 'e.g. (3+4i)(1-2i)'],
    solve: ['Equation in x (SHIFT a/b = x,  SHIFT ( = "=")', 'e.g. x^2-5x+6=0'],
  };
  function startMode(m, s2, keep) {
    cur = m; sub = s2 || ''; scr = 'input'; menu = null; chips();
    if (!keep) resetScreen();
    histEl.textContent = '';
    if (m === 'eqn' || m === 'stat') {
      const key = m === 'stat' ? 'stat' : sub;
      wiz = { key, fields: WIZ[key].f.map((q) => ({ k: q[0], label: q[1] })), idx: 0, vals: {}, title: WIZ[key].title };
      showWiz();
    } else {
      wiz = null; setInputVisible(true);
      lb.textContent = PH[m][0]; lb.style.display = PH[m][0] ? '' : 'none'; inp.placeholder = PH[m][1];
      inp.value = ''; if (m === 'comp') showLast();
      if (!touch) inp.focus();
    }
  }
  function showWiz() {
    scr = 'input'; setInputVisible(true); $('apc-pg').innerHTML = ''; out.style.maxHeight = '';
    const f = wiz.fields[wiz.idx];
    lb.style.display = ''; lb.textContent = wiz.title + '  ·  ' + f.label + ' ?  (' + (wiz.idx + 1) + '/' + wiz.fields.length + ')';
    inp.placeholder = wiz.key === 'stat' ? (f.k === 'd' ? 'e.g. 2,4,4,4,5,5,7,9' : 'e.g. 1,2,3 (EXE to skip)') : '0';
    inp.value = wiz.vals[f.k] || ''; fresh = !!inp.value;
    out.className = 'out'; out.textContent = ''; out.style.fontSize = ''; histEl.textContent = '';
    if (!touch) inp.focus();
  }
  function wizRun() {
    const v = wiz.vals, o = { ans, deg };
    let lines;
    if (wiz.key === 'quad') lines = C.quad(v.a || '0', v.b || '0', v.c || '0', Object.assign({ rootsOnly: true }, o)).lines;
    else if (wiz.key === 'cubic') {
      const eq = '(' + (v.a || '0') + ')*x^3+(' + (v.b || '0') + ')*x^2+(' + (v.c || '0') + ')*x+(' + (v.d || '0') + ')=0';
      if (C.calc(v.a || '0', o) === 0) throw new Error('a must not be 0');
      lines = C.solve(eq, o).lines.map((l, i) => (/^x = /.test(l) ? 'x' + '₁₂₃₄'[i] + ' = ' + l.slice(4) : l));
    } else if (wiz.key === 'simul') {
      const g = (k) => '(' + (v[k] || '0') + ')';
      lines = C.solve(g('a1') + '*x+' + g('b1') + '*y=' + g('c1') + ';' + g('a2') + '*x+' + g('b2') + '*y=' + g('c2'), o).lines;
    } else {
      const xs = C.parseList(v.d || ''), fs = (v.f || '').trim() ? C.parseList(v.f) : null;
      const r = C.stats(xs, fs), f = (q) => C.fmt(+q.toPrecision(10));
      const rows = [['n', r.n], ['x̄', r.mean], ['Σx', r.sum], ['Σx²', r.sumSq], ['σx', r.popSD], ['sx', isNaN(r.sampSD) ? 'n/a' : r.sampSD],
        ['minX', r.min], ['Q1', r.q1], ['Med', r.median], ['Q3', r.q3], ['maxX', r.max]];
      lines = rows.map((q) => q[0] + ' = ' + (typeof q[1] === 'number' ? f(q[1]) : q[1]));
    }
    scr = 'result'; setInputVisible(false);
    if (wiz.key === 'stat') { wiz.pages = null; lb.textContent = wiz.title + '   (= edit, ▲▼ scroll)'; showOut(lines.join('\n'), false, true, '14px'); out.scrollTop = 0; }
    else { wiz.pages = lines.filter((l) => !/^(Δ|Factorised|Does not)/.test(l)); wiz.pg = 0; showPage(); }
  }

  function showPage() {
    const n = wiz.pages.length, i = wiz.pg;
    lb.textContent = wiz.title + '   (= edit)';
    showOut(wiz.pages[i], true, true, '22px'); out.style.maxHeight = 'none';
    $('apc-pg').innerHTML = (i > 0 ? '<span>▲</span>' : '') + (i < n - 1 ? '<span>▼</span>' : '');
  }
  function fact() {
    try {
      const s = inp.value.trim(); const n = s ? C.calc(s, { ans, deg }) : ans;
      const r = C.primeFactors(n);
      if (scr !== 'input') { scr = 'input'; setInputVisible(true); }
      histEl.textContent = ''; showOut(r.text, false, true, '20px');
    } catch (e) { setErr(e.message || 'Error'); }
  }

  function exe() {
    try {
      if (scr === 'menu') { pickMenu(1); return; }
      if (wiz) {
        if (scr === 'result') { wiz.idx = 0; showWiz(); return; }
        const f = wiz.fields[wiz.idx]; const txt = inp.value.trim();
        if (wiz.key === 'stat') { if (f.k === 'd' && !txt) throw new Error('Enter some data'); wiz.vals[f.k] = txt; }
        else { wiz.vals[f.k] = txt === '' ? '0' : txt; if (txt) C.calc(txt, { ans, deg }); }
        if (wiz.idx < wiz.fields.length - 1) { wiz.idx++; showWiz(); } else wizRun();
        return;
      }
      const s = inp.value.trim();
      if (!s) return;
      histEl.textContent = '';
      if (cur === 'comp') {
        const v = C.calc(s, { ans, deg }); ans = v; last = v; lastExpr = s; hist.push(s); hIdx = hist.length;
        histEl.innerHTML = richInput(s, -1); showOut(valStr(v), true);
        inp.value = '';
      } else if (cur === 'cmplx') {
        const z = C.ccalc(s, { deg, ansC }); ansC = z; hIdx = hist.length; hist.push(s); hIdx = hist.length;
        histEl.innerHTML = richInput(s, -1); showOut(C.cFmt(z, valStr) + '\n' + C.cPolar(z, deg), false, false, '20px'); inp.value = '';
      } else if (cur === 'solve') {
        showOut(C.solve(s, { ans, deg }).lines.join('\n'), false, true, '15px');
      } else if (cur === 'factor') {
        fact();
      }
    } catch (e) { setErr(e.message || 'Error'); }
  }

  // keyboard (physical): the display is a div, so keys are handled here
  root.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.target !== edEl) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === 'Enter') { e.preventDefault(); exe(); }
    else if (k === 'Escape') toggle(false);
    else if (k === 'ArrowUp') { e.preventDefault(); up(); }
    else if (k === 'ArrowDown') { e.preventDefault(); down(); }
    else if (k === 'ArrowLeft') { e.preventDefault(); moveCaret(-1); }
    else if (k === 'ArrowRight') { e.preventDefault(); moveCaret(1); }
    else if (k === 'Home') { e.preventDefault(); inp.setSelectionRange(0); }
    else if (k === 'End') { e.preventDefault(); inp.setSelectionRange(buf.length); }
    else if (k === 'Backspace') { e.preventDefault(); del(); }
    else if (k === 'Delete') { e.preventDefault(); buf = buf.slice(0, pos) + buf.slice(pos + 1); render(); }
    else if (k.length === 1) { e.preventDefault(); if (k === '*') insert('×'); else insert(k); }
  });
  edEl.addEventListener('paste', (e) => { e.preventDefault(); const t = (e.clipboardData && e.clipboardData.getData('text')) || ''; if (t) insert(t.replace(/\s+/g, '')); });
  root.querySelector('.scr').addEventListener('click', () => { if (!touch) edEl.focus(); });
  ['keyup', 'keypress'].forEach((ev) => root.addEventListener(ev, (e) => e.stopPropagation()));

  function toggle(v) {
    const open = v === undefined ? !root.classList.contains('open') : v;
    root.classList.toggle('open', open); fab.style.display = open ? 'none' : '';
    if (open && !touch) setTimeout(() => inp.focus(), 30);
  }
  fab.addEventListener('click', () => toggle(true));
  root.querySelector('.xbtn').addEventListener('click', () => toggle(false));

  // drag by header
  (function () {
    const hd = root.querySelector('.hd'); let sx, sy, ox, oy, dr = false;
    hd.addEventListener('pointerdown', (e) => { dr = true; const r = root.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top; hd.setPointerCapture(e.pointerId); });
    hd.addEventListener('pointermove', (e) => {
      if (!dr) return; root.style.right = 'auto'; root.style.bottom = 'auto';
      root.style.left = Math.max(0, Math.min(innerWidth - root.offsetWidth, ox + e.clientX - sx)) + 'px';
      root.style.top = Math.max(0, Math.min(innerHeight - 60, oy + e.clientY - sy)) + 'px';
    });
    hd.addEventListener('pointerup', () => (dr = false));
  })();

  drawPad(); startMode('comp');
  window.APCalcUI = { open: () => toggle(true), close: () => toggle(false), toggle: () => toggle() };
})();
