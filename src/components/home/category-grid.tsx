import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, Clapperboard, Mic, Music, Palette, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { categoryHref, type StudioCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<StudioCategory, { icon: LucideIcon; description: string }> = {
  "Photo Studio": { icon: Camera, description: "Daylight lofts, cycloramas and portrait rooms with pro lighting ready to go." },
  "Film & Sound Stage": { icon: Clapperboard, description: "Full stages with lighting grids, green screens and drive-in access." },
  "Podcast Lounge": { icon: Mic, description: "Treated rooms with broadcast mics and multi-camera video setups." },
  "Music Suite": { icon: Music, description: "Tracking rooms, isolation booths and rehearsal spaces with backline." },
  "Art Workshop": { icon: Palette, description: "Bright, roomy workshops for painting, pottery and group classes." },
};

export interface CategorySummary {
  name: StudioCategory;
  count: number;
  image?: string; 
}

export function CategoryGrid({ categories }: { categories: CategorySummary[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Browse by category"
        title="Every kind of"
        highlight="creative space"
        description="Whether you shoot, film, record or paint, there's a room built for the way you work."
      />

      <div className="grid auto-rows-[220px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, i) => {
          const { icon: Icon, description } = CATEGORY_META[category.name];
          const featured = i === 0;

          return (
            <Reveal
              key={category.name}
              delay={i * 0.08}
              className={cn("h-full", featured && "sm:col-span-2 lg:row-span-2")}
            >
              <Link
                href={categoryHref(category.name)}
                className="group relative flex h-full flex-col justify-end overflow-hidden rounded-3xl border border-border p-6 shadow-lg transition-shadow duration-500 hover:shadow-2xl hover:shadow-accent/20"
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes={featured ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 640px) 100vw, 320px"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-accent/50 to-primary/40" />
                )}
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10" />

                <span className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="size-5" />
                </span>

                <div className="relative text-white">
                  <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-md transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="size-6" />
                  </span>
                  <h3 className={cn("font-semibold", featured ? "text-3xl sm:text-4xl" : "text-xl")}>{category.name}</h3>
                  <p className="mt-1 text-sm text-white/75">
                    {category.count} {category.count === 1 ? "studio" : "studios"} available
                  </p>
                  {featured && <p className="mt-3 max-w-sm text-white/80">{description}</p>}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}