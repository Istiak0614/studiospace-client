import { CheckCircle2, CircleDashed, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types/booking";

const STYLES: Record<BookingStatus, { className: string; icon: typeof Clock }> = {
  Pending: { className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/30", icon: Clock },
  Confirmed: { className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30", icon: CheckCircle2 },
  Completed: { className: "bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-violet-500/30", icon: CircleDashed },
  Cancelled: { className: "bg-red-500/15 text-red-600 dark:text-red-400 ring-red-500/30", icon: XCircle },
};

export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  const { className: style, icon: Icon } = STYLES[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1", style, className)}>
      <Icon className="size-3.5" />
      {status}
    </span>
  );
}

export function cancelReason(booking: Booking, viewer: "guest" | "host") {
  if (booking.status !== "Cancelled") return null;
  if (booking.cancelledBy === "system") return "Expired or declined automatically";
  if (booking.cancelledBy === "guest") return viewer === "guest" ? "You cancelled this request" : "Cancelled by the creator";
  if (booking.cancelledBy === "host") return viewer === "host" ? "You declined this request" : "Declined by the host";
  return null;
}