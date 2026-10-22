import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function DownloadCtaSection() {
  return (
    <section className="py-14">
      <Container>
        <div data-reveal className="rounded-[8px] bg-[#0E2A4E] p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left Column: CTA Info */}
          <div>
            <h2 className="text-[26px] font-semibold text-white tracking-[-0.01em]">
              Unduh data pemantauan
            </h2>
            <p className="mt-2.5 mb-6 text-[15px] leading-relaxed text-[#C9D6E8] max-w-[460px]">
              Data tersedia untuk akademisi, peneliti, lembaga teknis, dan
              masyarakat dalam format CSV dan Excel.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/data-explorer"
                className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[#F2A900] px-5 text-[15px] font-semibold text-[#0E2A4E] hover:bg-[#D99500] transition-colors"
              >
                Buka Data Explorer
              </Link>
              <Link
                href="/publikasi"
                className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[#8FA6C4] bg-transparent px-5 text-[15px] font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Dokumen dan SOP
              </Link>
            </div>
          </div>

          {/* Right Column: Steps */}
          <ol className="m-0 p-0 list-none grid gap-3.5">
            <li className="flex items-center gap-3.5 text-white text-[15px]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8FA6C4] text-[14px] font-semibold text-white">
                1
              </span>
              <span>Pilih pos pemantauan</span>
            </li>
            <li className="flex items-center gap-3.5 text-white text-[15px]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8FA6C4] text-[14px] font-semibold text-white">
                2
              </span>
              <span>Tentukan rentang tanggal</span>
            </li>
            <li className="flex items-center gap-3.5 text-white text-[15px]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8FA6C4] text-[14px] font-semibold text-white">
                3
              </span>
              <span>Unduh dalam format CSV atau Excel</span>
            </li>
          </ol>
        </div>
      </Container>
    </section>
  );
}

export default DownloadCtaSection;
