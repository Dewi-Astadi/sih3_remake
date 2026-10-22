import React from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Info } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { DatasetHero } from "@/components/dataset/DatasetHero";
import { StatusBadge } from "@/components/home/StatusBadge";
import {
  MIN_GAUGES_PER_BASIN,
  type FloodBasin,
  type FloodRoutingData,
} from "@/lib/flood-routing";

const ROUTING_APP_URL = "https://flood-routing-bbwsso.vercel.app";

/**
 * FloodRouting page. The original site embeds a third-party routing app in an
 * iframe; this page keeps that link explicit instead of embedding a frame that
 * fails silently, and adds the gauge inventory the calculation depends on.
 */
export function FloodRoutingContent({
  data,
  error,
}: {
  data: FloodRoutingData | null;
  error: string | null;
}) {
  return (
    <>
      <DatasetHero
        kicker="Prakiraan waktu banjir"
        title="Flood Routing"
        description="Perhitungan pergerakan aliran di suatu sungai untuk memperkirakan waktu tiba banjir di bagian hilir."
      />

      <section className="py-8 sm:py-10">
        <Container>
          {/* Primary action */}
          <div className="rounded-[8px] border border-[#D5DBE3] bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[17px] font-semibold text-[#1B2430]">
                  Aplikasi perhitungan Flood Routing
                </h2>
                <p className="mt-1 max-w-[560px] text-[13px] leading-relaxed text-[#5B6675]">
                  Perhitungan waktu tempuh banjir dijalankan pada aplikasi
                  terpisah milik BBWS Serayu Opak. Halaman ini menampilkan data
                  masukan yang dipakai perhitungan tersebut.
                </p>
              </div>
              <a
                href={ROUTING_APP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-[#F2A900] px-5 text-[15px] font-semibold text-[#0E2A4E] transition-colors hover:bg-[#D99500]"
              >
                Buka aplikasi Flood Routing
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Gauge inventory */}
          <div className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-[#1B2430] sm:text-[26px]">
                  Pos duga air untuk perhitungan
                </h2>
                <p className="mt-1 text-[13px] text-[#5B6675]">
                  Flood routing membutuhkan minimal {MIN_GAUGES_PER_BASIN} pos
                  AWLR pada satu daerah aliran sungai, dari hulu ke hilir.
                </p>
              </div>
              {data && (
                <span className="inline-flex h-8 items-center rounded-full border border-[#D5DBE3] bg-white px-3 text-[13px] text-[#5B6675]">
                  <strong className="mr-1 font-semibold text-[#1B2430]">
                    {data.gaugeCount}
                  </strong>
                  pos AWLR
                </span>
              )}
            </div>

            {error ? (
              <div
                role="alert"
                className="mt-4 rounded-[8px] border border-[#E88B84] bg-[#FBE3E1] p-5 text-[14px] text-[#8B1A12]"
              >
                <p className="font-semibold">Data tidak dapat dimuat</p>
                <p className="mt-1.5">{error}</p>
              </div>
            ) : (
              data && (
                <>
                  {/* Readiness summary */}
                  <div className="mt-4 flex items-start gap-2.5 rounded-[8px] border border-[#A9C8EC] bg-[#E6F0FB] p-3.5 text-[13px] text-[#12467A]">
                    <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      {data.routableBasins > 0 ? (
                        <>
                          <strong className="font-semibold">
                            {data.routableBasins} DAS
                          </strong>{" "}
                          memiliki pos cukup untuk perhitungan routing.
                        </>
                      ) : (
                        <>
                          Belum ada DAS dengan {MIN_GAUGES_PER_BASIN} pos AWLR
                          atau lebih. Perhitungan waktu tempuh belum dapat
                          dijalankan dari data portal ini.
                        </>
                      )}{" "}
                      Waktu tempuh tidak dihitung di halaman ini karena data
                      jarak antar pos dan tinggi muka air acuan belum tersedia
                      di API.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {data.basins.map((basin) => (
                      <BasinCard key={basin.das} basin={basin} />
                    ))}
                  </div>

                  {data.lastUpdated && (
                    <p className="mt-4 flex items-center gap-1.5 text-[12px] text-[#5B6675]">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                      Pembaruan data terakhir:{" "}
                      {new Date(data.lastUpdated).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Jakarta",
                      })}{" "}
                      WIB
                    </p>
                  )}
                </>
              )
            )}
          </div>

          {/* Cross-links */}
          <div className="mt-8 border-t border-[#D5DBE3] pt-5">
            <p className="text-[13px] font-semibold text-[#1B2430]">
              Data terkait
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/hidrologi"
                className="inline-flex h-8 items-center rounded-full border border-[#AEB8C5] bg-white px-3 text-[13px] font-medium text-[#1B2430] hover:border-[#14396A] hover:text-[#14396A]"
              >
                Informasi Hidrologi
              </Link>
              <Link
                href="/hidrometeorologi"
                className="inline-flex h-8 items-center rounded-full border border-[#AEB8C5] bg-white px-3 text-[13px] font-medium text-[#1B2430] hover:border-[#14396A] hover:text-[#14396A]"
              >
                Informasi Hidrometeorologi
              </Link>
              <Link
                href="/data-explorer"
                className="inline-flex h-8 items-center rounded-full border border-[#14396A] bg-[#14396A] px-3 text-[13px] font-semibold text-white hover:bg-[#0E2A4E]"
              >
                Data Explorer lengkap
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function BasinCard({ basin }: { basin: FloodBasin }) {
  return (
    <div className="rounded-[8px] border border-[#D5DBE3] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E8EE] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-[#1B2430]">
            {basin.das}
          </h3>
          <span className="text-[12px] text-[#5B6675]">
            {basin.gauges.length} pos AWLR
          </span>
        </div>
        <span className="text-[12px] text-[#5B6675]">
          {basin.routable
            ? "Cukup untuk routing"
            : `Perlu ${MIN_GAUGES_PER_BASIN - basin.gauges.length} pos lagi`}
        </span>
      </div>

      <ul className="divide-y divide-[#E4E8EE]">
        {basin.gauges.map((gauge) => {
          const location = [gauge.sungai, gauge.kabupaten]
            .filter(Boolean)
            .join(" · ");

          return (
            <li
              key={gauge.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <Link
                  href={`/pos/${gauge.id}`}
                  className="text-[14px] font-semibold text-[#0B5CAD] hover:text-[#14396A] hover:underline"
                >
                  {gauge.nama}
                </Link>
                <div className="mt-0.5 text-[12px] text-[#5B6675]">
                  {location || "Lokasi tidak tercatat"}
                  {gauge.latitude !== null && gauge.longitude !== null && (
                    <span className="ml-1.5 font-mono text-[11px] text-[#8A96A6]">
                      {gauge.latitude.toFixed(4)}, {gauge.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[17px] font-semibold leading-tight text-[#14396A] tabular-nums">
                    {gauge.nilai !== null
                      ? gauge.nilai.toLocaleString("id-ID", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "—"}
                    <span className="ml-1 text-[12px] font-medium text-[#5B6675]">
                      {gauge.nilai !== null ? gauge.satuan : ""}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5B6675]">
                    {gauge.timestamp.text ?? "Waktu tidak tercatat"}
                  </div>
                </div>
                <StatusBadge status={gauge.status} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FloodRoutingContent;
