
"use client";

import { useMemo, useState } from "react";
import data from "./data.json";

type Dokumen = {
  nomor: string;
  judul: string;
  url: string;
  pencarian: string;
};

const kategori = [
  {
    id: "1",
    nama: "Peraturan Perundang-undangan",
  },
  {
    id: "2",
    nama: "Peraturan Kebijakan & Produk Hukum Khusus",
  },
  {
    id: "3",
    nama: "Dokumen Non-Peraturan Perundang-undangan",
  },
  {
    id: "4",
    nama: "Publikasi Edukasi & Informasi Hukum Publik",
  },
];

export default function GaleriDokumenPage() {
  const [pencarian, setPencarian] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [preview, setPreview] = useState<Dokumen | null>(null);

  const dokumen = data.dokumen as Dokumen[];

  const hasil = useMemo(() => {
    const keyword = pencarian.toLowerCase().trim();

    return dokumen.filter((item) => {
      const nomorKategori = item.nomor.split(".")[0];

      const sesuaiKategori =
        kategoriAktif === "Semua" ||
        nomorKategori === kategoriAktif;

      const sesuaiPencarian =
        !keyword ||
        item.judul.toLowerCase().includes(keyword) ||
        item.nomor.toLowerCase().includes(keyword) ||
        item.pencarian.toLowerCase().includes(keyword);

      return sesuaiKategori && sesuaiPencarian;
    });
  }, [dokumen, pencarian, kategoriAktif]);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <section className="bg-gradient-to-r from-sky-800 to-cyan-700 px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm text-cyan-100">
            Beranda / Galeri / Dokumen
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            Galeri Dokumen
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-cyan-50 md:text-base">
            Kumpulan dokumen dan publikasi resmi
            BBWS Serayu Opak yang dapat dilihat
            maupun diunduh.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-10">
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="search"
              value={pencarian}
              onChange={(event) =>
                setPencarian(event.target.value)
              }
              placeholder="Cari judul dokumen..."
              className="w-full flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-sky-600"
            />

            <select
              value={kategoriAktif}
              onChange={(event) =>
                setKategoriAktif(event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-sky-600"
            >
              <option value="Semua">Semua Kategori</option>
              {kategori.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Menampilkan {hasil.length} dari {dokumen.length} dokumen
          </p>
        </div>

        {hasil.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-500">
            Tidak ada dokumen yang sesuai dengan pencarian.
          </div>
        ) : (
          <div className="space-y-8">
            {kategori.map((kelompok) => {
              const items = hasil.filter(
                (item) =>
                  item.nomor.split(".")[0] === kelompok.id
              );

              if (items.length === 0) return null;

              return (
                <section
                  key={kelompok.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-200 bg-sky-50 px-6 py-5">
                    <h2 className="text-lg font-semibold text-sky-900">
                      {kelompok.id}. {kelompok.nama}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {items.length} dokumen
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <div
                        key={`${item.nomor}-${item.url}`}
                        className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-bold text-red-600">
                            PDF
                          </div>

                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-sky-700">
                              {item.nomor}
                            </span>
                            <h3 className="mt-1 text-sm font-medium leading-6 text-slate-800 md:text-base">
                              {item.judul}
                            </h3>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2 pl-16 md:pl-0">
                          <button
                            type="button"
                            onClick={() => setPreview(item)}
                            className="rounded-lg border border-sky-600 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-50"
                          >
                            Lihat
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
                          >
                            Unduh PDF
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau ${preview.judul}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white">
            <div className="flex items-center justify-between gap-4 border-b p-4">
              <h2 className="line-clamp-2 text-sm font-semibold text-slate-800">
                {preview.judul}
              </h2>

              <button
                type="button"
                onClick={() => setPreview(null)}
                className="shrink-0 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>

            <iframe
              title={preview.judul}
              src={preview.url}
              className="min-h-0 w-full flex-1"
            />

            <div className="border-t p-3 text-right">
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-sky-700 px-4 py-2 text-sm text-white"
              >
                Buka PDF di Tab Baru
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
