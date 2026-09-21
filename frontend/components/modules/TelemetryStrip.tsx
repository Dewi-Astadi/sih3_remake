"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Clock,
  Download,
  Droplets,
  CloudRain,
  Layers,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { getTelemetrySummary, getExportUrl } from "@/lib/api";
import { TelemetryItem, StatusSiaga } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "Baru saja";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMin / 60);

    if (diffMin < 0) return "Baru saja";
    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;

    return (
      date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  } catch {
    return "Baru saja";
  }
}

function getStatusSiagaBadge(status: StatusSiaga) {
  const s = (status || "normal").toLowerCase();
  switch (s) {
    case "waspada":
      return (
        <Badge
          variant="amber"
          className="flex items-center gap-1 font-semibold px-2 py-0.5 border"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>Waspada</span>
        </Badge>
      );
    case "siaga":
    case "awas":
      return (
        <Badge
          variant="destructive"
          className="flex items-center gap-1 font-semibold px-2 py-0.5 border"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
          <span>{s === "awas" ? "Awas" : "Siaga"}</span>
        </Badge>
      );
    case "normal":
    default:
      return (
        <Badge
          variant="emerald"
          className="flex items-center gap-1 font-semibold px-2 py-0.5 border"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Normal</span>
        </Badge>
      );
  }
}

function getStationTypeIcon(jenis: string) {
  const j = (jenis || "").toUpperCase();
  if (j.includes("AWLR")) {
    return <Droplets className="w-4 h-4 text-sky-600" />;
  }
  if (j.includes("ARR")) {
    return <CloudRain className="w-4 h-4 text-blue-600" />;
  }
  if (j.includes("MAT")) {
    return <Layers className="w-4 h-4 text-indigo-600" />;
  }
  return <Activity className="w-4 h-4 text-emerald-600" />;
}

function getMeasurementLabel(jenis: string) {
  const j = (jenis || "").toUpperCase();
  if (j.includes("AWLR")) return "Tinggi Muka Air (TMA)";
  if (j.includes("ARR")) return "Curah Hujan Harian";
  if (j.includes("MAT")) return "Kedalaman Muka Air Tanah";
  if (j.includes("KUALITAS")) return "Derajat Keasaman (pH)";
  return "Nilai Pemantauan Terkini";
}

export function TelemetryStrip() {
  const [items, setItems] = useState<TelemetryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isPending, startTransition] = useTransition();

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const data = await getTelemetrySummary();
      setItems(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Gagal memuat telemetri:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleManualRefresh = () => {
    startTransition(() => {
      fetchTelemetry();
    });
  };

  // Filter items by tab
  const filteredItems = items.filter((item) => {
    if (activeTab === "semua") return true;
    if (activeTab === "awlr") return item.jenis.toUpperCase().includes("AWLR");
    if (activeTab === "arr") return item.jenis.toUpperCase().includes("ARR");
    if (activeTab === "mat") return item.jenis.toUpperCase().includes("MAT");
    return true;
  });

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Real-Time Monitoring</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Pemantauan Telemetri Terkini
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl">
              Pengukuran otomatis sensor AWLR, ARR, dan MAT di sepanjang DAS Progo, Opak, &amp; Bogowonto.
            </p>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Filter Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("semua")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                  activeTab === "semua"
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                Semua ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("awlr")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                  activeTab === "awlr"
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                AWLR (TMA)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("arr")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                  activeTab === "arr"
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                ARR (Hujan)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("mat")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                  activeTab === "mat"
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                MAT (Air Tanah)
              </button>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={loading || isPending}
              className="h-9 px-3 rounded-xl border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50"
              title="Perbarui telemetri"
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5", (loading || isPending) && "animate-spin")}
              />
              <span className="hidden sm:inline text-xs font-medium">Segarkan</span>
            </Button>
          </div>
        </div>

        {/* Telemetry Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <Skeleton className="h-10 w-28 rounded-md mb-2" />
                  <Skeleton className="h-4 w-40 rounded-md" />
                </div>
                <div className="pt-3 flex gap-2">
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
            <Activity className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">
              Tidak ada data telemetri yang sesuai
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Silakan pilih kategori lain atau periksa kembali koneksi sistem SIH3.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("semua")}
              className="mt-4 rounded-xl"
            >
              Lihat Semua Stasiun
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const exportUrl = getExportUrl(item.id, "csv");
              const measurementLabel = getMeasurementLabel(item.jenis);
              const formattedTime = formatRelativeTime(
                item.latest_pengukuran?.recorded_at || item.recorded_at
              );

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  {/* Top Bar: Jenis Pos & Status Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-semibold">
                        {getStationTypeIcon(item.jenis)}
                        <span>{item.jenis}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {item.kode_pos}
                        </span>
                      </div>
                      <div>{getStatusSiagaBadge(item.status_siaga)}</div>
                    </div>

                    {/* Station Name & River / DAS */}
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        <Link href={`/pos/${item.id}`} className="hover:underline focus:outline-none">
                          {item.nama}
                        </Link>
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {item.sungai && item.sungai !== "-"
                            ? `${item.sungai}, `
                            : ""}
                          {item.das}
                        </span>
                        {item.kabupaten && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{item.kabupaten}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Measurement Big Value Box */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                      <div className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                        {measurementLabel}
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold tracking-tight text-slate-950 font-sans">
                          {item.nilai !== null && item.nilai !== undefined
                            ? Number(item.nilai).toFixed(2)
                            : "-"}
                        </span>
                        <span className="text-sm font-bold text-slate-600">
                          {item.satuan || ""}
                        </span>
                      </div>

                      {/* Extra info if available (e.g. intensitas or debit) */}
                      {item.latest_pengukuran?.parameter_tambahan && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                          <span>Info Parameter:</span>
                          <span className="font-semibold text-slate-800">
                            {Object.entries(
                              item.latest_pengukuran.parameter_tambahan
                            )
                              .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
                              .join(" • ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Timestamp & Quick Action Buttons */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedTime}</span>
                      </div>
                      {item.walidata && (
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.walidata.singkatan || item.walidata.nama}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        href={`/pos/${item.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
                      >
                        <span>Detail Pos</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={exportUrl}
                        download
                        className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition-colors shadow-xs"
                        title="Unduh data pengukuran terkini (CSV)"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">CSV</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner to Data Explorer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
              <TrendingUp className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-slate-700">
              Menampilkan <span className="font-semibold text-slate-950">{filteredItems.length}</span> stasiun prioritas. Tersedia <span className="font-semibold text-slate-950">120+ pos</span> pemantauan lengkap di Pusat Data Terpadu.
            </div>
          </div>
          <Link
            href="/data-explorer"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline shrink-0"
          >
            <span>Buka Semua Stasiun di Data Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
export default TelemetryStrip;
