import React, { useEffect, useState, useMemo, useRef, useCallback, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import productService from '@/redux/slices/products/productService';
import categoryService from '@/redux/slices/categories/categoriesService';
import { getCategoryEmoji } from '@/utils/categoryEmoji';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { STATIC_CATEGORIES, STATIC_PRODUCTS } from '@/data/staticMenu';


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
      <img src="/brgrhut-logo.png" alt="" className="h-28 w-28 object-contain drop-shadow-lg sm:h-32 sm:w-32" />
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

// react-pageflip's mouseup/touchend handlers are attached to *window*
// unconditionally, with no check for what was clicked - a plain click on a
// button inside a page still reaches them, and since react-pageflip has no
// matching "start" gesture for it (see the pointer-events-none comment on
// TocRow below, which keeps it from ever seeing one), it falls through to
// "user tapped the page" and fires its own extra single-page flip on top of
// whatever the click's own handler just did. Stopping propagation on
// release keeps that event from ever reaching those window listeners.
// Needed on every clickable element placed inside a page (TOC rows below).
const stopBubble = (e) => e.stopPropagation();

// Small, icon-only jump back to the TOC page. Deliberately rendered as a
// single overlay OUTSIDE the book (see the wrapper around HTMLFlipBook)
// rather than as page content: react-pageflip's own wrapper re-clones every
// page element (via React.cloneElement with a brand-new ref callback) on
// every re-render - which happens after every flip, since onFlip updates
// state here - and that made a from-inside-a-page instance of this button
// unreliable specifically in single-page/portrait layout: the native click
// would fire and land on the right element, but React's onClick sometimes
// never ran for it. Living outside the book's children entirely sidesteps
// that whole mechanism. It also means it's no longer subject to
// react-pageflip's checkTarget()/mousedown-mousedown gesture handling (that
// only watches distElement, which this button now sits outside of), so it
// doesn't need the pointer-events-none/stopBubble treatment TocRow still
// does below.
const ReturnToTocButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Return to contents"
    title="Return to contents"
    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/85 text-primary shadow-sm ring-1 ring-primary/15 transition-colors hover:bg-white active:bg-orange-50"
  >
    <List className="h-3.5 w-3.5" />
  </button>
);

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

// --- Table of contents ---------------------------------------------------
// One row per category with a small representative thumbnail; tapping a row
// jumps the book straight to that category's divider page (see jumpToCategory
// in MenuBook). Sized independently from MenuItemRow's density math below -
// a TOC row has no price/description, so it can be more compact.
const TOC_IMAGE_SIZE = 40; // px
const TOC_ROW_HEIGHT = 52; // px - includes the row's own vertical padding
const TOC_ROW_GAP = 6; // px - gap between rows
const TOC_HEADER_HEIGHT = 40; // px - "Table of Contents" header row + spacing
const MIN_TOC_ROWS_PER_PAGE = 3;
const MAX_TOC_ROWS_PER_PAGE = 10;

const TocRow = ({ category, image, onJump }) => (
  <button
    type="button"
    onClick={onJump}
    onMouseUp={stopBubble}
    onTouchEnd={stopBubble}
    className="flex w-full flex-shrink-0 items-center gap-3 rounded-lg px-1 text-left transition-colors hover:bg-orange-50 active:bg-orange-100"
    style={{ height: TOC_ROW_HEIGHT }}
    aria-label={`Go to ${category.name}`}
  >
    {/* pointer-events-none on every child below: see the comment on
        ReturnToTocButton's icon - without it, a tap landing on the thumbnail,
        the emoji fallback, the name, or the chevron sets e.target to that
        child instead of this <button>, and react-pageflip's checkTarget()
        (a literal tagName check, no ancestor walk) fails to exclude it - on
        touch that means preventDefault() on touchstart, which kills the
        click outright. pointer-events:none is inherited, so it covers the
        <img> nested inside the thumbnail div too. */}
    <div
      className="pointer-events-none flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100 shadow-sm"
      style={{ height: TOC_IMAGE_SIZE, width: TOC_IMAGE_SIZE }}
    >
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <span className="text-lg leading-none">{getCategoryEmoji(category)}</span>
      )}
    </div>
    <span className="pointer-events-none min-w-0 flex-1 truncate font-['Poppins',sans-serif] text-sm font-bold capitalize text-stone-900">
      {category.name}
    </span>
    <ChevronRight className="pointer-events-none h-4 w-4 flex-shrink-0 text-stone-300" />
  </button>
);

const TocPage = forwardRef(({ entries, pageLabel, onJump }, ref) => (
  <Page ref={ref} className="menu-book-items">
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#fffaf3] px-5 py-5">
      <div className="relative mb-2.5 flex items-center border-b-2 border-primary/20 pb-1.5">
        <h3 className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Table of Contents
        </h3>
        {pageLabel && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Poppins',sans-serif] text-[10px] text-stone-400">
            {pageLabel}
          </span>
        )}
      </div>
      <div className="relative flex flex-1 flex-col justify-center gap-1.5 overflow-hidden">
        {entries.map(({ category, image }) => (
          <TocRow key={category._id} category={category} image={image} onJump={() => onJump(category._id)} />
        ))}
      </div>
    </div>
  </Page>
));
TocPage.displayName = 'TocPage';

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

const computeTocRowsPerPage = (pageHeight) => {
  const contentHeight = pageHeight - PAGE_PADDING_Y - TOC_HEADER_HEIGHT;
  const raw = Math.floor((contentHeight + TOC_ROW_GAP) / (TOC_ROW_HEIGHT + TOC_ROW_GAP));
  return Math.min(MAX_TOC_ROWS_PER_PAGE, Math.max(MIN_TOC_ROWS_PER_PAGE, raw));
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

const MenuItemRow = ({ product, category, columnWidth, fontsReady }) => {
  const hasDiscount = product.discountPercent > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;
  // '/placeholder.png' is a burger icon - fine as a generic fallback for a
  // burger-menu product missing a photo, but wrong for every other category
  // (wraps, pizzas, drinks...). Products with no real photo (all of the
  // static-menu items - see staticMenu.js) show their category's emoji
  // instead, matching the same fallback TocRow already uses.
  const realImage = product.picture?.secure_url || product.image || null;

  const titleFontSize = getTitleFontSize(product.title, columnWidth - PRICE_BLOCK_WIDTH, fontsReady);
  const descriptionFontSize = getDescriptionFontSize(product.description, columnWidth, fontsReady);

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100 shadow-sm"
        style={{ height: ROW_IMAGE_SIZE, width: ROW_IMAGE_SIZE }}
      >
        {realImage ? (
          <img
            src={realImage}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span className="text-2xl leading-none">{getCategoryEmoji(category)}</span>
        )}
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
              {product.priceLabel || `Rs. ${hasDiscount ? discountedPrice : product.price}`}
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
        <div className="relative mb-2.5 flex items-center border-b-2 border-primary/20 pb-1.5">
          <h3 className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.2em] text-primary">{category.name}</h3>
          {pageLabel && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Poppins',sans-serif] text-[10px] text-stone-400">
              {pageLabel}
            </span>
          )}
        </div>
        <div className="relative flex flex-1 flex-col justify-center gap-2 overflow-hidden">
          {items.map((product) => (
            <MenuItemRow key={product._id} product={product} category={category} columnWidth={columnWidth} fontsReady={fontsReady} />
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
  const [state, setState] = useState({ width: 420, height: 600, isSpread: false, itemsPerPage: 5, tocRowsPerPage: 6 });

  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isPhone = vw < 640;
      // Spread (two-page, open-book) layout is reserved for desktop/laptop
      // widths specifically - phones and tablets, portrait or landscape,
      // always get a single page. Orientation alone can't be the signal
      // here: a landscape tablet (e.g. 1194px) is wider than it is tall,
      // same as a laptop, so "wide beats tall" used to put it in spread
      // mode too. 1280px (Tailwind's `xl`) is comfortably above the widest
      // common tablet landscape width (iPad Pro 11" is 1194px) and at or
      // below the narrowest common laptop viewport.
      const isSpread = vw >= 1280;

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
        tocRowsPerPage: computeTocRowsPerPage(height),
      });
    };

    // react-pageflip's underlying engine (page-flip) reparents every page's
    // real DOM node into its own internally-created wrapper div, invisible to
    // React's fiber tree, which still believes each page is a direct child
    // of the container we render. That's normally harmless - the library's
    // own reactive update path settles cleanly before anything else touches
    // the tree - but a second resize-driven update arriving while the first
    // one (especially the isSpread-crossing full remount below, via `key`)
    // is still mid-flight lets React's reconciliation and the library's own
    // DOM state disagree about who owns which node, throwing
    // "NotFoundError: removeChild/insertBefore ... not a child of this node"
    // and crashing the whole page (this component's nearest error boundary
    // is the top-level one wrapping all of Home). Debouncing guarantees a
    // minimum spacing between actual layout recomputations - and therefore
    // between HTMLFlipBook remounts/updates - regardless of how bursty the
    // raw resize events are, so the engine always gets a clean settle
    // window. 500ms is comfortably above the ~350ms gap that was enough to
    // reproduce the crash in testing.
    compute();
    let debounceId = null;
    const debouncedCompute = () => {
      clearTimeout(debounceId);
      debounceId = setTimeout(compute, 500);
    };
    window.addEventListener('resize', debouncedCompute);
    return () => {
      clearTimeout(debounceId);
      window.removeEventListener('resize', debouncedCompute);
    };
  }, []);

  return state;
};

const MenuBook = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef(null);
  const sectionRef = useRef(null);
  const { width, height, isSpread, itemsPerPage, tocRowsPerPage } = useResponsiveBookSize();
  const fontsReady = useFontsReady();
  useScrollReveal(sectionRef);

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
        
        const fetchedCategories = Array.isArray(catRes?.data) ? catRes.data : [];
        const fetchedProducts = Array.isArray(prodRes?.data) ? prodRes.data : [];

        setCategories([...fetchedCategories, ...STATIC_CATEGORIES]);
        setProducts([...fetchedProducts, ...STATIC_PRODUCTS]);
      } catch {
        if (!cancelled) {
          setCategories([...STATIC_CATEGORIES]);
          setProducts([...STATIC_PRODUCTS]);
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

  const { pages, categoryPageIndex, tocPageIndex } = useMemo(() => {
    // Build the category/item pages first, tracking each category's divider
    // page position within this sub-list. Real absolute indices (accounting
    // for however many TOC pages end up in front of it) get resolved once
    // that count is known below - a TOC row jumping to the wrong page is
    // exactly the kind of off-by-N bug that comes from computing this in
    // two places instead of one.
    const rest = [];
    const dividerIndexByCategory = new Map();

    sections.forEach(({ category, items }) => {
      dividerIndexByCategory.set(category._id, rest.length);
      rest.push({ type: 'divider', category, itemCount: items.length });
      const chunkCount = Math.ceil(items.length / itemsPerPage);
      for (let i = 0; i < items.length; i += itemsPerPage) {
        rest.push({
          type: 'items',
          category,
          items: items.slice(i, i + itemsPerPage),
          pageLabel: `${Math.floor(i / itemsPerPage) + 1} / ${chunkCount}`,
        });
      }
    });

    // Table of contents: one row per category with a representative image,
    // paginated the same way item pages are so a long category list can't
    // silently overflow a page.
    const tocPages = [];
    const tocPageCount = Math.ceil(sections.length / tocRowsPerPage) || 0;
    for (let i = 0; i < sections.length; i += tocRowsPerPage) {
      const chunk = sections.slice(i, i + tocRowsPerPage);
      tocPages.push({
        type: 'toc',
        pageLabel: tocPageCount > 1 ? `${tocPages.length + 1} / ${tocPageCount}` : null,
        entries: chunk.map(({ category, items }) => ({
          category,
          image: category.picture?.secure_url || items[0]?.picture?.secure_url || items[0]?.image || null,
        })),
      });
    }

    const result = [{ type: 'cover' }, ...tocPages, ...rest, { type: 'back-cover' }];

    const offset = 1 + tocPages.length;
    const resolvedIndex = new Map();
    dividerIndexByCategory.forEach((idx, catId) => resolvedIndex.set(catId, idx + offset));

    // Cover is always index 0, so the (first) TOC page is always right after
    // it - findIndex here instead of a bare `1` just keeps this
    // self-documenting and safe if that ever changes.
    const tocPageIndex = result.findIndex((p) => p.type === 'toc');

    return { pages: result, categoryPageIndex: resolvedIndex, tocPageIndex };
  }, [sections, itemsPerPage, tocRowsPerPage]);

  // The book remounts (via `key`, see below) whenever isSpread flips or the
  // total page count changes, which resets the underlying engine to its
  // first page - keep our own counter in sync.
  useEffect(() => {
    setCurrentPage(0);
  }, [isSpread, pages.length]);

  // Jumps straight to a category's divider page with a single flip
  // animation - confirmed via the page-flip engine's own source (Flip.ts
  // flipToPage): it repositions instantly to just before the target, then
  // plays one flip landing on it, rather than stepping through every page
  // in between.
  const jumpToCategory = useCallback((categoryId) => {
    const targetIndex = categoryPageIndex.get(categoryId);
    if (targetIndex == null) return;
    bookRef.current?.pageFlip()?.flip(targetIndex);
  }, [categoryPageIndex]);

  // Same jump mechanism, aimed backward at the TOC instead of a category -
  // shown on every category/item page so a reader never has to manually
  // flip back through everything they've already passed.
  const returnToToc = useCallback(() => {
    if (tocPageIndex < 0) return;
    bookRef.current?.pageFlip()?.flip(tocPageIndex);
  }, [tocPageIndex]);

  const handleFlip = useCallback((e) => {
    setCurrentPage(e.data);
  }, []);

  const goNext = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);
  const goPrev = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);

  // currentPage is always the lower-indexed page of whatever's on screen -
  // the single page in portrait mode, or the left half of a spread in
  // landscape mode (its right half, if any, is currentPage + 1).
  const showReturnToToc =
    ['divider', 'items'].includes(pages[currentPage]?.type) ||
    (isSpread && ['divider', 'items'].includes(pages[currentPage + 1]?.type));

  return (
    <section ref={sectionRef} id="menu" className="w-full scroll-mt-14 bg-white py-16 sm:scroll-mt-16 sm:py-20">
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

                {/* HTMLFlipBook's "stretch" sizing measures its own parent's
                    real width and stretches to fill it (capped by maxWidth
                    below) - wrapping it in a plain div with no size of its
                    own turns that into a circular reference (the wrapper
                    has no width until its content does, and the book won't
                    take a width until the wrapper does), which collapses
                    the whole thing down to react-pageflip's bare minimum.
                    Sizing the wrapper explicitly from the same width/height
                    state driving the book itself breaks that cycle - in
                    spread mode the rendered book is exactly two pages wide
                    (confirmed empirically, no extra gap), so *2 here. */}
                <div className="relative" style={{ width: isSpread ? width * 2 : width, height }}>
                  <HTMLFlipBook
                    // Two distinct reasons this key needs both isSpread AND
                    // pages.length, not just isSpread:
                    //
                    // 1. react-pageflip only constructs its underlying engine
                    //    once and never re-applies changed size/minWidth
                    //    props - keying on the layout mode forces a clean
                    //    remount (with correct settings) if the viewport
                    //    crosses the single/spread breakpoint, e.g. an iPad
                    //    being rotated mid-session.
                    //
                    // 2. More importantly: react-pageflip's own children-diff
                    //    effect updates an already-mounted book via
                    //    updateFromHtml(), which reparents page DOM nodes into
                    //    its own internal wrapper - a mutation invisible to
                    //    React's fiber tree. The FIRST such update per mount
                    //    is harmless, but confirmed by direct reproduction:
                    //    the moment the page *count* needs to change again on
                    //    an already-mounted book (any resize that shifts
                    //    itemsPerPage/tocRowsPerPage enough to add or remove
                    //    pages - no rapid succession or racing needed, a
                    //    single isolated resize reliably triggers it), React
                    //    tries to insert/remove a page's DOM node relative to
                    //    a sibling reference that's no longer actually there,
                    //    throwing "NotFoundError: removeChild/insertBefore
                    //    ... not a child of this node" and crashing the whole
                    //    page via the top-level error boundary. Including
                    //    pages.length here forces a full remount (through the
                    //    safe, fresh loadFromHTML path) instead, every time
                    //    the page count would otherwise change.
                    key={`${isSpread ? 'spread' : 'single'}-${pages.length}`}
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
                    // Without this, react-pageflip's own children-tracking effect
                    // calls setPages() - which destructively rebuilds its internal
                    // DOM (innerHTML="" + re-append) via updateFromHtml - on EVERY
                    // single re-render of this component, including every page
                    // flip, not just when the actual page set changes (confirmed by
                    // instrumenting the library directly). That's the library's own
                    // documented flag for gating that rebuild to real page-count
                    // changes only.
                    renderOnlyPageLengthChange
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
                      if (page.type === 'toc') {
                        return (
                          <TocPage
                            key={`toc-${idx}`}
                            entries={page.entries}
                            pageLabel={page.pageLabel}
                            onJump={jumpToCategory}
                          />
                        );
                      }
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

                  {/* Rendered outside the book on purpose - see the note above
                      returnToToc. Its visibility tracks whichever page(s) are
                      currently on-screen (both halves of a spread, or just the
                      one page in single mode). */}
                  {showReturnToToc && (
                    <div className="absolute right-3 top-3 z-20">
                      <ReturnToTocButton onClick={returnToToc} />
                    </div>
                  )}
                </div>

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
