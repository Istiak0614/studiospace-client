import { Reveal } from "./reveal";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
}

export function PageHeader({ eyebrow, title, highlight, description }: PageHeaderProps) {
  return (
    <Reveal className="mx-auto max-w-3xl py-12 text-center sm:py-16">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
        {title} <span className="text-gradient italic">{highlight}</span>
      </h1>
      <p className="mt-4 text-muted-foreground sm:text-lg">{description}</p>
    </Reveal>
  );
}