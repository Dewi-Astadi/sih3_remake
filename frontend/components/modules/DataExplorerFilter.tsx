"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Waves,
  CloudRain,
  Layers,
  LayoutGrid,
  Filter,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Walidata } from "@/lib/types";

export interface FilterState {
  q: string;
  tipe: string;
  wilayah_sungai: string;
  das: string;
  walidata_id: string;
}

export interface DataExplorerFilterProps {
  filterValues: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
  walidataList: Walidata[];
  isLoading?: boolean;
}

const TABS = [
  { id: "semua", label: "Semua Pilar", icon: LayoutGrid, countBadge: null },
  { id: "hidrologi", label: "Hidrologi", icon: Waves, color: "text-sky-600" },
  { id: "hidrometeorologi", label: "Hidrometeorologi", icon: CloudRain, color: "text-blue-600" },
  { id: "hidrogeologi", label: "Hidrogeologi", icon: Layers, color: "text-indigo-600" },
];

const WILAYAH_SUNGAI_OPTIONS = [
  { value: "", label: "Semua Wilayah Sungai" },
  { value: "WS Serayu Opak", label: "WS Serayu Opak" },
  { value: "WS Progo Opak Serang", label: "WS Progo Opak Serang" },
  { value: "WS Serayu Bogowonto", label: "WS Serayu Bogowonto" },
];

const DAS_OPTIONS = [
  { value: "", label: "Semua DAS" },
  { value: "DAS Progo", label: "DAS Progo" },
  { value: "DAS Opak-Oyo", label: "DAS Opak-Oyo" },
  { value: "DAS Serang", label: "DAS Serang" },
  { value: "DAS Bogowonto", label: "DAS Bogowonto" },
  { value: "DAS Serayu", label: "DAS Serayu" },
  { value: "DAS Klawing", label: "DAS Klawing" },
];

export function DataExplorerFilter({
  filterValues,
  onFilterChange,
  onReset,
  totalResults,
  walidataList,
  isLoading = false,
}: DataExplorerFilterProps) {
  const [searchTerm, setSearchTerm] = useState(filterValues.q || "");
  const [, startTransition] = useTransition();

  // Sinkronkan state lokal saat prop filterValues.q berubah dari luar (misal via URL atau reset)
  useEffect(() => {
    setSearchTerm(filterValues.q || "");
  }, [filterValues.q]);

  // Debounce 300ms untuk input teks pencarian
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filterValues.q) {
        startTransition(() => {
          onFilterChange({ q: searchTerm });
        });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, filterValues.q, onFilterChange]);

  // Deteksi apakah ada filter aktif selain nilai default
  const hasActiveFilters = Boolean(
    filterValues.q ||
      (filterValues.tipe && filterValues.tipe !== "semua") ||
      filterValues.wilayah_sungai ||
      filterValues.das ||
      filterValues.walidata_id
  );

  return (
    <div className="rounded-[8px] border border-[#D5DBE3] bg-white">
      {/* 1. Tab Kategori 3 Pilar */}
      <div className="flex flex-col gap-2 border-b border-[#E4E8EE] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected =
              (filterValues.tipe || "semua").toLowerCase() === tab.id.toLowerCase();
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange({ tipe: tab.id === "semua" ? "" : tab.id })}
                className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors ${
                  isSelected
                    ? "border-[#14396A] bg-[#14396A] text-white"
                    : "border-[#AEB8C5] bg-white text-[#1B2430] hover:bg-[#F0F3F7]"
                }`}
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Indikator Hasil Pencarian & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-[13px] text-[#5B6675]">
            {isLoading ? (
              "Memuat…"
            ) : (
              <>
                <strong className="font-semibold text-[#1B2430]">{totalResults}</strong> pos
              </>
            )}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-[#AEB8C5] bg-white px-2.5 text-[12px] font-medium text-[#1B2430] hover:bg-[#F0F3F7]"
              title="Kembalikan semua filter ke pengaturan awal"
            >
              <RotateCcw aria-hidden="true" className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Grid Input Pencarian & Dropdown Filter */}
      <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 lg:grid-cols-12">
        {/* Search Input Bebas (5 kolom) */}
        <div className="lg:col-span-5 relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A96A6]"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pos, kode, desa, atau sungai"
            aria-label="Cari pos pemantauan"
            className="h-9 w-full rounded-[6px] border border-[#AEB8C5] bg-white pl-9 pr-8 text-[13px] text-[#1B2430] placeholder:text-[#8A96A6] focus:border-[#0B5CAD] focus:outline-none focus:ring-2 focus:ring-[#0B5CAD]/25"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                onFilterChange({ q: "" });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#8A96A6] hover:bg-[#EEF1F5] hover:text-[#1B2430]"
              title="Hapus pencarian teks"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Wilayah Sungai (2 kolom) */}
        <div className="lg:col-span-2">
          <select
            value={filterValues.wilayah_sungai}
            onChange={(e) => onFilterChange({ wilayah_sungai: e.target.value })}
            className="h-9 w-full rounded-[6px] border border-[#AEB8C5] bg-white px-2 text-[13px] text-[#1B2430] focus:border-[#0B5CAD] focus:outline-none"
            aria-label="Filter Wilayah Sungai"
          >
            {WILAYAH_SUNGAI_OPTIONS.map((ws) => (
              <option key={ws.value} value={ws.value}>
                {ws.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown DAS (2 kolom) */}
        <div className="lg:col-span-2">
          <select
            value={filterValues.das}
            onChange={(e) => onFilterChange({ das: e.target.value })}
            className="h-9 w-full rounded-[6px] border border-[#AEB8C5] bg-white px-2 text-[13px] text-[#1B2430] focus:border-[#0B5CAD] focus:outline-none"
            aria-label="Filter Daerah Aliran Sungai"
          >
            {DAS_OPTIONS.map((das) => (
              <option key={das.value} value={das.value}>
                {das.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Walidata (3 kolom) */}
        <div className="lg:col-span-3">
          <select
            value={filterValues.walidata_id}
            onChange={(e) => onFilterChange({ walidata_id: e.target.value })}
            className="h-9 w-full rounded-[6px] border border-[#AEB8C5] bg-white px-2 text-[13px] text-[#1B2430] focus:border-[#0B5CAD] focus:outline-none"
            aria-label="Filter Instansi Walidata"
          >
            <option value="">Semua Walidata Pengelola</option>
            {walidataList.map((w) => (
              <option key={w.id} value={String(w.id)}>
                {w.singkatan} - {w.nama.length > 28 ? `${w.nama.slice(0, 28)}...` : w.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
}

export default DataExplorerFilter;
