"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { CalendarClock, CalendarX2, Clock, MapPin, ServerCrash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { apiRequest } from "@/lib/api";
import { formatBookingDate, formatCurrency, formatTimeRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";
import { StatusBadge, cancelReason } from "./status-badge";
import { BadgeCheck, MessageSquarePlus } from "lucide-react";
import { ReviewDialog } from "./review-dialog";

const FILTERS = ["All", "Upcoming", "Pending", "Confirmed", "Completed", "Cancelled"] as const;
type Filter = (typeof FILTERS)[number];

const matches = (b: Booking, filter: Filter) => {
  if (filter === "All") return true;
  if (filter === "Upcoming") return (b.status === "Pending" || b.status === "Confirmed") && new Date(b.startTime) > new Date();
  return b.status === filter;
};

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [toReview, setToReview] = useState<Booking | null>(null);

    useEffect(() => {
    Promise.all([apiRequest<Booking[]>("/bookings/mine"), apiRequest<string[]>("/reviews/mine")])
      .then(([list, reviewed]) => {
        setBookings(list);
        setReviewedIds(new Set(reviewed));
      })
      .catch(() => setFailed(true));
  }, []);

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f, bookings?.filter((b) => matches(b, f)).length ?? 0])) as Record<Filter, number>,
    [bookings]
  );
  const visible = bookings?.filter((b) => matches(b, filter)) ?? [];

  const handleCancel = async () => {
    if (!toCancel) return;
    const res = await apiRequest<{ message: string; booking: Booking }>(`/bookings/${toCancel._id}/cancel`, { method: "PATCH" });
    setBookings((prev) => prev?.map((b) => (b._id === res.booking._id ? res.booking : b)) ?? null);
    toast.success("Your booking request was cancelled");
  };

  if (failed) {
    return <EmptyState icon={ServerCrash} title="Couldn't load your bookings" description="Please refresh the page in a moment." />;
  }

  if (!bookings) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-44 rounded-3xl" />)}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="No bookings yet"
        description="Find a studio you love and request your first session. It only takes a minute."
        action={{ href: "/studios", label: "Explore studios" }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="glass mb-6 flex gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "relative isolate flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filter === f ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {filter === f && (
              <motion.span layoutId="booking-filter" className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
            {f}
            <span className={cn("rounded-full px-1.5 text-xs tabular-nums", filter === f ? "bg-black/15" : "bg-muted")}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="glass rounded-3xl p-10 text-center text-muted-foreground">No {filter.toLowerCase()} bookings.</p>
      ) : (
        <ul className="space-y-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((booking) => {
              const reason = cancelReason(booking, "guest");
              return (
                <motion.li
                  key={booking._id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="glass flex flex-col overflow-hidden rounded-3xl md:flex-row"
                >
                  <Link href={`/studios/${booking.studioId}`} className="relative aspect-video shrink-0 md:aspect-auto md:w-56">
                    <Image src={booking.studioImage} alt={booking.studioTitle} fill sizes="(max-width: 768px) 100vw, 224px" className="object-cover" />
                  </Link>

                  <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={booking.status} />
                        {reason && <span className="text-xs text-muted-foreground">{reason}</span>}
                      </div>
                      <h3 className="truncate font-sans text-lg font-semibold tracking-normal">
                        <Link href={`/studios/${booking.studioId}`} className="hover:text-primary">{booking.studioTitle}</Link>
                      </h3>
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0 text-primary" />
                        <span className="truncate">{booking.studioLocation}</span>
                      </p>
                      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="flex items-center gap-1.5"><CalendarClock className="size-4 text-primary" />{formatBookingDate(booking.startTime)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="size-4 text-primary" />{formatTimeRange(booking.startTime, booking.endTime)} · {booking.hours}h</span>
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-row items-end justify-between gap-4 border-t border-border pt-4 lg:w-56 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                      <div className="text-sm lg:text-right">
                        <p className="text-muted-foreground">{formatCurrency(booking.hourlyRate)} × {booking.hours}h + {formatCurrency(booking.securityDeposit)} deposit</p>
                        <p className="font-display text-2xl font-semibold">{formatCurrency(booking.totalPrice)}</p>
                      </div>

                      {booking.status === "Pending" && (
                        <Button variant="outline" size="sm" onClick={() => setToCancel(booking)}
                          className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                          <X className="size-4" />
                          Cancel
                        </Button>
                      )}
                      {booking.status === "Completed" &&
                        (reviewedIds.has(booking._id) ? (
                          <span className="flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-violet-600 dark:text-violet-300">
                            <BadgeCheck className="size-4" /> Reviewed
                          </span>
                        ) : (
                          <Button size="sm" onClick={() => setToReview(booking)} className="rounded-full">
                            <MessageSquarePlus className="size-4" /> Leave a review
                          </Button>
                        ))}
                       
                      
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <ConfirmDialog
        open={!!toCancel}
        onOpenChange={(open) => !open && setToCancel(null)}
        title="Cancel this request?"
        description={
          toCancel
            ? `Your request for ${toCancel.studioTitle} on ${formatBookingDate(toCancel.startTime)} (${formatTimeRange(toCancel.startTime, toCancel.endTime)}) will be withdrawn.`
            : ""
        }
        confirmLabel="Yes, cancel it"
        onConfirm={handleCancel}
      />
      <ReviewDialog
        booking={toReview}
        onOpenChange={(open) => !open && setToReview(null)}
        onReviewed={(id) => setReviewedIds((prev) => new Set(prev).add(id))}
      />
    </div>
  );
}