"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Radio,
  FileText,
  Building2,
  Activity,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Droplets,
  CloudRain,
  Layers,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface StatsState {
  totalPos: number;
  hidrologiPos: number;
  hidrometeorologiPos: number;
  hidrogeologiPos: number;
  walidataCount: number;
  dokumenCount: number;
  pengukuranCount: number;
}

export default function AdminDashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<StatsState>({
    totalPos: 0,
    hidrologiPos: 0,
    hidrometeorologiPos: 0,
    hidrogeologiPos: 0,
    walidataCount: 0,
    dokumenCount: 0,
    pengukuranCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resPos, resWalidata, resDokumen] = await Promise.all([
          axios.get(`${API_BASE_URL}/pos?per_page=100`),
          axios.get(`${API_BASE_URL}/walidata`),
          axios.get(`${API_BASE_URL}/dokumen?per_page=100`),
        ]);

        const allPos: Array<{ tipe?: string }> = resPos.data?.data || [];
        const totalPos = resPos.data?.meta?.total ?? allPos.length;

        const hidrologiPos = allPos.filter((p) => p.tipe === "hidrologi").length;
        const hidrometeorologiPos = allPos.filter((p) => p.tipe === "hidrometeorologi").length;
        const hidrogeologiPos = allPos.filter((p) => p.tipe === "hidrogeologi").length;

        const walidataCount = resWalidata.data?.data?.length || 0;
        const dokumenCount = resDokumen.data?.meta?.total ?? resDokumen.data?.data?.length ?? 0;

        let pengukuranTotal = 0;
        if (token) {
          try {
            const resPengukuran = await axios.get(`${API_BASE_URL}/pengukuran?per_page=1`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            pengukuranTotal = resPengukuran.data?.pagination?.total || 0;
          } catch {
            // Ignored
          }
        }

        setStats({
          totalPos,
          hidrologiPos,
          hidrometeorologiPos,
          hidrogeologiPos,
          walidataCount,
          dokumenCount,
          pengukuranCount: pengukuranTotal,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [token]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#0A2140] to-[#14396A] p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Selamat Datang, {user?.name || "Administrator"}!
          </h1>
          <p className="mt-1 text-sm text-gray-200">
            Pusat Kendali Portal Satu Data Hidrologi, Hidrometeorologi, & Hidrogeologi BBWS Serayu Opak.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/pengukuran"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0A2140] font-semibold text-sm transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Input Pengukuran Baru</span>
          </Link>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pos Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Pos Pemantauan
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "..." : stats.totalPos}
            </div>
            <Link
              href="/admin/pos"
              className="text-xs text-[#14396A] hover:underline font-medium inline-flex items-center gap-1 mt-2"
            >
              Kelola Pos &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        {/* Walidata Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Mitra Walidata
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "..." : stats.walidataCount}
            </div>
            <Link
              href="/admin/walidata"
              className="text-xs text-[#14396A] hover:underline font-medium inline-flex items-center gap-1 mt-2"
            >
              Kelola Walidata &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Dokumen Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Dokumen Publikasi
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "..." : stats.dokumenCount}
            </div>
            <Link
              href="/admin/dokumen"
              className="text-xs text-[#14396A] hover:underline font-medium inline-flex items-center gap-1 mt-2"
            >
              Kelola Dokumen &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Sensor Measurements Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Rekaman Sensor
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "..." : stats.pengukuranCount.toLocaleString("id-ID")}
            </div>
            <Link
              href="/admin/pengukuran"
              className="text-xs text-[#14396A] hover:underline font-medium inline-flex items-center gap-1 mt-2"
            >
              Input & Pantau &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Rincian Pos Sesuai Beranda (Hidrologi, Hidrometeorologi, Hidrogeologi) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Pos Pemantauan
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Stasiun data hidrologi, hidrometeorologi, dan hidrogeologi.
            </p>
          </div>
          <Link
            href="/admin/pos"
            className="text-xs text-[#14396A] font-semibold hover:underline"
          >
            Lihat Semua Pos &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Hidrologi */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span>Hidrologi</span>
              </div>
              <div className="text-3xl font-bold text-blue-950 mt-1">
                {loading ? "..." : stats.hidrologiPos}
              </div>
              <div className="text-xs text-blue-700/80 mt-1">
                Pos Duga Air & Kualitas Air
              </div>
            </div>
          </div>

          {/* Hidrometeorologi */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <CloudRain className="w-4 h-4 text-amber-600" />
                <span>Hidrometeorologi</span>
              </div>
              <div className="text-3xl font-bold text-amber-950 mt-1">
                {loading ? "..." : stats.hidrometeorologiPos}
              </div>
              <div className="text-xs text-amber-700/80 mt-1">
                Pos Curah Hujan & Iklim
              </div>
            </div>
          </div>

          {/* Hidrogeologi */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Hidrogeologi</span>
              </div>
              <div className="text-3xl font-bold text-emerald-950 mt-1">
                {loading ? "..." : stats.hidrogeologiPos}
              </div>
              <div className="text-xs text-emerald-700/80 mt-1">
                Sumur Pantau Air Tanah
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            
            <span>Panduan Operasional Cepat</span>
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong>Tambah Titik Pos:</strong> Tambahkan koordinat dan jenis pos (AWLR / ARR / MAT) baru di tab <Link href="/admin/pos" className="text-[#14396A] font-semibold underline">Pos Pemantauan</Link>.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong>Catat TMA & Hujan:</strong> Masukkan angka hasil rekaman sensor atau pengukuran manual di menu <Link href="/admin/pengukuran" className="text-[#14396A] font-semibold underline">Pengukuran</Link>.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong>Upload SOP / Laporan:</strong> Perbarui direktori unduhan berkas publik pada menu <Link href="/admin/dokumen" className="text-[#14396A] font-semibold underline">Dokumen Publikasi</Link>.
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            
            <span>Integritas Jaringan Walidata</span>
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Data SIH3 dikoordinasikan secara berkala bersama mitra walidata (BBWS SO, BMKG DIY & Jateng, Pusdataru Jateng, DPUPESDM DIY, DLHK DIY, & PJT I). Pastikan kontak WhatsApp & tautan layanan data instansi selalu mutakhir.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/walidata"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-semibold transition-colors"
            >
              <span>Periksa Profil Mitra</span>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
