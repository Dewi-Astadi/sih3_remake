# PENDAHULUAN

## Latar Belakang

Pengelolaan sumber daya air menuntut ketersediaan data hidrologi, hidrometeorologi, dan hidrogeologi yang akurat serta tepat waktu. Data tinggi muka air, curah hujan, dan muka air tanah menjadi dasar bagi peringatan dini banjir, penetapan status siaga, alokasi air irigasi, hingga penyusunan rekomendasi teknis pemanfaatan sumber daya air. Kesalahan atau keterlambatan penyampaian informasi tersebut berdampak langsung pada pengambilan keputusan, baik oleh pemerintah daerah maupun masyarakat di kawasan rawan bencana. Oleh karena itu, pengujian dan penyajian data hidrologi bukan sekadar pekerjaan administrasi, melainkan bagian dari upaya pengurangan risiko bencana [@Bagiawan_2018].

Kebijakan nasional telah mengarahkan pengelolaan data tersebut ke dalam satu sistem terpadu. Peraturan Presiden Nomor 88 Tahun 2012 tentang Kebijakan Pengelolaan Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi pada Tingkat Nasional menempatkan SIH3 sebagai bagian dari jaringan informasi sumber daya air yang dikelola dalam suatu pusat pengelolaan data [@Perpres_2012]. Pada tingkat pelaksana, Balai Besar Wilayah Sungai Serayu Opak selaku Unit Pelaksana Teknis Direktorat Jenderal Sumber Daya Air memiliki fungsi pengelolaan sistem hidrologi serta pengelolaan sistem informasi sumber daya air. Konsekuensi dari amanat tersebut adalah bahwa portal SIH3 yang dikelola tidak hanya dituntut lengkap secara data, tetapi juga dapat digunakan secara nyaman oleh publik yang menjadi sasaran layanannya.

Portal SIH3 BBWS Serayu Opak yang beroperasi sebelum kegiatan redesain dirancang dengan pendekatan peta sebagai pusat interaksi. Halaman beranda menampilkan peta sebaran pos pemantauan dengan ratusan titik yang harus dirender oleh peramban, disertai legenda, panel status, dan beberapa lapisan informasi. Pendekatan tersebut relevan untuk pengguna yang ingin memahami sebaran spasial pos, tetapi menjadi hambatan ketika pengguna memiliki tujuan yang jauh lebih sederhana, yaitu mencari satu pos tertentu lalu mengunduh datanya. Berdasarkan pengamatan awal, pengguna dihadapkan pada tiga persoalan utama: beban pemuatan halaman yang besar karena ratusan elemen grafis dirender sekaligus, alur pengunduhan data yang berlapis sehingga tidak dapat diselesaikan dalam satu tindakan, serta kepadatan navigasi dan variasi warna yang menyulitkan pemindaian informasi pada layar kecil.

Persoalan tersebut merupakan persoalan antarmuka dan pengalaman pengguna, bukan semata persoalan teknis. Nielsen menjelaskan bahwa sebagian besar permasalahan kegunaan dapat ditemukan melalui pemeriksaan sistematis terhadap antarmuka dengan berpedoman pada prinsip-prinsip kegunaan yang telah teruji, tanpa harus menunggu keluhan pengguna muncul di lapangan [@Nielsen_1994]. Pada konteks situs pemerintah, evaluasi semacam ini terbukti efektif untuk mengidentifikasi hambatan navigasi dan penyajian informasi sebelum situs digunakan secara luas [@Sivaji_2011]. Dengan demikian, redesain portal SIH3 perlu disertai evaluasi yang terukur agar perbaikan yang dilakukan tidak berhenti pada perubahan tampilan, tetapi benar-benar meningkatkan kemudahan penggunaan.

Selama kegiatan magang di Balai Besar Wilayah Sungai Serayu Opak, penulis terlibat dalam proses perancangan ulang portal SIH3 dari sisi antarmuka publik maupun panel pengelolaan data. Redesain diarahkan pada arsitektur yang bebas peta, penggantian peta sebaran dengan pusat eksplorasi data berbasis tabel yang dapat difilter, penyediaan tombol unduh langsung pada setiap baris data, penyatuan identitas visual instansi ke dalam satu set token desain, serta penyesuaian tata letak untuk perangkat seluler. Hasil redesain tersebut kemudian dievaluasi menggunakan pendekatan yang menggabungkan evaluasi heuristik, pengukuran kinerja pemuatan halaman, audit aksesibilitas, dan rencana pengukuran kepuasan pengguna dengan System Usability Scale.

Berdasarkan uraian tersebut, penulis menyusun laporan magang dengan judul **"Evaluasi Antarmuka dan Pengalaman Pengguna (UI/UX) pada Hasil Redesain Website SIH3 BBWS Serayu Opak"**. Judul ini dipilih karena fokus kegiatan yang dilakukan bukan hanya menghasilkan tampilan baru, tetapi juga menilai sejauh mana tampilan baru tersebut menjawab persoalan kegunaan yang ditemukan pada portal sebelumnya.

## Rumusan Masalah

Berdasarkan latar belakang di atas, rumusan masalah dalam laporan magang ini adalah sebagai berikut:

1. Bagaimana kondisi antarmuka dan pengalaman pengguna portal SIH3 BBWS Serayu Opak sebelum dilakukan redesain ditinjau dari aspek kegunaan, kinerja pemuatan halaman, dan aksesibilitas?
2. Bagaimana rancangan antarmuka portal SIH3 hasil redesain disusun untuk mengatasi persoalan kegunaan yang ditemukan pada portal sebelumnya?
3. Bagaimana hasil evaluasi antarmuka dan pengalaman pengguna portal SIH3 setelah redesain ditinjau dari evaluasi heuristik, kinerja pemuatan halaman, aksesibilitas, dan kepuasan pengguna?
4. Apa rekomendasi perbaikan yang dapat diberikan berdasarkan hasil evaluasi tersebut?

## Batasan Masalah

Agar pembahasan terarah, penulis menetapkan batasan masalah sebagai berikut:

1. Objek evaluasi adalah portal SIH3 BBWS Serayu Opak yang dikembangkan pada kegiatan magang, mencakup halaman beranda, pusat eksplorasi data, detail pos, publikasi dokumen, dan direktori walidata pada antarmuka publik.
2. Evaluasi difokuskan pada aspek antarmuka dan pengalaman pengguna, meliputi kegunaan, kemudahan navigasi, kejelasan penyajian informasi, kinerja pemuatan halaman, dan aksesibilitas. Evaluasi tidak mencakup pengujian keamanan, pengujian penetrasi, dan audit infrastruktur server.
3. Evaluasi heuristik dilakukan oleh penulis bersama tim magang sebagai evaluator, bukan oleh sekelompok pengguna akhir yang mewakili seluruh populasi.
4. Pengukuran kinerja halaman dilakukan pada lingkungan pengujian terbatas dengan satu jenis peramban dan satu kondisi jaringan, sehingga hasilnya menggambarkan kecenderungan, bukan jaminan kinerja pada seluruh kondisi jaringan pengguna.
5. Data yang digunakan dalam pengujian berasal dari basis data contoh yang disediakan pada lingkungan pengembangan, yang memuat sepuluh pos pemantauan, tujuh instansi walidata, seribu dua ratus empat puluh rekaman pengukuran, dan enam dokumen publikasi.
6. Pengukuran kepuasan pengguna dengan System Usability Scale dirancang sebagai instrumen yang siap digunakan; nilai akhir hanya berlaku setelah instrumen diisi oleh responden dan diolah sesuai prosedur perhitungan.

## Tujuan Magang Profesional

Kegiatan magang profesional ini bertujuan untuk:

1. Mengidentifikasi persoalan antarmuka dan pengalaman pengguna pada portal SIH3 sebelum redesain melalui observasi, evaluasi heuristik, dan pengukuran kinerja halaman.
2. Merancang ulang antarmuka portal SIH3 dengan pendekatan yang berorientasi pada kebutuhan pengguna, meliputi penyusunan token desain, penataan arsitektur informasi, dan perancangan halaman utama.
3. Mengimplementasikan hasil rancangan menjadi antarmuka web yang berjalan di atas arsitektur terpisah antara antarmuka publik dan layanan data.
4. Mengevaluasi hasil redesain menggunakan instrumen yang terukur sehingga perbaikan dapat dipertanggungjawabkan secara akademik.
5. Merumuskan rekomendasi perbaikan bagi pengembangan portal SIH3 pada tahap berikutnya.

## Manfaat Magang MBKM

Pelaksanaan magang ini memberikan manfaat bagi beberapa pihak sebagaimana diuraikan berikut.

### Manfaat Bagi Penulis

1. Penulis memperoleh pengalaman menerapkan metode evaluasi antarmuka dan pengalaman pengguna pada sistem nyata yang digunakan oleh instansi pemerintah, bukan hanya pada studi kasus di dalam perkuliahan.
2. Penulis memahami proses kerja pengelolaan data hidrologi, mulai dari pencatatan data pos, pengelolaan dokumen publikasi, hingga penyajian data kepada masyarakat.
3. Penulis melatih kemampuan bekerja dalam tim lintas peran, meliputi perancangan antarmuka, pengembangan antarmuka, pengembangan layanan data, dan pengujian.
4. Penulis terbiasa mendokumentasikan keputusan perancangan beserta alasan yang mendasarinya, sehingga hasil pekerjaan dapat ditinjau ulang oleh pihak lain.

### Manfaat Bagi BBWS Serayu Opak

1. Portal SIH3 memperoleh perbaikan antarmuka yang memudahkan masyarakat, akademisi, dan instansi teknis dalam menemukan serta mengunduh data pemantauan.
2. Hasil evaluasi memberikan gambaran terukur mengenai kekuatan dan kelemahan antarmuka, sehingga prioritas perbaikan berikutnya dapat ditetapkan berdasarkan temuan, bukan berdasarkan asumsi.
3. Dokumentasi token desain dan komponen antarmuka memudahkan pengelola dalam menjaga konsistensi tampilan ketika menambah halaman baru.
4. Panel pengelolaan data memudahkan staf dalam memperbarui data pos, rekaman pengukuran, dan dokumen publikasi tanpa bergantung pada pengembang.

### Manfaat Bagi Universitas Duta Bangsa Surakarta

1. Laporan ini dapat digunakan sebagai bahan kajian tambahan pada mata kuliah yang membahas interaksi manusia dan komputer, rekayasa perangkat lunak, serta evaluasi sistem informasi.
2. Laporan ini dapat menjadi referensi bagi mahasiswa yang mengambil studi kasus evaluasi antarmuka pada sistem informasi pemerintahan.
3. Laporan ini menjadi bukti pelaksanaan kerja sama antara program studi dengan instansi pemerintah dalam kegiatan Magang MBKM.

## Metode Pelaksanaan Magang MBKM

Pelaksanaan magang menggunakan pendekatan yang menggabungkan pengumpulan data, perancangan ulang antarmuka, implementasi, dan evaluasi. Tahapan tersebut diuraikan berikut.

### Metode Pengumpulan Data

Data yang digunakan dalam penyusunan laporan diperoleh melalui empat cara berikut:

1. **Observasi langsung.** Penulis mengamati penggunaan portal SIH3 versi sebelumnya, menelusuri alur pencarian pos, dan mencoba mengunduh data untuk mengetahui titik-titik hambatan yang dialami pengguna.
2. **Wawancara tidak terstruktur.** Penulis berdiskusi dengan staf pengelola data dan tim pengembang untuk memperoleh penjelasan mengenai kebutuhan informasi, kendala operasional, serta harapan terhadap portal baru.
3. **Studi pustaka.** Penulis menelaah jurnal, buku, standar, dan dokumentasi teknis mengenai evaluasi kegunaan, aksesibilitas web, pengukuran kinerja halaman, serta pengembangan antarmuka web.
4. **Pengukuran langsung.** Penulis melakukan pengukuran kinerja pemuatan halaman, penghitungan jumlah elemen halaman, dan audit aksesibilitas otomatis pada portal lama dan portal hasil redesain menggunakan instrumen yang sama agar hasil dapat dibandingkan.

### Metode Perancangan Sistem

Perancangan dilakukan dengan pendekatan *design thinking* yang terdiri atas lima tahap, yaitu *empathize*, *define*, *ideate*, *prototype*, dan *test* [@Sahroni_2025]. Pendekatan ini dipilih karena menempatkan pemahaman terhadap kebutuhan pengguna sebagai dasar pengambilan keputusan perancangan, sehingga perubahan antarmuka dapat dipertanggungjawabkan. Penerapan tahapan tersebut dalam kegiatan magang adalah sebagai berikut:

1. **Empathize.** Penulis menelusuri portal lama, mencatat keluhan pengguna, dan mengamati kebiasaan pengelola data dalam memperbarui informasi.
2. **Define.** Penulis merumuskan masalah utama menjadi pernyataan kebutuhan, antara lain kebutuhan menemukan pos pemantauan dengan cepat, kebutuhan mengunduh data dalam satu tindakan, dan kebutuhan membaca status siaga tanpa harus memahami peta.
3. **Ideate.** Penulis menyusun alternatif solusi, meliputi penghapusan peta sebagai pusat interaksi, penggantian dengan tabel data yang dapat difilter, penyediaan unduhan langsung per baris, dan penyatuan identitas visual instansi.
4. **Prototype.** Penulis menyusun token desain, kerangka halaman, dan komponen antarmuka, kemudian mengimplementasikannya menjadi antarmuka yang dapat dijalankan pada peramban.
5. **Test.** Penulis menguji fungsi antarmuka, mengukur kinerja halaman, melakukan audit aksesibilitas, dan mengevaluasi kesesuaian antarmuka dengan prinsip kegunaan.

### Waktu dan Tempat Pelaksanaan Magang

Kegiatan magang dilaksanakan dengan rincian sebagai berikut:

- a. Tanggal: [tanggal mulai] sampai dengan [tanggal selesai]
- b. Tempat: Balai Besar Wilayah Sungai Serayu Opak
- c. Alamat: Jalan Solo Km. 6, Ngentak, Caturtunggal, Kecamatan Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta
- d. Waktu kerja: Senin sampai dengan Jumat, pukul 08.00 sampai dengan 16.00 WIB
- e. Bidang penempatan: Bidang Keterpaduan Pembangunan Infrastruktur Sumber Daya Air, khususnya pengelolaan sistem hidrologi dan sistem informasi sumber daya air

## Sistematika Penulisan

Laporan ini disusun dalam lima bab dengan sistematika sebagai berikut:

**BAB I PENDAHULUAN** memuat latar belakang, rumusan masalah, batasan masalah, tujuan magang, manfaat magang, metode pelaksanaan, dan sistematika penulisan.

**BAB II LANDASAN TEORI** memuat teori yang mendasari pembahasan, meliputi antarmuka pengguna, pengalaman pengguna, evaluasi heuristik, System Usability Scale, Core Web Vitals, aksesibilitas web, design system, SIH3, serta teknologi yang digunakan dalam pengembangan.

**BAB III TINJAUAN UMUM** memuat profil instansi, struktur organisasi, tugas dan wewenang, objek magang, serta kegiatan yang dilaksanakan selama magang.

**BAB IV HASIL DAN PEMBAHASAN** memuat metodologi evaluasi, analisis kondisi awal, rancangan hasil redesain, implementasi, hasil pengujian fungsional, hasil evaluasi heuristik, hasil pengukuran kinerja dan aksesibilitas, instrumen pengukuran kepuasan pengguna, serta pembahasan.

**BAB V PENUTUP** memuat kesimpulan dan saran berdasarkan hasil pembahasan.
