import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { StudioCard } from "@/components/studio/studio-card";
import type { Studio } from "@/types/studio";

export function FeaturedStudios({ studios }: { studios: Studio[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Featured spaces"
        title="Top-rated"
        highlight="studios"
        description="The highest-rated spaces on StudioSpace, chosen by the creators who booked them."
        action={{ href: "/studios", label: "View all studios" }}
      />

      {studios.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No studios yet"
          description="Be the first host to list a creative space on StudioSpace."
          action={{ href: "/add-studio", label: "List your studio" }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio, i) => (
            <Reveal key={studio._id} delay={(i % 3) * 0.1} className="h-full">
              <StudioCard studio={studio} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}