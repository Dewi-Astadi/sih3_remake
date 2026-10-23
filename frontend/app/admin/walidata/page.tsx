"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Plus,
  Trash2,
  Edit,
  Phone,
  MessageSquare,
  Globe,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Walidata } from "@/lib/types";
import { toast } from "sonner";

export default function AdminWalidataPage() {
  const { token } = useAuth();
  const [walidataList, setWalidataList] = useState<Walidata[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWalidata, setEditingWalidata] = useState<Walidata | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    singkatan: "",
    deskripsi: "",
    alamat: "",
    telepon: "",
    whatsapp: "",
    email: "",
    website: "",
    url_layanan_data: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/walidata`);
      setWalidataList(res.data?.data || []);
    } catch {
      toast.error("Gagal memuat direktori walidata.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingWalidata(null);
    setFormData({
      nama: "",
      singkatan: "",
      deskripsi: "",
      alamat: "",
      telepon: "",
      whatsapp: "",
      email: "",
      website: "",
      url_layanan_data: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (w: Walidata) => {
    setEditingWalidata(w);
    setFormData({
      nama: w.nama || "",
      singkatan: w.singkatan || "",
      deskripsi: w.deskripsi || "",
      alamat: (w as any).alamat || "",
      telepon: w.kontak_telp || "",
      whatsapp: w.kontak_wa || "",
      email: (w as any).email || "",
      website: w.website_url || "",
      url_layanan_data: w.layanan_url || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data mitra walidata ini?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/walidata/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Mitra walidata berhasil dihapus.");
      fetchData();
    } catch {
      toast.error("Gagal menghapus mitra walidata.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingWalidata) {
        await axios.put(`${API_BASE_URL}/walidata/${editingWalidata.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Data mitra walidata berhasil diperbarui!");
      } else {
        await axios.post(`${API_BASE_URL}/walidata`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Mitra walidata baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      let msg = "Gagal menyimpan mitra walidata.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
      }
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#14396A]" />
            <span>Direktori Mitra Walidata</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola profil instansi mitra kerja sama penyedia data hidrologi, kontak darurat, dan portal layanan data.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0E2A4E] hover:bg-[#14396A] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mitra Baru</span>
        </button>
      </div>

      {/* Grid Cards Data */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#0E2A4E]" />
          <span className="text-sm">Memuat direktori mitra walidata...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {walidataList.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#0A2140] text-white tracking-wide">
                    {item.singkatan}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Ubah Walidata"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Hapus Walidata"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 mt-3 leading-snug">
                  {item.nama}
                </h3>
                {item.deskripsi && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                  {item.kontak_wa && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.kontak_wa}</span>
                    </div>
                  )}
                  {item.kontak_telp && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{item.kontak_telp}</span>
                    </div>
                  )}
                  {item.website_url && (
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <a
                        href={item.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#14396A] hover:underline truncate"
                      >
                        {item.website_url.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Daftar Pos Binaan:</span>
                <span className="font-mono text-[#0E2A4E] text-sm bg-gray-100 px-2 py-0.5 rounded">
                  {item.pos_count || 0} Pos
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingWalidata ? "Ubah Profil Mitra Walidata" : "Tambah Mitra Walidata Baru"}
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
                  Nama Lengkap Instansi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Balai Besar Wilayah Sungai Serayu Opak"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Singkatan / Akronim *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.singkatan}
                    onChange={(e) => setFormData({ ...formData, singkatan: e.target.value })}
                    placeholder="BBWS SO"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nomor WhatsApp Layanan
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+628123456789"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Telepon Kantor
                  </label>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    placeholder="(0274) 489172"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="humas@bbwsserayuopak.id"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Alamat Kantor
                </label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jl. Solo Km. 6, Caturtunggal, Depok, Sleman, D.I. Yogyakarta"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Website Resmi Instansi
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://sda.pu.go.id/balai/bbwsserayuopak"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                />
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
                  {saving ? "Menyimpan..." : "Simpan Walidata"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

