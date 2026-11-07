import type { Metadata } from "next";
import { BookingRequests } from "@/components/dashboard/booking-requests";

export const metadata: Metadata = { title: "Booking Requests | StudioSpace" };

export default function BookingRequestsPage() {
  return <BookingRequests />;
}