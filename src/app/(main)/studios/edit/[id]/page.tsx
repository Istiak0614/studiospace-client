import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EditStudioForm } from "@/components/studio/edit-studio-form";
import { serverFetch } from "@/lib/server-api";
import type { Studio } from "@/types/studio";

export const metadata: Metadata = { title: "Edit Studio | StudioSpace" };

export default async function EditStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const studio = await serverFetch<Studio>(`/studios/${id}`, 0); // always fresh
  if (!studio) notFound();

  return (
    <section className="px-4 pb-16 sm:px-6">
      <div className="mx-auto max-w-3xl pt-8">
        <Link href="/my-listings" className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to my listings
        </Link>
      </div>
      <PageHeader
        eyebrow="Edit listing"
        title="Update"
        highlight={studio.title}
        description="Changes go live as soon as you save. Existing bookings keep their original price."
      />
      <EditStudioForm studio={studio} />
    </section>
  );
}