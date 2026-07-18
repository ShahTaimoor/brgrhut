import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import OneLoader from '../ui/OneLoader';
import LazyImage from '../ui/LazyImage';
import Pagination from './Pagination';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { fetchProducts, getSingleProduct, updateSingleProduct, updateProductAvailability } from '@/redux/slices/products/productSlice';
import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { AlertTriangle, PackageSearch, Edit, Trash2, X, Upload as UploadIcon, Star, Power } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

const LowStock = () => {
  const dispatch = useDispatch();
  const { products, status, totalItems } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const toast = useToast();

  const [limit] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [availabilityFilter] = useState('low-stock'); // Always low-stock for this page
  const [sortBy] = useState('stock-low'); // Sort by availability ascending

  // State for inline editing
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editingPriceValue, setEditingPriceValue] = useState('');
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    picture: '',
    isFeatured: false,
  });
  const [editPreviewImage, setEditPreviewImage] = useState('');
  const [editCategorySearch, setEditCategorySearch] = useState('');
  const debouncedEditCategorySearch = useDebounce(editCategorySearch, 300);

  const pagination = usePagination({
    initialPage: 1,
    initialLimit: limit,
    totalItems,
    onPageChange: (page) => {
      setCurrentPage(page);
    }
  });

  // Fetch products with low-stock (unavailable) filter
  useEffect(() => {
    dispatch(fetchProducts({ 
      category: 'all', 
      page: currentPage, 
      limit, 
      availabilityFilter, 
      sortBy 
    }));
  }, [dispatch, currentPage, limit, availabilityFilter, sortBy]);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(AllCategory(''));
  }, [dispatch]);

  // Fetch categories for edit modal when search term changes (debounced)
  useEffect(() => {
    if (showEditModal) {
      dispatch(AllCategory(debouncedEditCategorySearch));
    }
  }, [dispatch, debouncedEditCategorySearch, showEditModal]);

  // Memoized combined categories
  const combinedCategories = useMemo(() => [
    { _id: 'all', name: 'All' },
    ...(categories || [])
  ], [categories]);

  const filteredCategories = combinedCategories;

  const handlePageChange = useCallback((page) => {
    pagination.setCurrentPage(page);
  }, [pagination]);

  // Handle edit product - open modal instead of navigating
  const handleEdit = useCallback(async (product) => {
    try {
      setSelectedProduct(product);
      setShowEditModal(true);
      // Fetch full product details
      const result = await dispatch(getSingleProduct(product._id)).unwrap();
      if (result?.product) {
        const prod = result.product;
        setEditFormData({
          title: prod.title || '',
          description: prod.description || '',
          price: prod.price || '',
          category: prod.category?._id || '',
          picture: '',
          isFeatured: prod.isFeatured || false,
        });
        setEditPreviewImage(prod.picture?.secure_url || prod.image || '');
      }
    } catch (error) {
      toast.error('Failed to load product details');
    }
  }, [dispatch, toast]);

  // Handle edit form submission
  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isUpdating || !selectedProduct) return;
    
    setIsUpdating(true);
    try {
      // Create FormData for file upload
      const formDataObj = new FormData();
      Object.keys(editFormData).forEach(key => {
        if (key === 'picture') {
          // Only append if it's a File object (new image uploaded)
          if (editFormData[key] instanceof File) {
            formDataObj.append(key, editFormData[key]);
          }
        } else if (key === 'isFeatured') {
          formDataObj.append(key, editFormData[key]);
        } else if (editFormData[key] !== '' && editFormData[key] !== null && editFormData[key] !== undefined) {
          formDataObj.append(key, editFormData[key]);
        }
      });

      await dispatch(updateSingleProduct({ 
        id: selectedProduct._id, 
        inputValues: formDataObj 
      })).unwrap();
      
      setShowEditModal(false);
      setSelectedProduct(null);
      setEditFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        picture: '',
        isFeatured: false,
      });
      setEditPreviewImage('');
      
      // Refresh products list
      dispatch(fetchProducts({ 
        category: 'all', 
        page: pagination.currentPage, 
        limit, 
        availabilityFilter,
        sortBy
      }));
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setIsUpdating(false);
    }
  }, [dispatch, editFormData, isUpdating, selectedProduct, pagination.currentPage, limit, availabilityFilter, sortBy, toast]);

  // Handle edit form change
  const handleEditChange = useCallback((e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      const file = files[0];
      setEditFormData((prev) => ({ ...prev, [name]: file }));
      setEditPreviewImage(URL.createObjectURL(file));
    } else if (type === 'checkbox') {
      setEditFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Handle edit category change
  const handleEditCategoryChange = useCallback((value) => {
    setEditFormData((prev) => ({ ...prev, category: value }));
    setEditCategorySearch('');
  }, []);

  // Handle inline price edit
  const handleStartEditPrice = useCallback((product) => {
    setEditingPriceId(product._id);
    setEditingPriceValue(product.price?.toString() || '');
  }, []);

  const handleCancelEditPrice = useCallback(() => {
    setEditingPriceId(null);
    setEditingPriceValue('');
  }, []);

  const handleSavePrice = useCallback(async (productObj) => {
    const productId = productObj._id || productObj.id;
    
    if (!editingPriceValue || isNaN(editingPriceValue) || parseFloat(editingPriceValue) < 0 || !productId) {
      return;
    }

    setIsUpdatingPrice(true);
    try {
      const formDataObj = new FormData();
      // Send the updated price
      formDataObj.append('price', editingPriceValue);
      // Send remaining fields to satisfy backend strict validations
      formDataObj.append('title', productObj.title || '');
      formDataObj.append('description', productObj.description || '');
      if (productObj.category?._id || productObj.category) {
        formDataObj.append('category', productObj.category._id || productObj.category);
      }
      if (productObj.isFeatured !== undefined) {
        formDataObj.append('isFeatured', productObj.isFeatured);
      }

      await dispatch(updateSingleProduct({ 
        id: productId, 
        inputValues: formDataObj 
      })).unwrap();
      
      setEditingPriceId(null);
      setEditingPriceValue('');
      
      // Refresh products list
      dispatch(fetchProducts({ 
        category: 'all', 
        page: pagination.currentPage, 
        limit, 
        availabilityFilter,
        sortBy
      }));
    } catch (error) {
      toast.error('Failed to update price');
    } finally {
      setIsUpdatingPrice(false);
    }
  }, [dispatch, editingPriceValue, pagination.currentPage, limit, availabilityFilter, sortBy, toast]);

  // Handle marking a sold-out item as available (serving) again
  const handleSetAvailable = useCallback(async (product) => {
    setTogglingId(product._id);
    try {
      await dispatch(updateProductAvailability({ id: product._id, isAvailable: true })).unwrap();
      toast.success(`${product.title} marked as Serving`);
      dispatch(fetchProducts({
        category: 'all',
        page: pagination.currentPage,
        limit,
        availabilityFilter,
        sortBy,
      }));
    } catch (error) {
      toast.error(error || 'Failed to update availability');
    } finally {
      setTogglingId(null);
    }
  }, [dispatch, pagination.currentPage, limit, availabilityFilter, sortBy, toast]);

  const sortedProducts = useMemo(() => {
    return products.filter((product) => product && product._id);
  }, [products]);

  if (status === 'loading' && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <OneLoader size="large" text="Loading sold-out items..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Item Availability
                </h1>
              </div>
              <p className="text-gray-500 text-lg">
                Menu items currently marked Sold Out — edit details or mark them Serving again
              </p>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-md">
                  <PackageSearch className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 leading-none">{totalItems}</p>
                  <p className="text-xs text-gray-500 mt-1">Sold Out Items</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Products ({sortedProducts.length})
            </h2>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product, index) => (
              <Card 
                key={product._id || `product-${index}`} 
                className="group relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Sold Out Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <Badge
                    className="bg-destructive hover:bg-destructive/90 text-white text-xs font-bold px-2 py-0.5 border-0"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Sold Out
                  </Badge>
                </div>

                {/* Product Image */}
                <div 
                  className="relative overflow-hidden bg-gray-50 aspect-square w-full border-b border-gray-100"
                >
                  <LazyImage
                    src={product.image || product.picture?.secure_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallback="/logo.jpeg"
                    quality={90}
                    loading="eager"
                  />
                </div>

                {/* Product Info */}
                <div className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {product.title}
                    </h3>
                    
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="space-y-1 flex-1">
                      {editingPriceId === product._id ? (
                        <div className="flex items-center gap-2 relative z-0">
                          <Input
                            type="number"
                            value={editingPriceValue}
                            onChange={(e) => setEditingPriceValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSavePrice(product);
                              } else if (e.key === 'Escape') {
                                handleCancelEditPrice();
                              }
                            }}
                            className="h-8 text-sm font-semibold border-primary focus:ring-1 focus:ring-primary w-24"
                            autoFocus
                            disabled={isUpdatingPrice}
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSavePrice(product);
                            }}
                            disabled={isUpdatingPrice}
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                            type="button"
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelEditPrice();
                            }}
                            disabled={isUpdatingPrice}
                            className="h-8 w-8 p-0"
                            type="button"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            PKR {product.price?.toLocaleString()}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditPrice(product);
                            }}
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Edit price"
                          >
                            <Edit className="h-3.5 w-3.5 text-gray-400 hover:text-primary" />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                        <span className="text-xs text-gray-500 font-medium">Sold Out</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-50 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={togglingId === product._id}
                      onClick={() => handleSetAvailable(product)}
                      className="flex-1 h-9 text-xs font-medium border-gray-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                    >
                      <Power className="h-3.5 w-3.5 mr-1" />
                      Set Serving
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1 h-9 text-xs font-medium border-gray-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                    >
                      Edit Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{pagination.startItem}</span> to{' '}
              <span className="font-semibold text-gray-900">{pagination.endItem}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalItems}</span> products
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center mt-6">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <PackageSearch className="h-10 w-10 text-gray-400" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nothing Sold Out
              </h3>

              <p className="text-gray-500 mb-8">
                Every menu item is currently marked as Serving.
              </p>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Update product details</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setEditFormData({
                      title: '',
                      description: '',
                      price: '',
                      category: '',
                      picture: '',
                      isFeatured: false,
                    });
                    setEditPreviewImage('');
                  }}
                  className="text-gray-500 hover:text-gray-900 rounded-full h-8 w-8 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1">
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title" className="text-sm font-semibold text-gray-700">
                        Product Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-title"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        placeholder="Enter product title"
                        required
                        className="h-10 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-price" className="text-sm font-semibold text-gray-700">
                        Price (PKR) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-price"
                        name="price"
                        type="number"
                        value={editFormData.price}
                        onChange={handleEditChange}
                        placeholder="0.00"
                        required
                        className="h-10 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-category" className="text-sm font-semibold text-gray-700">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select value={editFormData.category} onValueChange={handleEditCategoryChange}>
                      <SelectTrigger className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <Input
                            placeholder="Search categories..."
                            value={editCategorySearch}
                            onChange={(e) => setEditCategorySearch(e.target.value)}
                            className="mb-2 h-8 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        {filteredCategories.filter(cat => cat._id !== 'all').map((cat) => (
                          <SelectItem key={cat._id} value={cat._id} className="py-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description" className="text-sm font-semibold text-gray-700">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      placeholder="Describe your product..."
                      required
                      rows={4}
                      className="border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg resize-none min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="edit-picture" className="text-sm font-semibold text-gray-700">
                        Product Image
                      </Label>
                      <label
                        htmlFor="edit-picture"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:border-primary/60 hover:bg-primary/5 transition duration-200 group"
                      >
                        <div className="flex flex-col items-center gap-1 group-hover:scale-105 transition-transform">
                           <UploadIcon className="h-6 w-6 text-gray-400 group-hover:text-primary" />
                           <span className="text-gray-500 text-xs font-medium group-hover:text-primary">Click to upload</span>
                        </div>
                        <Input
                          type="file"
                          id="edit-picture"
                          name="picture"
                          accept="image/*"
                          onChange={handleEditChange}
                          className="hidden"
                        />
                      </label>
                      {editPreviewImage && (
                        <div className="relative mt-2 w-full h-32 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={editPreviewImage}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditPreviewImage('');
                              setEditFormData((prev) => ({ ...prev, picture: '' }));
                            }}
                            className="absolute top-2 right-2 bg-white/90 hover:bg-destructive/10 text-destructive rounded-full p-1.5 shadow-sm transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Featured Checkbox */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                    <input
                      type="checkbox"
                      id="edit-isFeatured"
                      name="isFeatured"
                      checked={editFormData.isFeatured || false}
                      onChange={handleEditChange}
                      className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                    />
                    <Label htmlFor="edit-isFeatured" className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
                      <Star className={`h-4 w-4 ${editFormData.isFeatured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                      <span>Mark as Featured Product</span>
                    </Label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                        setEditFormData({
                          title: '',
                          description: '',
                          price: '',
                          category: '',
                          picture: '',
                          isFeatured: false,
                        });
                        setEditPreviewImage('');
                      }}
                      className="flex-1 h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white transition-colors"
                    >
                      {isUpdating ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Updating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Update Product
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(LowStock);