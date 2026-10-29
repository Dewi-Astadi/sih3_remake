"use client";

import { useEffect, useMemo, useState } from "react";

type Peta = {
  id: number;
  halaman: number;
  judul: string;
  kategori: string;
  tanggal: string;
  gambar: string;
  pdf: string | null;
};

const daftarPeta: Peta[] = [
  {
    "id": 86,
    "halaman": 1,
    "judul": "Peta SPI (Standardized Precipitation Index) Periode 3-Bulanan Agustus Tahun 2026",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2026-09-16",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/86/86-1-peta-spi-standardized-precipitation-index-periode-3-bulanan-agustus-tahun-2026-2026-09-16.jpeg",
    "pdf": null
  },
  {
    "id": 85,
    "halaman": 1,
    "judul": "Peta SPI (Standardized Precipitation Index) Periode 3-Bulanan Juli Tahun 2026",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2026-08-18",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/85/85-1-peta-spi-standardized-precipitation-index-periode-3-bulanan-juli-tahun-2026-2026-08-18.png",
    "pdf": null
  },
  {
    "id": 84,
    "halaman": 1,
    "judul": "Peta SPI (Standardized Precipitation Index) Periode 3-Bulanan Juni Tahun 2026",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2026-07-31",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/84/84-1-standardized-precipitation-index-periode-3-bulanan-juni-tahun-2026-2026-07-31.jpeg",
    "pdf": null
  },
  {
    "id": 78,
    "halaman": 1,
    "judul": "Peta Potensi Kekeringan Hidrologis di Pulau Jawa Bulan Juli 2026",
    "kategori": "Peta Hidrologi",
    "tanggal": "2026-07-27",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/78/78-1-peta-potensi-kekeringan-hidrologis-di-pulau-jawa-bulan-juli-2026-2026-07-27.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/78/78-pdf-peta-potensi-kekeringan-hidrologis-di-pulau-jawa-bulan-juli-2026-2026-07-27.pdf"
  },
  {
    "id": 75,
    "halaman": 1,
    "judul": "Peta Potensi Kekeringan pada Wilayah Kerja BBWS Serayu Opak",
    "kategori": "Peta Hidrologi",
    "tanggal": "2026-07-27",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/75/75-1-peta-potensi-kekeringan-pada-wilayah-kerja-bbws-serayu-opak-2026-07-27.jpeg",
    "pdf": null
  },
  {
    "id": 68,
    "halaman": 1,
    "judul": "Peta CAT Kewenangan BBWS Serayu Opak",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-13",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/68/68-1-peta-cat-kewenangan-bbws-serayu-opak-2026-04-13.jpeg",
    "pdf": null
  },
  {
    "id": 40,
    "halaman": 1,
    "judul": "Peta CAT Kabupaten Magelang dan Temanggung",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-06",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/40/40-1-peta-cat-kab.-magelang-dan-temanggung-2026-04-06",
    "pdf": null
  },
  {
    "id": 41,
    "halaman": 1,
    "judul": "Peta CAT Kroya",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-06",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/41/41-1-peta-cat-kroya-2026-04-06.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/41/41-pdf-peta-cat-kroya-2026-04-06.pdf"
  },
  {
    "id": 42,
    "halaman": 1,
    "judul": "Peta CAT Karangkobar",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-06",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/42/42-1-peta-cat-karangkobar-2026-04-06.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/42/42-pdf-peta-cat-karangkobar-2026-04-06.pdf"
  },
  {
    "id": 43,
    "halaman": 2,
    "judul": "Peta CAT Kota Yogyakarta dan Kabupaten Sleman",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-06",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/43/43-1-peta-cat-kota-yogyakarta-dan-kab.-sleman-2026-04-06",
    "pdf": null
  },
  {
    "id": 44,
    "halaman": 2,
    "judul": "Peta CAT Wonosari Kabupaten Gunungkidul",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-06",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/44/44-1-peta-cat-wonosari-kab.-gunungkidul-2026-04-06",
    "pdf": null
  },
  {
    "id": 45,
    "halaman": 2,
    "judul": "Peta CAT Wates",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-06",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/45/45-1-peta-cat-wates-2026-04-06.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/45/45-pdf-peta-cat-wates-2026-04-06.pdf"
  },
  {
    "id": 46,
    "halaman": 2,
    "judul": "Peta CAT Oyo",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-06",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/46/46-1-peta-cat-oyo-2026-04-06.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/46/46-pdf-peta-cat-oyo-2026-04-06.pdf"
  },
  {
    "id": 47,
    "halaman": 2,
    "judul": "Peta CAT Menoreh",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-06",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/47/47-1-peta-cat-menoreh-2026-04-06.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/47/47-pdf-peta-cat-menoreh-2026-04-06.pdf"
  },
  {
    "id": 48,
    "halaman": 2,
    "judul": "Peta CAT Jawa Tengah dan Daerah Istimewa Yogyakarta",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-06",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/48/48-1-peta-cat-jawa-tengah-dan-daerah-istimewa-yogyakarta-2026-04-06.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/48/48-pdf-peta-cat-jawa-tengah-dan-daerah-istimewa-yogyakarta-2026-04-06.pdf"
  },
  {
    "id": 37,
    "halaman": 2,
    "judul": "Peta CAT Purwolingga",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-02",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/37/37-1-peta-cat-purwolingga-2026-04-02.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/37/37-pdf-peta-cat-purwolingga-2026-04-02.pdf"
  },
  {
    "id": 33,
    "halaman": 2,
    "judul": "Peta CAT Kabupaten Wonosobo",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-04-01",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/33/33-1-peta-cat-kab.-wonosobo-2026-04-01",
    "pdf": null
  },
  {
    "id": 32,
    "halaman": 2,
    "judul": "Peta CAT Kabupaten Kebumen dan Kabupaten Purworejo",
    "kategori": "Peta Cekungan Air Tanah",
    "tanggal": "2026-03-31",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/32/32-1-peta-cat-kab.-kebumen-dan-kab.-purworejo-2026-03-31",
    "pdf": null
  },
  {
    "id": 50,
    "halaman": 3,
    "judul": "Peta Analisa Curah Hujan Dasarian III Maret 2026 Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2026-04-07",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/50/50-1-peta-analisa-curah-hujan-dasarian-iii-maret-2026-jawa-tengah-2026-04-07.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/50/50-pdf-peta-analisa-curah-hujan-dasarian-iii-maret-2026-jawa-tengah-2026-04-07.pdf"
  },
  {
    "id": 17,
    "halaman": 3,
    "judul": "Peta Prediksi Curah Hujan Bulan Oktober Tahun 2025 Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/17/17-1-peta-prediksi-curah-hujan-bulan-oktober-tahun-2025-jawa-tengah-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 20,
    "halaman": 3,
    "judul": "Peta Prediksi Sifat Hujan Bulan Oktober Tahun 2025 Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/20/20-1-peta-prediksi-sifat-hujan-bulan-oktober-tahun-2025-jawa-tengah-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 23,
    "halaman": 3,
    "judul": "Peta Prediksi Curah Hujan Bulan Oktober Tahun 2025 Daerah Istimewa Yogyakarta",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/23/23-1-peta-prediksi-curah-hujan-bulan-oktober-tahun-2025-daerah-istimewa-yogyakarta-2025-08-25.png",
    "pdf": null
  },
  {
    "id": 26,
    "halaman": 3,
    "judul": "Peta Prediksi Sifat Hujan Bulan Oktober Tahun 2025 Daerah Istimewa Yogyakarta",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/26/26-1-peta-prediksi-sifat-hujan-bulan-oktober-tahun-2025-daerah-istimewa-yogyakarta-2025-08-25.png",
    "pdf": null
  },
  {
    "id": 31,
    "halaman": 3,
    "judul": "Peta Waktu Perjalanan Banjir DAS Bogowonto",
    "kategori": "Peta Hidrologi",
    "tanggal": "2025-09-11",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/31/31-1-peta-waktu-perjalanan-banjir-das-bogowonto-2025-09-11.jpeg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/31/31-pdf-peta-waktu-perjalanan-banjir-das-bogowonto-2025-09-11.pdf"
  },
  {
    "id": 16,
    "halaman": 3,
    "judul": "Peta Prediksi Curah Hujan Bulan September Tahun 2025 Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/16/16-1-peta-prediksi-curah-hujan-bulan-september-tahun-2025-jawa-tengah-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 22,
    "halaman": 3,
    "judul": "Peta Prediksi Curah Hujan Bulan September Tahun 2025 Daerah Istimewa Yogyakarta",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/22/22-1-peta-prediksi-curah-hujan-bulan-september-tahun-2025-daerah-istimewa-yogyakarta-2025-08-25.png",
    "pdf": null
  },
  {
    "id": 19,
    "halaman": 4,
    "judul": "Peta Prediksi Sifat Hujan Bulan September Tahun 2025 Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/19/19-1-peta-prediksi-sifat-hujan-bulan-september-tahun-2025-jawa-tengah-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 25,
    "halaman": 4,
    "judul": "Peta Prediksi Sifat Hujan Bulan September Tahun 2025 Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/25/25-1-peta-prediksi-sifat-hujan-bulan-september-tahun-2025-jawa-tengah-2025-08-25.png",
    "pdf": null
  },
  {
    "id": 27,
    "halaman": 4,
    "judul": "Peta Waktu Perjalanan Banjir DAS Progo",
    "kategori": "Peta Hidrologi",
    "tanggal": "2025-08-28",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/27/27-1-peta-waktu-perjalanan-banjir-das-progo-2025-08-28.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/27/27-pdf-peta-waktu-perjalanan-banjir-das-progo-2025-08-28.pdf"
  },
  {
    "id": 29,
    "halaman": 4,
    "judul": "Peta Waktu Perjalanan Banjir DAS Serayu",
    "kategori": "Peta Hidrologi",
    "tanggal": "2025-08-28",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/29/29-1-peta-waktu-perjalanan-banjir-das-serayu-2025-08-28.jpg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/29/29-pdf-peta-waktu-perjalanan-banjir-das-serayu-2025-08-28.pdf"
  },
  {
    "id": 10,
    "halaman": 4,
    "judul": "Peta Lokasi Kejadian Banjir pada Musim Hujan Tahun 2024 2025 di WS Provinsi Jawa Tengah",
    "kategori": "Peta Hidrologi",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/10/10-1-peta-lokasi-kejadian-banjir-pada-musim-hujan-tahun-2024-2025-di-ws-provinsi-jawa-tengah-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 11,
    "halaman": 4,
    "judul": "Peta Analisa Curah Hujan Dasarian II Agustus 2025 Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/11/11-1-peta-analisa-curah-hujan-dasarian-ii-agustus-2025-jawa-tengah-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 13,
    "halaman": 4,
    "judul": "Peta Prediksi Probabilistik Curah Hujan Dasarian Ke 3 Agustus 2025",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/13/13-1-peta-prediksi-probabilistik-curah-hujan-dasarian-ke-3-agustus-2025-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 14,
    "halaman": 5,
    "judul": "Peta Prediksi Deterministik Curah Hujan Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/14/14-1-peta-prediksi-deterministik-curah-hujan-jawa-tengah-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 15,
    "halaman": 5,
    "judul": "Peta Prediksi Curah Hujan Bulan Agustus Tahun 2025",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/15/15-1-peta-prediksi-curah-hujan-bulan-agustus-tahun-2025-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 4,
    "halaman": 5,
    "judul": "Peta Pos Hidrologi 2025",
    "kategori": "Peta Hidrologi",
    "tanggal": "2025-08-22",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/4/4-1-peta-pos-hidrologi-2025-2025-08-22.jpeg",
    "pdf": null
  },
  {
    "id": 8,
    "halaman": 5,
    "judul": "Peta Titik Genangan Banjir Provinsi Jawa Tengah Musim Hujan 2024 2025",
    "kategori": "Peta Hidrologi",
    "tanggal": "2025-08-22",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/8/8-1-peta-titik-genangan-banjir-provinsi-jawa-tengah-musim-hujan-2024-2025-2025-08-22.jpeg",
    "pdf": "https://sih3.bbwsserayuopak.id/file/gpeta/8/8-pdf-peta-titik-genangan-banjir-provinsi-jawa-tengah-musim-hujan-2024-2025-2025-08-22.pdf"
  },
  {
    "id": 21,
    "halaman": 5,
    "judul": "Peta Prediksi Curah Hujan Bulan Agustus Tahun 2025 Daerah Istimewa Yogyakarta",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/21/21-1-peta-prediksi-curah-hujan-bulan-agustus-tahun-2025-daerah-istimewa-yogyakarta-2025-08-25.png",
    "pdf": null
  },
  {
    "id": 18,
    "halaman": 5,
    "judul": "Peta Prediksi Sifat Hujan Bulan Agustus Tahun 2025 Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/18/18-1-peta-prediksi-sifat-hujan-bulan-agustus-tahun-2025-jawa-tengah-2025-08-25.jpg",
    "pdf": null
  },
  {
    "id": 24,
    "halaman": 5,
    "judul": "Peta Prediksi Sifat Hujan Bulan Agustus Tahun 2025 Jawa Tengah",
    "kategori": "Peta Analisa Curah Hujan",
    "tanggal": "2025-08-25",
    "gambar": "https://sih3.bbwsserayuopak.id/file/gpeta/24/24-1-peta-prediksi-sifat-hujan-bulan-agustus-tahun-2025-jawa-tengah-2025-08-25.png",
    "pdf": null
  }
];
const kategoriPeta = ["Semua", "Peta Cekungan Air Tanah", "Peta Analisa Curah Hujan", "Peta Hidrologi"];
const PER_HALAMAN = 9;

function formatTanggal(value: string) {
  if (!value) return "Tanggal tidak tersedia";
  const tanggal = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(tanggal);
}

export default function GaleriPetaPage() {
  const [kategori, setKategori] = useState("Semua");
  const [halaman, setHalaman] = useState(1);
  const [terpilih, setTerpilih] = useState<Peta | null>(null);

  const tersaring = useMemo(() => daftarPeta.filter((peta) => kategori === "Semua" || peta.kategori === kategori), [kategori]);
  const totalHalaman = Math.max(1, Math.ceil(tersaring.length / PER_HALAMAN));
  const tampil = tersaring.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  useEffect(() => {
    if (!terpilih) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTerpilih(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [terpilih]);

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      
      <header
        className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-cover bg-center px-4 py-16 text-center text-white sm:min-h-[350px]"
        style={{
          backgroundImage:
            
"linear-gradient(rgba(8, 22, 40, 0.68), rgba(8, 22, 40, 0.68)), url('/images/hero-bendungan.jpg')",

        }}
      >
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            PORTAL SIH3
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Galeri Peta
          </h1>

          <div className="mx-auto mt-5 h-1 w-10 bg-yellow-400" />

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            Peta hidrologi, analisa curah hujan, dan cekungan air tanah
            Wilayah Sungai Serayu Opak.
          </p>
        </div>
      </header>


      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-700">Galeri Peta</p>
        <h2 className="text-2xl font-bold text-slate-900">Koleksi peta</h2>
        <p className="mt-2 text-sm text-slate-600">Klik peta untuk melihat ukuran penuh dan membuka file aslinya.</p>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-5">
          {kategoriPeta.map((nama) => (
            <button key={nama} type="button" onClick={() => { setKategori(nama); setHalaman(1); }}
              aria-pressed={kategori === nama}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition ${kategori === nama ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}>
              {nama}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm text-slate-500">Menampilkan {tampil.length} dari {tersaring.length} peta</p>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tampil.map((peta) => (
            <article key={peta.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <button type="button" onClick={() => setTerpilih(peta)} className="block w-full bg-slate-100 p-3" aria-label={`Lihat ${peta.judul}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={peta.gambar} alt={peta.judul} loading="lazy" className="aspect-[4/3] w-full object-contain" />
              </button>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{peta.kategori}</p>
                <h3 className="mt-2 line-clamp-3 min-h-[3.75rem] text-base font-semibold leading-snug text-slate-900">{peta.judul}</h3>
                <p className="mt-3 text-xs text-slate-500">{formatTanggal(peta.tanggal)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setTerpilih(peta)} className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800">Lihat peta</button>
                  {peta.pdf && <a href={peta.pdf} target="_blank" rel="noopener noreferrer" className="rounded-md border border-blue-700 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">Unduh PDF</a>}
                </div>
              </div>
            </article>
          ))}
        </div>

        {totalHalaman > 1 && (
          <nav aria-label="Halaman galeri peta" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button type="button" disabled={halaman === 1} onClick={() => setHalaman((h) => Math.max(1, h - 1))} className="rounded-md border bg-white px-4 py-2 text-sm disabled:opacity-40">Sebelumnya</button>
            {Array.from({ length: totalHalaman }, (_, index) => index + 1).map((nomor) => (
              <button key={nomor} type="button" aria-current={halaman === nomor ? "page" : undefined} onClick={() => setHalaman(nomor)} className={`rounded-md border px-4 py-2 text-sm ${halaman === nomor ? "border-blue-700 bg-blue-700 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}>{nomor}</button>
            ))}
            <button type="button" disabled={halaman === totalHalaman} onClick={() => setHalaman((h) => Math.min(totalHalaman, h + 1))} className="rounded-md border bg-white px-4 py-2 text-sm disabled:opacity-40">Berikutnya</button>
          </nav>
        )}
      </section>

      {terpilih && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setTerpilih(null)}>
          <div role="dialog" aria-modal="true" aria-label={terpilih.judul} className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b p-4">
              <h2 className="text-base font-semibold text-slate-900">{terpilih.judul}</h2>
              <button type="button" aria-label="Tutup preview" onClick={() => setTerpilih(null)} className="rounded px-2 text-xl text-slate-600 hover:bg-slate-100">×</button>
            </div>
            <div className="overflow-y-auto p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={terpilih.gambar} alt={terpilih.judul} className="mx-auto max-h-[65vh] max-w-full object-contain" />
              <p className="mt-4 text-sm text-slate-500">{formatTanggal(terpilih.tanggal)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={terpilih.gambar} target="_blank" rel="noopener noreferrer" className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">Buka / Simpan Gambar</a>
                {terpilih.pdf && <a href={terpilih.pdf} target="_blank" rel="noopener noreferrer" className="rounded-md border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700">Unduh PDF</a>}
                <button type="button" onClick={() => setTerpilih(null)} className="rounded-md border px-4 py-2 text-sm text-slate-700">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
