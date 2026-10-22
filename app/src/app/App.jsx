import React, { useEffect, useState } from 'react';
import { HubProvider } from './HubContext';
import { RouterProvider, useRouter } from './router';
import { Header, BottomTabs } from './Shell';
import { HomePage } from '../features/home/HomePage';
import { PracticePage } from '../features/practice/PracticePage';
import { ProgressPage } from '../features/progress/ProgressPage';
import { TeacherPage } from '../features/teacher/TeacherPage';
import { GlobalSearch } from '../features/search/GlobalSearch';
import { SignInScreen, ProfileSetup, LoadingScreen } from '../features/auth/SignIn';
import { RewardsWatcher } from '../rewards/RewardsWatcher';
import { currentTask, parseOpenFromUrl } from '../data/task';

function Screen() {
  const { route } = useRouter();
  const [search, setSearch] = useState(false);
  useEffect(() => {
    const f = (e) => {
      if (e.key === '/' && !/input|textarea|select/i.test((e.target.tagName || '')) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, []);
  let page;
  if (route.name === 'practice') page = <PracticePage key={route.sid + ':' + (route.tc || '') + ':' + (route.key || '') + ':' + (route.task ? 't' : '')} sid0={route.sid} tc0={route.tc} key0={route.key} />;
  else if (route.name === 'progress') page = <ProgressPage />;
  else if (route.name === 'teacher') page = <TeacherPage />;
  else page = <HomePage />;
  return (
    <>
      <Header onSearch={() => setSearch(true)} />
      {page}
      <BottomTabs onSearch={() => setSearch(true)} />
      {search && <GlobalSearch onClose={() => setSearch(false)} />}
      <RewardsWatcher />
    </>
  );
}

export function App() {
  const task = currentTask();
  const open = parseOpenFromUrl();
  return (
    <HubProvider renderLoading={() => <LoadingScreen />} renderSignIn={() => <SignInScreen />} renderSetup={() => <ProfileSetup />}>
      <RouterProvider initial={task ? { name: 'practice', sid: task.sid, task: true } : open ? { name: 'practice', sid: open.sid, tc: open.tc, key: open.k } : { name: 'home' }}>
        <Screen />
      </RouterProvider>
    </HubProvider>
  );
}
