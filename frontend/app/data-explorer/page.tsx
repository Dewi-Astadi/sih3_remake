"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { DataExplorerFilter, FilterState } from "@/components/modules/DataExplorerFilter";
import { DataExplorerTable } from "@/components/modules/DataExplorerTable";
import { BatchDownloadBar } from "@/components/modules/BatchDownloadBar";
import { DownloadDrawer } from "@/components/modules/DownloadDrawer";
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

  // Pos whose download panel is open, or null when it is closed.
  const [downloadPos, setDownloadPos] = useState<Pos | null>(null);

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
    <div className="min-h-screen pb-28">
      {/* 1. Header Halaman */}
      <section className="border-b border-[#D5DBE3] bg-white pt-6 pb-7">
        <div className="mx-auto w-full max-w-site px-4 sm:px-6">
          <nav className="mb-4 flex items-center gap-1.5 text-[12px] font-medium text-[#5B6675]">
            <Link href="/" className="hover:text-[#0B5CAD]">
              Beranda
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#AEB8C5]" />
            <span className="text-[#1B2430]">Data Explorer</span>
          </nav>

          <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-[#1B2430] sm:text-[26px]">
            Data Explorer
          </h1>
          <p className="mt-1 max-w-[620px] text-[13px] leading-relaxed text-[#5B6675]">
            Seluruh pos pemantauan di Wilayah Sungai Serayu Opak dan Serayu
            Bogowonto. Pilih periode lalu unduh dalam format CSV atau Excel.
          </p>
        </div>
      </section>

      {/* 2. Main Content: Filter & Tabel */}
      <main className="mx-auto w-full max-w-site px-4 pt-6 space-y-4 sm:px-6">
        {/* Komponen Filter Terpadu */}
        <div data-reveal>
        <DataExplorerFilter
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilter}
          totalResults={total}
          walidataList={walidataList}
          isLoading={isLoading}
        />

        </div>

        {/* Komponen Tabel Data Explorer */}
        <div data-reveal style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
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
          onRequestDownload={setDownloadPos}
        />
        </div>
      </main>

      <DownloadDrawer pos={downloadPos} onClose={() => setDownloadPos(null)} />

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
