import React, { useRef, useCallback, useEffect } from 'react';
import OneLoader from '../ui/OneLoader';
import LazyImage from '../ui/LazyImage';
import { Badge } from '../ui/badge';

const ProductCard = React.memo(({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  isAddingToCart,
  isInCart,
  gridType,
  setPreviewImage,
}) => {
  const imgRef = useRef(null);
  const clickAudioRef = useRef(null);
  const quantityInputRef = useRef(null);
  const addToCartButtonRef = useRef(null);
  const touchHandledRef = useRef({ decrease: false, increase: false });

  // Initialize audio only once
  useEffect(() => {
    clickAudioRef.current = new Audio('/sounds/click.mp3');
    return () => {
      if (clickAudioRef.current) {
        clickAudioRef.current.pause();
        clickAudioRef.current = null;
      }
    };
  }, []);

  // Centralized Mobile Keyboard Force-Close Utility
  const forceCloseKeyboard = useCallback(() => {
    const activeElement = document.activeElement;
    const targetInput = quantityInputRef.current;

    const dismiss = (el) => {
      if (!el || el.tagName !== 'INPUT') return;
      const wasReadOnly = el.hasAttribute('readonly');
      el.setAttribute('readonly', 'readonly');
      el.blur();
      setTimeout(() => {
        if (!wasReadOnly) el.removeAttribute('readonly');
      }, 150);
    };

    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      dismiss(activeElement);
    } else if (targetInput) {
      dismiss(targetInput);
    }
  }, []);

  const handleAddClick = useCallback((e) => {
    if (e && e.cancelable !== false) {
      e.preventDefault();
    }
    e?.stopPropagation();
    
    // Smoothly shift focus and close virtual keyboard
    forceCloseKeyboard();
    if (addToCartButtonRef.current) {
      addToCartButtonRef.current.focus();
      setTimeout(() => addToCartButtonRef.current?.blur(), 50);
    }
    
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {}); // Catch play preventions if browser blocks audio
    }
    onAddToCart(product);
  }, [onAddToCart, product, forceCloseKeyboard]);

  const handleTouchEnd = useCallback((e) => {
    e.stopPropagation();
    forceCloseKeyboard();

    if (e.cancelable !== false) {
      e.preventDefault(); 
    }
    
    handleAddClick(e);
  }, [handleAddClick, forceCloseKeyboard]);

  const handleQuantityChange = useCallback((value) => {
    if (value === '') {
      onQuantityChange(product._id, '', product.stock);
      return;
    }
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onQuantityChange(product._id, parsed, product.stock);
    }
  }, [onQuantityChange, product._id, product.stock]);

  const handleDecrease = useCallback((e) => {
    if (e.cancelable !== false && !e.type.startsWith('touch')) {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if (quantityInputRef.current === document.activeElement) {
      quantityInputRef.current.blur();
    }
    
    const currentQty = parseInt(quantity, 10) || 0;
    const newValue = Math.max(currentQty - 1, 0);
    onQuantityChange(product._id, newValue, product.stock);
  }, [quantity, onQuantityChange, product._id, product.stock]);

  const handleIncrease = useCallback((e) => {
    if (e.cancelable !== false && !e.type.startsWith('touch')) {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if (quantityInputRef.current === document.activeElement) {
      quantityInputRef.current.blur();
    }
    
    const currentQty = parseInt(quantity, 10) || 0;
    const newValue = Math.min(currentQty + 1, product.stock);
    onQuantityChange(product._id, newValue, product.stock);
  }, [quantity, onQuantityChange, product._id, product.stock]);

  const handleImageClick = useCallback(() => {
    setPreviewImage(product.image || product.picture?.secure_url || '/logo.jpeg');
  }, [setPreviewImage, product.image, product.picture]);

  const capitalizeTitle = useCallback((title) => {
    if (!title) return '';
    return title
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }, []);

  const currentQuantity = parseInt(quantity, 10) || 0;
  const isDisabled = currentQuantity <= 0 || isAddingToCart;

  return (
    <div
      className={`border border-gray-200/80 rounded-xl lg:mt-2 overflow-hidden hover:shadow-2xl hover:shadow-gray-300/30 hover:-translate-y-1 transition-all duration-300 flex h-full bg-white group ${
        gridType === 'grid3' ? 'flex-row items-stretch' : 'flex-col'
      }`}
    >
      {/* Image Container */}
      <div
        className={`relative cursor-pointer overflow-hidden group ${
          gridType === 'grid3' ? 'w-1/4 sm:w-1/8 aspect-square' : 'aspect-square w-full'
        }`}
      >
        {product.isFeatured && (
          <div className="absolute top-0 right-0 z-10 font-semibold flex items-center justify-center p-2 rounded-lg">
            <svg className="h-4 w-4 drop-shadow-sm text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}

        <LazyImage
          ref={imgRef}
          src={product.image || product.picture?.secure_url || '/logo.jpeg'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 cursor-pointer"
          onClick={handleImageClick}
          fallback="/logo.jpeg"
          quality={85}
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          onClick={handleImageClick}
          aria-label="View product image"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info Details Container */}
      <div className={`p-4 flex flex-col flex-grow ${gridType === 'grid3' ? 'w-3/4 sm:w-7/8' : 'w-full'}`}>
        <h3 className="font-semibold leading-snug mb-3 text-gray-900 group-hover:text-primary transition-colors duration-200 text-xs sm:text-sm">
          {capitalizeTitle(product.title)}
        </h3>
        
        <div className="flex-grow" />

        <div className={`flex flex-row gap-2.5 ${gridType === 'grid3' ? 'mt-3' : 'mt-auto'}`}>
          
          {/* Quantity Counter Wrapper */}
          <div className="flex items-center justify-center w-[63%] lg:w-1/2">
            <div 
              className="flex w-full items-stretch h-10 sm:h-9 bg-gray-50 border border-gray-200/60 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              onTouchStart={(e) => {
                if (e.target.tagName === 'BUTTON') e.stopPropagation();
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  if (touchHandledRef.current.decrease) {
                    e.preventDefault();
                    e.stopPropagation();
                    touchHandledRef.current.decrease = false;
                    return;
                  }
                  handleDecrease(e);
                }}
                onTouchEnd={(e) => {
                  touchHandledRef.current.decrease = true;
                  e.stopPropagation();
                  handleDecrease(e);
                  setTimeout(() => { touchHandledRef.current.decrease = false; }, 300);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center text-base font-semibold text-gray-600 bg-white hover:bg-gray-900 hover:text-white transition-all duration-200 active:scale-95 border-r border-gray-200/60"
                style={{
                  touchAction: 'manipulation',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
                tabIndex={-1}
                disabled={currentQuantity <= 0}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <input
                ref={quantityInputRef}
                type="number"
                max={product.stock}
                value={quantity === '' ? '' : quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onFocus={(e) => e.target.select()}
                onTouchStart={(e) => {
                  if (e.target === quantityInputRef.current) e.stopPropagation();
                }}
                className="flex-1 min-w-6 text-center bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-sm font-semibold text-gray-900 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield h-full pointer-events-auto"
                style={{ touchAction: 'manipulation' }}
                tabIndex={0}
              />

              <button
                type="button"
                onClick={(e) => {
                  if (touchHandledRef.current.increase) {
                    e.preventDefault();
                    e.stopPropagation();
                    touchHandledRef.current.increase = false;
                    return;
                  }
                  handleIncrease(e);
                }}
                onTouchEnd={(e) => {
                  touchHandledRef.current.increase = true;
                  e.stopPropagation();
                  handleIncrease(e);
                  setTimeout(() => { touchHandledRef.current.increase = false; }, 300);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center text-base font-semibold text-gray-600 bg-white hover:bg-gray-900 hover:text-white transition-all duration-200 active:scale-95"
                style={{
                  touchAction: 'manipulation',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
                tabIndex={-1}
                disabled={currentQuantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            ref={addToCartButtonRef}
            onClick={handleAddClick}
            onMouseDown={(e) => {
              forceCloseKeyboard();
              addToCartButtonRef.current?.focus();
            }}
            onTouchStart={(e) => {
              forceCloseKeyboard();
              addToCartButtonRef.current?.focus();
              e.stopPropagation();
            }}
            onTouchEnd={handleTouchEnd}
            disabled={isDisabled}
            className={`text-xs font-semibold cursor-pointer px-3 md:px-4 h-10 sm:h-9 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center gap-1.5 md:gap-2 w-[37%] lg:w-1/2 active:scale-[0.98] ${
              isInCart
                ? 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-gray-900/20'
                : isDisabled
                  ? 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none'
                  : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white hover:scale-[1.02] shadow-primary/30'
            }`}
            style={{
              touchAction: 'manipulation',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
            aria-label={isInCart ? 'Added to cart' : 'Add to cart'}
          >
            {isInCart ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden md:inline">Added to Cart</span>
              </>
            ) : isAddingToCart ? (
              <OneLoader size="small" text="Adding..." showText={false} />
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M5.4 5L7 13m0 0l-1.5 4.5M7 13l2.5 4.5M9 17h6m-6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span className="inline md:hidden">Add</span>
                <span className="hidden md:inline">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;