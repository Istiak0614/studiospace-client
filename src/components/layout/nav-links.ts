export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];


export const isActiveLink = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);