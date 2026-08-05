import { Star } from "lucide-react";

// Clickable 1-5 star picker, shared by CreateReview and UpdateReview - kept
// as its own component since both need the exact same interactive markup.
export default function StarRatingInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
            className="p-0.5"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                starValue <= value ? "fill-primary text-primary" : "fill-zinc-200 text-zinc-200"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
