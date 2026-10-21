import Link from "next/link";

import { StatusBadge } from "@/components/home/StatusBadge";
import { formatNilai, locationLine } from "@/lib/display";
import type { PosRow } from "@/lib/homepage-data";
import { TIPE_LABEL } from "@/lib/homepage-data";
import { describeTimestamp } from "@/lib/datetime";

/**
 * S3 — pos in the alert set, capped at 10 rows, with an explicit empty state.
 */
export function AlertTable({ rows, now }: { rows: PosRow[]; now: Date }) {
  const shown = rows.slice(0, 10);

  return (
    <section aria-labelledby="peringatan-title" className="border-b border-hairline py-8">
      <div className="mx-auto w-full max-w-site px-4 sm:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h2 id="peringatan-title" className="text-xl font-semibold text-ink">
            Pos dengan status peringatan
          </h2>
          {rows.length > 0 ? (
            <Link
              href="/?status=peringatan#data-terkini"
              className="text-sm font-medium text-link hover:underline"
            >
              Lihat semua
            </Link>
          ) : null}
        </div>

        {shown.length === 0 ? (
          <p className="border border-hairline bg-surface p-4 text-sm text-ink-muted">
            Tidak ada pos berstatus peringatan pada pembaruan terakhir.
          </p>
        ) : (
          <>
            <div className="relative hidden overflow-x-auto border border-hairline bg-surface md:block">
              <table className="w-full min-w-[720px] border-collapse text-[14px]">
                <caption className="sr-only">
                  Pos pemantauan berstatus peringatan, maksimal 10 baris
                </caption>
                <thead className="bg-table-head text-left">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Nama pos
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Bidang
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Lokasi
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Nilai terakhir
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Waktu pengukuran
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((row) => {
                    const nilai = formatNilai(
                      row.latest?.nilai,
                      row.latest?.satuan,
                      row.jenisKey
                    );
                    const time = describeTimestamp(row.latest?.recorded_at, now);

                    return (
                      <tr key={row.id} className="border-t border-hairline align-top">
                        <th scope="row" className="px-3 py-2 text-left font-medium">
                          <Link href={`/pos/${row.id}`} className="text-link hover:underline">
                            {row.nama}
                          </Link>
                          <span className="mt-0.5 block text-[12px] font-normal text-ink-muted">
                            {row.kode_pos}
                          </span>
                        </th>
                        <td className="px-3 py-2">{TIPE_LABEL[row.tipe]}</td>
                        <td className="px-3 py-2">{locationLine(row)}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="font-medium">{nilai.value}</span>
                          {nilai.unit ? <span className="ml-1">{nilai.unit}</span> : null}
                          <span className="mt-0.5 block text-[12px] text-ink-muted">
                            {nilai.label}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-3 py-2">
                          {time.text ? (
                            <>
                              <time dateTime={time.iso ?? undefined}>{time.text}</time>
                              {time.stale ? (
                                <span className="mt-0.5 block text-[12px] text-ink-muted">
                                  Data belum diperbarui &middot; {time.ageText}
                                </span>
                              ) : null}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Stacked blocks below 768px */}
            <ul className="space-y-2 md:hidden">
              {shown.map((row) => {
                const nilai = formatNilai(
                  row.latest?.nilai,
                  row.latest?.satuan,
                  row.jenisKey
                );
                const time = describeTimestamp(row.latest?.recorded_at, now);

                return (
                  <li key={row.id} className="border border-hairline bg-surface p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/pos/${row.id}`}
                          className="font-medium text-link hover:underline"
                        >
                          {row.nama}
                        </Link>
                        <p className="text-[12px] text-ink-muted">
                          {row.kode_pos} &middot; {TIPE_LABEL[row.tipe]}
                        </p>
                      </div>
                      <StatusBadge status={row.status} />
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[13px]">
                      <div>
                        <dt className="text-[12px] text-ink-muted">Nilai terakhir</dt>
                        <dd>
                          <span className="font-medium">{nilai.value}</span>
                          {nilai.unit ? <span className="ml-1">{nilai.unit}</span> : null}
                          <span className="mt-0.5 block text-[12px] text-ink-muted">
                            {nilai.label}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[12px] text-ink-muted">Waktu pengukuran</dt>
                        <dd>
                          {time.text ? (
                            <>
                              <time dateTime={time.iso ?? undefined} className="whitespace-nowrap">
                                {time.text}
                              </time>
                              {time.stale ? (
                                <span className="mt-0.5 block text-[12px] text-ink-muted">
                                  Data belum diperbarui &middot; {time.ageText}
                                </span>
                              ) : null}
                            </>
                          ) : (
                            "—"
                          )}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-[12px] text-ink-muted">Lokasi</dt>
                        <dd>{locationLine(row)}</dd>
                      </div>
                    </dl>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-[12px] text-ink-muted">
              Menampilkan {shown.length} dari {rows.length} pos berstatus peringatan.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export default AlertTable;
