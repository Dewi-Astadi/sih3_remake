import { JENIS_META, type JenisKey } from "./jenis.ts";

/**
 * Display formatting shared by the homepage tables.
 *
 * Units come from the API. PIj is unitless by definition (PRD §6), so the
 * API's "indeks" label is not shown as a unit.
 */

const NUMBER_FORMAT = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 2,
});

export interface NilaiDisplay {
  value: string;
  unit: string | null;
  label: string;
  hasReading: boolean;
}

export function formatNilai(
  nilai: number | null | undefined,
  satuan: string | null | undefined,
  jenisKey: JenisKey | null
): NilaiDisplay {
  const label = jenisKey ? JENIS_META[jenisKey].primaryLabel : "Nilai";
  const unit =
    jenisKey === "kualitas-air"
      ? null
      : satuan && satuan.trim().length > 0
        ? satuan.trim()
        : null;

  if (nilai === null || nilai === undefined || !Number.isFinite(nilai)) {
    return { value: "—", unit: null, label, hasReading: false };
  }

  return { value: NUMBER_FORMAT.format(nilai), unit, label, hasReading: true };
}

/**
 * "Sungai Progo · DAS Progo" style location line, from API fields only.
 * The API sometimes stores the prefix already ("DAS Progo"), so it is not
 * added twice.
 */
export function locationLine(row: {
  sungai: string | null;
  das: string;
  sub_das: string | null;
}): string {
  const das = row.das.trim();
  const dasLabel = !das
    ? null
    : /^das\b/i.test(das)
      ? das
      : `DAS ${das}`;

  const parts = [row.sungai, dasLabel, row.sub_das].filter(
    (part): part is string => Boolean(part && part.trim().length > 0)
  );
  return parts.length > 0 ? parts.join(" · ") : "—";
}

/** "Desa, Kecamatan" line; falls back to the province when unknown. */
export function locationDetail(row: {
  desa: string | null;
  kecamatan: string | null;
  provinsi: string | null;
}): string {
  const parts = [row.desa, row.kecamatan, row.provinsi].filter(
    (part): part is string => Boolean(part)
  );
  return parts.length > 0 ? parts.join(", ") : "—";
}
