import type { Metadata } from "next";
import { Check } from "lucide-react";
import { JourneyTabs } from "@/components/info/journey-tabs";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = { title: "How It Works | StudioSpace" };

const FAQS = [
  { q: "Do I pay when I send a booking request?", a: "No. A request starts as Pending and nothing is charged. The host confirms it first, and the invoice in My Bookings shows exactly what you owe for the session." },
  { q: "Can I cancel a booking?", a: "Yes. You can cancel any request while it's still Pending, straight from My Bookings. Once a host has confirmed it, contact them directly to make changes." },
  { q: "What if two people want the same hours?", a: "Hours that are already confirmed can't be requested. If several pending requests overlap, the first one the host confirms wins and the others are declined automatically, so double bookings are impossible." },
  { q: "How long can I book a studio for?", a: "Bookings are in whole hours, from 1 to 12 hours at a time, between 08:00 and 22:00." },
  { q: "Is the security deposit refunded?", a: "Yes. The deposit protects the host's space and gear, and it's returned after your session if everything is left in good condition." },
  { q: "How are studio ratings calculated?", a: "A rating is the average of reviews from creators who completed a booking there. Each completed booking can be reviewed once, so every rating comes from a real session." },
  { q: "Can I list more than one studio?", a: "Absolutely. Add as many spaces as you like from Add Studio, and manage them all from My Listings and your dashboard." },
  { q: "Do I need an account to browse?", a: "No. Anyone can explore studios, read reviews and check availability. You only need an account to book, save favourites or list a space." },
];

export default function HowItWorksPage() {
  return (
    <div className="px-4 sm:px-6">
      <PageHeader
        eyebrow="How it works"
        title="Simple for creators,"
        highlight="fair for hosts"
        description="Whether you're booking your next shoot or renting out your space, here's exactly what happens at every step."
      />

      <section className="mx-auto max-w-7xl">
        <JourneyTabs />
      </section>

      <section className="mx-auto max-w-7xl py-24">
        <SectionHeading eyebrow="Pricing" title="No surprises," highlight="ever"
          description="The total is shown before you send a request. Here's how a typical booking adds up." />
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="glass rounded-3xl p-8">
            <p className="text-sm text-muted-foreground">Example · Daylight Loft Photo Studio · 3 hours</p>
            <dl className="mt-6 space-y-4">
              <div className="flex justify-between"><dt className="text-muted-foreground">$45 × 3 hours</dt><dd className="font-medium">$135</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Security deposit (refundable)</dt><dd className="font-medium">$100</dd></div>
              <div className="flex items-end justify-between border-t border-border pt-4">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-4xl font-semibold text-gradient">$235</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.1} className="glass rounded-3xl p-8">
            <ul className="space-y-4">
              {[
                "Hourly rate × hours, set by the host and shown on every card",
                "One refundable deposit per booking, returned after a smooth session",
                "No booking fees and no hidden extras",
                "A downloadable PDF invoice once your booking is confirmed",
              ].map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"><Check className="size-3.5" /></span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Questions," highlight="answered"
          description="Everything creators and hosts ask us most often." />
        <Reveal className="glass rounded-3xl px-6 py-2 sm:px-8">
          <Accordion>
            {FAQS.map(({ q, a }, i) => (
              <AccordionItem key={q} value={`faq-${i}`}>
                <AccordionTrigger className="py-5 text-left text-base font-medium">{q}</AccordionTrigger>
                <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      <CtaBand title="Ready when you are" text="Find a space for your next project, or turn your empty hours into income." />
    </div>
  );
}