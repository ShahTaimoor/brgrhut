import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

// Fade + slight upward slide as `ref`'s element enters the viewport, once.
// `once: true` on the ScrollTrigger means it never re-triggers on subsequent
// scroll-up/scroll-down passes. Skips the animation entirely (content just
// renders in its final state) when the OS-level reduced-motion preference is on.
export function useScrollReveal(ref, options = {}) {
  const { y = 28, duration = 0.7, delay = 0, start = 'top 85%' } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.set(el, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }),
      });
    },
    { scope: ref }
  );
}
