import type { PosRow } from "./homepage-data.ts";
import { TIPE_ORDER, type TipeKey } from "./homepage-data.ts";

/**
 * URL state for the "Data terkini" table (S4).
 *
 * Filters, sorting and pagination live in the query string so the table works
 * without JavaScript and every view is linkable.
 */

export const TABLE_PAGE_SIZE = 15;

export type SortKey = "nama" | "waktu" | "status";
export type SortDir = "asc" | "desc";

export interface TableQuery {
  q: string;
  tipe: TipeKey | "";
  jenis: string;
  walidata: string;
  /** "peringatan" for the alert set, or an exact status label. */
  status: string;
  sort: SortKey;
  dir: SortDir;
  page: number;
}

export const DEFAULT_TABLE_QUERY: TableQuery = {
  q: "",
  tipe: "",
  jenis: "",
  walidata: "",
  status: "",
  sort: "nama",
  dir: "asc",
  page: 1,
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseTableQuery(params: RawSearchParams): TableQuery {
  const sortRaw = firstValue(params.sort);
  const dirRaw = firstValue(params.dir);
  const pageRaw = Number.parseInt(firstValue(params.page), 10);
  const tipeRaw = firstValue(params.tipe);

  return {
    q: firstValue(params.q).trim().slice(0, 100),
    tipe: TIPE_ORDER.includes(tipeRaw as TipeKey) ? (tipeRaw as TipeKey) : "",
    jenis: firstValue(params.jenis).trim(),
    walidata: firstValue(params.walidata).trim(),
    status: firstValue(params.status).trim(),
    sort: sortRaw === "waktu" || sortRaw === "status" ? sortRaw : "nama",
    dir: dirRaw === "desc" ? "desc" : "asc",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  };
}

/** Severity order used when sorting by status: alerts first. */
const TONE_RANK: Record<string, number> = {
  danger: 0,
  warning: 1,
  watch: 2,
  "rain-heavy": 3,
  "rain-moderate": 4,
  "rain-light": 5,
  good: 6,
  neutral: 7,
};

function matchesText(row: PosRow, needle: string): boolean {
  const haystack = [
    row.nama,
    row.kode_pos,
    row.sungai,
    row.das,
    row.sub_das,
    row.kabupaten,
    row.desa,
    row.kecamatan,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function filterRows(rows: PosRow[], query: TableQuery): PosRow[] {
  const needle = query.q.toLowerCase();

  return rows.filter((row) => {
    if (query.tipe && row.tipe !== query.tipe) return false;
    if (query.jenis && row.jenisKey !== query.jenis) return false;
    if (query.walidata && String(row.walidata?.id ?? "") !== query.walidata) return false;

    if (query.status === "peringatan" && !row.status.alert) return false;
    if (query.status && query.status !== "peringatan" && row.status.label !== query.status) {
      return false;
    }

    return needle.length === 0 || matchesText(row, needle);
  });
}

export function sortRows(rows: PosRow[], sort: SortKey, dir: SortDir): PosRow[] {
  const factor = dir === "desc" ? -1 : 1;
  const sorted = [...rows].sort((a, b) => {
    if (sort === "waktu") {
      const aTime = a.latest?.recorded_at ? new Date(a.latest.recorded_at).getTime() : null;
      const bTime = b.latest?.recorded_at ? new Date(b.latest.recorded_at).getTime() : null;
      if (aTime === null && bTime === null) return a.nama.localeCompare(b.nama, "id");
      if (aTime === null) return 1;
      if (bTime === null) return -1;
      return (aTime - bTime) * factor;
    }

    if (sort === "status") {
      const rank = (TONE_RANK[a.status.tone] ?? 9) - (TONE_RANK[b.status.tone] ?? 9);
      if (rank !== 0) return rank * factor;
      return a.status.label.localeCompare(b.status.label, "id") * factor;
    }

    return a.nama.localeCompare(b.nama, "id") * factor;
  });

  return sorted;
}

export interface TableHrefPatch {
  q?: string;
  tipe?: TipeKey | "";
  jenis?: string;
  walidata?: string;
  status?: string;
  sort?: SortKey;
  dir?: SortDir;
  page?: number;
}

/** Builds a homepage URL for the table, dropping default values. */
export function buildTableHref(query: TableQuery, patch: TableHrefPatch = {}): string {
  const next: TableQuery = { ...query, ...patch };
  const params = new URLSearchParams();

  if (next.q) params.set("q", next.q);
  if (next.tipe) params.set("tipe", next.tipe);
  if (next.jenis) params.set("jenis", next.jenis);
  if (next.walidata) params.set("walidata", next.walidata);
  if (next.status) params.set("status", next.status);
  if (next.sort !== "nama") params.set("sort", next.sort);
  if (next.dir !== "asc") params.set("dir", next.dir);
  if (next.page > 1) params.set("page", String(next.page));

  const queryString = params.toString();
  return queryString ? `/?${queryString}#data-terkini` : "/#data-terkini";
}

/** Sort link: flips direction when the column is already active. */
export function buildSortHref(query: TableQuery, key: SortKey): string {
  const isActive = query.sort === key;
  return buildTableHref(query, {
    sort: key,
    dir: isActive && query.dir === "asc" ? "desc" : "asc",
    page: 1,
  });
}

export function ariaSortFor(query: TableQuery, key: SortKey): "ascending" | "descending" | "none" {
  if (query.sort !== key) return "none";
  return query.dir === "asc" ? "ascending" : "descending";
}

export interface PageWindow {
  rows: PosRow[];
  page: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
}

export function paginate(rows: PosRow[], requestedPage: number): PageWindow {
  const total = rows.length;
  const lastPage = Math.max(1, Math.ceil(total / TABLE_PAGE_SIZE));
  const page = Math.min(Math.max(requestedPage, 1), lastPage);
  const start = (page - 1) * TABLE_PAGE_SIZE;
  const end = start + TABLE_PAGE_SIZE;

  return {
    rows: rows.slice(start, end),
    page,
    lastPage,
    total,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(end, total),
  };
}
