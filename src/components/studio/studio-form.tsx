"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";
import { Loader2, Lock, Plus, X } from "lucide-react";
import { FormField } from "@/components/auth/form-field";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { errorMessage } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { CATEGORIES, type StudioCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ImageUploader } from "./image-uploader";

export interface StudioFormValues {
  title: string;
  category: StudioCategory | "";
  hourlyRate: string;       
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  overview: string;
  amenities: string[];
  images: string[];
}

export interface StudioPayload {
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  overview: string;
  amenities: string[];
  images: string[];
}

type Errors = Partial<Record<keyof StudioFormValues, string>>;

const EMPTY: StudioFormValues = {
  title: "", category: "", hourlyRate: "", securityDeposit: "", maxCapacity: "",
  location: "", overview: "", amenities: [], images: [],
};

const SUGGESTED_AMENITIES = ["High-speed Wi-Fi", "Air conditioning", "Parking", "Lighting kit", "Changing room", "Soundproofing", "Green screen", "Kitchenette"];

const inputClass = "h-11 rounded-xl bg-background/50";

function validate(v: StudioFormValues): Errors {
  const e: Errors = {};
  const rate = Number(v.hourlyRate);
  const deposit = Number(v.securityDeposit);
  const capacity = Number(v.maxCapacity);

  if (v.title.trim().length < 3 || v.title.trim().length > 80) e.title = "Title must be between 3 and 80 characters";
  if (!v.category) e.category = "Please choose a category";
  if (!v.hourlyRate || !(rate > 0) || rate > 10000) e.hourlyRate = "Enter a rate between 1 and 10,000";
  if (v.securityDeposit === "" || Number.isNaN(deposit) || deposit < 0) e.securityDeposit = "Enter 0 or more";
  if (!Number.isInteger(capacity) || capacity < 1) e.maxCapacity = "Capacity must be at least 1";
  if (v.location.trim().length < 3) e.location = "Please enter the studio's location";
  if (v.images.length < 1) e.images = "Add at least one photo";
  if (v.overview.trim().length < 20) e.overview = "Overview must be at least 20 characters";
  return e;
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <Reveal className="glass rounded-3xl p-6 sm:p-8">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
        <span className="grid size-8 place-items-center rounded-full bg-primary/15 font-sans text-sm text-primary">{step}</span>
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </Reveal>
  );
}

interface StudioFormProps {
  initialValues?: StudioFormValues;
  submitLabel: string;
  onSubmit: (payload: StudioPayload) => Promise<void>; // the page decides what happens on success
}

export function StudioForm({ initialValues = EMPTY, submitLabel, onSubmit }: StudioFormProps) {
  const { data: session } = useSession();
  const [values, setValues] = useState<StudioFormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [amenityDraft, setAmenityDraft] = useState("");

  const set = <K extends keyof StudioFormValues>(key: K, value: StudioFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined })); // clear the error as they fix it
  };

  const addAmenity = (raw: string) => {
    const amenity = raw.trim();
    if (!amenity) return;
    if (values.amenities.length >= 20) return toast.error("You can list up to 20 amenities");
    if (values.amenities.some((a) => a.toLowerCase() === amenity.toLowerCase())) return;
    set("amenities", [...values.amenities, amenity]);
    setAmenityDraft("");
  };

  const handleAmenityKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addAmenity(amenityDraft);
    } else if (e.key === "Backspace" && !amenityDraft && values.amenities.length) {
      set("amenities", values.amenities.slice(0, -1));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (uploading) return toast.info("Please wait for your photos to finish uploading");

    const found = validate(values);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      toast.error("Please fix the highlighted fields");
      document.getElementById(firstError)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        category: values.category as StudioCategory,
        hourlyRate: Number(values.hourlyRate),
        securityDeposit: Number(values.securityDeposit),
        maxCapacity: Number(values.maxCapacity),
        location: values.location.trim(),
        overview: values.overview.trim(),
        amenities: values.amenities,
        images: values.images,
      });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl space-y-6">
      <Section step={1} title="Basics">
        <FormField id="title" label="Studio title" error={errors.title}>
          <Input id="title" value={values.title} onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Daylight Loft Photo Studio" maxLength={80} aria-invalid={!!errors.title} className={inputClass} />
        </FormField>

        <FormField id="category" label="Category" error={errors.category}>
          <div id="category" role="radiogroup" aria-label="Category" className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button key={category} type="button" role="radio" aria-checked={values.category === category}
                onClick={() => set("category", category)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  values.category === category
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border-border bg-background/40 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                )}>
                {category}
              </button>
            ))}
          </div>
        </FormField>

        <FormField id="location" label="Location" error={errors.location}>
          <Input id="location" value={values.location} onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. Gulshan 2, Dhaka" aria-invalid={!!errors.location} className={inputClass} />
        </FormField>
      </Section>

      <Section step={2} title="Pricing & capacity">
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField id="hourlyRate" label="Hourly rate ($)" error={errors.hourlyRate}>
            <Input id="hourlyRate" type="number" min={1} inputMode="decimal" value={values.hourlyRate}
              onChange={(e) => set("hourlyRate", e.target.value)} placeholder="45" aria-invalid={!!errors.hourlyRate} className={inputClass} />
          </FormField>
          <FormField id="securityDeposit" label="Security deposit ($)" error={errors.securityDeposit}>
            <Input id="securityDeposit" type="number" min={0} inputMode="decimal" value={values.securityDeposit}
              onChange={(e) => set("securityDeposit", e.target.value)} placeholder="100" aria-invalid={!!errors.securityDeposit} className={inputClass} />
          </FormField>
          <FormField id="maxCapacity" label="Max capacity (guests)" error={errors.maxCapacity}>
            <Input id="maxCapacity" type="number" min={1} inputMode="numeric" value={values.maxCapacity}
              onChange={(e) => set("maxCapacity", e.target.value)} placeholder="10" aria-invalid={!!errors.maxCapacity} className={inputClass} />
          </FormField>
        </div>
      </Section>

      <Section step={3} title="Photos">
        <FormField id="images" label="Studio photos (the first one is the cover)" error={errors.images}>
          <div id="images">
            <ImageUploader initial={initialValues.images} onChange={(urls) => set("images", urls)}
              onBusyChange={setUploading} invalid={!!errors.images} />
          </div>
        </FormField>
      </Section>

      <Section step={4} title="Details">
        <FormField id="overview" label="Overview" error={errors.overview}>
          <Textarea id="overview" rows={5} value={values.overview} onChange={(e) => set("overview", e.target.value)}
            placeholder="Describe the space, the light, the gear and what it's best for..."
            aria-invalid={!!errors.overview} className="rounded-xl bg-background/50" />
          <p className="text-right text-xs text-muted-foreground">{values.overview.trim().length} characters (min 20)</p>
        </FormField>

        <FormField id="amenities" label="Amenities">
          <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-input bg-background/50 px-3 py-2 focus-within:border-ring">
            {values.amenities.map((amenity) => (
              <span key={amenity} className="flex items-center gap-1 rounded-full bg-primary/15 py-1 pl-3 pr-1.5 text-sm text-primary">
                {amenity}
                <button type="button" aria-label={`Remove ${amenity}`}
                  onClick={() => set("amenities", values.amenities.filter((a) => a !== amenity))}
                  className="grid size-5 place-items-center rounded-full hover:bg-primary hover:text-primary-foreground">
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <input id="amenities" value={amenityDraft} onChange={(e) => setAmenityDraft(e.target.value)}
              onKeyDown={handleAmenityKey} onBlur={() => addAmenity(amenityDraft)}
              placeholder={values.amenities.length ? "Add more..." : "Type an amenity and press Enter"}
              className="min-w-40 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTED_AMENITIES.filter((s) => !values.amenities.includes(s)).map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => addAmenity(suggestion)}
                className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Plus className="size-3" />
                {suggestion}
              </button>
            ))}
          </div>
        </FormField>
      </Section>

      <Reveal className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="mb-1 flex items-center gap-2 text-xl font-semibold">
          <Lock className="size-4 text-primary" /> Host details
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">Taken from your account and can&apos;t be changed here.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="hostName" label="Host name">
            <Input id="hostName" value={session?.user.name ?? ""} readOnly disabled className={inputClass} />
          </FormField>
          <FormField id="hostEmail" label="Host email">
            <Input id="hostEmail" value={session?.user.email ?? ""} readOnly disabled className={inputClass} />
          </FormField>
        </div>
      </Reveal>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting || uploading} size="lg"
          className="h-12 w-full rounded-full px-8 text-base shadow-xl shadow-primary/30 sm:w-auto">
          {(submitting || uploading) && <Loader2 className="size-4 animate-spin" />}
          {uploading ? "Uploading photos..." : submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}