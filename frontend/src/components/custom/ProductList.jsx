import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slices/cart/cartSlice';
import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { fetchProducts, searchProducts } from '@/redux/slices/products/productSlice';
import { Link, useSearchParams } from 'react-router-dom';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { useAuthDrawer } from '@/contexts/AuthDrawerContext';
import { useToast } from '@/hooks/use-toast';
import SearchSuggestions from './SearchSuggestions';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const urlCategorySlug = searchParams.get('category') || 'all';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const urlSearchQuery = searchParams.get('search') || '';
  
  const { categories, status: categoriesStatus } = useSelector((s) => s.categories);
  
  const categoryBySlug = useMemo(() => {
    if (urlCategorySlug === 'all') return 'all';
    if (!categories || categories.length === 0) return 'all';
    const found = categories.find(cat => cat.slug === urlCategorySlug);
    return found?._id || 'all';
  }, [urlCategorySlug, categories]);

  const isSearchMode = urlSearchQuery.trim().length > 0;

  const [category, setCategory] = useState(categoryBySlug);
  const [page, setPage] = useState(urlPage);
  const [limit] = useState(24);
  const [availabilityFilter] = useState('active');
  const [sortBy] = useState('az'); 
  const [isInitialized, setIsInitialized] = useState(false);

  // Optimized parallel quantity trackers
  const [quantities, setQuantities] = useState({});
  const quantitiesRef = useRef({});

  const [addingProductId, setAddingProductId] = useState(null);
  const [gridType] = useState('grid2');
  const [previewImage, setPreviewImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const isCategoryChangingRef = useRef(false);
  const isSyncingFromURLRef = useRef(false);
  
  const dispatch = useDispatch();
  const { openDrawer } = useAuthDrawer();
  const toast = useToast();

  const setQuantitiesStateAndRef = (updater) => {
    setQuantities((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      quantitiesRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    if (!isSearchMode && categoryBySlug !== category) {
      isSyncingFromURLRef.current = true;
      setCategory(categoryBySlug);
    }
  }, [categoryBySlug, isSearchMode, category]);

  useEffect(() => {
    if (isSyncingFromURLRef.current) {
      const timer = setTimeout(() => {
        isSyncingFromURLRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [category]);

  useEffect(() => {
    if (categories && categories.length > 0 && !isInitialized) {
      setIsInitialized(true);
    }
  }, [categories, isInitialized]);
  
  const updateURLParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });
    if (updates.category !== undefined && updates.page === undefined) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);
  
  const categorySlug = useMemo(() => {
    if (category === 'all') return 'all';
    const found = categories?.find(cat => cat._id === category);
    return found?.slug || 'all';
  }, [category, categories]);

  useEffect(() => {
    if (isSearchMode || isCategoryChangingRef.current || isSyncingFromURLRef.current) return;
    
    const currentCategorySlug = searchParams.get('category') || 'all';
    const currentPage = searchParams.get('page') || '1';
    
    if (categorySlug === urlCategorySlug) return;
    
    const updates = {};
    let hasUpdates = false;
    
    if (categorySlug !== currentCategorySlug) {
      updates.category = categorySlug === 'all' ? null : categorySlug;
      hasUpdates = true;
    }
    
    if (page.toString() !== currentPage && page > 1) {
      updates.page = page.toString();
      hasUpdates = true;
    } else if (page === 1 && currentPage !== '1') {
      updates.page = null;
      hasUpdates = true;
    }
    
    if (hasUpdates) updateURLParams(updates);
  }, [category, page, categorySlug, updateURLParams, searchParams, isSearchMode, urlCategorySlug]);

  const { 
    products: productList = [], 
    status, 
    totalItems, 
    currentPage, 
    totalPages,
    searchResults,
    searchStatus,
    searchPagination
  } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const { items: cartItems = [] } = useSelector((s) => s.cart);
  
  const displayPagination = useMemo(() => {
    if (isSearchMode && searchPagination) return searchPagination;
    return { total: totalItems, page: currentPage, limit, totalPages };
  }, [isSearchMode, searchPagination, totalItems, currentPage, limit, totalPages]);

  const sortedProducts = useMemo(() => {
    const list = (isSearchMode && searchResults && searchResults.length > 0) ? searchResults : productList;
    return list.filter((product) => product && product._id);
  }, [productList, isSearchMode, searchResults]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    if (isSearchMode && urlSearchQuery.trim().length > 0) {
      dispatch(searchProducts({ query: urlSearchQuery.trim(), limit, page }));
    } else {
      const categoryToFetch = categoryBySlug === 'all' ? null : categoryBySlug;
      if (categoryToFetch && !isInitialized) return;
      
      const params = { page, limit, availabilityFilter, sortBy };
      if (categoryToFetch) params.category = categoryToFetch;
      dispatch(fetchProducts(params));
    }
  }, [dispatch, page, limit, availabilityFilter, sortBy, categoryBySlug, isSearchMode, urlSearchQuery, isInitialized]);

  useEffect(() => {
    if ((!categories || categories.length === 0) && categoriesStatus !== 'loading') {
      dispatch(AllCategory(''));
    }
  }, [dispatch]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setQuantitiesStateAndRef((prev) => {
        const updated = { ...prev };
        let hasChanges = false;
        cartItems.forEach((item) => {
          const productId = item.product?._id || item.product;
          if (productId && item.quantity && (updated[productId] === undefined || updated[productId] === 0)) {
            updated[productId] = item.quantity;
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }
  }, [cartItems]);

  useEffect(() => {
    if (sortedProducts && sortedProducts.length > 0) {
      setQuantitiesStateAndRef((prev) => {
        const updated = { ...prev };
        let hasChanges = false;
        sortedProducts.forEach((product) => {
          if (product && product._id && updated[product._id] === undefined) {
            const cartItem = cartItems.find(item => (item.product?._id || item.product) === product._id);
            updated[product._id] = cartItem?.quantity || 0;
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }
  }, [sortedProducts, cartItems]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleQuantityChange = useCallback((productId, value) => {
    if (value === '') {
      return setQuantitiesStateAndRef((prev) => ({ ...prev, [productId]: '' }));
    }
    const newValue = Math.max(parseInt(value), 0);
    setQuantitiesStateAndRef((prev) => ({ ...prev, [productId]: newValue }));
  }, []);

  const handleAddToCart = useCallback((product) => {
    if (!user) {
      openDrawer('login');
      return;
    }

    const qty = parseInt(quantitiesRef.current[product._id]) || 0;
    
    if (qty <= 0 || product.isOutOfStock) {
      toast.error(`Please select a valid quantity. This dish is currently sold out.`);
      return;
    }

    setAddingProductId(product._id);
    dispatch(addToCart({
      productId: product._id,
      quantity: qty
    })).then(() => {
      toast.success(`${qty}x ${product.title} added to your order!`);
    }).catch((error) => {
      if (!user) {
        openDrawer('login');
      } else {
        toast.error(error || 'Failed to add item to your order.');
      }
    }).finally(() => setAddingProductId(null));
  }, [dispatch, user, openDrawer, toast]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    updateURLParams({ page: newPage === 1 ? null : newPage.toString() });
  }, [updateURLParams]);
  
  const handlePreviewImage = useCallback((image) => setPreviewImage(image), []);

  const loadingProducts = isSearchMode ? searchStatus === 'loading' : status === 'loading';

  return (
    <div className="max-w-7xl lg:mx-auto lg:px-4 py-2 lg:py-8">
      {/* Mobile in-menu search */}
      {isMobile && (
        <div className="px-3 sm:px-4 pb-3">
          <SearchSuggestions
            placeholder="Craving something? Search the menu..."
            className="w-full"
            inputClassName="w-full"
            aria-label="Search menu items"
          />
        </div>
      )}

      {/* Menu / Food Grid */}
      <div className="mt-2">
        <ProductGrid
          products={sortedProducts}
          loading={loadingProducts}
          gridType={gridType}
          quantities={quantities}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          addingProductId={addingProductId}
          cartItems={cartItems}
          onPreviewImage={handlePreviewImage}
        />
      </div>

      {/* Menu Search Results Header */}
      {isSearchMode && (
        <div className="px-2 sm:px-0 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Dishes matching &quot;{urlSearchQuery}&quot;
              {displayPagination.total > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({displayPagination.total} {displayPagination.total === 1 ? 'item' : 'items'} found)
                </span>
              )}
            </h2>
            <button
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('search');
                setSearchParams(newParams);
              }}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {displayPagination.totalPages > 1 && (
        <div className="px-2 sm:px-0 mt-6 mb-0 lg:mb-4">
          <Pagination
            currentPage={displayPagination.page || 1}
            totalPages={displayPagination.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] bg-stone-950/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setPreviewImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Dish preview"
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="rounded-lg shadow-lg object-contain w-full h-auto max-h-[90vh]"
              loading="eager"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer-when-downgrade"
              decoding="async"
              onError={(e) => {
                if (e.target.src !== '/logo.jpeg') {
                  e.target.src = '/logo.jpeg';
                }
              }}
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 md:top-4 md:right-4 lg:right-24 xl:right-24 bg-stone-950/70 hover:bg-primary text-white rounded-full p-1 px-2 text-sm md:text-base"
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Live Order Support Button */}
      <div className="fixed animate-bounce bottom-18 lg:bottom-5 right-0 lg:right-2 z-50">
        <Link
          to="https://wa.me/923114000096?text=Hi%20brgrhut!%20I'd%20like%20to%20place%20an%20order."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order support on WhatsApp"
        >
          <img
            className="w-14 h-14"
            src="/WhatsApp.svg.webp"
            alt="WhatsApp"
            loading="lazy"
            width="56"
            height="56"
          />
        </Link>
      </div>
    </div>
  );
};

export default ProductList;