"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronRight,
  Search,
  Filter,
  Calendar,
  Download,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle2,
  RefreshCw,
  X,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import type { Pos, Pengukuran, PosTimeseriesResponse } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { DatasetHero } from "@/components/dataset/DatasetHero";

type PosData = {
  pos: Pos;
  pengukuran: Pengukuran[];
};

// Palet warna resmi dan harmonis untuk 4 garis perbandingan
const COLOR_PALETTE = [
  "#14396A", // PUPR Deep Navy
  "#D97706", // PUPR Amber Gold / Ochre
  "#059669", // Emerald Green
  "#7C3AED", // Royal Violet
];

export default function AnalisisDataPage() {
  const [daftarPos, setDaftarPos] = useState<Pos[]>([]);
  const [memuatPos, setMemuatPos] = useState<boolean>(true);
  const [jenisPosDipilih, setJenisPosDipilih] = useState<string>("");
  const [cariPos, setCariPos] = useState<string>("");
  const [posTerpilih, setPosTerpilih] = useState<string[]>([]);
  const [dataPerPos, setDataPerPos] = useState<PosData[]>([]);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState("");
  const [halamanTabel, setHalamanTabel] = useState(1);
  const jumlahPerHalaman = 10;

  // Inisialisasi default 30 hari terakhir
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    setTanggalSelesai(end.toISOString().split("T")[0]);
    setTanggalMulai(start.toISOString().split("T")[0]);
  }, []);

  // Memuat daftar seluruh pos dari backend
  useEffect(() => {
    async function muatDaftarPos() {
      setMemuatPos(true);
      try {
        const response = await apiClient.get("/pos", {
          params: { per_page: 100 },
          timeout: 20000,
        });

        if (!response.data?.success || !Array.isArray(response.data.data)) {
          throw new Error("Format respons daftar pos tidak sesuai.");
        }

        setDaftarPos(response.data.data);

        if (response.data.data.length === 0) {
          setError(
            "Belum ada data pos pengamatan yang tersedia. Data akan ditampilkan setelah ditambahkan oleh pengelola SIH3."
          );
        } else {
          setError("");
        }
      } catch {
        setError(
          "Daftar pos gagal dimuat dari API. Periksa koneksi backend SIH3."
        );
      } finally {
        setMemuatPos(false);
      }
    }

    void muatDaftarPos();
  }, []);

  // Filter daftar pos berdasarkan jenis dan pencarian teks
  const daftarPosTersaring = useMemo(() => {
    return daftarPos.filter((pos) => {
      const matchJenis = jenisPosDipilih ? pos.jenis === jenisPosDipilih : true;
      const query = cariPos.toLowerCase().trim();
      const matchCari = query
        ? pos.nama?.toLowerCase().includes(query) ||
          pos.kode_pos?.toLowerCase().includes(query) ||
          pos.sungai?.toLowerCase().includes(query) ||
          pos.kabupaten?.toLowerCase().includes(query)
        : true;
      return matchJenis && matchCari;
    });
  }, [daftarPos, jenisPosDipilih, cariPos]);

  // Daftar jenis pos yang tersedia
  const daftarJenis = useMemo(() => {
    return [...new Set(daftarPos.map((pos) => pos.jenis).filter(Boolean))].sort();
  }, [daftarPos]);

  // Pemilihan pos (toggle 2-4 pos)
  function pilihPos(id: string) {
    setPosTerpilih((sebelumnya) => {
      if (sebelumnya.includes(id)) {
        return sebelumnya.filter((item) => item !== id);
      }

      if (sebelumnya.length >= 4) {
        setError("Maksimal 4 pos dapat dipilih sekaligus untuk perbandingan.");
        return sebelumnya;
      }

      setError("");
      return [...sebelumnya, id];
    });
  }

  // Preset rentang tanggal cepat
  function setRentangCepat(hari: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - hari);
    setTanggalSelesai(end.toISOString().split("T")[0]);
    setTanggalMulai(start.toISOString().split("T")[0]);
  }

  // Memuat data timeseries untuk perbandingan
  async function muatDataPerbandingan() {
    if (posTerpilih.length < 2 || posTerpilih.length > 4) {
      setError("Pilih 2 sampai 4 pos pengamatan untuk dibandingkan.");
      return;
    }

    if (!tanggalMulai || !tanggalSelesai || tanggalMulai > tanggalSelesai) {
      setError("Pilih rentang tanggal mulai dan tanggal selesai yang valid.");
      return;
    }

    setMemuat(true);
    setError("");
    setDataPerPos([]);
    setHalamanTabel(1);

    try {
      const hasil = await Promise.all(
        posTerpilih.map(async (id) => {
          const response = await apiClient.get<PosTimeseriesResponse>(
            `/pos/${id}/timeseries`,
            {
              params: {
                start_date: tanggalMulai,
                end_date: tanggalSelesai,
              },
            }
          );

          if (!response.data?.success || !Array.isArray(response.data.data)) {
            throw new Error(`Respons data pos ${id} tidak valid.`);
          }

          const pos = daftarPos.find((item) => item.id === Number(id));

          if (!pos) {
            throw new Error(`Informasi pos ${id} tidak ditemukan.`);
          }

          return {
            pos,
            pengukuran: response.data.data,
          };
        })
      );

      setDataPerPos(hasil);
    } catch {
      setError(
        "Data pengukuran gagal dimuat dari server. Pastikan pos memiliki data pada rentang tanggal yang dipilih."
      );
    } finally {
      setMemuat(false);
    }
  }

  // Kalkulasi satuan
  const daftarSatuan = useMemo(() => {
    return [
      ...new Set(
        dataPerPos.flatMap(({ pengukuran }) =>
          pengukuran
            .filter(
              (item) =>
                typeof item.nilai === "number" && Number.isFinite(item.nilai)
            )
            .map((item) => item.satuan?.trim())
            .filter((satuan): satuan is string => Boolean(satuan))
        )
      ),
    ];
  }, [dataPerPos]);

  const satuanBerbeda = daftarSatuan.length > 1;
  const bisaDuaSumbu = daftarSatuan.length === 2;

  // Satuan per pos
  const satuanPerPos: Record<string, string> = useMemo(() => {
    const hasil: Record<string, string> = {};
    dataPerPos.forEach(({ pos, pengukuran }) => {
      const dataBersatuan = pengukuran.find(
        (item) =>
          typeof item.nilai === "number" &&
          Number.isFinite(item.nilai) &&
          Boolean(item.satuan?.trim())
      );
      hasil[String(pos.id)] = dataBersatuan?.satuan?.trim() ?? "";
    });
    return hasil;
  }, [dataPerPos]);

  function sumbuUntukPos(posId: number) {
    if (bisaDuaSumbu && satuanPerPos[String(posId)] === daftarSatuan[1]) {
      return "kanan";
    }
    return "kiri";
  }

  // Statistik perbandingan
  const statistik = useMemo(() => {
    return dataPerPos.map(({ pos, pengukuran }) => {
      const nilaiValid = pengukuran
        .map((item) => item.nilai)
        .filter(
          (nilai): nilai is number =>
            typeof nilai === "number" && Number.isFinite(nilai)
        );

      return {
        pos,
        jumlah: nilaiValid.length,
        satuan: satuanPerPos[String(pos.id)] || "-",
        minimum: nilaiValid.length ? Math.min(...nilaiValid) : null,
        maksimum: nilaiValid.length ? Math.max(...nilaiValid) : null,
        rataRata: nilaiValid.length
          ? nilaiValid.reduce((total, nilai) => total + nilai, 0) /
            nilaiValid.length
          : null,
      };
    });
  }, [dataPerPos, satuanPerPos]);

  // Data format garis grafik Recharts
  const dataGrafik = useMemo(() => {
    return Object.values(
      dataPerPos.reduce<Record<string, Record<string, string | number | null>>>(
        (hasil, { pos, pengukuran }) => {
          pengukuran.forEach((item) => {
            const waktu = item.recorded_at;
            const nilai = Number(item.nilai);

            if (!waktu || item.nilai == null || !Number.isFinite(nilai)) {
              return;
            }

            if (!hasil[waktu]) {
              hasil[waktu] = { waktu };
            }

            hasil[waktu][String(pos.id)] = nilai;
          });

          return hasil;
        },
        {}
      )
    ).sort(
      (a, b) =>
        new Date(String(a.waktu)).getTime() -
        new Date(String(b.waktu)).getTime()
    );
  }, [dataPerPos]);

  // Data baris tabel perbandingan & pagination
  const semuaBarisTabel = useMemo(() => {
    return dataPerPos.flatMap(({ pos, pengukuran }) =>
      pengukuran.map((item) => ({ pos, item }))
    );
  }, [dataPerPos]);

  const totalHalaman = Math.max(
    1,
    Math.ceil(semuaBarisTabel.length / jumlahPerHalaman)
  );

  const barisHalamanIni = useMemo(() => {
    return semuaBarisTabel.slice(
      (halamanTabel - 1) * jumlahPerHalaman,
      halamanTabel * jumlahPerHalaman
    );
  }, [semuaBarisTabel, halamanTabel]);

  // Fungsi ekspor CSV
  function eksporCSV() {
    const baris = [
      ["Nama Pos", "Kode Pos", "Waktu Pengukuran", "Nilai", "Satuan"],
      ...dataPerPos.flatMap(({ pos, pengukuran }) =>
        pengukuran.map((item) => [
          pos.nama,
          pos.kode_pos,
          item.recorded_at,
          item.nilai === null ? "" : String(item.nilai),
          item.satuan,
        ])
      ),
    ];

    const isi = baris
      .map((barisData) =>
        barisData
          .map((nilai) => `"${String(nilai).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", isi], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const tautan = document.createElement("a");

    tautan.href = url;
    tautan.download = `analisis-perbandingan-sih3-${tanggalMulai}-sd-${tanggalSelesai}.csv`;
    tautan.click();

    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* 1. HERO SECTION DENGAN IDENTITAS PUPR */}
      <DatasetHero
        kicker="Portal SIH3 Wilayah Sungai Serayu Opak"
        title="Analisis & Perbandingan Data"
        description="Bandingkan fluktuasi dan tren pengukuran tinggi muka air, curah hujan, maupun kualitas air dari berbagai pos pemantauan secara simultan."
      />

      {/* 2. AREA KONTEN UTAMA */}
      <main className="min-h-screen bg-page py-8 sm:py-10 text-ink">
        <Container className="space-y-8">
          {/* Breadcrumb navigasi */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[12px] font-medium text-ink-muted"
          >
            <Link
              href="/"
              className="hover:text-primary transition-colors hover:underline"
            >
              Beranda
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#AEB8C5]" />
            <span className="text-ink font-semibold">Analisis Data</span>
          </nav>

          {/* 3. CARD FILTER & PARAMETER SELECTION */}
          <section className="rounded-xl border border-hairline bg-white shadow-sm overflow-hidden transition-all duration-200">
            {/* Header Filter Bar */}
            <div className="border-b border-hairline bg-slate-50/70 px-5 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold text-ink">
                  Parameter & Filter Perbandingan
                </h2>
                <p className="text-[12px] text-ink-muted">
                  Tentukan stasiun pengamatan (2 hingga 4 pos) dan periode tanggal.
                </p>
              </div>

              {/* Kuota Pos Terpilih (Teks Minimalis) */}
              <div className="text-xs text-ink-muted">
                Terpilih:{" "}
                <strong className="font-semibold text-ink">
                  {posTerpilih.length} / 4 pos
                </strong>
              </div>
            </div>

            {/* Form Body Filter */}
            <div className="p-5 sm:p-6 grid gap-6 lg:grid-cols-12">
              {/* Kolom Kiri: Pemilihan Stasiun (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Dropdown Filter Jenis Pos */}
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="filter-jenis"
                      className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5"
                    >
                      Kategori Jenis Pos
                    </label>
                    <div className="relative">
                      <select
                        id="filter-jenis"
                        value={jenisPosDipilih}
                        onChange={(e) => {
                          setJenisPosDipilih(e.target.value);
                          setPosTerpilih([]);
                          setDataPerPos([]);
                          setError("");
                        }}
                        className="w-full appearance-none rounded-lg border border-hairline bg-white px-3.5 py-2.5 pr-8 text-xs font-medium text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      >
                        <option value="">Semua Jenis Pos ({daftarPos.length})</option>
                        {daftarJenis.map((jenis) => (
                          <option key={jenis} value={jenis}>
                            {jenis}
                          </option>
                        ))}
                      </select>
                      <Filter className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Input Pencarian Pos */}
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="cari-pos"
                      className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5"
                    >
                      Cari Nama Pos / Kode
                    </label>
                    <div className="relative">
                      <input
                        id="cari-pos"
                        type="text"
                        placeholder="Contoh: Kranggan, Sermo..."
                        value={cariPos}
                        onChange={(e) => setCariPos(e.target.value)}
                        className="w-full rounded-lg border border-hairline bg-white pl-9 pr-3.5 py-2.5 text-xs text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                      <Search className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Box Daftar Checkbox Pos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-ink-muted">
                      Menampilkan {daftarPosTersaring.length} pos tersedia:
                    </span>
                    {posTerpilih.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPosTerpilih([])}
                        className="text-[11px] font-semibold text-rose-600 hover:underline"
                      >
                        Reset Pilihan
                      </button>
                    )}
                  </div>

                  <div className="max-h-[280px] overflow-y-auto space-y-1.5 rounded-lg border border-hairline bg-slate-50/50 p-2.5 sm:p-3 scrollbar-thin">
                    {memuatPos ? (
                      <div className="py-8 text-center text-xs text-ink-muted flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                        <span>Memuat daftar pos pemantauan...</span>
                      </div>
                    ) : daftarPosTersaring.length > 0 ? (
                      daftarPosTersaring.map((pos) => {
                        const isSelected = posTerpilih.includes(String(pos.id));
                        const isDisabled =
                          !isSelected && posTerpilih.length >= 4;

                        return (
                          <label
                            key={pos.id}
                            className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs transition-all select-none cursor-pointer ${
                              isSelected
                                ? "bg-white border-primary shadow-xs ring-1 ring-primary/20"
                                : isDisabled
                                ? "opacity-50 cursor-not-allowed bg-slate-100/60 border-transparent"
                                : "bg-white border-slate-200/80 hover:border-primary/40 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isDisabled}
                              onChange={() => pilihPos(String(pos.id))}
                              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-ink truncate">
                                  {pos.nama}
                                </span>
                                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 shrink-0">
                                  {pos.jenis}
                                </span>
                              </div>
                              <p className="text-[11px] text-ink-muted truncate mt-0.5">
                                Kode: <span className="font-mono">{pos.kode_pos}</span>
                                {pos.sungai ? ` · Sungai: ${pos.sungai}` : ""}
                                {pos.kabupaten ? ` · Kab. ${pos.kabupaten}` : ""}
                              </p>
                            </div>
                          </label>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center text-xs text-ink-muted">
                        Tidak ada pos pengamatan yang cocok dengan filter.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Periode Tanggal & Tombol Bandingkan (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                      Rentang Waktu Cepat
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 text-xs">
                      {[
                        { label: "7 Hari", hari: 7 },
                        { label: "30 Hari", hari: 30 },
                        { label: "3 Bulan", hari: 90 },
                        { label: "1 Tahun", hari: 365 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setRentangCepat(preset.hari)}
                          className="px-2 py-1.5 rounded-md border border-hairline bg-white hover:bg-primary/5 hover:border-primary/40 text-ink text-[11px] font-medium transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Tanggal Mulai & Selesai */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>Tanggal Mulai:</span>
                      </label>
                      <input
                        type="date"
                        value={tanggalMulai}
                        onChange={(e) => setTanggalMulai(e.target.value)}
                        className="w-full rounded-lg border border-hairline bg-white px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ink mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>Tanggal Selesai:</span>
                      </label>
                      <input
                        type="date"
                        value={tanggalSelesai}
                        onChange={(e) => setTanggalSelesai(e.target.value)}
                        className="w-full rounded-lg border border-hairline bg-white px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Chip Ringkasan Pos Terpilih */}
                  {posTerpilih.length > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[11px] font-medium text-ink-muted block mb-1.5">
                        Stasiun yang akan dianalisis:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {posTerpilih.map((id, index) => {
                          const p = daftarPos.find((x) => String(x.id) === id);
                          const color =
                            COLOR_PALETTE[index % COLOR_PALETTE.length];
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border shadow-2xs"
                              style={{ borderColor: `${color}40`, color: color }}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              <span className="truncate max-w-[120px]">
                                {p?.nama || id}
                              </span>
                              <button
                                type="button"
                                onClick={() => pilihPos(id)}
                                className="hover:opacity-75"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tombol Utama Bandingkan Data */}
                <div>
                  <button
                    type="button"
                    onClick={muatDataPerbandingan}
                    disabled={memuat || posTerpilih.length < 2}
                    className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber px-5 text-sm font-semibold text-[#0E2A4E] shadow-sm transition-all hover:bg-amber-dark disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                  >
                    {memuat ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-[#0E2A4E]" />
                        <span>Memproses Perbandingan...</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 text-[#0E2A4E]" />
                        <span>Bandingkan Data ({posTerpilih.length} Pos)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Alert Error / Catatan jika ada */}
            {error && (
              <div
                role="alert"
                className="border-t border-rose-200 bg-rose-50 px-5 py-3.5 text-xs text-rose-800 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}
          </section>

          {/* 4. HASIL ANALISIS (TERPANGGIL JIKA DATA PER POS ADA) */}
          {dataPerPos.length > 0 && (
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              {/* STATISTIK PENGUKURAN */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[18px] font-bold text-ink">
                      Ringkasan Statistik Komparasi
                    </h2>
                    <p className="text-xs text-ink-muted">
                      Perhitungan nilai ekstrem dan rata-rata pada periode pengukuran.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {statistik.map((item, index) => {
                    const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
                    return (
                      <div
                        key={item.pos.id}
                        className="relative overflow-hidden rounded-xl border border-hairline bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div
                          className="absolute top-0 left-0 right-0 h-1"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span
                              className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold font-mono"
                              style={{
                                backgroundColor: `${color}15`,
                                color: color,
                              }}
                            >
                              {item.pos.kode_pos}
                            </span>
                            <h3 className="mt-1 font-semibold text-[14px] text-ink truncate">
                              {item.pos.nama}
                            </h3>
                            <p className="text-[11px] text-ink-muted truncate">
                              {item.pos.jenis} · Satuan:{" "}
                              <strong className="text-ink">{item.satuan}</strong>
                            </p>
                          </div>
                          <span
                            className="w-3 h-3 rounded-full shrink-0 mt-1"
                            style={{ backgroundColor: color }}
                          />
                        </div>

                        <div className="mt-3.5 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                          <div className="bg-slate-50 rounded-lg p-2">
                            <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                              Minimum
                            </span>
                            <span className="font-semibold font-mono text-[13px] text-ink">
                              {item.minimum !== null
                                ? item.minimum.toLocaleString("id-ID")
                                : "—"}
                            </span>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                              Maksimum
                            </span>
                            <span className="font-semibold font-mono text-[13px] text-ink">
                              {item.maksimum !== null
                                ? item.maksimum.toLocaleString("id-ID")
                                : "—"}
                            </span>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                              Rata-Rata
                            </span>
                            <span className="font-semibold font-mono text-[13px] text-ink">
                              {item.rataRata !== null
                                ? item.rataRata.toFixed(2)
                                : "—"}
                            </span>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                              Data Valid
                            </span>
                            <span className="font-semibold font-mono text-[13px] text-ink">
                              {item.jumlah}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* GRAFIK PERBANDINGAN PENGUKURAN */}
              <section className="rounded-xl border border-hairline bg-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="border-b border-hairline pb-4">
                  <h2 className="text-[17px] font-semibold text-ink">
                    Grafik Perbandingan Tren Pengukuran
                  </h2>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Visualisasi pergerakan nilai data pengukuran antarpos pengamatan.
                  </p>
                </div>

                {/* Area Render Recharts */}
                {dataGrafik.length > 0 ? (
                  <div className="h-96 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dataGrafik}
                        margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#E2E8F0"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="waktu"
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                            })
                          }
                          tick={{ fill: "#64748B", fontSize: 11 }}
                          stroke="#CBD5E1"
                        />
                        <YAxis
                          yAxisId="kiri"
                          orientation="left"
                          width={65}
                          tick={{ fill: "#64748B", fontSize: 11 }}
                          stroke="#CBD5E1"
                          label={
                            bisaDuaSumbu
                              ? {
                                  value: daftarSatuan[0],
                                  angle: -90,
                                  position: "insideLeft",
                                  fill: "#14396A",
                                  fontSize: 11,
                                  fontWeight: 600,
                                }
                              : undefined
                          }
                        />
                        {bisaDuaSumbu && (
                          <YAxis
                            yAxisId="kanan"
                            orientation="right"
                            width={65}
                            tick={{ fill: "#64748B", fontSize: 11 }}
                            stroke="#CBD5E1"
                            label={{
                              value: daftarSatuan[1],
                              angle: 90,
                              position: "insideRight",
                              fill: "#D97706",
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          />
                        )}
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          wrapperStyle={{ paddingTop: "15px" }}
                          iconType="circle"
                        />

                        {dataPerPos.map(({ pos }, index) => {
                          const color =
                            COLOR_PALETTE[index % COLOR_PALETTE.length];
                          return (
                            <Line
                              key={pos.id}
                              yAxisId={sumbuUntukPos(pos.id)}
                              type="monotone"
                              dataKey={String(pos.id)}
                              name={
                                bisaDuaSumbu && satuanPerPos[String(pos.id)]
                                  ? `${pos.nama} (${satuanPerPos[String(pos.id)]})`
                                  : pos.nama
                              }
                              stroke={color}
                              strokeWidth={2.5}
                              dot={false}
                              activeDot={{ r: 5, strokeWidth: 1, stroke: "#FFF" }}
                              connectNulls={false}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-ink-muted">
                    Belum ada data pengukuran yang tersedia dalam rentang waktu ini.
                  </div>
                )}
              </section>

              {/* TABEL DATA HASIL PERBANDINGAN */}
              <section className="rounded-xl border border-hairline bg-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-hairline pb-4">
                  <div>
                    <h2 className="text-[17px] font-semibold text-ink">
                      Tabel Rincian Data Perbandingan
                    </h2>
                    <p className="text-xs text-ink-muted">
                      Total {semuaBarisTabel.length} catatan pengukuran dari pos
                      terpilih.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={eksporCSV}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor ke CSV</span>
                  </button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-lg border border-hairline">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-table-head text-ink font-semibold uppercase tracking-wider text-[11px] border-b border-hairline">
                      <tr>
                        <th className="py-3 px-4">Nama Stasiun</th>
                        <th className="py-3 px-4">Waktu Pengukuran</th>
                        <th className="py-3 px-4 text-right">Nilai Angka</th>
                        <th className="py-3 px-4">Satuan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {barisHalamanIni.map(({ pos, item }, index) => {
                        const posIdx = posTerpilih.indexOf(String(pos.id));
                        const color =
                          COLOR_PALETTE[
                            (posIdx >= 0 ? posIdx : index) %
                              COLOR_PALETTE.length
                          ];
                        return (
                          <tr
                            key={`${pos.id}-${item.id}-${index}`}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="font-semibold text-ink">
                                  {pos.nama}
                                </span>
                                <span className="text-[10px] text-ink-muted font-mono">
                                  ({pos.kode_pos})
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600 font-mono">
                              {new Date(item.recorded_at).toLocaleString(
                                "id-ID",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-semibold text-ink">
                              {item.nilai !== null
                                ? Number(item.nilai).toLocaleString("id-ID")
                                : "—"}
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-medium text-[11px]">
                                {item.satuan || "-"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-ink-muted">
                  <p>
                    Menampilkan{" "}
                    <strong className="text-ink">
                      {barisHalamanIni.length > 0
                        ? (halamanTabel - 1) * jumlahPerHalaman + 1
                        : 0}
                    </strong>{" "}
                    –{" "}
                    <strong className="text-ink">
                      {Math.min(
                        halamanTabel * jumlahPerHalaman,
                        semuaBarisTabel.length
                      )}
                    </strong>{" "}
                    dari <strong className="text-ink">{semuaBarisTabel.length}</strong> data
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setHalamanTabel((prev) => Math.max(1, prev - 1))
                      }
                      disabled={halamanTabel === 1}
                      className="px-3 py-1.5 rounded-md border border-hairline bg-white hover:bg-slate-50 text-ink disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      Sebelumnya
                    </button>

                    <span className="px-2 font-medium">
                      Halaman {halamanTabel} dari {totalHalaman}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setHalamanTabel((prev) =>
                          Math.min(totalHalaman, prev + 1)
                        )
                      }
                      disabled={halamanTabel >= totalHalaman}
                      className="px-3 py-1.5 rounded-md border border-hairline bg-white hover:bg-slate-50 text-ink disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}

// Tooltip khusus untuk Recharts
interface CustomTooltipItem {
  name: string;
  value: number | string | null;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipItem[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length && label) {
    return (
      <div className="rounded-lg border border-hairline bg-white p-3 shadow-lg text-xs min-w-[200px]">
        <p className="font-semibold text-ink mb-2 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          {new Date(label).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color || "#14396A" }}
                  />
                  <span className="font-medium text-slate-700">
                    {entry.name}:
                  </span>
                </span>
                <span className="font-semibold font-mono text-ink">
                  {typeof entry.value === "number"
                    ? entry.value.toLocaleString("id-ID")
                    : entry.value ?? "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}
