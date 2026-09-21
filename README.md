# SIH3 BBWS Serayu Opak — Portal Satu Data Hidrologi, Hidrometeorologi, & Hidrogeologi

Portal Satu Data resmi Balai Besar Wilayah Sungai (BBWS) Serayu Opak yang dirancang ulang untuk kemudahan pencarian data, pemantauan telemetri waktu nyata, serta pengunduhan instan dataset hidrologi, hidrometeorologi, dan hidrogeologi di Wilayah Sungai Serayu Bogowonto dan Progo Opak Serang.

---

## 🌟 Gambaran Umum Redesign

Sistem SIH3 versi baru mengadopsi pendekatan modern, minimalis, dan fungsional:
- **Peta Dihilangkan (*Map-free Architecture*)**: Mengeliminasi ketergantungan pada peta GIS yang berat, lambat dimuat, dan rumit dioperasikan pada perangkat seluler. Digantikan oleh **Unified Data Explorer** berbasis tabel multi-kolom yang cepat, responsif, dan mudah difilter.
- **Identitas Visual Resmi PUPR**: Menerapkan palet warna *Deep Navy* (`#0f172a`) sebagai warna utama representasi ketegasan instansi pemerintah dan *Warm Amber* (`#f59e0b`) sebagai aksen status siaga dan sorotan visual interaktif.
- **Komponen Modern Shadcn UI**: Antarmuka bersih, aksesibel, dan terstandarisasi dengan animasi transisi yang halus.
- **1-Click Instant Download**: Tombol unduh langsung (.xlsx / .csv) di setiap baris tabel pos tanpa perlu membuka halaman baru.
- **Batch Download Multi-Pos**: Pengunduhan massal banyak stasiun sekaligus ke dalam satu berkas terintegrasi via *streaming response* zero-memory buffering.
- **Visualisasi Tren Interaktif**: Grafik deret waktu interaktif (Recharts) untuk membaca riwayat tinggi muka air (TMA) dan curah hujan dengan indikator ambang batas status siaga (Normal, Waspada, Siaga, Awas).
- **Repositori Publikasi Terpadu**: Akses unduh dokumen regulasi, standar operasional prosedur (SOP), buku pedoman, dan buletin hidrologi dengan pratinjau langsung di dalam modal (*in-browser PDF preview*).
- **Direktori Mitra Walidata**: Direktori kontak langsung (WhatsApp, telepon, dan tautan layanan data) dari 6 instansi walidata mitra kerja sama SIH3 (BBWS Serayu Opak, BMKG DIY & Jateng, Pusdataru Jateng, Dinas PUP-ESDM DIY, DLHK DIY, dan Perum Jasa Tirta I).

---

## 🏗️ Arsitektur & Teknologi

Sistem menggunakan arsitektur terpisah (*decoupled architecture*):

```
sih3_remake/
├── frontend/               # Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, TanStack Table v8, Recharts, Sonner
├── backend/                # Laravel 11, PHP 8.3, FastExcel (OpenSpout), Filament v3 Admin Panel, SQLite/MySQL
└── docs/                   # Rencana kerja, spesifikasi teknis, dan dokumentasi arsitektur
```

- **Frontend**: Next.js 16.3, React 19.2, TypeScript 5, Tailwind CSS 4, Lucide Icons, Shadcn UI pattern, Axios, Sonner toast.
- **Backend**: Laravel 11.x, PHP 8.3+, Filament Admin v3.x, FastExcel Streaming, Database Transactions & Seeders lengkap.

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terpasang:
- PHP 8.2 atau 8.3+ beserta ekstensi `pdo`, `mbstring`, `zip`, `xml`, `curl`
- Composer 2+
- Node.js 18+ atau 20+
- NPM / PNPM / Yarn

---

### 2. Menjalankan Backend (Laravel 11 & Filament v3)

1. Buka direktori `backend`:
   ```bash
   cd backend
   ```

2. Pasang dependensi PHP:
   ```bash
   composer install
   ```

3. Salin berkas lingkungan (`.env`):
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Jalankan migrasi database dan pembenihan data awal (*seeders*):
   ```bash
   touch database/database.sqlite  # Jika menggunakan SQLite bawaan
   php artisan migrate --seed
   ```
   *Seeder ini otomatis mengisi data 13 pos pemantauan (AWLR, ARR, MAT), ribuan rekaman pengukuran timeseries, 6 mitra walidata, dokumen publikasi, dan 1 akun administrator.*

5. Buat tautan simbolik direktori storage:
   ```bash
   php artisan storage:link
   ```

6. Jalankan server backend development:
   ```bash
   php artisan serve
   ```
   Backend REST API akan aktif di `http://localhost:8000`.

---

### 3. Mengakses Panel Admin Filament v3

Panel administrasi internal digunakan oleh pengelola data BBWS Serayu Opak untuk mengelola data pos, mengunggah data pengukuran, memperbarui dokumen publikasi, dan mengatur profil walidata.

- **URL Admin Panel**: [http://localhost:8000/admin](http://localhost:8000/admin)
- **Kredensial Default Administrator**:
  - **Email**: `admin@bbwsserayuopak.id`
  - **Password**: `password`

Fitur Utama Panel Admin:
- **Pos Resource**: Manajemen daftar pos, koordinat, jenis alat, status operasional, dan foto dokumentasi pos.
- **Pengukuran Resource**: Input manual dan pemantauan rekaman tinggi muka air atau curah hujan dengan status ambang batas siaga.
- **Dokumen Resource**: Unggah berkas dokumen PDF peraturan/SOP dan pencatatan riwayat jumlah unduhan.
- **Walidata Resource**: Pengaturan informasi kontak WA, alamat kantor, dan tautan layanan instansi mitra.

---

### 4. Menjalankan Frontend (Next.js 16)

1. Buka direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Pasang dependensi Node.js:
   ```bash
   npm install
   ```

3. Konfigurasi endpoint API pada `.env.local` (opsional jika default `http://localhost:8000/api/v1`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. Jalankan server frontend development:
   ```bash
   npm run dev
   ```
   Aplikasi web portal dapat diakses melalui peramban di [http://localhost:3000](http://localhost:3000).

5. Untuk melakukan kompilasi build produksi:
   ```bash
   npm run build
   npm run start
   ```

---

## 📡 Struktur Endpoint REST API Publik

Semua endpoint publik berada di bawah prefix `/api/v1`:

| Metode | Endpoint | Deskripsi | Parameter Utama |
|---|---|---|---|
| `GET` | `/api/v1/telemetry/summary` | Mengambil ringkasan data pos aktif dengan pembacaan terakhir untuk strip beranda. | `jenis`, `tipe`, `das` |
| `GET` | `/api/v1/pos` | Mengambil katalog data pos pemantauan dengan pencarian dan filter. | `q`, `tipe`, `jenis`, `das`, `wilayah_sungai`, `walidata_id`, `status_alat`, `page`, `per_page` |
| `GET` | `/api/v1/pos/{id}` | Mengambil metadata lengkap pos tunggal dan relasi walidata. | `id` (ID Pos) |
| `GET` | `/api/v1/pos/{id}/timeseries` | Mengambil rekaman data deret waktu untuk grafik tren. | `start_date`, `end_date`, `limit` |
| `GET` | `/api/v1/pos/{id}/export` | Pengunduhan 1-klik berkas Excel (.xlsx) atau CSV (.csv) untuk pos tunggal. | `format` (`csv` / `xlsx`), `start_date`, `end_date` |
| `POST` | `/api/v1/pos/batch-export` | Pengunduhan batch multi-pos gabungan dalam satu berkas spreadsheet streaming. | Body JSON: `pos_ids: []`, `format`, `start_date`, `end_date` |
| `GET` | `/api/v1/dokumen` | Mengambil daftar dokumen publikasi, regulasi, dan buletin. | `q`, `kategori`, `tahun`, `page`, `per_page` |
| `GET` | `/api/v1/dokumen/{id}` | Mengambil detail metadata satu dokumen publikasi. | `id` (ID Dokumen) |
| `GET` | `/api/v1/dokumen/{id}/download` | Mengunduh berkas PDF fisik dokumen dan menambah counter unduhan secara atomik. | `id` (ID Dokumen) |
| `GET` | `/api/v1/walidata` | Mengambil direktori instansi mitra walidata beserta jumlah pos binaan. | - |
| `GET` | `/api/v1/walidata/{id}` | Mengambil profil detail mitra walidata dan daftar pos terkait. | `id` (ID Walidata) |

---

## 🧪 Pengujian Sistem (Automated Tests)

### Pengujian Backend (PHPUnit)
Backend dilengkapi dengan unit & feature testing lengkap mencakup relasi model, seeder, endpoint REST API, otentikasi admin, pengunduhan streaming berkas, serta pengujian integrasi end-to-end menyeluruh.

Jalankan seluruh test suite:
```bash
cd backend
php artisan test
```
*Hasil: 55 passed (100%), 2,226 assertions.*

### Pengujian Build Frontend (Next.js / TypeScript)
Verifikasi tipe TypeScript dan kompilasi modul Next.js:
```bash
cd frontend
npm run build
```
*Hasil: Berhasil dikompilasi (Compiled successfully) pada seluruh rute: `/`, `/data-explorer`, `/pos/[id]`, `/publikasi`, `/walidata`.*

---

## 🏛️ Hak Cipta & Lisensi
Hak Cipta © 2026 Balai Besar Wilayah Sungai Serayu Opak — Direktorat Jenderal Sumber Daya Air, Kementerian Pekerjaan Umum dan Perumahan Rakyat Republik Indonesia.
