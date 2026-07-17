import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { getSingleProduct, updateSingleProduct } from '@/redux/slices/products/productSlice';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Loader2, Utensils, Flame } from 'lucide-react';

const UpdateProduct = () => {
  const [inputValue, setInputValue] = useState({
    title: '',
    price: '',
    category: '',
    picture: '',
    description: '',
    stock: '',
    isFeatured: false,
  });

  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  const { categories } = useSelector((state) => state.categories);
  const { singleProducts } = useSelector((s) => s.products);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  
  // Get page number from URL params to return to the same page after update
  const searchParams = new URLSearchParams(location.search);
  const returnPage = searchParams.get('page') || '1';
  
  // Debounce category search to avoid too many API calls
  const debouncedCategorySearch = useDebounce(categorySearch, 300);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      const file = files[0];
      setInputValue((values) => ({ ...values, [name]: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else if (type === 'checkbox') {
      setInputValue((values) => ({ ...values, [name]: checked }));
    } else {
      setInputValue((values) => ({ ...values, [name]: value }));
    }
  };

  const handleCategoryChange = (value) => {
    setInputValue((values) => ({ ...values, category: value }));
    setCategorySearch(''); // Clear search when category is selected
  };

  const handleCategorySearch = (e) => {
    setCategorySearch(e.target.value);
  };

  // Categories are now filtered by backend - no client-side filtering needed
  const filteredCategories = categories || [];

  const handleRemoveImage = () => {
    setInputValue((prev) => ({ ...prev, picture: '' }));
    setPreviewImage('');
  };

  const handleCancel = () => {
    navigate(`/admin/dashboard/all-products?page=${returnPage}`);
  };

  // Fetch single product
  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [id, dispatch]);

  // Fetch categories - initial load
  useEffect(() => {
    dispatch(AllCategory(''));
  }, [dispatch]);

  // Fetch categories from backend when search term changes (debounced)
  useEffect(() => {
    dispatch(AllCategory(debouncedCategorySearch));
  }, [dispatch, debouncedCategorySearch]);

  useEffect(() => {
    if (singleProducts) {
      const { title, price, category, picture, description, stock, isFeatured } = singleProducts;
      setInputValue({
        title,
        price,
        category: category?._id || '',
        picture: '',
        description,
        stock,
        isFeatured: isFeatured || false,
      });
      setPreviewImage(picture?.secure_url || '');
    }
  }, [singleProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(updateSingleProduct({ inputValues: inputValue, id }))
      .unwrap()
      .then((response) => {
        if (response?.success) {
          setInputValue({
            title: '',
            price: '',
            category: '',
            picture: '',
            description: '',
            stock: '',
            isFeatured: false,
          });
          setPreviewImage('');
          toast.success('Menu item updated successfully!');
          navigate(`/admin/dashboard/all-products?page=${returnPage}`);
        }
      })
      .catch((error) => {
        toast.error(error || 'Failed to update menu item. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="border-b border-gray-50 pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          Update Menu Item
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="title" className="font-semibold text-gray-700">Dish / Drink Name</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={inputValue.title}
                onChange={handleChange}
                placeholder="e.g. Double Cheese Smashed Burger"
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="price" className="font-semibold text-gray-700">Price (Rs.)</Label>
                <Input
                  type="text"
                  id="price"
                  name="price"
                  value={inputValue.price}
                  onChange={handleChange}
                  placeholder="Enter Price"
                  className="focus-visible:ring-primary"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="category" className="font-semibold text-gray-700">Cuisine Category</Label>
                <Select value={inputValue.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category" className="focus:ring-primary">
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-60">
                    {/* Search Input */}
                    <div className="p-2 border-b">
                      <Input
                        placeholder="Type first letter to filter..."
                        value={categorySearch}
                        onChange={handleCategorySearch}
                        className="h-8 focus-visible:ring-primary"
                      />
                    </div>
                    
                    {/* Category List */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                              .join(' ')
                            }
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500 text-center">
                          No categories found
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="picture" className="text-sm font-semibold text-gray-700">
                  Dish Presentation Image
                </Label>

                <label
                  htmlFor="picture"
                  className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-primary hover:bg-orange-50/30 transition duration-200 ease-in-out"
                >
                  <span className="text-gray-500 text-sm font-medium">Click to change picture</span>
                  <span className="text-xs text-gray-400">(JPEG, PNG, WebP)</span>
                  <Input
                    type="file"
                    id="picture"
                    name="picture"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="flex items-center justify-center border rounded-lg p-2 bg-gray-50/50 min-h-[9rem]">
                {previewImage ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-700 transition"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">No image uploaded yet</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="description" className="font-semibold text-gray-700">Recipe Description / Ingredients</Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  value={inputValue.description}
                  onChange={handleChange}
                  placeholder="Describe flavors, toppings, patties..."
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="stock" className="font-semibold text-gray-700">Servings Available (Stock)</Label>
                <Input
                  type="number"
                  id="stock"
                  name="stock"
                  value={inputValue.stock}
                  onChange={handleChange}
                  placeholder="Stock limit for today's shifts"
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Featured Checkbox / Chef Recommendation */}
            <div className="flex items-center space-x-3 p-4 bg-amber-50/50 border border-amber-200/60 rounded-lg">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={inputValue.isFeatured || false}
                onChange={handleChange}
                className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
              />
              <Label htmlFor="isFeatured" className="text-sm font-semibold text-gray-800 flex items-center gap-2 cursor-pointer">
                <Flame className="h-4 w-4 text-primary fill-primary/20 animate-pulse" />
                <span>Mark as a Chef&apos;s Special Recommendation</span>
                <span className="text-xs text-gray-500 font-normal ml-1">(Appears in the featured menu section)</span>
              </Label>
            </div>

            <div className="flex gap-4 pt-2">
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/95 text-white">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating kitchen data...
                  </>
                ) : (
                  'Update Menu Item'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateProduct;