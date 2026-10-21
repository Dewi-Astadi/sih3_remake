"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Database,
  Activity,
  Radio,
  CheckCircle2,
  X,
  Layers,
  Droplets,
  CloudRain,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const POPULAR_SEARCHES = [
  "Kranggan",
  "Sermo",
  "DAS Progo",
  "DAS Opak",
  "Curah Hujan",
  "Kualitas Air",
];

export function QuickSearchHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/data-explorer?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/data-explorer");
    }
  };

  const handleChipClick = (term: string) => {
    router.push(`/data-explorer?q=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900/[0.04] via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Decorative subtle background accents */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-sky-200/30 to-amber-200/20 blur-3xl opacity-70 rounded-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-25"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag / Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80 text-xs sm:text-sm font-medium mb-6 shadow-xs animate-in fade-in duration-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
          <span className="font-semibold text-slate-900">SIH3 Serayu Opak</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 hidden sm:inline">Keterbukaan Informasi Publik SDA</span>
          <span className="text-slate-600 sm:hidden">Satu Data SDA</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.15] max-w-4xl mx-auto">
          Portal Satu Data{" "}
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 bg-clip-text text-transparent">
            Hidrologi, Hidrometeorologi &amp; Hidrogeologi
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Layanan informasi terpadu dan keterbukaan data sumber daya air Wilayah
          Sungai Serayu Opak &amp; Serayu Bogowonto.
        </p>

        {/* Universal Search Box */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="relative flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-300/80 focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/10 transition-all duration-200"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama pos (Kranggan, Sermo), sungai, DAS, atau kota..."
                className="w-full pl-11 pr-9 py-2.5 sm:py-3 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none"
                aria-label="Pencarian universal pos dan dataset"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Hapus kata kunci pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all duration-150 flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <span>Cari Data</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Popular Search Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-600 mr-1">Pencarian Populer:</span>
            {POPULAR_SEARCHES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/90 text-slate-700 hover:text-slate-950 font-medium transition-colors border border-slate-200/80 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Mini Stats Counter Badges */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {/* Stat 1: Total Pos */}
          <div className="flex items-center justify-center sm:justify-start gap-3.5 p-3.5 rounded-xl bg-white/70 backdrop-blur-xs border border-slate-200/70 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-base font-extrabold text-slate-900">120+ Pos Pantau</div>
              <div className="text-xs text-slate-500">Stasiun Hidrologi &amp; Klimat</div>
            </div>
          </div>

          {/* Stat 2: Real-time Telemetry */}
          <div className="flex items-center justify-center sm:justify-start gap-3.5 p-3.5 rounded-xl bg-white/70 backdrop-blur-xs border border-slate-200/70 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-base font-extrabold text-slate-900">Telemetri 24/7</div>
              <div className="text-xs text-slate-500">Pembaruan Rutin Otomatis</div>
            </div>
          </div>

          {/* Stat 3: Status Sistem */}
          <div className="flex items-center justify-center sm:justify-start gap-3.5 p-3.5 rounded-xl bg-white/70 backdrop-blur-xs border border-slate-200/70 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-base font-extrabold text-slate-900">
                <span>Status Normal</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs text-slate-500">Satu Data SIH3 Online</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default QuickSearchHero;
