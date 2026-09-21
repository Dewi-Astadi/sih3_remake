<?php

namespace Tests\Feature;

use App\Models\Dokumen;
use App\Models\Pengukuran;
use App\Models\Pos;
use App\Models\User;
use App\Models\Walidata;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

/**
 * Pengujian Integrasi End-to-End untuk Seluruh Alur Sistem SIH3 Serayu Opak Redesign.
 *
 * Menguji skenario hulu-ke-hilir:
 * 1. Telemetri Beranda (GET /api/v1/telemetry/summary)
 * 2. Katalog Data Explorer (GET /api/v1/pos)
 * 3. Detail Pos & Timeseries (GET /api/v1/pos/{id} & GET /api/v1/pos/{id}/timeseries)
 * 4. Pengunduhan 1-Klik Excel (.xlsx) & CSV (.csv)
 * 5. Pengunduhan Batch Multi-Pos (POST /api/v1/pos/batch-export)
 * 6. Repositori Dokumen Publikasi & Increment Counter Download (GET /api/v1/dokumen & /download)
 * 7. Direktori Mitra Walidata & Hitungan Pos (GET /api/v1/walidata)
 * 8. Proteksi Autentikasi Panel Admin Filament (/admin & /admin/login)
 */
class EndToEndIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    protected Walidata $walidata;
    protected Pos $pos1;
    protected Pos $pos2;
    protected Dokumen $dokumen;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Siapkan walidata pengujian
        $this->walidata = Walidata::firstOrCreate(
            ['singkatan' => 'BBWS-SO-E2E'],
            [
                'nama' => 'Balai Besar Wilayah Sungai Serayu Opak (E2E Test)',
                'deskripsi' => 'Pengelola Sumber Daya Air Wilayah Sungai Serayu Opak dan Progo Opak Serang',
                'kontak_wa' => '628112345678',
                'kontak_telp' => '(0274) 895520',
                'website_url' => 'https://sda.pu.go.id/balai/bbwsserayuopak',
                'layanan_url' => 'https://sih3.bbwsserayuopak.id',
            ]
        );

        // Siapkan pos pemantauan 1 (AWLR)
        $this->pos1 = Pos::create([
            'kode_pos' => 'AWLR-E2E-001',
            'nama' => 'Pos Duga Air Kali Progo E2E',
            'tipe' => 'hidrologi',
            'jenis' => 'AWLR',
            'wilayah_sungai' => 'WS Progo Opak Serang',
            'das' => 'DAS Progo',
            'sub_das' => 'Progo Hilir',
            'sungai' => 'Kali Progo',
            'desa' => 'Sendangsari',
            'kecamatan' => 'Minggir',
            'kabupaten' => 'Sleman',
            'provinsi' => 'D.I. Yogyakarta',
            'latitude' => -7.734567,
            'longitude' => 110.254321,
            'walidata_id' => $this->walidata->id,
            'status_alat' => 'aktif',
        ]);

        // Siapkan pos pemantauan 2 (ARR)
        $this->pos2 = Pos::create([
            'kode_pos' => 'ARR-E2E-002',
            'nama' => 'Pos Curah Hujan Sermo E2E',
            'tipe' => 'hidrometeorologi',
            'jenis' => 'ARR',
            'wilayah_sungai' => 'WS Progo Opak Serang',
            'das' => 'DAS Serang',
            'sub_das' => 'Waduk Sermo',
            'sungai' => 'Sungai Ngrancah',
            'desa' => 'Hargowilis',
            'kecamatan' => 'Kokap',
            'kabupaten' => 'Kulon Progo',
            'provinsi' => 'D.I. Yogyakarta',
            'latitude' => -7.828100,
            'longitude' => 110.126400,
            'walidata_id' => $this->walidata->id,
            'status_alat' => 'aktif',
        ]);

        // Siapkan deret data pengukuran untuk pos1
        $baseTime = Carbon::now()->subDays(3);
        for ($i = 0; $i < 6; $i++) {
            Pengukuran::create([
                'pos_id' => $this->pos1->id,
                'recorded_at' => (clone $baseTime)->addHours($i * 4),
                'nilai' => 1.50 + ($i * 0.15),
                'satuan' => 'm',
                'status_siaga' => $i >= 4 ? 'waspada' : 'normal',
            ]);
        }

        // Siapkan deret data pengukuran untuk pos2
        for ($i = 0; $i < 6; $i++) {
            Pengukuran::create([
                'pos_id' => $this->pos2->id,
                'recorded_at' => (clone $baseTime)->addHours($i * 4),
                'nilai' => 10.0 + ($i * 5.0),
                'satuan' => 'mm',
                'status_siaga' => 'normal',
            ]);
        }

        // Siapkan dokumen pengujian
        $this->dokumen = Dokumen::create([
            'judul' => 'Pedoman Teknis SIH3 Terpadu E2E 2026',
            'kategori' => 'regulasi',
            'tahun' => 2026,
            'nomor_dokumen' => 'SE-DIRJEN-SDA-E2E/2026',
            'file_path' => '/documents/regulasi/pedoman-e2e-2026.pdf',
            'file_size' => '2.4 MB',
            'file_extension' => 'pdf',
            'download_count' => 5,
        ]);

        // Siapkan akun admin Filament
        $this->admin = User::firstOrCreate(
            ['email' => 'admin@bbwsserayuopak.id'],
            [
                'name' => 'Admin BBWS Serayu Opak',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
    }

    /**
     * 1. Uji endpoint telemetri beranda (GET /api/v1/telemetry/summary).
     * Memastikan mengembalikan pos-pos aktif lengkap dengan pengukuran terkini dan walidata.
     */
    public function test_telemetry_summary_flow(): void
    {
        $response = $this->getJson('/api/v1/telemetry/summary');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'count',
                'data' => [
                    '*' => [
                        'id',
                        'kode_pos',
                        'nama',
                        'tipe',
                        'jenis',
                        'wilayah_sungai',
                        'das',
                        'status_alat',
                        'walidata' => ['id', 'nama', 'singkatan'],
                        'nilai',
                        'satuan',
                        'status_siaga',
                        'recorded_at',
                        'latest_pengukuran',
                    ],
                ],
            ]);

        $this->assertTrue($response->json('success'));
        $this->assertGreaterThanOrEqual(2, $response->json('count'));

        // Uji filter jenis pada summary
        $responseArr = $this->getJson('/api/v1/telemetry/summary?jenis=ARR');
        $responseArr->assertStatus(200);
        $dataArr = $responseArr->json('data');
        foreach ($dataArr as $item) {
            $this->assertEquals('ARR', $item['jenis']);
        }
    }

    /**
     * 2. Uji katalog pos di Data Explorer (GET /api/v1/pos) dengan pencarian dan filter.
     */
    public function test_data_explorer_catalog_flow(): void
    {
        // Panggilan katalog standar dengan paginasi
        $response = $this->getJson('/api/v1/pos?per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'kode_pos',
                        'nama',
                        'tipe',
                        'jenis',
                        'das',
                        'kabupaten',
                        'provinsi',
                        'status_alat',
                        'walidata',
                        'latest_pengukuran',
                    ],
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
                'links',
            ]);

        // Uji pencarian q berdasarkan kode pos
        $responseSearch = $this->getJson('/api/v1/pos?q=AWLR-E2E-001');
        $responseSearch->assertStatus(200);
        $items = $responseSearch->json('data');
        $this->assertNotEmpty($items);
        $this->assertEquals('AWLR-E2E-001', $items[0]['kode_pos']);

        // Uji filter tipe
        $responseTipe = $this->getJson('/api/v1/pos?tipe=hidrometeorologi');
        $responseTipe->assertStatus(200);
        foreach ($responseTipe->json('data') as $item) {
            $this->assertEquals('hidrometeorologi', $item['tipe']);
        }

        // Uji filter DAS
        $responseDas = $this->getJson('/api/v1/pos?das=DAS Progo');
        $responseDas->assertStatus(200);
        foreach ($responseDas->json('data') as $item) {
            $this->assertEquals('DAS Progo', $item['das']);
        }
    }

    /**
     * 3. Uji detail pos dan riwayat pengukuran deret waktu (timeseries).
     */
    public function test_pos_detail_and_timeseries_flow(): void
    {
        // Detail pos tunggal
        $responseDetail = $this->getJson("/api/v1/pos/{$this->pos1->id}");
        $responseDetail->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $this->pos1->id,
                    'kode_pos' => 'AWLR-E2E-001',
                    'nama' => 'Pos Duga Air Kali Progo E2E',
                    'tipe' => 'hidrologi',
                    'jenis' => 'AWLR',
                ],
            ]);

        // Timeseries pos1
        $responseTimeseries = $this->getJson("/api/v1/pos/{$this->pos1->id}/timeseries");
        $responseTimeseries->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'pos' => ['id', 'kode_pos', 'nama', 'jenis', 'tipe'],
                'count',
                'data' => [
                    '*' => [
                        'id',
                        'pos_id',
                        'recorded_at',
                        'nilai',
                        'satuan',
                        'status_siaga',
                    ],
                ],
            ]);

        $this->assertEquals(6, $responseTimeseries->json('count'));

        // Uji timeseries 404 untuk pos tidak ditemukan
        $responseNotFound = $this->getJson('/api/v1/pos/999999/timeseries');
        $responseNotFound->assertStatus(404)
            ->assertJson(['success' => false]);
    }

    /**
     * 4. Uji pengunduhan 1-klik berkas Excel (.xlsx) dan CSV (.csv) untuk pos tunggal.
     */
    public function test_single_pos_1click_download_excel_and_csv(): void
    {
        // 4a. Unduh CSV
        $responseCsv = $this->get("/api/v1/pos/{$this->pos1->id}/export?format=csv");
        $responseCsv->assertStatus(200);
        $this->assertStringContainsString('text/csv', $responseCsv->headers->get('content-type'));

        $contentDispositionCsv = $responseCsv->headers->get('content-disposition');
        $this->assertNotNull($contentDispositionCsv);
        $this->assertStringContainsString('attachment;', $contentDispositionCsv);
        $this->assertStringContainsString('export-pos-AWLR-E2E-001', $contentDispositionCsv);
        $this->assertStringContainsString('.csv', $contentDispositionCsv);

        $csvContent = $responseCsv->streamedContent();
        $this->assertStringContainsString('Tanggal', $csvContent);
        $this->assertStringContainsString('Kode Pos', $csvContent);
        $this->assertStringContainsString('Nilai', $csvContent);
        $this->assertStringContainsString('AWLR-E2E-001', $csvContent);
        $this->assertStringContainsString('Pos Duga Air Kali Progo E2E', $csvContent);

        // 4b. Unduh XLSX
        $responseXlsx = $this->get("/api/v1/pos/{$this->pos1->id}/export?format=xlsx");
        $responseXlsx->assertStatus(200);
        $this->assertEquals(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            $responseXlsx->headers->get('content-type')
        );

        $contentDispositionXlsx = $responseXlsx->headers->get('content-disposition');
        $this->assertNotNull($contentDispositionXlsx);
        $this->assertStringContainsString('attachment;', $contentDispositionXlsx);
        $this->assertStringContainsString('export-pos-AWLR-E2E-001', $contentDispositionXlsx);
        $this->assertStringContainsString('.xlsx', $contentDispositionXlsx);

        $xlsxContent = $responseXlsx->streamedContent();
        $this->assertNotEmpty($xlsxContent);
        // Memastikan header berkas ZIP/OpenXML (PK..)
        $this->assertStringStartsWith("PK\x03\x04", $xlsxContent);
    }

    /**
     * 5. Uji pengunduhan batch multi-pos (POST /api/v1/pos/batch-export) format CSV & XLSX.
     */
    public function test_batch_export_multi_pos_flow(): void
    {
        // 5a. Batch CSV
        $responseBatchCsv = $this->postJson('/api/v1/pos/batch-export', [
            'pos_ids' => [$this->pos1->id, $this->pos2->id],
            'format' => 'csv',
        ]);

        $responseBatchCsv->assertStatus(200);
        $this->assertStringContainsString('text/csv', $responseBatchCsv->headers->get('content-type'));

        $dispCsv = $responseBatchCsv->headers->get('content-disposition');
        $this->assertStringContainsString('attachment;', $dispCsv);
        $this->assertStringContainsString('batch-export-pos-', $dispCsv);
        $this->assertStringContainsString('.csv', $dispCsv);

        $batchCsvContent = $responseBatchCsv->streamedContent();
        $this->assertStringContainsString('AWLR-E2E-001', $batchCsvContent);
        $this->assertStringContainsString('ARR-E2E-002', $batchCsvContent);

        // 5b. Batch XLSX
        $responseBatchXlsx = $this->postJson('/api/v1/pos/batch-export', [
            'pos_ids' => [$this->pos1->id, $this->pos2->id],
            'format' => 'xlsx',
        ]);

        $responseBatchXlsx->assertStatus(200);
        $this->assertEquals(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            $responseBatchXlsx->headers->get('content-type')
        );

        $dispXlsx = $responseBatchXlsx->headers->get('content-disposition');
        $this->assertStringContainsString('attachment;', $dispXlsx);
        $this->assertStringContainsString('batch-export-pos-', $dispXlsx);
        $this->assertStringContainsString('.xlsx', $dispXlsx);

        $batchXlsxContent = $responseBatchXlsx->streamedContent();
        $this->assertNotEmpty($batchXlsxContent);
        $this->assertStringStartsWith("PK\x03\x04", $batchXlsxContent);

        // 5c. Validasi pos_ids kosong mengembalikan 422 Unprocessable Content
        $responseInvalid = $this->postJson('/api/v1/pos/batch-export', [
            'pos_ids' => [],
            'format' => 'csv',
        ]);
        $responseInvalid->assertStatus(422)
            ->assertJsonValidationErrors(['pos_ids']);
    }

    /**
     * 6. Uji katalog repositori dokumen publikasi dan penambahan counter download atomik.
     */
    public function test_dokumen_katalog_and_download_flow(): void
    {
        // 6a. Ambil daftar dokumen publikasi
        $responseKatalog = $this->getJson('/api/v1/dokumen');
        $responseKatalog->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'judul',
                        'kategori',
                        'tahun',
                        'nomor_dokumen',
                        'download_count',
                    ],
                ],
                'meta',
            ]);

        // 6b. Unduh dokumen dan verifikasi penambahan counter download
        $initialCount = $this->dokumen->download_count;

        $responseDownload = $this->get("/api/v1/dokumen/{$this->dokumen->id}/download");
        $responseDownload->assertStatus(200);

        $disposition = $responseDownload->headers->get('content-disposition');
        $this->assertNotNull($disposition);
        $this->assertStringContainsString('attachment;', $disposition);

        $this->dokumen->refresh();
        $this->assertEquals($initialCount + 1, $this->dokumen->download_count);
    }

    /**
     * 7. Uji direktori mitra walidata dan relasi jumlah pos pemantauan.
     */
    public function test_walidata_directory_flow(): void
    {
        // Daftar direktori mitra walidata
        $responseList = $this->getJson('/api/v1/walidata');
        $responseList->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'nama',
                        'singkatan',
                        'deskripsi',
                        'kontak_wa',
                        'kontak_telp',
                        'website_url',
                        'pos_count',
                    ],
                ],
            ]);

        $walidataList = $responseList->json('data');
        $targetWalidata = collect($walidataList)->firstWhere('id', $this->walidata->id);
        $this->assertNotNull($targetWalidata);
        $this->assertGreaterThanOrEqual(2, $targetWalidata['pos_count']);

        // Detail walidata tunggal
        $responseSingle = $this->getJson("/api/v1/walidata/{$this->walidata->id}");
        $responseSingle->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $this->walidata->id,
                    'singkatan' => 'BBWS-SO-E2E',
                ],
            ]);
        $this->assertNotEmpty($responseSingle->json('data.pos'));
    }

    /**
     * 8. Uji proteksi keamanan dan autentikasi panel admin Filament.
     */
    public function test_filament_admin_protection_flow(): void
    {
        // Halaman login admin harus dapat diakses publik (status 200)
        $responseLogin = $this->get('/admin/login');
        $responseLogin->assertStatus(200);

        // Akses dashboard /admin tanpa login harus dialihkan (redirect 302) ke /admin/login
        $responseUnauthenticated = $this->get('/admin');
        $responseUnauthenticated->assertRedirect('/admin/login');

        // Akses dashboard /admin dengan login admin yang sah harus berhasil (status 200)
        $responseAuthenticated = $this->actingAs($this->admin)->get('/admin');
        $responseAuthenticated->assertStatus(200);
    }
}
