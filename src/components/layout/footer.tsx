import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { CATEGORIES, categoryHref } from "@/lib/constants";
import { Logo } from "./logo";
import { NAV_LINKS } from "./nav-links";
import { NewsletterForm } from "./newsletter-form";
import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "./social-icons";

const SOCIALS = [
  { href: "https://x.com", label: "StudioSpace on X", icon: XIcon },
  { href: "https://instagram.com", label: "StudioSpace on Instagram", icon: InstagramIcon },
  { href: "https://linkedin.com", label: "StudioSpace on LinkedIn", icon: LinkedInIcon },
  { href: "https://youtube.com", label: "StudioSpace on YouTube", icon: YouTubeIcon },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-foreground">{children}</h3>;
}

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-primary";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-3 pb-6 pt-20 sm:px-6">
      <Reveal className="glass mx-auto max-w-7xl rounded-3xl px-6 py-12 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              We connect creators with professional spaces, from daylight photo studios to soundproof
              podcast lounges, so great work is never held back by where it&apos;s made.
            </p>
            <div className="flex gap-2">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-border bg-background/40 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:text-primary hover:shadow-lg hover:shadow-primary/20"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer quick links">
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio categories">
            <FooterHeading>Categories</FooterHeading>
            <ul className="space-y-3">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link href={categoryHref(category)} className={linkClass}>{category}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <FooterHeading>Stay in the loop</FooterHeading>
            <p className="mb-4 text-sm text-muted-foreground">
              New studios, seasonal offers and creator stories, once a month. No spam.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} StudioSpace. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="transition-colors hover:text-primary">Terms of Service</Link>
            <Link href="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}