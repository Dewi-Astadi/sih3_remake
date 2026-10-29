# KATA PENGANTAR {-}

Puji syukur penulis panjatkan ke hadirat Tuhan Yang Maha Esa atas rahmat dan karunia-Nya sehingga kegiatan Magang MBKM dan penyusunan laporan yang berjudul **"Evaluasi Antarmuka dan Pengalaman Pengguna (UI/UX) pada Hasil Redesain Website SIH3 BBWS Serayu Opak"** dapat diselesaikan dengan baik.

Laporan ini disusun sebagai salah satu bentuk pertanggungjawaban akademik atas pelaksanaan magang pada Balai Besar Wilayah Sungai Serayu Opak, Direktorat Jenderal Sumber Daya Air, Kementerian Pekerjaan Umum. Laporan ini memuat uraian mengenai proses perancangan ulang antarmuka portal SIH3 beserta evaluasi terhadap hasil redesain tersebut, ditinjau dari aspek kegunaan (*usability*), kinerja pemuatan halaman, aksesibilitas, dan pengalaman pengguna secara keseluruhan.

Selama pelaksanaan magang dan penyusunan laporan ini, penulis memperoleh banyak bantuan, bimbingan, serta dukungan dari berbagai pihak. Oleh karena itu, pada kesempatan ini penulis menyampaikan ucapan terima kasih kepada:

1. Bapak Assoc. Prof. Dr. Singgih Purnomo, M.M. selaku Rektor Universitas Duta Bangsa Surakarta.
2. Bapak Eko Purwanto, S.Kom., M.Kom., Ph.D. selaku Dekan Fakultas Ilmu Komputer Universitas Duta Bangsa Surakarta.
3. Bapak Afu Ichsan Pradana, S.Kom., M.Kom. selaku Ketua Program Studi S-1 Sistem Informasi Fakultas Ilmu Komputer Universitas Duta Bangsa Surakarta.
4. Bapak/Ibu [Nama Dosen Pembimbing], S.Kom., M.Kom. selaku dosen pembimbing magang yang telah memberikan arahan selama proses penyusunan laporan.
5. Pimpinan dan seluruh staf Balai Besar Wilayah Sungai Serayu Opak yang telah memberikan kesempatan, data, serta masukan teknis selama kegiatan magang berlangsung.
6. Rekan-rekan mahasiswa magang yang telah membantu proses pengujian, diskusi, dan pengumpulan data evaluasi.
7. Semua pihak yang tidak dapat disebutkan satu per satu atas bantuan yang diberikan selama pelaksanaan magang.

Penulis menyadari bahwa laporan ini masih memiliki kekurangan, baik dari segi isi maupun penyajian. Oleh karena itu, kritik dan saran yang membangun sangat penulis harapkan demi penyempurnaan di masa mendatang. Semoga laporan ini memberikan manfaat bagi pembaca, khususnya bagi pengembangan portal SIH3 dan penelitian di bidang evaluasi antarmuka serta pengalaman pengguna.

```{=typst}
#v(0.8cm)
#align(right)[
  Surakarta, Oktober 2026

  #v(1cm)
  Abdullah As Syafi'i
]
#pagebreak()
#outline(
  title: [#align(center)[#text(size: 14pt, weight: "bold")[DAFTAR ISI]]],
  depth: 3,
)
#context {
  if opt-daftar-gambar {
    let imgs = query(figure.where(kind: image))
    if imgs.len() > 0 {
      pagebreak()
      outline(
        title: align(center)[#text(size: 14pt, weight: "bold")[DAFTAR GAMBAR]],
        target: figure.where(kind: image),
      )
    }
  }
  if opt-daftar-tabel {
    let tbls = query(figure.where(kind: table))
    if tbls.len() > 0 {
      pagebreak()
      outline(
        title: align(center)[#text(size: 14pt, weight: "bold")[DAFTAR TABEL]],
        target: figure.where(kind: table),
      )
    }
  }
}
#pagebreak()
#set page(numbering: "1")
#counter(page).update(1)
```

```{=openxml}
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:before="454"/></w:pPr><w:r><w:t>Surakarta, Oktober 2026</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:before="567"/></w:pPr><w:r><w:t>Abdullah As Syafi'i</w:t></w:r></w:p>
```
