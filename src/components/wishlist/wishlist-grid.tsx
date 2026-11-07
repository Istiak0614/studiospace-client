"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, ServerCrash } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StudioCard } from "@/components/studio/studio-card";
import { StudioGridSkeleton } from "@/components/studio/studio-card-skeleton";
import { apiRequest } from "@/lib/api";
import type { Studio } from "@/types/studio";
import { useWishlist } from "./wishlist-provider";

export function WishlistGrid() {
  const { ready, isSaved } = useWishlist();
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    apiRequest<Studio[]>("/wishlist").then(setStudios).catch(() => setFailed(true));
  }, []);

  const visible = studios ? (ready ? studios.filter((s) => isSaved(s._id)) : studios) : [];

  return (
    <div className="space-y-6 pb-16">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Wishlist</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Saved <span className="text-gradient italic">studios</span></h1>
        <p className="mt-2 text-muted-foreground">Spaces you&apos;ve hearted, ready for your next session.</p>
      </div>

      {failed ? (
        <EmptyState icon={ServerCrash} title="Couldn't load your wishlist" description="Please refresh the page in a moment." />
      ) : !studios ? (
        <StudioGridSkeleton count={3} />
      ) : visible.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Tap the heart on any studio to save it here."
          action={{ href: "/studios", label: "Explore studios" }} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((studio) => (
              <motion.div key={studio._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }} className="h-full">
                <StudioCard studio={studio} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}