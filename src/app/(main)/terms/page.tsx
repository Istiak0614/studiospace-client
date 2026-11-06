import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = { title: "Terms of Service | StudioSpace" };

const SECTIONS = [
  {
    heading: "Using StudioSpace",
    body: "StudioSpace is a marketplace that connects hosts who own creative spaces with creators who want to rent them by the hour. By creating an account, you agree to provide accurate information and to use the platform lawfully.",
  },
  {
    heading: "For hosts",
    body: "Hosts are responsible for the accuracy of their listings, including pricing, capacity, amenities and photos. A host must honour every booking they confirm and keep the space safe and as described.",
  },
  {
    heading: "For creators",
    body: "Booking requests stay pending until the host confirms them. Creators must respect the booked time slot, the stated capacity and any house rules, and leave the space in the condition they found it.",
  },
  {
    heading: "Payments and deposits",
    body: "The total price shown when booking is the hourly rate multiplied by the booked hours, plus the host's refundable security deposit. Deposits are returned after the session if the space and equipment are undamaged.",
  },
  {
    heading: "Cancellations",
    body: "Creators may cancel a booking while it is still pending. Hosts may decline requests that do not suit their schedule. Confirmed time slots cannot be double-booked.",
  },
  {
    heading: "Reviews",
    body: "Only creators with a completed booking can review a studio. Reviews must be honest and respectful, and we may remove content that is abusive or misleading.",
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms of Service" updated="November 2026" sections={SECTIONS} />;
}