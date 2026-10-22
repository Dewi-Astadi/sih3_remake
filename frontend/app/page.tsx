import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { DownloadCtaSection } from "@/components/home/DownloadCtaSection";
import { FieldsSection } from "@/components/home/FieldsSection";
import { Hero } from "@/components/home/Hero";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import { MonitoringSection } from "@/components/home/MonitoringSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { SummaryBlocks } from "@/components/home/SummaryBlocks";
import { WalidataSection } from "@/components/home/WalidataSection";
import { getHomepageData } from "@/lib/homepage-data";

export const metadata: Metadata = {
  title: "Beranda | SIH3 Serayu Opak",
  description:
    "Portal Satu Data Hidrologi, Hidrometeorologi, dan Hidrogeologi Balai Besar Wilayah Sungai Serayu Opak.",
};

// Server-side fetch with a short revalidate window.
export const revalidate = 60;

function DataError({ message }: { message: string }) {
  return (
    <div className="mx-auto w-full max-w-site px-4 py-12 sm:px-6">
      <h2 className="text-[22px] font-semibold text-ink">
        Data tidak dapat dimuat
      </h2>
      <p
        role="alert"
        className="mt-3 max-w-2xl border border-status-danger-border bg-status-danger-bg p-4 text-sm text-status-danger-fg"
      >
        {message}
      </p>
      <p className="mt-3 max-w-2xl text-sm text-ink-muted">
        Data yang gagal dimuat tidak diganti dengan angka perkiraan. Silakan muat
        ulang halaman beberapa saat lagi.
      </p>
      <p className="mt-4 text-sm">
        <Link href="/" className="text-link hover:underline">
          Muat ulang beranda
        </Link>
      </p>
    </div>
  );
}

async function HomeData() {
  const result = await getHomepageData();

  if (!result.ok) {
    return <DataError message={result.error} />;
  }

  const { rows, fields, lastUpdated } = result.data;
  const now = new Date();

  return (
    <>
      <SummaryBlocks fields={fields} lastUpdated={lastUpdated} now={now} />
      <MonitoringSection rows={rows} />
      <FieldsSection fields={fields} />
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<HomeSkeleton />}>
        <HomeData />
      </Suspense>
      <ServicesSection />
      <DownloadCtaSection />
      <WalidataSection />
    </>
  );
}
