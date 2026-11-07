import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-6 sm:px-6 lg:flex-row lg:gap-8">
      <DashboardNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}