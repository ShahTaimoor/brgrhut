import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchProducts,
  deleteSingleProduct,
  updateProductAvailability,
} from "@/redux/slices/products/productSlice";
import { AllCategory } from "@/redux/slices/categories/categoriesSlice";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagination } from "@/hooks/use-pagination";
import { useToast } from "@/hooks/use-toast";
import { Search, Pencil, Trash2, Power } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import Pagination from "./Pagination";
import OneLoader from "../ui/OneLoader";

export default function AllProducts() {
  const dispatch = useDispatch();
  const toast = useToast();

  const { products = [], status, totalItems } = useSelector((state) => state.products);
  const { categories = [] } = useSelector((state) => state.categories);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [limit] = useState(24);
  const pagination = usePagination({ initialLimit: 24, totalItems });

  useEffect(() => {
    dispatch(AllCategory(""));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({
      category: categoryFilter,
      page: pagination.currentPage,
      limit,
      availabilityFilter: "all",
      sortBy: "az",
    }));
  }, [dispatch, categoryFilter, pagination.currentPage, limit]);

  const filteredProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => (p.title || "").toLowerCase().includes(term));
  }, [products, debouncedSearch]);

  const handleToggleAvailability = useCallback(async (product) => {
    setTogglingId(product._id);
    try {
      await dispatch(updateProductAvailability({ id: product._id, isAvailable: !product.isAvailable })).unwrap();
      toast.success(`${product.title} marked as ${!product.isAvailable ? "Serving" : "Sold Out"}`);
    } catch (error) {
      toast.error(error || "Failed to update availability");
    } finally {
      setTogglingId(null);
    }
  }, [dispatch, toast]);

  const handleDelete = useCallback(async (product) => {
    setDeletingId(product._id);
    try {
      await dispatch(deleteSingleProduct(product._id)).unwrap();
      toast.success(`${product.title} deleted`);
    } catch (error) {
      toast.error(error || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }, [dispatch, toast]);

  const loading = status === "loading";

  return (
    <div className="p-6 space-y-6 bg-zinc-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">All Food Items</h1>
          <p className="text-sm text-zinc-500">Browse, search, and manage your live menu catalog</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl">
          <Link to="/admin/dashboard">Add New Food</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu items by name..."
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); pagination.setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-56 h-10 rounded-xl">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <OneLoader size="large" text="Loading menu items..." />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-500 font-medium">
            {debouncedSearch ? "No items match your search." : "No menu items yet. Add your first dish to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-square w-full bg-zinc-100 overflow-hidden">
                <img
                  src={product.picture?.secure_url || product.image || "/logo.jpeg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-zinc-900 text-sm leading-snug">{product.title}</h3>
                  <Badge className={product.isAvailable
                    ? "bg-emerald-100 text-emerald-700 border-0 shrink-0"
                    : "bg-destructive/10 text-destructive border-0 shrink-0"}>
                    {product.isAvailable ? "Serving" : "Sold Out"}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400">{product.category?.name || "Uncategorized"}</p>
                <p className="text-sm font-bold text-zinc-900">Rs. {product.price}</p>

                <div className="mt-auto flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-lg"
                    disabled={togglingId === product._id}
                    onClick={() => handleToggleAvailability(product)}
                  >
                    <Power className="h-3.5 w-3.5 mr-1" />
                    {product.isAvailable ? "Set Sold Out" : "Set Serving"}
                  </Button>
                  <Button asChild variant="outline" size="sm" className="rounded-lg px-2.5">
                    <Link to={`/admin/dashboard/update/${product._id}`} aria-label="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-lg px-2.5 text-destructive hover:bg-destructive/10" disabled={deletingId === product._id}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{product.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove this item from your menu. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDelete(product)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setCurrentPage}
        />
      )}
    </div>
  );
}
