"use client";

import { useState } from "react";

type ItemAlbum = {
  id: string;
  judul: string;
  kategori: "acara" | "lapangan";
  tanggalFormat: string;
  subTanggalFormat: string;
  deskripsi: string;
  gambarCover: string;
  galeriGambar: string[];
  lokasi?: string;
};

// ================= DATA ACARA =================
const dataAcara: ItemAlbum[] = [
  {
    id: "a_1",
    judul: "Rapat Diseminasi Data Kualitas Air Tahun 2026",
    kategori: "acara",
    tanggalFormat: "08 SEPTEMBER 2026",
    subTanggalFormat: "Selasa, 8 September 2026",
    lokasi: "BBWS Serayu Opak",
    deskripsi:
      "Pelaksanaan Rapat Diseminasi Data Kualitas Air Tahun 2026 oleh Tim Hidrologi & Kualitas Air BBWS Serayu Opak untuk menyajikan hasil pemantauan dan evaluasi kondisi kualitas air.",
    gambarCover: "/images/album/acara/diseminasi-kualitas-air.jpg",
    galeriGambar: ["/images/album/acara/diseminasi-kualitas-air.jpg"],
  },
  {
    id: "a_2",
    judul: "Rapat Pengelolaan Portal SIH3",
    kategori: "acara",
    tanggalFormat: "24 AGUSTUS 2026",
    subTanggalFormat: "Senin, 24 Agustus 2026",
    lokasi: "BBWS Serayu Opak",
    deskripsi:
      "Rapat pemantauan dan koordinasi rutin pengembangan sistem informasi portal terpadu SIH3 BBWS Serayu Opak.",
    gambarCover: "/images/album/acara/pengelolaan-portal-sih3.jpg",
    galeriGambar: ["/images/album/acara/pengelolaan-portal-sih3.jpg"],
  },
  {
    id: "a_3",
    judul: "Rapat Konsep Neraca Air (RAAT)",
    kategori: "acara",
    tanggalFormat: "17 JULI 2026",
    subTanggalFormat: "Jumat, 17 Juli 2026",
    lokasi: "BBWS Serayu Opak",
    deskripsi:
      "Pada hari Jumat, 17 Juli 2026, Tim Hidrologi dan Kualitas Air BBWS Serayu Opak menggelar rapat intensif pembahasan konsep Neraca Air dalam rangka Rencana Alokasi Air Tahunan (RAAT).",
    gambarCover: "/images/album/acara/rapat-konsep-neraca-air.jpg",
    galeriGambar: ["/images/album/acara/rapat-konsep-neraca-air.jpg"],
  },
  {
    id: "a_4",
    judul: "Rapat Rasionalisasi Pos Hidrologi",
    kategori: "acara",
    tanggalFormat: "31 AGUSTUS 2026",
    subTanggalFormat: "Senin, 31 Agustus 2026",
    lokasi: "BBWS Serayu Opak",
    deskripsi:
      "Pelaksanaan rapat evaluasi jaringan dan rasionalisasi pos hidrologi guna meningkatkan efisiensi serta efektivitas pos pengamatan.",
    gambarCover: "/images/album/acara/rasionalisasi-pos-hidrologi.jpg",
    galeriGambar: ["/images/album/acara/rasionalisasi-pos-hidrologi.jpg"],
  },
  {
    id: "a_5",
    judul: "Studi Rasionalisasi Pos Hidrologi",
    kategori: "acara",
    tanggalFormat: "28 JULI 2026",
    subTanggalFormat: "Selasa, 28 Juli 2026",
    lokasi: "Kantor BBWS Serayu Opak",
    deskripsi:
      "Pada Selasa, 28 Juli 2026, Tim Hidrologi dan Kualitas Air BBWS Serayu Opak menggelar Rapat Studi Rasionalisasi Pos Hidrologi BBWS Serayu Opak. Kegiatan ini bertujuan untuk mengkaji, mengevaluasi, serta mengoptimalkan sebaran jaringan pos.",
    gambarCover: "/images/album/acara/studi-rasionalisasi-28juli.jpg",
    galeriGambar: ["/images/album/acara/studi-rasionalisasi-28juli.jpg"],
  },
  {
    id: "a_6",
    judul: "Rapat Studi Rasionalisasi Pos Hidrologi",
    kategori: "acara",
    tanggalFormat: "28 AGUSTUS 2026",
    subTanggalFormat: "Jumat, 28 Agustus 2026",
    lokasi: "BBWS Serayu Opak",
    deskripsi:
      "Pembahasan studi kelayakan dan penataan kembali pos-pos hidrologi di wilayah kerja BBWS Serayu Opak.",
    gambarCover: "/images/album/acara/studi-rasionalisasi-pos-hidrologi.jpg",
    galeriGambar: ["/images/album/acara/studi-rasionalisasi-pos-hidrologi.jpg"],
  },
  {
    id: "a_7",
    judul: "Workshop Pengelolaan SIH3",
    kategori: "acara",
    tanggalFormat: "17 JULI 2026",
    subTanggalFormat: "Selasa, 14 Juli 2026",
    lokasi: "Ruang Serayu, BBWS Serayu Opak",
    deskripsi:
      "Menindaklanjuti surat undangan Nomor: UM 0102/B/Bbws8/2026/532 tanggal 3 Juli 2026, bersama ini pada Selasa, 14 Juli 2026 di Ruang Serayu, Balai Besar Wilayah Sungai Serayu Opak, kami melaksanakan perihal Workshop Kegiatan Pengelolaan SIH3 di Wilayah Sungai Progo-Opak-Serang.",
    gambarCover: "/images/album/acara/workshop-pengelolaan-sih3.jpg",
    galeriGambar: ["/images/album/acara/workshop-pengelolaan-sih3.jpg"],
  },
];

// ================= DATA LAPANGAN HALAMAN 1 =================
const dataLapanganHal1: ItemAlbum[] = [
  {
    id: "l1_1",
    judul: "Pengambilan Sampel Kualitas Air di Banyumas",
    kategori: "lapangan",
    tanggalFormat: "21 OKTOBER 2026",
    subTanggalFormat: "Selasa, 20 Oktober 2026",
    lokasi: "Banyumas",
    deskripsi: "Dokumentasi kegiatan Tim Hidrologi & Kualitas Air BBWS Serayu Opak.",
    gambarCover: "/images/album/lapangan/hal-1/banyumas.jpg",
    galeriGambar: ["/images/album/lapangan/hal-1/banyumas.jpg"],
  },
  {
    id: "l1_2",
    judul: "Pengambilan Sampel Kualitas Air di Waduk Sermo",
    kategori: "lapangan",
    tanggalFormat: "12 OKTOBER 2026",
    subTanggalFormat: "Senin, 12 Oktober 2026",
    lokasi: "Waduk Sermo, Kulon Progo",
    deskripsi: "Dokumentasi kegiatan Tim Hidrologi & Kualitas Air BBWS Serayu Opak.",
    gambarCover: "/images/album/lapangan/hal-1/waduk-sermo.jpg",
    galeriGambar: ["/images/album/lapangan/hal-1/waduk-sermo.jpg"],
  },
  {
    id: "l1_3",
    judul: "Pemeliharaan Pos Curah Hujan Bener & Pengambilan Sampel Kualitas Air di Sungai Bogowonto",
    kategori: "lapangan",
    tanggalFormat: "29 SEPTEMBER 2026",
    subTanggalFormat: "Selasa, 29 September 2026",
    lokasi: "Sungai Bogowonto, Bener, Purworejo",
    deskripsi: "Pada Selasa, 29 September 2026 Tim Hidrologi & Kualitas Air Balai Besar Wilayah Sungai Serayu Opak untuk menjaga keakuratan data dan kelestarian sumber daya air.",
    gambarCover: "/images/album/lapangan/hal-1/bogowonto.jpg",
    galeriGambar: ["/images/album/lapangan/hal-1/bogowonto.jpg"],
  },
  {
    id: "l1_4",
    judul: "Pemeliharaan Pos Curah Hujan Sendangtirto & Pundong, Tim Hidrologi & Kualitas Air BBWS Serayu Opak",
    kategori: "lapangan",
    tanggalFormat: "24 SEPTEMBER 2026",
    subTanggalFormat: "Kamis, 24 September 2026",
    lokasi: "Pos Curah Hujan Sendangtirto & Pundong",
    deskripsi: "Pemeriksaan fungsi komponen dan pembersihan area pos hujan otomatis.",
    gambarCover: "/images/album/lapangan/hal-1/sendangtirto-pundong.jpg",
    galeriGambar: ["/images/album/lapangan/hal-1/sendangtirto-pundong.jpg"],
  },
  {
    id: "l1_5",
    judul: "Pengambilan Sampel Kualitas Air di Tambakboyo",
    kategori: "lapangan",
    tanggalFormat: "24 SEPTEMBER 2026",
    subTanggalFormat: "Kamis, 24 September 2026",
    lokasi: "Sungai Tambakbayan, Tambakboyo",
    deskripsi: "Pengukuran parameter lapangan dan pengujian spesimen kualitas air embung.",
    gambarCover: "/images/album/lapangan/hal-1/tambakboyo.jpg",
    galeriGambar: ["/images/album/lapangan/hal-1/tambakboyo.jpg"],
  },
  {
    id: "l1_6",
    judul: "Pemeliharaan Pos Klimatologi Sermo, Tim Hidrologi & Kualitas Air BBWS Serayu Opak",
    kategori: "lapangan",
    tanggalFormat: "03 SEPTEMBER 2026",
    subTanggalFormat: "Kamis, 3 September 2026",
    lokasi: "Pos Klimatologi Sermo",
    deskripsi: "Pada 3 September 2026, Tim Hidrologi & Kualitas Air BBWS Serayu Opak melaksanakan pemeliharaan Pos Klimatologi Sermo.",
    gambarCover: "/images/album/lapangan/hal-1/klimatologi-sermo.jpg",
    galeriGambar: ["/images/album/lapangan/hal-1/klimatologi-sermo.jpg"],
  },
  {
    id: "l1_7",
    judul: "Pengukuran Topografi di Sungai Bengkok & Sungai Ngrancah",
    kategori: "lapangan",
    tanggalFormat: "03 SEPTEMBER 2026",
    subTanggalFormat: "Kamis, 03 September 2026",
    lokasi: "Sungai Bengkok & Ngrancah",
    deskripsi: "Pada Tanggal 3 September 2026, Tim Hidrologi & Kualitas Air BBWS Serayu Opak melaksanakan pengukuran topografi di Sungai Bengkok dan Sungai Ngrancah.",
    gambarCover: "/images/album/lapangan/hal-1/topografi-bengkok.png",
    galeriGambar: ["/images/album/lapangan/hal-1/topografi-bengkok.png"],
  },
  {
    id: "l1_8",
    judul: "Pengambilan Sampel Kualitas Air di Sungai Bawah Tanah Gunungkidul",
    kategori: "lapangan",
    tanggalFormat: "06 AGUSTUS 2026",
    subTanggalFormat: "Kamis, 06 Agustus 2026",
    lokasi: "Gunungkidul",
    deskripsi: "Pada Kamis, 6 Agustus 2026, Tim Hidrologi dan Kualitas Air BBWS Serayu Opak melaksanakan kegiatan sampling dan pengujian kualitas air.",
    gambarCover: "/images/album/lapangan/hal-1/bawah-tanah-gk.jpg",
    galeriGambar: ["/images/album/lapangan/hal-1/bawah-tanah-gk.jpg"],
  },
  {
    id: "l1_9",
    judul: "Pengambilan Sampel Kualitas Air di Gunungkidul",
    kategori: "lapangan",
    tanggalFormat: "04 AGUSTUS 2026",
    subTanggalFormat: "Selasa, 04 Agustus 2026",
    lokasi: "Gunungkidul",
    deskripsi: "Pada Rabu, 4 Agustus 2026, Tim Hidrologi dan Kualitas Air BBWS Serayu Opak melaksanakan pengujian dan pengambilan sampel air.",
    gambarCover: "/images/album/lapangan/hal-1/gunungkidul-4agustus.jpg",
    galeriGambar: ["/images/album/lapangan/hal-1/gunungkidul-4agustus.jpg"],
  },
];

// ================= DATA LAPANGAN HALAMAN 2 =================
const dataLapanganHal2: ItemAlbum[] = [
  {
    id: "l2_1",
    judul: "Survey Pembangunan Pos Curah Hujan Kec Dukun, Kab. Magelang",
    kategori: "lapangan",
    tanggalFormat: "27 JULI 2026",
    subTanggalFormat: "Senin, 27 Juli 2026",
    lokasi: "Kec. Dukun, Kab. Magelang, Jawa Tengah",
    deskripsi: "Pada Jumat, 24 Juli 2026, Tim Hidrologi dan Kualitas Air BBWS Serayu Opak melaksanakan peninjauan pembangunan Pos Curah Hujan baru.",
    gambarCover: "/images/album/lapangan/hal-2/dukun-magelang.jpg",
    galeriGambar: ["/images/album/lapangan/hal-2/dukun-magelang.jpg"],
  },
  {
    id: "l2_2",
    judul: "Pengambilan Sampel Kualitas Air di Kab. Sleman",
    kategori: "lapangan",
    tanggalFormat: "24 JULI 2026",
    subTanggalFormat: "Jumat, 24 Juli 2026",
    lokasi: "Kab. Sleman",
    deskripsi: "Tim Hidrologi dan Kualitas Air BBWS Serayu Opak kembali bergerak melakukan pemantauan berkala di Kab. Sleman.",
    gambarCover: "/images/album/lapangan/hal-2/sleman.jpg",
    galeriGambar: ["/images/album/lapangan/hal-2/sleman.jpg"],
  },
  {
    id: "l2_3",
    judul: "Pengambilan Sampel Kualitas Air di Rusun ASN Kementerian Pekerjaan Umum Yogyakarta",
    kategori: "lapangan",
    tanggalFormat: "16 JULI 2026",
    subTanggalFormat: "Kamis, 16 Juli 2026",
    lokasi: "Maguwoharjo, Kab. Sleman",
    deskripsi: "Tim Hidrologi dan Kualitas Air BBWS Serayu Opak kembali melakukan pengambilan sampel kualitas air di Rusun ASN KemenPU.",
    gambarCover: "/images/album/lapangan/hal-2/rusun-asn.jpg",
    galeriGambar: ["/images/album/lapangan/hal-2/rusun-asn.jpg"],
  },
  {
    id: "l2_4",
    judul: "Alat Ukur Debit Current Meter",
    kategori: "lapangan",
    tanggalFormat: "15 JULI 2026",
    subTanggalFormat: "Rabu, 15 Juli 2026",
    lokasi: "BBWS Serayu Opak",
    deskripsi: "Current meter adalah alat yang digunakan untuk mengukur kecepatan aliran air (arus) di sungai, saluran irigasi, maupun kanal.",
    gambarCover: "/images/album/lapangan/hal-2/current-meter.jpg",
    galeriGambar: ["/images/album/lapangan/hal-2/current-meter.jpg"],
  },
  {
    id: "l2_5",
    judul: "Alat Ukur Debit ADCP (Acoustic Doppler Current Profiler)",
    kategori: "lapangan",
    tanggalFormat: "15 JULI 2026",
    subTanggalFormat: "Rabu, 15 Juli 2026",
    lokasi: "BBWS Serayu Opak",
    deskripsi: "ADCP adalah alat canggih yang menggunakan gelombang suara untuk mengukur kecepatan dan arah arus air.",
    gambarCover: "/images/album/lapangan/hal-2/adcp.jpg",
    galeriGambar: ["/images/album/lapangan/hal-2/adcp.jpg"],
  },
  {
    id: "l2_6",
    judul: "Alat Ukur Kualitas Air",
    kategori: "lapangan",
    tanggalFormat: "13 JULI 2026",
    subTanggalFormat: "Senin, 13 Juli 2026",
    lokasi: "BBWS Serayu Opak",
    deskripsi: "Multiparameter Water Quality Meter: Satu alat digital genggam yang sudah dilengkapi beberapa probe sensor sekaligus.",
    gambarCover: "/images/album/lapangan/hal-2/multiparameter.jpg",
    galeriGambar: ["/images/album/lapangan/hal-2/multiparameter.jpg"],
  },
  {
    id: "l2_7",
    judul: "Pengukuran Debit Sungai Progo Kranggan, Temanggung",
    kategori: "lapangan",
    tanggalFormat: "10 JULI 2026",
    subTanggalFormat: "Jumat, 10 Juli 2026",
    lokasi: "Sungai Progo, Kranggan, Temanggung",
    deskripsi: "Melaksanakan kegiatan pengukuran debit Sungai Progo di Kranggan, Temanggung.",
    gambarCover: "/images/album/lapangan/hal-2/progo-temanggung.jpg",
    galeriGambar: ["/images/album/lapangan/hal-2/progo-temanggung.jpg"],
  },
  {
    id: "l2_8",
    judul: "Survey Penempatan Pos Curah Hujan di Kab. Magelang",
    kategori: "lapangan",
    tanggalFormat: "03 JULI 2026",
    subTanggalFormat: "Jumat, 03 Juli 2026",
    lokasi: "Embung Dukun & Embung Rockland, Kab. Magelang",
    deskripsi: "Melaksanakan survei lapangan di Embung Dukun & Embung Rockland Kab. Magelang.",
    gambarCover: "/images/album/lapangan/hal-2/penempatan-magelang.jpg",
    galeriGambar: ["/images/album/lapangan/hal-2/penempatan-magelang.jpg"],
  },
  {
    id: "l2_9",
    judul: "Pengukuran Debit Mata Air Ledok Sambi",
    kategori: "lapangan",
    tanggalFormat: "26 JUNI 2026",
    subTanggalFormat: "Jumat, 26 Juni 2026",
    lokasi: "Ledok Sambi, Pakem, Kab. Sleman",
    deskripsi: "Melaksanakan kegiatan pengukuran debit mata air di kawasan Ledok Sambi.",
    gambarCover: "/images/album/lapangan/hal-2/ledok-sambi.png",
    galeriGambar: ["/images/album/lapangan/hal-2/ledok-sambi.png"],
  },
];

// ================= DATA LAPANGAN HALAMAN 3 =================
const dataLapanganHal3: ItemAlbum[] = [
  {
    id: "l3_1",
    judul: "Survey Penempatan Pos Curah Hujan di Kab. Gunungkidul",
    kategori: "lapangan",
    tanggalFormat: "03 JUNI 2026",
    subTanggalFormat: "Rabu, 03 Juni 2026",
    lokasi: "Kabupaten Gunungkidul",
    deskripsi:
      "Melaksanakan survei lapangan di Klumpit, Sureng, dan Wuni, Kab. Gunungkidul untuk menentukan lokasi yang tepat bagi penempatan Pos Curah Hujan sebagai bagian dari upaya peningkatan kualitas data hidrologi dan meteorologi. Pemilihan lokasi dilakukan dengan mempertimbangkan kondisi lingkungan, keterwakilan wilayah, kemudahan akses, keamanan, serta kesesuaian dengan standar teknis agar data curah hujan yang diperoleh akurat dan representatif.",
    gambarCover: "/images/album/lapangan/hal-3/penempatan-gunungkidul-banner.jpg",
    galeriGambar: [
      "/images/album/lapangan/hal-3/penempatan-gunungkidul-banner.jpg",
      "/images/album/lapangan/hal-3/penempatan-gunungkidul-1.jpg",
      "/images/album/lapangan/hal-3/penempatan-gunungkidul-2.png",
    ],
  },
];

export default function AlbumKegiatanPage() {
  const [filter, setFilter] = useState<"semua" | "acara" | "lapangan">("semua");
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const [selectedItem, setSelectedItem] = useState<ItemAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Fungsi Mengambil Data Sesuai Tab Filter & Halaman
  const getActiveData = (): ItemAlbum[] => {
    if (filter === "acara") {
      return dataAcara;
    }

    const currentLapangan =
      currentPage === 1
        ? dataLapanganHal1
        : currentPage === 2
        ? dataLapanganHal2
        : dataLapanganHal3;

    if (filter === "lapangan") {
      return currentLapangan;
    }

    // Tab SEMUA (Penataan Kombinasi Acara & Lapangan)
    if (currentPage === 1) {
      return [
        dataLapanganHal1[0], // Hero Kiri
        dataLapanganHal1[1], // Card Kanan
        dataLapanganHal1[2], // 3 Grid 1
        dataLapanganHal1[3], // 3 Grid 2
        dataLapanganHal1[4], // 3 Grid 3
        dataAcara[0],        // Dokumentasi Lainnya 1 (Diseminasi Kualitas Air)
        dataAcara[1],        // Dokumentasi Lainnya 2 (Studi Diseminasi)
        dataLapanganHal1[5], // Dokumentasi Lainnya 3 (Pos Klimatologi Sermo)
        dataLapanganHal1[6], // Dokumentasi Lainnya 4 (Topografi)
      ];
    }

    return [...dataAcara.slice(2), ...currentLapangan];
  };

  const currentData = getActiveData();

  const heroItem = currentData[0] || null;
  const sideItem = currentData[1] || null;
  const threeGridItems = currentData.slice(2, 5);
  const dokumentasiLainnya = currentData.slice(5);

  const handleOpenModal = (item: ItemAlbum) => {
    setSelectedItem(item);
    setActivePhotoIndex(0);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    setActivePhotoIndex((prev) =>
      prev === 0 ? selectedItem.galeriGambar.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    setActivePhotoIndex((prev) =>
      prev === selectedItem.galeriGambar.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* HEADER SECTION */}
      <header className="relative bg-[#0F2238] px-4 py-20 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
          PORTAL SIH3
        </p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
          Album Kegiatan
        </h1>
        <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-400" />
        <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
          Dokumentasi kegiatan acara dan lapangan pengelolaan hidrologi Wilayah
          Sungai Serayu Opak.
        </p>
      </header>

      {/* FILTER & TITLE */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <span className="inline-block rounded-md bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase text-amber-700">
          📷 ALBUM
        </span>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
          Galeri kegiatan
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Klik album untuk melihat seluruh foto dokumentasi kegiatan.
        </p>

        {/* TAB FILTER */}
        <div className="mt-6 flex border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => {
              setFilter("semua");
              setCurrentPage(1);
            }}
            className={`mr-6 pb-3 ${
              filter === "semua"
                ? "border-b-2 border-sky-600 text-sky-600 font-bold"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            SEMUA
          </button>
          <button
            onClick={() => {
              setFilter("acara");
              setCurrentPage(1);
            }}
            className={`mr-6 pb-3 ${
              filter === "acara"
                ? "border-b-2 border-sky-600 text-sky-600 font-bold"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            ACARA
          </button>
          <button
            onClick={() => {
              setFilter("lapangan");
            }}
            className={`pb-3 ${
              filter === "lapangan"
                ? "border-b-2 border-sky-600 text-sky-600 font-bold"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            LAPANGAN
          </button>
        </div>

        {/* ================= GRID TAMPILAN ALBUM ================= */}
        {currentData.length > 0 ? (
          <>
            {/* HERO KIRI & SIDE KANAN */}
            {heroItem && (
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
                <div
                  className={`${
                    sideItem ? "lg:col-span-7" : "lg:col-span-12"
                  } cursor-pointer group`}
                  onClick={() => handleOpenModal(heroItem)}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-[#0B1E36]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroItem.gambarCover}
                      alt={heroItem.judul}
                      className="h-[420px] w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1E36]/90 via-[#0B1E36]/60 to-transparent p-6 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        {heroItem.kategori}
                      </span>
                      <h3 className="mt-1 text-2xl font-extrabold leading-snug">
                        {heroItem.judul}
                      </h3>
                      <p className="mt-1 text-xs text-slate-300">
                        {heroItem.tanggalFormat}
                      </p>
                    </div>
                  </div>
                </div>

                {sideItem && (
                  <div
                    className="lg:col-span-5 cursor-pointer group"
                    onClick={() => handleOpenModal(sideItem)}
                  >
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sideItem.gambarCover}
                        alt={sideItem.judul}
                        className="h-[220px] w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="p-5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                          {sideItem.kategori}
                        </span>
                        <p className="mt-0.5 text-[11px] font-medium text-slate-400 uppercase">
                          {sideItem.tanggalFormat}
                        </p>
                        <h4 className="mt-1 text-base font-bold text-slate-900 group-hover:text-sky-600 leading-snug">
                          {sideItem.judul}
                        </h4>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-3">
                          {sideItem.deskripsi}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3 KARTU SEJAJAR */}
            {threeGridItems.length > 0 && (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {threeGridItems.map((item) => (
                  <div
                    key={item.id}
                    className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 transition hover:shadow-md"
                    onClick={() => handleOpenModal(item)}
                  >
                    <div className="overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.gambarCover}
                        alt={item.judul}
                        className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                        {item.kategori}
                      </span>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        {item.tanggalFormat}
                      </p>
                      <h4 className="mt-1 text-base font-bold text-slate-900 line-clamp-3 group-hover:text-sky-600 leading-snug">
                        {item.judul}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DOKUMENTASI LAINNYA */}
            {dokumentasiLainnya.length > 0 && (
              <div className="mt-20 border-t border-slate-100 pt-16">
                <h3 className="mb-14 text-center text-3xl font-black uppercase tracking-widest text-slate-800">
                  DOKUMENTASI LAINNYA
                </h3>

                <div className="flex flex-col gap-16">
                  {dokumentasiLainnya.map((item, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col gap-8 cursor-pointer md:items-center ${
                          isEven ? "md:flex-row" : "md:flex-row-reverse"
                        }`}
                        onClick={() => handleOpenModal(item)}
                      >
                        <div className="w-full md:w-1/2">
                          <div className="overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.gambarCover}
                              alt={item.judul}
                              className="h-72 w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-1/2 md:px-6">
                          <span className="text-xs font-bold uppercase text-sky-600">
                            {item.kategori}
                          </span>
                          <span className="ml-3 text-xs text-slate-400">
                            {item.tanggalFormat}
                          </span>
                          <h4 className="mt-2 text-xl font-bold text-slate-900 hover:text-sky-600 leading-snug">
                            {item.judul}
                          </h4>
                          <p className="mt-3 text-xs leading-relaxed text-slate-600">
                            {item.deskripsi}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NAVIGASI PAGINATION */}
            <div className="mt-20 flex items-center justify-center space-x-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setCurrentPage(num);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition ${
                    currentPage === num
                      ? "bg-[#0284C7] text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => {
                  setCurrentPage((prev) => Math.min(3, prev + 1));
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                disabled={currentPage === 3}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40"
              >
                &#10095;
              </button>
            </div>
          </>
        ) : (
          <div className="my-24 text-center">
            <p className="text-sm font-semibold text-slate-400">
              Belum ada data kegiatan yang tersedia.
            </p>
          </div>
        )}
      </section>

      {/* POP-UP MODAL SLIDER FOTO */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
          >
            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.galeriGambar[activePhotoIndex]}
                alt={`${selectedItem.judul} foto ${activePhotoIndex + 1}`}
                className="max-h-[480px] w-full object-contain transition duration-300"
              />

              {selectedItem.lokasi && (
                <div className="absolute bottom-4 flex items-center space-x-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow backdrop-blur">
                  <span className="text-red-500">📍 {selectedItem.lokasi}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-amber-600">📅 {selectedItem.subTanggalFormat}</span>
                </div>
              )}

              {selectedItem.galeriGambar.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition hover:bg-sky-700"
                    title="Foto Sebelumnya"
                  >
                    &#10094;
                  </button>

                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition hover:bg-sky-700"
                    title="Foto Selanjutnya"
                  >
                    &#10095;
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-col text-center">
              <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                {selectedItem.judul}
              </h3>
              <p className="mt-1 text-xs italic text-slate-500">
                <span className="capitalize">{selectedItem.kategori}</span> &mdash;{" "}
                {selectedItem.subTanggalFormat}
              </p>
              <p className="mx-auto mt-4 max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                {selectedItem.deskripsi}
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="rounded-full bg-[#0284C7] px-8 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#0369A1]"
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