"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { apiRequest } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Studio } from "@/types/studio";
import { StudioForm, type StudioFormValues } from "./studio-form";

export function EditStudioForm({ studio }: { studio: Studio }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) return <Skeleton className="mx-auto h-96 max-w-3xl rounded-3xl" />;

  if (session?.user.email !== studio.ownerEmail) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="This isn't your studio"
        description="You can only edit studios that you've listed yourself."
        action={{ href: "/my-listings", label: "Go to my listings" }}
      />
    );
  }

  const initialValues: StudioFormValues = {
    title: studio.title,
    category: studio.category,
    hourlyRate: String(studio.hourlyRate),
    securityDeposit: String(studio.securityDeposit),
    maxCapacity: String(studio.maxCapacity),
    location: studio.location,
    overview: studio.overview,
    amenities: studio.amenities,
    images: studio.images,
  };

  return (
    <StudioForm
      initialValues={initialValues}
      submitLabel="Save changes"
      onSubmit={async (payload) => {
        const res = await apiRequest<{ message: string }>(`/studios/${studio._id}`, { method: "PATCH", body: payload });
        toast.success(res.message);
        router.push("/my-listings");
        router.refresh();
      }}
    />
  );
}