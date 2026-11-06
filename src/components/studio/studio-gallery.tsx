"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Thumbs } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

export function StudioGallery({ images, title }: { images: string[]; title: string }) {
  const [main, setMain] = useState<SwiperInstance | null>(null);
  const [thumbs, setThumbs] = useState<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);
  const multiple = images.length > 1;

  const arrowClass =
    "glass-strong absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground";

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-3xl border border-border shadow-2xl shadow-accent/10">
        <Swiper
          modules={[Thumbs, Keyboard]}
          keyboard={{ enabled: true }}           
          spaceBetween={0}
          speed={600}
          onSwiper={setMain}
          onSlideChange={(s) => setActive(s.activeIndex)}
          thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={src}>
              <div className="relative aspect-16/10">
                <Image
                  src={src}
                  alt={`${title}, photo ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {multiple && (
          <>
            <button type="button" onClick={() => main?.slidePrev()} aria-label="Previous photo" className={cn(arrowClass, "left-4")}>
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => main?.slideNext()} aria-label="Next photo" className={cn(arrowClass, "right-4")}>
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        <span className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Images className="size-3.5" />
          {active + 1} / {images.length}
        </span>
      </div>

      {multiple && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbs}
          spaceBetween={12}
          slidesPerView={4}
          freeMode
          watchSlidesProgress
          breakpoints={{ 640: { slidesPerView: 5 } }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={src} className="cursor-pointer">
              <div
                className={cn(
                  "relative aspect-4/3 overflow-hidden rounded-xl border-2 transition-all duration-300",
                  i === active ? "border-primary opacity-100" : "border-transparent opacity-50 hover:opacity-90"
                )}
              >
                <Image src={src} alt="" fill sizes="160px" className="object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}