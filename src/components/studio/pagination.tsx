import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  query: string; 
}

export function Pagination({ page, totalPages, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams(query);
    if (target === 1) params.delete("page");
    else params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/studios?${qs}` : "/studios";
  };

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

  const base = "grid size-10 place-items-center rounded-full text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} aria-label="Previous page" className={cn(base, "glass hover:text-primary")}>
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(base, "glass opacity-40")}><ChevronLeft className="size-4" /></span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            base,
            p === page ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "glass hover:text-primary"
          )}
        >
          {p}
        </Link>
      ))}

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} aria-label="Next page" className={cn(base, "glass hover:text-primary")}>
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(base, "glass opacity-40")}><ChevronRight className="size-4" /></span>
      )}
    </nav>
  );
}