# PENUTUP

## Kesimpulan

Berdasarkan hasil perancangan ulang dan evaluasi antarmuka serta pengalaman pengguna pada portal SIH3 BBWS Serayu Opak, dapat disimpulkan sebagai berikut:

1. Kondisi antarmuka portal SIH3 sebelum redesain menghadapi tiga persoalan utama. Pertama, beban pemuatan halaman yang besar karena peta sebaran menempatkan 653 elemen gambar dan 1.324 elemen halaman pada satu tampilan, dengan durasi tugas panjang mencapai 135 sampai 250 milidetik. Kedua, alur pengunduhan data yang berlapis sehingga pengguna harus melalui peta, halaman detail, dan pencarian tombol unduh. Ketiga, ketidakkonsistenan visual dan tampilan yang kurang nyaman pada layar seluler. Audit aksesibilitas juga menemukan tautan tanpa nama yang dapat dibaca oleh pembaca layar.

2. Rancangan hasil redesain disusun berdasarkan empat prinsip, yaitu mengutamakan tugas utama pengguna, menghilangkan ketergantungan pada peta, menyatukan identitas visual, dan menyediakan umpan balik pada setiap tindakan. Rancangan tersebut diwujudkan dalam bentuk token desain, arsitektur terpisah antara antarmuka publik dan layanan data, serta lima halaman utama yang terdiri atas beranda, pusat eksplorasi data, detail pos, publikasi dokumen, dan direktori walidata. Pusat eksplorasi data menjadi pengganti peta sebagai titik awal pencarian, dilengkapi penyaring bertingkat, unduhan per baris, dan unduhan massal.

3. Hasil evaluasi menunjukkan perbaikan yang terukur. Jumlah elemen halaman pada beranda turun dari 1.324 menjadi 386, jumlah elemen gambar turun dari 653 menjadi 2, dan ukuran dokumen HTML turun dari 426 KB menjadi 14 KB. Nilai Largest Contentful Paint pada beranda baru tercatat 132 milidetik dengan Cumulative Layout Shift bernilai nol, dan durasi tugas panjang tidak lagi terdeteksi. Pada evaluasi heuristik, tujuh dari sepuluh prinsip kegunaan terpenuhi sepenuhnya, sedangkan tiga prinsip terpenuhi sebagian. Pengujian fungsional menunjukkan seluruh 55 pengujian otomatis lulus dengan 2.226 asersi, dan seluruh dua belas halaman utama memberikan kode status respons yang benar.

4. Area yang masih memerlukan perbaikan meliputi pencegahan kesalahan pada unduhan massal, kualitas pesan kegagalan koneksi, ketersediaan panduan penggunaan, kontras warna pada halaman detail pos, serta pelabelan elemen pilihan periode. Selain itu, pengukuran kepuasan pengguna dengan System Usability Scale telah disiapkan instrumennya, tetapi belum dilaksanakan, sehingga kategori penerimaan pengguna belum dapat disimpulkan.

## Saran

Berdasarkan hasil evaluasi dan keterbatasan yang ditemukan, disarankan beberapa langkah berikut:

1. **Melaksanakan pengukuran kepuasan pengguna.** Instrumen System Usability Scale yang telah disusun sebaiknya digunakan pada kelompok responden yang mewakili pengguna portal, meliputi mahasiswa, staf pengelola data, dan masyarakat umum. Hasil pengukuran perlu dilengkapi catatan kualitatif agar prioritas perbaikan dapat ditetapkan berdasarkan pengalaman pengguna sebenarnya, bukan hanya penilaian evaluator.

2. **Memperbaiki kontras warna dan pelabelan elemen formulir.** Warna teks sekunder pada halaman detail pos perlu dinaikkan tingkat kontrasnya hingga memenuhi ambang yang ditetapkan pedoman aksesibilitas. Elemen pilihan periode pengukuran perlu dilengkapi label yang terhubung secara eksplisit agar dapat dibaca oleh pembaca layar.

3. **Menambahkan mekanisme pencegahan kesalahan pada unduhan massal.** Sebelum berkas gabungan dibuat, sistem sebaiknya menampilkan perkiraan jumlah rekaman dan ukuran berkas sehingga pengguna dapat memperkirakan waktu tunggu dan membatalkan pilihan apabila tidak sesuai kebutuhan.

4. **Menyediakan halaman panduan penggunaan data.** Panduan tersebut sebaiknya memuat penjelasan mengenai arti status siaga, satuan pengukuran, periode pencatatan, tata cara mengutip data untuk keperluan penelitian, serta langkah yang perlu dilakukan apabila data pada periode tertentu tidak tersedia.

5. **Memperluas cakupan pengujian.** Pengujian kinerja sebaiknya dilakukan pada beberapa jenis peramban dan kondisi jaringan, termasuk jaringan seluler lambat, agar hasilnya menggambarkan pengalaman pengguna secara lebih menyeluruh. Pengujian aksesibilitas juga perlu dilengkapi pemeriksaan manual terhadap navigasi papan ketik dan kualitas teks alternatif.

6. **Menyusun dokumentasi komponen antarmuka.** Dokumentasi tersebut sebaiknya memuat daftar token desain, komponen, dan contoh penggunaan sehingga penambahan halaman baru tetap konsisten dengan tampilan yang telah dievaluasi.

7. **Menjaga kesinambungan pemantauan kualitas.** Setelah portal digunakan secara luas, pengukuran kinerja dan audit aksesibilitas sebaiknya dilakukan secara berkala agar penurunan kualitas dapat diketahui lebih awal, misalnya ketika jumlah data atau jumlah komponen bertambah.
