import { JENIS_META, normalizeJenis, type JenisKey } from "./jenis.ts";
import type { TipeKey } from "./homepage-data.ts";
import { JENIS_API_VALUE, DATASET_PAGE_SIZE, type DatasetQuery } from "./dataset.ts";

/**
 * Server-side data for the per-field dataset pages.
 *
 * Like `homepage-data.ts` this module never substitutes fabricated rows: if the
 * API is unreachable the page shows an explicit error instead of misleading
 * numbers. Per-pos-type counts are best-effort and degrade to `null`.
 */

const API_BASE_URL =
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const REVALIDATE_SECONDS = 60;

export interface DatasetRow {
  id: number;
  kodePos: string;
  nama: string;
  jenis: string;
  jenisKey: JenisKey | null;
  jenisLabel: string;
  das: string;
  wilayahSungai: string;
  kabupaten: string | null;
  walidata: string;
  walidataFull: string;
  statusAlat: string;
}

export interface DatasetPageData {
  rows: DatasetRow[];
  total: number;
  page: number;
  lastPage: number;
  perPage: number;
  /** Result count per pos type, ignoring the active `jenis` filter. */
  counts: Partial<Record<JenisKey, number>>;
}

export type DatasetResult =
  | { ok: true; data: DatasetPageData }
  | { ok: false; error: string };

interface ApiWalidataRef {
  id?: number;
  nama?: string;
  singkatan?: string;
}

interface ApiPos {
  id?: number;
  kode_pos?: string;
  nama?: string;
  jenis?: string;
  das?: string;
  wilayah_sungai?: string;
  kabupaten?: string | null;
  status_alat?: string | null;
  walidata?: ApiWalidataRef | null;
}

interface ApiPage {
  success?: boolean;
  data?: ApiPos[];
  meta?: { total?: number; last_page?: number; current_page?: number; per_page?: number };
}

function buildParams(tipe: TipeKey, query: DatasetQuery): URLSearchParams {
  const params = new URLSearchParams();
  params.set("tipe", tipe);
  params.set("sort_by", "nama");
  params.set("sort_direction", "asc");
  if (query.q) params.set("q", query.q);
  if (query.das) params.set("das", query.das);
  if (query.wilayah) params.set("wilayah_sungai", query.wilayah);
  if (query.walidata) params.set("walidata_id", query.walidata);
  return params;
}

async function fetchJson(params: URLSearchParams): Promise<ApiPage> {
  const url = new URL(`${API_BASE_URL}/pos`);
  params.forEach((value, key) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) {
    throw new Error(`API /pos menanggapi ${response.status}`);
  }
  return (await response.json()) as ApiPage;
}

function toRow(raw: ApiPos): DatasetRow | null {
  if (typeof raw.id !== "number" || !raw.nama) return null;

  const jenisKey = normalizeJenis(raw.jenis);
  const meta = jenisKey ? JENIS_META[jenisKey] : null;

  return {
    id: raw.id,
    kodePos: raw.kode_pos ?? String(raw.id),
    nama: raw.nama,
    jenis: raw.jenis ?? "",
    jenisKey,
    jenisLabel: meta?.label ?? raw.jenis ?? "Pos",
    das: raw.das ?? "",
    wilayahSungai: raw.wilayah_sungai ?? "",
    kabupaten: raw.kabupaten ?? null,
    walidata: raw.walidata?.singkatan || raw.walidata?.nama || "—",
    walidataFull: raw.walidata?.nama || raw.walidata?.singkatan || "—",
    statusAlat: raw.status_alat ?? "aktif",
  };
}

async function fetchCount(tipe: TipeKey, query: DatasetQuery, jenis: JenisKey): Promise<number | null> {
  const params = buildParams(tipe, query);
  params.set("jenis", JENIS_API_VALUE[jenis]);
  params.set("per_page", "1");
  params.set("page", "1");
  try {
    const page = await fetchJson(params);
    return typeof page.meta?.total === "number" ? page.meta.total : null;
  } catch {
    return null;
  }
}

export async function getDatasetPage(
  tipe: TipeKey,
  jenisKeys: JenisKey[],
  query: DatasetQuery
): Promise<DatasetResult> {
  const params = buildParams(tipe, query);
  if (query.jenis) params.set("jenis", query.jenis);
  params.set("page", String(query.page));
  params.set("per_page", String(DATASET_PAGE_SIZE));

  let page: ApiPage;
  try {
    page = await fetchJson(params);
  } catch (error) {
    console.error(`[dataset:${tipe}] Gagal memuat daftar pos:`, error);
    return {
      ok: false,
      error:
        "Daftar pos tidak dapat dimuat dari server API. Data tidak ditampilkan agar tidak menyesatkan.",
    };
  }

  if (!page.success || !Array.isArray(page.data)) {
    return { ok: false, error: "Format respons API /pos tidak dikenali." };
  }

  const rows = page.data
    .map(toRow)
    .filter((row): row is DatasetRow => row !== null);

  const countResults = await Promise.all(jenisKeys.map((key) => fetchCount(tipe, query, key)));
  const counts: Partial<Record<JenisKey, number>> = {};
  jenisKeys.forEach((key, index) => {
    const value = countResults[index];
    if (value !== null) counts[key] = value;
  });

  return {
    ok: true,
    data: {
      rows,
      total: page.meta?.total ?? rows.length,
      page: page.meta?.current_page ?? query.page,
      lastPage: Math.max(page.meta?.last_page ?? 1, 1),
      perPage: page.meta?.per_page ?? DATASET_PAGE_SIZE,
      counts,
    },
  };
}
