import type { Metadata } from "next";
import { FloodRoutingContent } from "@/components/floodrouting/FloodRoutingContent";
import { getFloodRoutingData } from "@/lib/flood-routing";

export const metadata: Metadata = {
  title: "Flood Routing",
  description:
    "Prakiraan waktu banjir (flood routing) Wilayah Sungai Serayu Opak: akses aplikasi perhitungan dan daftar pos duga air yang menjadi data masukan.",
  alternates: { canonical: "/floodrouting" },
};

export const revalidate = 60;

export default async function FloodRoutingPage() {
  const result = await getFloodRoutingData();

  return (
    <FloodRoutingContent
      data={result.ok ? result.data : null}
      error={result.ok ? null : result.error}
    />
  );
}
