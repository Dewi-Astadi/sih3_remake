"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  Search, 
  MapPin, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  XCircle 
} from "lucide-react";
import { getPosList } from "@/lib/api";
import { Pos, StatusAlat } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

// Helper untuk Badge Status Alat
function renderStatusBadge(status?: StatusAlat) {
  const s = (status || "aktif").toLowerCase();
  switch (s) {
    case "rusak":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Rusak / Nonaktif
        </span>
      );
    case "perbaikan":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Wrench className="w-3.5 h-3.5 text-amber-600" />
          Dalam Perbaikan
        </span>
      );
    case "aktif":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Aktif Beroperasi
        </span>
      );
  }
}

export default function PemantauanPosPage() {
  const [posList, setPosList] = useState<Pos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPosList()
      .then((res: unknown) => {
        // Menangani respon berupa PaginatedResponse (res.data) atau Array biasa
        const dataRes = res as { data?: Pos[]; items?: Pos[] } | Pos[];
        if (Array.isArray(dataRes)) {
          setPosList(dataRes);
        } else if (dataRes && Array.isArray(dataRes.data)) {
          setPosList(dataRes.data);
        } else if (dataRes && Array.isArray(dataRes.items)) {
          setPosList(dataRes.items);
        } else {
          setPosList([]);
        }
      })
      .catch((err) => console.error("Gagal memuat daftar pos:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter pencarian berdasarkan nama pos, kode, atau kabupaten
  const filteredPos = posList.filter((pos) => {
    const query = searchQuery.toLowerCase();
    return (
      pos.nama?.toLowerCase().includes(query) ||
      pos.kode_pos?.toLowerCase().includes(query) ||
      pos.kabupaten?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Halaman */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              <span>Monitoring Realtime</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pemantauan Status Pos Pengamatan
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Daftar seluruh pos pengamatan hidrologi, hidrometeorologi, dan hidrogeologi.
            </p>
          </div>

          {/* Input Pencarian */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nama, kode pos, lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </div>

        {/* Tabel Status Pos */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Kode & Nama Pos</th>
                  <th className="py-3.5 px-4">Tipe / Sensor</th>
                  <th className="py-3.5 px-4">Lokasi Wilayah</th>
                  <th className="py-3.5 px-4">Status Alat</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="p-4 text-center"><Skeleton className="h-4 w-4 mx-auto" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-28 rounded-full" /></td>
                      <td className="p-4 text-center"><Skeleton className="h-8 w-20 mx-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : filteredPos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      Tidak ada data pos pengamatan yang sesuai pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredPos.map((pos, index) => (
                    <tr key={pos.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{pos.nama}</div>
                        <div className="font-mono text-[11px] text-slate-400">{pos.kode_pos}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-slate-700">{pos.tipe || "Hidrologi"}</span>
                        <div className="text-[11px] text-slate-400">{pos.jenis}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{[pos.kabupaten, pos.provinsi].filter(Boolean).join(", ") || "-"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(pos.status_alat)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/pos/${pos.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-[11px] transition-colors"
                        >
                          <span>Detail</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}