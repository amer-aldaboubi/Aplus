/*
  Session provider: config, backend, signed-in user, profile, teacher flag, and the
  shared rewards snapshot (level, badges, tokens, class board) used across screens.
*/
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { createFirebaseBackend } from '../backend/firebase';
import { createDemoBackend } from '../backend/demo';
import { lsGet, lsSet, lsRemove, ssGet, ssSet } from '../data/local';
import { emit, EV } from '../data/bus';

const DEFAULT_CLASSES = ['10A', '10B', '10C', '11A', '11B', '11C'];
const GUEST_USER = { uid: 'guest', email: '', displayName: 'Guest', guest: true };
const GUEST_PROFILE = { name: 'Guest', cls: 'Guest', guest: true };

const HubContext = createContext({ mode: 'off' });
export const useHub = () => useContext(HubContext);

export function suggestedName(user) {
  const parts = (user.displayName || '').split(' ').filter(Boolean);
  return parts.length ? parts[0] + (parts.length > 1 ? ' ' + parts[parts.length - 1][0] + '.' : '') : (user.email || 'Student').split('@')[0];
}

export function HubProvider({ children, renderSignIn, renderSetup, renderLoading }) {
  const config = window.APLUS_CONFIG || {};
  const mode = config.mode === 'firebase' && config.firebase ? 'firebase' : config.mode === 'demo' ? 'demo' : 'off';
  const backend = useMemo(() => (mode === 'firebase' ? createFirebaseBackend(config) : mode === 'demo' ? createDemoBackend(config) : null), []);
  const [session, setSession] = useState({ status: mode === 'off' ? 'ready' : 'loading', user: null, profile: null, error: '' });
  const [rewards, setRewards] = useState({ c: null, board: [], liked: {} });

  useEffect(() => {
    if (!backend) return;
    // Anonymous visit counter, once per browser session (unchanged behaviour).
    if (mode === 'firebase' && !ssGet('aplus-visit')) {
      ssSet('aplus-visit', '1');
      backend.countVisit();
    }
    return backend.onUser(
      async (u) => {
        if (!u) {
          if (lsGet('aplus-guest') === '1') {
            setSession({ status: 'ready', user: GUEST_USER, profile: GUEST_PROFILE, error: '' });
            return;
          }
          setSession((s) => ({ status: 'out', user: null, profile: null, error: s.error }));
          return;
        }
        lsRemove('aplus-guest');
        let profile = null;
        try {
          profile = await backend.getProfile(u.uid);
        } catch {
          setSession({ status: 'out', user: null, profile: null, error: 'Could not load your profile. Check your connection.' });
          return;
        }
        if (!profile) {
          try {
            profile = await backend.saveProfile(u, { name: suggestedName(u), cls: 'All students' });
            backend.bump('users').catch(() => {});
          } catch {}
        }
        setSession({ status: profile ? 'ready' : 'setup', user: u, profile, error: '' });
      },
      (err) => setSession({ status: 'out', user: null, profile: null, error: err }),
    );
  }, []);

  const teacherEmails = (config.teacherEmails || []).map((e) => e.toLowerCase());
  const email = ((session.user || {}).email || '').toLowerCase();
  const isTeacher = !!session.user && (teacherEmails.includes(email) || (mode === 'demo' && email === 'teacher@demo'));

  const signOut = useCallback(() => {
    if (session.user && session.user.guest) {
      lsRemove('aplus-guest');
      setSession({ status: 'out', user: null, profile: null, error: '' });
    } else backend && backend.signOut();
  }, [session.user, backend]);

  const continueAsGuest = useCallback(() => {
    lsSet('aplus-guest', '1');
    if (!ssGet('aplus-gv')) {
      ssSet('aplus-gv', '1');
      backend && backend.bump('guests').catch(() => {});
    }
    setSession({ status: 'ready', user: GUEST_USER, profile: GUEST_PROFILE, error: '' });
  }, [backend]);

  const saveProfile = useCallback(
    async (p) => {
      const profile = await backend.saveProfile(session.user, p);
      backend.bump('users').catch(() => {});
      setSession({ status: 'ready', user: session.user, profile, error: '' });
    },
    [backend, session.user],
  );

  /** Save a self-marked question: { key:"m:01", qid, res:"g"|"p"|"s", d } */
  const record = useCallback(
    (r) => {
      if (!backend || !session.user || !session.profile) return;
      backend.bump('solved').catch(() => {});
      if (session.user.guest) return;
      backend
        .record(session.user, session.profile, r)
        .then(() => emit(EV.RECORDED))
        .catch(() => {});
    },
    [backend, session.user, session.profile],
  );

  const value = {
    mode,
    backend,
    config,
    classes: config.classes || DEFAULT_CLASSES,
    status: session.status,
    error: session.error,
    user: session.user,
    profile: session.profile,
    isGuest: !!(session.profile && session.profile.guest),
    isTeacher,
    signOut,
    continueAsGuest,
    saveProfile,
    record,
    rewards: rewards.c,
    board: rewards.board,
    liked: rewards.liked,
    setRewards,
    setLiked: (fk, on) => setRewards((r) => ({ ...r, liked: { ...r.liked, [fk]: on } })),
    setBoard: (board) => setRewards((r) => ({ ...r, board })),
  };

  if (mode !== 'off') {
    if (session.status === 'loading') return renderLoading();
    if (session.status === 'out') return <HubContext.Provider value={value}>{renderSignIn()}</HubContext.Provider>;
    if (session.status === 'setup') return <HubContext.Provider value={value}>{renderSetup()}</HubContext.Provider>;
  }
  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}
