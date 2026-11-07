"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { formatCurrency } from "@/lib/format";
import type { Studio } from "@/types/studio";
import { TiltCard } from "./tilt-card";

export function StudioCard({ studio }: { studio: Studio }) {
  const href = `/studios/${studio._id}`;

  return (
    <TiltCard>
      <article className="glass flex h-full flex-col overflow-hidden rounded-3xl transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-accent/20">
        <div className="relative aspect-4/3 overflow-hidden">
          <Link href={href} className="absolute inset-0" aria-label={studio.title}>
            <Image
              src={studio.images[0]}
              alt={studio.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/10" />

            <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {studio.category}
            </span>

            <span className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
              <Star className="size-3.5 fill-primary text-primary" />
              {studio.reviewCount > 0 ? (
                <>
                  {studio.rating.toFixed(1)}
                  <span className="font-normal text-white/70">({studio.reviewCount})</span>
                </>
              ) : (
                "New"
              )}
            </span>
          </Link>

          <WishlistButton studioId={studio._id} className="absolute right-4 top-4 z-10" />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-1 font-sans text-lg font-semibold tracking-normal">
            <Link href={href} className="transition-colors hover:text-primary">{studio.title}</Link>
          </h3>

          <div className="mb-5 mt-2 space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span className="truncate">{studio.location}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Users className="size-4 shrink-0 text-primary" />
              Up to {studio.maxCapacity} guests
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
            <p>
              <span className="text-2xl font-semibold">{formatCurrency(studio.hourlyRate)}</span>
              <span className="text-sm text-muted-foreground"> /hr</span>
            </p>
            <Button nativeButton={false} render={<Link href={href} />} size="sm" className="group/btn rounded-full px-4">
              View Details
              <ArrowUpRight className="size-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}