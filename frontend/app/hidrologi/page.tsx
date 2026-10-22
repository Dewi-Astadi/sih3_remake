import type { Metadata } from "next";
import { DatasetPage, datasetMetadata } from "@/components/dataset/DatasetPage";

export const metadata: Metadata = datasetMetadata("hidrologi");
export const revalidate = 60;

export default async function HidrologiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DatasetPage tipe="hidrologi" searchParams={await searchParams} />;
}
