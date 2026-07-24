import React, { useEffect, useState, useMemo, useRef, useCallback, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import productService from '@/redux/slices/products/productService';
import categoryService from '@/redux/slices/categories/categoriesService';
import { getCategoryEmoji } from '@/utils/categoryEmoji';

// Canvas text measurement (used below to fit title/description font sizes)
// reads whatever font is *actually* loaded at the moment it runs - if
// Poppins hasn't finished downloading yet, the browser silently measures
// with a fallback font instead, which renders narrower than real Poppins
// and made the fit calculation pick sizes that then overflowed once the
// real font swapped in. Gating on this ensures every size decision is made
// against the real font's metrics.
const useFontsReady = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) {
      setReady(true);
      return undefined;
    }
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, []);
  return ready;
};

// A page in the book is a plain full-bleed sheet - react-pageflip needs a ref on every page
const Page = forwardRef(({ className = '', children }, ref) => (
  <div ref={ref} className={`menu-book-page ${className}`}>
    {children}
  </div>
));
Page.displayName = 'Page';

const CoverPage = forwardRef((_, ref) => (
  <Page ref={ref} className="menu-book-cover">
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-stone-900 via-stone-950 to-black px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/40 sm:h-20 sm:w-20">
        <span className="text-3xl sm:text-4xl">🍔</span>
      </div>
      <h1 className="font-['Fredoka',sans-serif] text-4xl font-extrabold tracking-tight text-white sm:text-5xl">brgrhut</h1>
      <p className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.3em] text-primary sm:text-sm">Flame Grilled Burgers</p>
      <div className="mt-6 h-px w-16 bg-primary/40" />
      <p className="font-['Fredoka',sans-serif] mt-6 text-lg font-semibold uppercase tracking-[0.35em] text-white/70 sm:text-xl">Our Menu</p>
    </div>
  </Page>
));
CoverPage.displayName = 'CoverPage';

const BackCoverPage = forwardRef((_, ref) => (
  <Page ref={ref} className="menu-book-cover">
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-stone-900 via-stone-950 to-black px-8 text-center">
      <span className="text-3xl sm:text-4xl">🔥</span>
      <p className="font-['Fredoka',sans-serif] text-lg font-bold text-white sm:text-xl">Thank You</p>
      <p className="font-['Poppins',sans-serif] max-w-[240px] text-xs leading-relaxed text-white/60 sm:text-sm">
        Smoky, handcrafted, made to order — every single time.
      </p>
      <div className="mt-4 h-px w-16 bg-primary/40" />
      <p className="font-['Fredoka',sans-serif] text-[11px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">brgrhut</p>
    </div>
  </Page>
));
BackCoverPage.displayName = 'BackCoverPage';

const CategoryDividerPage = forwardRef(({ category, itemCount }, ref) => (
  <Page ref={ref} className="menu-book-divider">
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-orange-50 px-8 text-center">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle, #ea580c 1.5px, transparent 1.5px)',
        backgroundSize: '18px 18px',
      }} />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md sm:h-24 sm:w-24">
        <span className="text-4xl sm:text-5xl">{getCategoryEmoji(category)}</span>
      </div>
      <h2 className="font-['Fredoka',sans-serif] relative text-2xl font-extrabold capitalize tracking-tight text-stone-900 sm:text-3xl">
        {category.name}
      </h2>
      <p className="font-['Fredoka',sans-serif] relative text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>
    </div>
  </Page>
));
CategoryDividerPage.displayName = 'CategoryDividerPage';

// --- Card + density constants -----------------------------------------
// One source of truth: the row's real height is fully determined by these
// numbers (not measured, not guessed per-device), and computeItemsPerPage
// below derives density directly from them. Change the card design here
// and the density math follows automatically - no per-device tuning needed.
const ROW_IMAGE_SIZE = 60; // px - MenuItemRow's image box, fixed on every device
const ROW_IMAGE_GAP = 10; // px - gap-2.5 between the image and text column
const ROW_GAP = 8; // px - gap-2 between rows in ItemsPage's item list
const PAGE_PADDING_X = 40; // px - ItemsPage's px-5 left+right
const PAGE_PADDING_Y = 40; // px - ItemsPage's py-5 top+bottom
const PAGE_HEADER_HEIGHT = 32; // px - category/page-label header row + its spacing
const MIN_ITEMS_PER_PAGE = 3;
// Soft ceiling: several tiers (tall tablet-portrait, big desktops) could
// technically fit 9-11 rows, but that reads as a dense list, not a menu.
// Capping keeps every device feeling like the same curated page.
const MAX_ITEMS_PER_PAGE = 7;

// Title now wraps to 2 lines instead of truncating (a dish name should
// never be cut off), so an unusually long name can make one row taller
// than the image-height baseline every other row uses. Wrapping is far
// more likely on a narrow single-page phone (a ~230px text column) than on
// a wide tablet/desktop spread (400px+), so only the narrow case reserves
// extra headroom - wider tiers have enough natural column width that even
// a long name stays on one line, so they don't need to give up density.
const TITLE_WRAP_BUFFER_NARROW = 40;

const computeItemsPerPage = (pageHeight, isNarrow) => {
  const buffer = isNarrow ? TITLE_WRAP_BUFFER_NARROW : 0;
  const contentHeight = pageHeight - PAGE_PADDING_Y - PAGE_HEADER_HEIGHT - buffer;
  const raw = Math.floor((contentHeight + ROW_GAP) / (ROW_IMAGE_SIZE + ROW_GAP));
  return Math.min(MAX_ITEMS_PER_PAGE, Math.max(MIN_ITEMS_PER_PAGE, raw));
};

// Fitting text into a fixed 2-line box needs to know the actual column
// width, not just the text length - the same 100-character description
// fits fine at 2 lines on a wide desktop column but needs a smaller font on
// a narrow phone column. An average character-width guess (e.g. "0.5x the
// font size") turned out too unreliable in practice - real Poppins glyphs
// and word-boundary line breaks don't average out that cleanly. Instead
// this measures the text's *actual* rendered width via Canvas, which reads
// the browser's real font metrics for this exact string.
let measureCtx = null;
const getMeasureContext = () => {
  if (!measureCtx && typeof document !== 'undefined') {
    measureCtx = document.createElement('canvas').getContext('2d');
  }
  return measureCtx;
};

// Simulates the same greedy word-wrap browsers use, to count how many
// lines `text` actually takes at `fontSizePx` within `columnWidth`. This
// reads real measured word widths rather than approximating from an
// average character width or a guessed "wrap slack" factor - both turned
// out too imprecise (off by enough to still overflow in some real cases).
const countWrappedLines = (text, fontSizePx, weight, columnWidth) => {
  const ctx = getMeasureContext();
  ctx.font = `${weight} ${fontSizePx}px 'Poppins', sans-serif`;
  const spaceWidth = ctx.measureText(' ').width;
  let lines = 1;
  let currentWidth = 0;
  for (const word of text.split(' ')) {
    const wordWidth = ctx.measureText(word).width;
    const withWord = currentWidth === 0 ? wordWidth : currentWidth + spaceWidth + wordWidth;
    if (withWord > columnWidth && currentWidth > 0) {
      lines += 1;
      currentWidth = wordWidth;
    } else {
      currentWidth = withWord;
    }
  }
  return lines;
};

// Tries every size from max down to min and returns the largest one that
// still wraps `text` into 2 lines or fewer - i.e. the biggest, most
// readable size that avoids an ellipsis. If even `min` needs a 3rd line,
// `min` is still returned (line-clamp's ellipsis becomes the deliberate
// last resort for that genuinely-too-long case, at the smallest, most
// space-efficient size rather than a larger one that fits even less).
//
// Until fontsReady, Poppins may not have finished loading, so measuring now
// would read a fallback font's different metrics. Returning `min` for that
// brief window is the safe choice - worst case text is a touch smaller
// than necessary for one paint, never larger than what's actually there.
const fitFontSize = (text, columnWidth, { min, max, weight, fontsReady }) => {
  if (!text || !columnWidth) return max;
  if (!fontsReady) return min;
  const ctx = getMeasureContext();
  if (!ctx) return max;
  for (let size = max; size >= min; size -= 0.5) {
    if (countWrappedLines(text, size, weight, columnWidth) <= 2) return size;
  }
  return min;
};

// 8px is the legibility floor - on the narrowest phones, a description long
// enough to still need more than that (a real but infrequent case: a few
// current items run 120-131 characters) falls back to line-clamp's own
// ellipsis rather than shrinking further. That's a deliberate choice: an
// occasional ellipsis on the smallest screens reads better than text small
// enough to strain to read.
const getDescriptionFontSize = (description, columnWidth, fontsReady) =>
  fitFontSize(description, columnWidth, { min: 8, max: 11, weight: 400, fontsReady });

// Title shares its line with the price block, so callers pass a narrower
// effective columnWidth for it.
const getTitleFontSize = (title, columnWidth, fontsReady) =>
  fitFontSize(title, columnWidth, { min: 10, max: 13, weight: 700, fontsReady });

// Image sits beside title+price and a 2-line-clamped description, instead of
// a full-width row with description below - roughly halves the vertical
// footprint per item versus stacking, which is what makes the higher
// density above possible without shrinking anything to be unreadable.
// The description clamp (never more than 2 lines, ellipsis beyond that) is
// what makes row height fixed and predictable - the actual lever that lets
// computeItemsPerPage() guarantee a page never overflows.
// Price block is a fixed, narrow width regardless of discount (see below),
// so title's effective column is the row's full width minus this estimate.
const PRICE_BLOCK_WIDTH = 58;

const MenuItemRow = ({ product, columnWidth, fontsReady }) => {
  const hasDiscount = product.discountPercent > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;
  const image = product.picture?.secure_url || product.image || '/placeholder.png';

  const titleFontSize = getTitleFontSize(product.title, columnWidth - PRICE_BLOCK_WIDTH, fontsReady);
  const descriptionFontSize = getDescriptionFontSize(product.description, columnWidth, fontsReady);

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex-shrink-0 overflow-hidden rounded-lg bg-stone-100 shadow-sm"
        style={{ height: ROW_IMAGE_SIZE, width: ROW_IMAGE_SIZE }}
      >
        <img
          src={image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => { if (e.target.src.indexOf('/placeholder.png') === -1) e.target.src = '/placeholder.png'; }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          {/* The dish name is what a customer orders by - wrapping to a
              second line (rather than truncating) keeps it fully readable.
              Its font size is fit to the actual column width so line-clamp-2
              only ever falls back to an ellipsis for a name long enough to
              need a third line even at the smallest legible size - which no
              real dish name should. min-w-0 + flex-1 guarantee title always
              gets the same available width regardless of the price block. */}
          <h3
            className="line-clamp-2 min-w-0 flex-1 font-['Poppins',sans-serif] font-bold capitalize leading-snug text-stone-900"
            style={{ fontSize: titleFontSize }}
          >
            {product.title}
          </h3>
          {/* Discount price stacks (current above original) instead of
              sitting side by side - a side-by-side pair is roughly twice as
              wide as a single price, which was eating into the title's
              width and triggering ellipsis specifically on discounted
              items. Stacked, the price block is the same narrow width
              whether or not there's a discount. */}
          <div className="flex flex-shrink-0 flex-col items-end" style={{ width: PRICE_BLOCK_WIDTH }}>
            <span className={`w-full text-right font-['Poppins',sans-serif] text-[13px] font-extrabold leading-none ${hasDiscount ? 'text-primary' : 'text-stone-900'}`}>
              Rs. {hasDiscount ? discountedPrice : product.price}
            </span>
            {hasDiscount && (
              <span className="mt-0.5 w-full text-right font-['Poppins',sans-serif] text-[9px] leading-none text-stone-400 line-through">
                Rs. {product.price}
              </span>
            )}
          </div>
        </div>
        {product.description && (
          <p
            className="mt-0.5 line-clamp-2 font-['Poppins',sans-serif] leading-tight text-stone-500"
            style={{ fontSize: descriptionFontSize }}
          >
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
};

const ItemsPage = forwardRef(({ category, items, pageLabel, pageWidth, fontsReady }, ref) => {
  // react-pageflip's engine resolves each page's real rendered width from
  // its own internal container-measurement chain, which turned out not to
  // match our `pageWidth` state exactly (the same class of discrepancy the
  // book's own sizing had - see useResponsiveBookSize). Rather than trying
  // to predict that chain, measure this page's actual content box directly;
  // it's what determines the true available text-column width regardless
  // of how the engine got there.
  const contentRef = useRef(null);
  const [measuredWidth, setMeasuredWidth] = useState(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return undefined;
    const update = () => {
      setMeasuredWidth(el.clientWidth);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const effectiveWidth = measuredWidth || pageWidth;
  const columnWidth = effectiveWidth - PAGE_PADDING_X - ROW_IMAGE_SIZE - ROW_IMAGE_GAP;

  return (
    <Page ref={ref} className="menu-book-items">
      <div ref={contentRef} className="relative flex h-full w-full flex-col overflow-hidden bg-[#fffaf3] px-5 py-5">
        {/* A page with fewer items than the density cap (or the cap itself,
            on a page tall enough to fit more than we choose to show) leaves
            room below the list. Centering the list vertically - plus a large,
            faint category watermark behind it - reads as a deliberate,
            composed page instead of one that simply ran out of content. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span
            className="select-none leading-none opacity-[0.05]"
            style={{ fontSize: Math.round(effectiveWidth * 0.6) }}
          >
            {getCategoryEmoji(category)}
          </span>
        </div>
        <div className="relative mb-2.5 flex items-center justify-between border-b-2 border-primary/20 pb-1.5">
          <h3 className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.2em] text-primary">{category.name}</h3>
          <span className="font-['Poppins',sans-serif] text-[10px] text-stone-400">{pageLabel}</span>
        </div>
        <div className="relative flex flex-1 flex-col justify-center gap-2 overflow-hidden">
          {items.map((product) => (
            <MenuItemRow key={product._id} product={product} columnWidth={columnWidth} fontsReady={fontsReady} />
          ))}
        </div>
      </div>
    </Page>
  );
});
ItemsPage.displayName = 'ItemsPage';

// Book aspect ratio (width:height) for a single page, close to a real menu
const PAGE_ASPECT_RATIO = 0.7;

// One formula for every device: a single full-width page below 640px or in
// portrait, a two-page spread in any landscape-oriented viewport at or
// above it. Only the "chrome" budget (how much room nav controls / margins
// take) differs by case; the size and density math itself doesn't branch.
const useResponsiveBookSize = () => {
  const [state, setState] = useState({ width: 420, height: 600, isSpread: false, itemsPerPage: 5 });

  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isPhone = vw < 640;
      const isSpread = !isPhone && vw > vh;

      const heightBudget = vh - (isPhone ? 320 : isSpread ? 220 : 260);
      const heightCandidate = Math.max(420, Math.min(heightBudget, 860));

      const horizontalChrome = isPhone ? 48 : isSpread ? 200 : 64;
      const widthBudget = (vw - horizontalChrome) / (isSpread ? 2 : 1);

      // Solve at the exact page aspect ratio so whichever budget is
      // tighter (width or height) shrinks the page without distorting it.
      const width = Math.max(300, Math.min(heightCandidate * PAGE_ASPECT_RATIO, widthBudget));
      const height = width / PAGE_ASPECT_RATIO;

      setState({
        width: Math.round(width),
        height: Math.round(height),
        isSpread,
        itemsPerPage: computeItemsPerPage(height, isPhone),
      });
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return state;
};

const MenuBook = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef(null);
  const { width, height, isSpread, itemsPerPage } = useResponsiveBookSize();
  const fontsReady = useFontsReady();

  // The book remounts (via `key`) when isSpread flips, which resets the
  // underlying engine to its first page - keep our own counter in sync.
  useEffect(() => {
    setCurrentPage(0);
  }, [isSpread]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryService.getAllCat(''),
          productService.allProduct('all', 1, 'all', 'active', 'az'),
        ]);
        if (cancelled) return;
        setCategories(Array.isArray(catRes?.data) ? catRes.data : []);
        setProducts(Array.isArray(prodRes?.data) ? prodRes.data : []);
      } catch {
        if (!cancelled) {
          setCategories([]);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const sections = useMemo(() => {
    const byCategory = new Map();
    products.forEach((product) => {
      const catId = product.category?._id || product.category;
      if (!catId) return;
      if (!byCategory.has(catId)) byCategory.set(catId, []);
      byCategory.get(catId).push(product);
    });

    return categories
      .filter((cat) => byCategory.has(cat._id) && byCategory.get(cat._id).length > 0)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || a.name.localeCompare(b.name))
      .map((cat) => ({ category: cat, items: byCategory.get(cat._id) }));
  }, [categories, products]);

  const pages = useMemo(() => {
    const result = [{ type: 'cover' }];

    sections.forEach(({ category, items }) => {
      result.push({ type: 'divider', category, itemCount: items.length });
      const chunkCount = Math.ceil(items.length / itemsPerPage);
      for (let i = 0; i < items.length; i += itemsPerPage) {
        result.push({
          type: 'items',
          category,
          items: items.slice(i, i + itemsPerPage),
          pageLabel: `${Math.floor(i / itemsPerPage) + 1} / ${chunkCount}`,
        });
      }
    });

    result.push({ type: 'back-cover' });
    return result;
  }, [sections, itemsPerPage]);

  const handleFlip = useCallback((e) => {
    setCurrentPage(e.data);
  }, []);

  const goNext = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);
  const goPrev = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);

  return (
    <section id="menu" className="w-full scroll-mt-14 bg-white py-16 sm:scroll-mt-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.25em] text-primary">The Full Menu</p>
          <h2 className="font-['Fredoka',sans-serif] mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Our Menu
          </h2>
        </div>

        <div className="mt-10 flex flex-col items-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-primary" />
              <p className="font-['Poppins',sans-serif] text-sm text-gray-500">Preparing the menu...</p>
            </div>
          ) : pages.length <= 2 ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <p className="font-['Poppins',sans-serif] text-lg font-semibold text-gray-900">Menu coming soon</p>
              <p className="font-['Poppins',sans-serif] text-sm text-gray-500">No menu items are published yet.</p>
            </div>
          ) : (
            <>
              <div className="flex w-full items-center justify-center gap-3 sm:gap-8">
                {isSpread && (
                  <button
                    onClick={goPrev}
                    disabled={currentPage === 0}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-md transition-all hover:bg-stone-800 disabled:opacity-20"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                <HTMLFlipBook
                  // react-pageflip only constructs its underlying engine once
                  // and never re-applies changed size/minWidth props - keying
                  // on the layout mode forces a clean remount (with correct
                  // settings) if the viewport crosses the single/spread
                  // breakpoint, e.g. an iPad being rotated mid-session.
                  key={isSpread ? 'spread' : 'single'}
                  ref={bookRef}
                  width={width}
                  height={height}
                  size="stretch"
                  // Forces the engine's own single-page/two-page decision to
                  // agree with `isSpread` instead of it re-deriving orientation
                  // from the real container width on its own (which is what
                  // caused portrait tablets to get squeezed into a two-up
                  // layout `isSpread` never asked for).
                  minWidth={isSpread ? 280 : width}
                  // In "stretch" mode, width/height only set the page's
                  // aspect ratio - the real pixel size comes from the actual
                  // container width, uncapped unless maxWidth reins it in.
                  maxWidth={width}
                  minHeight={420}
                  maxHeight={900}
                  showCover
                  maxShadowOpacity={0.5}
                  flippingTime={700}
                  mobileScrollSupport={false}
                  swipeDistance={20}
                  className="menu-flipbook shadow-2xl"
                  onFlip={handleFlip}
                >
                  {pages.map((page, idx) => {
                    if (page.type === 'cover') return <CoverPage key="cover" />;
                    if (page.type === 'back-cover') return <BackCoverPage key="back-cover" />;
                    if (page.type === 'divider') {
                      return (
                        <CategoryDividerPage
                          key={`divider-${page.category._id}`}
                          category={page.category}
                          itemCount={page.itemCount}
                        />
                      );
                    }
                    return (
                      <ItemsPage
                        key={`items-${page.category._id}-${idx}`}
                        category={page.category}
                        items={page.items}
                        pageLabel={page.pageLabel}
                        pageWidth={width}
                        fontsReady={fontsReady}
                      />
                    );
                  })}
                </HTMLFlipBook>

                {isSpread && (
                  <button
                    onClick={goNext}
                    disabled={currentPage >= pages.length - 1}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-md transition-all hover:bg-stone-800 disabled:opacity-20"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Nav controls for single-page layouts (phones + portrait tablets) */}
              {!isSpread && (
                <div className="mt-6 flex items-center gap-6">
                  <button
                    onClick={goPrev}
                    disabled={currentPage === 0}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white shadow-md disabled:opacity-20"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="font-['Poppins',sans-serif] text-xs text-gray-400">{currentPage + 1} / {pages.length}</span>
                  <button
                    onClick={goNext}
                    disabled={currentPage >= pages.length - 1}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white shadow-md disabled:opacity-20"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              <p className="font-['Poppins',sans-serif] mt-4 text-xs text-gray-400">Drag a corner or use the arrows to turn the page</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuBook;
