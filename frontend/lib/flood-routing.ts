import { classify, type StatusResult } from "./status.ts";
import { describeTimestamp, type TimestampInfo } from "./datetime.ts";

/**
 * Server-side data for the FloodRouting page.
 *
 * Flood routing needs water-level gauges (AWLR) along one river, upstream to
 * downstream. This module only reports what the API actually holds: the AWLR
 * stations, their latest reading, and how many gauges each basin has. It never
 * estimates travel time or arrival time — no thresholds or river-km data exist
 * in the API, and inventing them would be unsafe on a flood-warning page.
 */

const API_BASE_URL =
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const REVALIDATE_SECONDS = 60;

/** Minimum gauges on one river before a routing calculation is meaningful. */
export const MIN_GAUGES_PER_BASIN = 2;

export interface FloodGauge {
  id: number;
  kodePos: string;
  nama: string;
  das: string;
  sungai: string | null;
  kabupaten: string | null;
  latitude: number | null;
  longitude: number | null;
  nilai: number | null;
  satuan: string;
  status: StatusResult;
  timestamp: TimestampInfo;
  walidata: string;
}

export interface FloodBasin {
  das: string;
  gauges: FloodGauge[];
  /** True when the basin has enough gauges for a routing calculation. */
  routable: boolean;
}

export interface FloodRoutingData {
  basins: FloodBasin[];
  gaugeCount: number;
  routableBasins: number;
  lastUpdated: string | null;
}

export type FloodRoutingResult =
  | { ok: true; data: FloodRoutingData }
  | { ok: false; error: string };

interface ApiPengukuran {
  nilai?: number | null;
  satuan?: string | null;
  status_siaga?: string | null;
  recorded_at?: string | null;
}

interface ApiPos {
  id?: number;
  kode_pos?: string;
  nama?: string;
  jenis?: string;
  das?: string;
  sungai?: string | null;
  kabupaten?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  walidata?: { singkatan?: string; nama?: string } | null;
  latest_pengukuran?: ApiPengukuran | null;
}

interface ApiPage {
  success?: boolean;
  data?: ApiPos[];
  meta?: { total?: number };
}

function toGauge(raw: ApiPos, now: Date): FloodGauge | null {
  if (typeof raw.id !== "number" || !raw.nama) return null;

  const latest = raw.latest_pengukuran ?? null;
  const nilai = typeof latest?.nilai === "number" ? latest.nilai : null;

  return {
    id: raw.id,
    kodePos: raw.kode_pos ?? String(raw.id),
    nama: raw.nama,
    das: raw.das?.trim() || "DAS tidak tercatat",
    sungai: raw.sungai ?? null,
    kabupaten: raw.kabupaten ?? null,
    latitude: typeof raw.latitude === "number" ? raw.latitude : null,
    longitude: typeof raw.longitude === "number" ? raw.longitude : null,
    nilai,
    satuan: latest?.satuan ?? "m",
    status: classify(raw.jenis ?? "AWLR", nilai, { status: latest?.status_siaga ?? null }),
    timestamp: describeTimestamp(latest?.recorded_at ?? null, now),
    walidata: raw.walidata?.singkatan || raw.walidata?.nama || "—",
  };
}

export async function getFloodRoutingData(): Promise<FloodRoutingResult> {
  const url = new URL(`${API_BASE_URL}/pos`);
  url.searchParams.set("jenis", "AWLR");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("sort_by", "nama");
  url.searchParams.set("sort_direction", "asc");

  let page: ApiPage;
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      throw new Error(`API /pos menanggapi ${response.status}`);
    }
    page = (await response.json()) as ApiPage;
  } catch (error) {
    console.error("[floodrouting] Gagal memuat pos AWLR:", error);
    return {
      ok: false,
      error:
        "Data pos duga air tidak dapat dimuat dari server API. Halaman ini tidak menampilkan perkiraan agar tidak menyesatkan.",
    };
  }

  if (!page.success || !Array.isArray(page.data)) {
    return { ok: false, error: "Format respons API /pos tidak dikenali." };
  }

  const now = new Date();
  const gauges = page.data
    .map((item) => toGauge(item, now))
    .filter((gauge): gauge is FloodGauge => gauge !== null);

  const byBasin = new Map<string, FloodGauge[]>();
  for (const gauge of gauges) {
    const list = byBasin.get(gauge.das) ?? [];
    list.push(gauge);
    byBasin.set(gauge.das, list);
  }

  const basins: FloodBasin[] = [...byBasin.entries()]
    .map(([das, list]) => ({
      das,
      gauges: [...list].sort((a, b) => a.nama.localeCompare(b.nama, "id")),
      routable: list.length >= MIN_GAUGES_PER_BASIN,
    }))
    .sort((a, b) => a.das.localeCompare(b.das, "id"));

  const timestamps = gauges
    .map((gauge) => gauge.timestamp.iso)
    .filter((iso): iso is string => typeof iso === "string")
    .map((iso) => new Date(iso).getTime())
    .filter((value) => Number.isFinite(value));

  return {
    ok: true,
    data: {
      basins,
      gaugeCount: gauges.length,
      routableBasins: basins.filter((basin) => basin.routable).length,
      lastUpdated: timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null,
    },
  };
}
