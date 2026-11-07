"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BadgeCheck, Building2, CalendarCheck, Camera, Inbox, Search, Send, Sparkles, TrendingUp, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = { icon: LucideIcon; title: string; text: string };

const JOURNEYS: Record<"creators" | "hosts", { label: string; icon: LucideIcon; steps: Step[] }> = {
  creators: {
    label: "For creators",
    icon: Camera,
    steps: [
      { icon: Search, title: "Search & compare", text: "Filter by category, price and neighbourhood. Every listing shows real photos, amenities and reviews." },
      { icon: CalendarCheck, title: "Check availability", text: "Pick a day and see which hours are free. Confirmed bookings are greyed out, so you never request a taken slot." },
      { icon: Send, title: "Send a request", text: "Choose your hours and see the full price before you send. The host confirms, and you track it in My Bookings." },
      { icon: Sparkles, title: "Create & review", text: "Make your best work, download your invoice, then leave a review once the session is complete." },
    ],
  },
  hosts: {
    label: "For hosts",
    icon: Building2,
    steps: [
      { icon: Building2, title: "List your space", text: "Add up to five photos, your hourly rate, deposit, capacity and amenities. It's live the moment you publish." },
      { icon: Inbox, title: "Review requests", text: "New requests land in your dashboard inbox, with the guest, time and your earnings at a glance." },
      { icon: BadgeCheck, title: "Confirm with one click", text: "Confirming locks the slot. Overlapping requests are declined automatically, so double bookings can't happen." },
      { icon: TrendingUp, title: "Earn & grow", text: "Watch earnings build on your dashboard chart, and let honest reviews bring the next creator to your door." },
    ],
  },
};

export function JourneyTabs() {
  const [tab, setTab] = useState<keyof typeof JOURNEYS>("creators");

  return (
    <div>
      <div className="glass mx-auto mb-10 flex w-fit gap-1 rounded-full p-1.5">
        {(Object.keys(JOURNEYS) as (keyof typeof JOURNEYS)[]).map((key) => {
          const { label, icon: Icon } = JOURNEYS[key];
          return (
            <button key={key} type="button" onClick={() => setTab(key)}
              className={cn("relative isolate flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                tab === key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {tab === key && <motion.span layoutId="journey-tab" className="absolute inset-0 -z-10 rounded-full bg-primary shadow-lg shadow-primary/30"
                transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.ol key={tab} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEYS[tab].steps.map(({ icon: Icon, title, text }, i) => (
            <motion.li key={title}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              className="glass relative rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
              <span className="absolute right-5 top-4 font-display text-5xl font-semibold text-foreground/10">{i + 1}</span>
              <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-accent/30">
                <Icon className="size-6" />
              </span>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
}