"use client";

import Link from "next/link";

type BuletinCard = {
  id: string;
  category: string;
  categorySlug: string;
  title: string;
  date: string;
  badgeColor: string;
  cardBg: string;
  accentColor: string;
  image: string;
};

const buletinData: BuletinCard[] = [
  {
    id: "1",
    category: "HIDROLOGI",
    categorySlug: "hidrologi",
    title: "Rekapitulasi Ketersediaan Air Setengah Bulan 16-30 September 2026",
    date: "Senin, 05 Oktober 2026",
    badgeColor: "bg-[#0284C7] text-white",
    cardBg: "bg-sky-50/60 border-sky-100",
    accentColor: "text-[#0284C7]",
    image: "/images/buletin/hidrologi/hidrologi-16-30-sept.jpg",
  },
  {
    id: "2",
    category: "HIDROMETEOROLOGI",
    categorySlug: "hidrometeorologi",
    title: "Curah Hujan Dasarian 11 – 20 Oktober 2026",
    date: "Rabu, 21 Oktober 2026",
    badgeColor: "bg-purple-700 text-white",
    cardBg: "bg-purple-50/60 border-purple-100",
    accentColor: "text-purple-700",
    image: "/images/buletin/hidrometeorologi/hal-1/dasarian-11-20-okt.jpg",
  },
  {
    id: "3",
    category: "HIDROGEOLOGI",
    categorySlug: "hidrogeologi",
    title: "Belum ada edisi",
    date: "-",
    badgeColor: "bg-emerald-600 text-white",
    cardBg: "bg-emerald-50/60 border-emerald-100",
    accentColor: "text-emerald-600",
    image: "",
  },
  {
    id: "4",
    category: "KEJADIAN LAINNYA",
    categorySlug: "kejadian",
    title: "Buletin Kekeringan Dasarian II September",
    date: "Rabu, 23 September 2026",
    badgeColor: "bg-amber-600 text-white",
    cardBg: "bg-amber-50/60 border-amber-100",
    accentColor: "text-amber-600",
    image: "/images/buletin/kejadian/kejadian.jpg",
  },
  {
    id: "5",
    category: "EL NINO",
    categorySlug: "elnino",
    title: "LAPORAN SATGAS ANTISIPASI DAN PENANGANAN EL NINO",
    date: "Selasa, 20 Oktober 2026",
    badgeColor: "bg-orange-600 text-white",
    cardBg: "bg-orange-50/60 border-orange-100",
    accentColor: "text-orange-600",
    image: "/images/buletin/elnino/EL NINO.png",
  },
];

export default function BuletinMainPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <header className="relative bg-[#0F2238] px-4 py-16 text-center text-white sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">PORTAL SIH3</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Buletin SIH3</h1>
        <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-400" />
        <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
          Publikasi berkala mengenai analisis hidrologi, hidrometeorologi, hidrogeologi, serta peristiwa penting lainnya di Wilayah Sungai Serayu Opak.
        </p>
      </header>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-200">
            📰 BULETIN
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Edisi terbaru</h2>
        <p className="mt-1 text-xs text-slate-500">Edisi terbaru dari setiap kategori buletin. Klik kartu untuk melihat seluruh edisi.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {buletinData.map((item) => (
            <Link
              key={item.id}
              href={`/galeri/buletin/${item.categorySlug}`}
              className={`group flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md ${item.cardBg}`}
            >
              <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl bg-white/80 p-2 shadow-inner">
                {item.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full rounded object-contain transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-emerald-600">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="mt-2 text-xs font-semibold">Belum ada gambar</span>
                  </div>
                )}

                {item.image && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-xs">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    Perbesar
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.badgeColor.split(" ")[0]}`}></span>
                    <span className={`text-[10px] font-bold tracking-wider ${item.accentColor}`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">{item.date}</p>
                  <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-slate-800 group-hover:text-blue-600">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/50">
                  <span className={`text-xs font-bold ${item.accentColor} group-hover:underline`}>
                    Lihat semua edisi &gt;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}