import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

const ORIGINAL_SITE = "https://sih3.bbwsserayuopak.id";

const DATA_LINKS = [
  { label: "Hidrologi", href: "/data-explorer?tipe=hidrologi" },
  { label: "Hidrometeorologi", href: "/data-explorer?tipe=hidrometeorologi" },
  { label: "Hidrogeologi", href: "/data-explorer?tipe=hidrogeologi" },
  { label: "Walidata", href: "/walidata" },
];

const GALLERY_LINKS = [
  { label: "Buletin", href: `${ORIGINAL_SITE}/info/buletin`, external: true },
  { label: "Peta", href: `${ORIGINAL_SITE}/info/galeripeta`, external: true },
  { label: "Album Kegiatan", href: `${ORIGINAL_SITE}/info/album`, external: true },
  { label: "Dokumen", href: "/publikasi" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A2140] text-white">
      <Container className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-9 pb-6">
        {/* Kolom 1: Profil instansi */}
        <div className="md:col-span-2">
          <div className="font-semibold text-base mb-1.5 text-white">
            Balai Besar Wilayah Sungai Serayu Opak
          </div>
          <p className="text-[#C9D6E8] text-[14px] leading-relaxed max-w-[380px]">
            Jl. Solo Km. 6, Ngentak, Caturtunggal, Sleman, Kabupaten Sleman,
            Daerah Istimewa Yogyakarta 55281
          </p>
        </div>

        {/* Kolom 2: Data SIH3 */}
        <div>
          <div className="font-semibold text-base mb-1.5 text-white">
            Data SIH3
          </div>
          <ul className="space-y-1 text-[14px]">
            {DATA_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block py-0.5 text-[#C9D6E8] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom 3: Galeri */}
        <div>
          <div className="font-semibold text-base mb-1.5 text-white">
            Galeri
          </div>
          <ul className="space-y-1 text-[14px]">
            {GALLERY_LINKS.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block py-0.5 text-[#C9D6E8] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="block py-0.5 text-[#C9D6E8] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Copyright strip */}
      <div className="border-t border-[#1F3A64]">
        <Container className="py-3 text-[13px] text-[#C9D6E8]">
          Hak Cipta &copy; {currentYear} Balai Besar Wilayah Sungai Serayu Opak
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
