export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];


export const isActiveLink = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  if (pathname.startsWith("/studios/edit")) return false;
  return pathname.startsWith(href);
};