import type { Metadata } from "next";
import { DatasetPage, datasetMetadata } from "@/components/dataset/DatasetPage";

export const metadata: Metadata = datasetMetadata("hidrometeorologi");
export const revalidate = 60;

export default async function HidrometeorologiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DatasetPage tipe="hidrometeorologi" searchParams={await searchParams} />;
}
