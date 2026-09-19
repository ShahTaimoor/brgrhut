// Seconds after page load at which the intro burger has closed and the screen
// starts opening. Other animations (e.g. the hero text) wait for this so they
// play visibly instead of finishing behind the overlay.
export const INTRO_OPEN_AT = 2.3;
export const INTRO_OPEN_DURATION = 0.9;

export const introRemainingSeconds = () => {
  if (typeof performance === 'undefined') return 0;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
  return Math.max(0, INTRO_OPEN_AT + INTRO_OPEN_DURATION * 0.5 - performance.now() / 1000);
};
