import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, Scale, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { CATEGORIES } from "@/lib/constants";
import { serverFetch } from "@/lib/server-api";
import type { Studio, StudioListResponse } from "@/types/studio";

export const metadata: Metadata = { title: "About Us | StudioSpace" };

const VALUES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Sparkles, title: "Craft comes first", text: "Every feature exists to get creators into the right room faster, with the right light, sound and gear." },
  { icon: Scale, title: "Fair and transparent", text: "Prices, deposits and availability are visible before anyone commits. No fees hidden in the small print." },
  { icon: ShieldCheck, title: "Trust by design", text: "Owner-only controls, confirmed-slot protection and reviews from real sessions keep everyone honest." },
  { icon: HeartHandshake, title: "Local and creative", text: "We champion independent studios and the neighbourhoods they're in, one booking at a time." },
];

export default async function AboutPage() {
  const [list, featured] = await Promise.all([
    serverFetch<StudioListResponse>("/studios?limit=1", 300),
    serverFetch<Studio[]>("/studios/featured", 300),
  ]);
  const images = (featured ?? []).slice(0, 2).map((s) => s.images[0]);

  const stats = [
    { value: list?.pagination.total ?? 0, label: "Studios listed" },
    { value: CATEGORIES.length, label: "Creative categories" },
    { value: list?.priceRange.min ?? 0, prefix: "$", suffix: "/hr", label: "Lowest hourly rate" },
    { value: 0, label: "Double bookings, by design" },
  ];

  return (
    <div className="px-4 sm:px-6">
      <PageHeader
        eyebrow="About us"
        title="Built for the people who"
        highlight="make things"
        description="StudioSpace connects creators with professional spaces, and helps studio owners share the hours their rooms would otherwise sit empty."
      />

      <section className="mx-auto grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="glass rounded-3xl p-6 text-center">
            <p className="font-display text-4xl font-semibold text-gradient sm:text-5xl">
              <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 py-24 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-primary">Our mission</p>
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">
            Great work shouldn&apos;t depend on <span className="text-gradient italic">where it&apos;s made</span>
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Photographers, podcasters, musicians and filmmakers lose hours hunting for a space that fits their
              project and their budget. Meanwhile, beautifully equipped studios sit empty between sessions.
            </p>
            <p>
              StudioSpace brings both sides together with hourly bookings, honest pricing and live availability.
              Creators find the right room in minutes, and hosts turn quiet hours into steady income without the back-and-forth.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative h-96">
          {images[0] && (
            <div className="absolute left-0 top-0 h-72 w-3/4 overflow-hidden rounded-3xl border border-border shadow-2xl">
              <Image src={images[0]} alt="" fill sizes="(max-width: 1024px) 75vw, 480px" className="object-cover" />
            </div>
          )}
          {images[1] && (
            <div className="absolute bottom-0 right-0 h-56 w-1/2 overflow-hidden rounded-3xl border-4 border-background shadow-2xl">
              <Image src={images[1]} alt="" fill sizes="(max-width: 1024px) 50vw, 320px" className="object-cover" />
            </div>
          )}
          <div aria-hidden className="absolute -bottom-6 left-10 -z-10 size-40 rounded-full bg-accent/30 blur-3xl" />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="What we value" title="The principles behind" highlight="every booking"
          description="Four ideas shape how StudioSpace works, from the first search to the final review." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="glass rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
              <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary"><Icon className="size-6" /></span>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand title="Join the community" text="Book a space that matches your vision, or share yours with creators who'll treat it with care." />
    </div>
  );
}