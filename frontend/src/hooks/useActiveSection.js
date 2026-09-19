import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Which nav item each on-page section belongs to.
const SECTION_TO_NAV = {
  home: 'home',
  menu: 'menu',
  'meal-deals': 'menu',
  about: 'about',
  testimonials: 'about',
  contact: 'contact',
};
const SECTION_IDS = Object.keys(SECTION_TO_NAV);

// A tapped nav item stays highlighted while the smooth scroll passes over the
// sections in between, instead of flickering through each of them.
let lockedNav = null;
let lockTimer = null;
const listeners = new Set();

export const lockActiveSection = (nav) => {
  lockedNav = nav;
  clearTimeout(lockTimer);
  lockTimer = setTimeout(() => {
    lockedNav = null;
    listeners.forEach((fn) => fn());
  }, 1200);
  listeners.forEach((fn) => fn());
};

const detect = () => {
  if (lockedNav) return lockedNav;
  const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (nearBottom) return 'contact';

  const probe = window.innerHeight * 0.35;
  let current = 'home';
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= probe) current = SECTION_TO_NAV[id];
  }
  return current;
};

export function useActiveSection() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return undefined;
    }

    let frame = null;
    const update = () => {
      frame = null;
      setActive(detect());
    };
    const schedule = () => {
      if (frame == null) frame = requestAnimationFrame(update);
    };

    listeners.add(schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    // Sections mount lazily and change height while loading; re-check shortly.
    const settle = setTimeout(schedule, 800);

    return () => {
      listeners.delete(schedule);
      clearTimeout(settle);
      if (frame != null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [onHome]);

  return active;
}
