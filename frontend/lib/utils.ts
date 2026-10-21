import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind and conditional class names cleanly
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats numeric values to Indonesian locale representation
 * Example: 1234.56 -> "1.234,56"
 */
export function formatNumber(
  val: number | string | null | undefined,
  fractionDigits: number = 2
): string {
  if (val === null || val === undefined || val === "") return "-";
  const num = typeof val === "number" ? val : Number(val);
  if (isNaN(num)) return "-";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(num);
}

/**
 * Formats Date, timestamp, or ISO string to Indonesian standard date/time
 * Example: "2026-09-21T10:00:00Z" -> "21 Sep 2026" or "21 Sep 2026 17:00 WIB"
 */
export function formatDate(
  date: string | number | Date | null | undefined,
  includeTime: boolean = false
): string {
  if (!date) return "-";
  try {
    const d = typeof date === "object" ? date : new Date(date);
    if (isNaN(d.getTime())) return "-";

    if (includeTime) {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "-";
  }
}
