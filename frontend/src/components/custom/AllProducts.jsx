import React, { useState } from "react";
import { Plus, Search, Eye, Power, Flame, Pizza } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

// Sample initial food items
const initialFoodItems = [
  {
    id: 1,
    name: "Spicy Double Zinger",
    category: "Burgers",
    price: 450,
    isAvailable: true,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 2,
    name: "Classic Pepperoni Pizza",
    category: "Pizza",
    price: 890,
    isAvailable: true,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    name: "Crispy Golden Fries",
    category: "Sides",
    price: 220,
    isAvailable: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

export default function AllProducts() {
  const [products, setProducts] = useState(initialFoodItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Burgers", "Pizza", "Sides", "Drinks", "Desserts"];

  // Toggle availability status instantly
  const toggleAvailability = (id) => {
    setProducts(products.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6 bg-zinc-50 min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Menu Management</h1>
          <p className="text-sm text-zinc-500">Manage your active kitchen catalog and update item availability</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-2 rounded-xl shadow-md shadow-orange-500/10">
          <Plus className="w-4 h-4" />
          Add New Dish
        </Button>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Menu Items</p>
          <p className="text-2xl font-bold text-zinc-950 mt-1">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
          <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Active & Serving</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {products.filter(p => p.isAvailable).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
          <p className="text-rose-500 text-xs font-semibold uppercase tracking-wider">Sold Out</p>
          <p className="text-2xl font-bold text-rose-500 mt-1">
            {products.filter(p => !p.isAvailable).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
          <p className="text-orange-500 text-xs font-semibold uppercase tracking-wider">Top Category</p>
          <p className="text-2xl font-bold text-zinc-950 mt-1">Burgers</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Simple Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-zinc-50/50"
            />
          </div>

          {/* Quick fast-food categories row */}
          <div className="flex gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${
              item.isAvailable ? "border-zinc-200/80" : "border-rose-100 opacity-90"
            }`}
          >
            {/* Food Image & Badges */}
            <div className="aspect-[4/3] w-full relative bg-zinc-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <Badge className={`text-[10px] px-2 py-0.5 font-bold border-0 ${
                  item.isAvailable 
                    ? "bg-emerald-500 text-white" 
                    : "bg-rose-500 text-white"
                }`}>
                  {item.isAvailable ? "In Stock" : "Sold Out"}
                </Badge>
                {item.isSpicy && (
                  <Badge className="bg-red-500 text-white flex items-center gap-1 text-[10px] px-2 py-0.5 font-bold border-0">
                    <Flame className="w-3 h-3 fill-current" /> Spicy
                  </Badge>
                )}
              </div>

              {/* Instant hover view button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="bg-white text-zinc-900 p-2.5 rounded-full shadow-md hover:scale-110 transition-transform">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Food Content Details */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                    {item.category}
                  </p>
                  <h3 className="font-bold text-zinc-900 text-sm mt-1 line-clamp-1 group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>
                </div>
                <p className="font-extrabold text-zinc-900 text-sm whitespace-nowrap">
                  PKR {item.price}
                </p>
              </div>

              {/* Kitchen Action Toggles */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] font-medium text-zinc-400">Availability Toggle</span>
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    item.isAvailable
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                      : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                  }`}
                >
                  <Power className="w-3 h-3" />
                  {item.isAvailable ? "Set Sold Out" : "Set Serving"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}