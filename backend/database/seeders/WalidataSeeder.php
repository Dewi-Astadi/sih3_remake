<?php

namespace Database\Seeders;

use App\Models\Walidata;
use Illuminate\Database\Seeder;

class WalidataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $walidataList = [
            [
                'nama' => 'Balai Besar Wilayah Sungai Serayu Opak',
                'singkatan' => 'BBWS SO',
                'deskripsi' => 'Unit Pelaksana Teknis Kementerian Pekerjaan Umum dan Perumahan Rakyat yang bertugas mengelola sumber daya air di Wilayah Sungai Serayu Bogowonto dan Wilayah Sungai Progo Opak Serang.',
                'logo_path' => '/images/walidata/bbws-so.png',
                'website_url' => 'https://sda.pu.go.id/balai/bbwsserayuopak/',
                'layanan_url' => 'https://sda.pu.go.id/balai/bbwsserayuopak/layanan-publik',
                'kontak_wa' => '6281225901430',
                'kontak_telp' => '(0274) 489172',
            ],
            [
                'nama' => 'Dinas Pekerjaan Umum, Perumahan dan Energi Sumber Daya Mineral DIY',
                'singkatan' => 'DPUPESDM DIY',
                'deskripsi' => 'Perangkat Daerah Pemerintah Daerah D.I. Yogyakarta yang menyelenggarakan urusan pemerintahan di bidang pekerjaan umum, penataan ruang, perumahan rakyat, dan ESDM.',
                'logo_path' => '/images/walidata/dpupesdm-diy.png',
                'website_url' => 'https://dpupesdm.jogjaprov.go.id',
                'layanan_url' => 'https://dpupesdm.jogjaprov.go.id/layanan',
                'kontak_wa' => '6285200330000',
                'kontak_telp' => '(0274) 588219',
            ],
            [
                'nama' => 'Dinas Pengelolaan Sumber Daya Air dan Penataan Ruang Provinsi Jawa Tengah',
                'singkatan' => 'Pusdataru Jateng',
                'deskripsi' => 'Perangkat Daerah Pemerintah Provinsi Jawa Tengah yang melaksanakan urusan pemerintahan bidang pengelolaan sumber daya air dan penataan ruang.',
                'logo_path' => '/images/walidata/pusdataru-jateng.png',
                'website_url' => 'https://pusdataru.jatengprov.go.id',
                'layanan_url' => 'https://pusdataru.jatengprov.go.id/portal',
                'kontak_wa' => '6281390075705',
                'kontak_telp' => '(024) 7608201',
            ],
            [
                'nama' => 'BMKG Stasiun Klimatologi D.I. Yogyakarta',
                'singkatan' => 'BMKG Staklim DIY',
                'deskripsi' => 'Unit Pelaksana Teknis BMKG untuk pengamatan, pengumpulan, penyebaran, dan analisis data iklim serta kualitas udara di Daerah Istimewa Yogyakarta.',
                'logo_path' => '/images/walidata/bmkg.png',
                'website_url' => 'https://staklim-yogya.bmkg.go.id',
                'layanan_url' => 'https://staklim-yogya.bmkg.go.id/layanan-data',
                'kontak_wa' => '628112638113',
                'kontak_telp' => '(0274) 2880151',
            ],
            [
                'nama' => 'BMKG Stasiun Klimatologi Jawa Tengah',
                'singkatan' => 'BMKG Staklim Jateng',
                'deskripsi' => 'Unit Pelaksana Teknis BMKG untuk pengamatan, pengolahan, dan penyebaran informasi iklim dan cuaca di wilayah Provinsi Jawa Tengah.',
                'logo_path' => '/images/walidata/bmkg.png',
                'website_url' => 'https://www.iklimjateng.info',
                'layanan_url' => 'https://www.iklimjateng.info/layanan',
                'kontak_wa' => '6282223069425',
                'kontak_telp' => '(024) 7626966',
            ],
            [
                'nama' => 'Dinas Lingkungan Hidup dan Kehutanan D.I. Yogyakarta',
                'singkatan' => 'DLHK DIY',
                'deskripsi' => 'Perangkat Daerah Pemerintah Daerah D.I. Yogyakarta yang menyelenggarakan urusan lingkungan hidup dan kehutanan termasuk pemantauan mutu air sungai.',
                'logo_path' => '/images/walidata/dlhk-diy.png',
                'website_url' => 'https://dlhk.jogjaprov.go.id',
                'layanan_url' => 'https://dlhk.jogjaprov.go.id/pantau-air',
                'kontak_wa' => '6281329089589',
                'kontak_telp' => '(0274) 563014',
            ],
            [
                'nama' => 'Perum Jasa Tirta I',
                'singkatan' => 'PJT I',
                'deskripsi' => 'Badan Usaha Milik Negara yang ditugaskan mengelola pemanfaatan dan konservasi sumber daya air serta pengendalian daya rusak air.',
                'logo_path' => '/images/walidata/pjt1.png',
                'website_url' => 'https://jasatirta1.co.id',
                'layanan_url' => 'https://jasatirta1.co.id/layanan-informasi',
                'kontak_wa' => '628113331970',
                'kontak_telp' => '(0341) 551971',
            ],
        ];

        foreach ($walidataList as $data) {
            Walidata::updateOrCreate(
                ['singkatan' => $data['singkatan']],
                $data
            );
        }
    }
}
