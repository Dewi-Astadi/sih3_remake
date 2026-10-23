# LANDASAN TEORI

## Antarmuka Pengguna

Antarmuka pengguna atau *user interface* adalah bagian sistem yang berhubungan langsung dengan pengguna dan menjadi media penyampaian informasi serta sarana pengendalian sistem. Antarmuka mencakup tata letak elemen, tipografi, warna, ikon, teks petunjuk, serta mekanisme interaksi seperti tombol, formulir, dan menu. Kualitas antarmuka tidak diukur dari keindahan tampilan semata, melainkan dari kemampuannya membantu pengguna menyelesaikan tugas secara tepat, cepat, dan tanpa kebingungan.

Pada sistem informasi publik, antarmuka berperan sebagai satu-satunya titik kontak antara pengguna dan data yang dikelola. Pengukuran kualitas situs pemerintah menunjukkan bahwa dimensi kegunaan, kualitas informasi, dan kualitas layanan berhubungan erat dengan tingkat pemanfaatan situs oleh masyarakat [@Warjiyono_2018]. Pengguna tidak melihat basis data, layanan API, maupun proses pengolahan data di balik layar; yang terlihat hanyalah halaman yang dibuka pada peramban. Apabila antarmuka gagal menyampaikan struktur informasi, pengguna akan menyimpulkan bahwa sistem tidak memiliki data yang dicari, meskipun data tersebut tersedia. Oleh karena itu, perancangan antarmuka pada portal data pemerintahan harus memperhatikan kejelasan hierarki informasi, konsistensi istilah, dan ketersediaan umpan balik atas setiap tindakan pengguna.

## Pengalaman Pengguna

Pengalaman pengguna atau *user experience* merupakan keseluruhan kesan dan perasaan pengguna ketika berinteraksi dengan suatu produk, mencakup aspek kegunaan, kemudahan pemahaman, efisiensi, dan kepuasan. Pengalaman pengguna terbentuk dari rangkaian momen penggunaan, mulai dari kesan pertama saat halaman dimuat, proses pencarian informasi, hingga keberhasilan menyelesaikan tugas. Dengan demikian, pengalaman pengguna tidak dapat dinilai hanya dari satu halaman, tetapi dari keseluruhan alur yang dilalui pengguna.

Hubungan antara antarmuka dan pengalaman pengguna bersifat saling melengkapi. Antarmuka yang rapi tetapi tidak menyelesaikan kebutuhan pengguna hanya menghasilkan kesan visual yang baik tanpa manfaat nyata. Sebaliknya, sistem yang lengkap secara fungsi tetapi sulit dioperasikan akan ditinggalkan pengguna. Perancangan pengalaman pengguna karena itu menuntut pemahaman terhadap tujuan pengguna, hambatan yang dihadapi, serta konteks penggunaan, termasuk perangkat dan kualitas jaringan yang digunakan. Pendekatan design thinking digunakan untuk menjembatani pemahaman tersebut dengan keputusan perancangan melalui tahapan empati, perumusan masalah, penyusunan gagasan, pembuatan purwarupa, dan pengujian [@Azisz_2024].

## Evaluasi Heuristik

Evaluasi heuristik merupakan metode pemeriksaan kegunaan yang dilakukan oleh evaluator dengan berpedoman pada sejumlah prinsip kegunaan, tanpa melibatkan pengguna akhir secara langsung [@Nielsen_1994]. Metode ini relatif cepat dan murah, serta mampu menemukan permasalahan antarmuka pada tahap awal pengembangan. Kelemahannya, temuan evaluator dapat berbeda dengan pengalaman pengguna sebenarnya sehingga hasilnya sebaiknya dilengkapi dengan pengujian yang melibatkan pengguna.

Sepuluh prinsip heuristik yang digunakan dalam evaluasi ini adalah sebagai berikut:

1. **Visibilitas status sistem.** Sistem harus selalu memberi tahu pengguna mengenai apa yang sedang terjadi melalui umpan balik yang wajar dan tepat waktu.
2. **Kesesuaian antara sistem dan dunia nyata.** Sistem menggunakan bahasa, istilah, dan konsep yang dikenal pengguna.
3. **Kendali dan kebebasan pengguna.** Pengguna memiliki jalan keluar yang jelas ketika memilih tindakan yang salah.
4. **Konsistensi dan standar.** Elemen yang memiliki makna sama disajikan dengan cara yang sama.
5. **Pencegahan kesalahan.** Sistem dirancang agar kesalahan tidak terjadi, bukan hanya memberi pesan kesalahan setelah terjadi.
6. **Pengenalan daripada mengingat.** Pilihan dan informasi penting ditampilkan agar pengguna tidak perlu mengingat.
7. **Fleksibilitas dan efisiensi penggunaan.** Sistem menyediakan cara yang sesuai bagi pengguna pemula maupun pengguna mahir.
8. **Estetika dan desain minimalis.** Informasi yang tidak relevan tidak ditampilkan karena dapat mengalihkan perhatian.
9. **Membantu pengguna mengenali, mendiagnosis, dan memulihkan diri dari kesalahan.** Pesan kesalahan disampaikan dalam bahasa yang jelas disertai solusi.
10. **Bantuan dan dokumentasi.** Bantuan disediakan secara mudah diakses dan berorientasi pada penyelesaian tugas.

Penerapan evaluasi heuristik pada situs pemerintahan menunjukkan bahwa metode ini mampu mengungkap permasalahan navigasi, penamaan menu, dan penyajian informasi yang tidak konsisten [@Sivaji_2011]. Pada situs perguruan tinggi, evaluasi heuristik juga digunakan untuk menemukan permasalahan akses informasi akademik sebelum perbaikan antarmuka dilakukan [@Serly_2020]. Pada penelitian lain, kombinasi evaluasi heuristik dan System Usability Scale menghasilkan gambaran yang lebih utuh karena temuan permasalahan dapat dikaitkan dengan persepsi pengguna [@Maulana_2025].

## System Usability Scale

System Usability Scale atau SUS merupakan kuesioner singkat berisi sepuluh pernyataan yang dirancang untuk mengukur persepsi kegunaan suatu produk [@Brooke_1996]. Setiap pernyataan dijawab dengan skala Likert lima titik, mulai dari sangat tidak setuju hingga sangat setuju. Pernyataan bernomor ganjil bersifat positif, sedangkan pernyataan bernomor genap bersifat negatif sehingga responden terdorong membaca setiap pernyataan dengan cermat.

Skor SUS dihitung dengan aturan berikut. Untuk pernyataan bernomor ganjil, skor kontribusi diperoleh dari nilai jawaban dikurangi satu. Untuk pernyataan bernomor genap, skor kontribusi diperoleh dari lima dikurangi nilai jawaban. Jumlah seluruh skor kontribusi kemudian dikalikan 2,5 sehingga menghasilkan rentang nilai 0 sampai 100. Nilai tersebut bukan persentase, melainkan skor komposit yang ditafsirkan menggunakan acuan tertentu.

Penelitian empiris terhadap ratusan studi menunjukkan bahwa skor SUS memiliki hubungan yang konsisten dengan penilaian kegunaan secara umum, dengan rata-rata skor sekitar 68 dan kategori penerimaan yang dapat dipetakan menjadi rentang *not acceptable*, *marginal*, dan *acceptable* [@Bangor_2008]. Beberapa penelitian di Indonesia menggunakan SUS untuk mengevaluasi situs layanan publik dan aplikasi pemerintahan [@Sulistyanti_2025; @Wibisono_2023], termasuk penelitian yang menggabungkannya dengan redesain antarmuka [@Sampul_2026; @Smeichel_Maliseono_2026]. Pada evaluasi situs perusahaan, SUS kerap dipasangkan dengan pengujian langsung terhadap calon pengguna agar skor yang diperoleh dapat dijelaskan melalui kesulitan yang dialami saat menyelesaikan tugas [@Farhat_Mu_afy_2024].

## Core Web Vitals

Core Web Vitals merupakan sekumpulan metrik yang digunakan untuk mengukur kualitas pengalaman pengguna pada halaman web, khususnya dari sisi kecepatan, kestabilan tata letak, dan responsivitas [@WebVitals_2024]. Metrik tersebut dianggap penting karena berkaitan langsung dengan kesan pengguna saat halaman pertama kali dibuka dan ketika berinteraksi dengan elemen halaman.

Tiga metrik utama dalam Core Web Vitals adalah sebagai berikut:

1. **Largest Contentful Paint (LCP)** mengukur waktu yang dibutuhkan hingga elemen terbesar pada area tampilan selesai dirender. Nilai di bawah 2,5 detik dikategorikan baik, antara 2,5 sampai 4 detik dikategorikan perlu perbaikan, dan di atas 4 detik dikategorikan buruk.
2. **Cumulative Layout Shift (CLS)** mengukur ketidakstabilan tata letak, yaitu seberapa banyak elemen berpindah posisi secara tak terduga selama halaman dimuat. Nilai di bawah 0,1 dikategorikan baik.
3. **Interaction to Next Paint (INP)** mengukur jeda antara tindakan pengguna dan respons visual yang muncul. Nilai di bawah 200 milidetik dikategorikan baik.

Selain ketiga metrik tersebut, jumlah permintaan jaringan, ukuran dokumen yang diunduh, jumlah elemen halaman, dan durasi tugas panjang pada utas utama menjadi indikator pendukung yang menjelaskan penyebab perbedaan kinerja antarhalaman. Pada penelitian ini, metrik tersebut digunakan untuk membandingkan portal sebelum dan sesudah redesain secara terukur.

## Aksesibilitas Web

Aksesibilitas web adalah praktik memastikan bahwa konten dan fungsi situs dapat digunakan oleh semua orang, termasuk pengguna dengan disabilitas penglihatan, pendengaran, motorik, dan kognitif. Pedoman Web Content Accessibility Guidelines versi 2.2 menetapkan empat prinsip utama, yaitu *perceivable*, *operable*, *understandable*, dan *robust* [@W3C_2023]. Keempat prinsip tersebut dijabarkan menjadi kriteria keberhasilan yang dapat diuji, antara lain ketersediaan teks alternatif pada gambar, rasio kontras warna yang memadai, struktur judul yang berurutan, serta penamaan elemen formulir yang jelas.

Pada situs pemerintahan, aksesibilitas memiliki dimensi tambahan karena layanan publik dituntut inklusif. Pengguna portal SIH3 mencakup masyarakat umum dengan beragam tingkat literasi digital, akademisi, petugas lapangan, hingga instansi teknis. Struktur judul yang berurutan, kontras warna yang cukup, dan penamaan elemen yang deskriptif membantu seluruh kelompok pengguna tersebut, bukan hanya pengguna dengan disabilitas. Pemeriksaan aksesibilitas dalam penelitian ini dilakukan menggunakan perkakas audit otomatis yang menguji halaman terhadap kriteria keberhasilan WCAG tingkat A dan AA.

## Design System dan Design Token

Design system merupakan kumpulan standar yang mengatur komponen antarmuka, pola interaksi, dan aturan visual agar produk digital memiliki konsistensi. Salah satu unsur dasar design system adalah design token, yaitu nilai visual yang disimpan sebagai variabel, seperti warna primer, warna teks, warna batas, radius sudut, dan jarak antarelemen. Dengan token, perubahan satu nilai dapat diterapkan secara menyeluruh tanpa menyunting setiap komponen.

Penerapan design token memberikan tiga manfaat utama. Pertama, konsistensi visual terjaga karena seluruh halaman menggunakan sumber nilai yang sama. Kedua, proses penyesuaian menjadi lebih cepat dan berisiko rendah. Ketiga, token dapat diuji terhadap kriteria kontras warna sehingga keputusan aksesibilitas dapat diperiksa secara sistematis. Pada portal SIH3 hasil redesain, token desain didefinisikan dalam satu berkas gaya global dan diturunkan menjadi kelas utilitas pada kerangka kerja CSS yang digunakan.

## Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi

Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi yang selanjutnya disebut SIH3 adalah bagian dari jaringan informasi sumber daya air yang menghimpun, mengolah, dan menyajikan data mengenai air di permukaan, air hujan dan atmosfer, serta air di bawah permukaan tanah [@Perpres_2012]. Pengelolaan SIH3 melibatkan kolaborasi lintas kementerian dan pemerintah daerah, dengan Kementerian Pekerjaan Umum melalui Direktorat Jenderal Sumber Daya Air sebagai salah satu pengelola utama.

Data yang dikelola SIH3 mencakup tiga kelompok berikut:

1. **Data hidrologi**, meliputi tinggi muka air pada pos duga air, debit aliran, serta kualitas air pada titik pemantauan tertentu.
2. **Data hidrometeorologi**, meliputi curah hujan yang dicatat oleh penakar hujan otomatis serta parameter iklim pada stasiun klimatologi.
3. **Data hidrogeologi**, meliputi muka air tanah pada sumur pantau dan informasi akuifer.

Ketersediaan data tersebut tidak otomatis menjamin pemanfaatan yang optimal. Data hanya bermanfaat apabila dapat ditemukan, dipahami, dan diunduh oleh pihak yang membutuhkan, termasuk akademisi yang memerlukan data deret waktu untuk analisis dan instansi daerah yang memerlukan informasi status siaga. Oleh karena itu, kualitas penyajian data pada antarmuka menjadi bagian tak terpisahkan dari kualitas layanan SIH3 secara keseluruhan.

## Arsitektur Terpisah

Arsitektur terpisah atau *decoupled architecture* memisahkan antarmuka pengguna dari layanan pengolahan data. Antarmuka berkomunikasi dengan layanan melalui antarmuka pemrograman aplikasi berbasis protokol HTTP, umumnya dalam format JSON, sedangkan layanan data mengelola basis data dan aturan bisnis secara terpisah. Pemisahan ini memungkinkan kedua bagian dikembangkan, diuji, dan disebarkan secara independen.

Keuntungan arsitektur terpisah pada portal data pemerintah antara lain sebagai berikut:

1. Antarmuka publik dapat dioptimalkan untuk kecepatan dan keterbacaan tanpa mengubah logika pengelolaan data.
2. Layanan data dapat melayani beberapa kanal sekaligus, misalnya portal publik, panel administrasi, dan aplikasi pihak ketiga.
3. Pengujian menjadi lebih terarah karena setiap bagian memiliki batas tanggung jawab yang jelas.

Konsekuensi yang perlu dikelola adalah kebutuhan pengelolaan versi antarmuka pemrograman, penanganan kegagalan jaringan pada sisi antarmuka, serta penyediaan mekanisme pemuatan bertahap agar pengguna tetap memperoleh umpan balik ketika data belum tersedia.

## Next.js

Next.js merupakan kerangka kerja React yang menyediakan perutean berbasis direktori, perenderan di sisi server, perenderan statis, dan optimasi sumber daya. Pada versi yang digunakan dalam proyek ini, Next.js menyediakan App Router yang memungkinkan penyusunan halaman sebagai komponen server dan komponen klien dalam satu struktur direktori.

Pada portal SIH3, Next.js digunakan untuk membangun antarmuka publik dengan pertimbangan berikut:

1. Perenderan di sisi server memungkinkan halaman awal dikirim dalam keadaan telah terisi data sehingga waktu tampil pertama lebih singkat.
2. Pemisahan komponen server dan klien memudahkan penempatan logika pengambilan data pada sisi server tanpa mengirim kredensial ke peramban.
3. Kemampuan membangun halaman statis dengan validasi ulang berkala sesuai untuk konten yang berubah dalam hitungan menit, seperti ringkasan telemetri.

## Laravel dan Filament

Laravel merupakan kerangka kerja PHP yang menggunakan pola arsitektur *Model-View-Controller* serta menyediakan fasilitas migrasi basis data, pemetaan objek-relasional, validasi, dan antrean pekerjaan. Pada proyek ini, Laravel digunakan sebagai penyedia layanan data yang menangani permintaan data pos, deret waktu pengukuran, ekspor berkas, katalog dokumen, dan direktori walidata.

Filament merupakan kerangka kerja panel administrasi untuk Laravel yang memungkinkan pembuatan antarmuka pengelolaan data tanpa menulis banyak kode tampilan. Filament digunakan untuk menyediakan panel pengelolaan bagi staf, meliputi pengelolaan pos pemantauan, rekaman pengukuran, dokumen publikasi, dan profil instansi walidata. Dengan panel tersebut, pembaruan data tidak lagi bergantung pada pengembang.

## Ekspor Data Streaming

Ekspor data streaming merupakan teknik pengiriman berkas secara bertahap ketika data masih dibaca dari basis data, tanpa menampung seluruh hasil di memori server terlebih dahulu. Teknik ini penting ketika jumlah rekaman besar, misalnya ribuan rekaman pengukuran dalam rentang satu tahun. Tanpa streaming, server harus menyusun seluruh berkas di memori sebelum dikirim, sehingga konsumsi memori meningkat dan waktu tunggu pengguna bertambah.

Pada portal SIH3, ekspor data menggunakan pustaka pengolah lembar kerja yang mendukung penulisan bertahap. Berkas hasil ekspor dikirim sebagai respons bertipe *stream* dengan tajuk yang sesuai sehingga peramban dapat langsung menyimpannya sebagai berkas unduhan. Pendekatan ini memungkinkan pengguna memperoleh data dalam format lembar kerja maupun teks terpisah koma sesuai kebutuhan analisis.
