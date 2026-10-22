import React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#3A6EA5] pt-14 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
      {/* Latar foto: limpasan air di ambang bendungan */}
      <Image
        src="/images/hero-bendungan.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none select-none object-cover"
      />

      {/* Lapisan gelap agar teks tetap kontras */}
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

      {/* Kredit foto */}
      <div className="hidden sm:block absolute right-6 bottom-4 lg:bottom-12 text-[12px] text-[#DCE6F3]/80 pointer-events-none">
        Foto: Moklebust / Pexels
      </div>
    </section>
  );
}

export default Hero;
