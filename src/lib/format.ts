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