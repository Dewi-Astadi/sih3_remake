# SIH3 BBWS Serayu Opak Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun ulang portal SIH3 BBWS Serayu Opak menjadi portal satu data yang modern, bersih, bebas peta, berfokus pada kemudahan pencarian dan pengunduhan instan data hidrologi, hidrometeorologi, dan hidrogeologi.

**Architecture:** Menggunakan arsitektur terpisah (*decoupled*): Frontend Next.js 14+ (App Router) berbasis komponen Shadcn UI dengan palet warna Deep Navy (`#0f172a`) dan Warm Amber (`#f59e0b`), serta Backend Laravel 11 yang menyediakan REST API teroptimasi streaming untuk ekspor data (`.xlsx`/`.csv`) dan Filament v3 sebagai CMS admin data pos dan dokumen.

**Tech Stack:** 
- Frontend: Next.js 14+, React 18/19, TypeScript, Tailwind CSS, Shadcn UI, TanStack Table v8, Lucide React, Recharts, Axios.
- Backend: Laravel 11, PHP 8.3, FastExcel / Maatwebsite Excel, Filament v3, SQLite/MySQL.

---

## Peta Struktur Berkas

```
sih3_remake/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── data-explorer/page.tsx
│   │   ├── pos/[id]/page.tsx
│   │   ├── publikasi/page.tsx
│   │   └── walidata/page.tsx
│   ├── components/
│   │   ├── ui/                    # Button, Table, Badge, Card, Input, Dialog, Dropdown, Skeleton
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── modules/
│   │       ├── TelemetryStrip.tsx
│   │       ├── QuickSearchHero.tsx
│   │       ├── DataExplorerTable.tsx
│   │       ├── BatchDownloadBar.tsx
│   │       ├── StationTrendChart.tsx
│   │       └── PdfViewerDialog.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── backend/
    ├── app/
    │   ├── Http/Controllers/Api/
    │   │   ├── TelemetryController.php
    │   │   ├── PosController.php
    │   │   ├── ExportController.php
    │   │   ├── DokumenController.php
    │   │   └── WalidataController.php
    │   ├── Models/
    │   │   ├── Walidata.php
    │   │   ├── Pos.php
    │   │   ├── Pengukuran.php
    │   │   └── Dokumen.php
    │   └── Filament/Resources/
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    │       └── DatabaseSeeder.php
    ├── routes/
    │   └── api.php
    └── tests/Feature/
        ├── PosApiTest.php
        └── ExportTest.php
```

---

## Rincian Tugas Implementasi

### Bagian 1: Inisialisasi Proyek & Komponen Fondasi

#### Tugas 1: Inisialisasi Frontend Next.js & Tailwind CSS
**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/app/globals.css`
- Create: `frontend/app/layout.tsx`
- Create: `frontend/app/page.tsx`

- [x] **Langkah 1: Inisialisasi proyek Next.js dengan TypeScript & Tailwind CSS**
Jalankan di root repositori:
```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --yes
```
Verifikasi direktori `frontend` terbentuk dan dependensi terpasang.

- [x] **Langkah 2: Pasang pustaka UI pendukung**
Jalankan di `frontend`:
```bash
cd frontend; npm install clsx tailwind-merge lucide-react @tanstack/react-table recharts axios sonner
```

- [x] **Langkah 3: Konfigurasi Design Tokens PUPR pada `tailwind.config.ts`**
Sesuaikan warna Deep Navy (`#0f172a` / `#1e3a8a`), Warm Amber (`#f59e0b`), dan Slate neutral:
Edit `frontend/tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0f172a", // Deep Navy PUPR
          foreground: "#ffffff",
          light: "#1e3a8a",
        },
        amber: {
          pupr: "#f59e0b",   // Warm Amber Gold PUPR
          hover: "#d97706",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [x] **Langkah 4: Jalankan dev server Next.js untuk memverifikasi**
Run: `npm run build` di `frontend`
Expected: `Compiled successfully`

- [x] **Langkah 5: Commit fondasi frontend**
```bash
git add frontend/
git commit -m "feat(frontend): initialize Next.js with Tailwind and PUPR brand tokens"
```

---

#### Tugas 2: Memasang Primitif Komponen Shadcn UI
**Files:**
- Create: `frontend/lib/utils.ts`
- Create: `frontend/components/ui/button.tsx`
- Create: `frontend/components/ui/card.tsx`
- Create: `frontend/components/ui/badge.tsx`
- Create: `frontend/components/ui/table.tsx`
- Create: `frontend/components/ui/input.tsx`
- Create: `frontend/components/ui/dialog.tsx`
- Create: `frontend/components/ui/dropdown-menu.tsx`
- Create: `frontend/components/ui/skeleton.tsx`

- [x] **Langkah 1: Buat helper utility `frontend/lib/utils.ts`**
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined) return "-";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(val);
}
```

- [x] **Langkah 2: Buat komponen `button.tsx`, `card.tsx`, dan `badge.tsx`**
Implementasikan komponen UI sesuai standar Shadcn UI dengan varian warna Amber dan Navy.

- [x] **Langkah 3: Buat komponen `table.tsx`, `input.tsx`, dan `skeleton.tsx`**
Implementasikan komponen tabel responsif dan kolom input filter dengan styling clean border 1px.

- [x] **Langkah 4: Commit komponen Shadcn UI**
```bash
git add frontend/lib/ frontend/components/ui/
git commit -m "feat(frontend): add Shadcn UI components and design utilities"
```

---

#### Tugas 3: Inisialisasi Backend Laravel 11 & Migrasi Skema Database
**Files:**
- Create: `backend/` (via composer create-project laravel/laravel)
- Create: `backend/database/migrations/2026_09_21_000001_create_walidata_table.php`
- Create: `backend/database/migrations/2026_09_21_000002_create_pos_table.php`
- Create: `backend/database/migrations/2026_09_21_000003_create_pengukuran_table.php`
- Create: `backend/database/migrations/2026_09_21_000004_create_dokumen_table.php`
- Create: `backend/app/Models/Walidata.php`
- Create: `backend/app/Models/Pos.php`
- Create: `backend/app/Models/Pengukuran.php`
- Create: `backend/app/Models/Dokumen.php`

- [ ] **Langkah 1: Unduh composer.phar dan inisialisasi Laravel 11**
Jalankan di root repositori:
```powershell
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
php composer.phar create-project laravel/laravel backend
```

- [ ] **Langkah 2: Tulis berkas migrasi database terstruktur**
Tulis 4 migrasi untuk tabel:
1. `walidata` (nama, singkatan, logo_path, website_url, layanan_url, kontak_wa, kontak_telp)
2. `pos` (kode_pos, nama, tipe, jenis, wilayah_sungai, das, sub_das, sungai, desa, kecamatan, kabupaten, provinsi, lat, lng, walidata_id, status_alat)
3. `pengukuran` (pos_id, recorded_at, nilai, satuan, status_siaga, parameter_tambahan) dengan composite index `[pos_id, recorded_at]`.
4. `dokumen` (judul, kategori, tahun, nomor_dokumen, file_path, file_size, file_extension, download_count).

- [ ] **Langkah 3: Tulis Eloquent Models lengkap dengan relasi**
Definisikan:
- `Walidata` hasMany `Pos`
- `Pos` belongsTo `Walidata`, hasMany `Pengukuran`
- `Pengukuran` belongsTo `Pos`
- `Dokumen`

- [ ] **Langkah 4: Jalankan migrasi database**
Run: `cd backend; php artisan migrate --force`
Expected: `Migration table created successfully.`

- [ ] **Langkah 5: Commit migrasi dan model backend**
```bash
git add backend/
git commit -m "feat(backend): initialize Laravel 11 with core domain migrations and models"
```

---

#### Tugas 4: Database Seeder Data Riil SIH3 Serayu Opak
**Files:**
- Create: `backend/database/seeders/DatabaseSeeder.php`
- Test: `php artisan db:seed`

- [ ] **Langkah 1: Tulis seeder komprehensif berdasarkan data aktual portal SIH3**
Isi data awal:
- **Walidata:** BBWS Serayu Opak, BMKG Staklim DIY & Jateng, Dinas PUP ESDM DIY, Dinas Pusdataru Jawa Tengah, DLHK DIY, DLHK Jateng, Perum Jasa Tirta I.
- **Stasiun Pos:** Pos AWLR Kranggan (Progo), Pos Ngrancah Sermo, Pos Kualitas Air Saluran Buang PDAM, Pos Mata Air Jumprit, Pos ARR Hujan.
- **Pengukuran:** 100+ sampel data timeseries 30 hari terakhir per pos (TMA dalam meter dan Curah Hujan dalam mm).
- **Dokumen:** PP RI No 30 Tahun 2024, UU No 17 Tahun 2019, SOP Analisis Mutu Air, SOP Perhitungan Debit Banjir, Buletin Hidrologi.

- [ ] **Langkah 2: Eksekusi seeder**
Run: `cd backend; php artisan db:seed`
Expected: `Database seeding completed successfully.`

- [ ] **Langkah 3: Commit seeder data**
```bash
git add backend/database/seeders/
git commit -m "feat(backend): add rich SIH3 Serayu Opak sample data seeders"
```

---

### Bagian 2: Endpoint REST API & Engine Ekspor Data

#### Tugas 5: Telemetry API & Pos Controller
**Files:**
- Create: `backend/app/Http/Controllers/Api/TelemetryController.php`
- Create: `backend/app/Http/Controllers/Api/PosController.php`
- Modify: `backend/routes/api.php`
- Create: `backend/tests/Feature/PosApiTest.php`

- [ ] **Langkah 1: Tulis automated test untuk endpoint API**
`backend/tests/Feature/PosApiTest.php`:
```php
<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PosApiTest extends TestCase {
    public function test_telemetry_summary_returns_success() {
        $response = $this->getJson('/api/v1/telemetry/summary');
        $response->assertStatus(200)->assertJsonStructure(['data']);
    }
    public function test_pos_list_can_be_filtered() {
        $response = $this->getJson('/api/v1/pos?tipe=hidrologi');
        $response->assertStatus(200)->assertJsonStructure(['data', 'meta']);
    }
}
```

- [ ] **Langkah 2: Jalankan test untuk memverifikasi kegagalan (TDD)**
Run: `cd backend; php artisan test --filter=PosApiTest`
Expected: FAIL (404 Not Found)

- [ ] **Langkah 3: Implementasikan `TelemetryController` dan `PosController`**
Tambahkan fitur filter pencarian fleksibel berdasarkan nama pos, tipe, jenis, DAS, dan walidata.

- [ ] **Langkah 4: Daftarkan rute di `routes/api.php`**
```php
Route::prefix('v1')->group(function () {
    Route::get('/telemetry/summary', [TelemetryController::class, 'summary']);
    Route::get('/pos', [PosController::class, 'index']);
    Route::get('/pos/{id}', [PosController::class, 'show']);
    Route::get('/pos/{id}/timeseries', [PosController::class, 'timeseries']);
});
```

- [ ] **Langkah 5: Jalankan test kembali**
Run: `php artisan test --filter=PosApiTest`
Expected: PASS (Semua tes hijau)

- [ ] **Langkah 6: Commit controller API pos**
```bash
git add backend/app/Http/Controllers/Api/ backend/routes/api.php backend/tests/
git commit -m "feat(backend): implement telemetry and pos REST API endpoints"
```

---

#### Tugas 6: Streaming Data Export Engine (1-Klik Download XLSX & CSV)
**Files:**
- Create: `backend/app/Http/Controllers/Api/ExportController.php`
- Modify: `backend/routes/api.php`
- Create: `backend/tests/Feature/ExportTest.php`

- [ ] **Langkah 1: Tulis automated test untuk pengunduhan berkas**
Uji respons header `Content-Disposition: attachment; filename=...` dan stream data format CSV dan XLSX.

- [ ] **Langkah 2: Implementasikan `ExportController` dengan memory-efficient stream**
Mendukung:
- Single pos export: `/api/v1/pos/{id}/export?format=xlsx|csv&start_date=...&end_date=...`
- Batch export: `/api/v1/pos/batch-export` (mengemas multiple data pos ke dalam satu file ZIP atau multi-sheet workbook).

- [ ] **Langkah 3: Jalankan automated test ekspor**
Run: `cd backend; php artisan test --filter=ExportTest`
Expected: PASS

- [ ] **Langkah 4: Commit modul ekspor**
```bash
git add backend/app/Http/Controllers/Api/ExportController.php backend/routes/api.php backend/tests/
git commit -m "feat(backend): implement high-performance streamed data exporter for CSV and XLSX"
```

---

#### Tugas 7: API Dokumen Publikasi & Direktori Walidata
**Files:**
- Create: `backend/app/Http/Controllers/Api/DokumenController.php`
- Create: `backend/app/Http/Controllers/Api/WalidataController.php`
- Modify: `backend/routes/api.php`

- [ ] **Langkah 1: Implementasikan `DokumenController` & `WalidataController`**
- `GET /api/v1/dokumen`: Pencarian judul dan filter kategori dokumen.
- `GET /api/v1/dokumen/{id}/download`: Menyajikan file PDF sekaligus increment counter unduh.
- `GET /api/v1/walidata`: Daftar instansi lengkap dengan nomor WhatsApp dan link layanan resmi.

- [ ] **Langkah 2: Uji coba endpoint via curl / php artisan test**
Verifikasi JSON response mengembalikan daftar walidata dan dokumen dengan benar.

- [ ] **Langkah 3: Commit API dokumen & walidata**
```bash
git add backend/app/Http/Controllers/Api/ backend/routes/api.php
git commit -m "feat(backend): implement publication documents and walidata API endpoints"
```

---

#### Tugas 8: Konfigurasi Panel Admin Filament v3
**Files:**
- Modify: `backend/composer.json` (pasang `filament/filament`)
- Create: `backend/app/Filament/Resources/PosResource.php`
- Create: `backend/app/Filament/Resources/DokumenResource.php`
- Create: `backend/app/Filament/Resources/WalidataResource.php`

- [ ] **Langkah 1: Pasang Filament v3**
Jalankan di `backend`:
```powershell
php composer.phar require filament/filament:"^3.2" -W
php artisan filament:install --panels
```

- [ ] **Langkah 2: Buat resource panel admin untuk Pos, Dokumen, dan Walidata**
Run:
```powershell
php artisan make:filament-resource Pos --generate
php artisan make:filament-resource Dokumen --generate
php artisan make:filament-resource Walidata --generate
```

- [ ] **Langkah 3: Tambahkan aksi upload CSV/Excel batch data pengukuran pada `PosResource`**
Staf admin dapat mengunggah lembar kerja data rekaman tanpa perlu input satu per satu.

- [ ] **Langkah 4: Commit konfigurasi Filament**
```bash
git add backend/
git commit -m "feat(backend): set up Filament v3 admin CMS for pos, documents, and data imports"
```

---

### Bagian 3: Antarmuka Frontend Portal Publik (Next.js)

#### Tugas 9: Tata Letak Global (Navbar & Footer PUPR)
**Files:**
- Create: `frontend/lib/types.ts`
- Create: `frontend/lib/api.ts`
- Create: `frontend/components/layout/Navbar.tsx`
- Create: `frontend/components/layout/Footer.tsx`
- Modify: `frontend/app/layout.tsx`

- [ ] **Langkah 1: Buat type definitions di `frontend/lib/types.ts`**
Definisikan tipe TypeScript untuk `Pos`, `TelemetrySummary`, `Pengukuran`, `Dokumen`, `Walidata`.

- [ ] **Langkah 2: Buat klien API di `frontend/lib/api.ts`**
Klien Axios terpusat dengan fallback data dan penanganan timeout/error.

- [ ] **Langkah 3: Buat `Navbar.tsx`**
Header fixed dengan logo SIH3 + Kementerian PUPR, navigasi (*Beranda, Data Explorer, Dokumen, Walidata*), tombol CTA Amber *"Unduh Data"*, dan indikator status API.

- [ ] **Langkah 4: Buat `Footer.tsx`**
Footer modern, clean dengan alamat balai (Jl. Solo Km. 6, Caturtunggal, Sleman, DIY), informasi kontak, hak cipta resmi, dan disclaimer keterbukaan informasi publik.

- [ ] **Langkah 5: Pasang di `app/layout.tsx`**
Pastikan Navbar dan Footer membungkus seluruh halaman anak (*children*).

- [ ] **Langkah 6: Commit tata letak global**
```bash
git add frontend/lib/ frontend/components/layout/ frontend/app/layout.tsx
git commit -m "feat(frontend): build modern PUPR navbar and footer layouts"
```

---

#### Tugas 10: Halaman Beranda (Hero Pencarian Cepat & Live Telemetry Strip)
**Files:**
- Create: `frontend/components/modules/QuickSearchHero.tsx`
- Create: `frontend/components/modules/TelemetryStrip.tsx`
- Modify: `frontend/app/page.tsx`

- [ ] **Langkah 1: Buat `QuickSearchHero.tsx`**
Headline bersih, tipografi tajam, dan input pencarian universal di tengah yang langsung mengarahkan user ke `/data-explorer?q=...`.

- [ ] **Langkah 2: Buat `TelemetryStrip.tsx` (Pengganti Peta)**
Kartu-kartu telemetri stasiun aktif (TMA Duga Air & Curah Hujan):
- Angka nilai besar & tegas (misal: `2.54 m`).
- Badge status visual (*Normal*, *Waspada*, *Siaga*).
- Timestamp pembaruan data terakhir.

- [ ] **Langkah 3: Tambahkan kartu 3 Pilar Kategori Data di `app/page.tsx`**
Kartu akses cepat ke *Hidrologi*, *Hidrometeorologi*, dan *Hidrogeologi*.

- [ ] **Langkah 4: Uji tampilan di browser / terminal build**
Run: `cd frontend; npm run build`
Expected: `Route (app) / size: ... Compiled successfully`

- [ ] **Langkah 5: Commit halaman beranda**
```bash
git add frontend/components/modules/ frontend/app/page.tsx
git commit -m "feat(frontend): implement homepage with quick search hero and live telemetry strip"
```

---

#### Tugas 11: Pusat Unduh Data Terpadu (`/data-explorer`)
**Files:**
- Create: `frontend/components/modules/DataExplorerFilter.tsx`
- Create: `frontend/components/modules/DataExplorerTable.tsx`
- Create: `frontend/components/modules/BatchDownloadBar.tsx`
- Create: `frontend/app/data-explorer/page.tsx`

- [ ] **Langkah 1: Buat filter terpadu di `DataExplorerFilter.tsx`**
- Tab kategori: *Semua*, *Hidrologi*, *Hidrometeorologi*, *Hidrogeologi*.
- Dropdown: *Wilayah Sungai*, *DAS*, *Walidata*.
- Debounced search input (300ms).

- [ ] **Langkah 2: Buat `DataExplorerTable.tsx` (TanStack Table)**
- Checkbox di setiap baris untuk pemilihan data batch.
- Kolom informatif: No, Nama Pos & Lokasi, Tipe/Jenis, DAS/Wilayah Sungai, Walidata, Status.
- Tombol **Unduh Cepat 1-Klik**: Tombol dropdown dengan opsi *Unduh Excel (.xlsx)* atau *Unduh CSV (.csv)* langsung memicu download browser tanpa pindah halaman.

- [ ] **Langkah 3: Buat `BatchDownloadBar.tsx`**
Floating action bar di bagian bawah yang aktif saat user memilih 1 atau lebih checkbox pos: *"X Stasiun Terpilih — [Unduh Batch] [Batal]"*.

- [ ] **Langkah 4: Integrasikan di `app/data-explorer/page.tsx`**
Hubungkan filter, tabel, pagination, dan notifikasi toast keberhasilan download.

- [ ] **Langkah 5: Commit data explorer**
```bash
git add frontend/components/modules/ frontend/app/data-explorer/
git commit -m "feat(frontend): build unified open data explorer with 1-click and batch download"
```

---

#### Tugas 12: Halaman Detail Pos (`/pos/[id]`) & Visualisasi Tren
**Files:**
- Create: `frontend/components/modules/StationTrendChart.tsx`
- Create: `frontend/app/pos/[id]/page.tsx`

- [ ] **Langkah 1: Buat `StationTrendChart.tsx` dengan Recharts**
Grafik garis tren TMA / grafik batang curah hujan bergaya monokrom/navy yang responsif dan interaktif dengan tooltip.

- [ ] **Langkah 2: Buat `app/pos/[id]/page.tsx`**
- Kartu ringkasan metadata stasiun (wilayah administratif, koordinat, walidata pemilik).
- Date range picker untuk memilih periode pengukuran.
- Tabel cuplikan data historis dan tombol ekspor lengkap periode tersebut.

- [ ] **Langkah 3: Commit detail pos**
```bash
git add frontend/components/modules/StationTrendChart.tsx frontend/app/pos/
git commit -m "feat(frontend): implement station detail view with measurement trend chart and historical export"
```

---

#### Tugas 13: Halaman Repositori Dokumen & Publikasi (`/publikasi`)
**Files:**
- Create: `frontend/components/modules/PdfViewerDialog.tsx`
- Create: `frontend/app/publikasi/page.tsx`

- [ ] **Langkah 1: Buat `PdfViewerDialog.tsx`**
Modal dialog Shadcn UI untuk pratinjau dokumen PDF resmi tanpa perlu meninggalkan halaman portal.

- [ ] **Langkah 2: Buat `app/publikasi/page.tsx`**
Katalog kartu/tabel dokumen peraturan perundangan, SOP, dan buletin dengan filter pencarian instan dan tombol aksi *Pratinjau* serta *Download PDF*.

- [ ] **Langkah 3: Commit publikasi dokumen**
```bash
git add frontend/components/modules/PdfViewerDialog.tsx frontend/app/publikasi/
git commit -m "feat(frontend): create publication documents repository with in-browser PDF preview modal"
```

---

#### Tugas 14: Halaman Direktori Walidata (`/walidata`)
**Files:**
- Create: `frontend/app/walidata/page.tsx`

- [ ] **Langkah 1: Buat antarmuka direktori mitra walidata**
Kartu-kartu instansi walidata (BBWS SO, BMKG DIY & Jateng, Pusdataru, PUP ESDM, DLHK, PJT I) yang memuat logo, tupoksi, tombol kontak WhatsApp langsung, dan tautan layanan data eksternal.

- [ ] **Langkah 2: Commit direktori walidata**
```bash
git add frontend/app/walidata/
git commit -m "feat(frontend): create clean walidata stakeholder directory page"
```

---

### Bagian 4: Verifikasi Akhir & Pengujian End-to-End

#### Tugas 15: Verifikasi Sistem & Pengujian Menyeluruh
**Files:**
- Create: `backend/tests/Feature/EndToEndIntegrationTest.php`

- [ ] **Langkah 1: Jalankan seluruh suite test backend**
Run: `cd backend; php artisan test`
Expected: Seluruh automated tests PASS tanpa error.

- [ ] **Langkah 2: Uji coba streaming download file Excel & CSV**
Verifikasi berkas yang diunduh dapat dibuka dengan format kolom rapi dan tidak korup.

- [ ] **Langkah 3: Build frontend production Next.js**
Run: `cd frontend; npm run build`
Expected: `Compiled successfully` tanpa warning atau type error.

- [ ] **Langkah 4: Uji tampilan responsif (Mobile & Desktop)**
Pastikan layout, tabel data explorer, dan bilah unduh batch tampil nyaman di layar smartphone.

- [ ] **Langkah 5: Commit akhir dan dokumentasi runbook**
```bash
git add .
git commit -m "chore: complete end-to-end integration and verification of SIH3 redesign"
```
