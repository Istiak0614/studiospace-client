import { Aperture } from "lucide-react";

export function BrandLoader({ label = "Setting the stage..." }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/30" />
          <span className="relative grid size-16 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-primary-foreground shadow-2xl shadow-accent/40">
            <Aperture className="size-8 animate-spin [animation-duration:2.5s]" />
          </span>
        </div>
        <p className="text-sm tracking-widest text-muted-foreground uppercase">{label}</p>
      </div>
    </div>
  );
}