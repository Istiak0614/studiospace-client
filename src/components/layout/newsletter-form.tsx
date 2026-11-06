"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("You're on the list! Fresh studios will land in your inbox.");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@studio.com"
        aria-label="Email address"
        className="h-10 rounded-full bg-background/50"
      />
      <Button type="submit" size="icon" aria-label="Subscribe" className="size-10 shrink-0 rounded-full">
        <Send className="size-4" />
      </Button>
    </form>
  );
}