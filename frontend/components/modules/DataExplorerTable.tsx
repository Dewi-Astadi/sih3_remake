"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Download,
  FileSpreadsheet,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SearchX,
  Radio,
  MapPin,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Pos } from "@/lib/types";
import { getExportUrl } from "@/lib/api";

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
}: DataExplorerTableProps) {
  // Handler untuk download 1-klik
  const handleDownload = (pos: Pos, format: "xlsx" | "csv") => {
    toast.info(`Mengunduh data ${pos.nama} (${format.toUpperCase()})...`);
    const downloadUrl = getExportUrl(pos.id, format);

    // Memicu unduhan di browser
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `${pos.kode_pos}_data.${format}`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      // 2. Kolom Nomor Urut
      {
        id: "no",
        header: () => <div className="text-center w-8">No</div>,
        cell: ({ row }) => (
          <div className="text-center font-mono text-xs text-slate-500 w-8">
            {(page - 1) * perPage + row.index + 1}
          </div>
        ),
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
            <div className="space-y-1 min-w-[220px]">
              <div className="flex items-center gap-2">
                <Link
                  href={`/pos/${pos.id}`}
                  className="font-bold text-slate-900 hover:text-amber-600 transition-colors line-clamp-1 group flex items-center gap-1.5"
                  title={pos.nama}
                >
                  <span>{pos.nama}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200/80">
                  {pos.kode_pos}
                </span>
                {pos.sungai && (
                  <span className="text-slate-500 truncate max-w-[140px]" title={pos.sungai}>
                    • {pos.sungai}
                  </span>
                )}
              </div>

              {lokasiParts && (
                <div className="flex items-center gap-1 text-[11px] text-slate-500 line-clamp-1" title={lokasiParts}>
                  <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                  <span>{lokasiParts}</span>
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
        cell: ({ row }) => {
          const pos = row.original;
          const tipe = (pos.tipe || "").toLowerCase();

          // Pilar Badge Styling
          let pilarBadgeColor = "bg-slate-100 text-slate-800 border-slate-200";
          if (tipe === "hidrologi") {
            pilarBadgeColor = "bg-sky-50 text-sky-800 border-sky-200";
          } else if (tipe === "hidrometeorologi") {
            pilarBadgeColor = "bg-blue-50 text-blue-800 border-blue-200";
          } else if (tipe === "hidrogeologi") {
            pilarBadgeColor = "bg-indigo-50 text-indigo-800 border-indigo-200";
          }

          const latest = pos.latest_pengukuran;
          const statusSiaga = latest?.status_siaga || "normal";

          let siagaBg = "text-emerald-700 bg-emerald-50 border-emerald-200";
          if (statusSiaga === "waspada") {
            siagaBg = "text-amber-700 bg-amber-50 border-amber-300";
          } else if (statusSiaga === "siaga" || statusSiaga === "awas") {
            siagaBg = "text-rose-700 bg-rose-50 border-rose-300";
          }

          return (
            <div className="space-y-1.5 min-w-[170px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${pilarBadgeColor} capitalize`}
                >
                  {pos.tipe}
                </span>
                <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {pos.jenis}
                </span>
              </div>

              {/* Data Pengukuran Terakhir */}
              {latest ? (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-slate-900 font-mono">
                    {latest.nilai !== null ? Number(latest.nilai).toFixed(2) : "-"} {latest.satuan}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border capitalize ${siagaBg}`}
                  >
                    {statusSiaga}
                  </span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">Belum ada telemetri</div>
              )}
            </div>
          );
        },
      },

      // 5. Kolom DAS & Wilayah Sungai
      {
        id: "das_ws",
        header: "DAS & Wilayah Sungai",
        cell: ({ row }) => {
          const pos = row.original;
          return (
            <div className="space-y-0.5 min-w-[150px]">
              <div className="text-xs font-bold text-slate-800">{pos.das || "-"}</div>
              {pos.sub_das && (
                <div className="text-[11px] text-slate-500 line-clamp-1" title={pos.sub_das}>
                  Sub: {pos.sub_das}
                </div>
              )}
              <div className="text-[11px] text-slate-500 line-clamp-1" title={pos.wilayah_sungai}>
                {pos.wilayah_sungai || "WS Serayu Opak"}
              </div>
            </div>
          );
        },
      },

      // 6. Kolom Walidata Pengelola
      {
        id: "walidata",
        header: "Walidata Pengelola",
        cell: ({ row }) => {
          const walidata = row.original.walidata;
          const singkatan = walidata?.singkatan || "SIH3";
          const namaLengkap = walidata?.nama || "Walidata Wilayah Sungai";

          return (
            <div className="space-y-0.5 min-w-[140px]" title={namaLengkap}>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200">
                <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                <span>{singkatan}</span>
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">{namaLengkap}</div>
            </div>
          );
        },
      },

      // 7. Kolom Status Alat
      {
        id: "status_alat",
        header: "Status Alat",
        cell: ({ row }) => {
          const status = (row.original.status_alat || "aktif").toLowerCase();
          const isAktif = status === "aktif";

          return (
            <div className="min-w-[100px]">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  isAktif
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAktif ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                <span className="capitalize">{status}</span>
              </span>
            </div>
          );
        },
      },

      // 8. Kolom Aksi (Unduh 1-Klik & Tautan Detail)
      {
        id: "aksi",
        header: () => <div className="text-right pr-2">Aksi</div>,
        cell: ({ row }) => {
          const pos = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5 pr-2">
              {/* Dropdown Menu Unduh 1-Klik */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 bg-white hover:bg-slate-50 border-slate-300/90 text-slate-800 font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                    title={`Unduh data ${pos.nama}`}
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>Unduh</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48 shadow-xl">
                  <DropdownMenuLabel className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Pilih Format Berkas
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => handleDownload(pos, "xlsx")}
                    className="flex items-center gap-2 text-xs font-medium text-slate-800 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Unduh Excel (.xlsx)</span>
                      <span className="text-[10px] text-slate-400">Format tabel terformat</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleDownload(pos, "csv")}
                    className="flex items-center gap-2 text-xs font-medium text-slate-800 hover:text-sky-700 hover:bg-sky-50 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Unduh CSV (.csv)</span>
                      <span className="text-[10px] text-slate-400">Siap olah data science</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Tautan Detail Pos */}
              <Link
                href={`/pos/${pos.id}`}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title={`Lihat detail dan grafik tren ${pos.nama}`}
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          );
        },
      },
    ],
    [data, selectedIds, page, perPage, onSelectedIdsChange]
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
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/90 border-b border-slate-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-3 px-3 text-xs font-bold text-slate-700 uppercase tracking-wider"
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
                  <TableRow key={rIdx} className="border-b border-slate-100">
                    <TableCell className="p-3 text-center">
                      <Skeleton className="h-4 w-4 mx-auto rounded" />
                    </TableCell>
                    <TableCell className="p-3 text-center">
                      <Skeleton className="h-4 w-6 mx-auto rounded" />
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
                      className={`border-b border-slate-100 transition-colors ${
                        isSelected
                          ? "bg-amber-50/60 hover:bg-amber-100/50"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 px-3 align-middle">
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
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <SearchX className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">
                          Data Pos Tidak Ditemukan
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Tidak ada pos pemantauan yang cocok dengan filter atau kata kunci yang Anda
                          masukkan.
                        </p>
                      </div>
                      {onResetFilter && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onResetFilter}
                          className="mt-2 text-xs font-semibold rounded-xl border-slate-300"
                        >
                          Reset Semua Filter
                        </Button>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        {/* Info Total dan Range Baris */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span>
            Menampilkan <strong className="text-slate-900 font-bold">{from}</strong> -{" "}
            <strong className="text-slate-900 font-bold">{to}</strong> dari{" "}
            <strong className="text-slate-900 font-bold">{total}</strong> total stasiun
          </span>

          {onPerPageChange && (
            <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200">
              <span className="text-slate-500">Per halaman:</span>
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(Number(e.target.value))}
                className="py-1 px-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900"
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
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1 || isLoading}
            className="h-8 px-2.5 text-xs font-semibold rounded-lg border-slate-300 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            <span>Sebelumnya</span>
          </Button>

          <div className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-800">
            Halaman {page} dari {Math.max(1, lastPage)}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(lastPage, page + 1))}
            disabled={page >= lastPage || isLoading}
            className="h-8 px-2.5 text-xs font-semibold rounded-lg border-slate-300 disabled:opacity-40 cursor-pointer"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataExplorerTable;
