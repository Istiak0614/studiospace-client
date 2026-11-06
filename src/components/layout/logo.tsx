import Link from "next/link";
import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="StudioSpace home" className={cn("group flex items-center gap-2.5", className)}>
      {/* Aperture icon in an amber→violet tile; it spins half a turn on hover */}
      <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-accent/30">
        <Aperture className="size-5 transition-transform duration-700 group-hover:rotate-180" />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">
        Studio<span className="text-gradient">Space</span>
      </span>
    </Link>
  );
}