"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Building2, CalendarCheck, DollarSign, Inbox, Plus, ServerCrash, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/booking/status-badge";
import { CountUp } from "@/components/shared/count-up";
import { EmptyState } from "@/components/shared/empty-state";
import { apiRequest } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatBookingDate, formatCurrency, formatTimeRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DashboardData } from "@/types/dashboard";
import { EarningsChart } from "./earnings-chart";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  hint: string;
  href: string;
  format?: (n: number) => string;
  highlight?: boolean;
  index: number;
}

function StatCard({ icon: Icon, label, value, hint, href, format, highlight, index }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
      <Link href={href}
        className={cn("glass group block h-full rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/15",
          highlight && "ring-2 ring-primary/60")}>
        <div className="mb-4 flex items-center justify-between">
          <span className="grid size-11 place-items-center rounded-2xl bg-linear-to-br from-primary/25 to-accent/25 text-primary">
            <Icon className="size-5" />
          </span>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-3xl font-semibold"><CountUp value={value} format={format} /></p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </Link>
    </motion.div>
  );
}

export function DashboardOverview() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    apiRequest<DashboardData>(`/dashboard/stats?tz=${encodeURIComponent(tz)}`).then(setData).catch(() => setFailed(true));
  }, []);

  if (failed) return <EmptyState icon={ServerCrash} title="Couldn't load your dashboard" description="Please refresh the page in a moment." />;

  const firstName = session?.user.name.split(" ")[0] ?? "";

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">
            {greeting()}{firstName && <>, <span className="text-gradient italic">{firstName}</span></>}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button nativeButton={false} render={<Link href="/add-studio" />} className="rounded-full px-5">
            <Plus className="size-4" /> Add studio
          </Button>
          <Button nativeButton={false} render={<Link href="/studios" />} variant="outline" className="rounded-full px-5">
            Explore
          </Button>
        </div>
      </div>

      {!data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-40 rounded-3xl" />)}
          </div>
          <Skeleton className="h-80 rounded-3xl" />
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard index={0} icon={Building2} label="My listings" value={data.stats.listings}
              hint="Studios you host" href="/my-listings" />
            <StatCard index={1} icon={CalendarCheck} label="Bookings made" value={data.stats.bookingsMade}
              hint={`${data.stats.upcomingBookings} upcoming`} href="/my-bookings" />
            <StatCard index={2} icon={Inbox} label="Pending requests" value={data.stats.pendingRequests}
              hint={data.stats.pendingRequests ? "Waiting for your answer" : "You're all caught up"}
              href="/dashboard/requests" highlight={data.stats.pendingRequests > 0} />
            <StatCard index={3} icon={DollarSign} label="Total earnings" value={data.stats.totalEarnings}
              hint="Confirmed + completed, excl. deposits" href="/dashboard/requests" format={(n) => formatCurrency(Math.round(n))} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass rounded-3xl p-6">
              <h2 className="text-xl font-semibold">Earnings, last 6 months</h2>
              <p className="mb-6 text-sm text-muted-foreground">Hours × rate from confirmed and completed bookings at your studios</p>
              <EarningsChart data={data.earningsByMonth} />
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass rounded-3xl p-6">
              <h2 className="mb-4 text-xl font-semibold">Recent activity</h2>
              {data.recentActivity.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">No bookings yet. Activity will show up here.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {data.recentActivity.map((b) => (
                    <li key={b._id}>
                      <Link href={b.role === "host" ? "/dashboard/requests" : "/my-bookings"}
                        className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-muted/50">
                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          b.role === "host" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent")}>
                          {b.role === "host" ? "Host" : "Guest"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {b.role === "host" ? `${b.guestName} · ${b.studioTitle}` : b.studioTitle}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatBookingDate(b.startTime)} · {formatTimeRange(b.startTime, b.endTime)}
                          </p>
                        </div>
                        <StatusBadge status={b.status} className="hidden sm:inline-flex" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          </div>
        </>
      )}
    </div>
  );
}