"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Building2, CalendarCheck, Heart, Inbox, LayoutDashboard, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";

export const REQUESTS_UPDATED = "studiospace:requests-updated";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/requests", label: "Booking Requests", icon: Inbox, showPending: true },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/my-listings", label: "My Listings", icon: Building2 },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/add-studio", label: "Add Studio", icon: PlusCircle },
];

const isActive = (pathname: string, href: string) =>
  href === "/dashboard" ? pathname === href : pathname.startsWith(href);

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const load = () =>
      apiRequest<Booking[]>("/bookings/requests?status=Pending")
        .then((list) => setPending(list.length))
        .catch(() => setPending(0));
    load();
    window.addEventListener(REQUESTS_UPDATED, load);
    return () => window.removeEventListener(REQUESTS_UPDATED, load);
  }, [pathname]);

  const renderLinks = (layoutId: string, vertical: boolean) =>
    LINKS.map(({ href, label, icon: Icon, showPending }) => {
      const active = isActive(pathname, href);
      return (
        <Link
          key={href}
          href={href}
          className={cn(
            "relative isolate flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
            active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            !vertical && "rounded-full"
          )}
        >
          {active && (
            <motion.span layoutId={layoutId} className={cn("absolute inset-0 -z-10 bg-primary shadow-lg shadow-primary/25", vertical ? "rounded-xl" : "rounded-full")}
              transition={{ type: "spring", stiffness: 400, damping: 32 }} />
          )}
          <Icon className="size-4" />
          {label}
          {showPending && pending > 0 && (
            <span className={cn("ml-auto grid min-w-5 place-items-center rounded-full px-1.5 text-xs font-semibold",
              active ? "bg-black/20" : "bg-primary text-primary-foreground")}>
              {pending}
            </span>
          )}
        </Link>
      );
    });

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="glass sticky top-28 space-y-4 rounded-3xl p-3">
          {session && (
            <div className="flex items-center gap-3 rounded-2xl bg-background/40 p-3">
              <Avatar className="size-10">
                <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} referrerPolicy="no-referrer" />
                <AvatarFallback className="bg-accent text-sm text-accent-foreground">{getInitials(session.user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{session.user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
          )}
          <nav aria-label="Dashboard" className="flex flex-col gap-1">{renderLinks("dash-pill", true)}</nav>
        </div>
      </aside>

      <nav aria-label="Dashboard" className="glass flex gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none] lg:hidden">
        {renderLinks("dash-pill-mobile", false)}
      </nav>
    </>
  );
}