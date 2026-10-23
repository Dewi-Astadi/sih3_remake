"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Pos } from "@/lib/types";
import { toast } from "sonner";

interface PengukuranItem {
  id: number;
  pos_id: number;
  recorded_at: string;
  nilai: number;
  satuan: string;
  status_siaga: "Normal" | "Waspada" | "Siaga" | "Awas";
  pos?: {
    id: number;
    nama: string;
    kode_pos: string;
    jenis: string;
    tipe: string;
  };
}

export default function AdminPengukuranPage() {
  const { token } = useAuth();
  const [pengukuranList, setPengukuranList] = useState<PengukuranItem[]>([]);
  const [posList, setPosList] = useState<Pos[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterPos, setFilterPos] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    pos_id: "",
    recorded_at: new Date().toISOString().slice(0, 16),
    nilai: "",
    satuan: "m",
    status_siaga: "Normal",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPos, resPengukuran] = await Promise.all([
        axios.get(`${API_BASE_URL}/pos?per_page=100`),
        axios.get(
          `${API_BASE_URL}/pengukuran?page=${page}&per_page=20${
            filterPos ? `&pos_id=${filterPos}` : ""
          }${filterStatus ? `&status_siaga=${filterStatus}` : ""}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      setPosList(resPos.data?.data || []);
      setPengukuranList(resPengukuran.data?.data || []);
      setTotalPages(resPengukuran.data?.pagination?.last_page || 1);
    } catch {
      toast.error("Gagal memuat data pengukuran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filterPos, filterStatus]);

  const openAddModal = () => {
    setFormData({
      pos_id: posList[0]?.id ? String(posList[0].id) : "",
      recorded_at: new Date().toISOString().slice(0, 16),
      nilai: "",
      satuan: "m",
      status_siaga: "Normal",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus data rekaman pengukuran ini?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/pengukuran/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Data pengukuran berhasil dihapus.");
      fetchData();
    } catch {
      toast.error("Gagal menghapus data.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(
        `${API_BASE_URL}/pengukuran`,
        {
          ...formData,
          pos_id: parseInt(formData.pos_id),
          nilai: parseFloat(formData.nilai),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Rekaman pengukuran berhasil disimpan!");
      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      let msg = "Gagal menyimpan rekaman pengukuran.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
      }
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Waspada":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Siaga":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Awas":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#14396A]" />
            <span>Pengukuran & Deret Waktu Sensor</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Input rekaman tinggi muka air (TMA), curah hujan harian, dan pantau status ambang siaga.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0E2A4E] hover:bg-[#14396A] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Input Pengukuran Manual</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <select
            value={filterPos}
            onChange={(e) => {
              setFilterPos(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
          >
            <option value="">Semua Pos Pemantauan</option>
            {posList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama} ({p.kode_pos})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
          >
            <option value="">Semua Status Siaga</option>
            <option value="Normal">Normal</option>
            <option value="Waspada">Waspada</option>
            <option value="Siaga">Siaga</option>
            <option value="Awas">Awas</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#0E2A4E]" />
            <span className="text-sm">Memuat data pengukuran...</span>
          </div>
        ) : pengukuranList.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            Tidak ada rekaman pengukuran yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-[#0A2140] text-white text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Pos Pemantauan</th>
                  <th className="py-3 px-4">Waktu Rekam</th>
                  <th className="py-3 px-4">Nilai Terukur</th>
                  <th className="py-3 px-4">Satuan</th>
                  <th className="py-3 px-4">Ambang Batas Siaga</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pengukuranList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">
                        {item.pos?.nama || `Pos #${item.pos_id}`}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {item.pos?.kode_pos}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-gray-600">
                      {new Date(item.recorded_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                      {item.nilai}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {item.satuan}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          item.status_siaga
                        )}`}
                      >
                        {item.status_siaga}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus Rekaman"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Halaman {page} dari {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Measurement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Input Data Pengukuran Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pilih Pos Pemantauan *
                </label>
                <select
                  required
                  value={formData.pos_id}
                  onChange={(e) => {
                    const selPos = posList.find((p) => String(p.id) === e.target.value);
                    setFormData({
                      ...formData,
                      pos_id: e.target.value,
                      satuan: selPos?.tipe === "hidrometeorologi" ? "mm" : "m",
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                >
                  {posList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} ({p.jenis} - {p.kode_pos})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Waktu Rekaman (Tanggal & Jam) *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.recorded_at}
                  onChange={(e) => setFormData({ ...formData, recorded_at: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nilai Angka *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.nilai}
                    onChange={(e) => setFormData({ ...formData, nilai: e.target.value })}
                    placeholder="Contoh: 1.85"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Satuan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    placeholder="m / mm"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Status Ambang Batas Siaga
                </label>
                <select
                  value={formData.status_siaga}
                  onChange={(e) => setFormData({ ...formData, status_siaga: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                >
                  <option value="Normal">Normal (Aman)</option>
                  <option value="Waspada">Waspada (Kuning)</option>
                  <option value="Siaga">Siaga (Oranye)</option>
                  <option value="Awas">Awas (Merah)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#0E2A4E] hover:bg-[#14396A] text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {saving ? "Menyimpan..." : "Simpan Pengukuran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

