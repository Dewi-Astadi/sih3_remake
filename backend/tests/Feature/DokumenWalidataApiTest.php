<?php

namespace Tests\Feature;

use App\Models\Dokumen;
use App\Models\Pos;
use App\Models\Walidata;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class DokumenWalidataApiTest extends TestCase
{
    use DatabaseTransactions;

    protected Dokumen $sampleDokumen;
    protected Walidata $sampleWalidata;

    protected function setUp(): void
    {
        parent::setUp();

        // Cari atau buat sample walidata
        $this->sampleWalidata = Walidata::withCount('pos')->first() ?? Walidata::create([
            'nama' => 'Balai Wilayah Sungai Test',
            'singkatan' => 'BWS-TEST',
            'deskripsi' => 'Instansi pengelola SDA wilayah test',
            'logo_path' => '/images/walidata/test.png',
            'website_url' => 'https://example.com/walidata',
            'layanan_url' => 'https://example.com/layanan',
            'kontak_wa' => '6281234567890',
            'kontak_telp' => '(0274) 123456',
        ]);

        // Pastikan ada sample pos untuk walidata ini jika belum ada
        if (Pos::where('walidata_id', $this->sampleWalidata->id)->count() === 0) {
            Pos::create([
                'kode_pos' => 'TEST-WD-01',
                'nama' => 'Pos Uji Walidata',
                'tipe' => 'hidrologi',
                'jenis' => 'AWLR',
                'wilayah_sungai' => 'WS Progo Opak Serang',
                'das' => 'DAS Opak',
                'latitude' => -7.7956,
                'longitude' => 110.3695,
                'walidata_id' => $this->sampleWalidata->id,
                'status_alat' => 'aktif',
            ]);
        }

        // Cari atau buat sample dokumen
        $this->sampleDokumen = Dokumen::first() ?? Dokumen::create([
            'judul' => 'Pedoman Teknis Pengelolaan Sumber Daya Air Terpadu',
            'kategori' => 'regulasi',
            'tahun' => 2025,
            'nomor_dokumen' => 'SE-DIRJEN-01/2025',
            'file_path' => '/documents/regulasi/pedoman-sda-terpadu.pdf',
            'file_size' => '3.5 MB',
            'file_extension' => 'pdf',
            'download_count' => 10,
        ]);
    }

    /**
     * Uji GET /api/v1/dokumen mengembalikan daftar dokumen berpaginasi.
     */
    public function test_dokumen_index_returns_paginated_list(): void
    {
        $response = $this->getJson('/api/v1/dokumen');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'judul',
                        'kategori',
                        'tahun',
                        'nomor_dokumen',
                        'file_path',
                        'file_size',
                        'file_extension',
                        'download_count',
                    ],
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
                'links' => [
                    'first',
                    'last',
                ],
            ]);

        $this->assertTrue($response->json('success'));
        $this->assertGreaterThanOrEqual(1, $response->json('meta.total'));
    }

    /**
     * Uji filter kategori dokumen ('regulasi', 'sop', 'buletin', 'laporan').
     */
    public function test_dokumen_can_be_filtered_by_kategori(): void
    {
        Dokumen::create([
            'judul' => 'SOP Kalibrasi Sensor Telemetri AWLR',
            'kategori' => 'sop',
            'tahun' => 2024,
            'nomor_dokumen' => 'SOP/TEST/001',
            'file_path' => '/documents/sop/sop-kalibrasi.pdf',
            'file_size' => '1.2 MB',
            'file_extension' => 'pdf',
            'download_count' => 5,
        ]);

        $response = $this->getJson('/api/v1/dokumen?kategori=sop');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertEquals('sop', $item['kategori']);
        }
    }

    /**
     * Uji pencarian dokumen dengan parameter q (judul atau nomor dokumen).
     */
    public function test_dokumen_can_be_searched_by_query(): void
    {
        Dokumen::create([
            'judul' => 'Laporan Tahunan Neraca Air Wilayah Serayu',
            'kategori' => 'laporan',
            'tahun' => 2025,
            'nomor_dokumen' => 'LAP-NERACA-2025-01',
            'file_path' => '/documents/laporan/neraca-2025.pdf',
            'file_size' => '8.5 MB',
            'file_extension' => 'pdf',
            'download_count' => 2,
        ]);

        // Cari berdasarkan kata kunci judul
        $responseJudul = $this->getJson('/api/v1/dokumen?q=Neraca Air');
        $responseJudul->assertStatus(200);
        $dataJudul = $responseJudul->json('data');
        $this->assertNotEmpty($dataJudul);
        $this->assertStringContainsStringIgnoringCase('Neraca', $dataJudul[0]['judul']);

        // Cari berdasarkan nomor dokumen
        $responseNomor = $this->getJson('/api/v1/dokumen?q=LAP-NERACA-2025');
        $responseNomor->assertStatus(200);
        $dataNomor = $responseNomor->json('data');
        $this->assertNotEmpty($dataNomor);
        $this->assertEquals('LAP-NERACA-2025-01', $dataNomor[0]['nomor_dokumen']);
    }

    /**
     * Uji GET /api/v1/dokumen/{id} mengembalikan detail dokumen tunggal.
     */
    public function test_dokumen_show_returns_single_document(): void
    {
        $response = $this->getJson("/api/v1/dokumen/{$this->sampleDokumen->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $this->sampleDokumen->id,
                    'judul' => $this->sampleDokumen->judul,
                    'kategori' => $this->sampleDokumen->kategori,
                    'nomor_dokumen' => $this->sampleDokumen->nomor_dokumen,
                ],
            ]);
    }

    /**
     * Uji GET /api/v1/dokumen/{id} mengembalikan 404 jika tidak ditemukan.
     */
    public function test_dokumen_show_returns_404_when_not_found(): void
    {
        $response = $this->getJson('/api/v1/dokumen/999999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Uji GET /api/v1/dokumen/{id}/download melayani berkas dan menambah download_count sebanyak 1.
     */
    public function test_dokumen_download_increments_counter_and_returns_file(): void
    {
        $initialCount = $this->sampleDokumen->download_count;

        $response = $this->get("/api/v1/dokumen/{$this->sampleDokumen->id}/download");

        $response->assertStatus(200);
        $this->assertNotNull($response->headers->get('content-disposition'));
        $this->assertStringContainsString('attachment', strtolower($response->headers->get('content-disposition')));

        $this->sampleDokumen->refresh();
        $this->assertEquals($initialCount + 1, $this->sampleDokumen->download_count);
    }

    /**
     * Uji GET /api/v1/dokumen/{id}/download mengembalikan 404 untuk dokumen non-existent.
     */
    public function test_dokumen_download_returns_404_when_not_found(): void
    {
        $response = $this->getJson('/api/v1/dokumen/999999/download');

        $response->assertStatus(404);
    }

    /**
     * Uji GET /api/v1/walidata mengembalikan daftar mitra walidata beserta pos_count, kontak WA, website, dan telp.
     */
    public function test_walidata_index_returns_list_with_pos_count_and_contacts(): void
    {
        $response = $this->getJson('/api/v1/walidata');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'nama',
                        'singkatan',
                        'deskripsi',
                        'logo_path',
                        'website_url',
                        'layanan_url',
                        'kontak_wa',
                        'kontak_telp',
                        'pos_count',
                    ],
                ],
            ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data);

        // Pastikan atribut pos_count berupa angka/integer
        $item = $data[0];
        $this->assertArrayHasKey('pos_count', $item);
        $this->assertIsInt($item['pos_count']);
        $this->assertArrayHasKey('website_url', $item);
        $this->assertArrayHasKey('kontak_wa', $item);
        $this->assertArrayHasKey('kontak_telp', $item);
    }

    /**
     * Uji GET /api/v1/walidata/{id} mengembalikan detail walidata beserta daftar pos yang dinaungi.
     */
    public function test_walidata_show_returns_detail_with_pos_list(): void
    {
        $response = $this->getJson("/api/v1/walidata/{$this->sampleWalidata->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'nama',
                    'singkatan',
                    'pos_count',
                    'pos',
                ],
            ]);

        $this->assertEquals($this->sampleWalidata->id, $response->json('data.id'));
        $this->assertIsArray($response->json('data.pos'));
    }

    /**
     * Uji GET /api/v1/walidata/{id} mengembalikan 404 jika ID tidak ditemukan.
     */
    public function test_walidata_show_returns_404_when_not_found(): void
    {
        $response = $this->getJson('/api/v1/walidata/999999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }
}
