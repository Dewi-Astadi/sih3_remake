"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DownloadCloud,
  ChevronRight,
  Database,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { DataExplorerFilter, FilterState } from "@/components/modules/DataExplorerFilter";
import { DataExplorerTable } from "@/components/modules/DataExplorerTable";
import { BatchDownloadBar } from "@/components/modules/BatchDownloadBar";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosList, getWalidataList } from "@/lib/api";
import { Pos, Walidata } from "@/lib/types";

function DataExplorerLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-slate-200/90 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function DataExplorerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Membaca nilai awal dari URL query params
  const initialQ = searchParams.get("q") || "";
  const initialTipe = searchParams.get("tipe") || "";
  const initialWs = searchParams.get("wilayah_sungai") || "";
  const initialDas = searchParams.get("das") || "";
  const initialWalidata = searchParams.get("walidata_id") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [filterValues, setFilterValues] = useState<FilterState>({
    q: initialQ,
    tipe: initialTipe,
    wilayah_sungai: initialWs,
    das: initialDas,
    walidata_id: initialWalidata,
  });

  const [page, setPage] = useState<number>(initialPage > 0 ? initialPage : 1);
  const [perPage, setPerPage] = useState<number>(15);

  const [posData, setPosData] = useState<Pos[]>([]);
  const [walidataList, setWalidataList] = useState<Walidata[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State checkbox baris yang terpilih untuk batch download
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Sinkronkan state URL query params setiap kali filter atau page berubah
  const updateUrlParams = useCallback(
    (newFilters: FilterState, newPage: number) => {
      const params = new URLSearchParams();
      if (newFilters.q) params.set("q", newFilters.q);
      if (newFilters.tipe && newFilters.tipe !== "semua") params.set("tipe", newFilters.tipe);
      if (newFilters.wilayah_sungai) params.set("wilayah_sungai", newFilters.wilayah_sungai);
      if (newFilters.das) params.set("das", newFilters.das);
      if (newFilters.walidata_id) params.set("walidata_id", newFilters.walidata_id);
      if (newPage > 1) params.set("page", String(newPage));

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      window.history.replaceState(null, "", newUrl);
    },
    [pathname]
  );

  // Fetch daftar walidata sekali saat mount
  useEffect(() => {
    let isMounted = true;
    getWalidataList()
      .then((res) => {
        if (isMounted) setWalidataList(res);
      })
      .catch((err) => console.warn("[DataExplorer] Gagal memuat walidata", err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch daftar pos setiap kali filter, page, atau perPage berubah
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = {
      q: filterValues.q || undefined,
      tipe: filterValues.tipe && filterValues.tipe !== "semua" ? filterValues.tipe : undefined,
      wilayah_sungai: filterValues.wilayah_sungai || undefined,
      das: filterValues.das || undefined,
      walidata_id: filterValues.walidata_id || undefined,
      page,
      per_page: perPage,
    };

    getPosList(params)
      .then((res) => {
        if (!isMounted) return;
        setPosData(res.data || []);
        setTotal(res.meta?.total || 0);
        setLastPage(res.meta?.last_page || 1);
      })
      .catch((err) => {
        console.error("[DataExplorer] Gagal mengambil pos list:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filterValues, page, perPage]);

  // Handler perubahan filter: kembalikan ke page 1
  const handleFilterChange = useCallback(
    (updates: Partial<FilterState>) => {
      setFilterValues((prev) => {
        const next = { ...prev, ...updates };
        updateUrlParams(next, 1);
        return next;
      });
      setPage(1);
    },
    [updateUrlParams]
  );

  // Handler reset seluruh filter
  const handleResetFilter = useCallback(() => {
    const defaultFilters: FilterState = {
      q: "",
      tipe: "",
      wilayah_sungai: "",
      das: "",
      walidata_id: "",
    };
    setFilterValues(defaultFilters);
    setPage(1);
    updateUrlParams(defaultFilters, 1);
  }, [updateUrlParams]);

  // Handler perubahan halaman
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateUrlParams(filterValues, newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filterValues, updateUrlParams]
  );

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28">
      {/* 1. Header Halaman */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigasi */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Data Explorer</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Portal Satu Data SDA Terbuka</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
                Pusat Unduh Data Terpadu SIH3
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Jelajahi seluruh jaringan pos pemantauan hidrologi, hidrometeorologi, dan
                hidrogeologi di Wilayah Sungai Serayu Opak &amp; Serayu Bogowonto. Unduh dataset
                terbuka dalam 1-klik atau batch sekaligus.
              </p>
            </div>

            {/* Quick Helper Badge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 shrink-0">
              <DownloadCloud className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Format Terbuka</div>
                <div>Excel (.xlsx) &amp; CSV Siap Olah</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content: Filter, Info Strip & Data Table */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Banner Info Petunjuk Batch */}
        <div
          data-reveal
          className="flex items-center gap-3 p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/80 text-xs text-sky-900"
        >
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>Tips Pengunduhan:</strong> Anda dapat mengunduh data langsung per stasiun melalui
            tombol <strong className="font-semibold">Unduh</strong> di kolom aksi, atau centang kotak
            pada beberapa stasiun untuk mengunduh berkas batch secara simultan.
          </span>
        </div>

        {/* Komponen Filter Terpadu */}
        <div data-reveal style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
        <DataExplorerFilter
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilter}
          totalResults={total}
          walidataList={walidataList}
          isLoading={isLoading}
        />

        </div>

        {/* Komponen Tabel Data Explorer (TanStack Table + Shadcn UI) */}
        <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
        <DataExplorerTable
          data={posData}
          isLoading={isLoading}
          page={page}
          perPage={perPage}
          total={total}
          lastPage={lastPage}
          onPageChange={handlePageChange}
          onPerPageChange={(newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          }}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          onResetFilter={handleResetFilter}
        />
        </div>
      </main>

      {/* 3. Floating Batch Download Bar (Muncul saat selectedIds.length > 0) */}
      <BatchDownloadBar
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  );
}

export default function DataExplorerPage() {
  return (
    <Suspense fallback={<DataExplorerLoadingSkeleton />}>
      <DataExplorerContent />
    </Suspense>
  );
}
