
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import type { Pos, Pengukuran, PosTimeseriesResponse } from "@/lib/types";

type PosData = {
  pos: Pos;
  pengukuran: Pengukuran[];
};

export default function AnalisisDataPage() {
  const [daftarPos, setDaftarPos] = useState<Pos[]>([]);
  const [posTerpilih, setPosTerpilih] = useState<string[]>([]);
  const [dataPerPos, setDataPerPos] = useState<PosData[]>([]);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function muatDaftarPos() {
      try {
        const response = await apiClient.get("/pos", {
          params: { per_page: 100 },
          timeout: 20000,
        });

        if (!response.data?.success || !Array.isArray(response.data.data)) {
          throw new Error("Format respons daftar pos tidak sesuai.");
        }

        setDaftarPos(response.data.data);

        if (response.data.data.length === 0) {
  setError(
    "Belum ada data pos pengamatan yang tersedia. Data akan ditampilkan setelah ditambahkan oleh pengelola SIH3."
  );
} else {
  setError("");
}
      } catch {
        setError(
          "Daftar pos gagal dimuat dari API. Periksa koneksi backend SIH3."
        );
      }
    }

    void muatDaftarPos();
  }, []);

  function pilihPos(id: string) {
    setPosTerpilih((sebelumnya) => {
      if (sebelumnya.includes(id)) {
        return sebelumnya.filter((item) => item !== id);
      }

      if (sebelumnya.length >= 4) {
        setError("Pilih maksimal 4 pos untuk dibandingkan.");
        return sebelumnya;
      }

      setError("");
      return [...sebelumnya, id];
    });
  }

  async function muatDataPerbandingan() {
    if (posTerpilih.length < 2) {
      setError("Pilih minimal 2 pos untuk dibandingkan.");
      return;
    }

    if (!tanggalMulai || !tanggalSelesai || tanggalMulai > tanggalSelesai) {
      setError("Pilih rentang tanggal yang valid.");
      return;
    }

    setMemuat(true);
    setError("");
    setDataPerPos([]);

    try {
      const hasil = await Promise.all(
        posTerpilih.map(async (id) => {
          const response = await apiClient.get<PosTimeseriesResponse>(
            `/pos/${id}/timeseries`,
            {
              params: {
                start_date: tanggalMulai,
                end_date: tanggalSelesai,
              },
            }
          );

          if (!response.data?.success || !Array.isArray(response.data.data)) {
            throw new Error(`Respons data pos ${id} tidak valid.`);
          }

          const pos = daftarPos.find((item) => item.id === Number(id));

          if (!pos) {
            throw new Error(`Informasi pos ${id} tidak ditemukan.`);
          }

          return {
            pos,
            pengukuran: response.data.data,
          };
        })
      );

      setDataPerPos(hasil);
    } catch {
      setError(
        "Data gagal dimuat dari API. Tidak ada data pengganti atau data mock yang ditampilkan."
      );
    } finally {
      setMemuat(false);
    }
  }

  const statistik = dataPerPos.map(({ pos, pengukuran }) => {
    const nilaiValid = pengukuran
      .map((item) => item.nilai)
      .filter((nilai): nilai is number =>
        typeof nilai === "number" && Number.isFinite(nilai)
      );

    return {
      pos,
      pengukuran,
      jumlah: nilaiValid.length,
      minimum: nilaiValid.length ? Math.min(...nilaiValid) : null,
      maksimum: nilaiValid.length ? Math.max(...nilaiValid) : null,
      rataRata: nilaiValid.length
        ? nilaiValid.reduce((total, nilai) => total + nilai, 0) /
          nilaiValid.length
        : null,
    };
  });

  function eksporCSV() {
    const baris = [
      ["Nama Pos", "Waktu Pengukuran", "Nilai", "Satuan"],
      ...dataPerPos.flatMap(({ pos, pengukuran }) =>
        pengukuran.map((item) => [
          pos.nama,
          item.recorded_at,
          item.nilai === null ? "" : String(item.nilai),
          item.satuan,
        ])
      ),
    ];

    const isi = baris
      .map((barisData) =>
        barisData
          .map((nilai) => `"${String(nilai).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", isi], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const tautan = document.createElement("a");

    tautan.href = url;
    tautan.download = "perbandingan-data-sih3.csv";
    tautan.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-medium text-blue-700">
            SISTEM INFORMASI SIH3
          </p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            Analisis &amp; Perbandingan Data
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Bandingkan hasil pengukuran dari beberapa pos dalam periode yang
            sama.
          </p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Filter Data</h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">
                Pilih pos (2–4 pos)
              </p>
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {daftarPos.map((pos) => (
                  <label
                    key={pos.id}
                    className="flex cursor-pointer items-start gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={posTerpilih.includes(String(pos.id))}
                      onChange={() => pilihPos(String(pos.id))}
                      className="mt-1"
                    />
                    <span>
                      {pos.nama}
                      <span className="block text-xs text-slate-500">
                        {pos.kode_pos} · {pos.jenis}
                      </span>
                    </span>
                  </label>
                ))}

                {daftarPos.length === 0 && !error && (
                  <p className="text-sm text-slate-500">
                    Memuat daftar pos...
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tanggal mulai
                </label>
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(event) => setTanggalMulai(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tanggal selesai
                </label>
                <input
                  type="date"
                  value={tanggalSelesai}
                  onChange={(event) => setTanggalSelesai(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <button
                type="button"
                onClick={muatDataPerbandingan}
                disabled={memuat}
                className="w-full rounded-lg bg-blue-700 px-4 py-3 font-medium text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {memuat ? "Memuat Data..." : "Bandingkan Data"}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
        </section>

        {dataPerPos.length > 0 && (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Statistik Pengukuran</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statistik.map((item) => (
                  <article
                    key={item.pos.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <h3 className="font-semibold">{item.pos.nama}</h3>
                    <p className="mt-3 text-sm text-slate-600">
                      Minimum: {item.minimum ?? "—"}
                    </p>
                    <p className="text-sm text-slate-600">
                      Maksimum: {item.maksimum ?? "—"}
                    </p>
                    <p className="text-sm text-slate-600">
                      Rata-rata:{" "}
                      {item.rataRata === null
                        ? "—"
                        : item.rataRata.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600">
                      Data valid: {item.jumlah}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Tabel Perbandingan</h2>
                <button
                  type="button"
                  onClick={eksporCSV}
                  className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                >
                  Ekspor CSV
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3">Pos</th>
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Nilai</th>
                      <th className="p-3">Satuan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPerPos.flatMap(({ pos, pengukuran }) =>
                      pengukuran.map((item) => (
                        <tr
                          key={`${pos.id}-${item.id}`}
                          className="border-b border-slate-100"
                        >
                          <td className="p-3">{pos.nama}</td>
                          <td className="p-3">
                            {new Date(item.recorded_at).toLocaleString(
                              "id-ID"
                            )}
                          </td>
                          <td className="p-3">{item.nilai ?? "—"}</td>
                          <td className="p-3">{item.satuan}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
