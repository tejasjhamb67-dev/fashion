const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return `₹${inr.format(amount)}`;
}

export function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

export function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso.replace(" ", "T") + (iso.includes("Z") ? "" : "Z"));
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d).toUpperCase();
}
