"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Search,
  Filter,
  MapPin,
  RefreshCw,
  Database,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import { getPosList } from "@/lib/api";
import { Pos, StatusAlat } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { DatasetHero } from "@/components/dataset/DatasetHero";
import { Skeleton } from "@/components/ui/skeleton";

// Kategori warna sensor (badge lembut konsisten dengan tema dataset SIH3)
const SENSOR_BADGES: Record<string, string> = {
  AWLR: "border-[#A9C8EC] bg-[#E6F0FB] text-[#12467A]",
  "Kualitas Air": "border-[#86C79B] bg-[#E6F4EA] text-[#14532D]",
  ARR: "border-[#86B2E0] bg-[#CFE3F8] text-[#0E3A66]",
  Klimatologi: "border-[#E5C34D] bg-[#FEF6D8] text-[#6B4E00]",
  MAT: "border-[#C5CDD8] bg-[#EEF1F5] text-[#3D4756]",
};

// Render status alat (Opsi 1: Subtle Tinted Tag datar tanpa dot)
function renderStatusPill(status?: StatusAlat) {
  const s = (status || "aktif").toLowerCase();
  switch (s) {
    case "rusak":
      return (
        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700">
          Nonaktif
        </span>
      );
    case "perbaikan":
      return (
        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800">
          Perbaikan
        </span>
      );
    case "aktif":
    default:
      return (
        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800">
          Aktif
        </span>
      );
  }
}

function PemantauanPosContent() {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";

  const [posList, setPosList] = useState<Pos[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(queryFromUrl);
  const [selectedTipe, setSelectedTipe] = useState<string>("semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("semua");

  // Memuat data pos
  useEffect(() => {
    setIsLoading(true);
    getPosList()
      .then((res: unknown) => {
        const dataRes = res as { data?: Pos[]; items?: Pos[] } | Pos[];
        if (Array.isArray(dataRes)) {
          setPosList(dataRes);
        } else if (dataRes && Array.isArray(dataRes.data)) {
          setPosList(dataRes.data);
        } else if (dataRes && Array.isArray(dataRes.items)) {
          setPosList(dataRes.items);
        } else {
          setPosList([]);
        }
      })
      .catch((err: unknown) => {
        console.error("Gagal memuat daftar pos:", err);
        setPosList([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Filter pencarian berdasarkan keyword, tipe bidang, dan status alat
  const filteredPos = useMemo(() => {
    return posList.filter((pos) => {
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = query
        ? pos.nama?.toLowerCase().includes(query) ||
          pos.kode_pos?.toLowerCase().includes(query) ||
          pos.sungai?.toLowerCase().includes(query) ||
          pos.kabupaten?.toLowerCase().includes(query) ||
          pos.das?.toLowerCase().includes(query) ||
          pos.jenis?.toLowerCase().includes(query)
        : true;

      const matchTipe =
        selectedTipe === "semua"
          ? true
          : (pos.tipe || "").toLowerCase() === selectedTipe.toLowerCase();

      const matchStatus =
        selectedStatus === "semua"
          ? true
          : (pos.status_alat || "aktif").toLowerCase() ===
            selectedStatus.toLowerCase();

      return matchQuery && matchTipe && matchStatus;
    });
  }, [posList, searchQuery, selectedTipe, selectedStatus]);

  // Statistik operasional real
  const stats = useMemo(() => {
    const total = posList.length;
    const aktif = posList.filter(
      (p) => (p.status_alat || "aktif").toLowerCase() === "aktif"
    ).length;
    const perbaikan = posList.filter(
      (p) => (p.status_alat || "").toLowerCase() === "perbaikan"
    ).length;
    const rusak = posList.filter(
      (p) => (p.status_alat || "").toLowerCase() === "rusak"
    ).length;

    const hidrologi = posList.filter(
      (p) => (p.tipe || "").toLowerCase() === "hidrologi"
    ).length;
    const hidromet = posList.filter(
      (p) => (p.tipe || "").toLowerCase() === "hidrometeorologi"
    ).length;
    const hidrogeo = posList.filter(
      (p) => (p.tipe || "").toLowerCase() === "hidrogeologi"
    ).length;

    return { total, aktif, perbaikan, rusak, hidrologi, hidromet, hidrogeo };
  }, [posList]);

  return (
    <>
      {/* 1. HERO SECTION KONSISTEN DENGAN PORTAL SIH3 */}
      <DatasetHero
        kicker="Portal SIH3 Wilayah Sungai Serayu Opak"
        title="Status Pos Pemantauan"
        description="Pusat pemantauan status keaktifan alat, persebaran stasiun pos hidrologi, hidrometeorologi, dan hidrogeologi di wilayah kerja BBWS Serayu Opak."
      />

      {/* 2. AREA KONTEN UTAMA */}
      <main className="min-h-screen bg-page py-8 sm:py-10 text-ink">
        <Container className="space-y-6">
          {/* Breadcrumb Navigasi */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[12px] font-medium text-ink-muted mb-2"
          >
            <Link
              href="/"
              className="hover:text-primary transition-colors hover:underline"
            >
              Beranda
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#AEB8C5]" />
            <span className="text-ink-muted">SIH3</span>
            <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#AEB8C5]" />
            <span className="text-ink font-semibold">Status Pos Pemantauan</span>
          </nav>

          {/* 3. KARTU RINGKASAN STATUS OPERASIONAL (REAL DATA) */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-hairline bg-white p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-ink-muted block tracking-wider">
                Total Pos Terdaftar
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold font-mono text-ink">
                {stats.total}
              </p>
              <p className="mt-1 text-[11px] text-ink-muted">
                Semua pos di wilayah sungai
              </p>
            </div>

            <div className="rounded-xl border border-[#86C79B]/50 bg-[#E6F4EA]/30 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-[#14532D] block tracking-wider">
                Aktif Beroperasi
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold font-mono text-[#14532D]">
                {stats.aktif}
              </p>
              <p className="mt-1 text-[11px] text-[#14532D]/80">
                Data terhubung & terpantau
              </p>
            </div>

            <div className="rounded-xl border border-[#E5C34D]/50 bg-[#FEF6D8]/30 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-[#6B4E00] block tracking-wider">
                Dalam Perbaikan
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold font-mono text-[#6B4E00]">
                {stats.perbaikan}
              </p>
              <p className="mt-1 text-[11px] text-[#6B4E00]/80">
                Sedang kalibrasi/pemeliharaan
              </p>
            </div>

            <div className="rounded-xl border border-[#E88B84]/50 bg-[#FBE3E1]/30 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-[#8B1A12] block tracking-wider">
                Rusak / Nonaktif
              </span>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold font-mono text-[#8B1A12]">
                {stats.rusak}
              </p>
              <p className="mt-1 text-[11px] text-[#8B1A12]/80">
                Membutuhkan tindakan teknis
              </p>
            </div>
          </section>

          {/* 4. FILTER TOOLBAR & PENCARIAN */}
          <section className="rounded-xl border border-hairline bg-white shadow-xs p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Tab Filter Kategori Bidang */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                {[
                  { id: "semua", label: "Semua Pos", count: stats.total },
                  { id: "hidrologi", label: "Hidrologi", count: stats.hidrologi },
                  {
                    id: "hidrometeorologi",
                    label: "Hidrometeorologi",
                    count: stats.hidromet,
                  },
                  {
                    id: "hidrogeologi",
                    label: "Hidrogeologi",
                    count: stats.hidrogeo,
                  },
                ].map((tab) => {
                  const isActive = selectedTipe === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedTipe(tab.id)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? "border-primary bg-primary text-white shadow-xs"
                          : "border-hairline bg-slate-50 text-ink-muted hover:border-slate-300 hover:text-ink"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`ml-1.5 text-[10px] font-mono ${
                          isActive ? "text-amber" : "text-slate-400"
                        }`}
                      >
                        ({tab.count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Status Alat Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-ink-muted whitespace-nowrap">
                  Status:
                </span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-lg border border-hairline bg-white px-3 py-1.5 text-xs font-medium text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                >
                  <option value="semua">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="perbaikan">Dalam Perbaikan</option>
                  <option value="rusak">Rusak</option>
                </select>
              </div>
            </div>

            {/* Input Pencarian Universal */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan nama pos, kode, sungai, DAS, atau kabupaten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-slate-50/50 pl-9 pr-4 py-2.5 text-xs text-ink placeholder:text-slate-400 focus:bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>

            {/* Baris Informasi Hasil */}
            <div className="flex items-center justify-between text-xs text-ink-muted pt-1 border-t border-slate-100">
              <span>
                Menampilkan{" "}
                <strong className="text-ink">{filteredPos.length}</strong> dari{" "}
                <strong className="text-ink">{posList.length}</strong> pos
                pemantauan
              </span>
              {(searchQuery ||
                selectedTipe !== "semua" ||
                selectedStatus !== "semua") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTipe("semua");
                    setSelectedStatus("semua");
                  }}
                  className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              )}
            </div>
          </section>

          {/* 5. TABEL DAFTAR POS PEMANTAUAN */}
          <section className="rounded-xl border border-hairline bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <caption className="sr-only">
                  Daftar pos pemantauan status keaktifan alat dan sensor
                </caption>
                <thead className="bg-table-head text-ink font-semibold uppercase tracking-wider text-[11px] border-b border-hairline">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 w-12 text-center">
                      No
                    </th>
                    <th scope="col" className="py-3.5 px-4 min-w-[200px]">
                      Nama &amp; Kode Pos
                    </th>
                    <th scope="col" className="py-3.5 px-4">
                      Tipe / Sensor
                    </th>
                    <th scope="col" className="py-3.5 px-4">
                      DAS / Wilayah Sungai
                    </th>
                    <th scope="col" className="py-3.5 px-4 min-w-[180px]">
                      Lokasi Wilayah
                    </th>
                    <th scope="col" className="py-3.5 px-4">
                      Status Alat
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-right w-[120px]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={idx}>
                        <td className="p-4 text-center">
                          <Skeleton className="h-4 w-4 mx-auto" />
                        </td>
                        <td className="p-4 space-y-1">
                          <Skeleton className="h-4 w-44" />
                          <Skeleton className="h-3 w-24" />
                        </td>
                        <td className="p-4 space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-16" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-36" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-24 rounded" />
                        </td>
                        <td className="p-4 text-right">
                          <Skeleton className="h-8 w-16 ml-auto rounded-md" />
                        </td>
                      </tr>
                    ))
                  ) : filteredPos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-ink-muted">
                        <Database
                          aria-hidden="true"
                          className="mx-auto h-8 w-8 text-[#AEB8C5] mb-2"
                        />
                        <p className="text-[14px] font-semibold text-ink">
                          Tidak ada pos yang cocok
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          Coba sesuaikan kata kunci pencarian atau ubah filter tipe.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPos.map((pos, index) => {
                      const sensorBadgeStyle =
                        SENSOR_BADGES[pos.jenis || ""] ||
                        "border-[#C5CDD8] bg-[#EEF1F5] text-[#3D4756]";

                      const locationText = [
                        pos.desa,
                        pos.kecamatan,
                        pos.kabupaten ? `Kab. ${pos.kabupaten}` : null,
                        pos.provinsi,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <tr
                          key={pos.id || index}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                            {index + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <Link
                              href={`/pos/${pos.id}`}
                              className="font-semibold text-ink hover:text-primary transition-colors hover:underline block"
                            >
                              {pos.nama}
                            </Link>
                            <span className="font-mono text-[11px] text-ink-muted block mt-0.5">
                              {pos.kode_pos}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="capitalize font-medium text-ink block">
                              {pos.tipe || "Hidrologi"}
                            </span>
                            <span
                              className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${sensorBadgeStyle}`}
                            >
                              {pos.jenis}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-ink-muted">
                            <span className="text-ink font-medium block">
                              {pos.das || "-"}
                            </span>
                            <span className="text-[11px] block mt-0.5">
                              {pos.wilayah_sungai || "WS Progo-Opak-Serang"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-ink-muted">
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span className="leading-snug">
                                {locationText || "-"}
                              </span>
                            </div>
                            {pos.sungai && (
                              <span className="text-[11px] text-primary/80 block ml-4.5 mt-0.5 font-medium">
                                Sungai: {pos.sungai}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {renderStatusPill(pos.status_alat)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href={`/pos/${pos.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[6px] border border-hairline hover:border-primary/40 bg-white hover:bg-slate-50 text-[11px] font-semibold text-primary transition-colors shadow-2xs"
                            >
                              <span>Detail</span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#AEB8C5]" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}

export default function PemantauanPosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-page py-16 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-primary" />
          <span>Memuat halaman pos pemantauan...</span>
        </div>
      }
    >
      <PemantauanPosContent />
    </Suspense>
  );
}
