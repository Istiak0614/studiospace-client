"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest, errorMessage } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

interface WishlistContextValue {
  ready: boolean;                       
  isSaved: (studioId: string) => boolean;
  toggle: (studioId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIds(new Set());
      setReady(true);
      return;
    }
    setReady(false);
    apiRequest<string[]>("/wishlist/ids")
      .then((list) => setIds(new Set(list)))
      .catch(() => setIds(new Set()))
      .finally(() => setReady(true));
  }, [userId]);

  const flip = (studioId: string, save: boolean) =>
    setIds((prev) => {
      const next = new Set(prev);
      if (save) next.add(studioId);
      else next.delete(studioId);
      return next;
    });

  const toggle = useCallback(
    async (studioId: string) => {
      const wasSaved = ids.has(studioId);
      flip(studioId, !wasSaved); 
      try {
        const res = await apiRequest<{ saved: boolean; message: string }>(`/wishlist/${studioId}`, { method: "POST" });
        flip(studioId, res.saved); 
        toast.success(res.message);
      } catch (err) {
        flip(studioId, wasSaved); 
        toast.error(errorMessage(err));
      }
    },
    [ids]
  );

  return (
    <WishlistContext.Provider value={{ ready, isSaved: (id) => ids.has(id), toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}