import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  action?: { href: string; label: string };
}

export function SectionHeading({ eyebrow, title, highlight, description, action }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
        <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">
          {title} <span className="text-gradient italic">{highlight}</span>
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">{description}</p>
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}