"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Download, ChevronLeft, ChevronRight, SearchX, MapPin } from "lucide-react";
import {
  useLegacyTable as useTable,
  getCoreRowModel,
  type LegacyColumnDef as ColumnDef,
} from "@tanstack/react-table/legacy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Pos } from "@/lib/types";

/** Extra per-column flags read by the renderer. */
interface ColumnMeta {
  /** Hidden below `lg`, where only the identifying and action columns fit. */
  secondary?: boolean;
  /** Hidden below `sm`; the row number adds nothing on a phone. */
  narrow?: boolean;
}

export interface DataExplorerTableProps {
  data: Pos[];
  isLoading?: boolean;
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  onPageChange: (newPage: number) => void;
  onPerPageChange?: (newPerPage: number) => void;
  selectedIds: number[];
  onSelectedIdsChange: (ids: number[]) => void;
  onResetFilter?: () => void;
  onRequestDownload: (pos: Pos) => void;
}

export function DataExplorerTable({
  data,
  isLoading = false,
  page,
  perPage,
  total,
  lastPage,
  onPageChange,
  onPerPageChange,
  selectedIds,
  onSelectedIdsChange,
  onResetFilter,
  onRequestDownload,
}: DataExplorerTableProps) {
  // Definisi Kolom TanStack Table
  const columns = useMemo<ColumnDef<Pos>[]>(
    () => [
      // 1. Kolom Checkbox Pemilihan Batch
      {
        id: "select",
        header: () => {
          const allCurrentPageSelected =
            data.length > 0 && data.every((item) => selectedIds.includes(item.id));
          const someCurrentPageSelected =
            data.some((item) => selectedIds.includes(item.id)) && !allCurrentPageSelected;

          return (
            <div className="flex items-center justify-center pl-2">
              <Checkbox
                checked={allCurrentPageSelected}
                indeterminate={someCurrentPageSelected}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  if (isChecked) {
                    // Tambahkan seluruh item di halaman ini ke selectedIds
                    const pageIds = data.map((d) => d.id);
                    const merged = Array.from(new Set([...selectedIds, ...pageIds]));
                    onSelectedIdsChange(merged);
                  } else {
                    // Hapus seluruh item di halaman ini dari selectedIds
                    const pageIdSet = new Set(data.map((d) => d.id));
                    onSelectedIdsChange(selectedIds.filter((id) => !pageIdSet.has(id)));
                  }
                }}
                aria-label="Pilih semua data di halaman ini"
              />
            </div>
          );
        },
        cell: ({ row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <div className="flex items-center justify-center pl-2">
              <Checkbox
                checked={isSelected}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    onSelectedIdsChange([...selectedIds, row.original.id]);
                  } else {
                    onSelectedIdsChange(selectedIds.filter((id) => id !== row.original.id));
                  }
                }}
                aria-label={`Pilih ${row.original.nama}`}
              />
            </div>
          );
        },
      },

      // 3. Kolom Nama Pos & Lokasi Administratif
      {
        id: "nama_lokasi",
        header: "Nama Pos & Lokasi",
        cell: ({ row }) => {
          const pos = row.original;
          const lokasiParts = [pos.desa, pos.kecamatan, pos.kabupaten, pos.provinsi]
            .filter(Boolean)
            .join(", ");

          return (
            <div className="min-w-0 max-w-[195px] space-y-1 lg:max-w-[260px]">
              <Link
                href={`/pos/${pos.id}`}
                className="line-clamp-1 font-semibold text-[#0B5CAD] hover:text-[#14396A] hover:underline"
                title={pos.nama}
              >
                {pos.nama}
              </Link>

              <div className="flex min-w-0 items-center gap-2 text-[12px]">
                <span className="font-mono text-[11px] text-[#5B6675]">{pos.kode_pos}</span>
                {pos.sungai && (
                  <span className="min-w-0 truncate text-[#5B6675]" title={pos.sungai}>
                    &middot; {pos.sungai}
                  </span>
                )}
              </div>

              {lokasiParts && (
                <div className="flex min-w-0 items-center gap-1 text-[11px] text-[#5B6675]" title={lokasiParts}>
                  <MapPin aria-hidden="true" className="h-3 w-3 shrink-0 text-[#AEB8C5]" />
                  <span className="min-w-0 truncate">{lokasiParts}</span>
                </div>
              )}
            </div>
          );
        },
      },

      // 4. Kolom Pilar, Jenis Sensor & Telemetri Terakhir
      {
        id: "pilar_sensor",
        header: "Pilar & Sensor",
        meta: { secondary: true },
        cell: ({ row }) => {
          const pos = row.original;
          const latest = pos.latest_pengukuran;
          const statusSiaga = latest?.status_siaga || "normal";

          // Only abnormal states are coloured; "normal" is the default and
          // needs no decoration.
          const siagaText =
            statusSiaga === "waspada"
              ? "text-[#6B4E00]"
              : statusSiaga === "siaga" || statusSiaga === "awas"
                ? "text-[#8B1A12]"
                : "text-[#5B6675]";

          return (
            <div className="min-w-[170px] space-y-1">
              <div className="text-[13px] text-[#1B2430]">{pos.jenis}</div>

              {latest ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[13px] font-semibold tabular-nums text-[#14396A]">
                    {latest.nilai !== null ? Number(latest.nilai).toFixed(2) : "—"}
                  </span>
                  <span className="text-[11px] text-[#5B6675]">{latest.satuan}</span>
                  {statusSiaga !== "normal" && (
                    <span className={`text-[11px] font-medium capitalize ${siagaText}`}>
                      {statusSiaga}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-[11px] italic text-[#8A96A6]">Belum ada telemetri</div>
              )}
            </div>
          );
        },
      },

      // 5. Kolom DAS & Wilayah Sungai
      {
        id: "das_ws",
        header: "DAS & Wilayah Sungai",
        meta: { secondary: true },
        cell: ({ row }) => {
          const pos = row.original;
          return (
            <div className="min-w-[150px] space-y-0.5">
              <div className="text-[13px] text-[#1B2430]">{pos.das || "—"}</div>
              {pos.sub_das && (
                <div className="text-[11px] text-[#5B6675] line-clamp-1" title={pos.sub_das}>
                  {pos.sub_das}
                </div>
              )}
              <div className="text-[11px] text-[#5B6675] line-clamp-1" title={pos.wilayah_sungai}>
                {pos.wilayah_sungai || "—"}
              </div>
            </div>
          );
        },
      },

      // 6. Kolom Walidata Pengelola
      {
        id: "walidata",
        header: "Walidata Pengelola",
        meta: { secondary: true },
        cell: ({ row }) => {
          const walidata = row.original.walidata;
          const singkatan = walidata?.singkatan || "SIH3";
          const namaLengkap = walidata?.nama || "Walidata Wilayah Sungai";

          return (
            <div className="min-w-[140px] space-y-0.5" title={namaLengkap}>
              <div className="text-[13px] font-medium text-[#1B2430]">{singkatan}</div>
              <div className="text-[11px] text-[#5B6675] line-clamp-1">{namaLengkap}</div>
            </div>
          );
        },
      },

      // 7. Kolom Status Alat
      {
        id: "status_alat",
        header: "Status Alat",
        meta: { secondary: true },
        cell: ({ row }) => {
          const status = (row.original.status_alat || "aktif").toLowerCase();
          const isAktif = status === "aktif";

          return (
            <div className="min-w-[100px] text-[13px]">
              {isAktif ? (
                <span className="text-[#5B6675]">Aktif</span>
              ) : (
                <span className="font-medium capitalize text-[#8B1A12]">{status}</span>
              )}
            </div>
          );
        },
      },

      // 8. Kolom Aksi (Unduh 1-Klik & Tautan Detail)
      {
        id: "aksi",
        header: () => <div className="text-right sm:pr-1">Aksi</div>,
        cell: ({ row }) => {
          const pos = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap sm:pr-1">
              <button
                type="button"
                onClick={() => onRequestDownload(pos)}
                className="inline-flex h-7 items-center gap-1 rounded-[6px] bg-[#14396A] px-2.5 text-[12px] font-semibold text-white hover:bg-[#0E2A4E]"
                title={`Pilih periode dan unduh data ${pos.nama}`}
              >
                <Download aria-hidden="true" className="h-3 w-3" />
                Unduh
              </button>

              {/* The pos name is already a link to the same page; on a phone
                  this button only pushes itself off-screen. */}
              <Link
                href={`/pos/${pos.id}`}
                className="hidden h-7 items-center rounded-[6px] border border-[#AEB8C5] bg-white px-2.5 text-[12px] font-medium text-[#1B2430] hover:bg-[#F0F3F7] sm:inline-flex"
                title={`Lihat detail dan grafik tren ${pos.nama}`}
              >
                Detail
              </Link>
            </div>
          );
        },
      },
    ],
    [data, selectedIds, onSelectedIdsChange, onRequestDownload]
  );

  // Inisialisasi TanStack Table
  const table = useTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Perhitungan Range Data Tampil
  const from = total > 0 ? (page - 1) * perPage + 1 : 0;
  const to = Math.min(page * perPage, total);

  return (
    <div className="space-y-4">
      {/* 1. Kontainer Tabel */}
      <div className="overflow-hidden rounded-[8px] border border-[#D5DBE3] bg-white">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-[#D5DBE3] bg-[#F5F7FA]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#5B6675] ${
                        (header.column.columnDef.meta as ColumnMeta | undefined)?.secondary
                          ? "hidden lg:table-cell"
                          : (header.column.columnDef.meta as ColumnMeta | undefined)?.narrow
                            ? "hidden sm:table-cell"
                            : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {/* State 1: Skeleton Loader saat fetching data */}
              {isLoading ? (
                Array.from({ length: 6 }).map((_, rIdx) => (
                  <TableRow key={rIdx} className="border-b border-[#E4E8EE]">
                    <TableCell className="p-3 text-center">
                      <Skeleton className="h-4 w-4 mx-auto rounded" />
                    </TableCell>
                    <TableCell className="p-3 space-y-2">
                      <Skeleton className="h-4 w-44 rounded" />
                      <Skeleton className="h-3 w-28 rounded" />
                    </TableCell>
                    <TableCell className="p-3 space-y-1.5">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </TableCell>
                    <TableCell className="p-3 space-y-1">
                      <Skeleton className="h-4 w-28 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </TableCell>
                    <TableCell className="p-3 space-y-1">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-3 w-32 rounded" />
                    </TableCell>
                    <TableCell className="p-3">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="p-3 text-right">
                      <Skeleton className="h-8 w-20 ml-auto rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                // State 2: Data Tersedia
                table.getRowModel().rows.map((row) => {
                  const isSelected = selectedIds.includes(row.original.id);
                  return (
                    <TableRow
                      key={row.id}
                      data-state={isSelected ? "selected" : undefined}
                      className={`border-b border-[#E4E8EE] transition-colors last:border-b-0 ${
                        isSelected ? "bg-[#FEF6D8]" : "hover:bg-[#FAFBFC]"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`px-2 py-3 align-middle sm:px-3 ${
                            (cell.column.columnDef.meta as ColumnMeta | undefined)?.secondary
                              ? "hidden lg:table-cell"
                              : (cell.column.columnDef.meta as ColumnMeta | undefined)?.narrow
                                ? "hidden sm:table-cell"
                                : ""
                          }`}
                        >
                          {typeof cell.column.columnDef.cell === "function"
                            ? cell.column.columnDef.cell(cell.getContext())
                            : (cell.getValue() as React.ReactNode)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                // State 3: Empty State jika pencarian/filter nihil
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center p-8">
                    <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-3">
                      <SearchX aria-hidden="true" className="h-7 w-7 text-[#AEB8C5]" />
                      <div className="space-y-1">
                        <h3 className="text-[15px] font-semibold text-[#1B2430]">
                          Tidak ada pos yang cocok
                        </h3>
                        <p className="text-[13px] leading-relaxed text-[#5B6675]">
                          Coba ubah kata kunci atau hapus sebagian filter.
                        </p>
                      </div>
                      {onResetFilter && (
                        <button
                          type="button"
                          onClick={onResetFilter}
                          className="mt-1 inline-flex h-8 items-center rounded-[6px] border border-[#AEB8C5] bg-white px-3 text-[12px] font-medium text-[#1B2430] hover:bg-[#F0F3F7]"
                        >
                          Reset filter
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 2. Paginasi & Total Data Row */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        {/* Info Total dan Range Baris */}
        <div className="flex items-center gap-3 text-[13px] text-[#5B6675]">
          <span>
            Menampilkan{" "}
            <strong className="font-semibold text-[#1B2430]">{from}</strong>–
            <strong className="font-semibold text-[#1B2430]">{to}</strong> dari{" "}
            <strong className="font-semibold text-[#1B2430]">{total}</strong> pos
          </span>

          {onPerPageChange && (
            <div className="flex items-center gap-1.5 border-l border-[#E4E8EE] pl-3">
              <span>Per halaman</span>
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(Number(e.target.value))}
                className="h-7 rounded-[6px] border border-[#AEB8C5] bg-white px-1.5 text-[12px] text-[#1B2430] focus:border-[#0B5CAD] focus:outline-none"
                aria-label="Pilih jumlah data per halaman"
              >
                {[10, 15, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tombol Paginasi (Prev / Next & Page indicator) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1 || isLoading}
            className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-[#AEB8C5] bg-white px-2.5 text-[12px] font-medium text-[#1B2430] hover:bg-[#F0F3F7] disabled:opacity-40"
          >
            <ChevronLeft aria-hidden="true" className="h-3 w-3" />
            Sebelumnya
          </button>

          <span className="text-[12px] text-[#5B6675]">
            Halaman {page} dari {Math.max(1, lastPage)}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(lastPage, page + 1))}
            disabled={page >= lastPage || isLoading}
            className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-[#AEB8C5] bg-white px-2.5 text-[12px] font-medium text-[#1B2430] hover:bg-[#F0F3F7] disabled:opacity-40"
          >
            Berikutnya
            <ChevronRight aria-hidden="true" className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataExplorerTable;
