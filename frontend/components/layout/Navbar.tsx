"use client";

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

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
{ label: "Analisis Data", href: "/analisis-data" },
{
  label: "Galeri",
    items: [
      { label: "Buletin", href: `${ORIGINAL_SITE}/info/buletin`, external: true },
      { label: "Peta", href: "/galeri/peta" },
      { label: "Album Kegiatan", href: `${ORIGINAL_SITE}/info/album`, external: true },
      { label: "Dokumen", href: "/galeri/dokumen" },
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

/** useLayoutEffect warns during SSR; fall back to useEffect on the server. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Base width of the indicator before it is scaled to the active item. */
const INDICATOR_BASE_WIDTH = 100;

export function Navbar() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const menuId = useId();

  const activeKey = NAV_ITEMS.find((entry) => isActive(entry, pathname))?.label ?? null;
  const [indicator, setIndicator] = useState<{
    x: number;
    width: number;
    bottom: number;
  } | null>(null);
  // Slides only after the first placement, so the bar does not fly in on load.
  const [slides, setSlides] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const item = activeKey
        ? nav.querySelector<HTMLElement>(`[data-nav-key="${activeKey}"]`)
        : null;
      if (!item) {
        setIndicator(null);
        return;
      }
      const navBox = nav.getBoundingClientRect();
      const box = item.getBoundingClientRect();
      setIndicator({
        x: box.left - navBox.left,
        width: box.width,
        bottom: navBox.bottom - box.bottom,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    // Web fonts land after first paint and change label widths.
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => observer.disconnect();
  }, [activeKey, pathname]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSlides(true));
    return () => cancelAnimationFrame(frame);
  }, []);

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

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "#";

  return (
    <header className="w-full">
      {/* Top identity strip */}
      <div className="bg-[#0A2140] text-white text-[13px]">
        <Container className="flex items-center justify-between py-[7px]">
          <span className="truncate pr-2">
            Situs resmi Balai Besar Wilayah Sungai Serayu Opak &middot; Direktorat
            Jenderal Sumber Daya Air &middot; Kementerian Pekerjaan Umum
          </span>
          <a
            href={adminUrl}
            className="shrink-0 text-white font-medium hover:underline"
          >
            Masuk
          </a>
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
            className="relative ml-auto hidden items-center gap-1 lg:flex"
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
                    data-nav-key={entry.label}
                    className={cn(
                      "px-3 py-2 text-[15px] font-medium transition-colors",
                      active
                        ? "text-[#14396A]"
                        : "text-[#1B2430] hover:text-[#14396A]"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {entry.label}
                  </Link>
                );
              }

              const open = openGroup === entry.label;
              const active = isActive(entry, pathname);

              return (
                <div key={entry.label} className="relative">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${menuId}-${entry.label}`}
                    onClick={() => setOpenGroup(open ? null : entry.label)}
                    data-nav-key={entry.label}
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-2 text-[15px] font-medium transition-colors",
                      active
                        ? "text-[#14396A]"
                        : "text-[#1B2430] hover:text-[#14396A]"
                    )}
                  >
                    {entry.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        open ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {/*
                    Kept mounted so the panel can animate both ways: `visibility`
                    transitions discretely, so links stay untabbable while closed
                    and the exit fade still plays.
                  */}
                  <ul
                    id={`${menuId}-${entry.label}`}
                    aria-hidden={!open}
                    onClick={() => setOpenGroup(null)}
                    className={cn(
                      "absolute left-0 top-full z-50 mt-1 min-w-[200px] origin-top rounded-[6px] border border-[#D5DBE3] bg-white py-1 shadow-md",
                      "transition-[opacity,translate,scale,visibility] transition-discrete duration-150 ease-out",
                      open
                        ? "visible translate-y-0 scale-100 opacity-100"
                        : "invisible -translate-y-1 scale-[0.98] opacity-0 pointer-events-none"
                    )}
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

            {/*
              One bar for the whole nav: it is positioned from the active item's
              measured box and slides between items. Width is the base width
              scaled to the target, so a label change animates too.
            */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute left-0 h-[3px] origin-left rounded-full bg-[#F2A900]",
                slides
                  ? "transition-[transform,width,bottom] duration-300 ease-out"
                  : "transition-none"
              )}
              style={{
                width: INDICATOR_BASE_WIDTH,
                bottom: indicator?.bottom ?? 0,
                transform: indicator
                  ? `translateX(${indicator.x}px) scaleX(${indicator.width / INDICATOR_BASE_WIDTH})`
                  : "scaleX(0)",
                opacity: indicator ? 1 : 0,
              }}
            />
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
