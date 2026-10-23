#!/usr/bin/env bash
# Bangun Laporan.docx (dan Laporan-word.pdf) dari sumber Markdown.
#
# Urutan:
#   1. Pandoc + docx.lua  -> DOCX dasar (sampul, daftar isi, bab, daftar pustaka)
#   2. normalisasi-tabel  -> lebar kolom sesuai area teks, baris tidak terpotong
#   3. rapikan-caption    -> label "Gambar 4.1" / "Tabel 4.1" + field SEQ
#   4. rapikan-nomor-halaman -> sampul tanpa nomor, Romawi dari ii, Arab dari 1
#   5. update-field-word  -> Word memperbarui daftar isi/gambar/tabel + ekspor PDF
#
# Pemakaian:
#   bash build-laporan.sh

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

export PATH="$PATH:/c/Users/$USER/AppData/Local/laporan-generator/bin"

echo "[1/5] Pandoc -> DOCX"
bash build-docx.sh >/dev/null

echo "[2/5] Normalisasi tabel"
python scripts/normalisasi-tabel.py Laporan.docx

echo "[3/5] Penomoran caption"
python scripts/rapikan-caption.py Laporan.docx

echo "[4/5] Penomoran halaman"
python scripts/rapikan-nomor-halaman.py Laporan.docx

echo "[5/5] Perbarui field Word + ekspor PDF"
if command -v powershell >/dev/null 2>&1; then
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/update-field-word.ps1 \
    -Docx "Laporan.docx" -Pdf "Laporan-word.pdf"
else
  echo "      PowerShell tidak tersedia; buka Laporan.docx lalu tekan F9 untuk memperbarui field."
fi

echo
echo "Selesai:"
ls -lh Laporan.docx Laporan-word.pdf 2>/dev/null || true
