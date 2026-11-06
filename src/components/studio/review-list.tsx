import { MessageSquareQuote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/shared/star-rating";
import { formatDate, getInitials } from "@/lib/format";
import type { Review } from "@/types/review";

interface ReviewListProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ReviewList({ reviews, rating, reviewCount }: ReviewListProps) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        {reviewCount > 0 && (
          <span className="flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm">
            <StarRating value={rating} />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">· {reviewCount} reviews</span>
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="glass flex items-center gap-4 rounded-2xl p-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <MessageSquareQuote className="size-6" />
          </span>
          <div>
            <p className="font-medium">No written reviews yet</p>
            <p className="text-sm text-muted-foreground">Creators can leave a review after a completed booking.</p>
          </div>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <li key={review._id} className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={review.userPhoto} alt={review.userName} referrerPolicy="no-referrer" />
                  <AvatarFallback className="bg-accent text-sm text-accent-foreground">{getInitials(review.userName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{review.userName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.createdAt, { day: true })}</p>
                </div>
                <StarRating value={review.rating} />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}