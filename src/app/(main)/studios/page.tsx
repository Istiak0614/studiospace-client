import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { StudioGridSkeleton } from "@/components/studio/studio-card-skeleton";
import { StudioFilters } from "@/components/studio/studio-filters";
import { StudioResults } from "@/components/studio/studio-results";
import { serverFetch } from "@/lib/server-api";
import type { StudioListResponse } from "@/types/studio";

export const metadata: Metadata = { title: "Explore Studios | StudioSpace" };

const FILTER_KEYS = ["q", "category", "minPrice", "maxPrice", "sort", "page"] as const;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const toNumber = (value?: string) => (value && !Number.isNaN(Number(value)) ? Number(value) : undefined);

export default async function StudiosPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;

  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = first(raw[key]);
    if (value) params.set(key, value);
  }
  const query = params.toString();

  const meta = await serverFetch<StudioListResponse>("/studios?limit=1", 300);
  const priceBounds = meta?.priceRange ?? { min: 0, max: 0 };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
      <PageHeader
        eyebrow="Explore"
        title="Find your next"
        highlight="studio"
        description="Search by name or neighbourhood, filter by category and budget, and book by the hour."
      />

      <StudioFilters
        initial={{
          q: params.get("q") ?? "",
          category: params.get("category") ?? "",
          minPrice: toNumber(params.get("minPrice") ?? undefined),
          maxPrice: toNumber(params.get("maxPrice") ?? undefined),
          sort: params.get("sort") ?? "rating",
        }}
        priceBounds={priceBounds}
      />

      <Suspense key={query} fallback={<StudioGridSkeleton count={6} />}>
        <StudioResults query={query} />
      </Suspense>
    </section>
  );
}