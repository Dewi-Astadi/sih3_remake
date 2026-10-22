import React from "react";
import Link from "next/link";
import { Archive, ChevronRight, MapPin, Waves, CloudRain, FlaskConical, Droplets, Thermometer, Database } from "lucide-react";
import { JENIS_BADGE } from "@/lib/dataset";
import type { DatasetRow } from "@/lib/dataset-data";
import type { JenisKey } from "@/lib/jenis";

const JENIS_ICON: Record<JenisKey, typeof Waves> = {
  "duga-air": Waves,
  "kualitas-air": FlaskConical,
  "curah-hujan": CloudRain,
  klimatologi: Thermometer,
  "muka-air-tanah": Droplets,
};

/** A healthy station is the norm, so it gets no label; only deviations show. */
const STATUS_ALAT_NOTE: Record<string, string> = {
  perbaikan: "Dalam perbaikan",
  rusak: "Alat rusak",
};

/**
 * Pos list for a dataset page. Rows link to the station detail page; the
 * archive action deep-links to the history table there.
 */
export function DatasetTable({
  rows,
  startIndex,
}: {
  rows: DatasetRow[];
  startIndex: number;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[8px] border border-[#D5DBE3] bg-white px-6 py-16 text-center">
        <Database aria-hidden="true" className="mx-auto h-8 w-8 text-[#AEB8C5]" />
        <p className="mt-3 text-[15px] font-semibold text-[#1B2430]">
          Tidak ada pos yang cocok
        </p>
        <p className="mt-1 text-[13px] text-[#5B6675]">
          Coba ubah kata kunci atau hapus sebagian filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[8px] border border-[#D5DBE3] bg-white">
      <table className="w-full min-w-[880px] border-collapse text-[13px]">
        <caption className="sr-only">
          Daftar pos pemantauan beserta walidata, DAS, dan wilayah sungai
        </caption>
        <thead>
          <tr className="border-b border-[#D5DBE3] bg-[#F5F7FA] text-left text-[12px] uppercase tracking-wide text-[#5B6675]">
            <th scope="col" className="w-12 px-3 py-2.5 font-semibold">
              No.
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              Walidata
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              Nama Pos
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              DAS / Wilayah Sungai
            </th>
            <th scope="col" className="w-[190px] px-3 py-2.5 text-right font-semibold">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const Icon = row.jenisKey ? JENIS_ICON[row.jenisKey] : Database;
            const badge = row.jenisKey
              ? JENIS_BADGE[row.jenisKey]
              : "border-[#C5CDD8] bg-[#EEF1F5] text-[#3D4756]";
            const location = [row.kabupaten].filter(Boolean).join(", ");

            return (
              <tr
                key={row.id}
                className="border-b border-[#E4E8EE] last:border-b-0 hover:bg-[#FAFBFC]"
              >
                <td className="px-3 py-3 align-top text-[#5B6675] tabular-nums">
                  {startIndex + index}
                </td>
                <td className="px-3 py-3 align-top text-[#1B2430]">
                  {row.walidata}
                </td>
                <td className="px-3 py-3 align-top">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[#D5DBE3] bg-[#F5F7FA]">
                      <Icon aria-hidden="true" className="h-4 w-4 text-[#14396A]" />
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/pos/${row.id}`}
                        className="font-semibold text-[#0B5CAD] hover:text-[#14396A] hover:underline"
                      >
                        {row.nama}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span
                          className={`inline-flex items-center rounded-full border px-1.5 py-px text-[11px] font-medium ${badge}`}
                        >
                          {row.jenisLabel}
                        </span>
                        {STATUS_ALAT_NOTE[row.statusAlat.toLowerCase()] && (
                          <span className="text-[11px] text-[#8B1A12]">
                            {STATUS_ALAT_NOTE[row.statusAlat.toLowerCase()]}
                          </span>
                        )}
                      </div>
                      {location && (
                        <div className="mt-1 flex items-center gap-1 text-[12px] text-[#5B6675]">
                          <MapPin aria-hidden="true" className="h-3 w-3 shrink-0" />
                          <span className="truncate">{location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 align-top">
                  <div className="font-medium text-[#1B2430]">{row.das || "—"}</div>
                  <div className="mt-0.5 text-[12px] text-[#5B6675]">
                    {row.wilayahSungai || "—"}
                  </div>
                </td>
                <td className="px-3 py-3 align-top">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/pos/${row.id}`}
                      className="inline-flex h-7 items-center gap-1 rounded-full bg-[#0E7A6B] px-3 text-[12px] font-semibold text-white hover:bg-[#0B6558]"
                    >
                      Detail
                      <ChevronRight aria-hidden="true" className="h-3 w-3" />
                    </Link>
                    <Link
                      href={`/pos/${row.id}#riwayat`}
                      className="inline-flex h-7 items-center gap-1 rounded-[6px] border border-[#AEB8C5] bg-white px-2.5 text-[12px] font-medium text-[#1B2430] hover:bg-[#F0F3F7]"
                      title={`Riwayat data ${row.nama}`}
                    >
                      <Archive aria-hidden="true" className="h-3 w-3" />
                      Arsip
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DatasetTable;
