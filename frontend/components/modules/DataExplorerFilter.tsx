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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-5">
      {/* 1. Tab Kategori 3 Pilar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected =
              (filterValues.tipe || "semua").toLowerCase() === tab.id.toLowerCase();
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange({ tipe: tab.id === "semua" ? "" : tab.id })}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100/80 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-amber-400" : tab.color || "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Indikator Hasil Pencarian & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            {isLoading ? (
              <span className="animate-pulse">Memuat data pos...</span>
            ) : (
              <>
                Ditemukan <strong className="text-slate-900 font-bold">{totalResults}</strong> pos
              </>
            )}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Kembalikan semua filter ke pengaturan awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Grid Input Pencarian & Dropdown Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Input Bebas (5 kolom) */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pos, kode, desa, atau sungai..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-300/80 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                onFilterChange({ q: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
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
            className="w-full py-2 px-3 rounded-xl border border-slate-300/80 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
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
            className="w-full py-2 px-3 rounded-xl border border-slate-300/80 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
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
            className="w-full py-2 px-3 rounded-xl border border-slate-300/80 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
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

      {/* Active Filter Badges Pills (jika ada filter yang sedang aktif) */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Aktif:</span>
          {filterValues.tipe && filterValues.tipe !== "semua" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium">
              <span>Pilar: {filterValues.tipe}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ tipe: "" })}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterValues.q && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium">
              <span>Kata kunci: &quot;{filterValues.q}&quot;</span>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  onFilterChange({ q: "" });
                }}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterValues.wilayah_sungai && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium">
              <span>WS: {filterValues.wilayah_sungai}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ wilayah_sungai: "" })}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterValues.das && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium">
              <span>DAS: {filterValues.das}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ das: "" })}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterValues.walidata_id && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium">
              <span>
                Walidata:{" "}
                {walidataList.find((w) => String(w.id) === filterValues.walidata_id)?.singkatan ||
                  filterValues.walidata_id}
              </span>
              <button
                type="button"
                onClick={() => onFilterChange({ walidata_id: "" })}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default DataExplorerFilter;
