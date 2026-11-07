import type { Metadata } from "next";
import Link from "next/link";
import { Aperture, ArrowLeft, Compass } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found | StudioSpace" };

function StudioLightIllustration() {
  return (
    <svg viewBox="0 0 260 200" className="h-44 w-auto text-foreground/80" aria-hidden>
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--primary)", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "var(--primary)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <polygon points="92,44 255,150 255,196 130,196" fill="url(#beam)" />
      <line x1="10" y1="196" x2="250" y2="196" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <g transform="rotate(28 70 46)">
        <rect x="44" y="24" width="52" height="44" rx="6" fill="currentColor" />
        <rect x="90" y="28" width="8" height="36" rx="2" style={{ fill: "var(--primary)" }} />
      </g>
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <line x1="66" y1="70" x2="66" y2="148" />
        <line x1="66" y1="148" x2="36" y2="194" />
        <line x1="66" y1="148" x2="66" y2="194" />
        <line x1="66" y1="148" x2="96" y2="194" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="grid min-h-[calc(100vh-5rem)] place-items-center px-4 py-16">
        <div className="glass flex max-w-2xl flex-col items-center rounded-[2rem] px-8 py-14 text-center sm:px-16">
          <StudioLightIllustration />

          <div className="mt-6 flex items-center gap-2 font-display text-8xl font-semibold leading-none sm:text-9xl">
            <span className="text-gradient">4</span>
            <Aperture className="size-20 animate-spin text-primary [animation-duration:6s] sm:size-24" strokeWidth={1.5} />
            <span className="text-gradient">4</span>
          </div>

          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">This set is empty</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            The page you&apos;re looking for has wrapped, moved or never made it past the script.
            Let&apos;s get you back to the studio.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button nativeButton={false} render={<Link href="/" />} size="lg" className="h-12 rounded-full px-7 shadow-xl shadow-primary/30">
              <ArrowLeft className="size-4" />
              Return to Home
            </Button>
            <Button nativeButton={false} render={<Link href="/studios" />} size="lg" variant="outline" className="h-12 rounded-full px-7">
              <Compass className="size-4" />
              Explore studios
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}