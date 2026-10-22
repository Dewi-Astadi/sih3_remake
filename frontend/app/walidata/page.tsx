"use client";

import React, { Suspense, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import {
  Building2,
  ExternalLink,
  Filter,
  Phone,
  MapPin,
  Search,
  X,
  Radio,
  ChevronRight,
  ShieldCheck,
  Globe,
  MessageCircle,
  Database,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Building,
  CloudSun,
  Droplets,
  Trees,
  Waves,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getWalidataList } from "@/lib/api";
import { Walidata } from "@/lib/types";

// Metadata pelengkap informasi instansi (alamat kantor, inisial badge style, dan kategori lembaga)
const WALIDATA_METADATA: Record<
  string,
  {
    alamat: string;
    kategori: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: {
      avatarBg: string;
      avatarText: string;
      border: string;
      badge: string;
    };
  }
> = {
  "BBWS SO": {
    alamat: "Jl. Solo Km. 5,8, Babarsari, Caturtunggal, Depok, Sleman, D.I. Yogyakarta 55281",
    kategori: "Kementerian Pekerjaan Umum",
    icon: Waves,
    accentColor: {
      avatarBg: "bg-blue-100 text-blue-900 border-blue-200",
      avatarText: "text-blue-900",
      border: "hover:border-blue-300",
      badge: "border-blue-200 bg-blue-50 text-blue-800",
    },
  },
  "BMKG DIY": {
    alamat: "Jl. Kabupaten Km 5.5, Duwet, Sendangadi, Mlati, Sleman, D.I. Yogyakarta 55285",
    kategori: "Lembaga Pemerintah Non-Kementerian",
    icon: CloudSun,
    accentColor: {
      avatarBg: "bg-sky-100 text-sky-900 border-sky-200",
      avatarText: "text-sky-900",
      border: "hover:border-sky-300",
      badge: "border-sky-200 bg-sky-50 text-sky-800",
    },
  },
  "DPUPESDM DIY": {
    alamat: "Jl. Bumijo No. 5, Gowongan, Jetis, Kota Yogyakarta, D.I. Yogyakarta 55231",
    kategori: "Pemerintah Daerah D.I. Yogyakarta",
    icon: Droplets,
    accentColor: {
      avatarBg: "bg-amber-100 text-amber-900 border-amber-200",
      avatarText: "text-amber-900",
      border: "hover:border-amber-300",
      badge: "border-amber-200 bg-amber-50 text-amber-800",
    },
  },
  "PUSDATARU JATENG": {
    alamat: "Jl. Madukoro Blok AA-BB, Krobokan, Semarang Barat, Kota Semarang, Jawa Tengah 50144",
    kategori: "Pemerintah Daerah Provinsi Jawa Tengah",
    icon: Building,
    accentColor: {
      avatarBg: "bg-indigo-100 text-indigo-900 border-indigo-200",
      avatarText: "text-indigo-900",
      border: "hover:border-indigo-300",
      badge: "border-indigo-200 bg-indigo-50 text-indigo-800",
    },
  },
  "DLHK DIY": {
    alamat: "Jl. Argolubang No. 19, Baciro, Gondokusuman, Kota Yogyakarta, D.I. Yogyakarta 55225",
    kategori: "Pemerintah Daerah D.I. Yogyakarta",
    icon: Trees,
    accentColor: {
      avatarBg: "bg-emerald-100 text-emerald-900 border-emerald-200",
      avatarText: "text-emerald-900",
      border: "hover:border-emerald-300",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
  },
  "PJT I": {
    alamat: "Jl. Surabaya No. 2A, Gading Kasri, Klojen, Kota Malang, Jawa Timur 65115",
    kategori: "Badan Usaha Milik Negara (BUMN)",
    icon: ShieldCheck,
    accentColor: {
      avatarBg: "bg-teal-100 text-teal-900 border-teal-200",
      avatarText: "text-teal-900",
      border: "hover:border-teal-300",
      badge: "border-teal-200 bg-teal-50 text-teal-800",
    },
  },
};

/**
 * Helper membersihkan nomor WhatsApp dan mengubah ke format internasional standar Indonesia (62xxx)
 */
function getCleanWaNumber(raw?: string | null): string {
  if (!raw) return "";
  let digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  }
  return digits;
}

/**
 * Helper menghasilkan URL link WhatsApp dengan template sapaan permohonan data publik
 */
function buildWhatsAppUrl(waNumber: string, instansiNama: string, singkatan: string): string {
  const clean = getCleanWaNumber(waNumber);
  const pesan = `Halo Tim PPID / Pengelola Data ${instansiNama} (${singkatan}), saya bermaksud mengajukan permohonan data dan informasi publik hidrologi/hidrometeorologi/hidrogeologi melalui portal SIH3 Serayu Opak. Mohon petunjuk mengenai prosedur permohonan data resminya. Terima kasih.`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(pesan)}`;
}

/**
 * Skeleton Loader saat memuat daftar walidata
 */
function WalidataSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton className="h-9 w-96 max-w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 max-w-2xl rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function WalidataDirectoryContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialSearch = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [walidataList, setWalidataList] = useState<Walidata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch daftar walidata dari API / fallback
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    getWalidataList()
      .then((data) => {
        if (isMounted) {
          setWalidataList(data || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("[Walidata] Gagal memuat daftar mitra:", err);
          setFetchError("Gagal terhubung dengan server pengelola walidata.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sinkronisasi query param ke URL saat search berubah
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    const queryStr = params.toString();
    const newUrl = queryStr ? `${pathname}?${queryStr}` : pathname;
    window.history.replaceState(null, "", newUrl);
  };

  const handleResetSearch = () => {
    handleSearchChange("");
  };

  // Filter daftar walidata berdasarkan nama atau singkatan
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return walidataList;
    const q = searchQuery.toLowerCase().trim();
    return walidataList.filter(
      (w) =>
        w.nama.toLowerCase().includes(q) ||
        w.singkatan.toLowerCase().includes(q) ||
        (w.deskripsi && w.deskripsi.toLowerCase().includes(q))
    );
  }, [walidataList, searchQuery]);

  // Statistik agregat
  const totalPos = useMemo(() => {
    return walidataList.reduce((acc, curr) => acc + (curr.pos_count || 0), 0);
  }, [walidataList]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 text-slate-800 antialiased">
      {/* ========================================================================= */}
      {/* 1. HERO HEADER */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Breadcrumb Nav */}
          <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Mitra Walidata</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Tata Kelola Keterbukaan Data Publik Terpadu</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Direktori Mitra Walidata SIH3 Serayu Opak
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Sinergi antar-instansi pengelola data hidrologi, hidrometeorologi, dan hidrogeologi di
                Wilayah Sungai Serayu Opak &amp; Serayu Bogowonto.
              </p>
            </div>

            {/* Quick Aggregate Stats Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-center min-w-[110px]">
                <span className="block text-2xl font-bold text-slate-900">{walidataList.length}</span>
                <span className="text-xs text-slate-500 font-medium">Instansi Mitra</span>
              </div>
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl px-4 py-2.5 text-center min-w-[110px]">
                <span className="block text-2xl font-bold text-blue-700">{totalPos}</span>
                <span className="text-xs text-blue-600/90 font-medium">Pos Terpantau</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ========================================================================= */}
        {/* 2. CALLOUT KETERBUKAAN DATA (SATU DATA INDONESIA) */}
        {/* ========================================================================= */}
        <div
          data-reveal
          className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden"
        >
          {/* Decorative subtle background overlay */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-medium backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Prinsip Satu Data Indonesia &amp; PP No. 30 Tahun 2024</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Integrasi &amp; Standardisasi Data Antar-Lembaga Pemerintah
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Pengelolaan SIH3 Serayu Opak diselenggarakan melalui kolaborasi erat lintas kementerian,
                lembaga non-kementerian, pemerintah provinsi, dan badan usaha milik negara. Portal ini
                menyatukan data telemetri real-time dan catatan historis untuk menjamin keterpaduan,
                akurasi, serta kemudahan akses bagi akademisi, praktisi, dan masyarakat luas.
              </p>
            </div>

            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Standar metadata &amp; format data seragam</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Penyelarasan kode referensi pos pemantauan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pelayanan data publik terbuka &amp; transparan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dukungan respon cepat penanggulangan banjir</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. FILTER PENCARIAN INSTANSI */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari instansi, singkatan (BBWS, BMKG, DPUPESDM...), atau peran..."
              className="w-full pl-10 pr-9 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-900 rounded-lg border border-slate-300/80 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 text-xs font-medium text-slate-500">
            <span>
              Menampilkan <strong className="text-slate-900">{filteredList.length}</strong> dari{" "}
              {walidataList.length} instansi mitra
            </span>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetSearch}
                className="h-8 text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-50"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. GRID KARTU INSTANSI MITRA WALIDATA */}
        {/* ========================================================================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : fetchError ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-rose-900">Gagal Memuat Direktori</h3>
              <p className="text-sm text-rose-700 mt-1">{fetchError}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-rose-300 text-rose-800 hover:bg-rose-100"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Coba Lagi
            </Button>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Instansi Tidak Ditemukan</h3>
              <p className="text-sm text-slate-500 mt-1">
                Tidak ada instansi walidata yang sesuai dengan kata kunci &ldquo;{searchQuery}&rdquo;.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetSearch}>
              Hapus Filter Pencarian
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((instansi, index) => {
              const meta = WALIDATA_METADATA[instansi.singkatan] || {
                alamat: "Kantor Instansi Mitra Walidata SIH3 Serayu Opak",
                kategori: "Instansi Mitra Pengelola Data",
                icon: Building2,
                accentColor: {
                  avatarBg: "bg-slate-100 text-slate-800 border-slate-200",
                  avatarText: "text-slate-800",
                  border: "hover:border-slate-300",
                  badge: "border-slate-200 bg-slate-50 text-slate-800",
                },
              };

              const IconComponent = meta.icon;
              const waNumber = instansi.kontak_wa;
              const waUrl = waNumber
                ? buildWhatsAppUrl(waNumber, instansi.nama, instansi.singkatan)
                : null;
              const portalUrl = instansi.layanan_url || instansi.website_url;

              return (
                <Card
                  key={instansi.id}
                  data-reveal
                  style={{ "--reveal-delay": `${Math.min(index, 5) * 60}ms` } as React.CSSProperties}
                  className={`bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-200 group ${meta.accentColor.border}`}
                >
                  <CardHeader className="p-6 pb-4 space-y-4">
                    {/* Header Baris 1: Avatar Inisial & Badge Pos Count */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Emblem Inisial Berlatar Halus */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold text-xs tracking-wider shadow-2xs shrink-0 ${meta.accentColor.avatarBg}`}
                        >
                          <div className="text-center leading-tight">
                            <span className="block font-black text-xs">{instansi.singkatan}</span>
                          </div>
                        </div>

                        <div>
                          <span className="inline-block text-[11px] font-medium text-slate-500">
                            {meta.kategori}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <IconComponent className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-xs text-slate-700">
                              {instansi.singkatan}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badge Pos Pemantauan */}
                      <Badge
                        variant="secondary"
                        className="bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 font-medium text-xs px-2.5 py-1 shrink-0 flex items-center gap-1.5 border border-slate-200"
                      >
                        <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                        <span>{instansi.pos_count || 0} Pos</span>
                      </Badge>
                    </div>

                    {/* Nama Lengkap Instansi */}
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug line-clamp-2">
                        {instansi.nama}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 py-0 space-y-4 grow flex flex-col justify-between">
                    {/* Deskripsi Peran & Kewenangan */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {instansi.deskripsi ||
                        "Pengelola data dan informasi sumber daya air terintegrasi pada Wilayah Sungai Serayu Opak."}
                    </p>

                    {/* Info Kontak & Alamat */}
                    <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      {/* Alamat Fisik */}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {meta.alamat}
                        </span>
                      </div>

                      {/* Nomor Telepon Kantor */}
                      {instansi.kontak_telp && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a
                            href={`tel:${instansi.kontak_telp.replace(/[^0-9+]/g, "")}`}
                            className="text-[11px] text-slate-700 hover:text-blue-700 font-medium transition-colors"
                          >
                            {instansi.kontak_telp}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {/* Card Footer: 3 Aksi Cepat */}
                  <CardFooter className="p-6 pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2.5">
                    {/* Baris 1: Tombol WhatsApp & Tombol Portal Eksternal */}
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {/* Tombol WhatsApp Hijau */}
                      {waUrl ? (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <div
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed"
                          title="Layanan WhatsApp permohonan data belum dikonfigurasi"
                        >
                          <MessageCircle className="w-3.5 h-3.5 opacity-60" />
                          <span>WA Offline</span>
                        </div>
                      )}

                      {/* Tombol Portal Eksternal / Website */}
                      {portalUrl ? (
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300/90 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5 text-slate-500" />
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ) : (
                        <div
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed"
                          title="Portal eksternal tidak tersedia"
                        >
                          <Globe className="w-3.5 h-3.5 opacity-60" />
                          <span>Portal -</span>
                        </div>
                      )}
                    </div>

                    {/* Baris 2: Tombol Filter Menuju Data Explorer */}
                    <Link
                      href={`/data-explorer?walidata_id=${instansi.id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors"
                    >
                      <Database className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lihat Pos Pemantauan ({instansi.pos_count || 0})</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 ml-auto" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. INFORMASI TATA CARA PERMOHONAN INFORMASI PUBLIK (PPID) */}
        {/* ========================================================================= */}
        <section
          data-reveal
          className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Mekanisme Permohonan Data &amp; Informasi Khusus
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Prosedur pengajuan data hidrologi yang memerlukan rekomendasi teknis atau data time-series beresolusi tinggi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/70 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-semibold text-sm text-slate-900">Eksplorasi Data Mandiri</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unduh data publik secara langsung melalui menu{" "}
                <Link href="/data-explorer" className="text-blue-700 underline font-medium">
                  Eksplorasi Data
                </Link>{" "}
                dalam format Excel (.xlsx) atau CSV secara bebas tanpa dipungut biaya.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/70 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-semibold text-sm text-slate-900">Hubungi Kontak Walidata</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gunakan tombol WhatsApp resmi pada kartu instansi terkait untuk konsultasi awal mengenai ketersediaan data khusus riset atau pekerjaan teknis.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/70 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-semibold text-sm text-slate-900">Pengajuan Surat Resmi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Untuk data terverifikasi dan stempel dinas, kirimkan surat permohonan resmi kepada Kepala Balai / Kepala Dinas melalui layanan PPID masing-masing instansi.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function WalidataPage() {
  return (
    <Suspense fallback={<WalidataSkeleton />}>
      <WalidataDirectoryContent />
    </Suspense>
  );
}
