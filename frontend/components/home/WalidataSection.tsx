import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { WALIDATA_DIRECTORY } from "@/lib/walidata-directory";

const FEATURED_WALIDATA = [
  { shortName: "BBWS SO", fullName: "BBWS Serayu Opak", href: "https://sda.pu.go.id/balai/bbwsserayuopak/" },
  { shortName: "DPUPESDM DIY", fullName: "Dinas PUP ESDM DIY", href: "https://dpupesdm.jogjaprov.go.id" },
  { shortName: "Pusdataru Jateng", fullName: "Dinas Pusdataru Jateng", href: "https://pusdataru.jatengprov.go.id" },
  { shortName: "DLHK DIY", fullName: "Dinas LHK DIY", href: "https://dlhk.jogjaprov.go.id" },
  { shortName: "Staklim DIY", fullName: "Stasiun Klimatologi DIY", href: "https://staklim-yogya.bmkg.go.id" },
  { shortName: "PJT I", fullName: "Perum Jasa Tirta I", href: "https://jasatirta1.co.id" },
];

export function WalidataSection() {
  const totalCount = WALIDATA_DIRECTORY.length;

  return (
    <section className="pb-14">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3.5">
          <h3 className="text-[17px] font-semibold text-[#1B2430]">
            Walidata SIH3
          </h3>
          <Link
            href="/walidata"
            className="text-[14px] font-medium text-[#0B5CAD] hover:text-[#14396A]"
          >
            Lihat {totalCount} walidata, permintaan data, dan kontak &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {FEATURED_WALIDATA.map((w) => (
            <a
              key={w.shortName}
              href={w.href}
              target="_blank"
              rel="noreferrer"
              title={w.fullName}
              className="flex flex-col items-center justify-center rounded-[8px] border border-[#D5DBE3] bg-white p-4 text-center transition-all hover:border-[#AEB8C5] hover:shadow-[0_2px_10px_rgba(14,42,78,0.08)] block"
            >
              <div className="mb-2 h-11 w-11 rounded-[6px] border border-dashed border-[#8A96A6] flex items-center justify-center text-[10px] text-[#5B6675]">
                Logo
              </div>
              <div className="text-[13px] font-semibold text-[#1B2430] leading-tight">
                {w.shortName}
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default WalidataSection;
