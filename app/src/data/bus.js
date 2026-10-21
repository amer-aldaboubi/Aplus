/* Tiny in-app event bus (replaces the window custom events of the old bundle). */
const handlers = {};

export function on(name, fn) {
  (handlers[name] = handlers[name] || new Set()).add(fn);
  return () => handlers[name].delete(fn);
}

export function emit(name, payload) {
  (handlers[name] || []).forEach((fn) => {
    try {
      fn(payload);
    } catch {}
  });
}

export const EV = {
  RECORDED: 'recorded',     // a question was marked and saved
  REFRESH: 'refresh',       // re-read progress / rewards
  OPEN_GAMES: 'open-games', // open the Game Zone
};
