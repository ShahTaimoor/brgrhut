import React, { useEffect, useState, useMemo, useRef, useCallback, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import productService from '@/redux/slices/products/productService';
import categoryService from '@/redux/slices/categories/categoriesService';
import { getCategoryEmoji } from '@/utils/categoryEmoji';

// 2 per page leaves each item enough room to show its full description without
// truncation (some run 200+ characters) while still looking like a proper menu page
const ITEMS_PER_PAGE = 2;

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

const MenuItemRow = ({ product }) => {
  const hasDiscount = product.discountPercent > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;
  const image = product.picture?.secure_url || product.image || '/placeholder.png';

  return (
    <div className="flex flex-col gap-2 border-b border-stone-200/70 pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100 shadow-sm sm:h-16 sm:w-16">
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => { if (e.target.src.indexOf('/placeholder.png') === -1) e.target.src = '/placeholder.png'; }}
          />
        </div>
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-['Poppins',sans-serif] text-sm font-bold capitalize leading-snug text-stone-900 sm:text-base">{product.title}</h3>
            {hasDiscount && (
              <span className="font-['Poppins',sans-serif] mt-1 inline-block rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white sm:text-[10px]">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>
          {hasDiscount ? (
            <div className="flex flex-shrink-0 flex-col items-end">
              <span className="font-['Poppins',sans-serif] text-sm font-extrabold text-primary sm:text-base">Rs. {discountedPrice}</span>
              <span className="font-['Poppins',sans-serif] text-[10px] text-stone-400 line-through sm:text-xs">Rs. {product.price}</span>
            </div>
          ) : (
            <span className="font-['Poppins',sans-serif] flex-shrink-0 text-sm font-extrabold text-stone-900 sm:text-base">Rs. {product.price}</span>
          )}
        </div>
      </div>
      {product.description && (
        <p className="font-['Poppins',sans-serif] text-[11px] leading-relaxed text-stone-500 sm:text-xs">{product.description}</p>
      )}
    </div>
  );
};

const ItemsPage = forwardRef(({ category, items, pageLabel }, ref) => (
  <Page ref={ref} className="menu-book-items">
    <div className="flex h-full w-full flex-col bg-[#fffaf3] px-6 py-6 sm:px-8 sm:py-8">
      <div className="mb-3 flex items-center justify-between border-b-2 border-primary/20 pb-2 sm:mb-4">
        <h3 className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">{category.name}</h3>
        <span className="font-['Poppins',sans-serif] text-[10px] text-stone-400 sm:text-xs">{pageLabel}</span>
      </div>
      <div className="menu-book-items-scroll flex flex-1 flex-col justify-start gap-4 overflow-y-auto sm:gap-5">
        {items.map((product) => (
          <MenuItemRow key={product._id} product={product} />
        ))}
      </div>
    </div>
  </Page>
));
ItemsPage.displayName = 'ItemsPage';

// Book aspect ratio (width:height) for a single page, close to a real menu
const PAGE_ASPECT_RATIO = 0.7;

const useResponsiveBookSize = () => {
  const [size, setSize] = useState({ width: 420, height: 600 });

  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // Leave room for the section heading, nav controls, and page margins
      const heightBudget = vh - (vw < 640 ? 320 : 260);
      const height = Math.max(420, Math.min(heightBudget, 780));

      // Budget width assuming the book may show two pages side by side
      const widthBudget = (vw - (vw < 640 ? 48 : 120)) / (vw >= 1024 ? 2 : 1);
      const width = Math.max(300, Math.min(height * PAGE_ASPECT_RATIO, widthBudget));

      setSize({ width: Math.round(width), height: Math.round(height) });
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return size;
};

const MenuBook = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef(null);
  const { width, height } = useResponsiveBookSize();

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
      const chunkCount = Math.ceil(items.length / ITEMS_PER_PAGE);
      for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
        result.push({
          type: 'items',
          category,
          items: items.slice(i, i + ITEMS_PER_PAGE),
          pageLabel: `${Math.floor(i / ITEMS_PER_PAGE) + 1} / ${chunkCount}`,
        });
      }
    });

    result.push({ type: 'back-cover' });
    return result;
  }, [sections]);

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
                <button
                  onClick={goPrev}
                  disabled={currentPage === 0}
                  className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-md transition-all hover:bg-stone-800 disabled:opacity-20 sm:flex"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <HTMLFlipBook
                  ref={bookRef}
                  width={width}
                  height={height}
                  size="stretch"
                  minWidth={280}
                  maxWidth={900}
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
                      />
                    );
                  })}
                </HTMLFlipBook>

                <button
                  onClick={goNext}
                  disabled={currentPage >= pages.length - 1}
                  className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-md transition-all hover:bg-stone-800 disabled:opacity-20 sm:flex"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile nav controls */}
              <div className="mt-6 flex items-center gap-6 sm:hidden">
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

              <p className="font-['Poppins',sans-serif] mt-4 text-xs text-gray-400">Drag a corner or use the arrows to turn the page</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuBook;
