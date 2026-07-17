import React, { useState, useCallback } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import LazyImage from '../ui/LazyImage';
import { Trash2, Edit, Eye, Star, Wrench, CheckSquare, Square } from 'lucide-react';

const ProductCardAdmin = ({
  product,
  index,
  gridType,
  isSelected,
  editingPriceId,
  editingPriceValue,
  editingStockId,
  editingStockValue,
  isUpdatingPrice,
  isUpdatingStock,
  isUpdatingFeatured,
  onSelect,
  onEdit,
  onDelete,
  onToggleFeatured,
  onStockToggle,
  onStartEditPrice,
  onCancelEditPrice,
  onSavePrice,
  onStartEditStock,
  onCancelEditStock,
  onSaveStock,
  onPreviewImage,
  onPriceValueChange,
  onStockValueChange
}) => {
  // Capitalize first letter of each word (Perfect for clean Model/Part titles)
  const capitalizeTitle = (title) => {
    if (!title) return '';
    return title
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Card 
      className={`group relative overflow-hidden bg-white border border-gray-200 hover:border-red-500/40 transition-all duration-200 ${
        isSelected ? 'ring-2 ring-red-600 border-red-600' : ''
      } ${
        gridType === 'grid3' ? 'flex flex-row items-center gap-4 p-3' : 'p-0'
      }`}
    >
      {/* Selection Box */}
      <div className="absolute top-2 left-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product._id);
          }}
          className="p-1 bg-white rounded border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors"
          title={isSelected ? 'Deselect Part' : 'Select Part'}
        >
          {isSelected ? (
            <CheckSquare className="h-4 w-4 text-red-600" />
          ) : (
            <Square className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute top-2 right-2 z-10">
          <div className="p-1.5 bg-red-600 rounded-full shadow-md text-white">
            <Star className="h-4 w-4 fill-white" />
          </div>
        </div>
      )}

      {/* Product Image Wrapper */}
      <div 
        className={`relative overflow-hidden bg-gray-100 cursor-pointer ${
          gridType === 'grid3' 
            ? 'w-20 h-20 flex-shrink-0 rounded border border-gray-200' 
            : 'aspect-square w-full border-b border-gray-200'
        }`}
        onClick={() => onPreviewImage(product.image || product.picture?.secure_url)}
      >
        <LazyImage
          src={(() => {
            const imageUrl = product.image || product.picture?.secure_url;
            if (!imageUrl) return imageUrl;
            // Always add cache-busting parameter with timestamp to force reload
            const separator = imageUrl.includes('?') ? '&' : '?';
            const timestamp = product._imageUpdated || Date.now();
            return `${imageUrl}${separator}_t=${timestamp}`;
          })()}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          fallback="/logo.jpeg"
          quality={90}
          loading="eager"
          key={`${product._id}-${product._imageUpdated || product.picture?.secure_url || product.image || 'default'}`}
        />
        
        {!product.isFeatured && (
          <div className="absolute top-2 right-2">
            <Badge 
              className={`px-1.5 py-0.5 text-xs font-semibold border-0 ${
                product.stock > 0 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {product.stock > 0 ? 'Ready to Ship' : 'Backordered'}
            </Badge>
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white rounded-full p-2.5 shadow-lg">
            <Eye className="h-4 w-4 text-gray-900" />
          </div>
        </div>
      </div>

      {/* Info Details */}
      <div className={`${gridType === 'grid3' ? 'flex-1 space-y-1.5' : 'p-3 sm:p-4 space-y-2 sm:space-y-3'}`}>
        <div className="space-y-1">
          <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
            {capitalizeTitle(product.title)}
          </h3>
          
          <p className="text-gray-500 text-[10px] sm:text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        
        {/* Price & Stock Adjustment Section */}
        <div className="flex items-center justify-between pt-1 gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            {editingPriceId === product._id ? (
              <div className="flex items-center gap-1.5 sm:gap-2 relative z-0">
                <Input
                  type="number"
                  value={editingPriceValue}
                  onChange={(e) => onPriceValueChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSavePrice(product._id);
                    } else if (e.key === 'Escape') {
                      onCancelEditPrice();
                    }
                  }}
                  className="h-7 sm:h-8 text-xs sm:text-sm font-semibold border-red-500 focus:ring-1 focus:ring-red-500 w-20 sm:w-24"
                  autoFocus
                  disabled={isUpdatingPrice}
                />
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSavePrice(product._id);
                  }}
                  disabled={isUpdatingPrice}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                  type="button"
                >
                  ✓
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelEditPrice();
                  }}
                  disabled={isUpdatingPrice}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-gray-200"
                  type="button"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="text-sm sm:text-base font-extrabold text-gray-900 truncate">
                  Rs. {product.price?.toLocaleString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEditPrice(product);
                  }}
                  className="p-0.5 sm:p-1 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  title="Quick edit price"
                >
                  <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 hover:text-red-600" />
                </button>
              </div>
            )}

            {/* Stock Level Row */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              {editingStockId === product._id ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Input
                    type="number"
                    value={editingStockValue}
                    onChange={(e) => onStockValueChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSaveStock(product._id);
                      } else if (e.key === 'Escape') {
                        onCancelEditStock();
                      }
                    }}
                    className="h-7 sm:h-8 text-[10px] sm:text-xs font-semibold border-red-500 focus:ring-1 focus:ring-red-500 w-16 sm:w-20"
                    autoFocus
                    disabled={isUpdatingStock}
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveStock(product._id);
                    }}
                    disabled={isUpdatingStock}
                    className="h-6 w-6 sm:h-7 sm:w-7 p-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                    type="button"
                  >
                    ✓
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelEditStock();
                    }}
                    disabled={isUpdatingStock}
                    className="h-6 w-6 sm:h-7 sm:w-7 p-0 border-gray-200"
                    type="button"
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    Stock: {product.stock} units
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartEditStock(product);
                    }}
                    className="p-0.5 sm:p-1 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Quick edit stock"
                  >
                    <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400 hover:text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Feature Badge Toggle */}
          <div className="flex items-center ml-2 sm:ml-4 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatured(product);
              }}
              disabled={isUpdatingFeatured}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title={product.isFeatured ? 'Remove Hot Pick status' : 'Mark as Hot Pick'}
            >
              <Star className={`h-4.5 w-4.5 sm:h-5 sm:w-5 transition-colors ${
                product.isFeatured 
                  ? 'fill-red-600 text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`} />
            </button>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
          >
            Edit Info
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product._id)}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            title="Delete Part"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStockToggle(product)}
            className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${
              product.stock > 0 
                ? 'text-orange-600 hover:bg-orange-50' 
                : 'text-emerald-600 hover:bg-emerald-50'
            }`}
            title={product.stock > 0 ? 'Mark as Out of Stock' : 'Mark as In Stock'}
          >
            <Wrench className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCardAdmin;