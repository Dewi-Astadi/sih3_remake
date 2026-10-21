"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Clock,
  Droplets,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Pengukuran, Pos, StatusSiaga } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export type TimeRangePreset = "7d" | "30d" | "90d";

export interface StationTrendChartProps {
  pos: Pos;
  data: Pengukuran[];
  isLoading?: boolean;
  selectedRange?: TimeRangePreset;
  onRangeChange?: (range: TimeRangePreset) => void;
  className?: string;
}

// Format status siaga ke label dan styling PUPR
function getStatusBadge(status?: StatusSiaga) {
  const s = (status || "normal").toLowerCase();
  switch (s) {
    case "awas":
      return {
        label: "Awas",
        colorClass: "bg-rose-500 text-white border-rose-600",
        dotClass: "bg-rose-200",
      };
    case "siaga":
      return {
        label: "Siaga",
        colorClass: "bg-orange-500 text-white border-orange-600",
        dotClass: "bg-orange-200",
      };
    case "waspada":
      return {
        label: "Waspada",
        colorClass: "bg-amber-400 text-slate-950 font-bold border-amber-500",
        dotClass: "bg-amber-100",
      };
    case "normal":
    default:
      return {
        label: "Normal",
        colorClass: "bg-emerald-600 text-white border-emerald-700",
        dotClass: "bg-emerald-200",
      };
  }
}

// Format waktu lokal Indonesia
function formatTimestamp(iso: string) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return { full: iso, short: iso, date: iso, time: "" };
    
    const day = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;
    const shortTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

    return {
      full: `${day}, ${time}`,
      short: `${shortDate} ${shortTime}`,
      date: day,
      time,
    };
  } catch {
    return { full: iso, short: iso, date: iso, time: "" };
  }
}

// Custom Tooltip Recharts dengan gaya Navy #0f172a & Amber #f59e0b
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: Pengukuran & { formattedFull?: string; formattedDate?: string; formattedTime?: string };
  }>;
  label?: string;
  unit: string;
  isRainfall: boolean;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  unit,
  isRainfall,
}) => {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0].payload;
  if (!point) return null;

  const value = point.nilai != null ? Number(point.nilai).toFixed(isRainfall ? 1 : 2) : "-";
  const badge = getStatusBadge(point.status_siaga);

  return (
    <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-md min-w-[210px] text-xs space-y-2 z-50">
      {/* Header Waktu */}
      <div className="flex items-center gap-1.5 text-slate-300 border-b border-slate-800 pb-2">
        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-medium">{point.formattedFull || formatTimestamp(point.recorded_at).full}</span>
      </div>

      {/* Nilai Utama */}
      <div className="flex items-baseline justify-between gap-3 pt-0.5">
        <span className="text-slate-400 font-medium">
          {isRainfall ? "Curah Hujan:" : "Tinggi Air / Nilai:"}
        </span>
        <div className="flex items-baseline gap-1 text-amber-400 font-bold">
          <span className="text-xl font-black text-white">{value}</span>
          <span className="text-xs font-semibold text-amber-400">{unit}</span>
        </div>
      </div>

      {/* Status Siaga Badge */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400">Status Alat:</span>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.colorClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
          {badge.label}
        </span>
      </div>
    </div>
  );
};

export function StationTrendChart({
  pos,
  data,
  isLoading = false,
  selectedRange = "7d",
  onRangeChange,
  className = "",
}: StationTrendChartProps) {
  // State mounted untuk mencegah SSR hydration mismatch pada Recharts ResponsiveContainer
  const [mounted, setMounted] = useState(false);
  const [internalRange, setInternalRange] = useState<TimeRangePreset>(selectedRange);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setInternalRange(selectedRange);
  }, [selectedRange]);

  const handleRangeSelect = (preset: TimeRangePreset) => {
    setInternalRange(preset);
    if (onRangeChange) {
      onRangeChange(preset);
    }
  };

  // Tentukan apakah tipe sensor ini curah hujan (ARR) -> gunakan BarChart
  const isRainfall = useMemo(() => {
    const jenis = (pos.jenis || "").toUpperCase();
    return jenis.includes("ARR") || jenis.includes("HUJAN");
  }, [pos.jenis]);

  // Satuan pengukuran
  const unit = useMemo(() => {
    if (data.length > 0 && data[0].satuan) return data[0].satuan;
    if (isRainfall) return "mm";
    if (pos.jenis === "Kualitas Air") return "pH";
    return "m";
  }, [data, isRainfall, pos.jenis]);

  // Normalisasi data untuk Recharts
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
      const ts = formatTimestamp(item.recorded_at);
      return {
        ...item,
        nilai: item.nilai != null ? Number(item.nilai) : null,
        formattedFull: ts.full,
        formattedShort: ts.short,
        formattedDate: ts.date,
        formattedTime: ts.time,
      };
    });
  }, [data]);

  // Kalkulasi statistik cepat (Terbaru, Rata-rata, Max, Min, Total jika hujan)
  const stats = useMemo(() => {
    const validValues = chartData
      .map((d) => d.nilai)
      .filter((v): v is number => v !== null && !isNaN(v));

    if (validValues.length === 0) {
      return {
        latest: null,
        avg: null,
        max: null,
        min: null,
        total: null,
      };
    }

    const latest = validValues[validValues.length - 1];
    const total = validValues.reduce((acc, curr) => acc + curr, 0);
    const avg = total / validValues.length;
    const max = Math.max(...validValues);
    const min = Math.min(...validValues);

    return {
      latest,
      avg,
      max,
      min,
      total: isRainfall ? total : null,
    };
  }, [chartData, isRainfall]);

  // Rentang preset tombol
  const presets: { id: TimeRangePreset; label: string; days: number }[] = [
    { id: "7d", label: "7 Hari", days: 7 },
    { id: "30d", label: "30 Hari", days: 30 },
    { id: "90d", label: "90 Hari", days: 90 },
  ];

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden ${className}`}
    >
      {/* 1. Header Kontrol: Judul & Preset Rentang Waktu */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-900 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Visualisasi Tren Pengukuran Deret Waktu
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {isRainfall
              ? "Histogram intensitas curah hujan per pencatatan waktu pemantauan"
              : `Fluktuasi tinggi muka air ${pos.sungai ? `di ${pos.sungai}` : ""} secara runtut waktu`}
          </p>
        </div>

        {/* Tombol Preset Rentang Waktu */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl self-start sm:self-auto border border-slate-200/70">
          <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1 hidden sm:inline-block" />
          {presets.map((preset) => {
            const isActive = internalRange === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleRangeSelect(preset.id)}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
                } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Kartu Ringkasan Metrik Cepat */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-b border-slate-100 bg-slate-50/50">
        {/* Metrik 1: Nilai Terkini */}
        <div className="p-4 sm:px-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            Nilai Terkini
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            {isLoading ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : stats.latest !== null ? (
              <>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {stats.latest.toFixed(isRainfall ? 1 : 2)}
                </span>
                <span className="text-xs font-bold text-amber-600">{unit}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-400">-</span>
            )}
          </div>
        </div>

        {/* Metrik 2: Rata-rata */}
        <div className="p-4 sm:px-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Rata-rata Periode
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            {isLoading ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : stats.avg !== null ? (
              <>
                <span className="text-xl sm:text-2xl font-black text-slate-800">
                  {stats.avg.toFixed(isRainfall ? 1 : 2)}
                </span>
                <span className="text-xs font-semibold text-slate-500">{unit}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-400">-</span>
            )}
          </div>
        </div>

        {/* Metrik 3: Maksimum / Tertinggi */}
        <div className="p-4 sm:px-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
            Nilai Tertinggi
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            {isLoading ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : stats.max !== null ? (
              <>
                <span className="text-xl sm:text-2xl font-black text-rose-700">
                  {stats.max.toFixed(isRainfall ? 1 : 2)}
                </span>
                <span className="text-xs font-bold text-rose-600">{unit}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-400">-</span>
            )}
          </div>
        </div>

        {/* Metrik 4: Minimum (atau Total Akumulasi jika ARR) */}
        <div className="p-4 sm:px-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            {isRainfall ? (
              <>
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                Total Akumulasi
              </>
            ) : (
              <>
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                Nilai Terendah
              </>
            )}
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            {isLoading ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : isRainfall && stats.total !== null ? (
              <>
                <span className="text-xl sm:text-2xl font-black text-sky-800">
                  {stats.total.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-sky-600">{unit}</span>
              </>
            ) : stats.min !== null ? (
              <>
                <span className="text-xl sm:text-2xl font-black text-emerald-700">
                  {stats.min.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-emerald-600">{unit}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-400">-</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Area Visualisasi Grafik Recharts */}
      <div className="p-4 sm:p-6">
        {!mounted || isLoading ? (
          <div className="space-y-4 py-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle className="w-10 h-10 text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Rekaman Data</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Tidak ditemukan data pengukuran untuk pos ini pada rentang waktu {internalRange}. Silakan pilih rentang waktu lainnya.
            </p>
          </div>
        ) : (
          <div className="h-80 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {isRainfall ? (
                <BarChart
                  data={chartData}
                  margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="formattedShort"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickLine={{ stroke: "#cbd5e1" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    interval="preserveStartEnd"
                    minTickGap={35}
                    dy={8}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickLine={{ stroke: "#cbd5e1" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    unit={` ${unit}`}
                  />
                  <Tooltip
                    content={<CustomChartTooltip unit={unit} isRainfall={isRainfall} />}
                  />
                  <Bar
                    dataKey="nilai"
                    fill="#0f172a"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              ) : (
                <LineChart
                  data={chartData}
                  margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="formattedShort"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickLine={{ stroke: "#cbd5e1" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    interval="preserveStartEnd"
                    minTickGap={35}
                    dy={8}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickLine={{ stroke: "#cbd5e1" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    unit={` ${unit}`}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    content={<CustomChartTooltip unit={unit} isRainfall={isRainfall} />}
                  />
                  <Line
                    type="monotone"
                    dataKey="nilai"
                    stroke="#0f172a"
                    strokeWidth={2.5}
                    dot={{
                      fill: "#f59e0b",
                      stroke: "#0f172a",
                      strokeWidth: 1.5,
                      r: 3,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#f59e0b",
                      stroke: "#0f172a",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend Penjelasan Warna PUPR */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-sm bg-slate-900 inline-block" />
              {isRainfall ? "Intensitas Curah Hujan" : "Garis Tren (Deep Navy #0f172a)"}
            </span>
            {!isRainfall && (
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-slate-900 inline-block" />
                Titik Pengukuran (Warm Amber #f59e0b)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Sorot grafik untuk melihat nilai spesifik dan status siaga</span>
          </div>
        </div>
      </div>
    </div>
  );
}
