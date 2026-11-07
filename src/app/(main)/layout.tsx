import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <Navbar />
      <main className="min-h-[calc(100vh-5rem)]">{children}</main>
      <Footer />
    </WishlistProvider>
  );
}