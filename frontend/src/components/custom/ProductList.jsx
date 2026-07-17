import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateCartQuantity } from '@/redux/slices/cart/cartSlice';
import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { fetchProducts, searchProducts } from '@/redux/slices/products/productSlice';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import CategorySwiper from './CategorySwiper';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import { usePagination } from '@/hooks/use-pagination';
import { ShoppingCart, ArrowUpDown, SortAsc, Grid3X3, List, AlertCircle, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import CartImage from '../ui/CartImage';
import Checkout from '../../pages/Checkout';
import { useAuthDrawer } from '@/contexts/AuthDrawerContext';
import { useToast } from '@/hooks/use-toast';
import SearchSuggestions from './SearchSuggestions';
import { getHeaderClassName, getStickyHeaderClassName, getSpacerHeightClassName } from '@/utils/classNameHelpers';

// Cart Product Component (Representing items in the Customer's Order Basket)
const CartProduct = ({ product, quantity }) => {
  const dispatch = useDispatch();
  const [inputQty, setInputQty] = useState(quantity);
  const { _id, title, price } = product;
  const image = product.image || product.picture?.secure_url;
  
  const isOutOfStock = product.isOutOfStock === true;

  const updateQuantity = (newQty) => {
    if (!isOutOfStock && newQty !== quantity && newQty > 0) {
      setInputQty(newQty);
      dispatch(updateCartQuantity({ productId: _id, quantity: newQty }));
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch(removeFromCart(_id));
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputQty > 1) {
      updateQuantity(inputQty - 1);
    }
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      updateQuantity(inputQty + 1);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 border-b transition-colors ${
      isOutOfStock 
        ? 'bg-red-50 hover:bg-red-100 opacity-75 border-red-200' 
        : 'border-gray-100 hover:bg-gray-50'
    }`}>
      <div className="flex items-center space-x-3 flex-1">
        <CartImage
          src={image}
          alt={title}
          className={`w-12 h-12 rounded-md border object-cover ${
            isOutOfStock 
              ? 'border-red-200 opacity-50' 
              : 'border-gray-200'
          }`}
          fallback="/fallback.jpg"
          quality={80}
        />
        <div className="min-w-0 flex-1">
          <h4 className={`font-medium text-sm line-clamp-2 ${
            isOutOfStock ? 'text-gray-500' : 'text-gray-900'
          }`}>
            {title}
          </h4>
          {isOutOfStock && (
            <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3" />
              <span>Sold Out</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {isOutOfStock ? (
          <div className="text-xs text-red-600 font-medium px-2 py-1 bg-red-100 rounded">
            Unavailable
          </div>
        ) : (
          <div className="flex items-center border border-gray-200 rounded-md">
            <button
              type="button"
              onClick={handleDecrease}
              className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={inputQty <= 1}
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-900">{inputQty}</span>
            <button
              type="button"
              onClick={handleIncrease}
              className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              +
            </button>
          </div>
        )}
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
          title="Remove item"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
    </div>
  );
};

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [stockFilter] = useState('active');
  const [sortBy] = useState('az'); 
  const [isInitialized, setIsInitialized] = useState(false);

  // Optimized parallel quantity trackers
  const [quantities, setQuantities] = useState({});
  const quantitiesRef = useRef({});

  const [addingProductId, setAddingProductId] = useState(null);
  const [gridType, setGridType] = useState('grid2');
  const [previewImage, setPreviewImage] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
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

  const totalQuantity = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0), 
    [cartItems]
  );
  
  const combinedCategories = useMemo(() => {
    const activeCategories = (categories || []).filter(cat => cat.active === true);
    const allCategories = [
      { _id: 'all', name: 'All Cuisines', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&h=150&q=80' },
      ...activeCategories
    ];
    return allCategories.sort((a, b) => {
      if (a._id === 'all') return -1;
      if (b._id === 'all') return 1;
      return (a.position ?? 999) - (b.position ?? 999);
    });
  }, [categories]);

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
      
      const params = { page, limit, stockFilter, sortBy };
      if (categoryToFetch) params.category = categoryToFetch;
      dispatch(fetchProducts(params));
    }
  }, [dispatch, page, limit, stockFilter, sortBy, categoryBySlug, isSearchMode, urlSearchQuery, isInitialized]);

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
    const handleScroll = () => setIsScrolled(window.scrollY > 100);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
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

  const handleCategorySelect = useCallback((categoryId) => {
    isCategoryChangingRef.current = true;
    const catSlug = categoryId === 'all' ? 'all' : (categories?.find(cat => cat._id === categoryId)?.slug || 'all');
    
    setCategory(categoryId);
    setPage(1);
    
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete('search');
    if (catSlug === 'all') currentParams.delete('category');
    else currentParams.set('category', catSlug);
    currentParams.delete('page');
    
    navigate(currentParams.toString() ? `/products?${currentParams.toString()}` : '/products', { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categories, navigate]);

  const handleGridTypeChange = useCallback((type) => setGridType(type), []);
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    updateURLParams({ page: newPage === 1 ? null : newPage.toString() });
  }, [updateURLParams]);
  
  const handlePreviewImage = useCallback((image) => setPreviewImage(image), []);

  const handleBuyNow = useCallback(() => {
    if (!user) {
      openDrawer('login');
      return;
    }
    if (cartItems.length === 0) {
      return;
    }
    setOpenCheckoutDialog(true);
  }, [user, cartItems.length]);
  
  const loadingProducts = isSearchMode ? searchStatus === 'loading' : status === 'loading';

  return (
    <div className="max-w-7xl lg:mx-auto lg:px-4 py-2 lg:py-8">
      {/* Mobile Header */}
      {isMobile && (
        <div className={getHeaderClassName(isScrolled, isMobile)}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <img src="/logo.jpeg" alt="brgrhut Logo" className="h-8 w-auto object-contain" />
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight text-primary">brgrhut</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Fixed Categories Container */}
      <div className={getStickyHeaderClassName(isMobile, isScrolled)}>
        <div className="max-w-7xl lg:mx-auto">
          {isMobile && (
            <div className="px-3 sm:px-4 pt-3 pb-2">
              <SearchSuggestions
                placeholder="Craving something? Search the menu..."
                className="w-full"
                inputClassName="w-full"
                aria-label="Search menu items"
              />
            </div>
          )}
          
          {combinedCategories && combinedCategories.length > 0 ? (
            <CategorySwiper
              categories={combinedCategories}
              selectedCategory={category}
              onCategorySelect={handleCategorySelect}
            />
          ) : (
            <div className="mt-4 pb-6">
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className={getSpacerHeightClassName(isMobile, isScrolled)}></div>

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
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
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
              className="absolute top-2 right-2 md:top-4 md:right-4 lg:right-24 xl:right-24 bg-black/70 hover:bg-primary text-white rounded-full p-1 px-2 text-sm md:text-base"
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

      {/* Fast Checkout Dialog */}
      <Dialog open={openCheckoutDialog} onOpenChange={setOpenCheckoutDialog}>
        <DialogContent className="w-[95vw] max-w-full sm:w-[92vw] md:w-[88vw] lg:w-[92vw] lg:max-w-7xl xl:max-w-[90vw] h-[90vh] sm:h-[88vh] md:h-[85vh] lg:h-[90vh] overflow-hidden p-0 bg-transparent border-0 shadow-2xl flex flex-col m-2 sm:m-4">
          <DialogHeader className="sr-only">
            <DialogTitle>Order Checkout</DialogTitle>
            <DialogDescription>Review your items and confirm delivery details</DialogDescription>
          </DialogHeader>
          <Checkout closeModal={() => setOpenCheckoutDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;