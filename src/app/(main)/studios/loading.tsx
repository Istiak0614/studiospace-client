import { Skeleton } from "@/components/ui/skeleton";
import { StudioGridSkeleton } from "@/components/studio/studio-card-skeleton";

export default function StudiosLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 py-12 sm:py-16">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-5 w-2/3" />
      </div>
      <Skeleton className="mb-10 h-32 rounded-3xl" />
      <StudioGridSkeleton count={6} />
    </section>
  );
}