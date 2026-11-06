import { SearchX, ServerCrash } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { serverFetch } from "@/lib/server-api";
import type { StudioListResponse } from "@/types/studio";
import { Pagination } from "./pagination";
import { StudioCard } from "./studio-card";

export async function StudioResults({ query }: { query: string }) {
  const apiParams = new URLSearchParams(query);
  apiParams.set("limit", "12");

  const data = await serverFetch<StudioListResponse>(`/studios?${apiParams}`, 0);

  if (!data) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Couldn't load studios"
        description="Something went wrong on our side. Please refresh the page in a moment."
      />
    );
  }

  const { studios, pagination } = data;

  if (studios.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No studios match your search"
        description="Try a different keyword, widen the price range or pick another category."
        action={{ href: "/studios", label: "Clear all filters" }}
      />
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{studios.length}</span> of{" "}
        <span className="font-semibold text-foreground">{pagination.total}</span>{" "}
        {pagination.total === 1 ? "studio" : "studios"}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio, i) => (
          <Reveal key={studio._id} delay={(i % 3) * 0.08} className="h-full">
            <StudioCard studio={studio} />
          </Reveal>
        ))}
      </div>

      <Pagination page={pagination.page} totalPages={pagination.totalPages} query={query} />
    </>
  );
}