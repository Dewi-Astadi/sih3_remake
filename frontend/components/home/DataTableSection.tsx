import Link from "next/link";
import { ArrowUpDown, ChevronDown, ChevronUp, Download } from "lucide-react";

import { StatusBadge } from "@/components/home/StatusBadge";
import { describeTimestamp } from "@/lib/datetime";
import { formatNilai, locationDetail, locationLine } from "@/lib/display";
import type { PosRow } from "@/lib/homepage-data";
import { TIPE_LABEL, TIPE_ORDER } from "@/lib/homepage-data";
import {
  ariaSortFor,
  buildSortHref,
  buildTableHref,
  TABLE_PAGE_SIZE,
  type PageWindow,
  type SortKey,
  type TableQuery,
} from "@/lib/homepage-query";
import { JENIS_META, type JenisKey } from "@/lib/jenis";

export interface WalidataOption {
  id: number;
  nama: string;
}

export interface StatusOption {
  label: string;
  count: number;
}

function SortHeader({
  query,
  column,
  children,
  className,
}: {
  query: TableQuery;
  column: SortKey;
  children: React.ReactNode;
  className?: string;
}) {
  const ariaSort = ariaSortFor(query, column);
  const active = ariaSort !== "none";
  const Icon = !active ? ArrowUpDown : ariaSort === "ascending" ? ChevronUp : ChevronDown;

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`px-2 py-2 text-left font-semibold ${className ?? ""}`}
    >
      <Link
        href={buildSortHref(query, column)}
        className="inline-flex items-center gap-1 whitespace-nowrap hover:text-link hover:underline"
      >
        {children}
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="sr-only">
          {active
            ? `, urutkan ${ariaSort === "ascending" ? "menurun" : "menaik"}`
            : ", urutkan menaik"}
        </span>
      </Link>
    </th>
  );
}

function NilaiCell({ row }: { row: PosRow }) {
  const nilai = formatNilai(row.latest?.nilai, row.latest?.satuan, row.jenisKey);

  return (
    <div>
      <span className="font-medium">{nilai.value}</span>
      {nilai.unit ? <span className="ml-1">{nilai.unit}</span> : null}
      <span className="mt-0.5 block text-[12px] text-ink-muted">{nilai.label}</span>
    </div>
  );
}

function WaktuCell({ row, now }: { row: PosRow; now: Date }) {
  const time = describeTimestamp(row.latest?.recorded_at, now);

  if (!time.text) return <span className="text-ink-muted">—</span>;

  return (
    <div>
      <time dateTime={time.iso ?? undefined} className="whitespace-nowrap">
        {time.text}
      </time>
      {time.stale ? (
        <span className="mt-0.5 block text-[12px] text-ink-muted">
          Data belum diperbarui &middot; {time.ageText}
        </span>
      ) : null}
    </div>
  );
}

/**
 * S4 — Data terkini.
 *
 * Filters, sorting and pagination are plain GET links, so the table works
 * without JavaScript and every view can be shared as a URL.
 */
export function DataTableSection({
  window,
  query,
  jenisOptions,
  walidataOptions,
  statusOptions,
  now,
}: {
  window: PageWindow;
  query: TableQuery;
  jenisOptions: JenisKey[];
  walidataOptions: WalidataOption[];
  statusOptions: StatusOption[];
  now: Date;
}) {
  const activeFilters = Boolean(
    query.q || query.tipe || query.jenis || query.walidata || query.status
  );

  return (
    <section aria-labelledby="data-terkini-title" id="data-terkini" className="border-b border-hairline py-8">
      <div className="mx-auto w-full max-w-site px-4 sm:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="data-terkini-title" className="text-xl font-semibold text-ink">
              Data terkini
            </h2>
            <p className="mt-1 text-[13px] text-ink-muted">
              Nilai dan status dihitung dari pengukuran terakhir setiap pos.
            </p>
          </div>
          <p className="text-[13px] text-ink-muted" role="status">
            {window.total === 0
              ? "Tidak ada pos yang cocok"
              : `Menampilkan ${window.from}–${window.to} dari ${window.total} pos`}
          </p>
        </div>

        <form
          method="get"
          action="/"
          className="mb-4 grid grid-cols-1 gap-3 border border-hairline bg-surface p-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="filter-q" className="block text-[12px] font-medium text-ink">
              Cari
            </label>
            <input
              id="filter-q"
              name="q"
              type="search"
              defaultValue={query.q}
              placeholder="Nama pos, sungai, DAS, kabupaten"
              className="mt-1 h-10 w-full border border-hairline bg-surface px-2 text-sm text-ink placeholder:text-ink-muted"
            />
          </div>

          <div>
            <label htmlFor="filter-bidang" className="block text-[12px] font-medium text-ink">
              Bidang
            </label>
            <select
              id="filter-bidang"
              name="tipe"
              defaultValue={query.tipe}
              className="mt-1 h-10 w-full border border-hairline bg-surface px-2 text-sm text-ink"
            >
              <option value="">Semua bidang</option>
              {TIPE_ORDER.map((tipe) => (
                <option key={tipe} value={tipe}>
                  {TIPE_LABEL[tipe]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-jenis" className="block text-[12px] font-medium text-ink">
              Jenis pos
            </label>
            <select
              id="filter-jenis"
              name="jenis"
              defaultValue={query.jenis}
              className="mt-1 h-10 w-full border border-hairline bg-surface px-2 text-sm text-ink"
            >
              <option value="">Semua jenis</option>
              {jenisOptions.map((key) => (
                <option key={key} value={key}>
                  {JENIS_META[key].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-walidata" className="block text-[12px] font-medium text-ink">
              Walidata
            </label>
            <select
              id="filter-walidata"
              name="walidata"
              defaultValue={query.walidata}
              className="mt-1 h-10 w-full border border-hairline bg-surface px-2 text-sm text-ink"
            >
              <option value="">Semua walidata</option>
              {walidataOptions.map((option) => (
                <option key={option.id} value={String(option.id)}>
                  {option.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-status" className="block text-[12px] font-medium text-ink">
              Status
            </label>
            <select
              id="filter-status"
              name="status"
              defaultValue={query.status}
              className="mt-1 h-10 w-full border border-hairline bg-surface px-2 text-sm text-ink"
            >
              <option value="">Semua status</option>
              <option value="peringatan">Semua status peringatan</option>
              {statusOptions.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-5">
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Terapkan filter
            </button>
            {activeFilters ? (
              <Link
                href="/#data-terkini"
                className="inline-flex h-10 items-center justify-center border border-hairline px-4 text-sm font-medium text-ink hover:bg-table-head"
              >
                Hapus filter
              </Link>
            ) : null}
          </div>
        </form>

        {window.total === 0 ? (
          <p className="border border-hairline bg-surface p-4 text-sm text-ink-muted">
            Tidak ada pos pemantauan yang cocok dengan filter yang dipilih.
          </p>
        ) : (
          <>
            {/* Table, 768px and wider */}
            <div className="relative hidden overflow-x-auto border border-hairline bg-surface md:block">
              <table className="w-full min-w-[1080px] table-fixed border-collapse text-[14px]">
                <colgroup>
                  <col className="w-[16%]" />
                  <col className="w-[9%]" />
                  <col className="w-[13%]" />
                  <col className="w-[9%]" />
                  <col className="w-[11%]" />
                  <col className="w-[12%]" />
                  <col className="w-[14%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                </colgroup>
                <caption className="sr-only">
                  Data terkini pos pemantauan SIH3, {window.from} sampai {window.to} dari{" "}
                  {window.total} pos, {TABLE_PAGE_SIZE} pos per halaman
                </caption>
                <thead className="bg-table-head">
                  <tr>
                    <SortHeader query={query} column="nama">
                      Nama pos
                    </SortHeader>
                    <th scope="col" className="px-2 py-2 text-left font-semibold">
                      Jenis
                    </th>
                    <th scope="col" className="px-2 py-2 text-left font-semibold">
                      Sungai/DAS
                    </th>
                    <th scope="col" className="px-2 py-2 text-left font-semibold">
                      Kabupaten
                    </th>
                    <th scope="col" className="px-2 py-2 text-left font-semibold">
                      Nilai terakhir
                    </th>
                    <SortHeader query={query} column="status">
                      Status
                    </SortHeader>
                    <SortHeader query={query} column="waktu">
                      Waktu pengukuran
                    </SortHeader>
                    <th scope="col" className="px-2 py-2 text-left font-semibold">
                      Walidata
                    </th>
                    <th scope="col" className="px-2 py-2 text-left font-semibold whitespace-nowrap">
                      Unduh CSV
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {window.rows.map((row) => (
                    <tr key={row.id} className="border-t border-hairline align-top">
                      <th scope="row" className="px-2 py-2 text-left font-medium">
                        <Link href={`/pos/${row.id}`} className="text-link hover:underline">
                          {row.nama}
                        </Link>
                        <span className="mt-0.5 block text-[12px] font-normal text-ink-muted">
                          {row.kode_pos}
                        </span>
                      </th>
                      <td className="px-2 py-2">
                        {row.jenisMeta?.label ?? row.jenis}
                      </td>
                      <td className="px-2 py-2">{locationLine(row)}</td>
                      <td className="px-2 py-2">{row.kabupaten ?? "—"}</td>
                      <td className="px-2 py-2">
                        <NilaiCell row={row} />
                      </td>
                      <td className="px-2 py-2">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-2 py-2">
                        <WaktuCell row={row} now={now} />
                      </td>
                      <td className="px-2 py-2">{row.walidata?.singkatan ?? "—"}</td>
                      <td className="px-2 py-2">
                        <a
                          href={`/api/export/pos/${row.id}`}
                          className="inline-flex items-center gap-1 text-link hover:underline"
                          download
                          aria-label={`Unduh CSV ${row.nama}`}
                        >
                          <Download aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                          CSV
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stacked blocks below 768px */}
            <ul className="space-y-2 md:hidden">
              {window.rows.map((row) => (
                <li key={row.id} className="border border-hairline bg-surface p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/pos/${row.id}`} className="font-medium text-link hover:underline">
                        {row.nama}
                      </Link>
                      <p className="text-[12px] text-ink-muted">
                        {row.kode_pos} &middot; {row.jenisMeta?.label ?? row.jenis}
                      </p>
                    </div>
                    <StatusBadge status={row.status} />
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[13px]">
                    <div>
                      <dt className="text-[12px] text-ink-muted">Nilai terakhir</dt>
                      <dd>
                        <NilaiCell row={row} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[12px] text-ink-muted">Waktu pengukuran</dt>
                      <dd>
                        <WaktuCell row={row} now={now} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[12px] text-ink-muted">Sungai/DAS</dt>
                      <dd>{locationLine(row)}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] text-ink-muted">Kabupaten</dt>
                      <dd>{row.kabupaten ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] text-ink-muted">Walidata</dt>
                      <dd>{row.walidata?.singkatan ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] text-ink-muted">Lokasi</dt>
                      <dd>{locationDetail(row)}</dd>
                    </div>
                  </dl>

                  <a
                    href={`/api/export/pos/${row.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-[13px] text-link hover:underline"
                    download
                  >
                    <Download aria-hidden="true" className="h-3.5 w-3.5" />
                    Unduh CSV
                    <span className="sr-only"> untuk {row.nama}</span>
                  </a>
                </li>
              ))}
            </ul>

            {window.lastPage > 1 ? (
              <nav aria-label="Navigasi halaman data" className="mt-4 flex items-center gap-2">
                {window.page > 1 ? (
                  <Link
                    href={buildTableHref(query, { page: window.page - 1 })}
                    className="inline-flex h-9 items-center border border-hairline bg-surface px-3 text-sm text-ink hover:bg-table-head"
                  >
                    Sebelumnya
                  </Link>
                ) : null}

                <p className="text-[13px] text-ink-muted">
                  Halaman {window.page} dari {window.lastPage}
                </p>

                {window.page < window.lastPage ? (
                  <Link
                    href={buildTableHref(query, { page: window.page + 1 })}
                    className="inline-flex h-9 items-center border border-hairline bg-surface px-3 text-sm text-ink hover:bg-table-head"
                  >
                    Berikutnya
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export default DataTableSection;
