import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { X, Plus } from 'lucide-react';
import { productSchema } from '@/schemas/productSchemas';

const CreateProductModal = ({
  showCreateForm,
  formData,
  isSubmitting,
  onClose,
  onSubmit,
  onFormDataChange
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate on change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const result = productSchema.safeParse(formData);
      if (!result.success) {
        const newErrors = {};
        if (result.error && result.error.errors && Array.isArray(result.error.errors)) {
          result.error.errors.forEach((err) => {
            if (err && err.path && Array.isArray(err.path) && err.path.length > 0 && err.message) {
              newErrors[err.path[0]] = err.message;
            }
          });
        }
        setErrors(newErrors);
      } else {
        setErrors({});
      }
    }
  }, [formData, touched]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      price: true,
      stock: true,
      category: true
    });

    const result = productSchema.safeParse(formData);
    if (!result.success) {
      const newErrors = {};
      if (result.error && result.error.errors && Array.isArray(result.error.errors)) {
        result.error.errors.forEach((err) => {
          if (err && err.path && Array.isArray(err.path) && err.path.length > 0 && err.message) {
            newErrors[err.path[0]] = err.message;
          }
        });
      }
      setErrors(newErrors);
      return;
    }

    onSubmit(e);
  };

  if (!showCreateForm) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Dish to Menu</h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Cook up a brand new item for your food catalog</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 rounded-full h-8 w-8 p-0 flex-shrink-0 ml-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Item Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  Dish / Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={() => handleBlur('title')}
                  placeholder="e.g., Double Patty Smash Burger"
                  className={`h-11 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl ${
                    errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
                  }`}
                />
                {errors.title && touched.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
                  Price (Rs.) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={() => handleBlur('price')}
                  placeholder="0.00"
                  className={`h-11 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl ${
                    errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
                  }`}
                />
                {errors.price && touched.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Recipe Details */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                Ingredients & Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={() => handleBlur('description')}
                placeholder="List key ingredients, cooking details, and allergen flags..."
                rows={4}
                className={`border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl resize-none min-h-[110px] ${
                  errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
                }`}
              />
              {errors.description && touched.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Serving Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">
                Servings Available <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                onBlur={() => handleBlur('stock')}
                placeholder="How many servings can the kitchen prepare?"
                className={`h-11 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl ${
                  errors.stock ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
                }`}
              />
              {errors.stock && touched.stock && (
                <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
              >
                Nevermind
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white transition-all rounded-xl font-medium shadow-sm hover:shadow active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Cooking Up...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <Plus className="h-4 w-4" />
                    Add Item to Menu
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;