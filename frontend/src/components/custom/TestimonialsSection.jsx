import { useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { horizontalLoop } from '@/utils/horizontalLoop';
import { useCanHover } from '@/hooks/useCanHover';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// PLACEHOLDER TESTIMONIALS — replace with real customer reviews.
// Each entry: { name, location, quote, rating (1-5) }
const PLACEHOLDER_TESTIMONIALS = [
  {
    name: 'Ahmed R.',
    location: 'Darlaston, West Midlands',
    quote:
      '[Placeholder review] The flame-grilled patty tastes nothing like the usual fast food burgers — smoky, juicy, and always fresh. brgrhut is our go-to order night.',
    rating: 5,
  },
  {
    name: 'Sana K.',
    location: 'Walsall, West Midlands',
    quote:
      '[Placeholder review] Fast delivery, hot fries every time, and the pizza is surprisingly good for a burger place. Highly recommend the double zinger combo.',
    rating: 5,
  },
  {
    name: 'Bilal M.',
    location: 'Wolverhampton, West Midlands',
    quote:
      '[Placeholder review] Consistent quality and friendly service. The spicy burger has real heat, not the watered-down kind. Will keep ordering.',
    rating: 4,
  },
];

// A 3-card loop repeats too fast to read comfortably - repeat the set so the
// marquee has enough visual length. Purely a render-time duplication; swap
// PLACEHOLDER_TESTIMONIALS for real reviews and this still works unchanged.
const LOOP_REPEATS = 3;
const LOOP_ITEMS = Array.from({ length: LOOP_REPEATS }).flatMap((_, dupIndex) =>
  PLACEHOLDER_TESTIMONIALS.map((t, i) => ({ ...t, _loopKey: `${dupIndex}-${i}` }))
);

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const loopTlRef = useRef(null);
  const canHover = useCanHover();
  const [isPaused, setIsPaused] = useState(false);

  useScrollReveal(sectionRef);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

      const cards = gsap.utils.toArray('.testimonial-card', viewportRef.current);
      if (cards.length === 0) return undefined;

      loopTlRef.current = horizontalLoop(cards, { repeat: -1, speed: 0.5, paddingRight: 24 });

      return () => {
        loopTlRef.current?.kill();
        loopTlRef.current = null;
      };
    },
    { scope: viewportRef, dependencies: [] }
  );

  const handleMouseEnter = () => {
    if (canHover) loopTlRef.current?.pause();
  };
  const handleMouseLeave = () => {
    if (canHover) loopTlRef.current?.play();
  };
  const handleTap = () => {
    if (canHover) return; // desktop uses hover, not tap
    const tl = loopTlRef.current;
    if (!tl) return;
    if (tl.paused()) {
      tl.play();
      setIsPaused(false);
    } else {
      tl.pause();
      setIsPaused(true);
    }
  };

  return (
    <section ref={sectionRef} id="testimonials" className="w-full bg-orange-50/40 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.25em] text-primary">Reviews</p>
          <h2 className="font-['Fredoka',sans-serif] mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What our customers say
          </h2>
          <p className="font-['Poppins',sans-serif] mt-2 text-xs italic text-gray-400">
            Placeholder testimonials shown below — swap in real customer reviews when ready.
          </p>
        </div>
      </div>

      <div
        ref={viewportRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTap}
        className="relative mt-10 w-full overflow-hidden py-2"
      >
        <div className="flex w-max gap-6 px-4">
          {LOOP_ITEMS.map((t) => (
            <div
              key={t._loopKey}
              className="testimonial-card flex w-[280px] flex-shrink-0 flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:w-[340px]"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < t.rating ? 'fill-primary text-primary' : 'fill-gray-200 text-gray-200'}
                  />
                ))}
              </div>
              <p className="font-['Poppins',sans-serif] mt-4 flex-1 text-sm leading-relaxed text-gray-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="font-['Poppins',sans-serif] text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="font-['Poppins',sans-serif] text-xs text-gray-400">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!canHover && (
        <p className="font-['Poppins',sans-serif] mt-3 text-center text-[11px] text-gray-400">
          {isPaused ? 'Tap again to resume scrolling' : 'Tap a card to pause'}
        </p>
      )}
    </section>
  );
};

export default TestimonialsSection;
