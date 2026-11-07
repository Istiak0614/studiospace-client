"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, apiRequest, errorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types/studio";

const OPEN_HOUR = 8;    
const CLOSE_HOUR = 22;  
const MAX_HOURS = 12;   
const MAX_DAYS_AHEAD = 60;
const HOURS = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i);

interface Slot { startTime: string; endTime: string }
type HourStatus = "free" | "booked" | "past";

const atHour = (day: Date, hour: number) => {
  const d = new Date(day);
  d.setHours(hour, 0, 0, 0);
  return d;
};
const label = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

interface BookingModalProps {
  studio: Studio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ studio, open, onOpenChange }: BookingModalProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [range, setRange] = useState<{ start: number; end: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0); 

  const { today, lastDay } = useMemo(() => {
    const t = atHour(new Date(), 0);
    const l = new Date(t);
    l.setDate(l.getDate() + MAX_DAYS_AHEAD);
    return { today: t, lastDay: l };
  }, []);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setLoadingSlots(true);
    setRange(null);

    const from = atHour(date, 0);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);

    apiRequest<Slot[]>(`/studios/${studio._id}/booked-slots?from=${from.toISOString()}&to=${to.toISOString()}`)
      .then((data) => !cancelled && setSlots(data))
      .catch(() => {
        if (!cancelled) {
          setSlots([]);
          toast.error("Couldn't load availability for this day");
        }
      })
      .finally(() => !cancelled && setLoadingSlots(false));

    return () => {
      cancelled = true;
    };
  }, [date, studio._id, reloadKey]);

  const statusOf = (hour: number): HourStatus => {
    if (!date) return "free";
    const start = atHour(date, hour);
    const end = atHour(date, hour + 1);
    if (start.getTime() <= Date.now()) return "past";
    const taken = slots.some((s) => new Date(s.startTime) < end && new Date(s.endTime) > start);
    return taken ? "booked" : "free";
  };

  const handleHourClick = (hour: number) => {
    const isSingle = range && range.start === range.end;

    if (isSingle && hour === range.start) {
      setRange(null); 
      return;
    }
    if (!isSingle || hour < range.start) {
      setRange({ start: hour, end: hour });
      return;
    }

    const blocks = hour - range.start + 1;
    if (blocks > MAX_HOURS) {
      toast.error(`You can book up to ${MAX_HOURS} hours at a time`);
      return;
    }
    for (let h = range.start; h <= hour; h++) {
      if (statusOf(h) !== "free") {
        toast.error("Your selection includes hours that are already taken");
        return;
      }
    }
    setRange({ start: range.start, end: hour });
  };

  const hours = range ? range.end - range.start + 1 : 0;
  const subtotal = hours * studio.hourlyRate;
  const total = hours > 0 ? subtotal + studio.securityDeposit : 0;

  const handleSubmit = async () => {
    if (!date || !range) return;
    setSubmitting(true);
    try {
      const res = await apiRequest<{ message: string }>("/bookings", {
        method: "POST",
        body: {
          studioId: studio._id,
          startTime: atHour(date, range.start).toISOString(),
          endTime: atHour(date, range.end + 1).toISOString(),
        },
      });
      toast.success(res.message);
      onOpenChange(false);
      router.push("/my-bookings");
    } catch (err) {
      toast.error(errorMessage(err));
      if (err instanceof ApiError && err.status === 409) setReloadKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const dateLabel = date?.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:max-w-3xl sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">Book {studio.title}</DialogTitle>
          <DialogDescription>
            Pick a day, then tap a start and an end hour. Greyed-out hours are already booked.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[auto_1fr]">
          <div className="mx-auto rounded-2xl border border-border bg-background/40 p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={[{ before: today }, { after: lastDay }]}
            />
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Clock className="size-4 text-primary" />
              {date ? `Available hours on ${dateLabel}` : "Choose a day to see available hours"}
            </p>

            {!date ? (
              <div className="grid h-48 place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><CalendarDays className="size-4" /> No day selected</span>
              </div>
            ) : loadingSlots ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {HOURS.map((h) => <Skeleton key={h} className="h-10 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {HOURS.map((h) => {
                  const status = statusOf(h);
                  const selected = !!range && h >= range.start && h <= range.end;
                  return (
                    <motion.button
                      key={h}
                      type="button"
                      whileTap={status === "free" ? { scale: 0.94 } : undefined}
                      disabled={status !== "free"}
                      onClick={() => handleHourClick(h)}
                      aria-pressed={selected}
                      title={status === "booked" ? "Already booked" : status === "past" ? "This time has passed" : undefined}
                      className={cn(
                        "h-10 rounded-xl border text-sm font-medium tabular-nums transition-colors",
                        selected && "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                        !selected && status === "free" && "border-border bg-background/40 hover:border-primary hover:text-primary",
                        status === "booked" && "cursor-not-allowed border-transparent bg-destructive/10 text-muted-foreground line-through",
                        status === "past" && "cursor-not-allowed border-transparent bg-muted/40 text-muted-foreground/50"
                      )}
                    >
                      {label(h)}
                    </motion.button>
                  );
                })}
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-3 rounded border border-border bg-background/40" />Available</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-primary" />Selected</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-destructive/20" />Booked</span>
            </div>
          </div>
        </div>

        <div className="mt-2 rounded-2xl border border-border bg-background/40 p-5">
          {range && date ? (
            <p className="mb-4 font-medium">
              {dateLabel} · {label(range.start)} – {label(range.end + 1)}{" "}
              <span className="text-muted-foreground">({hours} {hours === 1 ? "hour" : "hours"})</span>
            </p>
          ) : (
            <p className="mb-4 text-sm text-muted-foreground">Select your hours to see the total.</p>
          )}

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{formatCurrency(studio.hourlyRate)} × {hours} {hours === 1 ? "hour" : "hours"}</dt>
              <dd className="tabular-nums">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Security deposit (refundable)</dt>
              <dd className="tabular-nums">{formatCurrency(hours > 0 ? studio.securityDeposit : 0)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={total}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    className="inline-block font-display text-2xl tabular-nums"
                  >
                    {formatCurrency(total)}
                  </motion.span>
                </AnimatePresence>
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" className="rounded-full px-6" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!range || submitting}
            className="rounded-full px-6 shadow-lg shadow-primary/30"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? "Sending request..." : "Request booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}