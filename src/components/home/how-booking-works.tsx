"use client";

import { motion } from "motion/react";
import { CalendarCheck, Search, Send, Sparkles } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const STEPS = [
  { icon: Search, title: "Discover", text: "Browse studios by category, price and location, and compare amenities at a glance." },
  { icon: CalendarCheck, title: "Pick your hours", text: "Choose a date and time. Confirmed slots are greyed out, so you never request a taken hour." },
  { icon: Send, title: "Request to book", text: "See the full price upfront: hours × rate plus a refundable deposit. The host confirms your request." },
  { icon: Sparkles, title: "Create", text: "Show up, set up and make your best work. Leave a review once your session is complete." },
];

export function HowBookingWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="glass rounded-[2rem] px-6 py-16 sm:px-12">
        <SectionHeading
          eyebrow="How booking works"
          title="From idea to session in"
          highlight="four steps"
          description="No phone calls, no back-and-forth emails. Just pick a space and request your hours."
        />

        <div className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-border lg:block" />
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px origin-left bg-linear-to-r from-primary via-accent to-primary lg:block"
          />

          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={0.2 + i * 0.25} className="relative text-center">
              <div className="relative mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-primary-foreground shadow-xl shadow-accent/30">
                <Icon className="size-7" />
                <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full border border-border bg-background text-xs font-semibold text-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}