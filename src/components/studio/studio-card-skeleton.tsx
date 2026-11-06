import { Skeleton } from "@/components/ui/skeleton";

export function StudioCardSkeleton() {
  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-3xl">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/5" />
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <StudioCardSkeleton key={i} />
      ))}
    </div>
  );
}