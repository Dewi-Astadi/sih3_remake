# HASIL DAN PEMBAHASAN

## Metodologi Evaluasi

Evaluasi dalam laporan ini menggunakan empat pendekatan yang saling melengkapi. Pendekatan pertama adalah evaluasi heuristik untuk menilai kesesuaian antarmuka dengan sepuluh prinsip kegunaan [@Nielsen_1994]. Pendekatan kedua adalah pengukuran kinerja pemuatan halaman menggunakan metrik Core Web Vitals beserta indikator pendukung berupa jumlah permintaan jaringan, ukuran dokumen, jumlah elemen halaman, dan durasi tugas panjang pada utas utama [@WebVitals_2024]. Pendekatan ketiga adalah audit aksesibilitas otomatis terhadap kriteria keberhasilan WCAG tingkat A dan AA [@W3C_2023]. Pendekatan keempat adalah penyusunan instrumen System Usability Scale untuk mengukur persepsi kegunaan pengguna [@Brooke_1996].

Alur penelitian yang dilaksanakan ditunjukkan pada gambar berikut.

![Alur Penelitian Evaluasi Redesain Portal SIH3](gambar/alur-penelitian.png){#fig:alur-penelitian width=88%}

Penelitian dimulai dari identifikasi permasalahan pada portal lama, dilanjutkan dengan studi literatur dan observasi untuk menetapkan kriteria evaluasi. Tahap berikutnya adalah perancangan ulang antarmuka, implementasi, pengujian fungsional, dan evaluasi hasil. Setiap tahap menghasilkan luaran yang menjadi masukan bagi tahap berikutnya, sehingga temuan pada tahap evaluasi dapat ditelusuri kembali ke keputusan perancangan yang diambil.

Pengukuran kinerja dilakukan dengan instrumen yang sama pada kedua versi portal, yaitu peramban Chromium dalam mode tanpa antarmuka dengan lebar tampilan 1440 piksel dan tinggi 900 piksel. Portal lama diukur melalui alamat publiknya, sedangkan portal baru diukur melalui lingkungan pengujian lokal yang menjalankan hasil build produksi. Perbedaan lingkungan pengukuran tersebut perlu diperhatikan: nilai Time to First Byte pada portal lama dipengaruhi oleh jarak jaringan dan beban peladen produksi, sedangkan portal baru diukur pada peladen lokal. Oleh karena itu, perbandingan yang bersifat struktural seperti jumlah elemen halaman, jumlah gambar, ukuran dokumen, jumlah permintaan, dan durasi tugas panjang menjadi indikator yang lebih dapat diperbandingkan dibandingkan nilai waktu absolut.

## Analisis Kondisi Awal

Portal SIH3 versi lama menempatkan peta sebaran pos sebagai pusat interaksi pada halaman beranda. Peta tersebut memuat ratusan titik pos pemantauan beserta panel legenda, panel status, dan lapisan informasi lain. Pendekatan ini memberikan gambaran spasial yang kaya, tetapi menimbulkan beban perenderan yang besar pada peramban. Hasil pengukuran menunjukkan halaman beranda lama memuat 92 permintaan jaringan, 1.324 elemen halaman, dan 653 elemen gambar, dengan ukuran dokumen sebesar 426 KB serta durasi tugas panjang mencapai 135 sampai 250 milidetik.

Tampilan halaman beranda portal lama ditunjukkan pada gambar berikut.

![Halaman Beranda Portal SIH3 Sebelum Redesain](gambar/before-beranda.png){#fig:before-beranda width=92%}

Berdasarkan pengamatan terhadap halaman tersebut, ditemukan empat persoalan utama. Pertama, area peta menempati sebagian besar ruang tampilan sehingga informasi ringkas mengenai status pos tidak langsung terlihat tanpa menggulir. Kedua, pengguna yang ingin mengunduh data harus memahami terlebih dahulu cara berinteraksi dengan peta, memilih titik pos, lalu membuka halaman detail sebelum menemukan tombol unduh. Ketiga, variasi warna pada panel peta, legenda, dan kartu informasi cukup tinggi sehingga hierarki informasi menjadi kurang tegas. Keempat, pada lebar layar seluler, panel-panel informasi bertumpuk dan memerlukan pengguliran panjang untuk mencapai informasi status pos.

Halaman akses data pada portal lama ditunjukkan pada gambar berikut.

![Halaman Akses Data Portal SIH3 Sebelum Redesain](gambar/before-data.png){#fig:before-data width=92%}

Halaman tersebut menyediakan filter tipe data, jenis data, pos pengamatan, serta rentang tanggal. Meskipun demikian, hasil penyaringan disajikan dalam bentuk yang menuntut pengguna menelusuri tabel secara manual, dan proses memperoleh berkas data tidak dapat diselesaikan dalam satu tindakan dari halaman daftar. Pola tersebut sesuai dengan temuan penelitian pada situs pemerintahan yang menunjukkan bahwa permasalahan utama biasanya bukan ketiadaan data, melainkan panjangnya alur yang harus dilalui pengguna untuk memperoleh data tersebut [@Sivaji_2011].

Halaman detail pos pada portal lama ditunjukkan pada gambar berikut.

![Halaman Detail Pos Portal SIH3 Sebelum Redesain](gambar/before-detail.png){#fig:before-detail width=92%}

Pada halaman detail, informasi pos dan rekaman pengukuran disajikan dalam beberapa panel terpisah. Pengguna dapat memperoleh data, tetapi jumlah langkah yang diperlukan untuk sampai pada berkas unduhan masih tergolong banyak. Selain itu, tidak terdapat indikator yang menjelaskan kepada pengguna bahwa proses pengunduhan sedang berlangsung atau bahwa data untuk periode tertentu tidak tersedia.

Tampilan portal lama pada perangkat seluler ditunjukkan pada gambar berikut.

![Halaman Beranda Portal SIH3 Sebelum Redesain pada Layar Seluler](gambar/before-mobile-beranda.png){#fig:before-mobile width=42%}

Pada layar seluler, peta tetap ditampilkan dengan ukuran yang diperkecil sehingga titik pos menjadi sulit dipilih. Panel informasi di bawah peta memerlukan pengguliran panjang, dan beberapa elemen kontrol berukuran kecil sehingga rawan salah sentuh. Kondisi ini bertentangan dengan prinsip efisiensi penggunaan pada perangkat yang paling banyak digunakan masyarakat untuk mengakses layanan publik.

Hasil audit aksesibilitas otomatis pada portal lama menemukan satu pelanggaran serius berupa tautan tanpa nama yang dapat dibaca oleh pembaca layar, dengan jumlah pemeriksaan yang lulus sebanyak 30 butir. Temuan tersebut menunjukkan bahwa sebagian elemen interaktif belum memiliki label yang memadai, sehingga pengguna pembaca layar tidak dapat mengetahui tujuan tautan.

## Rancangan Hasil Redesain

### Prinsip Perancangan

Redesain disusun berdasarkan empat prinsip yang diturunkan dari permasalahan pada kondisi awal, yaitu:

1. **Mengutamakan tugas utama pengguna.** Tugas utama pengguna portal adalah menemukan pos pemantauan dan memperoleh datanya. Seluruh keputusan tata letak diarahkan pada percepatan kedua tugas tersebut.
2. **Menghilangkan ketergantungan pada peta.** Peta tidak dijadikan pusat interaksi. Informasi sebaran tetap tersedia melalui atribut wilayah sungai, daerah aliran sungai, kabupaten, dan provinsi pada tabel data, sehingga pengguna dapat menyaring data tanpa harus membaca peta.
3. **Menyatukan identitas visual.** Warna, tipografi, dan bentuk komponen disatukan dalam token desain agar tampilan konsisten dan sesuai identitas instansi.
4. **Menyediakan umpan balik pada setiap tindakan.** Setiap proses pemuatan data, pengunduhan berkas, dan kegagalan permintaan memiliki indikator yang jelas sehingga pengguna mengetahui status sistem.

### Arsitektur Sistem

Hasil redesain dibangun di atas arsitektur terpisah yang memisahkan lapisan presentasi, lapisan aplikasi, dan basis data. Susunan lapisan tersebut ditunjukkan pada gambar berikut.

![Arsitektur Sistem Portal SIH3 Hasil Redesain](gambar/arsitektur-sistem.png){#fig:arsitektur width=96%}

Lapisan presentasi dibangun menggunakan Next.js dengan App Router dan React, distilakan menggunakan Tailwind CSS, serta memanfaatkan komponen antarmuka yang mengikuti pola Shadcn UI. Lapisan aplikasi dibangun menggunakan Laravel dan menyediakan layanan data berbasis REST API pada awalan alamat `/api/v1`, ditambah panel administrasi berbasis Filament pada alamat `/admin`. Basis data menggunakan MySQL pada lingkungan produksi dan SQLite pada lingkungan pengujian.

Pemisahan lapisan memberikan dua keuntungan yang terasa pada proses pengembangan. Pertama, antarmuka dapat diuji secara terpisah dari layanan data dengan menggunakan data contoh yang sama, sehingga pengujian navigasi tidak bergantung pada kesiapan basis data produksi. Kedua, layanan ekspor data dapat diuji secara langsung melalui permintaan HTTP tanpa harus melalui antarmuka, sehingga kesalahan pada berkas hasil ekspor dapat diisolasi lebih cepat.

### Token Desain

Token desain disusun untuk menggantikan variasi warna yang sebelumnya muncul pada berbagai komponen. Nilai token didefinisikan satu kali pada berkas gaya global, kemudian diturunkan menjadi kelas utilitas. Token utama yang digunakan ditunjukkan pada tabel berikut.

: Token Desain Portal SIH3 Hasil Redesain {#tbl:token-desain}

| Peran | Nilai | Penggunaan |
|:---|:---|:---|
| Warna primer | `#14396A` | Bilah navigasi, tombol utama, judul bagian |
| Warna primer gelap | `#0E2A4E` | Keadaan hover dan sorotan aktif |
| Warna aksen | `#B7791F` | Tombol ajakan bertindak dan penanda perhatian |
| Warna halaman | `#F5F7FA` | Latar halaman |
| Warna permukaan | `#FFFFFF` | Latar kartu dan panel |
| Warna teks utama | `#1B2430` | Teks isi dan judul |
| Warna teks sekunder | `#5B6675` | Keterangan dan label |
| Warna garis | `#D5DBE3` | Batas kartu dan pemisah tabel |
| Status normal | `#10B981` | Penanda kondisi aman |
| Status waspada | `#F59E0B` | Penanda kondisi waspada |
| Status siaga dan awas | `#EF4444` | Penanda kondisi siaga dan awas |
| Radius sudut | 4 piksel | Seluruh kartu, tombol, dan kolom masukan |
| Tipografi | Public Sans | Seluruh teks antarmuka |

Pemilihan satu keluarga huruf dengan beragam ketebalan memudahkan pemeliharaan konsistensi. Warna status tidak digunakan sebagai satu-satunya pembeda, melainkan selalu disertai teks status, sehingga pengguna dengan gangguan penglihatan warna tetap dapat memahami kondisi pos.

### Halaman Beranda

Halaman beranda hasil redesain ditunjukkan pada gambar berikut.

![Halaman Beranda Portal SIH3 Hasil Redesain](gambar/after-beranda.png){#fig:after-beranda width=92%}

Halaman beranda disusun dengan urutan informasi sebagai berikut:

1. **Bilah navigasi** memuat lambang instansi, tautan menuju beranda, eksplorasi data, publikasi, walidata, analisis data, dan galeri, serta tombol ajakan bertindak menuju pusat unduh data.
2. **Bagian pembuka** memuat pernyataan singkat mengenai layanan portal dan kolom pencarian universal yang menerima nama pos, nama sungai, atau nama daerah aliran sungai.
3. **Ringkasan ketersediaan data** menampilkan jumlah pos pada setiap tipe data beserta jumlah instansi walidata yang mengelolanya.
4. **Kartu status pemantauan** menampilkan nilai terakhir, satuan, waktu rekaman, dan status siaga pada pos terpilih sehingga pengguna memperoleh gambaran kondisi terkini tanpa membuka halaman detail.
5. **Bagian bidang data** menjelaskan tiga kelompok data yang tersedia beserta contoh pos pada masing-masing kelompok.
6. **Bagian unduhan** mengarahkan pengguna pada pusat eksplorasi data dan menjelaskan format berkas yang tersedia.

Perubahan utama pada halaman ini adalah penghapusan peta sebagai elemen dominan. Ruang yang sebelumnya digunakan peta dialihkan untuk ringkasan status dan pencarian, sehingga pengguna dapat langsung menuju data yang dicari. Jumlah elemen gambar pada halaman beranda turun dari 653 menjadi 2, dan jumlah elemen halaman turun dari 1.324 menjadi 386.

### Pusat Eksplorasi Data

Halaman pusat eksplorasi data ditunjukkan pada gambar berikut.

![Halaman Pusat Eksplorasi Data Hasil Redesain](gambar/after-data-explorer.png){#fig:after-data-explorer width=92%}

Halaman ini menggantikan halaman akses data pada portal lama. Struktur halamannya terdiri atas judul dan ringkasan ketersediaan data, panel penyaringan, tabel data, dan bilah unduhan massal. Panel penyaringan menyediakan tab tipe data, kolom pencarian teks, serta penyaring wilayah sungai, daerah aliran sungai, dan instansi walidata. Tabel data memuat kolom pilihan, nomor, nama pos, jenis data, wilayah sungai dan daerah aliran sungai, instansi walidata, ketersediaan data, dan kolom tindakan.

Tiga keputusan perancangan pada halaman ini perlu dijelaskan. Pertama, setiap baris memiliki tombol unduh yang langsung menghasilkan berkas tanpa berpindah halaman. Kedua, pilihan pada kolom pertama memunculkan bilah unduhan massal di bagian bawah layar yang menampilkan jumlah pos terpilih beserta tombol unduh dan tombol pembatalan pilihan. Ketiga, kolom pencarian menerapkan penundaan tiga ratus milidetik sebelum permintaan dikirim, sehingga pengetikan cepat tidak menghasilkan lonjakan permintaan ke layanan data.

### Halaman Detail Pos

Halaman detail pos ditunjukkan pada gambar berikut.

![Halaman Detail Pos Hasil Redesain](gambar/after-detail-pos.png){#fig:after-detail-pos width=92%}

Halaman detail menyajikan identitas pos, koordinat, instansi walidata, status alat, ringkasan nilai terakhir, grafik tren pengukuran, dan tabel riwayat pengukuran. Pengguna dapat memilih rentang periode dan mengunduh data sesuai rentang tersebut. Grafik tren menampilkan ambang batas status sehingga pengguna dapat menilai apakah nilai pengukuran mendekati kondisi siaga. Apabila data pada rentang yang dipilih tidak tersedia, sistem menampilkan pemberitahuan bahwa data belum tersedia, bukan berkas kosong atau pesan kesalahan umum.

### Halaman Publikasi dan Direktori Walidata

Halaman publikasi dokumen ditunjukkan pada gambar berikut.

![Halaman Publikasi Dokumen Hasil Redesain](gambar/after-publikasi.png){#fig:after-publikasi width=92%}

Halaman publikasi menyediakan katalog dokumen regulasi, prosedur operasional standar, buletin, dan laporan. Setiap dokumen dilengkapi tombol pratinjau yang membuka berkas dalam jendela baca di dalam halaman serta tombol unduh. Penyediaan pratinjau bertujuan mengurangi risiko pengguna mengunduh berkas yang tidak sesuai sebelum memeriksa isinya.

Halaman direktori walidata ditunjukkan pada gambar berikut.

![Halaman Direktori Walidata Hasil Redesain](gambar/after-walidata.png){#fig:after-walidata width=92%}

Halaman direktori walidata menampilkan kartu setiap instansi mitra beserta ringkasan peran, jumlah pos yang dikelola, tautan layanan, nomor kontak, dan tombol komunikasi. Halaman ini menjawab kebutuhan pengguna yang tidak hanya memerlukan data, tetapi juga memerlukan jalur komunikasi resmi ketika data yang dicari belum tersedia di portal.

### Tampilan Responsif

Tampilan portal hasil redesain pada layar seluler ditunjukkan pada gambar berikut.

![Halaman Beranda Hasil Redesain pada Layar Seluler](gambar/after-mobile-beranda.png){#fig:after-mobile width=42%}

Pada layar seluler, bilah navigasi berubah menjadi menu ringkas, kartu ringkasan disusun satu kolom, dan tabel data berubah menjadi daftar kartu agar tidak memerlukan pengguliran horizontal. Pengujian pada lebar 390 piksel menunjukkan tidak terdapat pengguliran horizontal pada halaman pusat eksplorasi data, dengan lebar dokumen sama dengan lebar tampilan.

Tampilan pada layar tablet ditunjukkan pada gambar berikut.

![Halaman Pusat Eksplorasi Data Hasil Redesain pada Layar Tablet](gambar/after-tablet-data.png){#fig:after-tablet width=62%}

Pada lebar 768 piksel, tabel data tetap ditampilkan dalam bentuk tabel dengan kolom yang disederhanakan, sedangkan panel penyaringan disusun menjadi dua baris. Penyesuaian ini menjaga keterbacaan tanpa menghilangkan kemampuan penyaringan.

### Halaman Analisis Data

Halaman analisis data ditunjukkan pada gambar berikut.

![Halaman Analisis Data Portal SIH3 Hasil Redesain](gambar/after-analisis-data.png){#fig:after-analisis width=92%}

Halaman ini menyediakan perbandingan nilai ant pos dalam satu periode. Pengguna dapat memilih beberapa pos dan membandingkan tren pengukurannya dalam satu tampilan grafik. Halaman ini melengkapi pusat eksplorasi data: apabila halaman eksplorasi diarahkan pada penemuan dan pengunduhan data, halaman analisis diarahkan pada pembacaan pola antarpos.

### Tampilan Pusat Eksplorasi Data pada Layar Seluler

Tampilan pusat eksplorasi data pada layar seluler ditunjukkan pada gambar berikut.

![Halaman Pusat Eksplorasi Data Hasil Redesain pada Layar Seluler](gambar/after-mobile-data.png){#fig:after-mobile-data width=42%}

Pada layar seluler, tabel data berubah menjadi daftar kartu yang memuat nama pos, jenis data, wilayah, dan tombol unduh. Perubahan bentuk ini menghilangkan kebutuhan menggulir horizontal, sehingga pengguna dapat menyelesaikan tugas pengunduhan tanpa memperbesar tampilan.

## Implementasi

Implementasi antarmuka publik menggunakan Next.js dengan struktur direktori berbasis App Router. Halaman utama yang dibangun meliputi beranda, pusat eksplorasi data, detail pos, publikasi, direktori walidata, analisis data, galeri peta, galeri dokumen, serta tiga halaman bidang data, yaitu hidrologi, hidrometeorologi, dan hidrogeologi. Komponen antarmuka dipisahkan menjadi tiga kelompok, yaitu komponen dasar, komponen tata letak, dan komponen modul. Komponen dasar mencakup tombol, kartu, lencana, kolom masukan, kotak pilihan, dialog, menu turun, kerangka pemuatan, dan tabel. Komponen modul mencakup bilah telemetri, pencarian cepat, panel penyaringan, tabel eksplorasi data, bilah unduhan massal, grafik tren pos, dan penampil dokumen.

Sisi layanan data dibangun menggunakan Laravel dengan pengelolaan data melalui model, migrasi, dan penyemai data. Endpoint yang disediakan ditunjukkan pada tabel berikut.

: Endpoint Layanan Data Portal SIH3 {#tbl:endpoint}

| Metode | Endpoint | Fungsi |
|:---|:---|:---|
| GET | `/api/v1/telemetry/summary` | Ringkasan nilai terakhir seluruh pos aktif |
| GET | `/api/v1/pos` | Daftar pos dengan pencarian dan penyaringan |
| GET | `/api/v1/pos/{id}` | Detail satu pos beserta instansi walidata |
| GET | `/api/v1/pos/{id}/timeseries` | Rekaman deret waktu untuk grafik tren |
| GET | `/api/v1/pos/{id}/export` | Unduhan data satu pos dalam format xlsx atau csv |
| POST | `/api/v1/pos/batch-export` | Unduhan gabungan beberapa pos dalam satu berkas |
| GET | `/api/v1/dokumen` | Katalog dokumen publikasi |
| GET | `/api/v1/dokumen/{id}` | Detail satu dokumen |
| GET | `/api/v1/dokumen/{id}/download` | Unduhan berkas dokumen dan penambahan penghitung unduhan |
| GET | `/api/v1/walidata` | Direktori instansi walidata |
| GET | `/api/v1/walidata/{id}` | Profil satu instansi walidata beserta pos terkait |

Ekspor data menggunakan teknik penulisan bertahap sehingga berkas dikirim ketika data masih dibaca dari basis data. Pendekatan ini menjaga penggunaan memori peladen tetap terkendali ketika jumlah rekaman besar. Berkas hasil ekspor diberi nama yang memuat kode pos dan cap waktu, sehingga pengguna yang mengunduh beberapa berkas tidak kesulitan membedakannya.

Panel administrasi menyediakan pengelolaan pos, rekaman pengukuran, dokumen publikasi, dan profil walidata. Panel ini diakses melalui alamat `/admin` dengan autentikasi. Keberadaan panel tersebut mengurangi ketergantungan pada pengembang ketika staf perlu memperbarui data operasional.

## Pengujian Fungsional

Pengujian fungsional dilakukan pada dua tingkatan. Tingkatan pertama adalah pengujian otomatis terhadap layanan data menggunakan kerangka pengujian PHPUnit. Hasil pengujian ditunjukkan pada tabel berikut.

: Hasil Pengujian Otomatis Layanan Data {#tbl:uji-otomatis}

| Aspek pengujian | Jumlah berkas uji | Hasil |
|:---|:---:|:---|
| Hubungan antarmodel dan penyemai data | 2 | Lulus |
| Endpoint pos dan deret waktu | 1 | Lulus |
| Endpoint ekspor berkas tunggal dan massal | 1 | Lulus |
| Endpoint dokumen dan walidata | 1 | Lulus |
| Panel administrasi dan autentikasi | 1 | Lulus |
| Integrasi menyeluruh | 1 | Lulus |
| **Total** | **55 uji** | **55 lulus, 2.226 asersi** |

Tingkatan kedua adalah pengujian antarmuka. Pengujian dilakukan dengan membuka setiap halaman utama pada hasil build produksi dan memeriksa kode status respons serta ketersediaan konten. Hasilnya ditunjukkan pada tabel berikut.

: Hasil Pengujian Halaman Antarmuka {#tbl:uji-halaman}

| Halaman | Alamat | Kode status | Keterangan |
|:---|:---|:---:|:---|
| Beranda | `/` | 200 | Ringkasan dan status pemantauan tampil |
| Pusat eksplorasi data | `/data-explorer` | 200 | Tabel, penyaring, dan tombol unduh tampil |
| Detail pos | `/pos/7` | 200 | Grafik tren dan riwayat tampil |
| Publikasi | `/publikasi` | 200 | Katalog dokumen tampil |
| Direktori walidata | `/walidata` | 200 | Kartu instansi tampil |
| Analisis data | `/analisis-data` | 200 | Tabel perbandingan tampil |
| Galeri peta | `/galeri/peta` | 200 | Peta tematik tampil |
| Galeri dokumen | `/galeri/dokumen` | 200 | Katalog dokumen tampil |
| FloodRouting | `/floodrouting` | 200 | Informasi simulasi tampil |
| Bidang hidrologi | `/hidrologi` | 200 | Daftar pos hidrologi tampil |
| Bidang hidrometeorologi | `/hidrometeorologi` | 200 | Daftar pos hidrometeorologi tampil |
| Bidang hidrogeologi | `/hidrogeologi` | 200 | Daftar pos hidrogeologi tampil |

Pengujian ekspor berkas dilakukan dengan mengirim permintaan langsung ke endpoint ekspor. Hasilnya, permintaan format xlsx memperoleh respons dengan tipe konten lembar kerja Excel dan tajuk penamaan berkas yang memuat kode pos serta cap waktu, sedangkan permintaan format csv memperoleh respons bertipe teks terpisah koma dengan tajuk serupa. Pengujian juga memastikan bahwa pencarian dengan kata kunci nama pos mengembalikan satu hasil yang sesuai dan bahwa penyaringan berdasarkan tipe data mengembalikan jumlah pos yang benar.

Kompilasi antarmuka menggunakan proses build produksi berhasil tanpa kesalahan. Proses tersebut menghasilkan tujuh belas rute yang terdiri atas rute statis dan rute dinamis. Rute dinamis diperlukan pada halaman detail pos dan halaman bidang data karena isinya bergantung pada parameter permintaan.

## Evaluasi Heuristik

Evaluasi heuristik dilakukan dengan menelusuri kelima halaman utama pada kedua versi portal, kemudian mencatat temuan pada setiap prinsip kegunaan. Ringkasan hasil evaluasi ditunjukkan pada tabel berikut.

: Hasil Evaluasi Heuristik Portal SIH3 {#tbl:heuristik}

| No | Prinsip heuristik | Kondisi sebelum redesain | Kondisi setelah redesain | Status |
|:---:|:---|:---|:---|:---:|
| 1 | Visibilitas status sistem | Tidak ada indikator pemuatan saat peta dan data dirender; pengguna tidak mengetahui apakah halaman masih memuat | Tersedia kerangka pemuatan pada kartu dan tabel, indikator proses pada unduhan, serta pemberitahuan ketika data tidak tersedia | Terpenuhi |
| 2 | Kesesuaian dengan dunia nyata | Istilah teknis peta dan lapisan informasi bercampur dengan istilah hidrologi | Istilah diseragamkan, meliputi pos, tipe data, wilayah sungai, daerah aliran sungai, dan status siaga | Terpenuhi |
| 3 | Kendali dan kebebasan pengguna | Pengguna yang salah memilih titik pos harus kembali ke beranda untuk memulai lagi | Tersedia tombol kembali, pembatalan pilihan pada unduhan massal, dan penutupan dialog tanpa kehilangan konteks | Terpenuhi |
| 4 | Konsistensi dan standar | Warna, tombol, dan gaya kartu berbeda antarbagian | Seluruh halaman menggunakan token desain dan komponen yang sama | Terpenuhi |
| 5 | Pencegahan kesalahan | Tidak ada konfirmasi sebelum mengunduh berkas berukuran besar atau memilih seluruh pos | Tersedia jumlah pos terpilih sebelum unduhan massal dan pesan ketika rentang tanggal tidak berisi data | Sebagian terpenuhi |
| 6 | Pengenalan daripada mengingat | Pengguna harus mengingat nama pos dan letaknya pada peta | Nama pos, wilayah, dan instansi walidata ditampilkan bersamaan pada tabel serta dapat dicari | Terpenuhi |
| 7 | Fleksibilitas dan efisiensi | Hanya tersedia satu alur, yaitu melalui peta | Tersedia pencarian langsung, penyaring bertingkat, unduhan per baris, dan unduhan massal | Terpenuhi |
| 8 | Estetika dan desain minimalis | Peta, legenda, panel status, dan kartu informasi bersaing pada satu layar | Setiap halaman memiliki satu fokus utama dengan hierarki visual yang tegas | Terpenuhi |
| 9 | Pemulihan dari kesalahan | Pesan kesalahan bersifat umum dan tidak menjelaskan langkah perbaikan | Pesan kesalahan menyebutkan penyebab dan menyarankan tindakan, misalnya memuat ulang halaman | Sebagian terpenuhi |
| 10 | Bantuan dan dokumentasi | Tidak tersedia penjelasan mengenai arti status siaga dan format berkas | Tersedia keterangan status, penjelasan format unduhan, dan informasi kontak instansi walidata | Sebagian terpenuhi |

Berdasarkan tabel tersebut, tujuh dari sepuluh prinsip telah terpenuhi sepenuhnya, sedangkan tiga prinsip terpenuhi sebagian. Ketiga prinsip tersebut adalah pencegahan kesalahan, pemulihan dari kesalahan, dan bantuan dokumentasi. Pada prinsip pencegahan kesalahan, mekanisme konfirmasi sebelum unduhan massal berukuran besar belum tersedia. Pada prinsip pemulihan dari kesalahan, pesan kegagalan koneksi masih bergantung pada pesan bawaan dari lapisan pengambilan data. Pada prinsip bantuan dokumentasi, penjelasan mengenai tata cara memperoleh data untuk keperluan penelitian belum disediakan dalam bentuk halaman panduan tersendiri.

Temuan evaluasi heuristik tersebut sejalan dengan pola yang dilaporkan pada penelitian situs pemerintahan, yaitu permasalahan kegunaan umumnya terpusat pada kejelasan status sistem dan ketersediaan bantuan, sementara permasalahan struktur informasi dapat diperbaiki melalui penataan ulang arsitektur informasi [@Sivaji_2011]. Perbaikan pada prinsip pertama sampai kedelapan menunjukkan bahwa penghapusan peta sebagai pusat interaksi dan penggantiannya dengan tabel yang dapat disaring merupakan keputusan yang tepat untuk konteks tugas pengguna portal.

## Evaluasi Kinerja Halaman

Pengukuran kinerja dilakukan pada halaman beranda dan halaman akses data pada kedua versi portal. Hasil pengukuran ditunjukkan pada tabel berikut.

: Perbandingan Kinerja Halaman Sebelum dan Setelah Redesain {#tbl:kinerja}

| Indikator | Beranda lama | Beranda baru | Halaman data lama | Halaman data baru |
|:---|:---:|:---:|:---:|:---:|
| Jumlah permintaan jaringan | 92 | 44 | 92 | 53 |
| Ukuran dokumen HTML | 426 KB | 14 KB | 426 KB | 11 KB |
| Jumlah elemen halaman | 1.324 | 386 | 1.324 | 709 |
| Jumlah elemen gambar | 653 | 2 | 653 | 1 |
| Largest Contentful Paint | 524 ms | 132 ms | 488 ms | 280 ms |
| Cumulative Layout Shift | 0 | 0 | 0 | 0 |
| Time to First Byte | 337 ms | 13 ms | 216 ms | 3 ms |
| Durasi tugas panjang | 135 ms | 0 ms | 194 ms | 0 ms |

Data pada tabel tersebut menunjukkan penurunan yang konsisten pada seluruh indikator struktural. Jumlah elemen halaman pada beranda turun sekitar 71 persen, jumlah elemen gambar turun dari 653 menjadi 2, dan ukuran dokumen HTML turun dari 426 KB menjadi 14 KB. Pada halaman data, jumlah elemen halaman turun sekitar 46 persen dan ukuran dokumen turun menjadi 11 KB. Penurunan jumlah elemen gambar merupakan konsekuensi langsung dari penghapusan peta sebaran, karena peta tersebut memuat ratusan penanda dan lapisan grafis yang harus dirender oleh peramban.

Nilai Largest Contentful Paint pada beranda baru tercatat 132 milidetik, jauh di bawah ambang 2,5 detik yang dikategorikan baik. Nilai Cumulative Layout Shift pada kedua versi bernilai nol, yang menunjukkan bahwa tidak terdapat pergeseran tata letak tak terduga. Durasi tugas panjang pada portal baru tidak terdeteksi, sedangkan pada portal lama tercatat antara 135 sampai 250 milidetik. Tugas panjang pada utas utama berdampak pada responsivitas halaman karena peramban tidak dapat menanggapi masukan pengguna selama tugas tersebut berlangsung.

Perlu ditegaskan bahwa nilai Time to First Byte pada tabel tersebut tidak sepenuhnya dapat dibandingkan karena perbedaan lingkungan pengukuran. Portal lama diakses melalui jaringan publik, sedangkan portal baru diakses melalui peladen lokal. Meskipun demikian, indikator struktural seperti jumlah elemen, jumlah gambar, ukuran dokumen, dan durasi tugas panjang tidak dipengaruhi oleh jarak jaringan sehingga tetap dapat menjadi dasar perbandingan. Penurunan jumlah elemen dan gambar menjelaskan mengapa durasi tugas panjang pada portal baru tidak lagi terdeteksi.

## Evaluasi Aksesibilitas

Audit aksesibilitas dilakukan menggunakan perkakas pemeriksa otomatis terhadap kriteria keberhasilan WCAG tingkat A dan AA. Hasil audit pada portal hasil redesain ditunjukkan pada tabel berikut.

: Hasil Audit Aksesibilitas Portal Hasil Redesain {#tbl:aksesibilitas}

| Halaman | Pemeriksaan lulus | Pelanggaran berat | Pelanggaran sedang | Temuan utama |
|:---|:---:|:---:|:---:|:---|
| Beranda | 47 | 0 | 0 | Tidak ditemukan pelanggaran |
| Pusat eksplorasi data | 51 | 0 | 3 | Struktur penanda wilayah halaman ganda |
| Detail pos | 47 | 17 | 3 | Kontras warna pada 16 elemen dan satu elemen pilihan tanpa label |
| Publikasi | 45 | 0 | 4 | Urutan judul tidak berurutan dan penanda wilayah ganda |
| Direktori walidata | 44 | 4 | 3 | Kontras warna pada empat elemen |

Hasil tersebut menunjukkan bahwa halaman beranda telah memenuhi seluruh kriteria yang diuji. Pada halaman pusat eksplorasi data, publikasi, dan direktori walidata, temuan terbesar bersifat struktural, yaitu adanya lebih dari satu penanda wilayah utama pada satu halaman. Temuan tersebut tidak menghalangi penggunaan, tetapi menyulitkan pengguna pembaca layar dalam berpindah antarwilayah halaman. Pada halaman detail pos, ditemukan tujuh belas pelanggaran berat yang terdiri atas enam belas elemen dengan kontras warna di bawah ambang dan satu elemen pilihan tanpa label yang dapat dibaca pembaca layar.

Sebagai pembanding, audit pada portal lama menemukan satu pelanggaran serius berupa tautan tanpa nama yang dapat dibaca pembaca layar, dengan tiga puluh pemeriksaan lulus pada halaman beranda dan halaman data. Perbandingan jumlah pemeriksaan lulus menunjukkan bahwa halaman hasil redesain memiliki struktur yang lebih kaya untuk diuji, karena memuat tabel, formulir penyaringan, dialog, dan grafik yang tidak terdapat pada portal lama. Dengan demikian, jumlah pelanggaran pada portal baru tidak dapat langsung dibandingkan dengan portal lama tanpa memperhatikan perbedaan kompleksitas halaman.

Temuan pada halaman detail pos perlu diprioritaskan karena menyangkut keterbacaan angka pengukuran dan label pilihan periode. Kontras warna yang rendah pada teks berukuran kecil menyulitkan pengguna lanjut usia dan pengguna yang mengakses halaman di bawah cahaya terang. Perbaikan yang disarankan adalah menaikkan tingkat kegelapan warna teks sekunder pada latar berwarna terang, serta menambahkan label yang terhubung secara eksplisit pada elemen pilihan periode.

## Instrumen Pengukuran Kepuasan Pengguna

Pengukuran kepuasan pengguna dirancang menggunakan System Usability Scale. Instrumen terdiri atas sepuluh pernyataan yang dijawab dengan skala lima titik, mulai dari satu untuk sangat tidak setuju sampai lima untuk sangat setuju. Pernyataan tersebut disusun dengan urutan ganjil positif dan genap negatif agar responden membaca setiap butir dengan cermat [@Brooke_1996]. Instrumen yang digunakan ditunjukkan pada tabel berikut.

: Instrumen System Usability Scale {#tbl:sus}

| No | Pernyataan | Sifat |
|:---:|:---|:---:|
| 1 | Saya ingin sering menggunakan portal SIH3 ini | Positif |
| 2 | Saya merasa portal ini terlalu rumit padahal seharusnya sederhana | Negatif |
| 3 | Saya merasa portal ini mudah digunakan | Positif |
| 4 | Saya memerlukan bantuan teknis untuk dapat menggunakan portal ini | Negatif |
| 5 | Saya merasa fitur pada portal ini berjalan sesuai harapan | Positif |
| 6 | Saya merasa terlalu banyak ketidakkonsistenan pada portal ini | Negatif |
| 7 | Saya membayangkan sebagian besar orang dapat mempelajari portal ini dengan cepat | Positif |
| 8 | Saya merasa portal ini membingungkan saat digunakan | Negatif |
| 9 | Saya merasa percaya diri ketika menggunakan portal ini | Positif |
| 10 | Saya perlu mempelajari banyak hal sebelum dapat menggunakan portal ini | Negatif |

Skor setiap responden dihitung dengan rumus berikut. Untuk pernyataan bernomor ganjil, skor kontribusi adalah nilai jawaban dikurangi satu. Untuk pernyataan bernomor genap, skor kontribusi adalah lima dikurangi nilai jawaban. Jumlah seluruh skor kontribusi dikalikan 2,5 sehingga menghasilkan rentang nilai 0 sampai 100.

$$
SUS = 2{,}5 \times \left( \sum_{i \text{ ganjil}} (x_i - 1) + \sum_{i \text{ genap}} (5 - x_i) \right)
$$

Penafsiran skor mengikuti acuan yang membagi nilai menjadi tiga kategori penerimaan, yaitu tidak dapat diterima pada rentang di bawah 50, marginal pada rentang 50 sampai 70, dan dapat diterima pada rentang di atas 70, dengan nilai rata-rata acuan sebesar 68 [@Bangor_2008]. Selain nilai tunggal, hasil pengukuran sebaiknya disertai sebaran nilai antarresponden dan catatan kualitatif mengenai bagian antarmuka yang dianggap menyulitkan.

Rencana pelaksanaan pengukuran disusun sebagai berikut:

1. Responden terdiri atas tiga kelompok, yaitu mahasiswa yang menggunakan data hidrologi untuk penelitian, staf pengelola data, dan masyarakat umum yang mengakses portal untuk memperoleh informasi status siaga.
2. Setiap responden menyelesaikan tiga tugas, yaitu mencari pos dengan nama tertentu, mengunduh data satu pos, dan menemukan dokumen prosedur operasional standar.
3. Setelah menyelesaikan tugas, responden mengisi kuesioner dan menuliskan bagian yang dianggap paling menyulitkan.
4. Hasil diolah dengan menghitung skor setiap responden, rata-rata skor, dan sebaran nilai, kemudian ditafsirkan menggunakan acuan kategori penerimaan.
5. Catatan kualitatif dikelompokkan berdasarkan prinsip heuristik untuk menentukan prioritas perbaikan.

Tabel rekap hasil pengukuran disiapkan dalam format berikut dan akan diisi setelah pelaksanaan pengukuran.

: Rekap Hasil Pengukuran System Usability Scale {#tbl:rekap-sus}

| Kelompok responden | Jumlah responden | Skor rata-rata | Skor terendah | Skor tertinggi | Kategori |
|:---|:---:|:---:|:---:|:---:|:---|
| Mahasiswa | [isi] | [isi] | [isi] | [isi] | [isi] |
| Staf pengelola data | [isi] | [isi] | [isi] | [isi] | [isi] |
| Masyarakat umum | [isi] | [isi] | [isi] | [isi] | [isi] |
| **Keseluruhan** | [isi] | [isi] | [isi] | [isi] | [isi] |

## Pembahasan

Hasil evaluasi menunjukkan bahwa redesain berhasil menjawab tiga persoalan utama yang ditemukan pada kondisi awal. Persoalan pertama berkaitan dengan beban pemuatan halaman. Penghapusan peta sebagai pusat interaksi menurunkan jumlah elemen gambar pada beranda dari 653 menjadi 2, menurunkan jumlah elemen halaman dari 1.324 menjadi 386, dan menghilangkan durasi tugas panjang pada utas utama. Penurunan tersebut bukan sekadar perbaikan teknis, melainkan perubahan pendekatan perancangan: informasi sebaran spasial dipindahkan ke atribut tabel yang dapat disaring, sehingga pengguna memperoleh informasi yang setara tanpa harus merender ratusan penanda grafis.

Persoalan kedua berkaitan dengan panjangnya alur pengunduhan data. Pada portal lama, pengguna harus memahami peta, memilih titik, membuka halaman detail, dan mencari tombol unduh. Pada portal hasil redesain, pengunduhan dapat dilakukan langsung dari baris tabel, baik untuk satu pos maupun untuk beberapa pos sekaligus melalui bilah unduhan massal. Perubahan ini sesuai dengan prinsip fleksibilitas dan efisiensi penggunaan, karena menyediakan jalur singkat bagi pengguna yang telah mengetahui pos yang dicari, sekaligus tetap menyediakan jalur penelusuran bagi pengguna yang belum mengetahuinya.

Persoalan ketiga berkaitan dengan konsistensi visual dan keterbacaan pada layar kecil. Penyatuan token desain menghasilkan tampilan yang seragam pada seluruh halaman, sedangkan penyesuaian tata letak menghilangkan pengguliran horizontal pada lebar 390 piksel. Kesesuaian tampilan pada perangkat seluler penting karena sebagian pengguna mengakses portal melalui telepon pintar, terutama ketika memantau status siaga di lapangan.

Meskipun demikian, evaluasi juga menunjukkan tiga area yang belum sepenuhnya terpenuhi. Area pertama adalah pencegahan kesalahan pada unduhan massal. Ketika pengguna memilih banyak pos, sistem belum menampilkan perkiraan ukuran berkas atau jumlah rekaman yang akan diunduh, sehingga pengguna tidak dapat memperkirakan waktu tunggu. Area kedua adalah pemulihan dari kesalahan, karena pesan kegagalan koneksi masih bersifat umum. Area ketiga adalah bantuan dokumentasi, karena belum tersedia halaman panduan yang menjelaskan tata cara memperoleh data untuk keperluan penelitian, termasuk penjelasan mengenai satuan, periode pencatatan, dan kualitas data.

Temuan aksesibilitas pada halaman detail pos juga menjadi catatan penting. Kontras warna yang rendah pada enam belas elemen menunjukkan bahwa penggunaan warna teks sekunder perlu ditinjau ulang, khususnya pada teks berukuran kecil. Selain itu, elemen pilihan periode tanpa label menunjukkan bahwa komponen formulir perlu dilengkapi atribut yang menghubungkan label dengan elemen masukan. Perbaikan pada kedua hal tersebut bersifat terarah dan tidak menuntut perubahan struktur halaman.

Apabila dibandingkan dengan penelitian sejenis, hasil evaluasi ini memperlihatkan pola yang konsisten. Penelitian evaluasi situs pemerintahan menemukan bahwa permasalahan kegunaan lebih banyak berasal dari struktur informasi dan kejelasan status sistem daripada dari ketiadaan fitur [@Sivaji_2011]. Penelitian yang menggabungkan evaluasi heuristik dengan System Usability Scale juga menekankan bahwa perbaikan antarmuka perlu disertai pengukuran persepsi pengguna agar perbaikan tidak berhenti pada penilaian evaluator [@Maulana_2025]. Oleh karena itu, instrumen pengukuran kepuasan pengguna yang disusun dalam laporan ini perlu dilaksanakan agar hasil evaluasi menjadi utuh.

Keterbatasan evaluasi ini perlu dinyatakan secara terbuka. Evaluasi heuristik dilakukan oleh penulis bersama tim magang, sehingga temuan yang diperoleh dipengaruhi oleh pengalaman dan sudut pandang evaluator. Pengukuran kinerja dilakukan pada satu jenis peramban dan satu kondisi jaringan, sehingga nilai waktu absolut tidak dapat digeneralisasi. Audit aksesibilitas menggunakan perkakas otomatis yang hanya mampu memeriksa sebagian kriteria, sedangkan kriteria lain seperti kualitas teks alternatif dan kemudahan navigasi dengan papan ketik memerlukan pemeriksaan manual. Pengukuran kepuasan pengguna belum dilaksanakan sehingga kategori penerimaan pengguna belum dapat disimpulkan.

Dengan memperhatikan hasil dan keterbatasan tersebut, dapat dinyatakan bahwa redesain portal SIH3 telah meningkatkan kegunaan antarmuka secara terukur pada aspek struktur informasi, efisiensi alur pengunduhan, dan kinerja pemuatan halaman. Perbaikan lanjutan perlu diarahkan pada pencegahan kesalahan, kualitas pesan kesalahan, penyediaan panduan penggunaan, serta perbaikan kontras warna dan pelabelan elemen formulir.
