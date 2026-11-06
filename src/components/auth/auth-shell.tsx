"use client";

import { motion } from "motion/react";
import { Aperture, Check } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  asideHeading: string;
  asidePoints: string[];
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, asideHeading, asidePoints, children }: AuthShellProps) {
  return (
    <section className="px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass mx-auto grid max-w-5xl overflow-hidden rounded-3xl lg:grid-cols-2"
      >
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-accent/30 via-transparent to-primary/25 p-10 lg:flex">
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -right-24 -top-24 text-foreground/10"
          >
            <Aperture className="size-96" strokeWidth={0.6} />
          </motion.div>

          <p className="relative text-xs uppercase tracking-[0.35em] text-muted-foreground">StudioSpace</p>

          <div className="relative space-y-6">
            <h2 className="text-3xl font-semibold leading-tight">{asideHeading}</h2>
            <ul className="space-y-3">
              {asidePoints.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                  {point}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="mb-8 mt-2 text-sm text-muted-foreground">{subtitle}</p>
          {children}
        </div>
      </motion.div>
    </section>
  );
}