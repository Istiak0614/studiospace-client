import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { safeRedirect } from "@/lib/validators";

export const metadata: Metadata = { title: "Login | StudioSpace" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your bookings and studio listings."
      asideHeading="Your next session is one click away."
      asidePoints={[
        "See live availability before you book",
        "Track every request from pending to completed",
        "Manage your own studio listings in one place",
      ]}
    >
      <LoginForm redirectTo={safeRedirect(redirect)} authError={error} />
    </AuthShell>
  );
}