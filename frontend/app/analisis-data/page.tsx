"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { apiClient } from "@/lib/api";
import type { Pos, Pengukuran, PosTimeseriesResponse } from "@/lib/types";

type PosData = {
  pos: Pos;
  pengukuran: Pengukuran[];
};

export default function AnalisisDataPage() {
  const [daftarPos, setDaftarPos] = useState<Pos[]>([]);
  const [jenisPosDipilih, setJenisPosDipilih] = useState<string>("");
  const [posTerpilih, setPosTerpilih] = useState<string[]>([]);
  const [dataPerPos, setDataPerPos] = useState<PosData[]>([]);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState("");
  const [halamanTabel, setHalamanTabel] = useState(1);
  const jumlahPerHalaman = 10;

const semuaBarisTabel = dataPerPos.flatMap(({ pos, pengukuran }) =>
  pengukuran.map((item) => ({ pos, item }))
);

const totalHalaman = Math.max(
  1,
  Math.ceil(semuaBarisTabel.length / jumlahPerHalaman)
);

const barisHalamanIni = semuaBarisTabel.slice(
  (halamanTabel - 1) * jumlahPerHalaman,
  halamanTabel * jumlahPerHalaman
);

  const daftarPosTersaring = jenisPosDipilih
  ? daftarPos.filter((pos) => pos.jenis === jenisPosDipilih)
  : daftarPos;

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
    if (posTerpilih.length < 2 || posTerpilih.length > 4) {
  setError("Pilih 2 sampai 4 pos untuk dibandingkan.");
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

  const daftarSatuan = [
  ...new Set(
    dataPerPos.flatMap(({ pengukuran }) =>
      pengukuran
        .filter(
          (item) =>
            typeof item.nilai === "number" &&
            Number.isFinite(item.nilai)
        )
        .map((item) => item.satuan?.trim())
        .filter((satuan): satuan is string => Boolean(satuan))
    )
  ),
];

const satuanBerbeda = daftarSatuan.length > 1;

// Grafik memakai dua sumbu Y hanya jika tepat ada dua satuan berbeda.
// Jika satuan lebih dari dua, grafik tetap memakai satu sumbu dan peringatan.
const bisaDuaSumbu = daftarSatuan.length === 2;

// Satuan tiap pos, diambil dari data pengukuran valid pertama milik pos tersebut.
const satuanPerPos: Record<string, string> = {};
dataPerPos.forEach(({ pos, pengukuran }) => {
  const dataBersatuan = pengukuran.find(
    (item) =>
      typeof item.nilai === "number" &&
      Number.isFinite(item.nilai) &&
      Boolean(item.satuan?.trim())
  );

  satuanPerPos[String(pos.id)] = dataBersatuan?.satuan?.trim() ?? "";
});

// Satuan pertama ada di sumbu kiri, satuan kedua ada di sumbu kanan.
function sumbuUntukPos(posId: number) {
  if (bisaDuaSumbu && satuanPerPos[String(posId)] === daftarSatuan[1]) {
    return "kanan";
  }

  return "kiri";
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
const dataGrafik = Object.values(
  dataPerPos.reduce<
    Record<string, Record<string, string | number | null>>
  >((hasil, { pos, pengukuran }) => {
    pengukuran.forEach((item) => {
      const waktu = item.recorded_at;
      const nilai = Number(item.nilai);

      if (!waktu || item.nilai == null || !Number.isFinite(nilai)) {
        return;
      }

      if (!hasil[waktu]) {
        hasil[waktu] = { waktu };
      }

      hasil[waktu][String(pos.id)] = nilai;
    });

    return hasil;
  }, {})
).sort(
  (a, b) =>
    new Date(String(a.waktu)).getTime() -
    new Date(String(b.waktu)).getTime()
);

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
              <div className="mb-4">
  <label
    htmlFor="jenis-pos"
    className="mb-2 block text-sm font-medium"
  >
    Jenis Pos
  </label>

  <select
    id="jenis-pos"
    value={jenisPosDipilih}
    onChange={(event) => {
      setJenisPosDipilih(event.target.value);
      setPosTerpilih([]);
      setDataPerPos([]);
      setError("");
    }}
    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
  >
    <option value="">Semua jenis pos</option>
    {[...new Set(daftarPos.map((pos) => pos.jenis).filter(Boolean))]
      .sort()
      .map((jenis) => (
        <option key={jenis} value={jenis}>
          {jenis}
        </option>
      ))}
  </select>
</div>
              <p className="mb-2 text-sm font-medium">
                Pilih pos (2–4 pos)
              </p>
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {daftarPosTersaring.map((pos) => (
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
                        Belum ada pos pengamatan yang tersedia.
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
  <h2 className="mb-4 text-lg font-semibold">
    Grafik Perbandingan Pengukuran
  </h2>

  {satuanBerbeda && (
    <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
      {bisaDuaSumbu
        ? `Perhatian: Data memiliki dua satuan pengukuran berbeda. Sumbu kiri menunjukkan satuan ${daftarSatuan[0]} dan sumbu kanan menunjukkan satuan ${daftarSatuan[1]}, sehingga skala kedua garis tidak dapat dibandingkan langsung.`
        : `Perhatian: Data memiliki satuan pengukuran berbeda (${daftarSatuan.join(", ")}). Grafik memakai satu sumbu, sehingga perbandingan langsung antarpos perlu ditafsirkan dengan hati-hati.`}
    </p>
  )}

  {dataGrafik.length > 0 ? (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataGrafik}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="waktu"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("id-ID")
            }
          />
          <YAxis
            yAxisId="kiri"
            orientation="left"
            width={70}
            label={
              bisaDuaSumbu
                ? {
                    value: daftarSatuan[0],
                    angle: -90,
                    position: "insideLeft",
                  }
                : undefined
            }
          />
          {bisaDuaSumbu && (
            <YAxis
              yAxisId="kanan"
              orientation="right"
              width={70}
              label={{
                value: daftarSatuan[1],
                angle: 90,
                position: "insideRight",
              }}
            />
          )}
          <Tooltip />
          <Legend />

          {dataPerPos.map(({ pos }, index) => (
            <Line
              key={pos.id}
              yAxisId={sumbuUntukPos(pos.id)}
              type="monotone"
              dataKey={String(pos.id)}
              name={
                bisaDuaSumbu && satuanPerPos[String(pos.id)]
                  ? `${pos.nama} (${satuanPerPos[String(pos.id)]})`
                  : pos.nama
              }
              stroke={
                ["#2563eb", "#dc2626", "#16a34a", "#9333ea"][
                  index % 4
                ]
              }
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <p className="text-sm text-slate-500">
      Belum ada data pengukuran untuk ditampilkan dalam grafik.
    </p>
  )}
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
                    {barisHalamanIni.map(({ pos, item }) => (
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
                        <td className="p-3">{item.nilai ?? "-"}</td>
                        <td className="p-3">{item.satuan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                  Menampilkan {barisHalamanIni.length} dari {semuaBarisTabel.length} data
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHalamanTabel((prev) => Math.max(1, prev - 1))}
                    disabled={halamanTabel === 1}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>

                  <span className="text-sm text-slate-600">
                    Halaman {halamanTabel} dari {totalHalaman}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setHalamanTabel((prev) => Math.min(totalHalaman, prev + 1))
                    }
                    disabled={halamanTabel >= totalHalaman}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
