"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface NavLeaf {
  label: string;
  href: string;
  external?: boolean;
}

interface NavGroup {
  label: string;
  items: NavLeaf[];
}

type NavEntry = NavLeaf | NavGroup;

const ORIGINAL_SITE = "https://sih3.bbwsserayuopak.id";

const NAV_ITEMS: NavEntry[] = [
  { label: "Beranda", href: "/" },
  { label: "FloodRouting", href: "/floodrouting" },
  {
    label: "SIH3",
    items: [
      { label: "Hidrologi", href: "/hidrologi" },
      { label: "Hidrometeorologi", href: "/hidrometeorologi" },
      { label: "Hidrogeologi", href: "/hidrogeologi" },
    ],
  },
  { label: "Walidata", href: "/walidata" },
  {
    label: "Galeri",
    items: [
      { label: "Buletin", href: `${ORIGINAL_SITE}/info/buletin`, external: true },
      { label: "Peta", href: `${ORIGINAL_SITE}/info/galeripeta`, external: true },
      { label: "Album Kegiatan", href: `${ORIGINAL_SITE}/info/album`, external: true },
      { label: "Dokumen", href: "/publikasi" },
    ],
  },
];

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

function isActive(entry: NavEntry, pathname: string): boolean {
  if (isGroup(entry)) return entry.items.some((item) => isActive(item, pathname));
  if (entry.external) return false;
  if (entry.href === "/") return pathname === "/";
  return pathname === entry.href.split("?")[0];
}

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    if (!openGroup) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenGroup(null);
    }

    function handlePointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openGroup]);

  return (
    <header className="w-full">
      {/* Top identity strip */}
      <div className="bg-[#0A2140] text-white text-[13px]">
        <Container className="flex items-center justify-between py-[7px]">
          <span className="truncate pr-2">
            Situs resmi Balai Besar Wilayah Sungai Serayu Opak &middot; Direktorat
            Jenderal Sumber Daya Air &middot; Kementerian Pekerjaan Umum
          </span>
          {user ? (
            <Link
              href="/admin"
              className="shrink-0 text-amber-400 font-semibold hover:underline flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Panel Admin ({user.name.split(" ")[0]})</span>
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="shrink-0 text-white font-medium hover:underline flex items-center gap-1"
            >
              Masuk
            </Link>
          )}
        </Container>
      </div>

      {/* Main header row */}
      <div className="border-b border-[#D5DBE3] bg-white">
        <Container className="flex items-center h-[76px] gap-3">
          {/* Brand & Logos */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <Image
              src="/brand/logo-header.png"
              alt="Portal SIH3 — Wilayah Sungai Serayu-Bogowonto dan Progo-Opak-Serang"
              width={363}
              height={60}
              priority
              className="h-8 w-auto sm:h-10 lg:h-11"
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            ref={navRef}
            aria-label="Navigasi utama"
            className="ml-auto hidden items-center gap-1 lg:flex"
          >
            {NAV_ITEMS.map((entry) => {
              if (!isGroup(entry)) {
                const active = isActive(entry, pathname);
                if (entry.external) {
                  return (
                    <a
                      key={entry.label}
                      href={entry.href}
                      className="px-3 py-2 text-[15px] font-medium text-[#1B2430] hover:text-[#14396A]"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {entry.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    className={cn(
                      "relative px-3 py-2 text-[15px] font-medium transition-colors",
                      active
                        ? "text-[#14396A] font-semibold after:absolute after:bottom-[-18px] after:left-3 after:right-3 after:h-[3px] after:bg-[#F2A900] after:content-['']"
                        : "text-[#1B2430] hover:text-[#14396A]"
                    )}
                  >
                    {entry.label}
                  </Link>
                );
              }

              const groupActive = isActive(entry, pathname);
              const isOpen = openGroup === entry.label;

              return (
                <div key={entry.label} className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroup((prev) => (prev === entry.label ? null : entry.label))
                    }
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-2 text-[15px] font-medium transition-colors",
                      groupActive
                        ? "text-[#14396A] font-semibold"
                        : "text-[#1B2430] hover:text-[#14396A]"
                    )}
                  >
                    <span>{entry.label}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "h-4 w-4 transition-transform duration-150",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <ul
                      role="menu"
                      onClick={() => setOpenGroup(null)}
                      className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-[6px] border border-[#D5DBE3] bg-white py-1 shadow-md"
                    >
                      {entry.items.map((item) => (
                        <li key={item.label}>
                          {item.external ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noreferrer"
                              className="block px-4 py-2 text-[14px] text-[#1B2430] hover:bg-[#F5F7FA] hover:text-[#14396A]"
                            >
                              {item.label}
                            </a>
                          ) : (
                            <Link
                              href={item.href}
                              className="block px-4 py-2 text-[14px] text-[#1B2430] hover:bg-[#F5F7FA] hover:text-[#14396A]"
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {/* CTA Button */}
            <Link
              href="/data-explorer"
              className="ml-3 inline-flex h-10 items-center justify-center rounded-[6px] bg-[#F2A900] px-[22px] text-[15px] font-semibold text-[#0E2A4E] hover:bg-[#D99500] transition-colors"
            >
              Unduh Data
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls={`${menuId}-mobile`}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#D5DBE3] text-[#1B2430] lg:hidden"
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
            <span className="sr-only">
              {mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            </span>
          </button>
        </Container>
      </div>

      {/* Mobile disclosure menu */}
      {mobileOpen && (
        <nav
          id={`${menuId}-mobile`}
          aria-label="Navigasi utama (seluler)"
          className="border-b border-[#D5DBE3] bg-white lg:hidden"
        >
          <Container className="py-3">
            <ul className="space-y-1">
              {NAV_ITEMS.map((entry) => (
                <li key={entry.label} className="border-b border-[#EEF1F5] pb-1">
                  {isGroup(entry) ? (
                    <div>
                      <div className="px-2 pt-2 text-[12px] font-semibold uppercase tracking-wider text-[#5B6675]">
                        {entry.label}
                      </div>
                      <ul className="mt-1 space-y-1 pl-2">
                        {entry.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1.5 px-2 text-[14px] text-[#1B2430] hover:text-[#14396A]"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      href={entry.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-2 py-2 text-[15px] font-medium",
                        isActive(entry, pathname)
                          ? "text-[#14396A] font-semibold"
                          : "text-[#1B2430]"
                      )}
                    >
                      {entry.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/data-explorer"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full h-11 items-center justify-center rounded-[6px] bg-[#F2A900] px-4 text-[15px] font-semibold text-[#0E2A4E]"
                >
                  Unduh Data
                </Link>
              </li>
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
