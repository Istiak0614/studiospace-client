import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = { title: "Privacy Policy | StudioSpace" };

const SECTIONS = [
  {
    heading: "Information we collect",
    body: "When you create an account we store your name, email address and profile photo. If you sign in with Google, we receive only these basic profile details. When you list a studio or make a booking, we store the details you enter, such as studio information, booking dates and prices.",
  },
  {
    heading: "How we use it",
    body: "Your information is used to run the platform: showing your listings, processing booking requests, letting hosts and creators identify each other, and keeping your account secure. We do not sell your personal data to anyone.",
  },
  {
    heading: "Cookies",
    body: "We use essential, secure cookies to keep you signed in. They cannot be read by scripts on the page and are removed when you log out. We do not use advertising or tracking cookies.",
  },
  {
    heading: "Images you upload",
    body: "Studio photos are stored with our image hosting provider so they can be shown on your listing. Only upload images you have the right to share.",
  },
  {
    heading: "Your choices",
    body: "You can edit or delete your studio listings at any time and cancel pending bookings from your account. To delete your account entirely, contact our support team.",
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated="November 2026" sections={SECTIONS} />;
}