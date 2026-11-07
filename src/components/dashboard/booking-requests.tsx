"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { CalendarClock, Check, Clock, Inbox, Loader2, Mail, ServerCrash, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, cancelReason } from "@/components/booking/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ApiError, apiRequest, errorMessage } from "@/lib/api";
import { formatBookingDate, formatCurrency, formatTimeRange, getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types/booking";
import { REQUESTS_UPDATED } from "./dashboard-nav";

const FILTERS = ["Pending", "Confirmed", "Completed", "Cancelled", "All"] as const;
type Filter = (typeof FILTERS)[number];

interface StatusResponse {
  message: string;
  booking: Booking;
  autoDeclined: number;
}

export function BookingRequests() {
  const [requests, setRequests] = useState<Booking[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Filter>("Pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toDecline, setToDecline] = useState<Booking | null>(null);

  const load = useCallback(() => {
    apiRequest<Booking[]>("/bookings/requests").then(setRequests).catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f, requests?.filter((r) => f === "All" || r.status === f).length ?? 0])) as Record<Filter, number>,
    [requests]
  );
  const visible = requests?.filter((r) => filter === "All" || r.status === filter) ?? [];

  const replace = (updated: Booking) =>
    setRequests((prev) => prev?.map((r) => (r._id === updated._id ? updated : r)) ?? null);

  const updateStatus = (id: string, status: BookingStatus) =>
    apiRequest<StatusResponse>(`/bookings/${id}/status`, { method: "PATCH", body: { status } });

  const handleConfirm = async (booking: Booking) => {
    setBusyId(booking._id);
    try {
      const res = await updateStatus(booking._id, "Confirmed");
      toast.success(`Confirmed ${booking.guestName}'s booking`);
      if (res.autoDeclined > 0) {
        toast.info(`${res.autoDeclined} overlapping request(s) were declined automatically`);
        load(); // other cards changed too
      } else {
        replace(res.booking);
      }
      window.dispatchEvent(new Event(REQUESTS_UPDATED));
    } catch (err) {
      toast.error(errorMessage(err));
      if (err instanceof ApiError && err.status === 409) load(); // someone else's slot was confirmed first
    } finally {
      setBusyId(null);
    }
  };

  const handleDecline = async () => {
    if (!toDecline) return;
    const res = await updateStatus(toDecline._id, "Cancelled");
    replace(res.booking);
    toast.success("Request declined");
    window.dispatchEvent(new Event(REQUESTS_UPDATED));
  };

  if (failed) return <EmptyState icon={ServerCrash} title="Couldn't load requests" description="Please refresh the page in a moment." />;

  return (
    <div className="space-y-6 pb-16">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Host inbox</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Booking <span className="text-gradient italic">requests</span></h1>
        <p className="mt-2 text-muted-foreground">Confirm or decline requests for your studios. Overlapping requests are handled for you.</p>
      </div>

      {!requests ? (
        <div className="space-y-4">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}</div>
      ) : requests.length === 0 ? (
        <EmptyState icon={Inbox} title="No requests yet" description="When creators request your studios, they'll appear here."
          action={{ href: "/add-studio", label: "List another studio" }} />
      ) : (
        <>
          <div className="glass flex gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]">
            {FILTERS.map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)}
                className={cn("relative isolate flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  filter === f ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                {filter === f && <motion.span layoutId="request-filter" className="absolute inset-0 -z-10 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                {f}
                <span className={cn("rounded-full px-1.5 text-xs tabular-nums", filter === f ? "bg-black/15" : "bg-muted")}>{counts[f]}</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="glass rounded-3xl p-10 text-center text-muted-foreground">No {filter.toLowerCase()} requests.</p>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((r) => {
                  const reason = cancelReason(r, "host");
                  const earnings = r.hours * r.hourlyRate;
                  return (
                    <motion.li key={r._id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                      className="glass flex flex-col gap-5 rounded-3xl p-5 sm:p-6 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 items-center gap-3 lg:w-56">
                        <Avatar className="size-11">
                          <AvatarFallback className="bg-accent text-sm text-accent-foreground">{getInitials(r.guestName)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{r.guestName}</p>
                          <a href={`mailto:${r.guestEmail}`} className="flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-primary">
                            <Mail className="size-3" />{r.guestEmail}
                          </a>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Link href={`/studios/${r.studioId}`} className="block truncate font-medium hover:text-primary">{r.studioTitle}</Link>
                        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><CalendarClock className="size-4 text-primary" />{formatBookingDate(r.startTime)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="size-4 text-primary" />{formatTimeRange(r.startTime, r.endTime)} · {r.hours}h</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <StatusBadge status={r.status} />
                          {reason && <span className="text-xs text-muted-foreground">{reason}</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-border pt-4 lg:w-64 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                        <div className="lg:text-right">
                          <p className="font-display text-2xl font-semibold">{formatCurrency(earnings)}</p>
                          <p className="text-xs text-muted-foreground">+ {formatCurrency(r.securityDeposit)} deposit held</p>
                        </div>
                        {r.status === "Pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" disabled={busyId === r._id} onClick={() => setToDecline(r)}
                              className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                              <X className="size-4" /> Decline
                            </Button>
                            <Button size="sm" disabled={busyId === r._id} onClick={() => handleConfirm(r)} className="rounded-full">
                              {busyId === r._id ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Confirm
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!toDecline}
        onOpenChange={(open) => !open && setToDecline(null)}
        title="Decline this request?"
        description={toDecline ? `${toDecline.guestName} will see that you declined their request for ${formatBookingDate(toDecline.startTime)}.` : ""}
        confirmLabel="Yes, decline"
        onConfirm={handleDecline}
      />
    </div>
  );
}