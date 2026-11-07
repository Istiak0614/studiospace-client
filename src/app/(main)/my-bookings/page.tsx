import type { Metadata } from "next";
import { MyBookings } from "@/components/booking/my-bookings";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "My Bookings | StudioSpace" };

export default function MyBookingsPage() {
  return (
    <section className="px-4 pb-16 sm:px-6">
      <PageHeader
        eyebrow="Creator"
        title="My"
        highlight="bookings"
        description="Track every request from pending to completed, and cancel while it's still pending."
      />
      <MyBookings />
    </section>
  );
}