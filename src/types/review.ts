export interface Review {
  _id: string;
  studioId: string;
  bookingId: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}