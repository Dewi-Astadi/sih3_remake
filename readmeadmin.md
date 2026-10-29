# Dokumentasi Frontend Panel Admin — SIH3 BBWS Serayu Opak

Dokumentasi ini menjelaskan arsitektur, panduan akses, serta struktur komponen antarmuka **Panel Admin Frontend** yang menggantikan tampilan bawaan Filament v3 di backend agar terintegrasi penuh ke dalam arsitektur *decoupled* (Next.js Frontend & Laravel Backend API).

---

## 🚀 1. Gambaran Umum Migrasi Admin
Pada arsitektur baru, backend Laravel 11 murni berfungsi sebagai penyedia REST API (`/api/v1/...`), sementara seluruh antarmuka visual admin dialihkan ke sisi frontend untuk memberikan pengalaman pengguna (*user experience*) yang lebih cepat, kustom, dan selaras dengan desain sistem secara keseluruhan.

- **Autentikasi**: Menggunakan token Sanctum/JWT yang terhubung ke endpoint `/api/v1/auth/login`.
- **Manajemen State**: Menggunakan React State & Context untuk mempertahankan sesi login admin.
- **Gaya Visual**: Menggunakan Tailwind CSS dengan palet warna resmi PUPR (*Deep Navy* `#0f172a` dan *Warm Amber* `#f59e0b`).

---

## 🔐 2. Halaman Login Admin
Halaman login dirancang bersih dan profesional untuk membatasi akses pengelolaan data hidrologi.

- **URL Akses**: `/admin/login`
- **Kredensial Default Administrator**:
  - **Email**: `admin@bbwsserayuopak.id`
  - **Password**: `password`
- **Alur Kerja**: 
  1. Admin memasukkan kredensial pada form.
  2. Frontend mengirim permintaan `POST` ke endpoint autentikasi backend.
  3. Jika berhasil, token akses disimpan pada `localStorage` / *Cookie* dan pengguna diarahkan ke beranda dashboard admin (`/admin`).

---

## 📊 3. Bagian & Modul Utama Panel Admin

Panel admin mencakup 4 manajemen data (*Resources*) utama yang terhubung langsung dengan basis data backend:

### A. Manajemen Pos Pemantauan (`/admin/pos`)
Digunakan oleh walidata untuk mengelola titik stasiun pengukuran (AWLR, ARR, MAT).
- **Fitur**: Tabel daftar pos dengan fitur pencarian, filter berdasarkan Wilayah Sungai / DAS, serta tombol aksi untuk menambah, mengubah, dan menghapus data pos.
- **Atribut Utama**: Nama Pos, Kode Pos, Jenis Alat (`AWLR`/`ARR`/`MAT`), Titik Koordinat (Latitude/Longitude), dan Status Operasional.

### B. Pengukuran & Deret Waktu (`/admin/pengukuran`)
Memantau catatan data pengukuran hulu/hilir serta rekaman sensor secara berkala.
- **Fitur**: Monitoring data tinggi muka air dan curah hujan beserta indikator ambang batas status siaga (Normal, Waspada, Siaga, Awas).
- **Aksi**: Input data manual harian dan validasi keabsahan data sensor.

### C. Repository Dokumen Publikasi (`/admin/dokumen`)
Mengelola dokumen regulasi, SOP, pedoman teknis, dan buletin hidrologi.
- **Fitur**: Formulir unggah berkas PDF baru, pengeditan metadata kategori/tahun, serta pemantauan jumlah unduhan (*download counter*) secara real-time.

### D. Direktori Walidata (`/admin/walidata`)
Mengatur profil instansi mitra kerja sama penyedia data hidrologi.
- **Fitur**: Pembaruan informasi kontak WhatsApp, alamat kantor, situs web resmi, serta tautan layanan data dari 6 instansi mitra (BBWS Serayu Opak, BMKG, Pusdataru, dll.).

---

## 🛠️ 4. Panduan Menjalankan Frontend Admin

1. Masuk ke direktori frontend:
   ```bash
   cd frontend
2.