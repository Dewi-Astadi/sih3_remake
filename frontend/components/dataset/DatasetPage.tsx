import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { DatasetFilters } from "@/components/dataset/DatasetFilters";
import { DatasetHero } from "@/components/dataset/DatasetHero";
import { DatasetTable } from "@/components/dataset/DatasetTable";
import { DATASET_PAGES, parseDatasetQuery, datasetHref } from "@/lib/dataset";
import { getDatasetPage } from "@/lib/dataset-data";
import type { TipeKey } from "@/lib/homepage-data";

/**
 * Shared layout for the three field pages (/hidrologi, /hidrometeorologi,
 * /hidrogeologi). Filters live in the query string, so every view is linkable.
 */
export async function DatasetPage({
  tipe,
  searchParams,
}: {
  tipe: TipeKey;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const config = DATASET_PAGES[tipe];
  const query = parseDatasetQuery(searchParams);
  const result = await getDatasetPage(tipe, config.jenis, query);

  const startIndex =
    result.ok && result.data.rows.length > 0
      ? (result.data.page - 1) * result.data.perPage + 1
      : 1;

  return (
    <>
      <DatasetHero
        kicker={config.kicker}
        title={config.title}
        description={config.description}
      />

      <section className="py-8 sm:py-10">
        <Container>
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-[12px] font-medium text-[#5B6675]"
          >
            <Link href="/" className="hover:text-[#0B5CAD]">
              Beranda
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#AEB8C5]" />
            <span className="text-[#1B2430]">{config.title}</span>
          </nav>

          {/* Section heading */}
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B5CAD]">
                Dataset
              </p>
              <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.01em] text-[#1B2430] sm:text-[26px]">
                {config.tableTitle}
              </h2>
              <p className="mt-1 text-[13px] text-[#5B6675]">
                Klik nama pos untuk melihat detail, atau tombol arsip untuk
                melihat ketersediaan data.
              </p>
            </div>

            {result.ok && (
              <span className="inline-flex h-8 items-center rounded-full border border-[#D5DBE3] bg-white px-3 text-[13px] text-[#5B6675]">
                Menampilkan{" "}
                <strong className="mx-1 font-semibold text-[#1B2430]">
                  {result.data.total}
                </strong>{" "}
                pos
              </span>
            )}
          </div>

          {result.ok ? (
            <>
              <DatasetFilters
                tipe={tipe}
                jenisKeys={config.jenis}
                query={query}
                counts={result.data.counts}
              />

              <div className="mt-4">
                <DatasetTable rows={result.data.rows} startIndex={startIndex} />
              </div>

              {result.data.lastPage > 1 && (
                <nav
                  aria-label="Navigasi halaman"
                  className="mt-5 flex items-center justify-between gap-3 text-[13px]"
                >
                  <span className="text-[#5B6675]">
                    Halaman {result.data.page} dari {result.data.lastPage}
                  </span>
                  <div className="flex items-center gap-2">
                    {result.data.page > 1 && (
                      <Link
                        href={datasetHref(tipe, query, { page: result.data.page - 1 })}
                        rel="prev"
                        className="inline-flex h-8 items-center rounded-[6px] border border-[#AEB8C5] bg-white px-3 font-medium text-[#1B2430] hover:bg-[#F0F3F7]"
                      >
                        Sebelumnya
                      </Link>
                    )}
                    {result.data.page < result.data.lastPage && (
                      <Link
                        href={datasetHref(tipe, query, { page: result.data.page + 1 })}
                        rel="next"
                        className="inline-flex h-8 items-center rounded-[6px] border border-[#14396A] bg-[#14396A] px-3 font-semibold text-white hover:bg-[#0E2A4E]"
                      >
                        Berikutnya
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </>
          ) : (
            <div
              role="alert"
              className="rounded-[8px] border border-[#E88B84] bg-[#FBE3E1] p-5 text-[14px] text-[#8B1A12]"
            >
              <p className="font-semibold">Data tidak dapat dimuat</p>
              <p className="mt-1.5">{result.error}</p>
              <p className="mt-2 text-[13px]">
                Data yang gagal dimuat tidak diganti dengan angka perkiraan.
                Silakan muat ulang halaman beberapa saat lagi.
              </p>
            </div>
          )}

          {/* Cross-links to the other fields */}
          <div className="mt-8 border-t border-[#D5DBE3] pt-5">
            <p className="text-[13px] font-semibold text-[#1B2430]">
              Bidang data lainnya
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(DATASET_PAGES) as TipeKey[])
                .filter((key) => key !== tipe)
                .map((key) => (
                  <Link
                    key={key}
                    href={`/${key}`}
                    className="inline-flex h-8 items-center rounded-full border border-[#AEB8C5] bg-white px-3 text-[13px] font-medium text-[#1B2430] hover:border-[#14396A] hover:text-[#14396A]"
                  >
                    {DATASET_PAGES[key].title}
                  </Link>
                ))}
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

/** Shared metadata for the three field pages. */
export function datasetMetadata(tipe: TipeKey) {
  const config = DATASET_PAGES[tipe];
  return {
    title: config.title,
    description: `${config.tableTitle} pada portal SIH3 Wilayah Sungai Serayu Opak: ${config.description}`,
    alternates: { canonical: `/${tipe}` },
  };
}

export default DatasetPage;
