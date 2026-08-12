import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllReviews,
  deleteReview,
  toggleReviewActive,
} from "@/redux/slices/reviews/reviewSlice";
import { getInitials } from "@/utils/getInitials";
import { useToast } from "@/hooks/use-toast";
import { Search, Pencil, Trash2, Power, Star, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
import OneLoader from "../ui/OneLoader";

export default function AllReviews() {
  const dispatch = useDispatch();
  const toast = useToast();

  const { reviews = [], status } = useSelector((state) => state.reviews);

  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const filteredReviews = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reviews;
    return reviews.filter((r) => (r.customerName || "").toLowerCase().includes(term));
  }, [reviews, searchTerm]);

  const handleToggleActive = useCallback(async (review) => {
    setTogglingId(review._id);
    try {
      await dispatch(toggleReviewActive(review._id)).unwrap();
      toast.success(`${review.customerName}'s review ${review.active ? "hidden from" : "shown on"} the storefront`);
    } catch (error) {
      toast.error(error || "Failed to update review");
    } finally {
      setTogglingId(null);
    }
  }, [dispatch, toast]);

  const handleDelete = useCallback(async (review) => {
    setDeletingId(review._id);
    try {
      await dispatch(deleteReview(review._id)).unwrap();
      toast.success(`Review from ${review.customerName} deleted`);
    } catch (error) {
      toast.error(error || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  }, [dispatch, toast]);

  const loading = status === "loading" && reviews.length === 0;

  return (
    <div className="p-6 space-y-6 bg-zinc-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Customer Reviews</h1>
          <p className="text-sm text-zinc-500">Curate what shows up in the storefront testimonials carousel</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl">
          <Link to="/admin/dashboard/create-review">Add New Review</Link>
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search reviews by customer name..."
          className="pl-9 h-10 rounded-xl"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <OneLoader size="large" text="Loading reviews..." />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-500 font-medium">
            {searchTerm ? "No reviews match your search." : "No reviews yet. Add your first customer review to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col p-4 gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-11 w-11 border border-zinc-200 flex-shrink-0">
                    <AvatarImage src={review.picture?.secure_url} alt={review.customerName} />
                    <AvatarFallback className="bg-orange-50 text-orange-600 text-sm font-bold">
                      {getInitials(review.customerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 text-sm truncate">{review.customerName}</p>
                    {review.location && (
                      <p className="text-xs text-zinc-400 flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {review.location}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={review.active
                  ? "bg-emerald-100 text-emerald-700 border-0 shrink-0"
                  : "bg-zinc-100 text-zinc-500 border-0 shrink-0"}>
                  {review.active ? "Live" : "Hidden"}
                </Badge>
              </div>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? "fill-primary text-primary" : "fill-zinc-200 text-zinc-200"}
                  />
                ))}
              </div>

              <p className="text-sm text-zinc-600 line-clamp-3 flex-1">{review.comment}</p>

              <div className="mt-auto flex items-center gap-2 pt-1.5 border-t border-zinc-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-lg"
                  disabled={togglingId === review._id}
                  onClick={() => handleToggleActive(review)}
                >
                  <Power className="h-3.5 w-3.5 mr-1" />
                  {review.active ? "Hide" : "Show"}
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-lg px-2.5">
                  <Link to={`/admin/dashboard/update-review/${review._id}`} aria-label="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-lg px-2.5 text-destructive hover:bg-destructive/10" disabled={deletingId === review._id}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove {review.customerName}'s review. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => handleDelete(review)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
