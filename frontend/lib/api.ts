import axios, { AxiosInstance } from "axios";
import {
  Dokumen,
  FilterParams,
  PaginatedResponse,
  Pengukuran,
  Pos,
  PosTimeseriesResponse,
  TelemetryItem,
  Walidata,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ============================================================================
// REALISTIC RESILIENT FALLBACK DATA
// (Digunakan otomatis saat backend Laravel belum dinyalakan / network offline)
// ============================================================================

export const FALLBACK_WALIDATA: Walidata[] = [
  {
    id: 1,
    nama: "Balai Besar Wilayah Sungai Serayu Opak",
    singkatan: "BBWS SO",
    deskripsi: "Unit Pelaksana Teknis Direktorat Jenderal Sumber Daya Air Kementerian PU pengelola WS Serayu Opak.",
    logo_path: "/images/logo-pupr.png",
    website_url: "https://sda.pu.go.id/balai/bbwsserayuopak",
    layanan_url: "https://sih3.bbwsserayuopak.id",
    kontak_wa: "+6281234567890",
    kontak_telp: "(0274) 489172",
    pos_count: 42,
  },
  {
    id: 2,
    nama: "BMKG Stasiun Klimatologi D.I. Yogyakarta",
    singkatan: "BMKG DIY",
    deskripsi: "Penyedia data hidrometeorologi, curah hujan, dan klimatologi wilayah D.I. Yogyakarta.",
    logo_path: "/images/logo-bmkg.png",
    website_url: "https://staklim-yogya.bmkg.go.id",
    layanan_url: "https://dataonline.bmkg.go.id",
    kontak_wa: "+628112345678",
    kontak_telp: "(0274) 2880151",
    pos_count: 28,
  },
  {
    id: 3,
    nama: "Dinas PUP ESDM D.I. Yogyakarta",
    singkatan: "DPUPESDM DIY",
    deskripsi: "Instansi teknis pengelola infrastruktur sumber daya air, irigasi, dan air tanah tingkat Provinsi DIY.",
    logo_path: "/images/logo-diy.png",
    website_url: "https://pupesdm.jogjaprov.go.id",
    layanan_url: null,
    kontak_wa: "+6281298765432",
    kontak_telp: "(0274) 589091",
    pos_count: 19,
  },
  {
    id: 4,
    nama: "Dinas Pusdataru Provinsi Jawa Tengah",
    singkatan: "PUSDATARU JATENG",
    deskripsi: "Dinas Pengelolaan Sumber Daya Air dan Penataan Ruang Provinsi Jawa Tengah pengelola WS Serayu Bogowonto.",
    logo_path: "/images/logo-jateng.png",
    website_url: "https://pusdataru.jatengprov.go.id",
    layanan_url: null,
    kontak_wa: null,
    kontak_telp: "(024) 7608201",
    pos_count: 24,
  },
  {
    id: 5,
    nama: "Dinas Lingkungan Hidup dan Kehutanan D.I. Yogyakarta",
    singkatan: "DLHK DIY",
    deskripsi: "Penyedia data pemantauan kualitas air permukaan dan kelestarian ekosistem DAS Progo Opak.",
    logo_path: "/images/logo-diy.png",
    website_url: "https://dlhk.jogjaprov.go.id",
    layanan_url: null,
    kontak_wa: null,
    kontak_telp: "(0274) 562628",
    pos_count: 12,
  },
  {
    id: 6,
    nama: "Perum Jasa Tirta I",
    singkatan: "PJT I",
    deskripsi: "BUMN pengelola pemanfaatan air baku dan operasi waduk di wilayah sungai strategis nasional.",
    logo_path: "/images/logo-pjt.png",
    website_url: "https://jasatirta1.co.id",
    layanan_url: null,
    kontak_wa: null,
    kontak_telp: "(0341) 551971",
    pos_count: 8,
  },
];

export const FALLBACK_TELEMETRY: TelemetryItem[] = [
  {
    id: 1,
    kode_pos: "AWLR-PRG-01",
    nama: "Pos AWLR Kranggan (S. Progo)",
    tipe: "hidrologi",
    jenis: "AWLR",
    wilayah_sungai: "WS Serayu Opak",
    das: "DAS Progo",
    sub_das: "Sub-DAS Progo Tengah",
    sungai: "Sungai Progo",
    desa: "Kranggan",
    kecamatan: "Kranggan",
    kabupaten: "Temanggung",
    provinsi: "Jawa Tengah",
    latitude: -7.2612,
    longitude: 110.2034,
    status_alat: "aktif",
    walidata_id: 1,
    walidata: { id: 1, nama: "Balai Besar Wilayah Sungai Serayu Opak", singkatan: "BBWS SO" },
    nilai: 2.45,
    satuan: "m",
    status_siaga: "normal",
    recorded_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    latest_pengukuran: {
      id: 101,
      recorded_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      nilai: 2.45,
      satuan: "m",
      status_siaga: "normal",
      parameter_tambahan: { debit_estimasi_m3s: 142.8 },
    },
  },
  {
    id: 2,
    kode_pos: "ARR-KLR-02",
    nama: "Pos ARR Kaliurang (Lereng Merapi)",
    tipe: "hidrometeorologi",
    jenis: "ARR",
    wilayah_sungai: "WS Serayu Opak",
    das: "DAS Opak-Oyo",
    sub_das: "Sub-DAS Opak Hulu",
    sungai: "Sungai Kuning",
    desa: "Hargobinangun",
    kecamatan: "Pakem",
    kabupaten: "Sleman",
    provinsi: "D.I. Yogyakarta",
    latitude: -7.5982,
    longitude: 110.4285,
    status_alat: "aktif",
    walidata_id: 1,
    walidata: { id: 1, nama: "Balai Besar Wilayah Sungai Serayu Opak", singkatan: "BBWS SO" },
    nilai: 34.5,
    satuan: "mm",
    status_siaga: "waspada",
    recorded_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    latest_pengukuran: {
      id: 102,
      recorded_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      nilai: 34.5,
      satuan: "mm",
      status_siaga: "waspada",
      parameter_tambahan: { intensitas_jam: "Lebat" },
    },
  },
  {
    id: 3,
    kode_pos: "AWLR-OPK-04",
    nama: "Pos AWLR Rogobangsan (S. Opak)",
    tipe: "hidrologi",
    jenis: "AWLR",
    wilayah_sungai: "WS Serayu Opak",
    das: "DAS Opak-Oyo",
    sub_das: "Sub-DAS Opak Hilir",
    sungai: "Sungai Opak",
    desa: "Pleret",
    kecamatan: "Pleret",
    kabupaten: "Bantul",
    provinsi: "D.I. Yogyakarta",
    latitude: -7.8694,
    longitude: 110.4121,
    status_alat: "aktif",
    walidata_id: 1,
    walidata: { id: 1, nama: "Balai Besar Wilayah Sungai Serayu Opak", singkatan: "BBWS SO" },
    nilai: 1.82,
    satuan: "m",
    status_siaga: "normal",
    recorded_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    latest_pengukuran: {
      id: 103,
      recorded_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      nilai: 1.82,
      satuan: "m",
      status_siaga: "normal",
    },
  },
  {
    id: 4,
    kode_pos: "MAT-BYK-07",
    nama: "Pos MAT Banyakan (CAT Yogyakarta)",
    tipe: "hidrogeologi",
    jenis: "MAT",
    wilayah_sungai: "WS Serayu Opak",
    das: "DAS Opak-Oyo",
    sub_das: "CAT Yogyakarta-Sleman",
    sungai: "-",
    desa: "Sitimulyo",
    kecamatan: "Piyungan",
    kabupaten: "Bantul",
    provinsi: "D.I. Yogyakarta",
    latitude: -7.8421,
    longitude: 110.4357,
    status_alat: "aktif",
    walidata_id: 3,
    walidata: { id: 3, nama: "Dinas PUP ESDM D.I. Yogyakarta", singkatan: "DPUPESDM DIY" },
    nilai: 8.40,
    satuan: "m",
    status_siaga: "normal",
    recorded_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    latest_pengukuran: {
      id: 104,
      recorded_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      nilai: 8.40,
      satuan: "m",
      status_siaga: "normal",
    },
  },
  {
    id: 5,
    kode_pos: "ARR-SRM-05",
    nama: "Pos ARR Waduk Sermo (Kulon Progo)",
    tipe: "hidrometeorologi",
    jenis: "ARR",
    wilayah_sungai: "WS Serayu Opak",
    das: "DAS Serang",
    sub_das: "Sub-DAS Sermo",
    sungai: "Sungai Ngrancah",
    desa: "Hargowilis",
    kecamatan: "Kokap",
    kabupaten: "Kulon Progo",
    provinsi: "D.I. Yogyakarta",
    latitude: -7.8285,
    longitude: 110.1246,
    status_alat: "aktif",
    walidata_id: 2,
    walidata: { id: 2, nama: "BMKG Stasiun Klimatologi D.I. Yogyakarta", singkatan: "BMKG DIY" },
    nilai: 18.2,
    satuan: "mm",
    status_siaga: "normal",
    recorded_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    latest_pengukuran: {
      id: 105,
      recorded_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      nilai: 18.2,
      satuan: "mm",
      status_siaga: "normal",
    },
  },
  {
    id: 6,
    kode_pos: "PQA-WNS-08",
    nama: "Pos Kualitas Air Sungai Bogowonto",
    tipe: "hidrologi",
    jenis: "Kualitas Air",
    wilayah_sungai: "WS Serayu Opak",
    das: "DAS Bogowonto",
    sub_das: "Sub-DAS Bogowonto Tengah",
    sungai: "Sungai Bogowonto",
    desa: "Bener",
    kecamatan: "Bener",
    kabupaten: "Purworejo",
    provinsi: "Jawa Tengah",
    latitude: -7.6412,
    longitude: 110.0456,
    status_alat: "aktif",
    walidata_id: 5,
    walidata: { id: 5, nama: "Dinas Lingkungan Hidup dan Kehutanan D.I. Yogyakarta", singkatan: "DLHK DIY" },
    nilai: 7.35,
    satuan: "pH",
    status_siaga: "normal",
    recorded_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    latest_pengukuran: {
      id: 106,
      recorded_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      nilai: 7.35,
      satuan: "pH",
      status_siaga: "normal",
      parameter_tambahan: { do_mg_l: 6.4, tds_ppm: 145 },
    },
  },
];

export const FALLBACK_POS: Pos[] = [
  ...FALLBACK_TELEMETRY.map((item) => ({
    id: item.id,
    kode_pos: item.kode_pos,
    nama: item.nama,
    tipe: item.tipe,
    jenis: item.jenis,
    wilayah_sungai: item.wilayah_sungai,
    das: item.das,
    sub_das: item.sub_das,
    sungai: item.sungai,
    desa: item.desa,
    kecamatan: item.kecamatan,
    kabupaten: item.kabupaten,
    provinsi: item.provinsi,
    latitude: item.latitude,
    longitude: item.longitude,
    walidata_id: item.walidata_id,
    walidata: item.walidata,
    status_alat: item.status_alat,
    foto_path: item.foto_path,
    latest_pengukuran: item.latest_pengukuran
      ? {
          id: item.latest_pengukuran.id,
          pos_id: item.id,
          recorded_at: item.latest_pengukuran.recorded_at,
          nilai: item.latest_pengukuran.nilai,
          satuan: item.latest_pengukuran.satuan,
          status_siaga: item.latest_pengukuran.status_siaga,
          parameter_tambahan: item.latest_pengukuran.parameter_tambahan,
        }
      : null,
  })),
  {
    id: 7,
    kode_pos: "AWLR-SRY-09",
    nama: "Pos AWLR Banyumas (Sungai Serayu)",
    tipe: "hidrologi",
    jenis: "AWLR",
    wilayah_sungai: "WS Serayu Opak",
    das: "DAS Serayu",
    sub_das: "Sub-DAS Serayu Hilir",
    sungai: "Sungai Serayu",
    desa: "Kedunguter",
    kecamatan: "Banyumas",
    kabupaten: "Banyumas",
    provinsi: "Jawa Tengah",
    latitude: -7.5182,
    longitude: 109.2941,
    status_alat: "aktif",
    walidata_id: 4,
    walidata: { id: 4, nama: "Dinas Pusdataru Provinsi Jawa Tengah", singkatan: "PUSDATARU JATENG" },
    latest_pengukuran: {
      id: 107,
      pos_id: 7,
      recorded_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      nilai: 3.12,
      satuan: "m",
      status_siaga: "normal",
    },
  },
  {
    id: 8,
    kode_pos: "ARR-SLM-10",
    nama: "Pos ARR Berbah (Sleman Timur)",
    tipe: "hidrometeorologi",
    jenis: "ARR",
    wilayah_sungai: "WS Serayu Opak",
    das: "DAS Opak-Oyo",
    sub_das: "Sub-DAS Opak Tengah",
    sungai: "Sungai Opak",
    desa: "Sendangtirto",
    kecamatan: "Berbah",
    kabupaten: "Sleman",
    provinsi: "D.I. Yogyakarta",
    latitude: -7.8012,
    longitude: 110.4512,
    status_alat: "aktif",
    walidata_id: 1,
    walidata: { id: 1, nama: "Balai Besar Wilayah Sungai Serayu Opak", singkatan: "BBWS SO" },
    latest_pengukuran: {
      id: 108,
      pos_id: 8,
      recorded_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      nilai: 4.0,
      satuan: "mm",
      status_siaga: "normal",
    },
  },
];

export const FALLBACK_DOKUMEN: Dokumen[] = [
  {
    id: 1,
    judul: "Peraturan Pemerintah No. 30 Tahun 2024 tentang Pengelolaan Sumber Daya Air",
    kategori: "regulasi",
    tahun: 2024,
    nomor_dokumen: "PP No. 30/2024",
    deskripsi: "Landasan operasional terpadu koordinasi pengelolaan SIH3 lintas kementerian dan lembaga.",
    file_path: "/storage/dokumen/pp-30-2024.pdf",
    file_size: 2840000,
    file_extension: "pdf",
    download_count: 312,
  },
  {
    id: 2,
    judul: "Undang-Undang No. 17 Tahun 2019 tentang Sumber Daya Air",
    kategori: "regulasi",
    tahun: 2019,
    nomor_dokumen: "UU No. 17/2019",
    deskripsi: "Regulasi induk tata kelola air nasional, hak asasi atas air, dan penyelenggaraan sistem informasi hidrologi.",
    file_path: "/storage/dokumen/uu-17-2019.pdf",
    file_size: 4210000,
    file_extension: "pdf",
    download_count: 540,
  },
  {
    id: 3,
    judul: "SOP Analisis Mutu & Pemantauan Kualitas Air Wilayah Sungai Serayu Opak 2025",
    kategori: "sop",
    tahun: 2025,
    nomor_dokumen: "SOP/BBWSSO/SDA/2025-04",
    deskripsi: "Tata cara baku pengambilan sampel lapangan, pengawetan botol, dan kalibrasi sensor telemetri hidrologi.",
    file_path: "/storage/dokumen/sop-mutu-air-2025.pdf",
    file_size: 1530000,
    file_extension: "pdf",
    download_count: 184,
  },
  {
    id: 4,
    judul: "SOP Penyelenggaraan Sistem Peringatan Dini Banjir (Flood Early Warning System)",
    kategori: "sop",
    tahun: 2025,
    nomor_dokumen: "SOP/BBWSSO/HIDRO/2025-01",
    deskripsi: "Prosedur operasional pelaporan status siaga duga air AWLR dari stasiun telemetri ke pusat komando posko banjir.",
    file_path: "/storage/dokumen/sop-fews-2025.pdf",
    file_size: 1980000,
    file_extension: "pdf",
    download_count: 226,
  },
  {
    id: 5,
    judul: "Buletin Hidrologi Semester I Tahun 2026 - Analisis Neraca Air WS Serayu Opak",
    kategori: "buletin",
    tahun: 2026,
    nomor_dokumen: "BLT/2026/S1",
    deskripsi: "Publikasi berkala analisis ketersediaan air sungai, tampungan waduk, dan pola curah hujan spasial.",
    file_path: "/storage/dokumen/buletin-hidrologi-2026-s1.pdf",
    file_size: 5620000,
    file_extension: "pdf",
    download_count: 158,
  },
  {
    id: 6,
    judul: "Laporan Tahunan Evaluasi Debit Ekstrem & Kekeringan WS Serayu Opak 2025",
    kategori: "laporan",
    tahun: 2025,
    nomor_dokumen: "LAP/EVAL/2025",
    deskripsi: "Rekapitulasi hidrograf banjir puncak dan debit andalan musim kemarau di seluruh pos duga air aktif.",
    file_path: "/storage/dokumen/laporan-evaluasi-debit-2025.pdf",
    file_size: 7890000,
    file_extension: "pdf",
    download_count: 98,
  },
];

// ============================================================================
// API HELPER FUNCTIONS
// ============================================================================

/**
 * Memeriksa status kesehatan endpoint API Backend Laravel
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await apiClient.get("/telemetry/summary?limit=1", { timeout: 2500 });
    return res.status === 200;
  } catch {
    return false;
  }
}

/**
 * Mengambil ringkasan telemetri stasiun pos aktif terkini untuk strip beranda
 */
export async function getTelemetrySummary(params?: {
  jenis?: string;
  tipe?: string;
  das?: string;
}): Promise<TelemetryItem[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data: TelemetryItem[] }>(
      "/telemetry/summary",
      { params }
    );
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return FALLBACK_TELEMETRY;
  } catch (err) {
    console.warn("[SIH3 API] Gagal memuat telemetry summary dari backend, memuat data fallback.", err);
    return FALLBACK_TELEMETRY;
  }
}

/**
 * Mengambil daftar stasiun pos pemantauan dengan filter dan paginasi
 */
export async function getPosList(
  params?: FilterParams
): Promise<PaginatedResponse<Pos>> {
  try {
    const response = await apiClient.get<PaginatedResponse<Pos>>("/pos", { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data;
    }
    throw new Error("Invalid response format");
  } catch (err) {
    console.warn("[SIH3 API] Gagal memuat daftar pos dari backend, menyajikan fallback lokal.", err);
    
    // Filter lokal sederhana untuk fallback jika backend belum aktif
    let filtered = [...FALLBACK_POS];
    if (params?.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.kode_pos.toLowerCase().includes(q) ||
          p.das.toLowerCase().includes(q)
      );
    }
    if (params?.tipe && params.tipe !== "semua") {
      filtered = filtered.filter((p) => p.tipe.toLowerCase() === params.tipe?.toLowerCase());
    }
    if (params?.jenis) {
      filtered = filtered.filter((p) => p.jenis.toLowerCase() === params.jenis?.toLowerCase());
    }
    if (params?.das) {
      filtered = filtered.filter((p) => p.das.toLowerCase() === params.das?.toLowerCase());
    }

    const perPage = params?.per_page || 15;
    const page = params?.page || 1;
    const total = filtered.length;
    const from = (page - 1) * perPage;
    const paged = filtered.slice(from, from + perPage);

    return {
      success: true,
      data: paged,
      meta: {
        current_page: page,
        last_page: Math.ceil(total / perPage) || 1,
        per_page: perPage,
        total: total,
        from: total > 0 ? from + 1 : null,
        to: total > 0 ? Math.min(from + perPage, total) : null,
      },
      links: {
        first: "/api/v1/pos?page=1",
        last: `/api/v1/pos?page=${Math.ceil(total / perPage) || 1}`,
        prev: page > 1 ? `/api/v1/pos?page=${page - 1}` : null,
        next: page < Math.ceil(total / perPage) ? `/api/v1/pos?page=${page + 1}` : null,
      },
    };
  }
}

/**
 * Mengambil detail stasiun pos tunggal berdasarkan ID
 */
export async function getPosDetail(id: number | string): Promise<Pos | null> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Pos }>(`/pos/${id}`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (err) {
    console.warn(`[SIH3 API] Gagal memuat pos #${id}, mencari data fallback.`, err);
    return FALLBACK_POS.find((p) => p.id === Number(id)) || FALLBACK_POS[0] || null;
  }
}

/**
 * Mengambil data timeseries deret waktu pengukuran stasiun pos untuk grafik
 */
export async function getPosTimeseries(
  id: number | string,
  params?: { start_date?: string; end_date?: string; limit?: number }
): Promise<PosTimeseriesResponse> {
  try {
    const response = await apiClient.get<PosTimeseriesResponse>(`/pos/${id}/timeseries`, {
      params,
    });
    if (response.data && response.data.success) {
      return response.data;
    }
    throw new Error("Invalid timeseries format");
  } catch (err) {
    console.warn(`[SIH3 API] Gagal memuat timeseries pos #${id}, membuat mock realistis.`, err);
    
    // Generate timeseries realistis berdasarkan stasiun dan rentang tanggal
    const matchedPos = FALLBACK_POS.find((p) => p.id === Number(id)) || FALLBACK_POS[0];
    const mockData: Pengukuran[] = [];
    const now = Date.now();

    // Tentukan jumlah titik dan interval waktu berdasarkan rentang start_date
    let totalPoints = 28; // Default ~7 hari (tiap 6 jam)
    let intervalHours = 6;
    if (params?.start_date) {
      const diffMs = Math.max(1000 * 3600 * 24, now - new Date(params.start_date).getTime());
      const diffDays = Math.ceil(diffMs / (1000 * 3600 * 24));
      if (diffDays <= 7) {
        totalPoints = 28;
        intervalHours = 6;
      } else if (diffDays <= 30) {
        totalPoints = 30;
        intervalHours = 24;
      } else {
        totalPoints = 90;
        intervalHours = 24;
      }
    }

    const jenis = matchedPos?.jenis || "AWLR";
    let satuan = "m";
    if (jenis === "ARR") satuan = "mm";
    else if (jenis === "Kualitas Air") satuan = "pH";
    else if (jenis === "Klimatologi") satuan = "°C";

    for (let i = totalPoints; i >= 0; i--) {
      const time = new Date(now - i * intervalHours * 3600 * 1000).toISOString();
      let val = 0;
      let status: "normal" | "waspada" | "siaga" = "normal";

      if (jenis === "ARR") {
        // Curah hujan (mm): variasi ada hari kering (0 mm) dan hujan sporadis
        const isRainy = i % 4 === 1 || i % 7 === 2 || i === 3;
        val = isRainy ? Number((Math.sin(i * 1.7) * 25 + 28).toFixed(1)) : 0;
        if (val > 40) status = "siaga";
        else if (val > 20) status = "waspada";
      } else if (jenis === "MAT") {
        // Muka Air Tanah (m di bawah muka tanah)
        const base = 8.2;
        val = Number((base + Math.sin(i / 5) * 0.6).toFixed(2));
        status = "normal";
      } else if (jenis === "Kualitas Air") {
        // Kualitas air (pH)
        val = Number((7.2 + Math.sin(i / 4) * 0.35).toFixed(2));
        status = "normal";
      } else {
        // Default AWLR (Tinggi Muka Air Sungai)
        const base = 2.15;
        const variation = Math.sin(i / 3.5) * 0.65 + (Math.cos(i / 2) * 0.2);
        val = Math.max(0.4, Number((base + variation).toFixed(2)));
        if (val > 3.1) status = "siaga";
        else if (val > 2.6) status = "waspada";
      }

      mockData.push({
        id: 1000 + i,
        pos_id: Number(id),
        recorded_at: time,
        nilai: val,
        satuan,
        status_siaga: status,
      });
    }

    return {
      success: true,
      pos: {
        id: Number(id),
        kode_pos: matchedPos?.kode_pos || "AWLR-DEMO-01",
        nama: matchedPos?.nama || "Pos Pemantauan Demo",
        jenis: matchedPos?.jenis || "AWLR",
        tipe: matchedPos?.tipe || "hidrologi",
      },
      count: mockData.length,
      data: mockData,
    };
  }
}

/**
 * Mengambil daftar publikasi dokumen dan SOP
 */
export async function getDokumenList(
  params?: FilterParams
): Promise<PaginatedResponse<Dokumen>> {
  try {
    const response = await apiClient.get<PaginatedResponse<Dokumen>>("/dokumen", { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data;
    }
    throw new Error("Invalid response");
  } catch (err) {
    console.warn("[SIH3 API] Gagal memuat dokumen dari backend, menyajikan fallback lokal.", err);
    let filtered = [...FALLBACK_DOKUMEN];
    if (params?.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.judul.toLowerCase().includes(q) ||
          (d.nomor_dokumen && d.nomor_dokumen.toLowerCase().includes(q))
      );
    }
    if (params?.kategori && params.kategori !== "semua") {
      if (params.kategori === "buletin_laporan") {
        filtered = filtered.filter(
          (d) => d.kategori.toLowerCase() === "buletin" || d.kategori.toLowerCase() === "laporan"
        );
      } else {
        filtered = filtered.filter((d) => d.kategori.toLowerCase() === params.kategori?.toLowerCase());
      }
    }
    if (params?.tahun) {
      filtered = filtered.filter((d) => d.tahun === Number(params.tahun));
    }

    const perPage = params?.per_page || 15;
    const page = params?.page || 1;
    const total = filtered.length;
    const from = (page - 1) * perPage;
    const paged = filtered.slice(from, from + perPage);

    return {
      success: true,
      data: paged,
      meta: {
        current_page: page,
        last_page: Math.ceil(total / perPage) || 1,
        per_page: perPage,
        total: total,
        from: total > 0 ? from + 1 : null,
        to: total > 0 ? Math.min(from + perPage, total) : null,
      },
      links: {
        first: "/api/v1/dokumen?page=1",
        last: `/api/v1/dokumen?page=${Math.ceil(total / perPage) || 1}`,
        prev: page > 1 ? `/api/v1/dokumen?page=${page - 1}` : null,
        next: page < Math.ceil(total / perPage) ? `/api/v1/dokumen?page=${page + 1}` : null,
      },
    };
  }
}

/**
 * Mengambil daftar seluruh instansi mitra walidata SIH3
 */
export async function getWalidataList(params?: {
  q?: string;
  sort_by?: string;
  sort_direction?: string;
}): Promise<Walidata[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Walidata[] }>("/walidata", {
      params,
    });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return FALLBACK_WALIDATA;
  } catch (err) {
    console.warn("[SIH3 API] Gagal memuat walidata dari backend, menyajikan fallback lokal.", err);
    let list = [...FALLBACK_WALIDATA];
    if (params?.q) {
      const q = params.q.toLowerCase();
      list = list.filter(
        (w) =>
          w.nama.toLowerCase().includes(q) ||
          w.singkatan.toLowerCase().includes(q) ||
          (w.deskripsi && w.deskripsi.toLowerCase().includes(q))
      );
    }
    return list;
  }
}

/**
 * Menghasilkan URL langsung untuk unduh ekspor single pos (CSV / XLSX)
 */
export function getExportUrl(
  id: number | string,
  format: "csv" | "xlsx" = "csv",
  range?: { start_date?: string; end_date?: string }
): string {
  const query = new URLSearchParams();
  query.set("format", format);
  if (range?.start_date) query.set("start_date", range.start_date);
  if (range?.end_date) query.set("end_date", range.end_date);

  return `${API_BASE_URL}/pos/${id}/export?${query.toString()}`;
}

/**
 * Menghasilkan URL langsung untuk unduh berkas publikasi dokumen
 */
export function getDokumenDownloadUrl(id: number | string): string {
  return `${API_BASE_URL}/dokumen/${id}/download`;
}

/**
 * Mengirim permintaan ekspor batch banyak pos pemantauan sekaligus (POST)
 */
export async function postBatchExport(
  posIds: number[],
  format: "csv" | "xlsx" = "csv",
  range?: { start_date?: string; end_date?: string }
): Promise<Blob> {
  const payload = {
    pos_ids: posIds,
    format,
    ...(range?.start_date && { start_date: range.start_date }),
    ...(range?.end_date && { end_date: range.end_date }),
  };

  const response = await apiClient.post("/pos/batch-export", payload, {
    responseType: "blob",
  });
  return response.data;
}
