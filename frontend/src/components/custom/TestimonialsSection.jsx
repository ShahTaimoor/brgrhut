import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { horizontalLoop } from '@/utils/horizontalLoop';
import { useCanHover } from '@/hooks/useCanHover';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { fetchActiveReviews } from '@/redux/slices/reviews/reviewSlice';
import { getInitials } from '@/utils/getInitials';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Shown only when there are no active reviews yet, so the section is never
// empty on a brand-new site before an admin has added real reviews.
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

// A seamless GSAP loop (see horizontalLoop.js) works by shifting every item
// by the total width of one full set at the wrap point - if that total width
// is narrower than the viewport, the wrap becomes visible as a stutter/gap
// instead of an invisible seam. Below this ratio we skip the loop entirely
// rather than fake it by repeating a couple of reviews until they numerically
// fill the screen, which just reads as the same review appearing 4-5 times
// in a row.
const MIN_FILL_RATIO = 1.15;
// Once looping is warranted, repeat until the duplicated content is at least
// 2x the viewport width, so the wrap point stays comfortably off-screen at
// any scroll position.
const TARGET_FILL_RATIO = 2;

const Card = ({ t }) => (
  <div className="testimonial-card flex w-[280px] flex-shrink-0 flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:w-[340px]">
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
    <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
      <Avatar className="h-10 w-10 flex-shrink-0 border border-orange-100">
        <AvatarImage src={t.picture?.secure_url} alt={t.name} />
        <AvatarFallback className="bg-orange-50 text-orange-600 text-xs font-bold">
          {getInitials(t.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="font-['Poppins',sans-serif] text-sm font-semibold text-gray-900">{t.name}</p>
        {t.location && (
          <p className="font-['Poppins',sans-serif] text-xs text-gray-400">{t.location}</p>
        )}
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const measureRowRef = useRef(null);
  const staticRowRef = useRef(null);
  const loopTlRef = useRef(null);
  const canHover = useCanHover();
  const [isPaused, setIsPaused] = useState(false);
  const [shouldLoop, setShouldLoop] = useState(false);
  const [repeatCount, setRepeatCount] = useState(2);
  const dispatch = useDispatch();
  const { activeReviews, activeStatus } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchActiveReviews());
  }, [dispatch]);

  // Real reviews once they exist; the placeholder set only until then.
  const usingPlaceholders = activeStatus !== 'loading' && activeReviews.length === 0;
  const baseTestimonials = useMemo(() => {
    const source = activeReviews.length > 0
      ? activeReviews.map((r) => ({
          name: r.customerName,
          location: r.location,
          quote: r.comment,
          rating: r.rating,
          picture: r.picture,
        }))
      : PLACEHOLDER_TESTIMONIALS;

    return source.map((t, i) => ({ ...t, _key: `base-${i}` }));
  }, [activeReviews]);

  // Decide, from the actual rendered card widths (fixed by the w-[280px]/
  // sm:w-[340px] classes, but measured rather than hardcoded so this never
  // drifts out of sync with the real markup - see the MenuBook sizing notes
  // for why this codebase measures instead of predicting), whether one full
  // set of cards fills the visible width. Re-checked on resize and whenever
  // the review count changes, since "enough to fill the screen" depends on
  // both.
  useLayoutEffect(() => {
    const container = viewportRef.current;
    const row = measureRowRef.current;
    if (!container || !row) return undefined;

    let debounceId = null;

    const applyFit = () => {
      const singleSetWidth = row.scrollWidth;
      const containerWidth = container.clientWidth;
      if (!singleSetWidth || !containerWidth) return;

      const fits = singleSetWidth >= containerWidth * MIN_FILL_RATIO;
      const newRepeat = fits ? Math.max(2, Math.ceil((containerWidth * TARGET_FILL_RATIO) / singleSetWidth)) : 2;
      // Bail out of the state update entirely when nothing actually changed,
      // so an unrelated re-render never tears down and rebuilds a timeline
      // that's mid-pause for no reason.
      setShouldLoop((prev) => (prev === fits ? prev : fits));
      setRepeatCount((prev) => (prev === newRepeat ? prev : newRepeat));
    };

    // The very first measurement (on mount / when the review count changes)
    // runs immediately so there's no flash of the wrong mode; anything after
    // that is debounced, since a resize (browser window drag, mobile toolbar
    // show/hide, orientation change) fires many rapid, transiently-wrong
    // ResizeObserver callbacks before the layout actually settles - acting on
    // every one of them is what caused the loop to rebuild mid-pause.
    let isFirst = true;
    const checkFit = () => {
      if (isFirst) {
        isFirst = false;
        applyFit();
        return;
      }
      clearTimeout(debounceId);
      debounceId = setTimeout(applyFit, 200);
    };

    checkFit();
    const ro = new ResizeObserver(checkFit);
    ro.observe(container);
    ro.observe(row);
    return () => {
      clearTimeout(debounceId);
      ro.disconnect();
    };
  }, [baseTestimonials]);

  const loopedTestimonials = useMemo(() => {
    if (!shouldLoop) return [];
    return Array.from({ length: repeatCount }).flatMap((_, dupIndex) =>
      baseTestimonials.map((t, i) => ({ ...t, _loopKey: `${dupIndex}-${i}` }))
    );
  }, [shouldLoop, repeatCount, baseTestimonials]);

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // revertOnUpdate: true is load-bearing here, not decorative - useGSAP only
  // reverts a previous run's GSAP objects on *unmount* by default when given a
  // dependencies array; without this flag, every time shouldLoop/loopedTestimonials
  // changes (which happens at least once per page load, once real review data
  // replaces the placeholder set) a second horizontalLoop timeline gets created
  // on top of the first, which is never killed - both then drive the same DOM
  // cards forever, which is what broke hover-pause (loopTlRef only ever paused
  // the newer one) and doubled the animation workload. See useGSAP's source
  // (deferCleanup) for why a manually-returned cleanup function doesn't help.
  useGSAP(
    () => {
      loopTlRef.current = null;
      if (!shouldLoop || reducedMotion()) return undefined;

      const cards = gsap.utils.toArray('.testimonial-card', viewportRef.current);
      if (cards.length === 0) return undefined;

      loopTlRef.current = horizontalLoop(cards, { repeat: -1, speed: 0.5, paddingRight: 24 });
      return undefined;
    },
    { scope: viewportRef, dependencies: [shouldLoop, loopedTestimonials], revertOnUpdate: true }
  );

  // Too few reviews to loop - a quiet fade/slide-up instead of the marquee,
  // playing once whenever this set of cards (re)appears.
  useGSAP(
    () => {
      if (shouldLoop || reducedMotion()) return undefined;
      const cards = gsap.utils.toArray('.testimonial-card', staticRowRef.current);
      if (cards.length === 0) return undefined;

      gsap.from(cards, { opacity: 0, y: 16, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
      return undefined;
    },
    { scope: staticRowRef, dependencies: [shouldLoop, baseTestimonials], revertOnUpdate: true }
  );

  const handleMouseEnter = () => {
    if (canHover) loopTlRef.current?.pause();
  };
  const handleMouseLeave = () => {
    if (canHover) loopTlRef.current?.play();
  };
  const handleTap = () => {
    if (!shouldLoop || canHover) return; // nothing to pause when static; desktop uses hover, not tap
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
          {usingPlaceholders && (
            <p className="font-['Poppins',sans-serif] mt-2 text-xs italic text-gray-400">
              Placeholder testimonials shown below — real customer reviews will replace these automatically once added.
            </p>
          )}
        </div>
      </div>

      <div
        ref={viewportRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTap}
        className="relative mt-10 w-full overflow-hidden py-2"
      >
        {/* Hidden, never-duplicated measuring row - purely to decide whether
            one set of cards already fills the viewport at least once. */}
        <div
          ref={measureRowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 flex w-max gap-6 px-4 opacity-0"
        >
          {baseTestimonials.map((t) => (
            <div key={t._key} className="h-px w-[280px] flex-shrink-0 sm:w-[340px]" />
          ))}
        </div>

        {shouldLoop ? (
          <div className="flex w-max gap-6 px-4">
            {loopedTestimonials.map((t) => (
              <Card key={t._loopKey} t={t} />
            ))}
          </div>
        ) : (
          <div ref={staticRowRef} className="flex flex-wrap justify-center gap-6 px-4">
            {baseTestimonials.map((t) => (
              <Card key={t._key} t={t} />
            ))}
          </div>
        )}
      </div>

      {shouldLoop && !canHover && (
        <p className="font-['Poppins',sans-serif] mt-3 text-center text-[11px] text-gray-400">
          {isPaused ? 'Tap again to resume scrolling' : 'Tap a card to pause'}
        </p>
      )}
    </section>
  );
};

export default TestimonialsSection;
