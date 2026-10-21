import React from "react";
import { Container } from "@/components/layout/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#3A6EA5] pt-14 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
      {/* SVG Background illustration */}
      <svg
        role="img"
        aria-label="Ilustrasi bendungan dan waduk"
        viewBox="0 0 1366 700"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      >
        <rect width="1366" height="700" fill="#B5CCE2" />
        <polygon
          points="0,330 140,270 300,310 470,240 640,300 820,250 1000,300 1180,235 1366,290 1366,440 0,440"
          fill="#7C9DBF"
        />
        <polygon
          points="0,385 200,325 380,365 560,305 760,355 960,315 1160,355 1366,325 1366,450 0,450"
          fill="#5D82A8"
        />
        <rect x="0" y="440" width="570" height="62" fill="#5686B4" />
        <polygon
          points="560,502 612,395 1366,395 1366,502"
          fill="#8896A6"
        />
        <rect x="612" y="395" width="754" height="14" fill="#C3CCD6" />
        <g stroke="#788799" strokeWidth="2">
          <line x1="700" y1="409" x2="700" y2="502" />
          <line x1="850" y1="409" x2="850" y2="502" />
          <line x1="1000" y1="409" x2="1000" y2="502" />
          <line x1="1150" y1="409" x2="1150" y2="502" />
          <line x1="1300" y1="409" x2="1300" y2="502" />
        </g>
        <g fill="#6B7B8E">
          <rect x="722" y="428" width="106" height="46" />
          <rect x="872" y="428" width="106" height="46" />
          <rect x="1022" y="428" width="106" height="46" />
          <rect x="1172" y="428" width="106" height="46" />
        </g>
        <rect x="0" y="502" width="1366" height="198" fill="#3F6F9F" />
        <rect x="600" y="502" width="766" height="28" fill="#5E86AE" opacity="0.6" />
        <g stroke="#8FB2D4" strokeWidth="2" opacity="0.6">
          <line x1="80" y1="545" x2="280" y2="545" />
          <line x1="380" y1="590" x2="650" y2="590" />
          <line x1="140" y1="640" x2="380" y2="640" />
          <line x1="780" y1="560" x2="1020" y2="560" />
          <line x1="700" y1="650" x2="980" y2="650" />
          <line x1="1100" y1="610" x2="1300" y2="610" />
        </g>
      </svg>

      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-[#0A2140]/70" />

      {/* Hero content */}
      <Container className="relative">
        <div className="max-w-[660px]">
          <h1 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.015em] text-white sm:text-[36px] lg:text-[40px]">
            Portal Satu Data Hidrologi, Hidrometeorologi, dan Hidrogeologi
          </h1>
          <p className="mt-4 mb-7 max-w-[520px] text-[15px] leading-relaxed text-[#C9D6E8] sm:text-[17px]">
            Layanan informasi dan keterbukaan data sumber daya air Wilayah Sungai
            Serayu Opak dan Serayu Bogowonto.
          </p>

          <form action="/data-explorer" method="get" role="search">
            <label
              htmlFor="q"
              className="block mb-1.5 text-[13px] font-medium text-white"
            >
              Cari pos pemantauan
            </label>
            <div className="flex flex-col gap-2 sm:flex-row max-w-[560px]">
              <input
                id="q"
                name="q"
                type="text"
                placeholder="Nama pos, sungai, DAS, atau kabupaten"
                className="h-12 flex-1 rounded-[6px] border-0 bg-white px-3.5 text-[15px] text-[#1B2430] placeholder:text-[#8A96A6] focus:outline-none focus:ring-2 focus:ring-[#F2A900]"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[6px] bg-[#F2A900] px-6 text-[15px] font-semibold text-[#0E2A4E] transition-colors hover:bg-[#D99500]"
              >
                Cari data
              </button>
            </div>
          </form>

          <div className="mt-2.5 text-[13px] text-[#C9D6E8]">
            Contoh: Kranggan, Sermo, DAS Progo
          </div>
        </div>
      </Container>

      {/* Caption watermark */}
      <div className="hidden sm:block absolute right-6 bottom-4 lg:bottom-12 text-[12px] text-[#DCE6F3]/80 pointer-events-none">
        Ilustrasi sementara &mdash; ganti dengan foto resmi BBWS Serayu Opak
      </div>
    </section>
  );
}

export default Hero;
