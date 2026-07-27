import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddProduct } from "@/redux/slices/products/productSlice"; // Aligned with your Redux slice
import { AllCategory } from "@/redux/slices/categories/categoriesSlice";
import { PlusCircle, Image, Sparkles, Clock, Flame, Check } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast"; // Or your custom toast hook

export default function CreateProducts() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { categories } = useSelector((state) => state.categories);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(AllCategory(''));
  }, [dispatch]);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discountPercent: "",
    category: "",
    prepTime: "10",
    isSpicy: false,
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Using FormData to handle text fields along with image uploads safely
    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("price", formData.price);
    submissionData.append("discountPercent", formData.discountPercent || "0");
    submissionData.append("category", formData.category);
    submissionData.append("prepTime", formData.prepTime);
    submissionData.append("isSpicy", formData.isSpicy);
    submissionData.append("description", formData.description);
    if (imageFile) {
      submissionData.append("picture", imageFile);
    }

    try {
      // Dispatches directly to your active Redux slice action
      await dispatch(AddProduct(submissionData)).unwrap();
      toast.success("New dish has been published to your storefront.");
      // Reset Form
      setFormData({
        title: "",
        price: "",
        discountPercent: "",
        category: "",
        prepTime: "10",
        isSpicy: false,
        description: "",
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast.error(error?.message || error || "Something went wrong adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-['Inter',sans-serif]">
      {/* Clean Restaurant Header */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">Add New Menu Item</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Create and publish a new item to your active food storefront menu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Dish Details Card */}
        <div className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-zinc-100">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Basic Recipe Details
          </h2>

          <div className="space-y-4">
            {/* Dish Name Input */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Dish / Item Name *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g., Spicy Double Zinger, Pizza, Classic Fries"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-zinc-50/30 placeholder-zinc-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Input */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Price (PKR) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-zinc-50/30"
                />
              </div>

              {/* Discount Input */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discountPercent"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formData.discountPercent}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-zinc-50/30"
                />
              </div>

              {/* Fast Food Categories Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Menu Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                >
                  <option value="" disabled>Select category</option>
                  {(categories || []).map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fast Food Preparation Time Input (Replaced Generic Stock Qty) */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" /> Prep Time (Mins)
                </label>
                <input
                  type="number"
                  name="prepTime"
                  placeholder="10"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-zinc-50/30"
                />
              </div>
            </div>

            {/* Fast Food Spicy Checkbox */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none bg-orange-50/50 hover:bg-orange-50 p-2.5 px-4 rounded-xl border border-orange-100/60 transition-all">
                <input
                  type="checkbox"
                  name="isSpicy"
                  checked={formData.isSpicy}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-orange-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current text-primary" /> Mark as Hot & Spicy
                </span>
              </label>
            </div>

            {/* Recipe Ingredients / Short Description Description */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Ingredients & Details
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your dish (e.g., Double crispy chicken patty, cheese, fresh lettuce, and signature spicy sauce...)"
                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-zinc-50/30 resize-none placeholder-zinc-400/80 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Media Layout Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-zinc-100 mb-4">
              <Image className="w-3.5 h-3.5 text-orange-500" /> Food Image
            </h2>

            {/* Dynamic Preview Box */}
            {imagePreview ? (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-colors shadow-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-[4/3] border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50/10 transition-all cursor-pointer bg-zinc-50/50">
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                  <PlusCircle className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-xs font-bold text-zinc-700">Upload File</p>
                <p className="text-[10px] text-zinc-400 mt-1">PNG, JPG or JPEG up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-md shadow-orange-500/10 h-11 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Adding to Menu...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Add to Menu</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}