/** Convert Motoko Time (bigint nanoseconds) to a readable date string */
export function formatTime(time: bigint, lang: "en" | "hi" = "en"): string {
  const ms = Number(time) / 1_000_000;
  const date = new Date(ms);
  const locale = lang === "hi" ? "hi-IN" : "en-IN";
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
