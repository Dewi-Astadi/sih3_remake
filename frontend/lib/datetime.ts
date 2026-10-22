/**
 * WIB (Asia/Jakarta, UTC+7) formatting for measurement timestamps.
 *
 * The API stores UTC. Every timestamp shown on the public portal is converted
 * explicitly to WIB and always includes the year, e.g. "22 Sep 2026, 01.00 WIB".
 */

export const WIB_TIME_ZONE = "Asia/Jakarta";

/** PRD §6: measurements older than this are labelled "Data belum diperbarui". */
export const STALE_AFTER_HOURS = 6;

const WIB_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: WIB_TIME_ZONE,
});

const WIB_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: WIB_TIME_ZONE,
});

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat("id-ID", {
  numeric: "auto",
});

export interface TimestampInfo {
  /** "22 Sep 2026, 01.00 WIB", or null when the input is missing/invalid. */
  text: string | null;
  /** Age in whole hours, rounded down; null when unknown. */
  ageHours: number | null;
  /** "3 hari yang lalu" style label; null when unknown. */
  ageText: string | null;
  /** True when the reading is older than STALE_AFTER_HOURS. */
  stale: boolean;
  /** ISO string of the parsed instant, for <time dateTime>. */
  iso: string | null;
}

function parseInstant(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Relative age in the largest whole unit, in Indonesian.
 * Negative = in the past, which is what measurements always are.
 */
function relativeAge(date: Date, now: Date): string {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(seconds);

  if (abs < 60) return RELATIVE_FORMATTER.format(seconds, "second");
  if (abs < 3600) return RELATIVE_FORMATTER.format(Math.round(seconds / 60), "minute");
  if (abs < 86_400) return RELATIVE_FORMATTER.format(Math.round(seconds / 3600), "hour");
  if (abs < 2_592_000) return RELATIVE_FORMATTER.format(Math.round(seconds / 86_400), "day");
  if (abs < 31_536_000) {
    return RELATIVE_FORMATTER.format(Math.round(seconds / 2_592_000), "month");
  }
  return RELATIVE_FORMATTER.format(Math.round(seconds / 31_536_000), "year");
}

/**
 * Describes a measurement timestamp for the UI: formatted WIB text, relative
 * age, and whether the data must be labelled stale.
 *
 * @param value           ISO timestamp from the API
 * @param now             Reference instant (injectable for tests)
 * @param staleAfterHours Age threshold; defaults to STALE_AFTER_HOURS
 */
export function describeTimestamp(
  value: string | number | Date | null | undefined,
  now: Date = new Date(),
  staleAfterHours: number = STALE_AFTER_HOURS
): TimestampInfo {
  const date = parseInstant(value);
  if (!date) {
    return {
      text: null,
      ageHours: null,
      ageText: null,
      stale: false,
      iso: null,
    };
  }

  const ageMs = Math.max(0, now.getTime() - date.getTime());
  const ageHours = Math.floor(ageMs / 3_600_000);

  return {
    text: `${WIB_FORMATTER.format(date)} WIB`,
    ageHours,
    ageText: relativeAge(date, now),
    stale: ageMs > staleAfterHours * 3_600_000,
    iso: date.toISOString(),
  };
}

/** "22 Sep 2026" in WIB, for date-only contexts such as the footer. */
export function formatWibDate(
  value: string | number | Date | null | undefined
): string | null {
  const date = parseInstant(value);
  return date ? WIB_DATE_FORMATTER.format(date) : null;
}
