import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <Reveal className="relative mx-auto my-24 max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-linear-to-br from-accent/30 via-background/60 to-primary/25 px-8 py-14 text-center shadow-2xl shadow-accent/10 sm:px-16">
      <h2 className="text-3xl font-semibold sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">{text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/studios" />} size="lg" className="group h-12 rounded-full px-7 shadow-xl shadow-primary/30">
          Explore studios
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button nativeButton={false} render={<Link href="/add-studio" />} size="lg" variant="outline" className="glass h-12 rounded-full px-7">
          List your studio
        </Button>
      </div>
    </Reveal>
  );
}