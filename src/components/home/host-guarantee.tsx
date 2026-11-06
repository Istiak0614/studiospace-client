import Link from "next/link";
import {
  BellRing, CalendarX2, Headset, Lock, Receipt, ShieldCheck, Star, UserCheck, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

interface Panel {
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
  points: { icon: LucideIcon; title: string; text: string }[];
  cta: { href: string; label: string; variant: "default" | "outline" };
  glow: string;
}

const PANELS: Panel[] = [
  {
    icon: ShieldCheck,
    label: "Host Guarantee",
    title: "Your space, protected",
    text: "List with confidence. You stay in control of who books, when, and how your studio is presented.",
    points: [
      { icon: Lock, title: "Security deposit on every booking", text: "Set your own refundable deposit to cover gear and damage." },
      { icon: CalendarX2, title: "Zero double bookings", text: "Overlapping requests for confirmed hours are blocked automatically." },
      { icon: UserCheck, title: "Owner-only control", text: "Only you can edit or delete your listings, enforced on our servers." },
    ],
    cta: { href: "/add-studio", label: "List your studio", variant: "default" },
    glow: "from-primary/20",
  },
  {
    icon: Headset,
    label: "Creator Support",
    title: "Book without the guesswork",
    text: "Everything you need to know is on the page before you request a single hour.",
    points: [
      { icon: Receipt, title: "Transparent pricing", text: "Hourly rate × hours + deposit. The total is shown before you book." },
      { icon: BellRing, title: "Track every request", text: "Follow each booking from Pending to Confirmed to Completed." },
      { icon: Star, title: "Honest reviews", text: "Only creators with a completed booking can leave a review." },
    ],
    cta: { href: "/studios", label: "Explore studios", variant: "outline" },
    glow: "from-accent/20",
  },
];

export function HostGuarantee() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Peace of mind"
        title="A marketplace built on"
        highlight="trust"
        description="Clear rules for hosts and creators, so every session starts on the right foot."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {PANELS.map((panel, i) => (
          <Reveal key={panel.label} delay={i * 0.15} className="h-full">
            <article
              className={cn(
                "glass relative flex h-full flex-col overflow-hidden rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-1 sm:p-10",
                "bg-linear-to-br to-transparent",
                panel.glow
              )}
            >
              <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em]">
                <panel.icon className="size-4 text-primary" />
                {panel.label}
              </span>

              <h3 className="text-3xl font-semibold">{panel.title}</h3>
              <p className="mt-3 text-muted-foreground">{panel.text}</p>

              <ul className="my-8 space-y-5">
                {panel.points.map((point) => (
                  <li key={point.title} className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                      <point.icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium">{point.title}</p>
                      <p className="text-sm text-muted-foreground">{point.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Button
                nativeButton={false}
                render={<Link href={panel.cta.href} />}
                variant={panel.cta.variant}
                className="mt-auto w-fit rounded-full px-6"
              >
                {panel.cta.label}
              </Button>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}