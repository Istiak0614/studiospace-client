import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { href: string; label: string };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass mx-auto flex max-w-lg flex-col items-center rounded-3xl px-8 py-14 text-center">
      <span className="mb-6 grid size-16 place-items-center rounded-2xl bg-linear-to-br from-primary/25 to-accent/25 text-primary">
        <Icon className="size-8" />
      </span>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
      {action && (
        <Button nativeButton={false} render={<Link href={action.href} />} className="mt-6 rounded-full px-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}