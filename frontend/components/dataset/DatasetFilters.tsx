import React from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { JENIS_META, type JenisKey } from "@/lib/jenis";
import {
  DAS_OPTIONS,
  DATASET_HREF,
  JENIS_API_VALUE,
  WILAYAH_OPTIONS,
  datasetHref,
  hasActiveFilters,
  type DatasetQuery,
} from "@/lib/dataset";
import type { TipeKey } from "@/lib/homepage-data";

/**
 * Filter panel for the dataset pages. It is a plain GET form, so every filter
 * combination is linkable and works without JavaScript.
 */
export function DatasetFilters({
  tipe,
  jenisKeys,
  query,
  counts,
}: {
  tipe: TipeKey;
  jenisKeys: JenisKey[];
  query: DatasetQuery;
  counts: Partial<Record<JenisKey, number>>;
}) {
  const active = hasActiveFilters(query);
  const action = DATASET_HREF[tipe];

  const countValues = jenisKeys.map((key) => counts[key]);
  const allCount = countValues.every((value) => typeof value === "number")
    ? countValues.reduce<number>((sum, value) => sum + (value ?? 0), 0)
    : null;

  return (
    <div className="rounded-[8px] border border-[#D5DBE3] bg-white">
      {/* Pos-type tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E8EE] p-3">
        <Link
          href={datasetHref(tipe, query, { jenis: "", page: 1 })}
          aria-current={query.jenis ? undefined : "true"}
          className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors ${
            query.jenis
              ? "border-[#AEB8C5] bg-white text-[#1B2430] hover:bg-[#F0F3F7]"
              : "border-[#14396A] bg-[#14396A] text-white"
          }`}
        >
          Semua
          {allCount !== null && (
            <span className={query.jenis ? "text-[#5B6675]" : "text-white/75"}>
              {allCount}
            </span>
          )}
        </Link>

        {jenisKeys.map((key) => {
          const value = JENIS_API_VALUE[key];
          const selected = query.jenis === value;
          const count = counts[key];
          return (
            <Link
              key={key}
              href={datasetHref(tipe, query, { jenis: value, page: 1 })}
              aria-current={selected ? "true" : undefined}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors ${
                selected
                  ? "border-[#14396A] bg-[#14396A] text-white"
                  : "border-[#AEB8C5] bg-white text-[#1B2430] hover:bg-[#F0F3F7]"
              }`}
            >
              {JENIS_META[key].label}
              {count !== undefined && (
                <span className={selected ? "text-white/75" : "text-[#5B6675]"}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Search + advanced filters */}
      <form action={action} method="get" role="search" className="p-3">
        {query.jenis && <input type="hidden" name="jenis" value={query.jenis} />}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A96A6]"
            />
            <input
              type="search"
              name="q"
              defaultValue={query.q}
              placeholder="Cari pos, walidata, DAS…"
              aria-label="Cari pos pemantauan"
              className="h-9 w-full rounded-[6px] border border-[#AEB8C5] bg-white pl-9 pr-3 text-[13px] text-[#1B2430] placeholder:text-[#8A96A6] focus:border-[#0B5CAD] focus:outline-none focus:ring-2 focus:ring-[#0B5CAD]/25"
            />
          </div>

          <select
            name="das"
            defaultValue={query.das}
            aria-label="Filter DAS"
            className="h-9 rounded-[6px] border border-[#AEB8C5] bg-white px-2 text-[13px] text-[#1B2430] focus:border-[#0B5CAD] focus:outline-none"
          >
            <option value="">Semua DAS</option>
            {DAS_OPTIONS.map((das) => (
              <option key={das} value={das}>
                {das}
              </option>
            ))}
          </select>

          <select
            name="wilayah"
            defaultValue={query.wilayah}
            aria-label="Filter wilayah sungai"
            className="h-9 rounded-[6px] border border-[#AEB8C5] bg-white px-2 text-[13px] text-[#1B2430] focus:border-[#0B5CAD] focus:outline-none"
          >
            <option value="">Semua WS</option>
            {WILAYAH_OPTIONS.map((ws) => (
              <option key={ws} value={ws}>
                {ws}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] border border-[#14396A] bg-[#14396A] px-3.5 text-[13px] font-semibold text-white hover:bg-[#0E2A4E]"
          >
            <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5" />
            Terapkan
          </button>

          {active && (
            <Link
              href={action}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] border border-[#AEB8C5] bg-white px-3 text-[13px] font-medium text-[#1B2430] hover:bg-[#F0F3F7]"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Reset
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}

export default DatasetFilters;
