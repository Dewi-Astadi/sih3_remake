import { normalizeJenis } from "./jenis.ts";

/**
 * Status classification for SIH3 pos types.
 *
 * One pure function is the single source of truth for every status label on the
 * public portal. Labels, tones and alert flags follow PRD §6:
 *
 * - Duga Air      : the API `status_siaga` (normal/waspada/siaga/awas).
 *                   Thresholds are per pos and are NOT defined in this codebase;
 *                   when the API has no status the result is "Status tidak tersedia".
 * - Kualitas Air  : PIj bands, evaluated from the value (API status is ignored).
 * - Curah Hujan   : mm bands, evaluated from the value (API status is ignored).
 * - Klimatologi   : no status class → neutral "—".
 * - Muka Air Tanah / AGWLR : no status class → neutral "—".
 */

export type StatusTone =
  | "good"
  | "watch"
  | "warning"
  | "danger"
  | "neutral"
  | "rain-light"
  | "rain-moderate"
  | "rain-heavy";

export interface StatusResult {
  /** Indonesian label shown next to the marker icon. */
  label: string;
  tone: StatusTone;
  /** True when the status belongs to the alert set (PRD §6). */
  alert: boolean;
}

export interface PosConfig {
  /**
   * Raw status string from the API (`latest_pengukuran.status_siaga`).
   *
   * TODO(owner): confirm whether the API also exposes per-pos Duga Air
   * thresholds. If it does, extend this config and derive the status here
   * instead of trusting the stored string. No thresholds are invented.
   */
  status?: string | null;
}

/** Shown when a pos type has no status class (Klimatologi, Muka Air Tanah). */
export const STATUS_TANPA_KELAS: StatusResult = {
  label: "—",
  tone: "neutral",
  alert: false,
};

/** Shown when a Duga Air pos has neither an API status nor thresholds. */
export const STATUS_TIDAK_TERSEDIA: StatusResult = {
  label: "Status tidak tersedia",
  tone: "neutral",
  alert: false,
};

const DUGA_AIR_STATUS: Record<string, StatusResult> = {
  normal: { label: "Normal", tone: "good", alert: false },
  waspada: { label: "Waspada", tone: "watch", alert: true },
  siaga: { label: "Siaga", tone: "warning", alert: true },
  awas: { label: "Awas", tone: "danger", alert: true },
};

/**
 * PIj bands (PRD §6 and the original site legend):
 *   Baik         0 <= PIj <= 1,0
 *   Cemar Ringan 1,0 < PIj <= 5,0
 *   Cemar Sedang 5,0 < PIj <= 10
 *   Cemar Berat  PIj > 10
 */
export function classifyKualitasAir(pij: number): StatusResult {
  if (!Number.isFinite(pij) || pij < 0) return STATUS_TIDAK_TERSEDIA;
  if (pij <= 1) return { label: "Baik", tone: "good", alert: false };
  if (pij <= 5) return { label: "Cemar Ringan", tone: "watch", alert: false };
  if (pij <= 10) return { label: "Cemar Sedang", tone: "warning", alert: true };
  return { label: "Cemar Berat", tone: "danger", alert: true };
}

/**
 * Curah hujan bands in mm (PRD §6):
 *   Tidak Hujan            0
 *   Hujan Sangat Ringan    0 < x <= 1
 *   Hujan Ringan           1 < x <= 5
 *   Hujan Sedang           5 < x <= 10
 *   Hujan Lebat            10 < x < 20
 *   Hujan Sangat Lebat     x >= 20
 *
 * TODO(owner): confirm inclusivity of the 10–20 boundary.
 */
export function classifyCurahHujan(mm: number): StatusResult {
  if (!Number.isFinite(mm) || mm < 0) return STATUS_TIDAK_TERSEDIA;
  if (mm === 0) return { label: "Tidak Hujan", tone: "neutral", alert: false };
  if (mm <= 1) return { label: "Hujan Sangat Ringan", tone: "rain-light", alert: false };
  if (mm <= 5) return { label: "Hujan Ringan", tone: "rain-light", alert: false };
  if (mm <= 10) return { label: "Hujan Sedang", tone: "rain-moderate", alert: false };
  if (mm < 20) return { label: "Hujan Lebat", tone: "rain-heavy", alert: true };
  return { label: "Hujan Sangat Lebat", tone: "rain-heavy", alert: true };
}

/**
 * Classifies one pos reading.
 *
 * @param jenis     API `jenis` value ("AWLR", "Kualitas Air", "ARR", "MAT", …)
 * @param value     Latest primary value, or null when the pos has no reading
 * @param posConfig Duga Air status supplied by the caller
 */
export function classify(
  jenis: string | null | undefined,
  value: number | null | undefined,
  posConfig: PosConfig = {}
): StatusResult {
  const key = normalizeJenis(jenis);

  if (key === "kualitas-air") {
    return value === null || value === undefined
      ? STATUS_TIDAK_TERSEDIA
      : classifyKualitasAir(value);
  }

  if (key === "curah-hujan") {
    return value === null || value === undefined
      ? STATUS_TIDAK_TERSEDIA
      : classifyCurahHujan(value);
  }

  if (key === "duga-air") {
    const status = posConfig.status?.trim().toLowerCase();
    if (status && DUGA_AIR_STATUS[status]) return DUGA_AIR_STATUS[status];
    return STATUS_TIDAK_TERSEDIA;
  }

  // Klimatologi and Muka Air Tanah carry no status class.
  return STATUS_TANPA_KELAS;
}
