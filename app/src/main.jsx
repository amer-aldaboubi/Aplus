import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app/App';
import { parseTaskFromUrl, parseOpenFromUrl } from './data/task';

// Class-task / challenge links (#t=… / #c=…) are read before the first render.
parseTaskFromUrl();
parseOpenFromUrl();

createRoot(document.getElementById('root')).render(<App />);

// Service worker: network-first shell cache (packs are never cached). Same sw.js as before.
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
