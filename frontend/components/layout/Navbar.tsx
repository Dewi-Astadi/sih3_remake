"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database,
  FileText,
  Home,
  Menu,
  X,
  DownloadCloud,
  ExternalLink,
  ShieldCheck,
  Building2,
  Droplets,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Eksplorasi Data", href: "/data-explorer", icon: Database },
  { label: "Dokumen & SOP", href: "/publikasi", icon: FileText },
  { label: "Walidata", href: "/walidata", icon: Building2 },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efek shadow saat window di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup mobile menu saat berpindah rute
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Top Banner Pemerintah / Instansi Resmi PUPR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="hidden sm:inline">KEMENTERIAN PEKERJAAN UMUM</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden md:inline">DITJEN SUMBER DAYA AIR</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="text-amber-300 font-semibold">BBWS SERAYU OPAK</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div className="hidden lg:flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sistem SIH3 Aktif 24/7</span>
            </div>
            <a
              href="http://localhost:8000/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-medium text-slate-300"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Panel Admin</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={cn(
          "w-full bg-white/95 backdrop-blur-md transition-shadow duration-200 border-b border-slate-200/80",
          scrolled ? "shadow-md" : "shadow-xs"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo & Identitas SIH3 */}
            <Link
              href="/"
              className="flex items-center gap-3.5 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            >
              {/* Emblem / Logo Graphic PUPR Theme */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xs shadow-amber-500/30 group-hover:scale-105 transition-transform duration-200 border border-amber-400">
                <Droplets className="w-6 h-6 text-slate-950 fill-slate-950/20" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                    SIH<span className="text-amber-600">3</span>
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-bold tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    SERAYU OPAK
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium leading-tight hidden sm:block">
                  Hidrologi • Hidrometeorologi • Hidrogeologi
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative",
                      isActive
                        ? "text-slate-900 bg-amber-50/80 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-amber-600" : "text-slate-400"
                      )}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA & Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/data-explorer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs hover:shadow-sm transition-all duration-150 active:scale-98 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <DownloadCloud className="w-4 h-4 text-slate-950" />
                <span>Unduh Data Cepat</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/data-explorer"
                className="sm:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Unduh Data"
              >
                <DownloadCloud className="w-5 h-5 text-amber-600" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigasi menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-amber-50 text-slate-900 font-semibold border-l-4 border-amber-500"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          isActive ? "text-amber-600" : "text-slate-400"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
              <Link
                href="/data-explorer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition-colors"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Unduh Data Cepat (CSV / Excel)</span>
              </Link>

              <a
                href="http://localhost:8000/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <span>Masuk Panel Admin Kelola Data</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              Balai Besar Wilayah Sungai Serayu Opak
              <br />
              Direktorat Jenderal Sumber Daya Air - Kementerian PU
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
export default Navbar;
