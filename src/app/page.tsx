import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

async function getApiStatus() {
  try {
    const res = await fetch(`${process.env.API_URL}/api/health`, { cache: "no-store" });
    return res.ok ? "connected" : "unreachable";
  } catch {
    return "unreachable";
  }
}

export default async function Home() {
  const status = await getApiStatus();

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="glass w-full max-w-lg space-y-6 rounded-3xl p-10 text-center">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Setting the stage</p>
        <h1 className="text-5xl font-semibold">
          <span className="text-gradient">StudioSpace</span>
        </h1>
        <p className="text-muted-foreground">
          Book photo studios, film stages, podcast lounges and music suites by the hour.
        </p>
        <Button size="lg" className="rounded-full px-8">Explore Studios</Button>
        <p className="text-xs text-muted-foreground">
          API status:{" "}
          <span className={status === "connected" ? "text-primary" : "text-destructive"}>{status}</span>
        </p>
      </div>
    </main>
  );
}