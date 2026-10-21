import { cache } from "react";

import { describeTimestamp, type TimestampInfo } from "./datetime.ts";
import { normalizeJenis, JENIS_META, type JenisKey, type JenisMeta } from "./jenis.ts";
import { classify, type StatusResult } from "./status.ts";

/**
 * Server-side homepage data.
 *
 * Deliberately separate from `lib/api.ts`: that module substitutes fabricated
 * fallback data when the API is unreachable, which must never reach the public
 * homepage. This module returns an explicit error instead, and the page renders
 * an error notice.
 */

export const HOMEPAGE_REVALIDATE_SECONDS = 60;

const API_BASE_URL =
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

export type TipeKey = "hidrologi" | "hidrometeorologi" | "hidrogeologi";

export const TIPE_ORDER: TipeKey[] = [
  "hidrologi",
  "hidrometeorologi",
  "hidrogeologi",
];

export const TIPE_LABEL: Record<TipeKey, string> = {
  hidrologi: "Hidrologi",
  hidrometeorologi: "Hidrometeorologi",
  hidrogeologi: "Hidrogeologi",
};

/**
 * Field definitions copied verbatim from the original SIH3 homepage (PRD §4).
 * Do not paraphrase or shorten.
 */
export const TIPE_DEFINITION: Record<TipeKey, string> = {
  hidrologi:
    "Ilmu yang mempelajari air yang terdapat pada dan/atau mengalir di permukaan tanah, termasuk pergerakan, distribusi, kualitas, serta interaksinya dengan air hujan dan air tanah.",
  hidrometeorologi:
    "Cabang ilmu yang mempelajari interaksi antara atmosfer (meteorologi) dan siklus air (hidrologi), khususnya kaitannya dengan cuaca dan iklim, serta dampaknya terhadap bencana alam.",
  hidrogeologi:
    "Cabang ilmu geologi yang mempelajari air tanah, termasuk keberadaan, pergerakan, kualitas, dan interaksinya dengan batuan dan tanah di bawah permukaan bumi.",
};

export interface WalidataRef {
  id: number;
  nama: string;
  singkatan: string;
}

export interface LatestReading {
  nilai: number | null;
  satuan: string | null;
  status_siaga: string | null;
  recorded_at: string | null;
  parameter_tambahan: Record<string, unknown> | null;
}

export interface PosRow {
  id: number;
  kode_pos: string;
  nama: string;
  tipe: TipeKey;
  jenis: string;
  jenisKey: JenisKey | null;
  jenisMeta: JenisMeta | null;
  wilayah_sungai: string;
  das: string;
  sub_das: string | null;
  sungai: string | null;
  desa: string | null;
  kecamatan: string | null;
  kabupaten: string | null;
  provinsi: string | null;
  walidata: WalidataRef | null;
  latest: LatestReading | null;
  status: StatusResult;
  timestamp: TimestampInfo;
}

export interface AgencyCount {
  walidata: WalidataRef;
  total: number;
  byJenis: Partial<Record<JenisKey, number>>;
}

export interface FieldSummary {
  tipe: TipeKey;
  posCount: number;
  agencyCount: number;
  agencies: AgencyCount[];
}

export interface HomepageDataset {
  rows: PosRow[];
  fields: FieldSummary[];
  lastUpdated: string | null;
  fetchedAt: string;
}

export type HomepageResult =
  | { ok: true; data: HomepageDataset }
  | { ok: false; error: string };

interface ApiPengukuran {
  nilai?: number | null;
  satuan?: string | null;
  status_siaga?: string | null;
  recorded_at?: string | null;
  parameter_tambahan?: Record<string, unknown> | null;
}

interface ApiPos {
  id?: number;
  kode_pos?: string;
  nama?: string;
  tipe?: string;
  jenis?: string;
  wilayah_sungai?: string;
  das?: string;
  sub_das?: string | null;
  sungai?: string | null;
  desa?: string | null;
  kecamatan?: string | null;
  kabupaten?: string | null;
  provinsi?: string | null;
  walidata?: { id?: number; nama?: string; singkatan?: string } | null;
  latest_pengukuran?: ApiPengukuran | null;
}

interface ApiPage {
  success?: boolean;
  data?: ApiPos[];
  meta?: { last_page?: number; total?: number };
}

function asTipe(value: string | undefined): TipeKey | null {
  if (value === "hidrologi" || value === "hidrometeorologi" || value === "hidrogeologi") {
    return value;
  }
  return null;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

async function fetchPage(page: number, perPage: number): Promise<ApiPage> {
  const url = new URL(`${API_BASE_URL}/pos`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("sort_by", "nama");
  url.searchParams.set("sort_direction", "asc");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: HOMEPAGE_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`API /pos menanggapi ${response.status}`);
  }

  return (await response.json()) as ApiPage;
}

/** Fetches every pos page. The API caps `per_page` at 100. */
async function fetchAllPos(): Promise<ApiPos[]> {
  const perPage = 100;
  const first = await fetchPage(1, perPage);
  if (!first.success || !Array.isArray(first.data)) {
    throw new Error("Format respons API /pos tidak dikenali");
  }

  const lastPage = Math.min(Math.max(first.meta?.last_page ?? 1, 1), 50);
  if (lastPage === 1) return first.data;

  const rest = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) => fetchPage(index + 2, perPage))
  );

  return rest.reduce<ApiPos[]>(
    (all, page) => all.concat(Array.isArray(page.data) ? page.data : []),
    [...first.data]
  );
}

function buildRow(raw: ApiPos, now: Date): PosRow | null {
  const tipe = asTipe(raw.tipe);
  if (!tipe || typeof raw.id !== "number" || !raw.nama) return null;

  const latestRaw = raw.latest_pengukuran ?? null;
  const latest: LatestReading | null = latestRaw
    ? {
        nilai: toNumber(latestRaw.nilai),
        satuan: latestRaw.satuan ?? null,
        status_siaga: latestRaw.status_siaga ?? null,
        recorded_at: latestRaw.recorded_at ?? null,
        parameter_tambahan: latestRaw.parameter_tambahan ?? null,
      }
    : null;

  const jenisKey = normalizeJenis(raw.jenis);

  return {
    id: raw.id,
    kode_pos: raw.kode_pos ?? String(raw.id),
    nama: raw.nama,
    tipe,
    jenis: raw.jenis ?? "",
    jenisKey,
    jenisMeta: jenisKey ? JENIS_META[jenisKey] : null,
    wilayah_sungai: raw.wilayah_sungai ?? "",
    das: raw.das ?? "",
    sub_das: raw.sub_das ?? null,
    sungai: raw.sungai ?? null,
    desa: raw.desa ?? null,
    kecamatan: raw.kecamatan ?? null,
    kabupaten: raw.kabupaten ?? null,
    provinsi: raw.provinsi ?? null,
    walidata:
      raw.walidata && typeof raw.walidata.id === "number" && raw.walidata.nama
        ? {
            id: raw.walidata.id,
            nama: raw.walidata.nama,
            singkatan: raw.walidata.singkatan ?? raw.walidata.nama,
          }
        : null,
    latest,
    status: classify(raw.jenis, latest?.nilai ?? null, {
      status: latest?.status_siaga ?? null,
    }),
    timestamp: describeTimestamp(latest?.recorded_at ?? null, now),
  };
}

function summarise(rows: PosRow[]): FieldSummary[] {
  return TIPE_ORDER.map((tipe) => {
    const inField = rows.filter((row) => row.tipe === tipe);
    const agencies = new Map<number, AgencyCount>();

    for (const row of inField) {
      if (!row.walidata) continue;
      const entry = agencies.get(row.walidata.id) ?? {
        walidata: row.walidata,
        total: 0,
        byJenis: {},
      };
      entry.total += 1;
      if (row.jenisKey) {
        entry.byJenis[row.jenisKey] = (entry.byJenis[row.jenisKey] ?? 0) + 1;
      }
      agencies.set(row.walidata.id, entry);
    }

    return {
      tipe,
      posCount: inField.length,
      agencyCount: agencies.size,
      agencies: [...agencies.values()].sort((a, b) => b.total - a.total),
    };
  });
}

/**
 * Loads and aggregates the homepage dataset once per render.
 * Returns an explicit error instead of partial or fallback data.
 */
export const getHomepageData = cache(async (): Promise<HomepageResult> => {
  try {
    const raw = await fetchAllPos();
    const now = new Date();
    const rows = raw
      .map((item) => buildRow(item, now))
      .filter((row): row is PosRow => row !== null);

    const timestamps = rows
      .map((row) => row.latest?.recorded_at)
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .map((value) => new Date(value).getTime())
      .filter((value) => Number.isFinite(value));

    const lastUpdated =
      timestamps.length > 0
        ? new Date(Math.max(...timestamps)).toISOString()
        : null;

    return {
      ok: true,
      data: {
        rows,
        fields: summarise(rows),
        lastUpdated,
        fetchedAt: now.toISOString(),
      },
    };
  } catch (error) {
    console.error("[homepage] Gagal memuat data dari API:", error);
    return {
      ok: false,
      error:
        "Data pemantauan tidak dapat dimuat dari server API. Angka dan status pada halaman ini tidak ditampilkan agar tidak menyesatkan.",
    };
  }
});
