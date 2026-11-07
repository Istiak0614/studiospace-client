"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, errorMessage } from "@/lib/api";
import { formatBookingDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";

const LABELS = ["Tap a star to rate", "Poor", "Fair", "Good", "Great", "Outstanding"];

interface ReviewDialogProps {
  booking: Booking | null; 
  onOpenChange: (open: boolean) => void;
  onReviewed: (bookingId: string) => void;
}

export function ReviewDialog({ booking, onOpenChange, onReviewed }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setRating(0);
    setHover(0);
    setComment("");
  }, [booking?._id]);

  const length = comment.trim().length;
  const shown = hover || rating;

  const handleSubmit = async () => {
    if (!booking) return;
    if (rating < 1) return toast.error("Please choose a star rating");
    if (length < 10 || length > 500) return toast.error("Your review must be between 10 and 500 characters");

    setSubmitting(true);
    try {
      const res = await apiRequest<{ message: string }>("/reviews", {
        method: "POST",
        body: { bookingId: booking._id, rating, comment: comment.trim() },
      });
      toast.success(res.message);
      onReviewed(booking._id);
      onOpenChange(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !submitting && onOpenChange(open)}>
      <DialogContent className="glass-strong rounded-3xl p-8 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Review {booking?.studioTitle}</DialogTitle>
          <DialogDescription>
            {booking && `Your session on ${formatBookingDate(booking.startTime)}. How was it?`}
          </DialogDescription>
        </DialogHeader>

        {/* Interactive stars */}
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                whileHover={{ scale: 1.2, rotate: -8 }}
                whileTap={{ scale: 0.85 }}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
                className="p-1"
              >
                <Star className={cn("size-9 transition-colors", n <= shown ? "fill-primary text-primary" : "text-muted-foreground/40")} />
              </motion.button>
            ))}
          </div>
          <p className="h-5 text-sm font-medium text-muted-foreground">{LABELS[shown]}</p>
        </div>

        <div className="space-y-1.5">
          <Textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            placeholder="What did you like? How were the light, the gear and the host?"
            className="rounded-xl bg-background/50"
          />
          <p className={cn("text-right text-xs", length > 0 && length < 10 ? "text-destructive" : "text-muted-foreground")}>
            {length}/500 · minimum 10
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" className="rounded-full px-6" disabled={submitting} onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <Button className="rounded-full px-6 shadow-lg shadow-primary/30" disabled={submitting} onClick={handleSubmit}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Submit review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}