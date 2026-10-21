/**
 * Canonical pos types for SIH3 Serayu Opak.
 *
 * The API stores `jenis` values ("AWLR", "ARR", "MAT", "Kualitas Air",
 * "Klimatologi"). The public portal uses the pos-type names from the original
 * site ("Duga Air", "Curah Hujan", "Muka Air Tanah"). This module is the single
 * mapping between the two, and carries the headline parameter for each type.
 *
 * Labels come from the PRD (§6) and the original site. Units are never guessed:
 * they are taken from the API measurement (`satuan`) when present.
 */

export type JenisKey =
  | "duga-air"
  | "kualitas-air"
  | "curah-hujan"
  | "klimatologi"
  | "muka-air-tanah";

export interface ParameterMeta {
  /** Key used in `parameter_tambahan`. */
  key: string;
  label: string;
}

export interface JenisMeta {
  key: JenisKey;
  /** Pos-type name shown in the UI. */
  label: string;
  /** Field this pos type belongs to. */
  tipe: "hidrologi" | "hidrometeorologi" | "hidrogeologi";
  /** Name of the primary (headline) parameter. */
  primaryLabel: string;
  /** Secondary parameters, in display order. */
  secondary: ParameterMeta[];
}

export const JENIS_META: Record<JenisKey, JenisMeta> = {
  "duga-air": {
    key: "duga-air",
    label: "Duga Air",
    tipe: "hidrologi",
    primaryLabel: "Tinggi Muka Air (TMA)",
    secondary: [
      { key: "debit", label: "Debit" },
      { key: "kecepatan_aliran", label: "Kecepatan aliran" },
      { key: "suhu_air", label: "Suhu air" },
    ],
  },
  "kualitas-air": {
    key: "kualitas-air",
    label: "Kualitas Air",
    tipe: "hidrologi",
    primaryLabel: "Indeks Pencemaran (PIj)",
    secondary: [
      { key: "do", label: "DO" },
      { key: "ph", label: "pH" },
      { key: "bod", label: "BOD" },
      { key: "cod", label: "COD" },
      { key: "tss", label: "TSS" },
      { key: "suhu", label: "Suhu" },
    ],
  },
  "curah-hujan": {
    key: "curah-hujan",
    label: "Curah Hujan",
    tipe: "hidrometeorologi",
    primaryLabel: "Curah hujan",
    secondary: [
      { key: "durasi_menit", label: "Durasi hujan" },
      { key: "kelembapan_relatif", label: "Kelembapan relatif" },
    ],
  },
  klimatologi: {
    key: "klimatologi",
    label: "Klimatologi",
    tipe: "hidrometeorologi",
    primaryLabel: "Suhu",
    secondary: [
      { key: "kelembapan", label: "Kelembapan" },
      { key: "tekanan_udara", label: "Tekanan udara" },
      { key: "kecepatan_angin", label: "Kecepatan angin" },
      { key: "arah_angin", label: "Arah angin" },
      { key: "radiasi_matahari", label: "Radiasi matahari" },
      { key: "curah_hujan", label: "Curah hujan" },
    ],
  },
  "muka-air-tanah": {
    key: "muka-air-tanah",
    label: "Muka Air Tanah",
    tipe: "hidrogeologi",
    primaryLabel: "Kedalaman muka air tanah",
    secondary: [
      { key: "ph", label: "pH" },
      { key: "suhu_air", label: "Suhu air" },
      { key: "kedalaman_sumur", label: "Kedalaman sumur" },
      { key: "daya_hantar_listrik", label: "Daya hantar listrik" },
    ],
  },
};

/** Normalises an API `jenis` value to a canonical pos type key. */
export function normalizeJenis(jenis: string | null | undefined): JenisKey | null {
  if (!jenis) return null;
  const value = jenis.trim().toLowerCase();

  if (value === "awlr" || value === "duga air" || value === "duga-air") {
    return "duga-air";
  }
  if (value === "kualitas air" || value === "kualitas-air") {
    return "kualitas-air";
  }
  if (value === "arr" || value === "curah hujan" || value === "curah-hujan") {
    return "curah-hujan";
  }
  if (value === "klimatologi") {
    return "klimatologi";
  }
  if (
    value === "mat" ||
    value === "agwlr" ||
    value === "muka air tanah" ||
    value === "muka-air-tanah"
  ) {
    return "muka-air-tanah";
  }

  return null;
}

export const TIPE_META: Record<
  "hidrologi" | "hidrometeorologi" | "hidrogeologi",
  { label: string; jenis: JenisKey[] }
> = {
  hidrologi: { label: "Hidrologi", jenis: ["duga-air", "kualitas-air"] },
  hidrometeorologi: {
    label: "Hidrometeorologi",
    jenis: ["curah-hujan", "klimatologi"],
  },
  hidrogeologi: { label: "Hidrogeologi", jenis: ["muka-air-tanah"] },
};
