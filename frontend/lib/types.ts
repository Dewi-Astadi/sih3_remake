/**
 * Tipe data TypeScript SIH3 Serayu Opak
 * Standar integrasi Frontend (Next.js) & Backend REST API (Laravel 11)
 */

export type StatusAlat = 'aktif' | 'rusak' | 'perbaikan' | string;
export type StatusSiaga = 'normal' | 'waspada' | 'siaga' | 'awas' | string;
export type TipePos = 'hidrologi' | 'hidrometeorologi' | 'hidrogeologi' | string;
export type JenisPos = 'AWLR' | 'ARR' | 'MAT' | 'Kualitas Air' | 'Klimatologi' | string;
export type KategoriDokumen = 'regulasi' | 'sop' | 'buletin' | 'laporan' | string;

export interface Walidata {
  id: number;
  nama: string;
  singkatan: string;
  deskripsi?: string | null;
  logo_path?: string | null;
  website_url?: string | null;
  layanan_url?: string | null;
  kontak_wa?: string | null;
  kontak_telp?: string | null;
  pos_count?: number;
  pos?: Pos[];
  created_at?: string;
  updated_at?: string;
}

export interface Pengukuran {
  id: number;
  pos_id: number;
  recorded_at: string;
  nilai: number | null;
  satuan: string;
  status_siaga: StatusSiaga;
  parameter_tambahan?: Record<string, unknown> | null;
  pos?: Pos | null;
  created_at?: string;
  updated_at?: string;
}

export interface Pos {
  id: number;
  kode_pos: string;
  nama: string;
  tipe: TipePos;
  jenis: JenisPos;
  wilayah_sungai: string;
  das: string;
  sub_das?: string | null;
  sungai?: string | null;
  desa?: string | null;
  kecamatan?: string | null;
  kabupaten?: string | null;
  provinsi?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  walidata_id?: number | null;
  walidata?: Walidata | { id: number; nama: string; singkatan: string } | null;
  status_alat: StatusAlat;
  foto_path?: string | null;
  latest_pengukuran?: Pengukuran | null;
  pengukuran?: Pengukuran[];
  created_at?: string;
  updated_at?: string;
}

export interface TelemetryItem {
  id: number;
  kode_pos: string;
  nama: string;
  tipe: TipePos;
  jenis: JenisPos;
  wilayah_sungai: string;
  das: string;
  sub_das?: string | null;
  sungai?: string | null;
  desa?: string | null;
  kecamatan?: string | null;
  kabupaten?: string | null;
  provinsi?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status_alat: StatusAlat;
  foto_path?: string | null;
  walidata_id?: number | null;
  walidata?: {
    id: number;
    nama: string;
    singkatan: string;
  } | null;
  nilai: number | null;
  satuan: string;
  status_siaga: StatusSiaga;
  recorded_at?: string | null;
  latest_pengukuran?: {
    id: number;
    recorded_at: string;
    nilai: number | null;
    satuan: string;
    status_siaga: StatusSiaga;
    parameter_tambahan?: Record<string, unknown> | null;
  } | null;
}

export interface Dokumen {
  id: number;
  judul: string;
  kategori: KategoriDokumen;
  tahun: number;
  nomor_dokumen?: string | null;
  deskripsi?: string | null;
  file_path: string;
  file_size?: number | null;
  file_extension?: string | null;
  download_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface PosTimeseriesResponse {
  success: boolean;
  pos: {
    id: number;
    kode_pos: string;
    nama: string;
    jenis: string;
    tipe: string;
  };
  count: number;
  data: Pengukuran[];
}

export interface FilterParams {
  q?: string;
  tipe?: string;
  jenis?: string;
  das?: string;
  wilayah_sungai?: string;
  walidata_id?: number | string;
  status_alat?: string;
  kategori?: string;
  tahun?: number | string;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  limit?: number;
}
