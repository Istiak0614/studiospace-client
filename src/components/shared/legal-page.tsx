import { Reveal } from "./reveal";

interface LegalPageProps {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}

export function LegalPage({ title, updated, sections }: LegalPageProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <Reveal className="mb-10 text-center">
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
      </Reveal>
      <Reveal delay={0.1} className="glass space-y-8 rounded-3xl p-8 sm:p-10">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="mb-2 text-xl font-semibold">{s.heading}</h2>
            <p className="leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}