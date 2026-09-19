import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { INTRO_OPEN_DURATION } from '@/lib/intro';

const OUTLINE = '#5b2a45';
const SW = 6;

// Full-screen intro shown on every page load: the burger's layers drop in one
// by one, the top bun closes it, then the screen slides open onto the site.
const IntroLoader = () => {
  const rootRef = useRef(null);
  const burgerRef = useRef(null);
  const [done, setDone] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useGSAP(
    () => {
      if (done) return undefined;

      const html = document.documentElement;
      const previousOverflow = html.style.overflow;
      html.style.overflow = 'hidden';
      const unlock = () => { html.style.overflow = previousOverflow; };

      const layers = ['.l-bottom', '.l-patty', '.l-cheese', '.l-veg', '.l-lettuce', '.l-top'];
      const offsets = [0, -70, -85, -100, -115, -150];

      layers.forEach((sel, i) => {
        gsap.set(sel, { y: offsets[i] - 60, opacity: 0 });
      });
      gsap.set('.l-shadow', { scaleX: 0.4, opacity: 0, transformOrigin: '50% 50%' });

      const tl = gsap.timeline({
        onComplete: () => {
          unlock();
          setDone(true);
        },
      });

      tl.to('.l-shadow', { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);
      layers.forEach((sel, i) => {
        tl.to(sel, { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' }, 0.1 + i * 0.2);
      });
      // Burger is now closed - a small squash to sell the landing.
      tl.to(burgerRef.current, { scaleY: 0.93, scaleX: 1.03, duration: 0.12, ease: 'power2.in', transformOrigin: '50% 100%' }, '>-0.05');
      tl.to(burgerRef.current, { scaleY: 1, scaleX: 1, duration: 0.4, ease: 'elastic.out(1, 0.45)' });
      tl.to({}, { duration: 0.25 });

      // Wait for fonts (max 1.5s) so the site doesn't swap fonts right as it appears.
      tl.add(() => {
        tl.pause();
        const fontsReady = document.fonts?.ready ?? Promise.resolve();
        Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(() => tl.resume());
      });

      // Screen opens upward, burger rides up with it.
      tl.to(rootRef.current, { yPercent: -100, duration: INTRO_OPEN_DURATION, ease: 'power3.inOut' });
      tl.to(burgerRef.current, { y: -40, opacity: 0, duration: INTRO_OPEN_DURATION * 0.6, ease: 'power2.in' }, '<');

      return () => {
        tl.kill();
        unlock();
      };
    },
    { scope: rootRef, dependencies: [done] }
  );

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fffaf3]"
      role="status"
      aria-label="Loading brgrhut"
    >
      <svg
        ref={burgerRef}
        viewBox="0 0 240 240"
        className="h-64 w-64 overflow-visible sm:h-80 sm:w-80"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <ellipse className="l-shadow" cx="120" cy="206" rx="78" ry="6" fill="#f2c48f" opacity="0.6" />

        <g className="l-bottom">
          <rect x="50" y="168" width="140" height="32" rx="15" fill="#edb765" stroke={OUTLINE} strokeWidth={SW} />
          <path d="M62 178 H150" stroke="#f6d59a" strokeWidth="5" />
        </g>

        <g className="l-patty">
          <rect x="42" y="138" width="156" height="32" rx="16" fill="#8e3b2e" stroke={OUTLINE} strokeWidth={SW} />
          <rect x="54" y="148" width="24" height="8" rx="4" fill="#b85a48" stroke="none" />
          <circle cx="88" cy="152" r="4" fill="#b85a48" stroke="none" />
        </g>

        <g className="l-cheese">
          <path d="M54 132 H186 L152 138 L120 162 L88 138 Z" fill="#f6de9a" stroke={OUTLINE} strokeWidth={SW} />
        </g>

        <g className="l-veg">
          <rect x="64" y="112" width="28" height="18" fill="#fff" stroke={OUTLINE} strokeWidth="4" />
          <rect x="92" y="112" width="28" height="18" fill="#d63a2f" stroke={OUTLINE} strokeWidth="4" />
          <rect x="120" y="112" width="28" height="18" fill="#fff" stroke={OUTLINE} strokeWidth="4" />
          <rect x="148" y="112" width="28" height="18" fill="#d63a2f" stroke={OUTLINE} strokeWidth="4" />
        </g>

        <g className="l-lettuce">
          <path
            d="M50 96 L62 106 Q72 100 82 106 T102 106 T122 106 T142 106 T162 106 L178 106 L190 96 Z"
            fill="#9bcb6f"
            stroke={OUTLINE}
            strokeWidth={SW}
          />
        </g>

        <g className="l-top">
          <path
            d="M38 94 C38 58 76 34 120 34 C164 34 202 58 202 94 Q120 102 38 94 Z"
            fill="#f3d2a4"
            stroke={OUTLINE}
            strokeWidth={SW}
          />
          <path d="M150 44 C176 52 192 68 194 88 Q176 90 164 88 C170 74 164 58 150 44 Z" fill="#e8b878" stroke="none" opacity="0.7" />
          <g stroke={OUTLINE} strokeWidth="4">
            <path d="M84 52 l5 2" />
            <path d="M118 44 l6 1" />
            <path d="M150 58 l4 3" />
            <path d="M100 70 l6 1" />
            <path d="M136 76 l5 -1" />
            <path d="M68 78 l4 3" />
            <path d="M172 76 l4 2" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default IntroLoader;
