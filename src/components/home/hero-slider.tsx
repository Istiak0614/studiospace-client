"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/effect-fade";

const SLIDES = [
  {
    eyebrow: "Photo · Film · Sound",
    before: "Find the perfect space for your next",
    highlight: "creation",
    text: "Book professional photo studios, film stages and podcast lounges by the hour, from hosts who care about craft.",
    primary: "Explore Studios",
    secondary: "Browse Spaces",
  },
  {
    eyebrow: "Hourly bookings",
    before: "Rent the stage,",
    highlight: "not the building",
    text: "Pay only for the hours you create. Clear pricing, a refundable deposit, and live availability before you book.",
    primary: "Find a Studio",
    secondary: "See What's Open",
  },
  {
    eyebrow: "Made for creators",
    before: "From first take to",
    highlight: "final cut",
    text: "Sound-treated rooms, pro lighting and real gear, so the only thing you need to bring is the idea.",
    primary: "Start Exploring",
    secondary: "View All Studios",
  },
];

const AUTOPLAY_MS = 6000;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
};

export function HeroSlider({ images }: { images: string[] }) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);
  const progressRef = useRef<HTMLSpanElement>(null); 

  const slide = SLIDES[active];

  return (
    <section className="px-3 pt-4 sm:px-6">
      <div className="relative mx-auto h-[85vh] min-h-[560px] max-h-[820px] max-w-7xl overflow-hidden rounded-3xl border border-border shadow-2xl shadow-accent/10">
        
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={1200}
          autoplay={{ delay: AUTOPLAY_MS, disableOnInteraction: false }}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActive(s.realIndex)}
          onAutoplayTimeLeft={(_s, _time, progress) => {
        
            if (progressRef.current) progressRef.current.style.width = `${(1 - progress) * 100}%`;
          }}
          className="absolute! inset-0 h-full w-full"
        >
          {SLIDES.map((s, i) => (
            <SwiperSlide key={s.highlight}>
              {({ isActive }) =>
                images[i] ? (
                  <Image
                    src={images[i]}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    
                    className={cn(
                      "object-cover transition-transform duration-[7000ms] ease-out",
                      isActive ? "scale-100" : "scale-115"
                    )}
                  />
                ) : (
                  
                  <div className="h-full w-full bg-linear-to-br from-accent/40 via-background to-primary/30" />
                )
              }
            </SwiperSlide>
          ))}
        </Swiper>

        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-background via-background/40 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-background/80 via-background/20 to-transparent" />

        <div className="absolute inset-0 z-20 flex items-end p-6 pb-28 sm:p-12 sm:pb-32 lg:items-center lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div key={active} variants={container} initial="hidden" animate="show" exit="exit" className="max-w-2xl">
              <motion.p variants={item} className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em]">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                {slide.eyebrow}
              </motion.p>

              <motion.h1 variants={item} className="text-4xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
                {slide.before} <span className="text-gradient italic">{slide.highlight}</span>
              </motion.h1>

              <motion.p variants={item} className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                {slide.text}
              </motion.p>

              <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
                <Button
                  nativeButton={false}
                  render={<Link href="/studios" />}
                  size="lg"
                  className="group h-12 rounded-full px-7 text-base shadow-xl shadow-primary/30"
                >
                  {slide.primary}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/studios" />}
                  size="lg"
                  variant="outline"
                  className="glass h-12 rounded-full px-7 text-base"
                >
                  {slide.secondary}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="glass-strong absolute bottom-5 right-5 z-30 flex items-center gap-3 rounded-full p-1.5 sm:bottom-8 sm:right-8">
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            aria-label="Previous slide"
            className="grid size-9 place-items-center rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex w-20 flex-col items-center gap-1.5">
            <span className="text-xs font-medium tabular-nums">
              {String(active + 1).padStart(2, "0")} <span className="text-muted-foreground">/ {String(SLIDES.length).padStart(2, "0")}</span>
            </span>
            <span className="h-0.5 w-full overflow-hidden rounded-full bg-foreground/15">
              <span ref={progressRef} className="block h-full w-0 bg-primary" />
            </span>
          </div>

          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            aria-label="Next slide"
            className="grid size-9 place-items-center rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}