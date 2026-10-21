<?php

namespace Tests\Feature;

use App\Models\Dokumen;
use App\Models\Pengukuran;
use App\Models\Pos;
use App\Models\Walidata;
use Database\Seeders\DatabaseSeeder;
use Tests\TestCase;

class SeederDataTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Pastikan seeder telah dijalankan
        $this->seed(DatabaseSeeder::class);
    }

    /**
     * Test walidata seeder berhasil mengisi 7 instansi walidata.
     */
    public function test_walidata_seeder_populates_all_agencies(): void
    {
        $expectedSingkatan = [
            'BBWS SO',
            'DPUPESDM DIY',
            'Pusdataru Jateng',
            'BMKG Staklim DIY',
            'BMKG Staklim Jateng',
            'DLHK DIY',
            'PJT I',
        ];

        foreach ($expectedSingkatan as $singkatan) {
            $this->assertDatabaseHas('walidata', ['singkatan' => $singkatan]);
        }

        $bbws = Walidata::where('singkatan', 'BBWS SO')->first();
        $this->assertNotNull($bbws);
        $this->assertEquals('6281225901430', $bbws->kontak_wa);
        $this->assertStringContainsString('bbwsserayuopak', $bbws->website_url);

        $this->assertGreaterThanOrEqual(7, Walidata::count());
    }

    /**
     * Test pos seeder berhasil mengisi pos-pos riil SIH3 Serayu Opak.
     */
    public function test_pos_seeder_populates_required_stations(): void
    {
        $expectedPosCodes = [
            'AWLR-KRANGGAN',
            'AWLR-SERMO',
            'WQ-SB-PDAM',
            'WQ-MA-JUMPRIT',
            'WQ-SLINGA',
            'ARR-KALIBAWANG',
            'ARR-BOROBUDUR',
            'KLIM-BERBAH',
            'MAT-WATES',
        ];

        foreach ($expectedPosCodes as $kode) {
            $this->assertDatabaseHas('pos', ['kode_pos' => $kode]);
        }

        // Pastikan setiap pos memiliki relasi walidata yang valid
        $poses = Pos::with('walidata')->get();
        $this->assertGreaterThanOrEqual(9, $poses->count());

        foreach ($poses as $pos) {
            $this->assertNotNull($pos->walidata, "Pos {$pos->kode_pos} harus memiliki walidata.");
            $this->assertContains($pos->tipe, ['hidrologi', 'hidrometeorologi', 'hidrogeologi']);
            $this->assertContains($pos->jenis, ['AWLR', 'Kualitas Air', 'ARR', 'Klimatologi', 'MAT']);
            $this->assertEquals('aktif', $pos->status_alat);
        }
    }

    /**
     * Test pengukuran seeder memuat data timeseries 30 hari yang kaya (>100 per pos).
     */
    public function test_pengukuran_seeder_populates_rich_timeseries(): void
    {
        $poses = Pos::withCount('pengukuran')->get();
        $this->assertNotEmpty($poses);

        foreach ($poses as $pos) {
            // Setiap pos harus memiliki minimal 100 pengukuran deret waktu
            $this->assertGreaterThanOrEqual(
                100,
                $pos->pengukuran_count,
                "Pos {$pos->kode_pos} harus memiliki minimal 100 rekaman pengukuran."
            );
        }

        // Uji variasi status siaga
        $statuses = Pengukuran::distinct()->pluck('status_siaga')->toArray();
        $this->assertContains('normal', $statuses);
        $this->assertContains('waspada', $statuses);

        // Uji parameter kualitas air (pH, DO, BOD, COD)
        $posKualitasAir = Pos::where('jenis', 'Kualitas Air')->first();
        $this->assertNotNull($posKualitasAir);

        $pengukuranWQ = Pengukuran::where('pos_id', $posKualitasAir->id)->first();
        $this->assertNotNull($pengukuranWQ);
        $params = $pengukuranWQ->parameter_tambahan;
        $this->assertIsArray($params);
        $this->assertArrayHasKey('ph', $params);
        $this->assertArrayHasKey('do', $params);
        $this->assertArrayHasKey('bod', $params);
        $this->assertArrayHasKey('cod', $params);
    }

    /**
     * Test dokumen seeder mengisi dokumen publikasi regulasi, SOP, dan buletin.
     */
    public function test_dokumen_seeder_populates_publications(): void
    {
        $this->assertDatabaseHas('dokumen', [
            'nomor_dokumen' => 'PP No. 30 Tahun 2024',
            'kategori' => 'regulasi',
            'tahun' => 2024,
        ]);

        $this->assertDatabaseHas('dokumen', [
            'nomor_dokumen' => 'UU No. 17 Tahun 2019',
            'kategori' => 'regulasi',
            'tahun' => 2019,
        ]);

        $this->assertDatabaseHas('dokumen', [
            'nomor_dokumen' => 'SOP/SDA/SO/014-2023',
            'kategori' => 'sop',
        ]);

        $this->assertDatabaseHas('dokumen', [
            'nomor_dokumen' => 'SOP/SDA/SO/008-2023',
            'kategori' => 'sop',
        ]);

        $this->assertDatabaseHas('dokumen', [
            'nomor_dokumen' => 'SOP/SDA/SO/009-2023',
            'kategori' => 'sop',
        ]);

        $this->assertDatabaseHas('dokumen', [
            'nomor_dokumen' => 'BLT/BBWSSO/2026-01',
            'kategori' => 'buletin',
            'tahun' => 2026,
        ]);

        $this->assertGreaterThanOrEqual(6, Dokumen::count());
    }
}
