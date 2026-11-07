import type { Metadata } from "next";
import { WishlistGrid } from "@/components/wishlist/wishlist-grid";

export const metadata: Metadata = { title: "Wishlist | StudioSpace" };

export default function WishlistPage() {
  return <WishlistGrid />;
}