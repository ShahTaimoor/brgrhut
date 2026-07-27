import { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import { useCanHover } from '@/hooks/useCanHover';

const MotionImg = motion.img;

// To switch from the animated-image placeholder to a real looping video
// background, just set HERO_VIDEO_SRC to a video file/URL (e.g. '/hero.mp4')
// — the component will automatically render a <video> instead of the image.
const HERO_VIDEO_SRC = '/hero-video.mp4';
const HERO_IMAGE_SRC =
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80';

const HeroSection = () => {
  const contentRef = useRef(null);
  const brandRef = useRef(null);
  const taglineRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const canHover = useCanHover();

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });
      tl.from(brandRef.current, { opacity: 0, y: 24 })
        .from(taglineRef.current, { opacity: 0, y: 20 }, '-=0.35')
        .from(descRef.current, { opacity: 0, y: 20 }, '-=0.35')
        .from(ctaRef.current, { opacity: 0, y: 20 }, '-=0.35');

      return () => tl.kill();
    },
    { scope: contentRef }
  );

  const handleCtaEnter = (e) => {
    if (!canHover) return;
    gsap.to(e.currentTarget, { scale: 1.05, y: -2, duration: 0.25, ease: 'power2.out' });
  };
  const handleCtaLeave = (e) => {
    if (!canHover) return;
    gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.25, ease: 'power2.out' });
  };

  return (
    <section
      id="home"
      className="relative flex h-[85vh] min-h-[520px] w-full scroll-mt-14 items-center justify-center overflow-hidden sm:scroll-mt-16"
    >
      <div className="absolute inset-0">
        {HERO_VIDEO_SRC ? (
          <video
            className="h-full w-full object-cover"
            src={HERO_VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <MotionImg
            src={HERO_IMAGE_SRC}
            alt="Flame grilled burgers"
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        )}
        {/* Solid dark overlay for text contrast — no gradient */}
        <div className="absolute inset-0 bg-stone-950/55" />
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
        <div ref={brandRef}>
          <p className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.3em] text-orange-300">Welcome to</p>
          <h1 className="font-['Fredoka',sans-serif] mt-3 text-5xl font-extrabold tracking-tight sm:text-7xl">brgrhut</h1>
        </div>
        <p ref={taglineRef} className="font-['Fredoka',sans-serif] mt-4 text-sm uppercase tracking-[0.25em] text-orange-200 sm:text-base">
          Flame Grilled Burgers
        </p>
        <p ref={descRef} className="font-['Poppins',sans-serif] mx-auto mt-6 max-w-xl text-sm text-white/85 sm:text-base">
          Smoky, flame-grilled goodness — handcrafted burgers, crispy golden fries, and gourmet
          pizzas made with fresh ingredients daily.
        </p>
        <div ref={ctaRef} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#menu"
            onMouseEnter={handleCtaEnter}
            onMouseLeave={handleCtaLeave}
            className="font-['Poppins',sans-serif] inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40"
          >
            View Menu
          </a>
          <a
            href="#contact"
            onMouseEnter={handleCtaEnter}
            onMouseLeave={handleCtaLeave}
            className="font-['Poppins',sans-serif] inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
