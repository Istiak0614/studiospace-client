"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Building2, Eye, MapPin, Pencil, Plus, ServerCrash, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Studio } from "@/types/studio";

function ListingSkeleton() {
  return (
    <div className="glass flex flex-col overflow-hidden rounded-3xl sm:flex-row">
      <Skeleton className="aspect-4/3 rounded-none sm:aspect-auto sm:h-44 sm:w-60" />
      <div className="flex-1 space-y-3 p-5">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function MyListings() {
  const [studios, setStudios] = useState<Studio[] | null>(null); // null = still loading
  const [failed, setFailed] = useState(false);
  const [toDelete, setToDelete] = useState<Studio | null>(null);

  useEffect(() => {
    apiRequest<Studio[]>("/studios/mine")
      .then(setStudios)
      .catch(() => setFailed(true));
  }, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    const res = await apiRequest<{ message: string }>(`/studios/${toDelete._id}`, { method: "DELETE" });
    setStudios((prev) => prev?.filter((s) => s._id !== toDelete._id) ?? null);
    toast.success(res.message);
  };

  if (failed) {
    return <EmptyState icon={ServerCrash} title="Couldn't load your listings" description="Please refresh the page in a moment." />;
  }

  if (!studios) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        {Array.from({ length: 3 }, (_, i) => <ListingSkeleton key={i} />)}
      </div>
    );
  }

  if (studios.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No listings yet"
        description="List your first creative space and start earning from the hours it sits empty."
        action={{ href: "/add-studio", label: "Add your first studio" }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{studios.length}</span> {studios.length === 1 ? "studio" : "studios"} listed
        </p>
        <Button nativeButton={false} render={<Link href="/add-studio" />} className="rounded-full px-5">
          <Plus className="size-4" />
          Add new studio
        </Button>
      </div>

      <ul className="space-y-5">
        <AnimatePresence initial={false}>
          {studios.map((studio, i) => (
            <motion.li
              key={studio._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
              exit={{ opacity: 0, x: -40, height: 0, marginTop: 0, transition: { duration: 0.35 } }}
              className="glass group flex flex-col overflow-hidden rounded-3xl sm:flex-row"
            >
              <Link href={`/studios/${studio._id}`} className="relative aspect-4/3 shrink-0 overflow-hidden sm:aspect-auto sm:h-auto sm:w-60">
                <Image src={studio.images[0]} alt={studio.title} fill sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </Link>

              <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">{studio.category}</span>
                  <h3 className="mt-2 truncate font-sans text-lg font-semibold tracking-normal">{studio.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0 text-primary" />
                    <span className="truncate">{studio.location}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                    <span className="font-semibold">{formatCurrency(studio.hourlyRate)}<span className="font-normal text-muted-foreground">/hr</span></span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Star className="size-4 fill-primary text-primary" />
                      {studio.reviewCount > 0 ? `${studio.rating.toFixed(1)} (${studio.reviewCount})` : "No reviews yet"}
                    </span>
                    <span className="text-muted-foreground">Listed {formatDate(studio.createdAt, { day: true })}</span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button nativeButton={false} render={<Link href={`/studios/${studio._id}`} />}
                    variant="ghost" size="icon" aria-label="View studio" className="rounded-full">
                    <Eye className="size-4" />
                  </Button>
                  <Button nativeButton={false} render={<Link href={`/studios/edit/${studio._id}`} />}
                    variant="outline" className="rounded-full">
                    <Pencil className="size-4" />
                    Update
                  </Button>
                  <Button variant="outline" onClick={() => setToDelete(studio)}
                    className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete this studio?"
        description={`"${toDelete?.title}" will be removed permanently, and any pending requests for it will be cancelled.`}
        confirmLabel="Yes, delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}