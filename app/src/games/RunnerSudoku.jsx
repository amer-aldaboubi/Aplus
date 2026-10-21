import { useEffect, useRef, useState } from 'react';
import { Hud, rnd } from './gameKit';

/* ------------------------------------------------------------------ */
/*  Sigma Sprint – canvas endless runner                               */
/* ------------------------------------------------------------------ */

const RUNNER_WIDTH_MAX = 408;
const RUNNER_HEIGHT = 230;
const PLAYER_X = 46;
const PLAYER_SIZE = 30;
const JUMP_VELOCITY = -760;
const GRAVITY = 2300;
const BASE_SPEED = 300;
const OBSTACLE_SYMBOLS = ['÷', '×', 'π', '√', 'Σ', '%', '∞'];

export function Runner({ onEnd }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [started, setStarted] = useState(false);

  // Mutable game state lives outside React so the animation loop can mutate it freely.
  const game = useRef({
    y: 0,        // player vertical offset (0 = on the ground, negative = in the air)
    vy: 0,       // vertical velocity
    obstacles: [],
    dist: 0,     // distance travelled in world units (10 units = 1 m)
    speed: BASE_SPEED,
    nextSpawn: 0,
    running: false,
    done: false,
    t: 0,        // elapsed running time (drives the leg animation)
  }).current;

  const jump = () => {
    if (game.done) return;
    if (!game.running) {
      game.running = true;
      setStarted(true);
    }
    // Only jump when standing on the ground.
    if (game.y >= 0 && game.vy === 0) game.vy = JUMP_VELOCITY;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const W = Math.min(RUNNER_WIDTH_MAX, wrapRef.current.clientWidth);
    const H = RUNNER_HEIGHT;
    const ctx = canvas.getContext('2d');
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const groundY = H - 44;
    let last = performance.now();
    let raf;

    const randomSymbol = () => OBSTACLE_SYMBOLS[Math.floor(Math.random() * OBSTACLE_SYMBOLS.length)];

    // Add one obstacle (sometimes a tall one, sometimes a pair) and schedule the next.
    const spawn = () => {
      const tall = Math.random() < 0.35;
      const w = 24 + Math.floor(Math.random() * 12);
      const h = tall ? 50 : 30 + Math.floor(Math.random() * 14);
      game.obstacles.push({ x: W + 20, w, h, s: randomSymbol() });
      if (game.dist > 900 && Math.random() < 0.25) {
        game.obstacles.push({ x: W + 20 + w + 4, w: 24, h: 30, s: randomSymbol() });
      }
      // Gaps shrink as the distance grows, down to 55% of the base gap.
      game.nextSpawn = (0.75 + Math.random() * 0.9) * Math.max(0.55, 1 - game.dist / 9000);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#FFFFFF');
      sky.addColorStop(1, '#DCE5F5');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Parallax specks
      ctx.fillStyle = 'rgba(20,24,40,0.35)';
      for (let i = 0; i < 18; i++) {
        const sx = (((i * 137 + i * i * 61) % 997) - ((game.dist * 0.15) % W) + W * 2) % W;
        ctx.fillRect(sx, 14 + ((i * 53 + i * i * 7) % 120), 2, 2);
      }

      // Ground line
      ctx.strokeStyle = 'rgba(20,24,40,.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 0.5);
      ctx.lineTo(W, groundY + 0.5);
      ctx.stroke();

      // Number-line ticks every 80 units, labelled in metres
      ctx.fillStyle = 'rgba(20,24,40,.5)';
      ctx.font = '600 10px system-ui,sans-serif';
      ctx.textAlign = 'center';
      const step = 80;
      for (let wx = Math.ceil(game.dist / step) * step; wx < game.dist + W + step; wx += step) {
        const x = wx - game.dist;
        ctx.fillRect(x, groundY, 1.5, 8);
        ctx.fillText(String(Math.round(wx / 10)), x, groundY + 20);
      }

      // Obstacles: rounded-top blocks carrying a maths symbol
      game.obstacles.forEach((o) => {
        ctx.fillStyle = '#2E4470';
        ctx.strokeStyle = '#6FC4E8';
        ctx.lineWidth = 1.5;
        const r = 5;
        const x = o.x;
        const y = groundY - o.h;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + o.w, y, x + o.w, y + o.h, r);
        ctx.lineTo(x + o.w, groundY);
        ctx.lineTo(x, groundY);
        ctx.arcTo(x, y, x + o.w, y, r);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#F4F1EA';
        ctx.font = '700 16px Georgia,serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(o.s, x + o.w / 2, y + Math.min(16, o.h / 2));
        ctx.textBaseline = 'alphabetic';
      });

      // Player: gold "A+" block with a running bob and legs while grounded
      const playerY = groundY - PLAYER_SIZE + game.y;
      const grounded = game.y === 0 && game.running && !game.done;
      const bob = grounded ? Math.sin(game.t * 22) * 1.5 : 0;
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(PLAYER_X, playerY + bob, PLAYER_SIZE, PLAYER_SIZE, 9);
      else ctx.rect(PLAYER_X, playerY + bob, PLAYER_SIZE, PLAYER_SIZE);
      ctx.fill();
      ctx.fillStyle = '#0E1830';
      ctx.font = '800 13px Georgia,serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('A+', PLAYER_X + PLAYER_SIZE / 2, playerY + bob + PLAYER_SIZE / 2 + 1);
      ctx.textBaseline = 'alphabetic';
      if (grounded) {
        ctx.fillStyle = '#7E620E';
        const stride = Math.sin(game.t * 22) > 0;
        ctx.fillRect(PLAYER_X + 5 + (stride ? 0 : 8), groundY - 2, 8, 3);
        ctx.fillRect(PLAYER_X + 17 - (stride ? 0 : 8), groundY - 2, 8, 3);
      }

      // Distance readout
      ctx.fillStyle = '#F3D77A';
      ctx.font = '800 16px system-ui,sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.floor(game.dist / 10) + ' m', W - 12, 24);
    };

    const loop = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (game.running && !game.done) {
        game.t += dt;
        game.speed = BASE_SPEED + game.dist * 0.035;
        game.dist += game.speed * dt;
        game.vy += GRAVITY * dt;
        game.y = Math.min(0, game.y + game.vy * dt);
        if (game.y === 0) game.vy = 0;
        game.nextSpawn -= dt;
        if (game.nextSpawn <= 0) spawn();
        game.obstacles.forEach((o) => { o.x -= game.speed * dt; });
        game.obstacles = game.obstacles.filter((o) => o.x + o.w > -10);

        // Collision check with a forgiving inset hit-box
        const playerY = groundY - PLAYER_SIZE + game.y;
        for (const o of game.obstacles) {
          if (
            PLAYER_X + PLAYER_SIZE - 6 > o.x &&
            PLAYER_X + 6 < o.x + o.w &&
            playerY + PLAYER_SIZE - 4 > groundY - o.h
          ) {
            game.done = true;
            const metres = Math.floor(game.dist / 10);
            setTimeout(
              () => onEnd({ score: metres, line: 'You ran ' + metres + ' m before hitting ' + o.s }),
              700,
            );
            break;
          }
        }
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef}>
      <div
        onPointerDown={(e) => {
          e.preventDefault();
          jump();
        }}
        style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--color-line)',
          touchAction: 'manipulation',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'center',
          background: '#EEF2FA',
          cursor: 'pointer',
        }}
      >
        <canvas ref={canvasRef} aria-label="Runner game" />
        {!started && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 6,
              background: 'rgba(11,20,40,.55)',
            }}
          >
            <div style={{ fontFamily: 'inherit', fontSize: 22, fontWeight: 700, color: 'var(--color-gold-500)' }}>
              Tap to start
            </div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>Tap (or press Space) to jump over the maths blocks</div>
          </div>
        )}
      </div>
      <div style={{ fontSize: 12, opacity: 0.55, textAlign: 'center', marginTop: 10 }}>
        The ground is a number line. It gets faster the further you run.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sudoku – 6x6 and 9x9                                               */
/* ------------------------------------------------------------------ */

function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const range = (k) => [...Array(k).keys()];

// Build a valid solved grid from the standard pattern, shuffle its bands/stacks/digits,
// then punch `holes` random cells out to make the puzzle.
function generateSudoku(n, boxRows, boxCols, holes) {
  const pattern = (r, c) => (boxCols * (r % boxRows) + Math.floor(r / boxRows) + c) % n;
  const rows = [];
  const cols = [];
  shuffle(range(boxCols)).forEach((band) => shuffle(range(boxRows)).forEach((r) => rows.push(band * boxRows + r)));
  shuffle(range(boxRows)).forEach((stack) => shuffle(range(boxCols)).forEach((c) => cols.push(stack * boxCols + c)));
  const digits = shuffle(range(n).map((x) => x + 1));
  const solution = rows.map((r) => cols.map((c) => digits[pattern(r, c)]));
  const grid = solution.map((row) => row.slice());
  shuffle(range(n * n)).slice(0, holes).forEach((k) => { grid[Math.floor(k / n)][k % n] = 0; });
  return {
    n,
    boxRows,
    boxCols,
    given: grid.map((row) => row.map((v) => v > 0)),
    grid,
  };
}

const formatTime = (secs) => Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');

const SUDOKU_VARIANTS = [
  { n: 6, boxRows: 2, boxCols: 3, holes: 18, title: 'Mini 6×6', blurb: 'Quick puzzle, boxes of 2×3' },
  { n: 9, boxRows: 3, boxCols: 3, holes: 44, title: 'Classic 9×9', blurb: 'The full puzzle, boxes of 3×3' },
];

export function Sudoku({ onEnd }) {
  const [puzzle, setPuzzle] = useState(null);
  const [grid, setGrid] = useState(null);
  const [sel, setSel] = useState(null); // [row, col] of the selected cell
  const timer = useRef({ t0: 0, done: false }).current;
  const [, tick] = useState(0);

  const start = ({ n, boxRows, boxCols, holes }) => {
    const p = generateSudoku(n, boxRows, boxCols, holes);
    setPuzzle(p);
    setGrid(p.grid.map((row) => row.slice()));
    timer.t0 = Date.now();
    timer.done = false;
  };

  // Re-render once a second so the clock in the HUD advances.
  useEffect(() => {
    if (!puzzle) return undefined;
    const id = setInterval(() => tick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [puzzle]);

  // True when the value at (r, c) repeats in its row, column or box.
  const conflicts = (r, c, g) => {
    const v = g[r][c];
    const { n, boxRows, boxCols } = puzzle;
    if (!v) return false;
    for (let i = 0; i < n; i++) {
      if (i !== c && g[r][i] === v) return true;
      if (i !== r && g[i][c] === v) return true;
    }
    const r0 = r - (r % boxRows);
    const c0 = c - (c % boxCols);
    for (let a = r0; a < r0 + boxRows; a++) {
      for (let b = c0; b < c0 + boxCols; b++) {
        if ((a !== r || b !== c) && g[a][b] === v) return true;
      }
    }
    return false;
  };

  // Write a value (0 = erase) into the selected cell and check for completion.
  const put = (v) => {
    if (!sel || timer.done) return;
    const [r, c] = sel;
    if (puzzle.given[r][c]) return;
    const next = grid.map((row) => row.slice());
    next[r][c] = v;
    setGrid(next);
    const full = next.every((row) => row.every((x) => x > 0));
    const bad = next.some((row, a) => row.some((_, b) => conflicts(a, b, next)));
    if (full && !bad) {
      timer.done = true;
      const secs = Math.round((Date.now() - timer.t0) / 1000);
      setTimeout(
        () => onEnd({ score: Math.max(50, (puzzle.n === 9 ? 1500 : 600) - secs), line: 'Solved in ' + formatTime(secs) + '!' }),
        600,
      );
    }
  };

  // Keyboard: digits enter, Backspace/Delete/0 erase, arrows move the selection.
  // Re-bound on every render on purpose so it always sees the latest state.
  useEffect(() => {
    const onKey = (e) => {
      if (!puzzle) return;
      const k = parseInt(e.key, 10);
      if (k >= 1 && k <= puzzle.n) put(k);
      else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') put(0);
      else if (sel && /^Arrow/.test(e.key)) {
        const [r, c] = sel;
        const [dr, dc] = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
        const clamp = (x) => Math.max(0, Math.min(puzzle.n - 1, x));
        setSel([clamp(r + dr), clamp(c + dc)]);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!puzzle) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 10 }}>
        <div style={{ fontSize: 14, opacity: 0.75, marginBottom: 14 }}>
          Fill the grid so every row, column and box has each number once.
        </div>
        {SUDOKU_VARIANTS.map((variant) => (
          <button
            key={variant.n}
            onClick={() => start(variant)}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: 10,
              padding: '14px 16px',
              borderRadius: 14,
              textAlign: 'left',
              background: 'var(--color-page)',
              border: '1px solid var(--color-line)',
              color: 'var(--color-ink)',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontFamily: 'inherit', fontSize: 18, fontWeight: 700, color: 'var(--color-gold-500)' }}>
              {variant.title}
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.7 }}>{variant.blurb}</div>
          </button>
        ))}
      </div>
    );
  }

  const { n, boxRows, boxCols } = puzzle;
  const secs = Math.round((Date.now() - timer.t0) / 1000);
  const selValue = sel && grid[sel[0]][sel[1]];
  const cellFont = n === 9 ? 'min(5.2vw,22px)' : 'min(7vw,28px)';

  return (
    <div>
      <Hud items={[['Size', n + '×' + n], ['Time', formatTime(secs), 'var(--color-brand-500)']]} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(' + n + ',1fr)',
          border: '2.5px solid #8A6D12',
          borderRadius: 10,
          overflow: 'hidden',
          background: '#FFFDF7',
          maxWidth: 400,
          margin: '0 auto',
        }}
      >
        {grid.map((row, r) =>
          row.map((v, c) => {
            const selected = sel && sel[0] === r && sel[1] === c;
            const related =
              sel &&
              !selected &&
              (sel[0] === r ||
                sel[1] === c ||
                (Math.floor(sel[0] / boxRows) === Math.floor(r / boxRows) &&
                  Math.floor(sel[1] / boxCols) === Math.floor(c / boxCols)));
            const sameValue = selValue && v === selValue && !selected;
            const bad = conflicts(r, c, grid);
            const fixed = puzzle.given[r][c];
            return (
              <button
                key={r + '-' + c}
                onClick={() => setSel([r, c])}
                aria-label={'Row ' + (r + 1) + ' column ' + (c + 1)}
                style={{
                  aspectRatio: '1',
                  padding: 0,
                  fontSize: cellFont,
                  fontWeight: fixed ? 800 : 600,
                  fontFamily: 'inherit',
                  color: bad ? '#C0392B' : fixed ? '#1B2A4A' : '#2F6FA8',
                  background: selected
                    ? '#F3D77A'
                    : sameValue
                      ? 'rgba(212,175,55,.35)'
                      : related
                        ? 'rgba(27,42,74,.08)'
                        : 'transparent',
                  borderRight: (c + 1) % boxCols === 0 && c < n - 1 ? '2px solid #1B2A4A' : '1px solid rgba(27,42,74,.2)',
                  borderBottom: (r + 1) % boxRows === 0 && r < n - 1 ? '2px solid #1B2A4A' : '1px solid rgba(27,42,74,.2)',
                  borderTop: 0,
                  borderLeft: 0,
                  borderRadius: 0,
                  cursor: 'pointer',
                }}
              >
                {v || ''}
              </button>
            );
          }),
        )}
      </div>

      {/* Number pad plus erase */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(' + (n === 9 ? 5 : 4) + ',1fr)',
          gap: 7,
          marginTop: 12,
        }}
      >
        {range(n).map((k) => (
          <button
            key={k}
            onClick={() => put(k + 1)}
            style={{
              padding: '12px 0',
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 700,
              background: 'var(--color-page)',
              border: '1px solid var(--color-line)',
              color: 'var(--color-ink)',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            {k + 1}
          </button>
        ))}
        <button
          key="x"
          onClick={() => put(0)}
          aria-label="Erase"
          style={{
            padding: '12px 0',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            background: 'color-mix(in srgb, var(--color-bad-500) 18%, transparent)',
            border: '1px solid var(--color-line)',
            color: 'var(--color-bad-500)',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          {'⌫'}
        </button>
      </div>

      <div style={{ fontSize: 11, opacity: 0.5, textAlign: 'center', marginTop: 8 }}>
        Tap a square, then a number. Clashes turn red.
      </div>
    </div>
  );
}
