"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  Activity,
  FileText,
  Building2,
  LogOut,
  ExternalLink,
  User,
  Shield,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV_ADMIN = [
  { label: "Ringkasan", href: "/admin", icon: LayoutDashboard },
  { label: "Pos Pemantauan", href: "/admin/pos", icon: Radio },
  { label: "Pengukuran & Sensor", href: "/admin/pengukuran", icon: Activity },
  { label: "Dokumen Publikasi", href: "/admin/dokumen", icon: FileText },
  { label: "Mitra Walidata", href: "/admin/walidata", icon: Building2 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    // If auth state is resolved and no user, redirect to login
    if (!isLoading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, isLoading, pathname, router]);

  // If this is the login page, render children without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#0E2A4E] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500 font-medium">Memverifikasi sesi admin...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E2E8F0] shrink-0">
        <div className="p-5 border-b border-[#E2E8F0] bg-[#0A2140] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500 text-[#0A2140] font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">Panel Kelola SIH3</div>
              <div className="text-[11px] text-gray-300">BBWS Serayu Opak</div>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0E2A4E] text-white flex items-center justify-center font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-gray-900 truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {NAV_ADMIN.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-[#0E2A4E] text-white shadow-sm font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-4 h-4", active ? "text-amber-400" : "text-gray-500")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 mt-auto border-t border-gray-200 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            <span>Kunjungi Web Publik</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

