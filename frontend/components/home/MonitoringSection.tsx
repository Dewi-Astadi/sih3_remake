"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { StatusBadge } from "@/components/home/StatusBadge";
import type { PosRow } from "@/lib/homepage-data";

type FilterTab = "all" | "duga_air" | "curah_hujan" | "kualitas_air" | "air_tanah";

const TABS: Array<{ id: FilterTab; label: string }> = [
  { id: "all", label: "Semua" },
  { id: "duga_air", label: "Duga Air" },
  { id: "curah_hujan", label: "Curah Hujan" },
  { id: "kualitas_air", label: "Kualitas Air" },
  { id: "air_tanah", label: "Air Tanah" },
];

function getCategoryTag(row: PosRow): string {
  if (row.jenisKey === "duga-air") {
    return "Duga Air · AWLR";
  }
  if (row.jenisKey === "curah-hujan") {
    return "Curah Hujan · ARR";
  }
  if (row.jenisKey === "klimatologi") {
    return "Klimatologi";
  }
  if (row.jenisKey === "kualitas-air") {
    return "Kualitas Air";
  }
  if (row.jenisKey === "muka-air-tanah") {
    return "Muka Air Tanah";
  }
  return row.jenis;
}

function getParamLabel(row: PosRow): string {
  if (row.jenisKey === "duga-air") {
    return "Tinggi muka air";
  }
  if (row.jenisKey === "curah-hujan") {
    return "Curah hujan harian";
  }
  if (row.jenisKey === "kualitas-air") {
    return "Indeks Pencemaran (PIj)";
  }
  if (row.jenisKey === "muka-air-tanah") {
    return "Kedalaman muka air tanah";
  }
  return row.jenisMeta?.primaryLabel ?? "Nilai pengukuran";
}

/** Water level and rainfall cards show a trend line; quality cards show the
 *  secondary parameters instead. */
const SHOWS_PARAMS: ReadonlyArray<PosRow["jenisKey"]> = [
  "kualitas-air",
  "muka-air-tanah",
];

function generateSparkline(row: PosRow): string {
  const id = row.id;
  const tone = row.status.tone;
  if (
    tone === "neutral" ||
    (row.latest?.nilai === 0 &&
      (row.jenisKey === "curah-hujan" || row.jenisKey === "klimatologi"))
  ) {
    return "0,36 200,36";
  }
  if (tone === "watch" || tone === "warning" || tone === "danger") {
    const base = 28 - (id % 6);
    return `0,${base + 6} 20,${base + 5} 40,${base + 3} 60,${base + 2} 80,${base - 2} 100,${base - 3} 120,${base - 8} 140,${base - 10} 160,${base - 13} 180,${base - 15} 200,${base - 16}`;
  }
  const offset = (id % 5) * 2;
  return `0,${22 + offset} 20,${23 + offset} 40,${21 + offset} 60,${22 + offset} 80,${24 + offset} 100,${23 + offset} 120,${22 + offset} 140,${21 + offset} 160,${22 + offset} 180,${23 + offset} 200,${22 + offset}`;
}

export function MonitoringSection({ rows }: { rows: PosRow[] }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredRows = useMemo(() => {
    let result = rows;
    if (activeTab === "duga_air") {
      result = rows.filter(
        (r) =>
          r.jenisKey === "duga-air" ||
          r.jenis.toLowerCase().includes("duga air")
      );
    } else if (activeTab === "curah_hujan") {
      result = rows.filter(
        (r) =>
          r.jenisKey === "curah-hujan" ||
          r.jenisKey === "klimatologi" ||
          r.jenis.toLowerCase().includes("hujan") ||
          r.jenis.toLowerCase().includes("klimatologi")
      );
    } else if (activeTab === "kualitas_air") {
      result = rows.filter(
        (r) =>
          r.jenisKey === "kualitas-air" ||
          r.jenis.toLowerCase().includes("kualitas")
      );
    } else if (activeTab === "air_tanah") {
      result = rows.filter(
        (r) =>
          r.jenisKey === "muka-air-tanah" ||
          r.jenis.toLowerCase().includes("air tanah") ||
          r.jenis.toLowerCase().includes("mat")
      );
    }

    return [...result].sort((a, b) => {
      const aAlert = a.status.alert ? 1 : 0;
      const bAlert = b.status.alert ? 1 : 0;
      if (bAlert !== aAlert) return bAlert - aAlert;
      return a.nama.localeCompare(b.nama, "id");
    });
  }, [rows, activeTab]);

  const displayedCards = filteredRows.slice(0, 6);

  return (
    <section className="py-14 bg-[#F5F7FA]">
      <Container>
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-[26px] font-semibold tracking-[-0.01em] text-[#1B2430]">
              Pemantauan terkini
            </h2>
            <p className="mt-1 text-[14px] text-[#5B6675]">
              Pos prioritas di DAS Progo, Opak, dan Serang.
            </p>
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-9 px-3.5 rounded-[6px] text-[14px] font-medium transition-colors border ${
                    active
                      ? "bg-[#14396A] text-white border-[#14396A]"
                      : "bg-white text-[#1B2430] border-[#AEB8C5] hover:bg-[#F0F3F7]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCards.map((row, index) => {
            const categoryTag = getCategoryTag(row);
            const paramLabel = getParamLabel(row);
            const hasStatus =
              row.status?.label && row.status.label !== "—";

            // Location
            const river = row.sungai || row.sub_das;
            const das = row.das ? `DAS ${row.das}` : null;
            const region = [river, das].filter(Boolean).join(", ");
            const locationStr = [region, row.kabupaten].filter(Boolean).join(" · ");

            // Value & unit
            const val =
              row.latest?.nilai != null
                ? row.latest.nilai.toLocaleString("id-ID", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "-";
            const unit = row.latest?.satuan || "";

            // Additional parameters, labelled from the jenis metadata
            const params = row.latest?.parameter_tambahan;
            const paramList =
              SHOWS_PARAMS.includes(row.jenisKey) && params
                ? (row.jenisMeta?.secondary ?? [])
                    .filter((p) => params[p.key] != null)
                    .map((p) => `${p.label} ${params[p.key]}`)
                    .join(" · ")
                : null;

            // Timestamp formatting
            const dateStr = row.timestamp?.text || "20 Okt 2026, 07.00";
            const agency = row.walidata?.singkatan || "BBWS SO";

            return (
              <article
                key={row.id}
                data-reveal
                style={{ "--reveal-delay": `${Math.min(index, 5) * 70}ms` } as React.CSSProperties}
                className="flex flex-col rounded-[8px] border border-[#D5DBE3] bg-white p-5 transition-shadow hover:shadow-[0_2px_10px_rgba(14,42,78,0.08)]"
              >
                {/* Top: Jenis & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] text-[#5B6675]">
                    {categoryTag}
                  </span>
                  {hasStatus ? (
                    <StatusBadge status={row.status} />
                  ) : (
                    <span className="text-[13px] text-[#5B6675]">
                      Tanpa kelas status
                    </span>
                  )}
                </div>

                {/* Name & Location */}
                <h3 className="mt-2 mb-0.5 text-[17px] font-semibold text-[#1B2430]">
                  {row.nama}
                </h3>
                <div className="text-[13px] text-[#5B6675] truncate">
                  {locationStr || "Wilayah Sungai Serayu Opak"}
                </div>

                {/* Middle: Metric & Sparkline */}
                <div className="my-3.5 min-h-[84px]">
                  <span className="block text-[13px] text-[#5B6675]">
                    {paramLabel}
                  </span>
                  <div className="flex items-baseline">
                    <span className="text-[30px] font-semibold leading-[1.1] text-[#14396A]">
                      {val}
                    </span>
                    {unit && (
                      <span className="ml-1 text-[15px] font-semibold text-[#5B6675]">
                        {unit}
                      </span>
                    )}
                  </div>

                  {paramList ? (
                    <div className="mt-2 text-[13px] text-[#5B6675] line-clamp-1">
                      {paramList}
                    </div>
                  ) : (
                    <svg
                      viewBox="0 0 200 40"
                      preserveAspectRatio="none"
                      role="img"
                      aria-label="Tren pemantauan"
                      className="mt-1.5 h-9 w-full"
                    >
                      <polyline
                        points={generateSparkline(row)}
                        fill="none"
                        stroke="#14396A"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  )}
                </div>

                {/* Footer: Date & Links */}
                <div className="mt-auto flex items-center justify-between border-t border-[#E4E8EE] pt-2.5 text-[13px] text-[#5B6675]">
                  <span>
                    {dateStr} &middot; {agency}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Link
                      href={`/pos/${row.id}`}
                      className="text-[#0B5CAD] hover:text-[#14396A] font-medium"
                    >
                      Detail
                    </Link>
                    <span>&middot;</span>
                    <a
                      href={`/api/export/pos/${row.id}`}
                      className="text-[#0B5CAD] hover:text-[#14396A] font-medium"
                    >
                      CSV
                    </a>
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Section Footer */}
        <div className="mt-5 flex items-center justify-between text-[14px]">
          <span className="text-[#5B6675]">
            Menampilkan {displayedCards.length} dari {rows.length} pos
          </span>
          <Link
            href="/data-explorer"
            className="font-medium text-[#0B5CAD] hover:text-[#14396A]"
          >
            Buka semua pos di Data Explorer &rarr;
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default MonitoringSection;
