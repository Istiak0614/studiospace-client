"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import { PASSWORD_RULES, isValidEmail, isValidUrl, validatePassword } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";

interface RegisterErrors {
  name?: string;
  email?: string;
  photoUrl?: string;
  password?: string;
}

const inputClass = "h-11 rounded-xl bg-background/50";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photoUrl: "", password: "" });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = (): RegisterErrors => {
    const result: RegisterErrors = {};
    if (form.name.trim().length < 2) result.name = "Please enter your full name";
    if (!isValidEmail(form.email)) result.email = "Please enter a valid email address";
    if (form.photoUrl.trim() && !isValidUrl(form.photoUrl.trim())) result.photoUrl = "Please enter a valid image link (https://...)";
    const passwordError = validatePassword(form.password);
    if (passwordError) result.password = passwordError;
    return result;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.photoUrl.trim() || undefined,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Registration failed. Please try again.");
      return;
    }

    toast.success("Account created! Please log in to continue.");
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField id="name" label="Full name" error={errors.name}>
        <Input id="name" autoComplete="name" placeholder="Your name" value={form.name}
          onChange={update("name")} aria-invalid={!!errors.name} className={inputClass} />
      </FormField>

      <FormField id="email" label="Email" error={errors.email}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@studio.com" value={form.email}
          onChange={update("email")} aria-invalid={!!errors.email} className={inputClass} />
      </FormField>

      <FormField id="photoUrl" label="Photo URL (optional)" error={errors.photoUrl}>
        <Input id="photoUrl" type="url" placeholder="https://..." value={form.photoUrl}
          onChange={update("photoUrl")} aria-invalid={!!errors.photoUrl} className={inputClass} />
      </FormField>

      <FormField id="password" label="Password" error={errors.password}>
        <PasswordInput id="password" autoComplete="new-password" placeholder="Create a password" value={form.password}
          onChange={update("password")} aria-invalid={!!errors.password} className={inputClass} />

        <ul className="grid gap-1.5 pt-1">
          {PASSWORD_RULES.map((rule) => {
            const met = rule.test(form.password);
            return (
              <li key={rule.id}
                className={cn("flex items-center gap-2 text-xs transition-colors duration-300",
                  met ? "text-emerald-500" : "text-muted-foreground")}>
                <span className={cn("grid size-4 place-items-center rounded-full border transition-all duration-300",
                  met ? "scale-110 border-emerald-500 bg-emerald-500 text-white" : "border-border")}>
                  {met && <Check className="size-3" />}
                </span>
                {rule.label}
              </li>
            );
          })}
        </ul>
      </FormField>

      <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl text-base shadow-lg shadow-primary/25">
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Creating account..." : "Register"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}