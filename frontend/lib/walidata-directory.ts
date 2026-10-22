/**
 * Walidata directory (S7), transcribed from Appendix A of the PRD, which in
 * turn comes from the original site's menu. Cells the original leaves empty are
 * `null` and render as an em dash without a link.
 *
 * TODO(owner): logo files for public/walidata/ are not in the repository, so
 * no logos are rendered yet.
 */

export interface WalidataEntry {
  instansi: string;
  website: string | null;
  permintaanData: string | null;
  kontakWa: string | null;
}

export const WALIDATA_DIRECTORY: WalidataEntry[] = [
  {
    instansi: "BBWS Serayu Opak",
    website: "https://sda.pu.go.id/balai/bbwsserayuopak/",
    permintaanData:
      "https://sda.pu.go.id/balai/bbwsserayuopak/kalatirta-so/portal/layanan",
    kontakWa: "https://wa.me/6281225901430",
  },
  {
    instansi: "Dinas PUP ESDM DIY",
    website: "https://dpupesdm.jogjaprov.go.id",
    permintaanData: "https://dpupesdm.jogjaprov.go.id/kontak-kami/",
    kontakWa: "https://wa.me/6285200330000",
  },
  {
    instansi: "Dinas Pusdataru Jawa Tengah",
    website: "https://pusdataru.jatengprov.go.id",
    permintaanData:
      "https://pusdataru.jatengprov.go.id/ppid/Formulir-Permohonan-Informasi-Publik.html",
    kontakWa: "https://wa.me/6281390075705",
  },
  {
    instansi: "Dinas ESDM Jawa Tengah",
    website: "https://esdm.jatengprov.go.id",
    permintaanData: "https://esdm.jatengprov.go.id/formulir/permohonan",
    kontakWa: "https://wa.me/628112681126",
  },
  {
    instansi: "DLHK DIY",
    website: "https://dlhk.jogjaprov.go.id",
    permintaanData: "https://dlhk.jogjaprov.go.id/form-permohonan-informasi/",
    kontakWa: "https://wa.me/6281329089589",
  },
  {
    instansi: "DLHK Jawa Tengah",
    website: "https://dlhk.jatengprov.go.id/v1/",
    permintaanData:
      "https://ppid.dlhk.jatengprov.go.id/formulir-permohonan-informasi/",
    kontakWa: "https://wa.me/6281393934475",
  },
  {
    instansi: "Staklim Kelas I Jawa Tengah",
    website: "https://www.iklimjateng.info/",
    permintaanData:
      "https://www.iklimjateng.info/index.php/layanan-informasi/informasi-iklim",
    kontakWa: "https://wa.me/6282223069425",
  },
  {
    instansi: "Staklim Kelas IV DIY",
    website: "https://staklim-yogya.bmkg.go.id",
    permintaanData: "https://staklim-yogya.bmkg.go.id/portalpelayanandata/",
    kontakWa: "https://wa.me/628112638113",
  },
  {
    instansi: "Perum Jasa Tirta I",
    website: "https://jasatirta1.co.id",
    permintaanData: "https://eppid.jasatirta1.co.id/permohonan/login",
    kontakWa: null,
  },
  {
    instansi: "BPDAS Serayu Opak Progo",
    website: "https://www.instagram.com/bpdas_sop/",
    permintaanData: null,
    kontakWa: null,
  },
  {
    instansi: "Badan Geologi, Kementerian ESDM",
    website: null,
    permintaanData: null,
    kontakWa: null,
  },
];
