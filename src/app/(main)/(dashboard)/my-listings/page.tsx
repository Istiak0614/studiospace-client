import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { MyListings } from "@/components/studio/my-listings";

export const metadata: Metadata = { title: "My Studio Listings | StudioSpace" };

export default function MyListingsPage() {
  return (
    <section className="px-4 pb-16 sm:px-6">
      <PageHeader
        eyebrow="Host"
        title="My studio"
        highlight="listings"
        description="Update details, refresh photos or remove a space you no longer offer."
      />
      <MyListings />
    </section>
  );
}