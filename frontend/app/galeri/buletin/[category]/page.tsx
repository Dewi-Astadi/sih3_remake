"use client";

import { use, useState } from "react";
import Link from "next/link";

type ItemBuletinDetail = {
  id: string;
  judul: string;
  subKategori?: string;
  tanggalFormat: string;
  tanggalBadge: string;
  gambar: string;
  pdf?: string;
  linkExternal?: string;
};

type KategoriData = {
  nama: string;
  deskripsi: string;
  edisi: ItemBuletinDetail[];
  edisiBMKGYogya?: ItemBuletinDetail[];
  edisiBMKGJateng?: ItemBuletinDetail[];
  edisiPerHalaman?: Record<number, {
    bbws?: ItemBuletinDetail[];
    bmkgYogya?: ItemBuletinDetail[];
    bmkgJateng?: ItemBuletinDetail[];
  }>;
};

const dataPerKategori: Record<string, KategoriData> = {
  hidrologi: {
    nama: "Hidrologi",
    deskripsi: "Infografis buletin hidrologi Wilayah Sungai Serayu Opak dari BBWS Serayu Opak dan mitra walidata.",
    edisi: [
      {
        id: "h1",
        judul: "Rekapitulasi Ketersediaan Air Setengah Bulan 16-30 September 2026",
        subKategori: "HIDROLOGI",
        tanggalFormat: "Senin, 05 Oktober 2026",
        tanggalBadge: "05 Oktober 2026",
        gambar: "/images/buletin/hidrologi/hidrologi-16-30-sept.jpg",
      },
      {
        id: "h2",
        judul: "Rekapitulasi Ketersediaan Air Setengah Bulan 1-15 September 2026",
        subKategori: "HIDROLOGI",
        tanggalFormat: "Rabu, 23 September 2026",
        tanggalBadge: "23 September 2026",
        gambar: "/images/buletin/hidrologi/hidrologi-1-15-sept.jpg",
      },
      {
        id: "h3",
        judul: "Rekapitulasi Ketersediaan Air Setengah Bulan 16 - 31 Agustus 2026",
        subKategori: "HIDROLOGI",
        tanggalFormat: "Selasa, 01 September 2026",
        tanggalBadge: "01 September 2026",
        gambar: "/images/buletin/hidrologi/hidrologi-16-31-agus.jpg",
      },
      {
        id: "h4",
        judul: "Rekapitulasi Ketersediaan Air Per-Setengah Bulan, 1-15 Agustus 2026",
        subKategori: "HIDROLOGI",
        tanggalFormat: "Selasa, 18 Agustus 2026",
        tanggalBadge: "18 Agustus 2026",
        gambar: "/images/buletin/hidrologi/hidrologi-1-15-agus.jpg",
      },
      {
        id: "h5",
        judul: "Rekapitulasi Ketersediaan Air Per-Setengah Bulan, 16-31 Juli 2026",
        subKategori: "HIDROLOGI",
        tanggalFormat: "Senin, 03 Agustus 2026",
        tanggalBadge: "03 Agustus 2026",
        gambar: "/images/buletin/hidrologi/hidrologi-16-31-juli.jpg",
      },
    ],
  },
  hidrometeorologi: {
    nama: "Hidrometeorologi",
    deskripsi: "Infografis buletin hidrometeorologi Wilayah Sungai Serayu Opak dari BBWS Serayu Opak dan mitra walidata.",
    edisi: [],
    edisiPerHalaman: {
      // HALAMAN 1
      1: {
        bbws: [
          {
            id: "hm1",
            judul: "Curah Hujan Dasarian 11 – 20 Oktober 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 21 Oktober 2026",
            tanggalBadge: "21 Oktober 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/dasarian-11-20-okt.jpg",
          },
          {
            id: "hm2",
            judul: "Curah Hujan Dasarian 1 – 10 Oktober 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Minggu, 11 Oktober 2026",
            tanggalBadge: "11 Oktober 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/dasarian-1-10-okt.jpg",
          },
          {
            id: "hm3",
            judul: "Curah Hujan Dasarian 21 – 30 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 30 September 2026",
            tanggalBadge: "30 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/dasarian-21-30-sept.jpg",
          },
          {
            id: "hm4",
            judul: "Curah Hujan Harian 22 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Selasa, 22 September 2026",
            tanggalBadge: "22 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/harian-22-sept.jpg",
          },
          {
            id: "hm5",
            judul: "Curah Hujan Dasarian 11 – 20 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Senin, 21 September 2026",
            tanggalBadge: "21 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/dasarian-11-20-sept.jpg",
          },
          {
            id: "hm6",
            judul: "Curah Hujan Harian 21 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Senin, 21 September 2026",
            tanggalBadge: "21 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/harian-21-sept.jpg",
          },
        ],
        bmkgYogya: [
          {
            id: "bmy_h1_1",
            judul: "Buletin Informasi Iklim Edisi September 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 30 September 2026",
            tanggalBadge: "30 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-iklim-september.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-1/bmkg-iklim-september.pdf",
          },
          {
            id: "bmy_h1_2",
            judul: "Buletin Prediksi Musim Hujan Tahun 2026–2027 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 30 September 2026",
            tanggalBadge: "30 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-prediksi-hujan-2026-2027.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-1/bmkg-prediksi-hujan-2026-2027.pdf",
          },
          {
            id: "bmy_h1_3",
            judul: "Buletin Prediksi Musim Kemarau 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 30 September 2026",
            tanggalBadge: "30 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-prediksi-kemarau-2026.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-1/bmkg-prediksi-kemarau-2026.pdf",
          },
          {
            id: "bmy_h1_4",
            judul: "Buletin Informasi Iklim Edisi Agustus 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Senin, 31 Agustus 2026",
            tanggalBadge: "31 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-iklim-agustus.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-1/bmkg-iklim-agustus.pdf",
          },
          {
            id: "bmy_h1_5",
            judul: "Prediksi Peluang Curah Hujan Dasarian Update 31 Juli 2026",
            subKategori: "PREDIKSI PELUANG CURAH HUJAN",
            tanggalFormat: "Selasa, 04 Agustus 2026",
            tanggalBadge: "04 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-peluang-hujan-31juli.png",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/08/04/prediksi-peluang-curah-hujan-dasarian-iii-20-juli-2026-2/",
          },
          {
            id: "bmy_h1_6",
            judul: "Prediksi Hujan Dasarian Update 31 Juli 2026",
            subKategori: "PRAKIRAAN CURAH HUJAN DASARIAN",
            tanggalFormat: "Selasa, 04 Agustus 2026",
            tanggalBadge: "04 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-prakiraan-hujan-31juli.png",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/08/04/prakiraan-curah-hujan-dasarian-ii-ferbruari-2024-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-3-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
        ],
        bmkgJateng: [
          {
            id: "bmj1",
            judul: "Monitoring Hari Tanpa Hujan Provinsi Jawa Tengah",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Selasa, 11 Agustus 2026",
            tanggalBadge: "11 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-jateng-hth.png",
          },
          {
            id: "bmj2",
            judul: "Prediksi Curah Hujan wilayah Jawa Tengah bulan September 2026",
            subKategori: "PREDIKSI CURAH HUJAN 2 BULAN KEDEPAN",
            tanggalFormat: "Kamis, 30 Juli 2026",
            tanggalBadge: "30 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-jateng-hujan-september.webp",
            linkExternal: "https://staklim-jateng.bmkg.go.id/info-bulanan.php",
          },
          {
            id: "bmj3",
            judul: "Prediksi Curah Hujan wilayah Jawa Tengah bulan Oktober 2026",
            subKategori: "PREDIKSI CURAH HUJAN 3 BULAN KEDEPAN",
            tanggalFormat: "Kamis, 30 Juli 2026",
            tanggalBadge: "30 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-jateng-hujan-oktober.webp",
            linkExternal: "https://staklim-jateng.bmkg.go.id/info-bulanan.php",
          },
          {
            id: "bmj4",
            judul: "Analisis Curah Hujan wilayah Jawa Tengah bulan Juni 2026",
            subKategori: "ANALISIS CURAH HUJAN BULAN LALU",
            tanggalFormat: "Kamis, 30 Juli 2026",
            tanggalBadge: "30 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-jateng-hujan-juni.webp",
            linkExternal: "https://staklim-jateng.bmkg.go.id/info-bulanan.php",
          },
          {
            id: "bmj5",
            judul: "Prediksi Curah Hujan wilayah Jawa Tengah bulan Agustus 2026",
            subKategori: "PREDIKSI CURAH HUJAN 1 BULAN KEDEPAN",
            tanggalFormat: "Kamis, 30 Juli 2026",
            tanggalBadge: "30 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-jateng-hujan-agustus.webp",
            linkExternal: "https://staklim-jateng.bmkg.go.id/info-bulanan.php",
          },
          {
            id: "bmj6",
            judul: "Prediksi Probabilistik Curah Hujan Dasarian ke-3 Juli 2026",
            subKategori: "PREDIKSI PROBABILISTIK CURAH HUJAN",
            tanggalFormat: "Kamis, 30 Juli 2026",
            tanggalBadge: "30 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-1/bmkg-jateng-probabilistik-juli.webp",
            linkExternal: "https://staklim-jateng.bmkg.go.id/info-dasarian.php",
          },
        ],
      },
      // HALAMAN 2
      2: {
        bbws: [
          {
            id: "hm2_1",
            judul: "Curah Hujan Harian 20 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Minggu, 20 September 2026",
            tanggalBadge: "20 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/harian-20-sept.jpg",
            pdf: "/documents/buletin/hidrometeorologi/hal-2/harian-20-sept.pdf",
          },
          {
            id: "hm2_2",
            judul: "Curah Hujan Harian 19 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Sabtu, 19 September 2026",
            tanggalBadge: "19 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/harian-19-sept.jpg",
          },
          {
            id: "hm2_3",
            judul: "Curah Hujan Harian 18 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Jumat, 18 September 2026",
            tanggalBadge: "18 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/harian-18-sept.jpg",
          },
          {
            id: "hm2_4",
            judul: "Curah Hujan Harian 17 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Kamis, 17 September 2026",
            tanggalBadge: "17 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/harian-17-sept.jpg",
          },
          {
            id: "hm2_5",
            judul: "Curah Hujan Harian 16 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 16 September 2026",
            tanggalBadge: "16 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/harian-16-sept.jpg",
          },
          {
            id: "hm2_6",
            judul: "Curah Hujan Harian 15 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Selasa, 15 September 2026",
            tanggalBadge: "15 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/harian-15-sept.jpg",
          },
        ],
        bmkgYogya: [
          {
            id: "bmy1",
            judul: "Buletin Informasi Iklim Edisi Juli 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Jumat, 31 Juli 2026",
            tanggalBadge: "31 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/bmkg-iklim-juli.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-2/harian-20-sept.pdf",
          },
          {
            id: "bmy2",
            judul: "Analisis Curah Hujan Harian 29 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Rabu, 29 Juli 2026",
            tanggalBadge: "29 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/bmkg-iklim-agustus.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/29/analisis-curah-hujan-harian-26-juli-2026-2-2-2/",
          },
          {
            id: "bmy3",
            judul: "Analisis Curah Hujan Harian 23 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Kamis, 23 Juli 2026",
            tanggalBadge: "23 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/bmkg-iklim-juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/23/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy4",
            judul: "Analisis Curah Hujan Harian 21 Juli 2026 #2",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Rabu, 22 Juli 2026",
            tanggalBadge: "22 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/bmkg-prediksi-hujan-2026-2027.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/22/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy5",
            judul: "Analisis Curah Hujan Harian 22 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Rabu, 22 Juli 2026",
            tanggalBadge: "22 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/bmkg-prediksi-kemarau-2026.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/22/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy6",
            judul: "Prediksi Peluang Curah Hujan Dasarian Update 20 Juli 2026 #2",
            subKategori: "PREDIKSI PELUANG CURAH HUJAN",
            tanggalFormat: "Senin, 20 Juli 2026",
            tanggalBadge: "20 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-2/bmkg-peluang-hujan-20juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/20/prediksi-peluang-curah-hujan-dasarian-30-juni-2026-2-2/",
          },
        ],
        bmkgJateng: [],
      },
      // HALAMAN 3
      3: {
        bbws: [
          {
            id: "hm3_1",
            judul: "Curah Hujan Harian 14 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Senin, 14 September 2026",
            tanggalBadge: "14 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/harian-14-sept.jpg",
          },
          {
            id: "hm3_2",
            judul: "Curah Hujan Harian 13 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Minggu, 13 September 2026",
            tanggalBadge: "13 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/harian-13-sept.jpg",
          },
          {
            id: "hm3_3",
            judul: "Curah Hujan Harian 12 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Sabtu, 12 September 2026",
            tanggalBadge: "12 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/harian-12-sept.jpg",
          },
          {
            id: "hm3_4",
            judul: "Curah Hujan Harian 11 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Jumat, 11 September 2026",
            tanggalBadge: "11 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/harian-11-sept.jpg",
          },
          {
            id: "hm3_5",
            judul: "Curah Hujan Harian 10 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Kamis, 10 September 2026",
            tanggalBadge: "10 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/harian-10-sept.jpg",
          },
          {
            id: "hm3_6",
            judul: "Curah Hujan Harian 9 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 09 September 2026",
            tanggalBadge: "09 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/harian-9-sept.jpg",
          },
        ],
        bmkgYogya: [
          {
            id: "bmy3_1",
            judul: "Prediksi Hujan Dasarian Update 20 Juli 2026",
            subKategori: "PRAKIRAAN CURAH HUJAN DASARIAN",
            tanggalFormat: "Senin, 20 Juli 2026",
            tanggalBadge: "20 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/bmkg-prediksi-hujan-20juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/20/prakiraan-curah-hujan-dasarian-ii-ferbruari-2024-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-3-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy3_2",
            judul: "Monitoring Hari Tanpa Hujan Dasarian II Juli 2026",
            subKategori: "PETA HARI TANPA HUJAN",
            tanggalFormat: "Senin, 20 Juli 2026",
            tanggalBadge: "20 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/bmkg-hth-20juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/20/monitoring-hari-tanpa-hujan-dasarian-i-juni-2026-2-2-2/",
          },
          {
            id: "bmy3_3",
            judul: "Analisis Curah Hujan Harian 19 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Minggu, 19 Juli 2026",
            tanggalBadge: "19 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/bmkg-harian-19juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/19/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy3_4",
            judul: "Analisis Curah Hujan Harian 13 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Rabu, 13 Juli 2026",
            tanggalBadge: "13 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/bmkg-harian-13juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/13/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy3_5",
            judul: "Analisis Curah Hujan Dasarian I Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN DASARIAN",
            tanggalFormat: "Selasa, 12 Juli 2026",
            tanggalBadge: "12 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/bmkg-dasarian-1juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/12/analisis-curah-hujan-dasarian-i-juni-2026-2-2-2/",
          },
          {
            id: "bmy3_6",
            judul: "Analisis Curah Hujan Harian 12 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Selasa, 12 Juli 2026",
            tanggalBadge: "12 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-3/bmkg-harian-12juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/12/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
        ],
        bmkgJateng: [],
      },
      // HALAMAN 4
      4: {
        bbws: [
          {
            id: "hm4_1",
            judul: "Curah Hujan Harian 8 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Selasa, 08 September 2026",
            tanggalBadge: "08 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/harian-8-sept.jpg",
          },
          {
            id: "hm4_2",
            judul: "Curah Hujan Harian 7 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Senin, 07 September 2026",
            tanggalBadge: "07 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/harian-7-sept.jpg",
          },
          {
            id: "hm4_3",
            judul: "Curah Hujan Harian 6 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Minggu, 06 September 2026",
            tanggalBadge: "06 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/harian-6-sept.jpg",
          },
          {
            id: "hm4_4",
            judul: "Curah Hujan Harian 5 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Sabtu, 05 September 2026",
            tanggalBadge: "05 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/harian-5-sept.jpg",
          },
          {
            id: "hm4_5",
            judul: "Curah Hujan Harian 4 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Jumat, 04 September 2026",
            tanggalBadge: "04 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/harian-4-sept.jpg",
          },
          {
            id: "hm4_6",
            judul: "Curah Hujan Harian 3 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Kamis, 03 September 2026",
            tanggalBadge: "03 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/harian-3-sept.jpg",
          },
        ],
        bmkgYogya: [
          {
            id: "bmy4_1",
            judul: "Prediksi Peluang Curah Hujan Dasarian Update 10 Juli 2026",
            subKategori: "PREDIKSI PELUANG CURAH HUJAN",
            tanggalFormat: "Jumat, 10 Juli 2026",
            tanggalBadge: "10 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/bmkg-peluang-hujan-10juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/10/prediksi-peluang-curah-hujan-dasarian-30-juni-2026-2/",
          },
          {
            id: "bmy4_2",
            judul: "Monitoring Hari Tanpa Hujan Dasarian I Juli 2026",
            subKategori: "PETA HARI TANPA HUJAN",
            tanggalFormat: "Jumat, 10 Juli 2026",
            tanggalBadge: "10 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/bmkg-hth-10juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/10/monitoring-hari-tanpa-hujan-dasarian-i-juni-2026-2-2/",
          },
          {
            id: "bmy4_3",
            judul: "Prediksi Hujan Dasarian Update 10 Juli 2026",
            subKategori: "PRAKIRAAN CURAH HUJAN DASARIAN",
            tanggalFormat: "Jumat, 10 Juli 2026",
            tanggalBadge: "10 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/bmkg-prediksi-hujan-10juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/10/prakiraan-curah-hujan-dasarian-ii-ferbruari-2024-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-3-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy4_4",
            judul: "Analisis Curah Hujan Harian 10 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Jumat, 10 Juli 2026",
            tanggalBadge: "10 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/bmkg-harian-10juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/10/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy4_5",
            judul: "Analisis Curah Hujan Harian 08 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Rabu, 08 Juli 2026",
            tanggalBadge: "08 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/bmkg-harian-8juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/08/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy4_6",
            judul: "Analisis Curah Hujan Harian 06 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Senin, 06 Juli 2026",
            tanggalBadge: "06 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-4/bmkg-harian-6juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/06/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
        ],
        bmkgJateng: [],
      },
      // HALAMAN 5
      5: {
        bbws: [
          {
            id: "hm5_1",
            judul: "Curah Hujan Harian 2 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 02 September 2026",
            tanggalBadge: "02 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/harian-2-sept.jpg",
          },
          {
            id: "hm5_2",
            judul: "Rekapitulasi Ketersediaan Air Setengah Bulan 16 – 31 Agustus 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 02 September 2026",
            tanggalBadge: "02 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/rekap-16-31-agus.jpg",
          },
          {
            id: "hm5_3",
            judul: "Curah Hujan Harian 1 September 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Selasa, 01 September 2026",
            tanggalBadge: "01 September 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/harian-1-sept.jpg",
          },
          {
            id: "hm5_4",
            judul: "Curah Hujan Harian 31 Agustus 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Senin, 31 Agustus 2026",
            tanggalBadge: "31 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/harian-31-agus.jpg",
          },
          {
            id: "hm5_5",
            judul: "Analisis Curah Hujan Bulanan Agustus 2026, Wilayah BBWS Serayu Opak",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Senin, 31 Agustus 2026",
            tanggalBadge: "31 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/bulanan-bbws-agustus.jpg",
          },
          {
            id: "hm5_6",
            judul: "Analisis Curah Hujan Bulanan Agustus 2026, Wilayah Daerah Istimewa Yogyakarta",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Senin, 31 Agustus 2026",
            tanggalBadge: "31 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/bulanan-diy-agustus.jpg",
          },
        ],
        bmkgYogya: [
          {
            id: "bmy5_1",
            judul: "Analisis Curah Hujan Harian 05 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Minggu, 05 Juli 2026",
            tanggalBadge: "05 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/bmkg-harian-5juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/05/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy5_2",
            judul: "Analisis Curah Hujan Harian 04 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Sabtu, 04 Juli 2026",
            tanggalBadge: "04 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/bmkg-harian-4juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/04/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy5_3",
            judul: "Analisis Curah Hujan Harian 03 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Jumat, 03 Juli 2026",
            tanggalBadge: "03 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/bmkg-harian-3juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/03/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy5_4",
            judul: "Analisis Curah Hujan Harian 01 Juli 2026",
            subKategori: "ANALISIS CURAH HUJAN HARIAN",
            tanggalFormat: "Rabu, 01 Juli 2026",
            tanggalBadge: "01 Juli 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/bmkg-harian-1juli.jpg",
            linkExternal: "https://staklim-yogya.bmkg.go.id/2026/07/01/analisis-curah-hujan-harian-18-juni-2026-2-2-2-2-2-2-2-2-2-2-2-2/",
          },
          {
            id: "bmy5_5",
            judul: "Buletin Informasi Iklim Edisi Juni 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Selasa, 30 Juni 2026",
            tanggalBadge: "30 Juni 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/bmkg-iklim-juni.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-5/bmkg-iklim-juni.pdf",
          },
          {
            id: "bmy5_6",
            judul: "Buletin Informasi Iklim Edisi Mei 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Minggu, 31 Mei 2026",
            tanggalBadge: "31 Mei 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-5/bmkg-iklim-mei.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-5/bmkg-iklim-mei.pdf",
          },
        ],
        bmkgJateng: [],
      },
      // HALAMAN 6
      6: {
        bbws: [
          {
            id: "hm6_1",
            judul: "Curah Hujan Harian 30 Agustus 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Minggu, 30 Agustus 2026",
            tanggalBadge: "30 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/harian-30-agus.jpg",
          },
          {
            id: "hm6_2",
            judul: "Curah Hujan Harian 29 Agustus 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Sabtu, 29 Agustus 2026",
            tanggalBadge: "29 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/harian-29-agus.jpg",
          },
          {
            id: "hm6_3",
            judul: "Curah Hujan Harian 28 Agustus 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Jumat, 28 Agustus 2026",
            tanggalBadge: "28 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/harian-28-agus.jpg",
          },
          {
            id: "hm6_4",
            judul: "Curah Hujan Harian 27 Agustus 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Kamis, 27 Agustus 2026",
            tanggalBadge: "27 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/harian-27-agus.jpg",
          },
          {
            id: "hm6_5",
            judul: "Curah Hujan Harian 26 Agustus 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Rabu, 26 Agustus 2026",
            tanggalBadge: "26 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/harian-26-agus.jpg",
          },
          {
            id: "hm6_6",
            judul: "Curah Hujan Harian 25 Agustus 2026",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Selasa, 25 Agustus 2026",
            tanggalBadge: "25 Agustus 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/harian-25-agus.jpg",
          },
        ],
        bmkgYogya: [
          {
            id: "bmy6_1",
            judul: "Buletin Informasi Iklim Edisi April 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Kamis, 30 April 2026",
            tanggalBadge: "30 April 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/bmkg-iklim-april.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-6/bmkg-iklim-april.pdf",
          },
          {
            id: "bmy6_2",
            judul: "Buletin Informasi Iklim Edisi Maret 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Selasa, 31 Maret 2026",
            tanggalBadge: "31 Maret 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/bmkg-iklim-maret.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-6/bmkg-iklim-maret.pdf",
          },
          {
            id: "bmy6_3",
            judul: "Buletin Informasi Iklim Edisi Februari 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Sabtu, 28 Februari 2026",
            tanggalBadge: "28 Februari 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/bmkg-iklim-februari.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-6/bmkg-iklim-februari.pdf",
          },
          {
            id: "bmy6_4",
            judul: "Buletin Informasi Iklim Edisi Januari 2026 DIY",
            subKategori: "HIDROMETEOROLOGI",
            tanggalFormat: "Sabtu, 31 Januari 2026",
            tanggalBadge: "31 Januari 2026",
            gambar: "/images/buletin/hidrometeorologi/hal-6/bmkg-iklim-januari.png",
            pdf: "/documents/buletin/hidrometeorologi/hal-6/bmkg-iklim-januari.pdf",
          },
        ],
        bmkgJateng: [],
      },
      7: { bbws: [], bmkgYogya: [], bmkgJateng: [] },
      8: { bbws: [], bmkgYogya: [], bmkgJateng: [] },
      9: { bbws: [], bmkgYogya: [], bmkgJateng: [] },
      10: { bbws: [], bmkgYogya: [], bmkgJateng: [] },
      11: { bbws: [], bmkgYogya: [], bmkgJateng: [] },
      12: { bbws: [], bmkgYogya: [], bmkgJateng: [] },
      13: { bbws: [], bmkgYogya: [], bmkgJateng: [] },
      14: { bbws: [], bmkgYogya: [], bmkgJateng: [] },
      15: { bbws: [], bmkgYogya: [], bmkgJateng: [] },
    },
  },
  hidrogeologi: {
    nama: "Hidrogeologi",
    deskripsi: "Infografis buletin hidrogeologi Wilayah Sungai Serayu Opak dari BBWS Serayu Opak dan mitra walidata.",
    edisi: [],
  },
  kejadian: {
    nama: "Kejadian Lainnya",
    deskripsi: "Infografis buletin kejadian lainnya Wilayah Sungai Serayu Opak dari BBWS Serayu Opak dan mitra walidata.",
    edisi: [
      {
        id: "k1",
        judul: "Buletin Kekeringan Dasarian II September",
        subKategori: "KEJADIAN LAINNYA",
        tanggalFormat: "Rabu, 23 September 2026",
        tanggalBadge: "23 September 2026",
        gambar: "/images/buletin/kejadian/kejadian-23-sept.png",
        pdf: "/documents/buletin/kejadian/kejadian-23-sept.pdf",
      },
      {
        id: "k2",
        judul: "Buletin kekeringan Dasarian I September-3",
        subKategori: "KEJADIAN LAINNYA",
        tanggalFormat: "Senin, 21 September 2026",
        tanggalBadge: "21 September 2026",
        gambar: "/images/buletin/kejadian/kejadian-21-sept.png",
        pdf: "/documents/buletin/kejadian/kejadian-21-sept.pdf",
      },
      {
        id: "k3",
        judul: "Buletin Kekeringan Dasarian III",
        subKategori: "KEJADIAN LAINNYA",
        tanggalFormat: "Rabu, 02 September 2026",
        tanggalBadge: "02 September 2026",
        gambar: "/images/buletin/kejadian/kejadian-2-sept.png",
        pdf: "/documents/buletin/kejadian/kejadian-2-sept.pdf",
      },
      {
        id: "k4",
        judul: "Overview Kekeringan Pertanian BBWS Serayu Opak",
        subKategori: "KEJADIAN LAINNYA",
        tanggalFormat: "Senin, 24 Agustus 2026",
        tanggalBadge: "24 Agustus 2026",
        gambar: "/images/buletin/kejadian/overview-kekeringan-24-agus.png",
        pdf: "/documents/buletin/kejadian/overview-kekeringan-24-agus.pdf",
      },
    ],
  },
  elnino: {
    nama: "El Nino",
    deskripsi: "Infografis buletin laporan satgas El Nino Wilayah Sungai Serayu Opak dari BBWS Serayu Opak dan mitra walidata.",
    edisi: [],
    edisiPerHalaman: {
      // HALAMAN 1 EL NINO
      1: {
        bbws: [
          {
            id: "e1_1",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Selasa, 20 Oktober 2026",
            tanggalBadge: "20 Oktober 2026",
            gambar: "/images/buletin/elnino/hal-1/elnino-20-okt.png",
            pdf: "/documents/buletin/elnino/hal-1/elnino-20-okt.pdf",
          },
          {
            id: "e1_2",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Senin, 19 Oktober 2026",
            tanggalBadge: "19 Oktober 2026",
            gambar: "/images/buletin/elnino/hal-1/elnino-19-okt.png",
            pdf: "/documents/buletin/elnino/hal-1/elnino-19-okt.pdf",
          },
          {
            id: "e1_3",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Minggu, 18 Oktober 2026",
            tanggalBadge: "18 Oktober 2026",
            gambar: "/images/buletin/elnino/hal-1/elnino-18-okt.png",
            pdf: "/documents/buletin/elnino/hal-1/elnino-18-okt.pdf",
          },
          {
            id: "e1_4",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Sabtu, 17 Oktober 2026",
            tanggalBadge: "17 Oktober 2026",
            gambar: "/images/buletin/elnino/hal-1/elnino-17-okt.png",
            pdf: "/documents/buletin/elnino/hal-1/elnino-17-okt.pdf",
          },
          {
            id: "e1_5",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Jumat, 16 Oktober 2026",
            tanggalBadge: "16 Oktober 2026",
            gambar: "/images/buletin/elnino/hal-1/elnino-16-okt.png",
            pdf: "/documents/buletin/elnino/hal-1/elnino-16-okt.pdf",
          },
          {
            id: "e1_6",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Kamis, 15 Oktober 2026",
            tanggalBadge: "15 Oktober 2026",
            gambar: "/images/buletin/elnino/hal-1/elnino-15-okt.png",
            pdf: "/documents/buletin/elnino/hal-1/elnino-15-okt.pdf",
          },
        ],
        bmkgYogya: [],
        bmkgJateng: [],
      },
      // HALAMAN 2 EL NINO
      2: {
        bbws: [
          {
            id: "e2_1",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Kamis, 17 September 2026",
            tanggalBadge: "17 September 2026",
            gambar: "/images/buletin/elnino/hal-2/elnino-17-sept.png",
            pdf: "/documents/buletin/elnino/hal-2/elnino-17-sept.pdf",
          },
          {
            id: "e2_2",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Rabu, 16 September 2026",
            tanggalBadge: "16 September 2026",
            gambar: "/images/buletin/elnino/hal-2/elnino-16-sept.png",
            pdf: "/documents/buletin/elnino/hal-2/elnino-16-sept.pdf",
          },
          {
            id: "e2_3",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Selasa, 15 September 2026",
            tanggalBadge: "15 September 2026",
            gambar: "/images/buletin/elnino/hal-2/elnino-15-sept.png",
            pdf: "/documents/buletin/elnino/hal-2/elnino-15-sept.pdf",
          },
          {
            id: "e2_4",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Senin, 14 September 2026",
            tanggalBadge: "14 September 2026",
            gambar: "/images/buletin/elnino/hal-2/elnino-14-sept.png",
            pdf: "/documents/buletin/elnino/hal-2/elnino-14-sept.pdf",
          },
          {
            id: "e2_5",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Minggu, 13 September 2026",
            tanggalBadge: "13 September 2026",
            gambar: "/images/buletin/elnino/hal-2/elnino-13-sept.png",
            pdf: "/documents/buletin/elnino/hal-2/elnino-13-sept.pdf",
          },
          {
            id: "e2_6",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Sabtu, 12 September 2026",
            tanggalBadge: "12 September 2026",
            gambar: "/images/buletin/elnino/hal-2/elnino-12-sept.png",
            pdf: "/documents/buletin/elnino/hal-2/elnino-12-sept.pdf",
          },
        ],
        bmkgYogya: [],
        bmkgJateng: [],
      },
      // HALAMAN 3 EL NINO
      3: {
        bbws: [
          {
            id: "e3_1",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Jumat, 11 September 2026",
            tanggalBadge: "11 September 2026",
            gambar: "/images/buletin/elnino/hal-3/elnino-11-sept.png",
            pdf: "/documents/buletin/elnino/hal-3/elnino-11-sept.pdf",
          },
          {
            id: "e3_2",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Kamis, 10 September 2026",
            tanggalBadge: "10 September 2026",
            gambar: "/images/buletin/elnino/hal-3/elnino-10-sept.png",
            pdf: "/documents/buletin/elnino/hal-3/elnino-10-sept.pdf",
          },
          {
            id: "e3_3",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Rabu, 09 September 2026",
            tanggalBadge: "09 September 2026",
            gambar: "/images/buletin/elnino/hal-3/elnino-09-sept.png",
            pdf: "/documents/buletin/elnino/hal-3/elnino-09-sept.pdf",
          },
          {
            id: "e3_4",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Selasa, 08 September 2026",
            tanggalBadge: "08 September 2026",
            gambar: "/images/buletin/elnino/hal-3/elnino-08-sept.png",
            pdf: "/documents/buletin/elnino/hal-3/elnino-08-sept.pdf",
          },
          {
            id: "e3_5",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Senin, 07 September 2026",
            tanggalBadge: "07 September 2026",
            gambar: "/images/buletin/elnino/hal-3/elnino-07-sept.png",
            pdf: "/documents/buletin/elnino/hal-3/elnino-07-sept.pdf",
          },
          {
            id: "e3_6",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Minggu, 06 September 2026",
            tanggalBadge: "06 September 2026",
            gambar: "/images/buletin/elnino/hal-3/elnino-06-sept.png",
            pdf: "/documents/buletin/elnino/hal-3/elnino-06-sept.pdf",
          },
        ],
        bmkgYogya: [],
        bmkgJateng: [],
      },
      // HALAMAN 4 EL NINO
      4: {
        bbws: [
          {
            id: "e4_1",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Sabtu, 05 September 2026",
            tanggalBadge: "05 September 2026",
            gambar: "/images/buletin/elnino/hal-4/elnino-05-sept.png",
            pdf: "/documents/buletin/elnino/hal-4/elnino-05-sept.pdf",
          },
          {
            id: "e4_2",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Jumat, 04 September 2026",
            tanggalBadge: "04 September 2026",
            gambar: "/images/buletin/elnino/hal-4/elnino-04-sept.png",
            pdf: "/documents/buletin/elnino/hal-4/elnino-04-sept.pdf",
          },
          {
            id: "e4_3",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Kamis, 03 September 2026",
            tanggalBadge: "03 September 2026",
            gambar: "/images/buletin/elnino/hal-4/elnino-03-sept.png",
            pdf: "/documents/buletin/elnino/hal-4/elnino-03-sept.pdf",
          },
          {
            id: "e4_4",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Rabu, 02 September 2026",
            tanggalBadge: "02 September 2026",
            gambar: "/images/buletin/elnino/hal-4/elnino-02-sept.png",
            pdf: "/documents/buletin/elnino/hal-4/elnino-02-sept.pdf",
          },
          {
            id: "e4_5",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Selasa, 01 September 2026",
            tanggalBadge: "01 September 2026",
            gambar: "/images/buletin/elnino/hal-4/elnino-01-sept.png",
            pdf: "/documents/buletin/elnino/hal-4/elnino-01-sept.pdf",
          },
          {
            id: "e4_6",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Senin, 31 Agustus 2026",
            tanggalBadge: "31 Agustus 2026",
            gambar: "/images/buletin/elnino/hal-4/elnino-31-agus.png",
            pdf: "/documents/buletin/elnino/hal-4/elnino-31-agus.pdf",
          },
        ],
        bmkgYogya: [],
        bmkgJateng: [],
      },
      // HALAMAN 5 EL NINO
      5: {
        bbws: [
          {
            id: "e5_1",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Minggu, 30 Agustus 2026",
            tanggalBadge: "30 Agustus 2026",
            gambar: "/images/buletin/elnino/hal-5/elnino-30-agus.png",
            pdf: "/documents/buletin/elnino/hal-5/elnino-30-agus.pdf",
          },
          {
            id: "e5_2",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Sabtu, 29 Agustus 2026",
            tanggalBadge: "29 Agustus 2026",
            gambar: "/images/buletin/elnino/hal-5/elnino-29-agus.png",
            pdf: "/documents/buletin/elnino/hal-5/elnino-29-agus.pdf",
          },
          {
            id: "e5_3",
            judul: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
            subKategori: "EL NINO",
            tanggalFormat: "Jumat, 28 Agustus 2026",
            tanggalBadge: "28 Agustus 2026",
            gambar: "/images/buletin/elnino/hal-5/elnino-28-agus.png",
            pdf: "/documents/buletin/elnino/hal-5/elnino-28-agus.pdf",
          },
        ],
        bmkgYogya: [],
        bmkgJateng: [],
      },
    },
  },
};

export default function SubBuletinPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categoryParam = resolvedParams?.category ?? "";
  const key = categoryParam.toLowerCase();

  const info = dataPerKategori[key] || {
    nama: categoryParam || "Buletin",
    deskripsi: "Infografis buletin Wilayah Sungai Serayu Opak dari BBWS Serayu Opak dan mitra walidata.",
    edisi: [],
  };

  const [selectedEdisi, setSelectedEdisi] = useState<ItemBuletinDetail | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const hasPagination = (key === "hidrometeorologi" || key === "elnino") && !!info.edisiPerHalaman;

  const currentDataHalaman = (
    info.edisiPerHalaman?.[currentPage] && 
    ((info.edisiPerHalaman[currentPage].bbws?.length ?? 0) > 0 || 
     (info.edisiPerHalaman[currentPage].bmkgYogya?.length ?? 0) > 0)
  )
    ? info.edisiPerHalaman[currentPage]
    : info.edisiPerHalaman?.[1] || { bbws: [], bmkgYogya: [], bmkgJateng: [] };

  const listBBWS = hasPagination ? (currentDataHalaman.bbws || []) : info.edisi;
  const listBMKGYogya = hasPagination ? (currentDataHalaman.bmkgYogya || []) : (info.edisiBMKGYogya || []);
  const listBMKGJateng = hasPagination ? (currentDataHalaman.bmkgJateng || []) : (info.edisiBMKGJateng || []);

  const totalPages = key === "hidrometeorologi" ? 15 : key === "elnino" ? 5 : 1;
  // ---------------------------------------------------------------------------

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <header className="relative bg-[#0F2238] px-4 py-16 text-center text-white sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">PORTAL SIH3</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Buletin {info.nama}</h1>
        <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-400" />
        <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
          {info.deskripsi}
        </p>
      </header>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/galeri/buletin" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-700">
            &larr; Kembali ke Semua Buletin
          </Link>
          <div className="mt-2">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Edisi {info.nama.toLowerCase()}
            </h2>
            <p className="mt-1 text-xs text-slate-500">Klik infografis untuk melihat ukuran penuh dan mengunduhnya.</p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <Link href="/galeri/buletin" className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">
            Semua
          </Link>
          <Link href="/galeri/buletin/hidrologi" className={`rounded-md px-3 py-1.5 text-xs font-medium ${key === "hidrologi" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-200"}`}>
            • Hidrologi
          </Link>
          <Link href="/galeri/buletin/hidrometeorologi" className={`rounded-md px-3 py-1.5 text-xs font-medium ${key === "hidrometeorologi" ? "bg-purple-700 text-white" : "text-slate-600 hover:bg-slate-200"}`}>
            • Hidrometeorologi
          </Link>
          <Link href="/galeri/buletin/hidrogeologi" className={`rounded-md px-3 py-1.5 text-xs font-medium ${key === "hidrogeologi" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-200"}`}>
            • Hidrogeologi
          </Link>
          <Link href="/galeri/buletin/kejadian" className={`rounded-md px-3 py-1.5 text-xs font-medium ${key === "kejadian" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-200"}`}>
            • Kejadian Lainnya
          </Link>
          <Link href="/galeri/buletin/elnino" className={`rounded-md px-3 py-1.5 text-xs font-medium ${key === "elnino" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-200"}`}>
            • El Nino
          </Link>
        </div>

        {/* SECTION 1: BBWS SERAYU OPAK */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">BBWS Serayu Opak</h3>
          <span className="text-xs font-medium text-slate-500">{listBBWS.length} edisi</span>
        </div>

        {listBBWS.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listBBWS.map((item) => (
              <div key={item.id} className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md border border-slate-100">
                <div 
                  onClick={() => setSelectedEdisi(item)} 
                  className="group relative flex h-80 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="max-h-full max-w-full rounded object-contain shadow-sm transition duration-300 group-hover:scale-105"
                  />
                  <button className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white shadow backdrop-blur-sm transition hover:bg-slate-900">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    Perbesar
                  </button>
                </div>

                <div className="mt-4 flex flex-1 flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                      {item.subKategori || info.nama}
                    </span>
                    <h4 
                      onClick={() => setSelectedEdisi(item)}
                      className="mt-1 line-clamp-2 cursor-pointer text-sm font-bold leading-snug text-[#0284C7] hover:underline"
                    >
                      {item.judul}
                    </h4>
                  </div>

                  <div className="mt-4 flex items-center gap-4 pt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {item.tanggalBadge}
                    </span>
                    <button
                      onClick={() => setSelectedEdisi(item)}
                      className="flex items-center gap-1 font-semibold text-slate-700 hover:text-sky-600"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Unduh
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-slate-400">Belum ada edisi buletin untuk halaman ini.</p>
          </div>
        )}

        {/* SECTION 2: STASIUN KLIMATOLOGI DI YOGYAKARTA */}
        {listBMKGYogya.length > 0 && (
          <div className="mt-14">
            <div className="mb-6 flex items-center justify-between border-t border-slate-200 pt-8">
              <h3 className="text-xl font-bold text-slate-900">Stasiun Klimatologi DI Yogyakarta</h3>
              <span className="text-xs font-medium text-slate-500">{listBMKGYogya.length} edisi</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listBMKGYogya.map((item) => (
                <div key={item.id} className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md border border-slate-100">
                  <div 
                    onClick={() => setSelectedEdisi(item)} 
                    className="group relative flex h-80 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="max-h-full max-w-full rounded object-contain shadow-sm transition duration-300 group-hover:scale-105"
                    />
                    <button className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white shadow backdrop-blur-sm transition hover:bg-slate-900">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                      Perbesar
                    </button>
                  </div>

                  <div className="mt-4 flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                        {item.subKategori || info.nama}
                      </span>
                      <h4 
                        onClick={() => setSelectedEdisi(item)}
                        className="mt-1 line-clamp-2 cursor-pointer text-sm font-bold leading-snug text-[#0284C7] hover:underline"
                      >
                        {item.judul}
                      </h4>
                    </div>

                    <div className="mt-4 flex items-center gap-4 pt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {item.tanggalBadge}
                      </span>
                      <button
                        onClick={() => setSelectedEdisi(item)}
                        className="flex items-center gap-1 font-semibold text-slate-700 hover:text-sky-600"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Unduh
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: STASIUN KLIMATOLOGI JAWA TENGAH */}
        {listBMKGJateng.length > 0 && (
          <div className="mt-14">
            <div className="mb-6 flex items-center justify-between border-t border-slate-200 pt-8">
              <h3 className="text-xl font-bold text-slate-900">Stasiun Klimatologi Jawa Tengah</h3>
              <span className="text-xs font-medium text-slate-500">{listBMKGJateng.length} edisi</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listBMKGJateng.map((item) => (
                <div key={item.id} className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md border border-slate-100">
                  <div 
                    onClick={() => setSelectedEdisi(item)} 
                    className="group relative flex h-80 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="max-h-full max-w-full rounded object-contain shadow-sm transition duration-300 group-hover:scale-105"
                    />
                    <button className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white shadow backdrop-blur-sm transition hover:bg-slate-900">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                      Perbesar
                    </button>
                  </div>

                  <div className="mt-4 flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                        {item.subKategori || info.nama}
                      </span>
                      <h4 
                        onClick={() => setSelectedEdisi(item)}
                        className="mt-1 line-clamp-2 cursor-pointer text-sm font-bold leading-snug text-[#0284C7] hover:underline"
                      >
                        {item.judul}
                      </h4>
                    </div>

                    <div className="mt-4 flex items-center gap-4 pt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {item.tanggalBadge}
                      </span>
                      <button
                        onClick={() => setSelectedEdisi(item)}
                        className="flex items-center gap-1 font-semibold text-slate-700 hover:text-sky-600"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Unduh
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGINATION */}
        {hasPagination && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? "bg-[#0284C7] text-white shadow-md scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
              title="Halaman Selanjutnya"
            >
              &gt;
            </button>
          </div>
        )}
      </section>

      {/* MODAL POP-UP */}
      {selectedEdisi && (
        <div 
          onClick={() => setSelectedEdisi(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
          >
            <button
              onClick={() => setSelectedEdisi(null)}
              className="absolute top-5 right-6 text-xl font-bold text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            <div className="flex w-full items-center justify-center rounded-2xl bg-slate-100 p-6 sm:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedEdisi.gambar}
                alt={selectedEdisi.judul}
                className="max-h-[380px] w-auto rounded object-contain"
              />
            </div>

            <div className="mt-5 flex flex-col">
              <h3 className="text-base font-bold text-slate-900 leading-snug">{selectedEdisi.judul}</h3>
              <p className="mt-1 text-xs italic text-slate-500">{selectedEdisi.tanggalFormat}</p>

              <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">
                  {selectedEdisi.subKategori || info.nama}
                </span>
                <p className="mt-0.5 text-slate-500">{selectedEdisi.judul}</p>
              </div>
              
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <a
                  href={selectedEdisi.gambar}
                  download
                  className="rounded-full bg-[#0284C7] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0369A1]"
                >
                  Download JPG
                </a>

                {selectedEdisi.pdf && (
                  <a
                    href={selectedEdisi.pdf}
                    download
                    className="rounded-full bg-[#0284C7] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0369A1]"
                  >
                    Download PDF
                  </a>
                )}

                {selectedEdisi.linkExternal && (
                  <a
                    href={selectedEdisi.linkExternal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#D9383A] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#B91C1C]"
                  >
                    Kunjungi Halaman &raquo;
                  </a>
                )}

                <button
                  onClick={() => setSelectedEdisi(null)}
                  className="rounded-full bg-[#0284C7] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0369A1]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}