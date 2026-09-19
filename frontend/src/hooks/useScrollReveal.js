import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

// ScrollTrigger measures where each section starts once, when it is created.
// On a refresh the page keeps changing height after that (fonts, hero video,
// map iframe, flipbook sizing), so the stored positions go stale and sections
// near the bottom - Contact and Footer - could stay hidden. Re-measuring
// whenever the layout settles keeps them correct.
let layoutWatcherStarted = false;
const startLayoutWatcher = () => {
  if (layoutWatcherStarted || typeof window === 'undefined') return;
  layoutWatcherStarted = true;

  let timer = null;
  const refresh = () => {
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 150);
  };

  window.addEventListener('load', refresh);
  window.addEventListener('resize', refresh);
  if (document.fonts?.ready) document.fonts.ready.then(refresh);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(refresh).observe(document.body);
  }
};

// Fade + slight upward slide as `ref`'s element enters the viewport, once.
// Content already on screen when it mounts (e.g. after a refresh that
// restores the scroll position) is shown immediately instead of animating.
// Skips the animation entirely when the OS-level reduced-motion preference is on.
export function useScrollReveal(ref, options = {}) {
  const { y = 60, duration = 0.9, delay = 0, start = 'top 85%' } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      startLayoutWatcher();

      const alreadyVisible = el.getBoundingClientRect().top < window.innerHeight * 0.85;
      if (alreadyVisible) return;

      gsap.set(el, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        // clearProps drops the leftover transform/opacity once revealed - a
        // lingering transform on a section wrapper creates a compositing layer
        // that made the 3D flipbook inside the menu section paint ghost pages
        // over neighbouring sections in Edge.
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration, delay, ease: 'power2.out', clearProps: 'transform,opacity' }),
      });
    },
    { scope: ref }
  );
}
