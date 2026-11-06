import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Register | StudioSpace" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join creators and hosts sharing professional spaces."
      asideHeading="Book it by the hour. Or list your own."
      asidePoints={[
        "Photo studios, film stages, podcast lounges and more",
        "Clear pricing: hourly rate plus a refundable deposit",
        "Earn from your space when you're not using it",
      ]}
    >
      <RegisterForm />
    </AuthShell>
  );
}