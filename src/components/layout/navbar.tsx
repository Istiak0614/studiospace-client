"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NAV_LINKS, isActiveLink } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 transition-all duration-500 sm:px-6",
          scrolled ? "glass-strong shadow-xl" : "glass"
        )}
      >
        <Logo />

        {/* Desktop links with a sliding active pill */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative isolate rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-primary/15 ring-1 ring-primary/40"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isPending ? (
            <Skeleton className="size-9 rounded-full" />
          ) : session ? (
            <UserMenu user={session.user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              {/* Base UI: render the Button as a Link; nativeButton={false} because it's an <a> */}
              <Button nativeButton={false} render={<Link href="/login" />} variant="ghost" className="rounded-full">
                Login
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/register" />}
                className="rounded-full px-5 shadow-lg shadow-primary/25"
              >
                Register
              </Button>
            </div>
          )}

          {/* Mobile menu: the trigger renders AS our Button (one button, no nesting) */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="rounded-full lg:hidden" />}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" className="glass-strong w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className={cn(
                      "rounded-xl px-4 py-3 font-medium transition-colors",
                      isActiveLink(pathname, link.href)
                        ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {!session && !isPending && (
                <div className="mt-auto flex flex-col gap-2 p-4">
                  <Button
                    nativeButton={false}
                    render={<Link href="/login" onClick={closeMobile} />}
                    variant="outline"
                    className="rounded-full"
                  >
                    Login
                  </Button>
                  <Button
                    nativeButton={false}
                    render={<Link href="/register" onClick={closeMobile} />}
                    className="rounded-full"
                  >
                    Register
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </header>
  );
}