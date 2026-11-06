import { HeroSlider } from "@/components/home/hero-slider";
import { serverFetch } from "@/lib/server-api";
import type { Studio } from "@/types/studio";

export default async function HomePage() {
  const featured = (await serverFetch<Studio[]>("/studios/featured")) ?? [];
  const heroImages = featured.slice(0, 3).map((studio) => studio.images[0]);

  return (
    <>
      <HeroSlider images={heroImages} />
    </>
  );
}