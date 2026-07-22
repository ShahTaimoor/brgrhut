import { motion } from 'framer-motion';

const MotionImg = motion.img;

// To switch from the animated-image placeholder to a real looping video
// background, just set HERO_VIDEO_SRC to a video file/URL (e.g. '/hero.mp4')
// — the component will automatically render a <video> instead of the image.
const HERO_VIDEO_SRC = null;
const HERO_IMAGE_SRC =
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80';

const HeroSection = () => {
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

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">Welcome to</p>
        <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-7xl">brgrhut</h1>
        <p className="mt-4 text-sm uppercase tracking-[0.25em] text-orange-200 sm:text-base">
          Flame Grilled Burgers
        </p>
        <p className="mx-auto mt-6 max-w-xl text-sm text-white/85 sm:text-base">
          Smoky, flame-grilled goodness — handcrafted burgers, crispy golden fries, and gourmet
          pizzas made with fresh ingredients daily.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#menu"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40"
          >
            View Menu
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
