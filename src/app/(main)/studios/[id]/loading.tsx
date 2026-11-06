import { Skeleton } from "@/components/ui/skeleton";

export default function StudioDetailsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
      <Skeleton className="mb-6 h-4 w-32" />
      <Skeleton className="mb-4 h-6 w-28 rounded-full" />
      <Skeleton className="mb-4 h-12 w-2/3" />
      <Skeleton className="mb-8 h-4 w-1/2" />
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Skeleton className="aspect-16/10 w-full rounded-3xl" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="hidden h-80 rounded-3xl lg:block" />
      </div>
    </section>
  );
}