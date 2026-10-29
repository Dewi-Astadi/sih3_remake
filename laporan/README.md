# Laporan Magang — Evaluasi UI/UX Redesain Portal SIH3

Laporan magang dengan judul **"Evaluasi Antarmuka dan Pengalaman Pengguna (UI/UX) pada Hasil Redesain Website SIH3 BBWS Serayu Opak"**, disusun dalam format modular Markdown lalu dikompilasi menjadi Word dan PDF.

## Berkas Hasil

| Berkas | Keterangan |
|:---|:---|
| `Laporan.docx` | **Berkas utama untuk dikumpulkan.** Format 4-4-3-3, Times New Roman 12 pt, spasi 1,5, penomoran halaman Romawi (ii–viii) untuk bagian awal dan Arab (1–64) untuk isi. Daftar isi, daftar gambar, dan daftar tabel sudah terisi. |
| `Laporan-word.pdf` | Ekspor PDF dari berkas Word, dipakai untuk memeriksa tata letak halaman. |
| `Laporan.pdf` | PDF hasil mesin Typst (tipografi berbeda dari Word, berguna sebagai pembanding). |

## Struktur Sumber

```
laporan/
├── metadata.yml                  # Judul, penulis, NIM, institusi, preset margin
├── cover.md                      # Kata pengantar + daftar isi/gambar/tabel
├── chapters/
│   ├── bab1-pendahuluan.md
│   ├── bab2-landasan-teori.md
│   ├── bab3-tinjauan-umum.md
│   ├── bab4-hasil-dan-pembahasan.md
│   ├── bab5-penutup.md
│   ├── bab6-daftar-pustaka.md
│   └── bab7-lampiran.md
├── references.bib                # 18 entri, semuanya bersitasi
├── gambar/                       # Screenshot before/after, diagram, logo
└── scripts/
    ├── normalisasi-tabel.py      # Lebar kolom tabel agar tidak melewati margin
    ├── rapikan-caption.py        # Label "Gambar 4.1" + field SEQ
    ├── rapikan-nomor-halaman.py  # Sampul tanpa nomor, Romawi dari ii, Arab dari 1
    └── update-field-word.ps1     # Word memperbarui daftar isi lalu ekspor PDF
```

## Cara Build Ulang

```bash
cd laporan
bash build-laporan.sh          # DOCX + PDF hasil Word (butuh Microsoft Word)
```

Jika Microsoft Word tidak tersedia, cukup jalankan `bash build-docx.sh`; berkas Word tetap terbentuk, tetapi daftar isi perlu diperbarui manual dengan membuka dokumen lalu menekan **Ctrl+A** dan **F9**.

## Yang Perlu Diganti Sebelum Dikumpulkan

1. **`metadata.yml`** — nama Pembimbing I, Pembimbing II, Ketua Program Studi beserta NIDN/NIP.
2. **`cover.md`** — nama dosen pembimbing pada daftar ucapan terima kasih.
3. **BAB I bagian 1.6.3** — tanggal mulai dan tanggal selesai magang.
4. **BAB IV tabel 4.9** — skor System Usability Scale setelah kuesioner disebar. Instrumen dan lembar tugas tersedia di Lampiran 4 dan Lampiran 5.

## Catatan Data

Seluruh angka pada BAB IV berasal dari pengukuran yang benar-benar dilakukan pada portal lama (`https://sih3.bbwsserayuopak.id`) dan hasil build produksi portal baru:

- Kinerja halaman: Chromium headless, 1440 × 900, tanpa cache.
- Aksesibilitas: axe-core 4.10.2, tag WCAG 2.0–2.2 A/AA.
- Pengujian fungsional: PHPUnit 55 uji, 2.226 asersi, seluruhnya lulus.
- Halaman antarmuka: 12 rute diuji, seluruhnya mengembalikan status 200.

Skor SUS **tidak** diisi karena belum ada responden; tabelnya sengaja diberi penanda `[isi]` agar tidak menampilkan angka yang tidak dapat dipertanggungjawabkan.
