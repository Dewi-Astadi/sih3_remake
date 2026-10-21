import React from "react";
import Link from "next/link";
import {
  Waves,
  CloudRain,
  Layers,
  ArrowRight,
  DownloadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  ShieldCheck,
  ChevronRight,
  FileText,
  Clock,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { QuickSearchHero } from "@/components/modules/QuickSearchHero";
import { TelemetryStrip } from "@/components/modules/TelemetryStrip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Beranda | Portal Satu Data SIH3 Serayu Opak",
  description:
    "Portal Satu Data Hidrologi, Hidrometeorologi, dan Hidrogeologi Wilayah Sungai Serayu Opak & Serayu Bogowonto. Akses telemetri real-time dan unduh dataset terbuka instan.",
};

const TIGA_PILAR = [
  {
    id: "hidrologi",
    nama: "Hidrologi",
    sub: "Tata Air Permukaan & Sungai",
    deskripsi:
      "Pemantauan dinamika aliran air permukaan, fluktuasi duga air sungai, tampungan waduk, debit banjir, serta parameter kualitas air fisik dan kimia.",
    icon: Waves,
    color: "sky",
    href: "/data-explorer?tipe=hidrologi",
    features: [
      "Tinggi Muka Air (Pos AWLR)",
      "Debit Aliran Sungai (Q m³/s)",
      "Elevasi & Tampungan Waduk",
      "Kualitas & Baku Mutu Air",
    ],
    bgLight: "bg-sky-50/70",
    borderLight: "border-sky-200/80",
    textCol: "text-sky-700",
    badgeBg: "bg-sky-100 text-sky-800",
  },
  {
    id: "hidrometeorologi",
    nama: "Hidrometeorologi",
    sub: "Presipitasi & Dinamika Cuaca",
    deskripsi:
      "Perekaman kuantitatif curah hujan berkala dari stasiun penakar otomatis (ARR), intensitas presipitasi harian, suhu udara, kelembaban, dan data klimatologi.",
    icon: CloudRain,
    color: "blue",
    href: "/data-explorer?tipe=hidrometeorologi",
    features: [
      "Curah Hujan Otomatis (Pos ARR)",
      "Intensitas Hujan Per Jam",
      "Stasiun Klimatologi Lengkap",
      "Evaporasi & Kelembaban Udara",
    ],
    bgLight: "bg-blue-50/70",
    borderLight: "border-blue-200/80",
    textCol: "text-blue-700",
    badgeBg: "bg-blue-100 text-blue-800",
  },
  {
    id: "hidrogeologi",
    nama: "Hidrogeologi",
    sub: "Akuifer & Air Bawah Tanah",
    deskripsi:
      "Pengukuran kedalaman muka air tanah (MAT), monitoring sumur pantau akuifer tertekan maupun bebas di Cekungan Air Tanah (CAT) Yogyakarta-Sleman.",
    icon: Layers,
    color: "indigo",
    href: "/data-explorer?tipe=hidrogeologi",
    features: [
      "Kedalaman Muka Air Tanah (MAT)",
      "Sumur Pantau Akuifer Tertekan",
      "Cekungan Air Tanah (CAT)",
      "Konservasi Air Bawah Tanah",
    ],
    bgLight: "bg-indigo-50/70",
    borderLight: "border-indigo-200/80",
    textCol: "text-indigo-700",
    badgeBg: "bg-indigo-100 text-indigo-800",
  },
];

const MITRA_WALIDATA = [
  { singkatan: "BBWS SO", nama: "Balai Besar Wilayah Sungai Serayu Opak" },
  { singkatan: "BMKG DIY", nama: "Stasiun Klimatologi D.I. Yogyakarta" },
  { singkatan: "DPUPESDM DIY", nama: "Dinas PUP ESDM D.I. Yogyakarta" },
  { singkatan: "PUSDATARU JATENG", nama: "Dinas Pusdataru Provinsi Jawa Tengah" },
  { singkatan: "DLHK DIY", nama: "Dinas LHK D.I. Yogyakarta" },
  { singkatan: "PJT I", nama: "Perum Jasa Tirta I" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO PENCARIAN CEPAT & MINI STATS */}
      <QuickSearchHero />

      {/* 2. TELEMETRY STRIP (PENGGANTI PETA INTERAKTIF BERAT) */}
      <TelemetryStrip />

      {/* 3. TIGA PILAR DATA SIH3 */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Struktur Klasifikasi Data Nasional</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              3 Pilar Layanan Data SIH3
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              Integrasi komprehensif seluruh komponen siklus hidrologi wilayah
              sungai guna mendukung perencanaan, riset, dan mitigasi bencana air.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {TIGA_PILAR.map((pilar) => {
              const Icon = pilar.icon;
              return (
                <div
                  key={pilar.id}
                  className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div
                        className={`w-12 h-12 rounded-xl ${pilar.bgLight} ${pilar.textCol} border ${pilar.borderLight} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${pilar.badgeBg}`}
                      >
                        Pilar Data
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {pilar.nama}
                    </h3>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5 mb-3">
                      {pilar.sub}
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {pilar.deskripsi}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Komponen &amp; Sensor:
                      </div>
                      {pilar.features.map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button Action */}
                  <Link
                    href={pilar.href}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200"
                  >
                    <span>Eksplorasi Data {pilar.nama}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. BANNER CTA AKSES & UNDUH DATASET TERBUKA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0f172a] text-white relative overflow-hidden">
        {/* Glow effect */}
        <div
          className="pointer-events-none absolute -bottom-24 right-0 w-[500px] h-[300px] bg-amber-500/10 blur-3xl rounded-full"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-24 left-0 w-[500px] h-[300px] bg-sky-500/10 blur-3xl rounded-full"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-14 backdrop-blur-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-semibold mb-4">
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>Keterbukaan Data SDA Tanpa Birokrasi</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Akses &amp; Unduh Dataset Terbuka Bebas Hambatan
                </h2>

                <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Seluruh data hasil pemantauan stasiun AWLR, ARR, dan MAT
                  tersedia gratis bagi akademisi, peneliti, lembaga teknis, dan
                  masyarakat umum. Unduh instan dalam format CSV dan Excel (.xlsx)
                  secara individu maupun batch sekaligus.
                </p>

                {/* Key Benefits Pills */}
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Format CSV &amp; XLSX Siap Olah</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Unduh Batch Banyak Stasiun</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Sesuai Standar Satu Data Indonesia</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link
                    href="/data-explorer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-98 transition-all duration-150"
                  >
                    <DownloadCloud className="w-5 h-5 text-slate-950" />
                    <span>Buka Data Explorer &amp; Unduh Dataset</span>
                  </Link>

                  <Link
                    href="/publikasi"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Lihat Dokumen SOP &amp; Regulasi</span>
                  </Link>
                </div>
              </div>

              {/* Graphic Highlight Card */}
              <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Ekspor 1-Klik</div>
                    <div className="text-xs text-slate-400">Langsung unduh dari browser</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Tidak memerlukan proses birokrasi permohonan surat manual. Cukup pilih
                  stasiun, rentang tanggal, dan format berkas yang Anda butuhkan.
                </p>

                <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Kecepatan Ekspor:</span>
                  <span className="font-semibold text-emerald-400">&lt; 2 Detik (Streaming)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEKSI MITRA KOLABORASI WALIDATA */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sinergi Antar Instansi
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Mitra Kolaborasi Walidata SIH3
              </h3>
            </div>
            <Link
              href="/walidata"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline"
            >
              <span>Lihat Direktori Seluruh Walidata</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MITRA_WALIDATA.map((mitra, idx) => (
              <Link
                key={idx}
                href="/walidata"
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition-all text-center group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {mitra.singkatan}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                  {mitra.nama}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
