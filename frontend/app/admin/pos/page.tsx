"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Radio,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Pos, Walidata } from "@/lib/types";
import { toast } from "sonner";

export default function AdminPosPage() {
  const { token } = useAuth();
  const [posList, setPosList] = useState<Pos[]>([]);
  const [walidataList, setWalidataList] = useState<Walidata[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState<Pos | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    nama: "",
    kode_pos: "",
    tipe: "hidrologi",
    jenis: "AWLR",
    sungai: "",
    das: "",
    sub_das: "",
    kabupaten: "",
    wilayah_sungai: "WS Progo-Opak-Serang",
    latitude: "",
    longitude: "",
    elevasi: "",
    status_alat: "aktif",
    walidata_id: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPos, resWali] = await Promise.all([
        axios.get(`${API_BASE_URL}/pos?per_page=100`),
        axios.get(`${API_BASE_URL}/walidata`),
      ]);
      setPosList(resPos.data?.data || []);
      setWalidataList(resWali.data?.data || []);
    } catch (err) {
      toast.error("Gagal memuat daftar pos pemantauan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingPos(null);
    setFormData({
      nama: "",
      kode_pos: "",
      tipe: "hidrologi",
      jenis: "AWLR",
      sungai: "",
      das: "DAS Progo",
      sub_das: "",
      kabupaten: "Sleman",
      wilayah_sungai: "WS Progo-Opak-Serang",
      latitude: "",
      longitude: "",
      elevasi: "",
      status_alat: "aktif",
      walidata_id: walidataList[0]?.id ? String(walidataList[0].id) : "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pos: Pos) => {
    setEditingPos(pos);
    setFormData({
      nama: pos.nama || "",
      kode_pos: pos.kode_pos || "",
      tipe: pos.tipe || "hidrologi",
      jenis: pos.jenis || "AWLR",
      sungai: pos.sungai || "",
      das: pos.das || "",
      sub_das: pos.sub_das || "",
      kabupaten: pos.kabupaten || "",
      wilayah_sungai: pos.wilayah_sungai || "WS Progo-Opak-Serang",
      latitude: pos.latitude ? String(pos.latitude) : "",
      longitude: pos.longitude ? String(pos.longitude) : "",
      elevasi: pos.elevasi ? String(pos.elevasi) : "",
      status_alat: pos.status_alat || "aktif",
      walidata_id: pos.walidata_id ? String(pos.walidata_id) : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pos pemantauan ini?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/pos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Pos pemantauan berhasil dihapus.");
      fetchData();
    } catch {
      toast.error("Gagal menghapus pos pemantauan.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        elevasi: formData.elevasi ? parseFloat(formData.elevasi) : null,
        walidata_id: formData.walidata_id ? parseInt(formData.walidata_id) : null,
      };

      if (editingPos) {
        await axios.put(`${API_BASE_URL}/pos/${editingPos.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Data pos berhasil diperbarui!");
      } else {
        await axios.post(`${API_BASE_URL}/pos`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Pos pemantauan baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      let msg = "Gagal menyimpan data pos.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
      }
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const filteredList = posList.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_pos.toLowerCase().includes(search.toLowerCase()) ||
      (item.das && item.das.toLowerCase().includes(search.toLowerCase())) ||
      (item.kabupaten && item.kabupaten.toLowerCase().includes(search.toLowerCase()));

    const matchesTipe = filterTipe ? item.tipe === filterTipe : true;
    return matchesSearch && matchesTipe;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-[#14396A]" />
            <span>Manajemen Pos Pemantauan</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola stasiun duga air (AWLR), pos curah hujan (ARR), dan sumur pantau air tanah (MAT).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0E2A4E] hover:bg-[#14396A] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pos Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama pos, kode, DAS, kabupaten..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#14396A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterTipe}
            onChange={(e) => setFilterTipe(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#14396A]"
          >
            <option value="">Semua Tipe Data</option>
            <option value="hidrologi">Hidrologi</option>
            <option value="hidrometeorologi">Hidrometeorologi</option>
            <option value="hidrogeologi">Hidrogeologi</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#0E2A4E]" />
            <span className="text-sm">Memuat data pos...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            Tidak ada pos pemantauan yang sesuai dengan filter pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-[#0A2140] text-white text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Kode Pos</th>
                  <th className="py-3 px-4">Nama Pos</th>
                  <th className="py-3 px-4">Tipe / Jenis</th>
                  <th className="py-3 px-4">DAS / Sungai</th>
                  <th className="py-3 px-4">Kabupaten</th>
                  <th className="py-3 px-4">Status Alat</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredList.map((pos) => (
                  <tr key={pos.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#14396A]">
                      {pos.kode_pos}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {pos.nama}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {pos.jenis}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      <div>{pos.das || "-"}</div>
                      <div className="text-gray-400">{pos.sungai}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {pos.kabupaten || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          pos.status_alat === "aktif"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {pos.status_alat === "aktif" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        <span className="capitalize">{pos.status_alat || "aktif"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(pos)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Ubah Pos"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pos.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Pos"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPos ? "Ubah Data Pos Pemantauan" : "Tambah Pos Pemantauan Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Pos *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: AWLR Kranggan"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kode Pos *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kode_pos}
                    onChange={(e) => setFormData({ ...formData, kode_pos: e.target.value })}
                    placeholder="Contoh: KRG-01"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tipe Data *
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  >
                    <option value="hidrologi">Hidrologi</option>
                    <option value="hidrometeorologi">Hidrometeorologi</option>
                    <option value="hidrogeologi">Hidrogeologi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Jenis Alat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    placeholder="Contoh: AWLR / ARR / MAT"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    DAS
                  </label>
                  <input
                    type="text"
                    value={formData.das}
                    onChange={(e) => setFormData({ ...formData, das: e.target.value })}
                    placeholder="DAS Progo"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sungai
                  </label>
                  <input
                    type="text"
                    value={formData.sungai}
                    onChange={(e) => setFormData({ ...formData, sungai: e.target.value })}
                    placeholder="Sungai Progo"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kabupaten
                  </label>
                  <input
                    type="text"
                    value={formData.kabupaten}
                    onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                    placeholder="Sleman"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="-7.654321"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="110.345678"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mitra Walidata Pengelola
                  </label>
                  <select
                    value={formData.walidata_id}
                    onChange={(e) => setFormData({ ...formData, walidata_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  >
                    <option value="">-- Tanpa Mitra / BBWS SO Langsung --</option>
                    {walidataList.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.nama} ({w.singkatan})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Status Operasional Alat
                  </label>
                  <select
                    value={formData.status_alat}
                    onChange={(e) => setFormData({ ...formData, status_alat: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  >
                    <option value="aktif">Aktif (Beroperasi)</option>
                    <option value="rusak">Rusak / Tidak Aktif</option>
                    <option value="perbaikan">Dalam Perbaikan</option>
                  </select>
                </div>
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
                  {saving ? "Menyimpan..." : "Simpan Data Pos"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

