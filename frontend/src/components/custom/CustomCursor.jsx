import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useCanHover } from '@/hooks/useCanHover';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, select, textarea, label, .cursor-pointer';

// Desktop-only (gated on actual hover/pointer capability, not viewport width -
// see useCanHover) trailing cursor: a small dot that snaps to the real pointer
// almost instantly, and a larger ring that eases toward it with a bit of lag
// for the "trailing" feel. Both use gsap.quickTo, which is built specifically
// for cheap, repeated updates like mousemove (vs. creating a new tween per
// event) and drives everything through GPU-friendly x/y transforms.
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canHover = useCanHover();

  useEffect(() => {
    if (!canHover) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;

    // Start off-screen rather than at (0,0) so there's no visible flash in the
    // corner before the first real mousemove positions it.
    gsap.set([dot, ring], { x: -100, y: -100 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    let hovering = false;

    const setHovering = (next) => {
      if (next === hovering) return;
      hovering = next;
      gsap.to(ring, {
        scale: next ? 1.6 : 1,
        backgroundColor: next ? 'rgba(234, 88, 12, 0.15)' : 'rgba(234, 88, 12, 0)',
        duration: 0.25,
        ease: 'power2.out',
      });
      gsap.to(dot, { scale: next ? 0 : 1, duration: 0.2, ease: 'power2.out' });
    };

    const handleMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      // Can't detect this via computed `cursor` style - the CSS rule below
      // that hides the native cursor (needed on every element, including
      // links/buttons) also overrides their own `cursor: pointer`, so that
      // signal is gone by the time we'd read it back.
      setHovering(!!e.target.closest(INTERACTIVE_SELECTOR));
    };

    const handleLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const handleEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    document.body.classList.add('custom-cursor-active');
    window.addEventListener('mousemove', handleMove);
    document.documentElement.addEventListener('mouseleave', handleLeave);
    document.documentElement.addEventListener('mouseenter', handleEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      document.documentElement.removeEventListener('mouseenter', handleEnter);
    };
  }, [canHover]);

  if (!canHover) return null;

  return (
    <>
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
      />
      <div
        ref={ringRef}
        id="custom-cursor-ring"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
      />
    </>
  );
};

export default CustomCursor;
