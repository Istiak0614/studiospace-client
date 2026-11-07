import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AddStudioForm } from "@/components/studio/add-studio-form";

export const metadata: Metadata = { title: "Add a Studio | StudioSpace" };

export default function AddStudioPage() {
  return (
    <section className="px-4 pb-16 sm:px-6">
      <PageHeader
        eyebrow="Become a host"
        title="List your"
        highlight="studio"
        description="Share your space with creators and earn from the hours it would otherwise sit empty."
      />
      <AddStudioForm />
    </section>
  );
}