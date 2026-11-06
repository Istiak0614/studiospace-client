"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpDown, Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export interface FilterValues {
  q: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  sort: string;
}

interface StudioFiltersProps {
  initial: FilterValues;                     
  priceBounds: { min: number; max: number }; 
}

export function StudioFilters({ initial, priceBounds }: StudioFiltersProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasRange = priceBounds.max > priceBounds.min;
  const toState = (values: FilterValues) => ({
    q: values.q,
    category: values.category,
    sort: values.sort || "rating",
    price: [values.minPrice ?? priceBounds.min, values.maxPrice ?? priceBounds.max],
  });

  const [filters, setFilters] = useState(() => toState(initial));

  useEffect(() => {
    setFilters((prev) => ({
      ...toState(initial),
      q: document.activeElement === searchRef.current ? prev.q : initial.q,
    }));
  }, [initial.q, initial.category, initial.minPrice, initial.maxPrice, initial.sort, priceBounds.min, priceBounds.max]);

  const pushFilters = (next: typeof filters) => {
    const params = new URLSearchParams();
    if (next.q.trim()) params.set("q", next.q.trim());
    if (next.category) params.set("category", next.category);
    if (hasRange && next.price[0] > priceBounds.min) params.set("minPrice", String(next.price[0]));
    if (hasRange && next.price[1] < priceBounds.max) params.set("maxPrice", String(next.price[1]));
    if (next.sort !== "rating") params.set("sort", next.sort);

    const query = params.toString();
    router.push(query ? `/studios?${query}` : "/studios", { scroll: false });
  };

  const update = (changes: Partial<typeof filters>, pushNow = true) => {
    const next = { ...filters, ...changes };
    setFilters(next);
    if (pushNow) pushFilters(next);
    return next;
  };

  const handleSearch = (value: string) => {
    const next = update({ q: value }, false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => pushFilters(next), 400);
  };

  const clearAll = () => {
    setFilters(toState({ q: "", category: "", sort: "rating" }));
    router.push("/studios", { scroll: false });
  };

  const isFiltered =
    !!filters.q || !!filters.category || filters.sort !== "rating" ||
    (hasRange && (filters.price[0] > priceBounds.min || filters.price[1] < priceBounds.max));

  const sortLabel = SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? "Top rated";

  return (
    <div className="glass-strong sticky top-24 z-30 mb-10 space-y-4 rounded-3xl p-4 shadow-xl sm:p-5">
      {/* Row 1: search · price · sort */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            value={filters.q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by studio name or location..."
            aria-label="Search studios"
            className="h-11 rounded-full bg-background/50 pl-11 pr-10"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => update({ q: "" })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {hasRange && (
          <div className="flex items-center gap-4 rounded-full border border-border bg-background/50 px-5 py-2.5 lg:w-80">
            <span className="shrink-0 text-xs font-medium text-muted-foreground">Price/hr</span>
            <Slider
              min={priceBounds.min}
              max={priceBounds.max}
              step={1}
              value={filters.price}
              onValueChange={(value) => update({ price: value as number[] }, false)}
              onValueCommitted={(value) => update({ price: value as number[] })} // fetch only when released
              aria-label="Price range per hour"
              className="flex-1"
            />
            <span className="w-24 shrink-0 text-right text-xs font-semibold tabular-nums">
              {formatCurrency(filters.price[0])}–{formatCurrency(filters.price[1])}
            </span>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="h-11 shrink-0 rounded-full bg-background/50 px-5" />}
          >
            <ArrowUpDown className="size-4" />
            {sortLabel}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-strong w-52 rounded-xl p-1.5">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => update({ sort: option.value })}
                className="cursor-pointer justify-between rounded-lg"
              >
                {option.label}
                {filters.sort === option.value && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {["", ...CATEGORIES].map((category) => {
          const active = filters.category === category;
          return (
            <button
              key={category || "all"}
              type="button"
              onClick={() => update({ category })}
              className={cn(
                "relative isolate shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-primary shadow-lg shadow-primary/30"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {category || "All studios"}
            </button>
          );
        })}

        {isFiltered && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="size-4" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}