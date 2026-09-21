import { Suspense } from "react";
import type { Metadata } from "next";
import PosDetailClient from "./PosDetailClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosDetail } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Metadata SEO dinamis berdasarkan stasiun pos yang dibuka
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const pos = await getPosDetail(id);
    if (pos) {
      return {
        title: `${pos.nama} (${pos.kode_pos}) - Detail Pos & Tren Pengukuran`,
        description: `Metadata lokasi administratif, hidrologis, koordinat geodetik, instansi walidata, dan grafik tren pengukuran stasiun ${pos.nama} (${pos.kode_pos}) pada portal satu data SIH3.`,
      };
    }
  } catch (error) {
    console.warn(`[generateMetadata] Gagal memuat pos #${id}:`, error);
  }

  return {
    title: `Detail Stasiun Pos #${id} - SIH3 Serayu Opak`,
    description: "Detail metadata stasiun pos pemantauan dan visualisasi tren pengukuran deret waktu portal satu data SIH3.",
  };
}

/**
 * Halaman Detail Pos Pemantauan (/pos/[id])
 * Menangani dynamic route parameter params: Promise<{ id: string }> (Next.js 15/16 App Router)
 */
export default async function PosDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50/70 pb-20">
          <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-4">
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-8 w-96 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      }
    >
      <PosDetailClient id={id} />
    </Suspense>
  );
}
