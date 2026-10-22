"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Waves,
  Navigation,
  Building2,
  Download,
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Phone,
  Globe,
  Clock,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Radio,
  Calendar,
  Layers,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { FALLBACK_WALIDATA, getExportUrl, getPosDetail, getPosTimeseries } from "@/lib/api";
import { Pengukuran, Pos, StatusAlat, StatusSiaga, Walidata } from "@/lib/types";
import { StationTrendChart, TimeRangePreset } from "@/components/modules/StationTrendChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface PosDetailClientProps {
  id: string;
}

// Format status alat
function formatStatusAlat(status?: StatusAlat) {
  const s = (status || "aktif").toLowerCase();
  switch (s) {
    case "rusak":
      return {
        label: "Rusak",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        dotClassName: "bg-rose-500",
      };
    case "perbaikan":
      return {
        label: "Dalam Perbaikan",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        dotClassName: "bg-amber-500",
      };
    case "aktif":
    default:
      return {
        label: "Aktif Beroperasi",
        className: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dotClassName: "bg-emerald-500 animate-pulse",
      };
  }
}

// Format badge pilar tipe pos
function formatTipeBadge(tipe?: string) {
  const t = (tipe || "hidrologi").toLowerCase();
  switch (t) {
    case "hidrometeorologi":
      return {
        label: "Hidrometeorologi",
        className: "bg-sky-50 text-sky-800 border-sky-200",
      };
    case "hidrogeologi":
      return {
        label: "Hidrogeologi",
        className: "bg-indigo-50 text-indigo-800 border-indigo-200",
      };
    case "hidrologi":
    default:
      return {
        label: "Hidrologi",
        className: "bg-teal-50 text-teal-800 border-teal-200",
      };
  }
}

// Format status siaga pada tabel riwayat
function formatStatusSiagaBadge(status?: StatusSiaga) {
  const s = (status || "normal").toLowerCase();
  switch (s) {
    case "awas":
      return {
        label: "Awas",
        className: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
        dot: "bg-rose-600",
      };
    case "siaga":
      return {
        label: "Siaga",
        className: "bg-orange-100 text-orange-800 border-orange-300 font-bold",
        dot: "bg-orange-600",
      };
    case "waspada":
      return {
        label: "Waspada",
        className: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
        dot: "bg-amber-500",
      };
    case "normal":
    default:
      return {
        label: "Normal",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium",
        dot: "bg-emerald-500",
      };
  }
}

// Format waktu tabel rekaman
function formatDateTimeRow(iso: string) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return { date: iso, time: "" };

    const dateStr = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    return { date: dateStr, time: timeStr };
  } catch {
    return { date: iso, time: "" };
  }
}

export default function PosDetailClient({ id }: PosDetailClientProps) {
  const [pos, setPos] = useState<Pos | null>(null);
  const [isPosLoading, setIsPosLoading] = useState(true);

  // State timeseries
  const [selectedRange, setSelectedRange] = useState<TimeRangePreset>("7d");
  const [timeseriesData, setTimeseriesData] = useState<Pengukuran[]>([]);
  const [isTimeseriesLoading, setIsTimeseriesLoading] = useState(true);

  // State koordinat copy
  const [isCopied, setIsCopied] = useState(false);

  // State paginasi tabel riwayat rekaman
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPerPage, setHistoryPerPage] = useState(10);

  // 1. Fetch data detail stasiun pos
  useEffect(() => {
    let isMounted = true;
    setIsPosLoading(true);

    getPosDetail(id)
      .then((data) => {
        if (!isMounted) return;
        setPos(data);
      })
      .catch((err) => {
        console.error(`[PosDetailClient] Gagal memuat pos #${id}:`, err);
      })
      .finally(() => {
        if (isMounted) setIsPosLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // 2. Fetch data timeseries berdasarkan rentang waktu terpilih
  const fetchTimeseries = useCallback(
    (range: TimeRangePreset) => {
      setIsTimeseriesLoading(true);
      const now = new Date();
      const days = range === "90d" ? 90 : range === "30d" ? 30 : 7;
      const startDate = new Date(now.getTime() - days * 24 * 3600 * 1000).toISOString();

      getPosTimeseries(id, {
        start_date: startDate,
        end_date: now.toISOString(),
      })
        .then((res) => {
          setTimeseriesData(res.data || []);
          setHistoryPage(1); // Reset tabel riwayat ke halaman pertama
        })
        .catch((err) => {
          console.error(`[PosDetailClient] Gagal memuat timeseries:`, err);
        })
        .finally(() => {
          setIsTimeseriesLoading(false);
        });
    },
    [id]
  );

  useEffect(() => {
    fetchTimeseries(selectedRange);
  }, [fetchTimeseries, selectedRange]);

  // Handler pergantian rentang preset
  const handleRangeChange = (newRange: TimeRangePreset) => {
    setSelectedRange(newRange);
  };

  // Handler salin koordinat geodetik ke clipboard
  const handleCopyCoordinates = () => {
    if (!pos || pos.latitude == null || pos.longitude == null) return;
    const coordString = `${pos.latitude.toFixed(6)}, ${pos.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(coordString).then(() => {
      setIsCopied(true);
      toast.success("Koordinat berhasil disalin!", {
        description: coordString,
      });
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  // Handler unduh data stasiun (Excel / CSV)
  const handleDownload = (format: "xlsx" | "csv") => {
    if (!pos) return;
    toast.info(`Menyiapkan berkas ${pos.nama} format ${format.toUpperCase()}...`);

    const now = new Date();
    const days = selectedRange === "90d" ? 90 : selectedRange === "30d" ? 30 : 7;
    const startDate = new Date(now.getTime() - days * 24 * 3600 * 1000)
      .toISOString()
      .split("T")[0];
    const endDate = now.toISOString().split("T")[0];

    const downloadUrl = getExportUrl(pos.id, format, {
      start_date: startDate,
      end_date: endDate,
    });

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `${pos.kode_pos}_${selectedRange}.${format}`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Unduhan ${format.toUpperCase()} ${pos.nama} berhasil diproses.`);
  };

  // Paginasi tabel riwayat lokal
  const paginatedHistory = useMemo(() => {
    // Balik urutan agar rekaman paling baru di atas
    const sorted = [...timeseriesData].reverse();
    const total = sorted.length;
    const totalPages = Math.ceil(total / historyPerPage) || 1;
    const startIndex = (historyPage - 1) * historyPerPage;
    const paginatedItems = sorted.slice(startIndex, startIndex + historyPerPage);

    return {
      items: paginatedItems,
      total,
      totalPages,
      from: total > 0 ? startIndex + 1 : 0,
      to: Math.min(startIndex + historyPerPage, total),
    };
  }, [timeseriesData, historyPage, historyPerPage]);

  const walidata = useMemo<Walidata | null>(() => {
    if (!pos) return null;
    const raw = pos.walidata;
    if (raw && "deskripsi" in raw && (raw as Walidata).deskripsi) {
      return raw as Walidata;
    }
    const matched = FALLBACK_WALIDATA.find(
      (w) => w.id === pos.walidata_id || (raw && w.singkatan === raw.singkatan)
    );
    if (matched) return matched;
    if (raw) {
      return {
        id: raw.id,
        nama: raw.nama,
        singkatan: raw.singkatan,
        deskripsi: "Unit pengelola data hidrologi Wilayah Sungai Serayu Opak & Serayu Bogowonto.",
        kontak_wa: "+6281234567890",
        website_url: "https://sda.pu.go.id",
      };
    }
    return null;
  }, [pos]);

  // ==========================================================================
  // STATE LOADING SKELETON
  // ==========================================================================
  if (isPosLoading) {
    return (
      <div className="min-h-screen bg-slate-50/70 pb-24">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-slate-200/90 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-4">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-8 w-96 rounded-lg" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // STATE ERROR / POS TIDAK DITEMUKAN
  // ==========================================================================
  if (!pos) {
    return (
      <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Stasiun Pos Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Data pos pemantauan dengan pengenal <strong className="font-mono">#{id}</strong> tidak dapat ditemukan atau telah dinonaktifkan dari sistem.
          </p>
          <div className="pt-2">
            <Link
              href="/data-explorer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Eksplorasi Data
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusAlat = formatStatusAlat(pos.status_alat);
  const tipeBadge = formatTipeBadge(pos.tipe);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28">
      {/* 1. Header Stasiun Pos */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs Navigasi */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-5 flex-wrap"
          >
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              href="/data-explorer"
              className="hover:text-slate-900 transition-colors"
            >
              Eksplorasi Data
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-950 font-bold truncate max-w-xs sm:max-w-md">
              {pos.nama}
            </span>
          </nav>

          {/* Header Konten Utama */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Kode Pos */}
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {pos.kode_pos}
                </span>

                {/* Badge Pilar */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tipeBadge.className}`}
                >
                  {tipeBadge.label}
                </span>

                {/* Badge Tipe Sensor */}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {pos.jenis}
                </span>

                {/* Badge Status Alat */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusAlat.className}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusAlat.dotClassName}`} />
                  {statusAlat.label}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
                {pos.nama}
              </h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    {[pos.kecamatan, pos.kabupaten, pos.provinsi].filter(Boolean).join(", ")}
                  </span>
                </span>
                {pos.sungai && (
                  <span className="flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{pos.sungai}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Tombol Aksi Unduh Cepat di Header */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("xlsx")}
                className="h-9 px-3.5 bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 text-emerald-800 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                title={`Unduh seluruh historis ${pos.nama} dalam format Excel`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Unduh Excel (.xlsx)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("csv")}
                className="h-9 px-3.5 bg-sky-50 hover:bg-sky-100/80 border-sky-300 text-sky-800 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                title={`Unduh data ${pos.nama} dalam format CSV`}
              >
                <FileText className="w-4 h-4 text-sky-700 shrink-0" />
                <span>Unduh CSV (.csv)</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ================================================================= */}
        {/* KARTU INFORMASI METADATA STASIUN (4 KARTU GRID) */}
        {/* ================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              Metadata &amp; Parameter Pos Pemantauan
            </h2>
            <span className="text-xs text-slate-400">Prinsip Satu Data Terbuka</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Kartu 1: Lokasi Administratif */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                <span className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                  <MapPin className="w-4 h-4 text-amber-600" />
                </span>
                <span>Lokasi Administratif</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700 divide-y divide-slate-100">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Desa/Kelurahan:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {pos.desa || "-"}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-400">Kecamatan:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {pos.kecamatan || "-"}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-400">Kabupaten/Kota:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {pos.kabupaten || "-"}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-400">Provinsi:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {pos.provinsi || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Kartu 2: Lokasi Hidrologis */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
                <span className="p-1.5 rounded-lg bg-sky-50 border border-sky-100">
                  <Waves className="w-4 h-4 text-sky-600" />
                </span>
                <span>Lokasi Hidrologis</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700 divide-y divide-slate-100">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Wilayah Sungai:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {pos.wilayah_sungai || "-"}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-400">DAS:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {pos.das || "-"}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-400">Sub-DAS:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {pos.sub_das || "-"}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-400">Nama Sungai:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {pos.sungai || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Kartu 3: Koordinat Geodetik (Bebas Peta) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                    <span className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
                      <Navigation className="w-4 h-4 text-indigo-600" />
                    </span>
                    <span>Koordinat Geodetik</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    WGS84
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 divide-y divide-slate-100">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Latitude:</span>
                    <span className="font-mono font-bold text-slate-900 text-right">
                      {pos.latitude != null ? `${pos.latitude.toFixed(6)}°` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1.5">
                    <span className="text-slate-400">Longitude:</span>
                    <span className="font-mono font-bold text-slate-900 text-right">
                      {pos.longitude != null ? `${pos.longitude.toFixed(6)}°` : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Aksi Koordinat: Salin & Google Maps Link */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCoordinates}
                  disabled={pos.latitude == null || pos.longitude == null}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Salin koordinat teks ke clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin Koordinat</span>
                    </>
                  )}
                </button>

                {pos.latitude != null && pos.longitude != null && (
                  <a
                    href={`https://www.google.com/maps?q=${pos.latitude},${pos.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Buka lokasi pos di Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Kartu 4: Instansi Walidata Penanggung Jawab */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                    <span className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                    </span>
                    <span>Instansi Walidata</span>
                  </div>
                  {walidata?.singkatan && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {walidata.singkatan}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {walidata?.nama || "Balai Besar Wilayah Sungai Serayu Opak"}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">
                    {walidata?.deskripsi ||
                      "Unit pengelola data hidrologi Wilayah Sungai Serayu Opak & Serayu Bogowonto."}
                  </div>
                </div>
              </div>

              {/* Tautan Layanan Walidata */}
              <div className="pt-2 flex items-center gap-2">
                {walidata?.kontak_wa ? (
                  <a
                    href={`https://wa.me/${walidata.kontak_wa.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Kontak WhatsApp</span>
                  </a>
                ) : (
                  <div className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-100 text-slate-400 text-[11px] font-medium text-center">
                    Kontak Terpadu SIH3
                  </div>
                )}

                {(walidata?.layanan_url || walidata?.website_url) && (
                  <a
                    href={walidata.layanan_url || walidata.website_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Kunjungi website / portal layanan walidata"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SEKSI GRAFIK TREN PENGUKURAN (STATIONTRENDCHART) */}
        {/* ================================================================= */}
        <section>
          <StationTrendChart
            pos={pos}
            data={timeseriesData}
            isLoading={isTimeseriesLoading}
            selectedRange={selectedRange}
            onRangeChange={handleRangeChange}
          />
        </section>

        {/* ================================================================= */}
        {/* SEKSI TABEL RIWAYAT DATA HISTORIS & UNDUH LENGKAP */}
        {/* ================================================================= */}
        <section
          id="riwayat"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden scroll-mt-24"
        >
          {/* Header Tabel Riwayat */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-slate-900 text-white">
                  <Clock className="w-4 h-4 text-amber-400" />
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Tabel Riwayat Rekaman Data Deret Waktu
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Daftar rekaman kronologis untuk stasiun {pos.nama} periode {selectedRange}.
              </p>
            </div>

            {/* Tombol Aksi Ekspor Lengkap */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("xlsx")}
                className="h-8 px-3 bg-white hover:bg-slate-50 border-slate-300 text-slate-800 font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ekspor Excel (.xlsx)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("csv")}
                className="h-8 px-3 bg-white hover:bg-slate-50 border-slate-300 text-slate-800 font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Ekspor CSV (.csv)</span>
              </Button>
            </div>
          </div>

          {/* Kontainer Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 min-w-[160px]">Waktu Rekaman</th>
                  <th className="py-3 px-4 text-right min-w-[100px]">Nilai Ukur</th>
                  <th className="py-3 px-4 text-center w-24">Satuan</th>
                  <th className="py-3 px-4 min-w-[120px]">Status Siaga</th>
                  <th className="py-3 px-4 min-w-[180px]">Parameter / Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isTimeseriesLoading ? (
                  Array.from({ length: 5 }).map((_, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50">
                      <td className="p-3 text-center">
                        <Skeleton className="h-4 w-4 mx-auto rounded" />
                      </td>
                      <td className="p-3">
                        <Skeleton className="h-4 w-32 rounded" />
                      </td>
                      <td className="p-3 text-right">
                        <Skeleton className="h-4 w-16 ml-auto rounded" />
                      </td>
                      <td className="p-3 text-center">
                        <Skeleton className="h-4 w-8 mx-auto rounded" />
                      </td>
                      <td className="p-3">
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </td>
                      <td className="p-3">
                        <Skeleton className="h-4 w-28 rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedHistory.items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tidak ada catatan riwayat pengukuran untuk rentang waktu terpilih.
                    </td>
                  </tr>
                ) : (
                  paginatedHistory.items.map((row, idx) => {
                    const rowNumber =
                      (historyPage - 1) * historyPerPage + idx + 1;
                    const dt = formatDateTimeRow(row.recorded_at);
                    const statusSiaga = formatStatusSiagaBadge(row.status_siaga);

                    return (
                      <tr
                        key={row.id || idx}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-mono text-slate-400 text-[11px]">
                          {rowNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{dt.date}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{dt.time}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-mono text-sm font-extrabold text-slate-900">
                            {row.nilai != null ? Number(row.nilai).toFixed(2) : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-600">
                          {row.satuan || (pos.jenis === "ARR" ? "mm" : "m")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] border ${statusSiaga.className}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusSiaga.dot}`} />
                            {statusSiaga.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {row.parameter_tambahan ? (
                            <span className="font-mono text-[11px] text-slate-500">
                              {JSON.stringify(row.parameter_tambahan)
                                .replace(/[{}"']/g, "")
                                .replace(/,/g, ", ")}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer & Paginasi Tabel Riwayat */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Menampilkan</span>
              <strong className="font-bold text-slate-800">
                {paginatedHistory.from} - {paginatedHistory.to}
              </strong>
              <span>dari</span>
              <strong className="font-bold text-slate-800">
                {paginatedHistory.total}
              </strong>
              <span>rekaman</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Opsi Per Page */}
              <div className="flex items-center gap-1.5">
                <span>Baris:</span>
                <select
                  value={historyPerPage}
                  onChange={(e) => {
                    setHistoryPerPage(Number(e.target.value));
                    setHistoryPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Tombol Halaman Prev / Next */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                  disabled={historyPage <= 1}
                  className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-semibold text-slate-800">
                  {historyPage} / {paginatedHistory.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setHistoryPage((p) => Math.min(paginatedHistory.totalPages, p + 1))
                  }
                  disabled={historyPage >= paginatedHistory.totalPages}
                  className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Halaman selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
