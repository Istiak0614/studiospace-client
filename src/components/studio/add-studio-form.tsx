"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { StudioForm } from "./studio-form";

export function AddStudioForm() {
  const router = useRouter();

  return (
    <StudioForm
      submitLabel="Publish studio"
      onSubmit={async (payload) => {
        const res = await apiRequest<{ message: string }>("/studios", { method: "POST", body: payload });
        toast.success(res.message);
        router.push("/my-listings"); 
        router.refresh();
      }}
    />
  );
}