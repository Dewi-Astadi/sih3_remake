import type { JenisKey } from "./jenis.ts";
import type { TipeKey } from "./homepage-data.ts";

/**
 * Configuration and URL state for the per-field dataset pages
 * (/hidrologi, /hidrometeorologi, /hidrogeologi).
 *
 * Definitions are copied verbatim from the original SIH3 site through
 * TIPE_DEFINITION; nothing here is paraphrased. This module stays free of
 * server-only imports so client components (Navbar) can use DATASET_HREF.
 */

export interface DatasetPageConfig {
  tipe: TipeKey;
  /** Eyebrow above the hero title. */
  kicker: string;
  /** Hero title, e.g. "Informasi Hidrologi". */
  title: string;
  /** Hero paragraph — the official field definition. */
  description: string;
  /** Pos types belonging to the field, in display order. */
  jenis: JenisKey[];
  /** Heading of the table section. */
  tableTitle: string;
}

export const DATASET_PAGES: Record<TipeKey, DatasetPageConfig> = {
  hidrologi: {
    tipe: "hidrologi",
    kicker: "Dataset SIH3",
    title: "Informasi Hidrologi",
    description:
      "Hidrologi adalah ilmu yang mempelajari tentang air yang terdapat pada dan/atau mengalir di permukaan tanah, termasuk pergerakan, distribusi, kualitas, serta interaksinya dengan air hujan dan air tanah.",
    jenis: ["duga-air", "kualitas-air"],
    tableTitle: "Daftar pos hidrologi",
  },
  hidrometeorologi: {
    tipe: "hidrometeorologi",
    kicker: "Dataset SIH3",
    title: "Informasi Hidrometeorologi",
    description:
      "Hidrometeorologi adalah cabang ilmu yang mempelajari interaksi antara atmosfer (meteorologi) dan siklus air (hidrologi), khususnya kaitannya dengan cuaca dan iklim, serta dampaknya terhadap bencana alam.",
    jenis: ["curah-hujan", "klimatologi"],
    tableTitle: "Daftar pos hidrometeorologi",
  },
  hidrogeologi: {
    tipe: "hidrogeologi",
    kicker: "Dataset SIH3",
    title: "Informasi Hidrogeologi",
    description:
      "Hidrogeologi adalah cabang ilmu geologi yang mempelajari air tanah, termasuk keberadaan, pergerakan, kualitas, dan interaksinya dengan batuan dan tanah di bawah permukaan bumi.",
    jenis: ["muka-air-tanah"],
    tableTitle: "Daftar pos hidrogeologi",
  },
};

/** Canonical route for a field's dataset page. */
export const DATASET_HREF: Record<TipeKey, string> = {
  hidrologi: "/hidrologi",
  hidrometeorologi: "/hidrometeorologi",
  hidrogeologi: "/hidrogeologi",
};

/**
 * The API stores the pos type in `jenis` as an abbreviation ("AWLR", "ARR",
 * "MAT") or a full name ("Kualitas Air", "Klimatologi"). Filters must send
 * exactly that value; the UI shows the friendlier label from JENIS_META.
 */
export const JENIS_API_VALUE: Record<JenisKey, string> = {
  "duga-air": "AWLR",
  "kualitas-air": "Kualitas Air",
  "curah-hujan": "ARR",
  klimatologi: "Klimatologi",
  "muka-air-tanah": "MAT",
};

/** Soft badge palette per pos type, matching the status tokens. */
export const JENIS_BADGE: Record<JenisKey, string> = {
  "duga-air": "border-[#A9C8EC] bg-[#E6F0FB] text-[#12467A]",
  "kualitas-air": "border-[#86C79B] bg-[#E6F4EA] text-[#14532D]",
  "curah-hujan": "border-[#86B2E0] bg-[#CFE3F8] text-[#0E3A66]",
  klimatologi: "border-[#E5C34D] bg-[#FEF6D8] text-[#6B4E00]",
  "muka-air-tanah": "border-[#C5CDD8] bg-[#EEF1F5] text-[#3D4756]",
};

/** Known river basins (DAS) offered in the filter panel. */
export const DAS_OPTIONS = [
  "DAS Progo",
  "DAS Opak",
  "DAS Oyo",
  "DAS Serang",
  "DAS Bogowonto",
  "DAS Serayu",
  "DAS Klawing",
];

export const WILAYAH_OPTIONS = [
  "WS Progo Opak Serang",
  "WS Serayu Bogowonto",
  "WS Serayu Opak",
];

export const DATASET_PAGE_SIZE = 15;

export interface DatasetQuery {
  q: string;
  /** API `jenis` value, or "" for all pos types in the field. */
  jenis: string;
  das: string;
  wilayah: string;
  walidata: string;
  page: number;
}

export const EMPTY_DATASET_QUERY: DatasetQuery = {
  q: "",
  jenis: "",
  das: "",
  wilayah: "",
  walidata: "",
  page: 1,
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseDatasetQuery(
  searchParams: Record<string, string | string[] | undefined>
): DatasetQuery {
  const page = Number.parseInt(firstValue(searchParams.page), 10);
  return {
    q: firstValue(searchParams.q).trim(),
    jenis: firstValue(searchParams.jenis).trim(),
    das: firstValue(searchParams.das).trim(),
    wilayah: firstValue(searchParams.wilayah).trim(),
    walidata: firstValue(searchParams.walidata).trim(),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Builds a link to the field page with the current filters plus a patch. */
export function datasetHref(
  tipe: TipeKey,
  current: DatasetQuery,
  patch: Partial<DatasetQuery> = {}
): string {
  const next: DatasetQuery = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.jenis) params.set("jenis", next.jenis);
  if (next.das) params.set("das", next.das);
  if (next.wilayah) params.set("wilayah", next.wilayah);
  if (next.walidata) params.set("walidata", next.walidata);
  if (next.page > 1) params.set("page", String(next.page));
  const query = params.toString();
  return query ? `${DATASET_HREF[tipe]}?${query}` : DATASET_HREF[tipe];
}

/** True when any filter (not pagination) is active. */
export function hasActiveFilters(query: DatasetQuery): boolean {
  return Boolean(query.q || query.jenis || query.das || query.wilayah || query.walidata);
}
