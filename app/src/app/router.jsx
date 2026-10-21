/* Minimal state router: { name: 'home' | 'practice' | 'progress' | 'teacher', sid?, key? } */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const RouterContext = createContext({ route: { name: 'home' }, go: () => {} });
export const useRouter = () => useContext(RouterContext);

export function RouterProvider({ initial, children }) {
  const [route, setRoute] = useState(initial || { name: 'home' });
  const go = useCallback((r) => {
    setRoute(typeof r === 'string' ? { name: r } : r);
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    // Browser back returns to the home screen from any sub-page.
    const onPop = () => setRoute({ name: 'home' });
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    if (route.name !== 'home') history.pushState({ r: route.name }, '');
  }, [route]);
  return <RouterContext.Provider value={{ route, go }}>{children}</RouterContext.Provider>;
}
