"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Radio,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  ArrowLeft,
  Droplets,
  CloudRain,
  Waves,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Pos, Walidata } from "@/lib/types";
import { toast } from "sonner";

// Daftar kategori tipe pos beserta ikon & warnanya
const KATEGORI_POS = [
  {
    tipe: "hidrologi",
    label: "Pos Hidrologi",
    deskripsi: "Stasiun duga air (AWLR) dan pemantauan aliran sungai.",
    icon: Droplets,
    color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
  },
  {
    tipe: "hidrometeorologi",
    label: "Pos Hidrometeorologi",
    deskripsi: "Pos curah hujan (ARR) dan parameter klimatologi wilayah.",
    icon: CloudRain,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
  },
  {
    tipe: "hidrogeologi",
    label: "Pos Hidrogeologi",
    deskripsi: "Sumur pantau air tanah (MAT) dan investigasi akuifer.",
    icon: Waves,
    color: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
  },
];

// Mapping jenis alat yang valid sesuai dengan database
const PILIHAN_JENIS_ALAT: Record<string, string[]> = {
  hidrologi: ["AWLR", "Kualitas Air"],
  hidrometeorologi: ["ARR", "Klimatologi"],
  hidrogeologi: ["MAT"],
};

// Daftar Kabupaten/Kota berdasarkan Provinsi
const DAFTAR_KABUPATEN: Record<string, string[]> = {
  "D.I. Yogyakarta": [
    "Gunungkidul",
    "Kota Yogyakarta",
    "Kulon Progo",
    "Sleman",
  ],
  "Jawa Tengah": [
    "Banjarnegara",
    "Banyumas",
    "Batang",
    "Boyolali",
    "Brebes",
    "Cilacap",
    "Kebumen",
    "Kendal",
    "Klaten",
    "Kota Magelang",
    "Magelang",
    "Pekalongan",
    "Pemalang",
    "Purbalingga",
    "Purworejo",
    "Semarang",
    "Sukoharjo",
    "Temanggung",
    "Wonogiri",
    "Wonosobo",
  ],
};

export default function AdminPosPage() {
  const { token } = useAuth();
  const [posList, setPosList] = useState<Pos[]>([]);
  const [walidataList, setWalidataList] = useState<Walidata[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk navigasi kategori aktif
  const [activeTipe, setActiveTipe] = useState<string>("");
  const [search, setSearch] = useState("");

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
    wilayah_sungai: "WS Progo-Opak-Serang",
    das: "DAS Progo",
    sub_das: "",
    sungai: "",
    desa: "",
    kecamatan: "",
    kabupaten: "Sleman",
    provinsi: "D.I. Yogyakarta",
    latitude: "",
    longitude: "",
    status_alat: "aktif",
    foto_path: "",
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
    } catch {
      toast.error("Gagal memuat daftar pos pemantauan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = (defaultTipe = "hidrologi") => {
    setEditingPos(null);
    const defaultJenis = PILIHAN_JENIS_ALAT[defaultTipe]?.[0] || "AWLR";
    setFormData({
      nama: "",
      kode_pos: "",
      tipe: defaultTipe,
      jenis: defaultJenis,
      wilayah_sungai: "WS Progo-Opak-Serang",
      das: "DAS Progo",
      sub_das: "",
      sungai: "",
      desa: "",
      kecamatan: "",
      kabupaten: "Sleman",
      provinsi: "D.I. Yogyakarta",
      latitude: "",
      longitude: "",
      status_alat: "aktif",
      foto_path: "",
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
      wilayah_sungai: pos.wilayah_sungai || "WS Progo-Opak-Serang",
      das: pos.das || "",
      sub_das: pos.sub_das || "",
      sungai: pos.sungai || "",
      desa: pos.desa || "",
      kecamatan: pos.kecamatan || "",
      kabupaten: pos.kabupaten || "",
      provinsi: pos.provinsi || "D.I. Yogyakarta",
      latitude: pos.latitude ? String(pos.latitude) : "",
      longitude: pos.longitude ? String(pos.longitude) : "",
      status_alat: pos.status_alat || "aktif",
      foto_path: pos.foto_path || "",
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

  // Filter data berdasarkan kategori tipe aktif dan pencarian
  const filteredList = posList.filter((item) => {
    const matchesTipe = activeTipe ? item.tipe === activeTipe : true;
    const matchesSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_pos.toLowerCase().includes(search.toLowerCase()) ||
      (item.das && item.das.toLowerCase().includes(search.toLowerCase())) ||
      (item.kabupaten && item.kabupaten.toLowerCase().includes(search.toLowerCase()));

    return matchesTipe && matchesSearch;
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
        </div>
        <button
          onClick={() => openAddModal(activeTipe || "hidrologi")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0E2A4E] hover:bg-[#14396A] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pos Baru</span>
        </button>
      </div>

      {/* KONDISI 1: JIKA BELUM MEMILIH KATEGORI */}
      {!activeTipe ? (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Silakan Pilih Pos Pemantauan:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {KATEGORI_POS.map((kat) => {
              const IconComponent = kat.icon;
              const count = posList.filter((p) => p.tipe === kat.tipe).length;

              return (
                <div
                  key={kat.tipe}
                  onClick={() => setActiveTipe(kat.tipe)}
                  className="p-6 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between bg-white group hover:border-[#14396A]/40"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${kat.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#14396A] transition-colors">
                        {kat.label}
                      </h3>
                      <span className="text-xs font-mono font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        {count} Pos
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {kat.deskripsi}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#14396A]">
                    <span>Kelola Data Pos</span>
                    <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* KONDISI 2: JIKA SUDAH MEMILIH KATEGORI */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTipe("")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Pilihan Kategori Tipe Pos</span>
            </button>
            <div className="text-sm font-semibold text-[#14396A] bg-blue-50 px-3 py-1 rounded-full uppercase">
              Kategori Aktif: {activeTipe}
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
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
          </div>

          {/* Table Data */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#0E2A4E]" />
                <span className="text-sm">Memuat data pos kategori {activeTipe}...</span>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm space-y-3">
                <p>Tidak ada pos pemantauan dalam kategori <strong>{activeTipe}</strong> yang sesuai.</p>
                <button
                  onClick={() => openAddModal(activeTipe)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Pos di Kategori Ini
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-[#0A2140] text-white text-xs uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Kode Pos</th>
                      <th className="py-3 px-4">Nama Pos</th>
                      <th className="py-3 px-4">Jenis Alat</th>
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
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
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
              {/* Nama & Kode Pos */}
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

              {/* Tipe & Jenis Alat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tipe Data *
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => {
                      const newTipe = e.target.value;
                      const defaultJenis = PILIHAN_JENIS_ALAT[newTipe]?.[0] || "AWLR";
                      setFormData({ 
                        ...formData, 
                        tipe: newTipe,
                        jenis: defaultJenis 
                      });
                    }}
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
                  <select
                    required
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  >
                    {(PILIHAN_JENIS_ALAT[formData.tipe] || ["AWLR"]).map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Wilayah Sungai (Dropdown Diperbarui), DAS, Sub-DAS, Sungai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Wilayah Sungai *
                  </label>
                  <select
                    required
                    value={formData.wilayah_sungai}
                    onChange={(e) => setFormData({ ...formData, wilayah_sungai: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  >
                    <option value="WS Progo-Opak-Serang">WS Progo-Opak-Serang</option>
                    <option value="WS Serayu Bogowonto">WS Serayu Bogowonto</option>
                  </select>
                </div>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sub-DAS
                  </label>
                  <input
                    type="text"
                    value={formData.sub_das}
                    onChange={(e) => setFormData({ ...formData, sub_das: e.target.value })}
                    placeholder="Sub-DAS Bedog"
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
              </div>

              {/* Desa, Kecamatan, Kabupaten, Provinsi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Desa / Kelurahan
                  </label>
                  <input
                    type="text"
                    value={formData.desa}
                    onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                    placeholder="Desa Sinduadi"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    placeholder="Kecamatan Mlati"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Provinsi *
                  </label>
                  <select
                    required
                    value={formData.provinsi}
                    onChange={(e) => {
                      const newProvinsi = e.target.value;
                      const defaultKabupaten = DAFTAR_KABUPATEN[newProvinsi]?.[0] || "";
                      setFormData({
                        ...formData,
                        provinsi: newProvinsi,
                        kabupaten: defaultKabupaten,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  >
                    <option value="D.I. Yogyakarta">D.I. Yogyakarta</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kabupaten / Kota *
                  </label>
                  <select
                    required
                    value={formData.kabupaten}
                    onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                  >
                    {(DAFTAR_KABUPATEN[formData.provinsi] || []).map((kab) => (
                      <option key={kab} value={kab}>
                        {kab}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Koordinat (Latitude & Longitude) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="-7.765432"
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

              {/* Mitra Walidata, Status Alat, & Foto Path */}
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL / Path Foto Pos (`foto_path`)
                </label>
                <input
                  type="text"
                  value={formData.foto_path}
                  onChange={(e) => setFormData({ ...formData, foto_path: e.target.value })}
                  placeholder="/images/pos/awlr-kranggan.jpg"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#14396A]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 cursor-pointer"
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