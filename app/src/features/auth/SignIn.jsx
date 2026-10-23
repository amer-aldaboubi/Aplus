/* Sign-in screen, profile setup and the loading state. */
import React, { useEffect, useState } from 'react';
import { useHub, suggestedName } from '../../app/HubContext';
import { IconUser } from '../../ui/Icons';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-page)' }}>
      <div className="text-center">
        <div className="spinner" />
        <div className="muted text-[14px] mt-3">Loading A+…</div>
      </div>
    </div>
  );
}

/** Live counters shown under the sign-in button and on the home page. */
export function SiteStats({ compact }) {
  const hub = useHub();
  const [x, setX] = useState(null);
  useEffect(() => {
    let ok = true;
    hub.backend && hub.backend.getStats && hub.backend.getStats().then((v) => ok && setX(v || {})).catch(() => {});
    return () => {
      ok = false;
    };
  }, []);
  if (!x) return null;
  const f = (v) => (v || 0).toLocaleString();
  const rows = [[x.visits, 'Visitors'], [x.solved, 'Questions solved']];
  return (
    <div className={'flex gap-2 flex-wrap ' + (compact ? '' : 'justify-center')}>
      {rows.map(([v, l]) => (
        <div key={l} className="card px-3 py-2" style={{ minWidth: 96 }}>
          <div className="text-[18px] font-extrabold tnum">{f(v)}</div>
          <div className="label">{l}</div>
        </div>
      ))}
    </div>
  );
}

function IntroVideo() {
  const [on, setOn] = useState(false);
  return (
    <div className="card overflow-hidden mt-5 text-left">
      {on ? (
        <video src="episode1.mp4" poster="episode1-poster.jpg" controls autoPlay playsInline preload="metadata" style={{ display: 'block', width: '100%', background: '#000' }} />
      ) : (
        <button onClick={() => setOn(true)} aria-label="Play the A+ Maths Hub video" className="relative block w-full p-0" style={{ background: '#000' }}>
          <img src="episode1-poster.jpg" alt="" style={{ display: 'block', width: '100%', opacity: 0.92 }} />
          <span className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full" style={{ transform: 'translate(-50%,-50%)', width: 64, height: 64, background: 'rgba(47,111,228,.95)', color: '#fff', fontSize: 26, paddingLeft: 5 }}>▶</span>
        </button>
      )}
      <div className="px-4 py-3">
        <div className="font-bold text-[15px]">Watch: How to use A+ (4 min)</div>
        <div className="muted text-[13px]">Sign in, mark yourself, get help, calculator and games.</div>
      </div>
    </div>
  );
}

export function SignInScreen() {
  const hub = useHub();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function signIn(asTeacher) {
    setBusy(true);
    setErr('');
    try {
      await hub.backend.signIn(asTeacher);
    } catch {
      setErr('Sign-in did not complete. Please try again.');
    }
    setBusy(false);
  }
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--color-navy-800) 0, var(--color-navy-800) 260px, var(--color-page) 260px)' }}>
      <div className="mx-auto px-4 pt-12 pb-16 text-center" style={{ maxWidth: 440 }}>
        <div className="mx-auto flex items-center justify-center rounded-[22px] font-extrabold text-white" style={{ width: 84, height: 84, background: 'var(--color-brand-500)', fontSize: 40, boxShadow: '0 10px 28px rgba(0,0,0,.25)' }}>A+</div>
        <div className="label mt-4" style={{ color: 'rgba(255,255,255,.7)' }}>Pearson Edexcel · IGCSE &amp; IAL</div>
        <h1 className="text-white text-[30px] font-extrabold m-0 mt-1">A+ Maths Hub</h1>
        <div className="text-[14px] mt-1" style={{ color: 'rgba(255,255,255,.8)' }}>Past-paper practice with mark schemes · Created by Dr. Amer Al-Daboubi</div>

        <div className="card p-5 mt-8 text-left">
          <div className="font-bold text-[17px]">Sign in to save your progress</div>
          {hub.mode === 'firebase' ? (
            <button disabled={busy} onClick={() => signIn()} className="btn btn-primary btn-lg w-full mt-4">{busy ? 'Signing in…' : 'Sign in with school Google account'}</button>
          ) : (
            <div>
              <div className="faint text-[12px] mt-3">DEMO MODE: no real login</div>
              <button onClick={() => signIn(false)} className="btn btn-primary btn-lg w-full mt-2">Continue as demo student</button>
              <button onClick={() => signIn(true)} className="btn btn-navy btn-lg w-full mt-2">Continue as demo teacher</button>
            </div>
          )}
          <button onClick={hub.continueAsGuest} className="btn btn-secondary btn-lg w-full mt-2"><IconUser size={18} /> Use as guest</button>
          <div className="faint text-[12px] mt-2">Guests can practise everything. Progress is saved only when you sign in.</div>
          {(hub.error || err) && <div className="text-[14px] mt-3 font-semibold" style={{ color: 'var(--color-bad-500)' }}>{hub.error || err}</div>}
          {hub.config.domain && hub.mode === 'firebase' && <div className="faint text-[12px] mt-3">School accounts: only @{hub.config.domain} can sign in.</div>}
        </div>

        <IntroVideo />
        <div className="mt-5"><SiteStats /></div>
      </div>
    </div>
  );
}

export function ProfileSetup() {
  const hub = useHub();
  const [name, setName] = useState(suggestedName(hub.user));
  const [cls, setCls] = useState('');
  const [busy, setBusy] = useState(false);
  const ok = name.trim().length >= 2 && cls;
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-page)' }}>
      <div className="mx-auto px-4 pt-14" style={{ maxWidth: 440 }}>
        <div className="card p-5">
          <h1 className="text-[24px] font-extrabold m-0">Set up your profile</h1>
          <div className="muted text-[14px] mt-1">Your teacher can see your progress. Classmates only see your name on the leaderboard.</div>
          <div className="label mt-5 mb-1">Name (first name and last initial)</div>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} placeholder="e.g. Ali K." className="input" />
          <div className="label mt-4 mb-2">Your class</div>
          <div className="flex flex-wrap gap-2">
            {hub.classes.map((c) => (
              <button key={c} onClick={() => setCls(c)} className={'chip ' + (cls === c ? 'chip-on' : '')} style={{ padding: '9px 16px', fontSize: 14 }}>{c}</button>
            ))}
          </div>
          <button disabled={!ok || busy} onClick={async () => { setBusy(true); await hub.saveProfile({ name: name.trim(), cls }); }} className="btn btn-primary btn-lg w-full mt-6">{busy ? 'Saving…' : 'Start'}</button>
          <button onClick={hub.signOut} className="btn btn-ghost w-full mt-2">Use a different account</button>
        </div>
      </div>
    </div>
  );
}
