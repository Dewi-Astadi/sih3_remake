<?php

namespace Tests\Feature;

use App\Models\Dokumen;
use App\Models\Pengukuran;
use App\Models\Pos;
use App\Models\Walidata;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ModelRelationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_models_and_relationships(): void
    {
        $walidata = Walidata::create([
            'nama' => 'Balai Besar Wilayah Sungai Serayu Opak',
            'singkatan' => 'BBWS SO',
            'deskripsi' => 'Instansi teknis pengelola SDA Serayu Opak',
            'website_url' => 'https://sda.pu.go.id/balai/bbwsserayuopak',
            'kontak_wa' => '6281122334455',
        ]);

        $this->assertDatabaseHas('walidata', ['singkatan' => 'BBWS SO']);

        $pos = $walidata->pos()->create([
            'kode_pos' => 'AWLR-KRANGGAN',
            'nama' => 'Pos Duga Air Kranggan',
            'tipe' => 'hidrologi',
            'jenis' => 'AWLR',
            'wilayah_sungai' => 'Progo Opak Serang',
            'das' => 'Progo',
            'sub_das' => 'Progo Hulu',
            'sungai' => 'Progo',
            'desa' => 'Kranggan',
            'kecamatan' => 'Temanggung',
            'kabupaten' => 'Temanggung',
            'provinsi' => 'Jawa Tengah',
            'latitude' => -7.3123456,
            'longitude' => 110.1987654,
            'status_alat' => 'aktif',
        ]);

        $this->assertDatabaseHas('pos', ['kode_pos' => 'AWLR-KRANGGAN']);
        $this->assertEquals($walidata->id, $pos->walidata->id);
        $this->assertCount(1, $walidata->fresh()->pos);

        $pengukuran = $pos->pengukuran()->create([
            'recorded_at' => now(),
            'nilai' => 2.45,
            'satuan' => 'm',
            'status_siaga' => 'normal',
            'parameter_tambahan' => ['debit' => 18.5, 'curah_hujan' => 0.0],
        ]);

        $this->assertDatabaseHas('pengukuran', ['pos_id' => $pos->id]);
        $this->assertEquals($pos->id, $pengukuran->pos->id);
        $this->assertIsArray($pengukuran->fresh()->parameter_tambahan);
        $this->assertEquals(18.5, $pengukuran->fresh()->parameter_tambahan['debit']);
        $this->assertInstanceOf(\DateTimeInterface::class, $pengukuran->fresh()->recorded_at);

        $dokumen = Dokumen::create([
            'judul' => 'SOP Pengelolaan Data Hidrologi',
            'kategori' => 'sop',
            'tahun' => 2024,
            'nomor_dokumen' => 'SOP/SDA/2024/01',
            'file_path' => 'dokumen/sop-hidrologi-2024.pdf',
            'file_size' => '2.4 MB',
            'file_extension' => 'pdf',
            'download_count' => 5,
        ]);

        $this->assertDatabaseHas('dokumen', ['nomor_dokumen' => 'SOP/SDA/2024/01']);
        $this->assertIsInt($dokumen->fresh()->tahun);
        $this->assertEquals(5, $dokumen->fresh()->download_count);
    }
}
