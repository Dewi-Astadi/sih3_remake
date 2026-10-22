import type { Metadata } from "next";
import { DatasetPage, datasetMetadata } from "@/components/dataset/DatasetPage";

export const metadata: Metadata = datasetMetadata("hidrogeologi");
export const revalidate = 60;

export default async function HidrogeologiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DatasetPage tipe="hidrogeologi" searchParams={await searchParams} />;
}
