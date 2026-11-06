import type { StudioCategory } from "@/lib/constants";

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  images: string[];
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhoto?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudioListResponse {
  studios: Studio[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  priceRange: { min: number; max: number };
}