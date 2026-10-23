"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Download,
  Loader2,
  X,
  FileCheck,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Dokumen } from "@/lib/types";
import { toast } from "sonner";

export default function AdminDokumenPage() {
  const { token } = useAuth();
  const [dokumenList, setDokumenList] = useState<Dokumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterKategori, setFilterKategori] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDokumen, setEditingDokumen] = useState<Dokumen | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Regulasi",
    tahun: new Date().getFullYear().toString(),
    deskripsi: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/dokumen?per_page=100${
          filterKategori ? `&kategori=${filterKategori}` : ""
        }`
      );
      setDokumenList(res.data?.data || []);
    } catch {
      toast.error("Gagal memuat repositori dokumen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterKategori]);

  const openAddModal = () => {
    setEditingDokumen(null);
    setFormData({
      judul: "",
      kategori: "Regulasi",
      tahun: new Date().getFullYear().toString(),
      deskripsi: "",
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doc: Dokumen) => {
    setEditingDokumen(doc);
    setFormData({
      judul: doc.judul || "",
      kategori: doc.kategori || "Regulasi",
      tahun: String(doc.tahun || new Date().getFullYear()),
      deskripsi: doc.deskripsi || "",
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/dokumen/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Dokumen berhasil dihapus.");
      fetchData();
    } catch {
      toast.error("Gagal menghapus dokumen.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("judul", formData.judul);
      data.append("kategori", formData.kategori);
      data.append("tahun", formData.tahun);
      data.append("deskripsi", formData.deskripsi);
      if (selectedFile) {
        data.append("file", selectedFile);
      }

      if (editingDokumen) {
        await axios.post(`${API_BASE_URL}/dokumen/${editingDokumen.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Dokumen publikasi berhasil diperbarui!");
      } else {
        await axios.post(`${API_BASE_URL}/dokumen`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Dokumen publikasi baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      let msg = "Gagal menyimpan dokumen.";
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
            <FileText className="w-6 h-6 text-[#14396A]" />
            <span>Repositori Dokumen Publikasi</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola SOP, buku pedoman teknis, peraturan perundang-undangan, dan buletin hidrologi.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0E2A4E] hover:bg-[#14396A] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Dokumen Baru</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
        >
          <option value="">Semua Kategori Dokumen</option>
          <option value="Regulasi">Regulasi & Peraturan</option>
          <option value="SOP">Standar Operasional Prosedur (SOP)</option>
          <option value="Pedoman Teknis">Pedoman Teknis</option>
          <option value="Buletin">Buletin Hidrologi</option>
          <option value="Laporan">Laporan Tahunan</option>
        </select>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#0E2A4E]" />
            <span className="text-sm">Memuat repositori dokumen...</span>
          </div>
        ) : dokumenList.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            Tidak ada dokumen publikasi yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-[#0A2140] text-white text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Judul Dokumen</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tahun</th>
                  <th className="py-3 px-4">Format / Ukuran</th>
                  <th className="py-3 px-4">Total Diunduh</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dokumenList.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{doc.judul}</div>
                      {doc.deskripsi && (
                        <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {doc.deskripsi}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {doc.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-gray-700">
                      {doc.tahun}
                    </td>
                    <td className="py-3 px-4 text-xs uppercase text-gray-500">
                      {doc.file_extension || "PDF"} (
                      {doc.file_size
                        ? `${(doc.file_size / 1024 / 1024).toFixed(1)} MB`
                        : "1.2 MB"}
                      )
                    </td>
                    <td className="py-3 px-4 text-xs font-mono font-semibold text-gray-700">
                      {doc.download_count || 0} kali
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`${API_BASE_URL}/dokumen/${doc.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Unduh Berkas"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Ubah Dokumen"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Dokumen"
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

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingDokumen ? "Ubah Data Dokumen" : "Unggah Dokumen Publikasi Baru"}
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
                  Judul Dokumen *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: SOP Pemeliharaan Pos AWLR 2026"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kategori Dokumen *
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  >
                    <option value="Regulasi">Regulasi</option>
                    <option value="SOP">SOP</option>
                    <option value="Pedoman Teknis">Pedoman Teknis</option>
                    <option value="Buletin">Buletin</option>
                    <option value="Laporan">Laporan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tahun Terbit *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.tahun}
                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi / Ringkasan Dokumen
                </label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Keterangan singkat mengenai substansi isi dokumen..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Berkas File (PDF / DOC / XLS / ZIP)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Ukuran maksimal berkas: 20 MB. Kosongkan jika tidak mengganti berkas yang ada.
                </span>
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
                  {saving ? "Menyimpan..." : "Simpan Dokumen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

