import { CategoryGrid, type CategorySummary } from "@/components/home/category-grid";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { HeroSlider } from "@/components/home/hero-slider";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { HowBookingWorks } from "@/components/home/how-booking-works";
import { CATEGORIES } from "@/lib/constants";
import { serverFetch } from "@/lib/server-api";
import type { Studio, StudioListResponse } from "@/types/studio";

export default async function HomePage() {
  // All requests run in parallel. Each category request returns its top-rated
  // studio (for the card photo) and the total count (for "N studios available").
  const [featured, ...categoryResults] = await Promise.all([
    serverFetch<Studio[]>("/studios/featured"),
    ...CATEGORIES.map((category) =>
      serverFetch<StudioListResponse>(`/studios?category=${encodeURIComponent(category)}&limit=1`)
    ),
  ]);

  const featuredStudios = (featured as Studio[] | null) ?? [];
  const heroImages = featuredStudios.slice(0, 3).map((studio) => studio.images[0]);

  const categories: CategorySummary[] = CATEGORIES.map((name, i) => {
    const result = categoryResults[i] as StudioListResponse | null;
    return {
      name,
      count: result?.pagination.total ?? 0,
      image: result?.studios[0]?.images[0],
    };
  });

  return (
    <>
      <HeroSlider images={heroImages} />
      <FeaturedStudios studios={featuredStudios} />
      <CategoryGrid categories={categories} />
      <HowBookingWorks />
      <HostGuarantee />
    </>
  );
}