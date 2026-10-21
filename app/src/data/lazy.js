/*
  Lazy loading of the large data files that live at the repository root.
  They define globals (window.APHELP, window.APQH, window.APQS/APQG, window.APCalc/APCalcUI),
  so they are injected as classic <script> tags on first use instead of being bundled.
  Keeps the files byte-compatible with the printable-worksheets page which also reads them.
*/
const loaded = {};

export function loadScript(src) {
  if (loaded[src]) return loaded[src];
  loaded[src] = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      delete loaded[src];
      reject(new Error('Could not load ' + src));
    };
    document.head.appendChild(s);
  });
  return loaded[src];
}

/** Chapter key points + per-question explanations (help.js 52 KB, qhelp.js 1.1 MB). */
export function loadHelp() {
  return Promise.all([loadScript('help.js'), loadScript('qhelp.js')]).then(() => ({ help: window.APHELP || {}, qhelp: window.APQH || {} }));
}

/** "Idea" grouping of questions within chapters (qorder.js + qidea.js). */
export function loadOrdering() {
  return loadScript('qorder.js?v=1').then(() => loadScript('qidea.js?v=3'));
}

/** Scientific calculator (calc.js). Returns the UI controller. */
export function loadCalculator() {
  return loadScript('calc.js?v=3').then(() => window.APCalcUI);
}
