export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

export const formatDate = (iso: string, opts: { day?: boolean } = {}) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: opts.day ? "numeric" : undefined,
    month: opts.day ? "short" : "long",
    year: "numeric",
  });

export const getInitials = (name: string) =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export const formatBookingDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export const formatTimeRange = (startIso: string, endIso: string) => {
  const time = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${time(startIso)} – ${time(endIso)}`;
};