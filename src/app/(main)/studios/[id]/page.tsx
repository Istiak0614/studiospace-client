import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, LayoutGrid, Mail, MapPin, ShieldCheck, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookingPanel, MobileBookingBar } from "@/components/booking/booking-panel";
import { Reveal } from "@/components/shared/reveal";
import { StarRating } from "@/components/shared/star-rating";
import { ReviewList } from "@/components/studio/review-list";
import { StudioGallery } from "@/components/studio/studio-gallery";
import { formatCurrency, formatDate, getInitials } from "@/lib/format";
import { serverFetch } from "@/lib/server-api";
import type { Review } from "@/types/review";
import type { Studio } from "@/types/studio";

type Params = Promise<{ id: string }>;

const getStudio = (id: string) => serverFetch<Studio>(`/studios/${id}`, 0);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const studio = await getStudio((await params).id);
  return { title: studio ? `${studio.title} | StudioSpace` : "Studio not found | StudioSpace" };
}

export default async function StudioDetailsPage({ params }: { params: Params }) {
  const { id } = await params;
  const [studio, reviews] = await Promise.all([
    getStudio(id),
    serverFetch<Review[]>(`/studios/${id}/reviews`, 0), 
  ]);

  if (!studio) notFound(); 

  const specs = [
    { icon: Clock, label: "Hourly rate", value: formatCurrency(studio.hourlyRate) },
    { icon: ShieldCheck, label: "Deposit", value: formatCurrency(studio.securityDeposit) },
    { icon: Users, label: "Capacity", value: `${studio.maxCapacity} guests` },
    { icon: LayoutGrid, label: "Category", value: studio.category },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:pb-16">
      <Link href="/studios" className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Back to studios
      </Link>

      <Reveal className="mb-8">
        <span className="mb-4 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          {studio.category}
        </span>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{studio.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            {studio.reviewCount > 0 ? (
              <>
                <StarRating value={studio.rating} />
                <span className="font-medium text-foreground">{studio.rating.toFixed(1)}</span>
                ({studio.reviewCount} reviews)
              </>
            ) : (
              "New listing"
            )}
          </span>
          <span className="flex items-center gap-1.5"><MapPin className="size-4 text-primary" />{studio.location}</span>
          <span className="flex items-center gap-1.5"><Users className="size-4 text-primary" />Up to {studio.maxCapacity} guests</span>
        </div>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-12">
          <Reveal>
            <StudioGallery images={studio.images} title={studio.title} />
          </Reveal>

          <Reveal className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass rounded-2xl p-4">
                <Icon className="mb-3 size-5 text-primary" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            ))}
          </Reveal>

          <Reveal>
            <h2 className="mb-4 text-2xl font-semibold">About this space</h2>
            <p className="leading-relaxed text-muted-foreground">{studio.overview}</p>
          </Reveal>

          {studio.amenities.length > 0 && (
            <Reveal>
              <h2 className="mb-4 text-2xl font-semibold">Amenities</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal className="glass flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center">
            <Avatar className="size-16 ring-2 ring-primary/40 ring-offset-2 ring-offset-background">
              <AvatarImage src={studio.ownerPhoto} alt={studio.ownerName} referrerPolicy="no-referrer" />
              <AvatarFallback className="bg-accent text-lg font-semibold text-accent-foreground">
                {getInitials(studio.ownerName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Hosted by</p>
              <p className="font-display text-2xl font-semibold">{studio.ownerName}</p>
              <p className="text-sm text-muted-foreground">Listing since {formatDate(studio.createdAt)}</p>
            </div>
            <a href={`mailto:${studio.ownerEmail}`}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary">
              <Mail className="size-4" />
              Contact host
            </a>
          </Reveal>

          <Reveal>
            <ReviewList reviews={reviews ?? []} rating={studio.rating} reviewCount={studio.reviewCount} />
          </Reveal>
        </div>

        <div className="hidden lg:block">
          <BookingPanel studio={studio} />
        </div>
      </div>

      <MobileBookingBar studio={studio} />
    </section>
  );
}