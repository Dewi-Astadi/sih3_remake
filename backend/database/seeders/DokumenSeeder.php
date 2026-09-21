<?php

namespace Database\Seeders;

use App\Models\Dokumen;
use Illuminate\Database\Seeder;

class DokumenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dokumenList = [
            [
                'judul' => 'PP RI Nomor 30 Tahun 2024 Tentang Pengelolaan Sumber Daya Air',
                'kategori' => 'regulasi',
                'tahun' => 2024,
                'nomor_dokumen' => 'PP No. 30 Tahun 2024',
                'file_path' => '/documents/regulasi/pp-30-2024-pengelolaan-sda.pdf',
                'file_size' => '2.4 MB',
                'file_extension' => 'pdf',
                'download_count' => 142,
            ],
            [
                'judul' => 'Undang-Undang RI No 17 Tahun 2019 Tentang Sumber Daya Air',
                'kategori' => 'regulasi',
                'tahun' => 2019,
                'nomor_dokumen' => 'UU No. 17 Tahun 2019',
                'file_path' => '/documents/regulasi/uu-17-2019-sumber-daya-air.pdf',
                'file_size' => '4.8 MB',
                'file_extension' => 'pdf',
                'download_count' => 520,
            ],
            [
                'judul' => 'Prosedur Dan Instruksi Analisis Status Mutu Air',
                'kategori' => 'sop',
                'tahun' => 2023,
                'nomor_dokumen' => 'SOP/SDA/SO/014-2023',
                'file_path' => '/documents/sop/sop-analisis-mutu-air.pdf',
                'file_size' => '1.1 MB',
                'file_extension' => 'pdf',
                'download_count' => 98,
            ],
            [
                'judul' => 'Prosedur Dan Instruksi Kerja Perhitungan Debit Banjir',
                'kategori' => 'sop',
                'tahun' => 2023,
                'nomor_dokumen' => 'SOP/SDA/SO/008-2023',
                'file_path' => '/documents/sop/sop-perhitungan-debit-banjir.pdf',
                'file_size' => '1.8 MB',
                'file_extension' => 'pdf',
                'download_count' => 115,
            ],
            [
                'judul' => 'Prosedur Dan Instruksi Kerja Perhitungan Debit Andalan',
                'kategori' => 'sop',
                'tahun' => 2023,
                'nomor_dokumen' => 'SOP/SDA/SO/009-2023',
                'file_path' => '/documents/sop/sop-perhitungan-debit-andalan.pdf',
                'file_size' => '1.5 MB',
                'file_extension' => 'pdf',
                'download_count' => 87,
            ],
            [
                'judul' => 'Buletin Hidrologi Wilayah Sungai Serayu Opak',
                'kategori' => 'buletin',
                'tahun' => 2026,
                'nomor_dokumen' => 'BLT/BBWSSO/2026-01',
                'file_path' => '/documents/buletin/buletin-hidrologi-serayu-opak-2026.pdf',
                'file_size' => '6.2 MB',
                'file_extension' => 'pdf',
                'download_count' => 64,
            ],
        ];

        foreach ($dokumenList as $data) {
            Dokumen::updateOrCreate(
                ['nomor_dokumen' => $data['nomor_dokumen']],
                $data
            );
        }
    }
}
