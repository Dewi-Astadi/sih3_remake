import React from "react";
import Link from "next/link";
import {
  Building2,
  Droplets,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Container Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Kolom 1: Profil Instansi Resmi (5 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md border border-amber-400">
                <Droplets className="w-6 h-6 text-slate-950 fill-slate-950/20" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  SIH<span className="text-amber-400">3</span> SERAYU OPAK
                </h3>
                <p className="text-xs text-amber-300 font-medium">
                  Kementerian Pekerjaan Umum • Ditjen SDA
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Portal Satu Data Hidrologi, Hidrometeorologi, dan Hidrogeologi (SIH3)
              Balai Besar Wilayah Sungai Serayu Opak. Menyajikan data pemantauan
              kuantitas dan kualitas air secara transparan dan akuntabel.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Jl. Solo Km. 6, Caturtunggal, Kec. Depok, Kabupaten Sleman,
                  Daerah Istimewa Yogyakarta 55281
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Telepon: (0274) 489172 • Fax: (0274) 489552</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>bbws-serayuopak@pu.go.id</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-amber-400 transition-colors inline-block"
                >
                  Beranda Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/data-explorer"
                  className="hover:text-amber-400 transition-colors inline-block"
                >
                  Eksplorasi Data
                </Link>
              </li>
              <li>
                <Link
                  href="/publikasi"
                  className="hover:text-amber-400 transition-colors inline-block"
                >
                  Dokumen & SOP
                </Link>
              </li>
              <li>
                <Link
                  href="/walidata"
                  className="hover:text-amber-400 transition-colors inline-block"
                >
                  Direktori Walidata
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:8000/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1 text-slate-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Panel Admin</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Lingkup 3 Pilar Data (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Cakupan Data SIH3
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-semibold text-amber-400 block mb-0.5">
                  1. Data Hidrologi
                </span>
                <span>Tinggi Muka Air (AWLR), Debit Sungai, dan Mutu Kualitas Air Sungai.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-semibold text-amber-400 block mb-0.5">
                  2. Data Hidrometeorologi
                </span>
                <span>Curah Hujan Otomatis (ARR), Iklim, Evaporasi, dan Kelembaban Udara.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-semibold text-amber-400 block mb-0.5">
                  3. Data Hidrogeologi
                </span>
                <span>Muka Air Tanah (MAT), Sumur Pantau, dan Neraca Cekungan Air Tanah (CAT).</span>
              </div>
            </div>
          </div>

          {/* Kolom 4: Jaringan Walidata (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Mitra Pengelola Data
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center justify-between py-1 border-b border-slate-900">
                <span>BBWS Serayu Opak</span>
                <span className="text-amber-400 text-[10px] font-mono">Ditjen SDA</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-900">
                <span>BMKG Staklim Yogyakarta</span>
                <span className="text-amber-400 text-[10px] font-mono">BMKG</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-900">
                <span>Dinas PUP ESDM DIY</span>
                <span className="text-amber-400 text-[10px] font-mono">Pemda DIY</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-900">
                <span>Dinas Pusdataru Jawa Tengah</span>
                <span className="text-amber-400 text-[10px] font-mono">Pemprov Jateng</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-900">
                <span>DLHK D.I. Yogyakarta & Jateng</span>
                <span className="text-amber-400 text-[10px] font-mono">Mutu Air</span>
              </li>
              <li className="flex items-center justify-between py-1">
                <span>Perum Jasa Tirta I</span>
                <span className="text-amber-400 text-[10px] font-mono">BUMN Air</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Keterbukaan Informasi Publik (KIP) & Legalitas */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Sesuai amanat <strong>UU No. 17 Tahun 2019</strong> tentang Sumber Daya Air &amp;{" "}
              <strong>PP No. 30 Tahun 2024</strong> tentang Pengelolaan Sistem Informasi H3.
            </span>
          </div>
          <div className="text-slate-500 text-[11px] text-center md:text-right">
            Data telemetri otomatis ditayangkan secara langsung (real-time). Verifikasi berkala dilakukan oleh pengamat pos.
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-6 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
          <p>
            Hak Cipta &copy; {currentYear}{" "}
            <span className="text-slate-300 font-medium">
              Balai Besar Wilayah Sungai Serayu Opak
            </span>
            . Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
