import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

const ORIGINAL_SITE = "https://sih3.bbwsserayuopak.id";

const SERVICES = [
  {
    title: "FloodRouting",
    subtitle: "Layanan informasi",
    href: `${ORIGINAL_SITE}/info/floodrouting`,
    external: true,
  },
  {
    title: "Buletin",
    subtitle: "Publikasi berkala",
    href: `${ORIGINAL_SITE}/info/buletin`,
    external: true,
  },
  {
    title: "Dokumen",
    subtitle: "SOP dan regulasi",
    href: "/publikasi",
    external: false,
  },
  {
    title: "Album Kegiatan",
    subtitle: "Galeri foto",
    href: `${ORIGINAL_SITE}/info/album`,
    external: true,
  },
];

export function ServicesSection() {
  return (
    <section className="pt-12 pb-6">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((item, index) => {
            const cardContent = (
              <>
                <div className="text-[16px] font-semibold text-[#1B2430]">
                  {item.title}
                </div>
                <div className="mt-0.5 text-[13px] font-normal text-[#5B6675]">
                  {item.subtitle}
                </div>
              </>
            );

            if (item.external) {
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  data-reveal
                  style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
                  className="rounded-[8px] border border-[#D5DBE3] bg-white px-[18px] py-4 transition-all hover:border-[#AEB8C5] hover:shadow-[0_2px_10px_rgba(14,42,78,0.08)] block"
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                data-reveal
                style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
                className="rounded-[8px] border border-[#D5DBE3] bg-white px-[18px] py-4 transition-all hover:border-[#AEB8C5] hover:shadow-[0_2px_10px_rgba(14,42,78,0.08)] block"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default ServicesSection;
