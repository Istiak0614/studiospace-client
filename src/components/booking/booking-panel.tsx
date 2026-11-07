"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Pencil, ShieldCheck, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/format";
import type { Studio } from "@/types/studio";
import { BookingModal } from "./booking-modal";

function BookNowButton({ studio, className }: { studio: Studio; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={`h-12 rounded-full text-base shadow-xl shadow-primary/30 ${className}`}
      >
        <CalendarCheck className="size-5" />
        Book Workspace Now
      </Button>
      <BookingModal studio={studio} open={open} onOpenChange={setOpen} />
    </>
  );
}

function BookAction({ studio, className }: { studio: Studio; className?: string }) {
  const { data: session, isPending } = useSession();

  if (isPending) return <Skeleton className={`h-12 rounded-full ${className}`} />;

  if (!session) {
    return (
      <Button nativeButton={false} render={<Link href={`/login?redirect=/studios/${studio._id}`} />}
        className={`h-12 rounded-full text-base ${className}`}>
        Log in to book
      </Button>
    );
  }

  if (session.user.email === studio.ownerEmail) {
    return (
      <Button nativeButton={false} render={<Link href={`/studios/edit/${studio._id}`} />} variant="outline"
        className={`h-12 rounded-full text-base ${className}`}>
        <Pencil className="size-4" />
        Edit your studio
      </Button>
    );
  }

    return <BookNowButton studio={studio} className={className} />;
}

export function BookingPanel({ studio }: { studio: Studio }) {
    const { data: session } = useSession();
    const isOwner = session?.user.email === studio.ownerEmail;
    return (
    <aside className="glass-strong sticky top-28 rounded-3xl p-6 shadow-2xl shadow-accent/10">
      <div className="flex items-end justify-between">
        <p>
          <span className="font-display text-4xl font-semibold">{formatCurrency(studio.hourlyRate)}</span>
          <span className="text-muted-foreground"> / hour</span>
        </p>
        <span className="flex items-center gap-1 text-sm font-medium">
          <Star className="size-4 fill-primary text-primary" />
          {studio.reviewCount > 0 ? studio.rating.toFixed(1) : "New"}
        </span>
      </div>

      <dl className="my-6 space-y-3 border-y border-border py-5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="size-4 text-primary" />Security deposit</dt>
          <dd className="font-medium">{formatCurrency(studio.securityDeposit)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-muted-foreground"><Users className="size-4 text-primary" />Capacity</dt>
          <dd className="font-medium">Up to {studio.maxCapacity} guests</dd>
        </div>
      </dl>

      <BookAction studio={studio} className="w-full" />

            <p className="mt-4 text-center text-xs text-muted-foreground">
        {isOwner
          ? "This is your listing. Creators see a booking button here."
          : "You won't be charged yet. The host confirms your request first, and the deposit is refundable."}
      </p>
    </aside>
  );
}

export function MobileBookingBar({ studio }: { studio: Studio }) {
  return (
    <div className="glass-strong fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-4 rounded-2xl p-3 pl-5 shadow-2xl lg:hidden">
      <p>
        <span className="text-xl font-semibold">{formatCurrency(studio.hourlyRate)}</span>
        <span className="text-sm text-muted-foreground"> /hr</span>
      </p>
      <BookAction studio={studio} className="px-6" />
    </div>
  );
}