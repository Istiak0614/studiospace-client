export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  hostEmail: string;
  hostName: string;
  guestEmail: string;
  guestName: string;
  startTime: string;
  endTime: string;
  hours: number;
  hourlyRate: number;
  securityDeposit: number;
  totalPrice: number;
  status: BookingStatus;
  cancelledBy?: "guest" | "host" | "system";
  createdAt: string;
  updatedAt: string;
}