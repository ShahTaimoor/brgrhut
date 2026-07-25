import { useEffect, useState } from 'react';

// Distinct from useIsMobile (which is a viewport-width breakpoint): this
// checks actual pointer/hover capability, since a touch tablet can be wide
// and a small desktop window is still mouse-driven. Used to decide whether
// hover-based interactions (pause-on-hover, button lift) make sense, vs.
// needing a tap-based equivalent.
export function useCanHover() {
  const [canHover, setCanHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = () => setCanHover(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return canHover;
}
