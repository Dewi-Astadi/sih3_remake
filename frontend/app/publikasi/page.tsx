"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  X,
  FileText,
  Download,
  Eye,
  Calendar,
  Sparkles,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  HardDrive,
  DownloadCloud,
  FileQuestion,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PdfViewerDialog,
  formatFileSize,
  getCategoryBadgeProps,
} from "@/components/modules/PdfViewerDialog";
import { getDokumenList, getDokumenDownloadUrl } from "@/lib/api";
import { Dokumen } from "@/lib/types";

// Tab kategori yang tersedia
const CATEGORY_TABS = [
  { id: "semua", label: "Semua Dokumen" },
  { id: "regulasi", label: "Regulasi" },
  { id: "sop", label: "SOP Teknis" },
  { id: "buletin_laporan", label: "Buletin & Laporan" },
] as const;

// Pilihan tahun terbit untuk dropdown
const AVAILABLE_YEARS = ["semua", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019"];

function PublikasiLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-8 w-96 rounded-lg" />
          <Skeleton className="h-4 w-3/4 max-w-xl rounded" />
        </div>
      </div>

      {/* Filter & Card Skeletons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PublikasiContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Membaca initial state dari URL
  const initialQ = searchParams.get("q") || "";
  const initialKategori = searchParams.get("kategori") || "semua";
  const initialTahun = searchParams.get("tahun") || "semua";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // States
  const [searchInput, setSearchInput] = useState<string>(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQ);
  const [kategori, setKategori] = useState<string>(initialKategori);
  const [tahun, setTahun] = useState<string>(initialTahun);
  const [page, setPage] = useState<number>(initialPage > 0 ? initialPage : 1);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Data state
  const [documents, setDocuments] = useState<Dokumen[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal dialog preview PDF
  const [previewDoc, setPreviewDoc] = useState<Dokumen | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sinkronisasi query param ke URL browser
  const syncUrlParams = useCallback(
    (newQ: string, newKategori: string, newTahun: string, newPage: number) => {
      const params = new URLSearchParams();
      if (newQ.trim()) params.set("q", newQ.trim());
      if (newKategori && newKategori !== "semua") params.set("kategori", newKategori);
      if (newTahun && newTahun !== "semua") params.set("tahun", newTahun);
      if (newPage > 1) params.set("page", String(newPage));

      const queryStr = params.toString();
      const newUrl = queryStr ? `${pathname}?${queryStr}` : pathname;
      window.history.replaceState(null, "", newUrl);
    },
    [pathname]
  );

  // Fetch dokumen saat query/kategori/tahun/page berubah
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const apiParams = {
      q: debouncedQuery.trim() || undefined,
      kategori: kategori !== "semua" ? kategori : undefined,
      tahun: tahun !== "semua" ? Number(tahun) : undefined,
      page,
      per_page: 9,
    };

    getDokumenList(apiParams)
      .then((res) => {
        if (!isMounted) return;
        setDocuments(res.data || []);
        setTotal(res.meta?.total || 0);
        setLastPage(res.meta?.last_page || 1);
      })
      .catch((err) => {
        console.error("[Publikasi] Gagal memuat daftar dokumen:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    syncUrlParams(debouncedQuery, kategori, tahun, page);

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, kategori, tahun, page, syncUrlParams]);

  // Reset filter
  const handleResetFilter = () => {
    setSearchInput("");
    setDebouncedQuery("");
    setKategori("semua");
    setTahun("semua");
    setPage(1);
    syncUrlParams("", "semua", "semua", 1);
  };

  // Handler unduh dokumen dengan Sonner toast notification
  const handleDownload = (doc: Dokumen) => {
    toast.success(`Mengunduh dokumen: ${doc.judul}`, {
      description: `Nomor: ${doc.nomor_dokumen || "-"} • Ukuran: ${formatFileSize(doc.file_size)}`,
    });

    // Update counter lokal sementara
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, download_count: (d.download_count || 0) + 1 } : d))
    );

    const downloadUrl =
      doc.file_path &&
      (doc.file_path.startsWith("http://") ||
        doc.file_path.startsWith("https://") ||
        doc.file_path.startsWith("/"))
        ? doc.file_path
        : getDokumenDownloadUrl(doc.id);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${doc.nomor_dokumen || "dokumen"}-${doc.judul}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Buka modal pratinjau PDF
  const handleOpenPreview = (doc: Dokumen) => {
    setPreviewDoc(doc);
    setIsViewerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* 1. Header Halaman */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigasi */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Publikasi &amp; SOP</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-900 border border-blue-500/20 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Repositori Resmi Dokumen Sumber Daya Air</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
                Publikasi Dokumen, Regulasi &amp; SOP Pengelolaan SDA
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                Koleksi peraturan perundang-undangan, instruksi kerja SOP hidrologi, dan buletin
                berkala Wilayah Sungai Serayu Opak. Seluruh arsip dokumen digital dapat diakses
                terbuka dan diunduh dalam format PDF.
              </p>
            </div>

            {/* Quick Badge Info */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Format Resmi Digital</div>
                <div>PDF Terverifikasi PUPR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Area: Filter Bar & Daftar Dokumen */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Info Petunjuk */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/80 text-xs text-sky-900">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>Pratinjau Langsung:</strong> Klik tombol{" "}
            <strong className="font-semibold">Lihat Pratinjau</strong> pada berkas untuk membaca
            dokumen secara instan di peramban tanpa perlu mengunduhnya terlebih dahulu.
          </span>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
          {/* Baris 1: Tab Kategori */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-slate-600 text-xs sm:text-sm font-medium">
              {CATEGORY_TABS.map((tab) => {
                const isActive = kategori === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setKategori(tab.id);
                      setPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-white text-slate-950 font-bold shadow-xs"
                        : "hover:text-slate-900 hover:bg-slate-200/60 text-slate-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Mode Tampilan (Grid / Tabel) */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Tampilan Kartu"
                className={`p-1.5 rounded-md transition ${
                  viewMode === "grid"
                    ? "bg-white text-slate-950 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Tampilan Kartu Katalog"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                aria-label="Tampilan Tabel"
                className={`p-1.5 rounded-md transition ${
                  viewMode === "table"
                    ? "bg-white text-slate-950 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Tampilan Tabel Ringkas"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Baris 2: Pencarian Debounced & Dropdown Filter Tahun */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Input Pencarian dengan Debounce */}
            <div className="relative sm:col-span-8 lg:col-span-9">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul publikasi, regulasi, nomor SOP, atau kata kunci..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full"
                  aria-label="Hapus kata kunci pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Filter Tahun Terbit */}
            <div className="sm:col-span-4 lg:col-span-3 flex items-center gap-2">
              <div className="relative w-full">
                <select
                  value={tahun}
                  onChange={(e) => {
                    setTahun(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 transition appearance-none cursor-pointer"
                  aria-label="Filter Tahun Terbit"
                >
                  <option value="semua">Semua Tahun Terbit</option>
                  {AVAILABLE_YEARS.filter((y) => y !== "semua").map((y) => (
                    <option key={y} value={y}>
                      Tahun {y}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {(debouncedQuery || kategori !== "semua" || tahun !== "semua") && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilter}
                  className="shrink-0 h-10 px-3 text-xs text-slate-600 hover:text-slate-900"
                  title="Reset Filter"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Reset</span>
                </Button>
              )}
            </div>
          </div>

          {/* Status Hasil Pencarian */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Menampilkan{" "}
              <strong className="text-slate-900 font-semibold">{documents.length}</strong> dari{" "}
              <strong className="text-slate-900 font-semibold">{total}</strong> publikasi dokumen
            </span>
            {(debouncedQuery || kategori !== "semua" || tahun !== "semua") && (
              <span className="text-blue-600 font-medium">Filter aktif</span>
            )}
          </div>
        </div>

        {/* 3. Dokumen Listing Area */}
        {isLoading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="w-20 h-6 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
                <Skeleton className="h-10 w-full rounded" />
                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileQuestion className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900">
                Tidak Ada Dokumen yang Ditemukan
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kami tidak menemukan publikasi atau dokumen yang cocok dengan kata kunci &ldquo;
                <span className="font-semibold text-slate-800">{debouncedQuery || "pilihan filter"}</span>
                &rdquo;. Coba gunakan kata kunci lain atau reset filter pencarian.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleResetFilter}
              className="gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Seluruh Filter
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          // 3A. Grid View: Katalog Kartu Clean Shadcn UI
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => {
              const badgeProps = getCategoryBadgeProps(doc.kategori);

              return (
                <div
                  key={doc.id}
                  data-reveal
                  style={{ "--reveal-delay": `${Math.min(index, 5) * 60}ms` } as React.CSSProperties}
                  className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    {/* Baris Atas: Ikon PDF Lembut & Badge Kategori */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-105 group-hover:bg-rose-100/70 transition shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <Badge className={badgeProps.className}>
                          {badgeProps.label}
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 bg-slate-50 text-xs">
                          {doc.tahun}
                        </Badge>
                      </div>
                    </div>

                    {/* Judul & Nomor Dokumen */}
                    <div className="space-y-1.5">
                      <h3
                        onClick={() => handleOpenPreview(doc)}
                        className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug cursor-pointer"
                        title={doc.judul}
                      >
                        {doc.judul}
                      </h3>

                      {doc.nomor_dokumen && (
                        <div className="text-xs font-mono font-medium text-slate-500">
                          {doc.nomor_dokumen}
                        </div>
                      )}
                    </div>

                    {/* Deskripsi Dokumen */}
                    {doc.deskripsi && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {doc.deskripsi}
                      </p>
                    )}
                  </div>

                  {/* Metadata & Tombol Aksi */}
                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                        {formatFileSize(doc.file_size)}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                        <DownloadCloud className="w-3.5 h-3.5 text-slate-400" />
                        {doc.download_count ?? 0}x diunduh
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenPreview(doc)}
                        className="w-full text-xs font-semibold gap-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Pratinjau
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        className="w-full text-xs font-semibold gap-1.5 bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // 3B. Table View: Tampilan Tabel Bersih
          <div
            data-reveal
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Dokumen &amp; Nomor Resmi</th>
                    <th scope="col" className="px-4 py-3.5">Kategori</th>
                    <th scope="col" className="px-4 py-3.5">Tahun</th>
                    <th scope="col" className="px-4 py-3.5">Ukuran</th>
                    <th scope="col" className="px-4 py-3.5">Unduhan</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => {
                    const badgeProps = getCategoryBadgeProps(doc.kategori);

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <div
                                onClick={() => handleOpenPreview(doc)}
                                className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                              >
                                {doc.judul}
                              </div>
                              {doc.nomor_dokumen && (
                                <div className="text-xs font-mono text-slate-500">
                                  {doc.nomor_dokumen}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge className={badgeProps.className}>
                            {badgeProps.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-700">
                          {doc.tahun}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                          {formatFileSize(doc.file_size)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                          {doc.download_count ?? 0}x
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenPreview(doc)}
                              className="text-xs font-semibold gap-1 text-slate-700 hover:text-slate-900"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Pratinjau</span>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleDownload(doc)}
                              className="text-xs font-semibold gap-1 bg-slate-900 hover:bg-slate-800 text-white"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Paginasi Dokumen */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200/80 pt-5 text-xs sm:text-sm text-slate-600">
            <div>
              Halaman <strong className="text-slate-900 font-semibold">{page}</strong> dari{" "}
              <strong className="text-slate-900 font-semibold">{lastPage}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => {
                  const p = Math.max(1, page - 1);
                  setPage(p);
                  window.scrollTo({ top: 120, behavior: "smooth" });
                }}
                className="text-xs disabled:opacity-50"
              >
                Sebelumnya
              </Button>

              {Array.from({ length: lastPage }).map((_, i) => {
                const pNum = i + 1;
                const isCurrent = pNum === page;
                return (
                  <Button
                    key={pNum}
                    type="button"
                    variant={isCurrent ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setPage(pNum);
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                    className={`text-xs w-8 h-8 p-0 ${
                      isCurrent ? "bg-slate-900 text-white font-bold" : "text-slate-700"
                    }`}
                  >
                    {pNum}
                  </Button>
                );
              })}

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= lastPage}
                onClick={() => {
                  const p = Math.min(lastPage, page + 1);
                  setPage(p);
                  window.scrollTo({ top: 120, behavior: "smooth" });
                }}
                className="text-xs disabled:opacity-50"
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* 5. Modal Dialog Pratinjau PDF (PdfViewerDialog) */}
      <PdfViewerDialog
        dokumen={previewDoc}
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        onDownload={handleDownload}
      />
    </div>
  );
}

export default function PublikasiPage() {
  return (
    <Suspense fallback={<PublikasiLoadingSkeleton />}>
      <PublikasiContent />
    </Suspense>
  );
}
