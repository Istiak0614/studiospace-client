# StudioSpace

A peer-to-peer marketplace where hosts list professional creative spaces — photo studios, film & sound stages, podcast lounges, music suites and art workshops — and creators book them by the hour.

**Live site:** https://studiospace-client-lovat.vercel.app
**API:** https://studiospace-server-sepia.vercel.app · repo: studiospace-server

## Test credentials

| Email | Password |
|---|---|
| demo@studiospace.dev | Demo1234 |

The demo account hosts a studio (with a pending request to confirm), has bookings and saved studios. You can also sign in with Google.

## Features

- **Explore & filter** — search by title or location, category chips, a price-range slider, four sort orders and pagination, all stored in the URL so reloads and shared links keep the filters.
- **Live availability booking** — a calendar modal with hour chips; hours already confirmed are greyed out, with a live price breakdown (hours × rate + refundable deposit).
- **Double-booking prevention** — a request can't overlap a confirmed booking; confirming a slot auto-declines overlapping requests (Challenge 2).
- **Host dashboard** — count-up stats, a 6-month earnings chart, recent activity and a Booking Requests inbox to confirm or decline.
- **Full listing management** — add a studio with drag-and-drop multi-image upload (imgbb), edit it, or delete it through a confirmation modal.
- **Booking lifecycle** — Pending → Confirmed → Completed, with colour-coded badges, cancel-while-pending and a downloadable **PDF invoice**.
- **Reviews & wishlist** — interactive star reviews from completed bookings only; heart any studio to save it.
- **Secure auth** — BetterAuth with email/password and Google; private routes are protected on the server, so reloading never logs you out; the API uses a JWT in an HTTPOnly cookie (Challenge 1).
- **Light & dark themes** — a glassmorphism "Midnight Studio" design across the whole app (Challenge 3).

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Motion (Framer Motion) · Swiper · Recharts · Sonner · BetterAuth · jsPDF · imgbb · Vercel

## Getting started

```bash
git clone https://github.com/Istiak0614/studiospace-client.git
cd studiospace-client
npm install
cp .env.example .env.local   # fill in the values below
npm run dev                  # http://localhost:3000 (run the server on :5000 too)
```

| Variable | Description |
|---|---|
| `API_URL` | Express server URL (`http://localhost:5000` locally) |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key for image uploads |

## How it fits together

All `/api/*` requests are proxied to the Express server through a Next.js rewrite, so the browser only talks to one domain and auth cookies are first-party. `proxy.ts` checks the session cookie on the server before rendering private pages (`/add-studio`, `/my-listings`, `/my-bookings`, `/studios/edit/*`, `/dashboard/*`).

## Notes

- Studios are bookable in whole hours between 08:00 and 22:00, for 1–12 hours per booking.
- Earnings on the dashboard are hours × rate; deposits are refundable and not counted as income.