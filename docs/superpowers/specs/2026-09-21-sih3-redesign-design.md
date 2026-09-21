# Spesifikasi Desain: Redesign Portal SIH3 BBWS Serayu Opak

- **Tanggal Dokumen:** 2026-09-21
- **Status:** Disetujui (Draft Final untuk Perencanaan Implementasi)
- **Lingkup:** Frontend Portal Publik (Next.js) & Backend REST API + Admin CMS (Laravel 11 + Filament v3)

---

## 1. Latar Belakang & Tujuan Proyek

Portal SIH3 (Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi) Wilayah Sungai Serayu Opak saat ini berfungsi sebagai pusat informasi sumber daya air. Namun, antarmuka saat ini memiliki kendala:
1. Navigasi dan visual yang padat dengan banyak warna kontras yang kurang selaras.
2. Peta sebaran spasial memakan ruang utama halaman beranda tetapi kurang optimal untuk pengguna yang memiliki tujuan utama mencari dan mengunduh data tabular.
3. Ketiadaan alur pengunduhan data 1-klik yang praktis; pengguna sering dihadapkan pada alur birokrasi permohonan atau kegagalan sistem internal saat mengunduh data pos.

### Sasaran Redesign
* **Penghilangan Fitur Peta:** Mengganti ruang peta interaktif dengan **Pusat Unduh Data Terpadu (Open Data Explorer)** dan **Live Telemetry Strip** yang informatif.
* **Fokus Pengguna (User-Centric & User-Friendly):** Memudahkan masyarakat umum, akademisi, dan instansi teknis menemukan data pos dan mengunduhnya secara instan dalam format `.xlsx` (Excel), `.csv`, atau ringkasan `.pdf`.
* **Estetika Modern & Clean:** Mengadopsi bahasa desain **Shadcn UI** dengan palet warna minimalis terstandarisasi: netral putih/slate, **Deep Navy** (`#0f172a` / `#1e3a8a`) sebagai warna primer, dan **Warm Amber Gold** (`#f59e0b`) sebagai aksen identitas resmi Kementerian PUPR.
* **Teknologi Terkini:** Menggunakan **Next.js 14+ (App Router)** untuk antarmuka publik dan **Laravel 11** dengan **Filament v3** sebagai backend database dan admin CMS.

---

## 2. Arsitektur Sistem

Sistem menggunakan arsitektur *decoupled* yang memisahkan frontend publik dengan backend operasional:

```
+-------------------------------------------------------------+
|                     Next.js 14+ Frontend                    |
|  - App Router (React Server & Client Components)            |
|  - Shadcn UI + Tailwind CSS + Lucide Icons                  |
|  - TanStack Table (Data Explorer & Batch Download)          |
|  - Recharts (Tren Telemetri Sederhana)                      |
+------------------------------+------------------------------+
                               |
                        REST API (JSON / Streams)
                               |
+------------------------------v------------------------------+
|                     Laravel 11 Backend                      |
|  - REST API Controller (/api/v1/...)                        |
|  - Streaming Data Exporter (FastExcel / PhpSpreadsheet)     |
|  - Filament v3 Admin Panel (/admin)                         |
|  - Database: MySQL / PostgreSQL                             |
+-------------------------------------------------------------+
```

### Struktur Repositori
```
sih3_remake/
├── frontend/                     # Aplikasi Next.js
│   ├── app/
│   │   ├── layout.tsx            # Root shell (Navbar & Footer PUPR)
│   │   ├── page.tsx              # Beranda (Hero Search & Telemetri Strip)
│   │   ├── data-explorer/        # Pusat Pencarian & Unduh Data Pos
│   │   │   └── page.tsx
│   │   ├── pos/[id]/             # Detail Pos & Riwayat Pengukuran
│   │   │   └── page.tsx
│   │   ├── publikasi/            # Katalog Dokumen & Pembaca PDF
│   │   │   └── page.tsx
│   │   └── walidata/             # Direktori Mitra Walidata & Kontak WA
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                   # Komponen Shadcn UI dasar
│   │   ├── layout/               # Navbar, Footer, MobileNav
│   │   └── modules/              # TelemetryCard, FilterToolbar, BatchDownloadBar
│   └── lib/                      # Axios client, types, formatters
│
└── backend/                      # Aplikasi Laravel 11
    ├── app/
    │   ├── Http/Controllers/Api/ # Endpoint publik
    │   ├── Filament/Resources/   # Dashboard admin data pos & berkas
    │   └── Models/               # Pos, Pengukuran, Dokumen, Walidata
    ├── database/migrations/      # Migrasi tabel terindeks
    └── routes/
        ├── api.php               # Rute /api/v1/...
        └── web.php               # Rute Filament /admin
```

---

## 3. Desain Antarmuka & Alur Pengguna (UI/UX)

### 3.1. Design Tokens & Palet Warna
* **Background:** `#ffffff` (Card & Panel), `#f8fafc` / `slate-50` (Page Canvas).
* **Border & Divider:** `#e2e8f0` / `slate-200` (Garis halus 1px).
* **Warna Utama 1 (Deep Navy PUPR):** `#0f172a` (Teks judul, navbar, badge solid, tombol primer).
* **Warna Utama 2 (Warm Amber Gold PUPR):** `#f59e0b` / `#d97706` (Aksen sorotan, tombol CTA unduh, badge status waspada).
* **Warna Status Fungsional:**
  * Normal: `#10b981` (Emerald).
  * Waspada: `#f59e0b` (Amber).
  * Siaga / Awas: `#ef4444` (Rose/Red).

### 3.2. Halaman Beranda (`/`)
* **Navbar:** Menampilkan logo resmi ganda (SIH3 & Kementerian PUPR), link navigasi bersih (*Beranda, Eksplorasi Data, Dokumen, Walidata*), tombol CTA *"Unduh Data"* dengan aksen Amber, dan tombol ghost *"Portal Admin"*.
* **Hero Section:** Headline informatif dengan latar belakang gradien halus, dilengkapi input pencarian universal di tengah yang memungkinkan pengguna mengetik nama pos, sungai, atau kabupaten untuk langsung melompat ke data.
* **Live Telemetry Strip:** Deretan kartu ringkas pos pemantauan aktif (AWLR Kranggan, Sermo, dsb.) menampilkan nilai Tinggi Muka Air (TMA) atau curah hujan real-time, waktu rekaman terakhir, dan indikator status siaga.
* **3 Kartu Pilar Data:** Navigasi kartu cepat menuju 3 jenis data utama:
  1. *Hidrologi* (Duga Air AWLR & Kualitas Air).
  2. *Hidrometeorologi* (Curah Hujan ARR & Klimatologi).
  3. *Hidrogeologi* (Muka Air Tanah / MAT).

### 3.3. Pusat Unduh Data Terpadu (`/data-explorer`)
* **Header Halaman:** Judul bersih dan statistik ketersediaan data (jumlah pos aktif dan pembaruan data).
* **Filter Bar Interaktif:**
  * Tab kategori: `Semua`, `Hidrologi`, `Hidrometeorologi`, `Hidrogeologi`.
  * Pencarian teks instan (nama stasiun, desa, DAS).
  * Dropdown multi-filter: *Wilayah Sungai*, *Daerah Aliran Sungai (DAS)*, dan *Walidata*.
* **Tabel Data (TanStack Table):**
  * Kolom: Checkbox (untuk batch download), No, Nama Stasiun, Kategori & Jenis, Wilayah Sungai / DAS, Walidata Pengelola, Ketersediaan Data, dan Kolom Aksi.
  * Tombol Aksi per baris: Dropdown tombol **Unduh** (`.xlsx` atau `.csv`) yang langsung mengunduh data pos terkait.
* **Floating Batch Download Bar:**
  * Saat satu atau beberapa checkbox dicentang, bilah mengambang muncul di bagian bawah layar: *"X Pos Dipilih — [Unduh Terpilih] [Batalkan Pilihan]"*.
  * Memungkinkan unduh paket gabungan data stasiun sekaligus.

### 3.4. Halaman Detail Pos (`/pos/[id]`)
* Kartu informasi teknis pos (koordinat lintang/bujur, tahun pendirian, instansi walidata penanggung jawab).
* Filter periode data (1 bulan terakhir, 1 tahun terakhir, rentang kustom).
* Grafik tren pengukuran visual sederhana.
* Tabel riwayat angka pengukuran dengan pagination cepat serta tombol ekspor historis lengkap.

### 3.5. Halaman Publikasi Dokumen (`/publikasi`)
* Menampilkan daftar peraturan perundangan SDA, instruksi kerja / SOP hidrologi, dan buletin berkala.
* Fitur pencarian dokumen dan filter kategori.
* Setiap dokumen memiliki tombol **Pratinjau** (membuka modal PDF interaktif) dan tombol **Unduh PDF**.

### 3.6. Direktori Walidata (`/walidata`)
* Kartu modern untuk setiap instansi walidata (BBWS Serayu Opak, BMKG, Dinas PUP ESDM DIY, Pusdataru Jateng, DLHK, Perum Jasa Tirta I).
* Menyertakan ringkasan peran walidata, tautan layanan permohonan data internal mereka, dan tombol kontak WhatsApp resmi.

---

## 4. Spesifikasi Database & REST API

### 4.1. Skema Database (Laravel Migrations)

#### Tabel `walidata`
* `id` (BIGINT, PK, Auto Increment)
* `nama` (VARCHAR 255)
* `singkatan` (VARCHAR 50)
* `deskripsi` (TEXT, Nullable)
* `logo_path` (VARCHAR 255, Nullable)
* `website_url` (VARCHAR 255, Nullable)
* `layanan_url` (VARCHAR 255, Nullable)
* `kontak_wa` (VARCHAR 50, Nullable)
* `kontak_telp` (VARCHAR 50, Nullable)
* `timestamps`

#### Tabel `pos`
* `id` (BIGINT, PK, Auto Increment)
* `kode_pos` (VARCHAR 50, Unique)
* `nama` (VARCHAR 255)
* `tipe` (ENUM: `'hidrologi'`, `'hidrometeorologi'`, `'hidrogeologi'`)
* `jenis` (ENUM: `'AWLR'`, `'Kualitas Air'`, `'ARR'`, `'Klimatologi'`, `'MAT'`)
* `wilayah_sungai` (VARCHAR 150)
* `das` (VARCHAR 150)
* `sub_das` (VARCHAR 150, Nullable)
* `sungai` (VARCHAR 150, Nullable)
* `desa` (VARCHAR 100, Nullable)
* `kecamatan` (VARCHAR 100, Nullable)
* `kabupaten` (VARCHAR 100, Nullable)
* `provinsi` (VARCHAR 100, Nullable)
* `latitude` (DECIMAL 10, 7, Nullable)
* `longitude` (DECIMAL 10, 7, Nullable)
* `walidata_id` (BIGINT, FK ke `walidata.id`)
* `status_alat` (ENUM: `'aktif'`, `'pemeliharaan'`, `'nonaktif'`)
* `foto_path` (VARCHAR 255, Nullable)
* `timestamps`

#### Tabel `pengukuran` (Timeseries Records)
* `id` (BIGINT, PK, Auto Increment)
* `pos_id` (BIGINT, FK ke `pos.id`, Indexed)
* `recorded_at` (DATETIME, Indexed)
* `nilai` (DECIMAL 8, 2)
* `satuan` (VARCHAR 20) — contoh: `m`, `mm`
* `status_siaga` (ENUM: `'normal'`, `'waspada'`, `'siaga'`, `'awas'`)
* `parameter_tambahan` (JSON, Nullable) — untuk pengujian kualitas air (pH, DO, BOD, COD)
* `created_at` (TIMESTAMP)
* *Indeks Gabungan:* `INDEX (pos_id, recorded_at)`

#### Tabel `dokumen`
* `id` (BIGINT, PK, Auto Increment)
* `judul` (VARCHAR 255)
* `kategori` (ENUM: `'regulasi'`, `'sop'`, `'buletin'`, `'laporan'`)
* `tahun` (SMALLINT)
* `nomor_dokumen` (VARCHAR 100, Nullable)
* `file_path` (VARCHAR 255)
* `file_size` (VARCHAR 50)
* `file_extension` (VARCHAR 10)
* `download_count` (BIGINT, Default 0)
* `timestamps`

### 4.2. Spesifikasi Endpoint REST API (`/api/v1/`)

| Method | Endpoint | Query / Body Params | Keterangan & Respon |
|---|---|---|---|
| `GET` | `/telemetry/summary` | - | Mengembalikan daftar status pos real-time terkini |
| `GET` | `/pos` | `tipe`, `jenis`, `das`, `walidata_id`, `q`, `page`, `per_page` | Daftar stasiun pos terpaginasi dengan metadata |
| `GET` | `/pos/{id}` | - | Detail metadata satu stasiun pos |
| `GET` | `/pos/{id}/timeseries` | `start_date`, `end_date`, `interval` | Data deret waktu untuk visualisasi tren |
| `GET` | `/pos/{id}/export` | `format` (`xlsx` / `csv`), `start_date`, `end_date` | Unduh file data pos langsung (Stream Response) |
| `POST` | `/pos/batch-export` | Body: `{ pos_ids: number[], format: 'xlsx'\|'csv', start_date, end_date }` | Unduh file gabungan / arsip ZIP multi-pos |
| `GET` | `/dokumen` | `kategori`, `q`, `page` | Katalog dokumen publikasi |
| `GET` | `/dokumen/{id}/download`| - | Mengunduh berkas PDF publikasi dan menambah counter |
| `GET` | `/walidata` | - | Daftar seluruh mitra walidata beserta nomor kontak |

---

## 5. Keamanan, Penanganan Error & Kinerja

1. **Efisiensi Pengunduhan (Memory Stream):**
   * Pengunduhan CSV dan Excel menggunakan *chunking* dan streaming (`StreamedResponse` Laravel) sehingga tidak menumpuk seluruh rekaman data di RAM server.
2. **Penanganan Kasus Data Kosong:**
   * Jika tidak ada data pada rentang tanggal yang diminta, endpoint ekspor mengembalikan pesan JSON yang ditangkap oleh frontend untuk memunculkan notifikasi toast informatif (*"Data belum tersedia untuk periode ini"*), bukan menghasilkan file korup atau HTTP 500.
3. **Pemberian Beban Wajar (Rate Limiting):**
   * Endpoint publik ekspor dibatasi hingga 60 permintaan per menit per IP untuk mencegah *data scraping* berlebihan.
4. **UI Loading & Skeleton State:**
   * Setiap komponen tabel dan kartu telemetri di Next.js dilengkapi animasi kerangka (*skeleton*) untuk menjaga kenyamanan visual pengguna saat proses *fetching*.
5. **Debounce Pencarian:**
   * Input teks pencarian di frontend menerapkan debounce 300 milidetik untuk menekan lonjakan permintaan API yang tidak perlu.

---

## 6. Panel Admin Pengelola Data (Filament v3)

* Akses khusus staf pengelola di `/admin` dengan autentikasi aman.
* Fitur Utama Admin:
  1. **Manajemen Data Pos:** Tambah, edit, dan atur status operasional stasiun pemantauan.
  2. **Import Data Pengukuran Batch:** Form upload berkas Excel/CSV untuk memasukkan ratusan hingga ribuan data rekaman hidrologi sekaligus.
  3. **Manajemen Publikasi Dokumen:** Upload berkas PDF aturan hukum, SOP, dan buletin.
  4. **Pengelolaan Profil Walidata:** Pembaruan nomor kontak WhatsApp dan tautan resmi portal walidata.

---

## 7. Rencana Verifikasi & Pengujian

1. **Backend Testing (Pest / PHPUnit):**
   * Pengujian integrasi seluruh endpoint `/api/v1/*` menghasilkan status HTTP 200 dengan payload JSON yang presisi.
   * Pengujian pengunduhan `/export` memastikan header `Content-Disposition` dan format MIME `.xlsx` / `.csv` valid.
   * Pengujian import berkas batch pada Filament Admin.
2. **Frontend Testing:**
   * Uji coba filter interaktif pada Data Explorer (penyaringan tipe, DAS, dan walidata).
   * Uji coba fungsional tombol unduh 1-klik dan bilah unduh batch.
   * Uji coba keterbacaan pada mode mobile, tablet, dan desktop resolusi tinggi.
