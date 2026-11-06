"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { isValidEmail } from "@/lib/validators";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";

interface LoginErrors {
  email?: string;
  password?: string;
}

const inputClass = "h-11 rounded-xl bg-background/50";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: LoginErrors = {};
    if (!isValidEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Please enter your password";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await signIn.email({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Login failed. Please try again.");
      return;
    }

    toast.success("Welcome back! Your studio awaits.");
    router.push(redirectTo); 
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField id="email" label="Email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          className={inputClass}
        />
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={errors.password}
        action={
          <button
            type="button"
            onClick={() => toast.info("Password reset isn't available yet. Please contact support if you're locked out.")}
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Forgot password?
          </button>
        }
      >
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          className={inputClass}
        />
      </FormField>

      <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl text-base shadow-lg shadow-primary/25">
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to StudioSpace?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}