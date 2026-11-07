import type { Booking } from "./booking";

export interface DashboardData {
  stats: {
    listings: number;
    bookingsMade: number;
    upcomingBookings: number;
    pendingRequests: number;
    savedStudios: number;
    totalEarnings: number;
  };
  earningsByMonth: { key: string; month: string; earnings: number }[];
  recentActivity: (Booking & { role: "host" | "guest" })[];
}