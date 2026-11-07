"use client";

import type { MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useWishlist } from "./wishlist-provider";

interface WishlistButtonProps {
  studioId: string;
  variant?: "overlay" | "outline";
  className?: string;
}

export function WishlistButton({ studioId, variant = "overlay", className }: WishlistButtonProps) {
  const { data: session } = useSession();
  const { isSaved, toggle } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const saved = isSaved(studioId);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.info("Log in to save studios to your wishlist");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    toggle(studioId);
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        "grid size-9 place-items-center rounded-full transition-colors",
        variant === "overlay"
          ? "bg-black/45 text-white backdrop-blur-md hover:bg-black/65"
          : "border border-border bg-background/50 hover:border-rose-400",
        className
      )}
    >
      <motion.span
        key={String(saved)}
        initial={{ scale: 0.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 14 }}
        className="grid place-items-center"
      >
        <Heart className={cn("size-4", saved && "fill-rose-500 text-rose-500")} />
      </motion.span>
    </motion.button>
  );
}