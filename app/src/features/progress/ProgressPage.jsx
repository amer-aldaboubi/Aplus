/* My progress: stats, level, badges, certificates, what to work on, chapters, 14 days, class leaderboard. */
import React, { useEffect, useState } from 'react';
import { useHub } from '../../app/HubContext';
import { useRouter } from '../../app/router';
import { analyse } from '../../data/analytics';
import { weekKey } from '../../data/dates';
import { computeRewards, levelOf, LEVELS, maxStreak, weeksWon, starOfWeek, badgesFor } from '../../rewards/rewards';
import { Medal } from '../../rewards/Medal';
import { LevelBar } from '../../rewards/RewardsWatcher';
import { Certificate } from '../../rewards/Certificate';
import { Card, SectionTitle, StatTile, Empty } from '../../ui/primitives';
import { IconFire, IconBack } from '../../ui/Icons';

const GREEN = '#16a34a', AMBER = '#d97706', RED = '#dc2626';

export function ChapterBars({ rows }) {
  return rows.length ? (
    <div>
      {rows.map((r) => (
        <div key={r.key} className="mb-2.5">
          <div className="flex justify-between text-[13px]">
            <span className="truncate pr-2">{r.label}</span>
            <span className="muted tnum shrink-0">{r.a} q · {Math.round(r.score * 100)}%</span>
          </div>
          <div className="flex rounded-full overflow-hidden mt-1" style={{ height: 8, background: 'var(--color-line)' }}>
            <div style={{ width: (r.g / r.a) * 100 + '%', background: GREEN }} />
            <div style={{ width: (r.p / r.a) * 100 + '%', background: AMBER }} />
            <div style={{ width: (r.s / r.a) * 100 + '%', background: RED }} />
          </div>
        </div>
      ))}
      <div className="faint text-[11px] flex gap-3 mt-1"><span style={{ color: GREEN }}>■ Got it</span><span style={{ color: AMBER }}>■ Partly</span><span style={{ color: RED }}>■ Stuck</span></div>
    </div>
  ) : (
    <Empty>No questions yet. Do some practice and your chapters will show here.</Empty>
  );
}

export function DaysChart({ days }) {
  const mx = Math.max(1, ...days.map((d) => d.n));
  return (
    <div className="flex items-end gap-1" style={{ height: 70 }}>
      {days.map((d) => <div key={d.d} title={d.d + ': ' + d.n} className="flex-1 rounded-sm" style={{ height: Math.max(3, (d.n / mx) * 66), background: d.n ? 'var(--color-brand-500)' : 'var(--color-line)' }} />)}
    </div>
  );
}

export function NeedsWork({ an }) {
  return (
    <div>
      {an.needs.length ? (
        an.needs.map((r) => (
          <div key={r.key} className="rounded-xl px-3 py-2.5 mb-1.5 text-[14px]" style={{ background: 'var(--color-bad-100)', border: '1px solid rgba(220,38,38,.35)' }}>
            ⚠️ <b>{r.label}</b>
            <div className="muted text-[12px]">{Math.round(r.score * 100)}% over {r.a} questions. Practise this chapter next.</div>
          </div>
        ))
      ) : (
        <Empty>{an.total < 3 ? 'Answer a few questions and your weak topics will appear here.' : 'No weak topics right now. Keep going!'}</Empty>
      )}
      {an.untried.length > 0 && <div className="muted text-[12px] mt-2">Not tried yet: {an.untried.map((r) => r.label).join(' · ')}</div>}
    </div>
  );
}

function Rewards({ an, progress, board, uid, profile }) {
  const [cert, setCert] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [sel, setSel] = useState(null);
  const pts = an.pts;
  const L = levelOf(pts);
  const won = weeksWon(board, uid, profile.cls);
  const star = starOfWeek(board, profile.cls);
  const bs = badgesFor(an, maxStreak((progress || {}).days), won);
  const got = bs.filter((b) => b.ok).length;
  const list = showAll ? bs : bs.filter((b) => b.ok).concat(bs.filter((b) => !b.ok).slice(0, Math.max(0, 8 - got))).slice(0, Math.max(8, got));
  const certs = [];
  LEVELS.forEach((lv, j) => {
    if (j > 0 && j <= L.idx) certs.push({ k: 'l' + j, t: lv.n, medal: { b: lv, hex: true }, title: lv.n, line: 'for reaching ' + lv.p + ' points through dedicated practice on A+ Maths Hub, earning the level of' });
  });
  if (won >= 1) certs.push({ k: 's', t: 'Star of the week', medal: { b: bs.find((b) => b.id === 'sow') }, title: 'Star of the Week', line: 'for finishing top of ' + profile.cls + ' in weekly practice' + (won > 1 ? ' (' + won + ' times)' : '') + ', earning the title of' });
  const sb = sel && bs.find((b) => b.id === sel);
  return (
    <div>
      {star && (
        <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 mt-4" style={{ background: 'var(--color-gold-100)', border: '1px solid var(--color-gold-500)' }}>
          <Medal b={bs.find((b) => b.id === 'sow')} size={50} />
          <div className="flex-1">
            <div className="label" style={{ color: '#8A6D12' }}>Star of last week · {profile.cls}</div>
            <div className="text-[19px] font-bold">{star.name}{star.uid === uid ? ' (you!)' : ''}</div>
            <div className="muted text-[12px]">{star.v} points that week</div>
          </div>
        </div>
      )}
      <SectionTitle>My level</SectionTitle>
      <Card className="p-4 flex gap-3.5 items-center">
        <Medal b={L.cur} size={70} shape="hex" />
        <div className="flex-1 min-w-0">
          <div className="label">Level {L.idx + 1} of {LEVELS.length}</div>
          <div className="text-[21px] font-bold mb-2" style={{ color: '#8A6D12' }}>{L.cur.n}</div>
          <LevelBar L={L} pts={pts} />
        </div>
      </Card>
      <div className="faint text-[11px] mt-1.5">Got it = 2 points · Partly = 1 point</div>

      <SectionTitle right={<button onClick={() => setShowAll(!showAll)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-brand-500)' }}>{showAll ? 'Show less' : 'See all badges'}</button>}>Badges · {got}/{bs.length}</SectionTitle>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))' }}>
        {list.map((b) => (
          <button key={b.id} onClick={() => setSel(sel === b.id ? null : b.id)} className="card flex flex-col items-center text-center px-1 pt-2.5 pb-2" style={{ background: b.ok ? 'var(--color-gold-100)' : undefined, borderColor: sel === b.id ? 'var(--color-gold-500)' : b.ok ? 'rgba(212,166,42,.5)' : undefined }}>
            <Medal b={b} size={50} locked={!b.ok} />
            <div className="text-[10.5px] font-bold mt-1 leading-tight" style={{ color: b.ok ? '#8A6D12' : 'var(--color-ink)', opacity: b.ok ? 1 : 0.6 }}>{b.n}</div>
            <div className="faint text-[9.5px] mt-0.5 tnum">{b.ok ? 'Earned' : Math.min(b.pr[0], b.pr[1]) + '/' + b.pr[1]}</div>
          </button>
        ))}
      </div>
      {sb && (
        <Card className="mt-2 px-3 py-2.5 text-[13px] flex gap-2.5 items-center">
          <Medal b={sb} size={36} locked={!sb.ok} />
          <div>
            <b style={{ color: sb.ok ? '#8A6D12' : undefined }}>{sb.n}</b>
            <div className="muted">{sb.d}{sb.ok ? ' — earned!' : ' — ' + Math.min(sb.pr[0], sb.pr[1]) + ' of ' + sb.pr[1] + ' so far'}</div>
          </div>
        </Card>
      )}

      <SectionTitle>My certificates</SectionTitle>
      {certs.length ? (
        <div className="flex flex-col gap-1.5">
          {certs.map((c) => (
            <button key={c.k} onClick={() => setCert(c)} className="card flex items-center gap-2.5 text-left px-3 py-2 text-[14px]">
              <Medal b={c.medal.b} size={32} shape={c.medal.hex ? 'hex' : undefined} />
              <span className="flex-1">{c.t}</span>
              <span className="font-bold text-[13px]" style={{ color: 'var(--color-brand-500)' }}>View ›</span>
            </button>
          ))}
        </div>
      ) : (
        <Empty>Reach the Explorer level (20 points) to unlock your first certificate.</Empty>
      )}
      {cert && <Certificate name={profile.name} cls={profile.cls} title={cert.title} line={cert.line} medal={cert.medal} onClose={() => setCert(null)} />}
    </div>
  );
}

export function ProgressPage() {
  const hub = useHub();
  const { go } = useRouter();
  const [progress, setProgress] = useState(null);
  const [board, setBoard] = useState([]);
  const [mode, setMode] = useState('wk');
  useEffect(() => {
    hub.backend.getProgress(hub.user.uid).then(setProgress).catch(() => setProgress({}));
    hub.backend.getBoard().then(setBoard).catch(() => {});
  }, []);
  const wrap = (children) => (
    <div className="mx-auto px-4 pt-5 pb-tabbar" style={{ maxWidth: 760 }}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => go('home')} className="btn btn-secondary btn-sm"><IconBack size={15} /> Home</button>
        <h1 className="m-0 text-[20px] font-extrabold">My progress</h1>
      </div>
      {children}
    </div>
  );
  if (!progress) return wrap(<div className="text-center mt-16"><div className="spinner" /></div>);
  const an = analyse(progress);
  const star = starOfWeek(board, hub.profile.cls);
  const wk = weekKey();
  const rows = board.filter((b) => b.cls === hub.profile.cls).map((b) => ({ ...b, v: mode === 'wk' ? (b.wk || {})[wk] || 0 : b.pts || 0 })).sort((a, b) => b.v - a.v);
  return wrap(
    <>
      <div className="text-[15px]"><b>{hub.profile.name}</b> <span className="muted">· {hub.profile.cls}</span></div>
      <div className="grid grid-cols-4 gap-2 mt-3">
        <StatTile value={an.total} label="Questions" />
        <StatTile value={an.acc + '%'} label="Score" colour={GREEN} />
        <StatTile value={an.streak} label="Day streak" colour={AMBER} icon={<IconFire size={16} />} />
        <StatTile value={an.pts} label="Points" colour="var(--color-brand-500)" />
      </div>
      <Rewards an={an} progress={progress} board={board} uid={hub.user.uid} profile={hub.profile} />
      <SectionTitle>What to work on next</SectionTitle>
      <NeedsWork an={an} />
      <SectionTitle>By chapter</SectionTitle>
      <Card className="p-4"><ChapterBars rows={an.rows} /></Card>
      <SectionTitle>Last 14 days</SectionTitle>
      <Card className="p-4"><DaysChart days={an.days14} /></Card>
      <SectionTitle right={<div className="flex gap-1.5">{[['wk', 'This week'], ['all', 'All time']].map(([k, l]) => <button key={k} onClick={() => setMode(k)} className={'chip ' + (mode === k ? 'chip-on' : '')}>{l}</button>)}</div>}>Class leaderboard ({hub.profile.cls})</SectionTitle>
      <Card className="p-2">
        {rows.slice(0, 10).map((b, i) => (
          <div key={b.uid} className="flex justify-between items-center rounded-lg px-3 py-2 text-[14px]" style={{ background: b.uid === hub.user.uid ? 'var(--color-gold-100)' : 'transparent', border: b.uid === hub.user.uid ? '1px solid var(--color-gold-500)' : '1px solid transparent' }}>
            <span>{['🥇', '🥈', '🥉'][i] || i + 1 + '.'} {b.name}{star && star.uid === b.uid ? ' ⭐' : ''}</span>
            <b className="tnum">{b.v}</b>
          </div>
        ))}
        {!rows.length && <Empty>No one in your class has points yet.</Empty>}
      </Card>
      <button onClick={hub.signOut} className="btn btn-secondary w-full mt-6">Sign out</button>
    </>,
  );
}
