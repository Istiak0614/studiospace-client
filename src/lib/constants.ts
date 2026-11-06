export const CATEGORIES = [
  "Photo Studio",
  "Film & Sound Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
] as const;

export type StudioCategory = (typeof CATEGORIES)[number];

export const categoryHref = (category: StudioCategory) =>
  `/studios?category=${encodeURIComponent(category)}`;