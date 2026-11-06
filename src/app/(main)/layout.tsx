import { Navbar } from "@/components/layout/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-5rem)]">{children}</main>
    </>
  );
}