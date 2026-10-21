<?php

namespace Tests\Feature;

use App\Models\Pengukuran;
use App\Models\Pos;
use App\Models\Walidata;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ExportTest extends TestCase
{
    use DatabaseTransactions;

    protected Pos $pos1;
    protected Pos $pos2;
    protected Walidata $walidata;

    protected function setUp(): void
    {
        parent::setUp();

        $this->walidata = Walidata::firstOrCreate(
            ['singkatan' => 'BBWS-SO'],
            [
                'nama' => 'Balai Besar Wilayah Sungai Serayu Opak',
                'deskripsi' => 'Pengelola Sumber Daya Air Wilayah Sungai Serayu Opak',
            ]
        );

        $this->pos1 = Pos::create([
            'kode_pos' => 'AWLR-TEST-001',
            'nama' => 'Pos Duga Air Kali Progo Test',
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

        $this->pos2 = Pos::create([
            'kode_pos' => 'ARR-TEST-002',
            'nama' => 'Pos Curah Hujan Sermo Test',
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

        // Tambah pengukuran untuk pos1
        Pengukuran::create([
            'pos_id' => $this->pos1->id,
            'recorded_at' => Carbon::parse('2026-09-10 07:00:00'),
            'nilai' => 1.85,
            'satuan' => 'm',
            'status_siaga' => 'normal',
        ]);

        Pengukuran::create([
            'pos_id' => $this->pos1->id,
            'recorded_at' => Carbon::parse('2026-09-15 08:00:00'),
            'nilai' => 2.45,
            'satuan' => 'm',
            'status_siaga' => 'waspada',
        ]);

        // Tambah pengukuran untuk pos2
        Pengukuran::create([
            'pos_id' => $this->pos2->id,
            'recorded_at' => Carbon::parse('2026-09-15 09:00:00'),
            'nilai' => 32.5,
            'satuan' => 'mm',
            'status_siaga' => 'siaga',
        ]);
    }

    /**
     * Uji ekspor single pos ke CSV mengembalikan header Content-Disposition,
     * Content-Type text/csv, dan format kolom yang benar.
     */
    public function test_export_single_pos_as_csv_success(): void
    {
        $response = $this->get("/api/v1/pos/{$this->pos1->id}/export?format=csv");

        $response->assertStatus(200);

        // Verifikasi Content-Type
        $contentType = $response->headers->get('Content-Type');
        $this->assertTrue(
            str_contains($contentType, 'text/csv') || str_contains($contentType, 'application/csv'),
            "Expected Content-Type to contain text/csv or application/csv, got {$contentType}"
        );

        // Verifikasi Content-Disposition attachment
        $disposition = $response->headers->get('Content-Disposition');
        $this->assertNotNull($disposition);
        $this->assertStringContainsString('attachment;', $disposition);
        $this->assertStringContainsString('.csv', $disposition);

        // Verifikasi isi CSV
        $content = $response->streamedContent();
        $this->assertNotEmpty($content);

        // Verifikasi baris header CSV
        $this->assertStringContainsString('Tanggal', $content);
        $this->assertStringContainsString('Waktu', $content);
        $this->assertStringContainsString('Kode Pos', $content);
        $this->assertStringContainsString('Nama Pos', $content);
        $this->assertStringContainsString('Tipe', $content);
        $this->assertStringContainsString('Jenis', $content);
        $this->assertStringContainsString('Nilai', $content);
        $this->assertStringContainsString('Satuan', $content);
        $this->assertStringContainsString('Status Siaga', $content);

        // Verifikasi baris data
        $this->assertStringContainsString($this->pos1->kode_pos, $content);
        $this->assertStringContainsString($this->pos1->nama, $content);
        $this->assertStringContainsString('2026-09-10', $content);
        $this->assertStringContainsString('07:00:00', $content);
        $this->assertStringContainsString('1.85', $content);
        $this->assertStringContainsString('normal', $content);
    }

    /**
     * Uji ekspor single pos ke format XLSX streaming OpenXML.
     */
    public function test_export_single_pos_as_xlsx_success(): void
    {
        $response = $this->get("/api/v1/pos/{$this->pos1->id}/export?format=xlsx");

        $response->assertStatus(200);

        // Verifikasi Content-Disposition
        $disposition = $response->headers->get('Content-Disposition');
        $this->assertNotNull($disposition);
        $this->assertStringContainsString('attachment;', $disposition);
        $this->assertStringContainsString('.xlsx', $disposition);

        // Verifikasi Content-Type OpenXML Spreadsheet
        $contentType = $response->headers->get('Content-Type');
        $this->assertTrue(
            str_contains($contentType, 'spreadsheetml.sheet') ||
            str_contains($contentType, 'application/vnd.openxmlformats') ||
            str_contains($contentType, 'application/octet-stream') ||
            str_contains($contentType, 'application/zip'),
            "Expected Content-Type to be Excel OpenXML, got {$contentType}"
        );

        $content = $response->streamedContent();
        $this->assertNotEmpty($content);
        // File OpenXML XLSX adalah file ZIP berawalan header 'PK\x03\x04'
        $this->assertStringStartsWith("PK\x03\x04", $content, "File XLSX harus merupakan format OpenXML ZIP yang valid");

        // Verifikasi integritas struktur berkas OpenXML Spreadsheet di dalam arsip ZIP
        $tempFile = tempnam(sys_get_temp_dir(), 'test_zip_') . '.xlsx';
        file_put_contents($tempFile, $content);
        $zip = new \ZipArchive();
        $this->assertTrue($zip->open($tempFile) === true, "File harus dapat dibuka sebagai ZipArchive");
        $this->assertNotFalse($zip->locateName('[Content_Types].xml'), "Harus memuat [Content_Types].xml");
        $this->assertNotFalse($zip->locateName('xl/workbook.xml'), "Harus memuat xl/workbook.xml");
        $this->assertNotFalse($zip->locateName('xl/worksheets/sheet1.xml'), "Harus memuat worksheet");
        $zip->close();
        @unlink($tempFile);
    }

    /**
     * Uji filter rentang tanggal (start_date dan end_date) pada single export.
     */
    public function test_export_single_pos_with_date_range_filter(): void
    {
        // Filter hanya untuk 2026-09-14 s.d. 2026-09-16 (harus hanya memuat rekaman 2026-09-15)
        $response = $this->get("/api/v1/pos/{$this->pos1->id}/export?format=csv&start_date=2026-09-14&end_date=2026-09-16");

        $response->assertStatus(200);
        $content = $response->streamedContent();

        $this->assertStringContainsString('2026-09-15', $content);
        $this->assertStringContainsString('2.45', $content);
        $this->assertStringNotContainsString('2026-09-10', $content);
        $this->assertStringNotContainsString('1.85', $content);
    }

    /**
     * Uji penanganan error bila Pos ID tidak ditemukan (404, bukan 500).
     */
    public function test_export_single_pos_returns_404_when_pos_not_found(): void
    {
        $response = $this->getJson('/api/v1/pos/999999/export');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Uji penanganan data kosong: bila tidak ada rekaman pengukuran di rentang tanggal,
     * mengembalikan status rapi dan pesan bersahabat (bukan error 500).
     */
    public function test_export_single_pos_returns_friendly_response_when_no_measurements(): void
    {
        $response = $this->getJson("/api/v1/pos/{$this->pos1->id}/export?format=csv&start_date=2099-01-01&end_date=2099-01-02");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
        $this->assertNotEmpty($response->json('message'));
    }

    /**
     * Uji batch export CSV menggabungkan seluruh pos yang dipilih.
     */
    public function test_batch_export_as_csv_success(): void
    {
        $payload = [
            'pos_ids' => [$this->pos1->id, $this->pos2->id],
            'format' => 'csv',
        ];

        $response = $this->post('/api/v1/pos/batch-export', $payload);

        $response->assertStatus(200);

        // Verifikasi Content-Disposition
        $disposition = $response->headers->get('Content-Disposition');
        $this->assertNotNull($disposition);
        $this->assertStringContainsString('attachment;', $disposition);
        $this->assertStringContainsString('.csv', $disposition);

        $content = $response->streamedContent();
        $this->assertNotEmpty($content);

        // Verifikasi baris header CSV
        $this->assertStringContainsString('Tanggal', $content);
        $this->assertStringContainsString('Kode Pos', $content);
        $this->assertStringContainsString('Nama Pos', $content);

        // Verifikasi data dari kedua pos ada di dalam satu berkas gabungan
        $this->assertStringContainsString($this->pos1->kode_pos, $content);
        $this->assertStringContainsString($this->pos1->nama, $content);
        $this->assertStringContainsString($this->pos2->kode_pos, $content);
        $this->assertStringContainsString($this->pos2->nama, $content);
        $this->assertStringContainsString('1.85', $content);
        $this->assertStringContainsString('32.5', $content);
    }

    /**
     * Uji batch export XLSX menggabungkan seluruh pos yang dipilih.
     */
    public function test_batch_export_as_xlsx_success(): void
    {
        $payload = [
            'pos_ids' => [$this->pos1->id, $this->pos2->id],
            'format' => 'xlsx',
        ];

        $response = $this->post('/api/v1/pos/batch-export', $payload);

        $response->assertStatus(200);

        // Verifikasi Content-Disposition
        $disposition = $response->headers->get('Content-Disposition');
        $this->assertNotNull($disposition);
        $this->assertStringContainsString('attachment;', $disposition);
        $this->assertStringContainsString('.xlsx', $disposition);

        $content = $response->streamedContent();
        $this->assertNotEmpty($content);
        $this->assertStringStartsWith("PK\x03\x04", $content, "File XLSX harus merupakan format OpenXML ZIP yang valid");

        // Verifikasi arsip zip dan komponen XML XLSX
        $tempFile = tempnam(sys_get_temp_dir(), 'test_batch_zip_') . '.xlsx';
        file_put_contents($tempFile, $content);
        $zip = new \ZipArchive();
        $this->assertTrue($zip->open($tempFile) === true, "File batch XLSX harus dapat dibuka sebagai ZipArchive");
        $this->assertNotFalse($zip->locateName('[Content_Types].xml'));
        $this->assertNotFalse($zip->locateName('xl/workbook.xml'));
        $this->assertNotFalse($zip->locateName('xl/worksheets/sheet1.xml'));
        $zip->close();
        @unlink($tempFile);
    }

    /**
     * Uji batch export dengan filter tanggal.
     */
    public function test_batch_export_with_date_range_filter(): void
    {
        $payload = [
            'pos_ids' => [$this->pos1->id, $this->pos2->id],
            'format' => 'csv',
            'start_date' => '2026-09-14',
            'end_date' => '2026-09-16',
        ];

        $response = $this->post('/api/v1/pos/batch-export', $payload);

        $response->assertStatus(200);
        $content = $response->streamedContent();

        // Rekaman 2026-09-15 harus ada untuk pos1 dan pos2
        $this->assertStringContainsString('2.45', $content);
        $this->assertStringContainsString('32.5', $content);
        // Rekaman 2026-09-10 tidak boleh ada
        $this->assertStringNotContainsString('2026-09-10', $content);
        $this->assertStringNotContainsString('1.85', $content);
    }

    /**
     * Uji validasi input pada batch export (pos_ids wajib diisi).
     */
    public function test_batch_export_validates_pos_ids(): void
    {
        $response = $this->postJson('/api/v1/pos/batch-export', [
            'pos_ids' => [],
            'format' => 'csv',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['pos_ids']);
    }

    /**
     * Uji penanganan data kosong pada batch export (rentang tanggal tidak memiliki data).
     */
    public function test_batch_export_returns_friendly_response_when_no_measurements(): void
    {
        $payload = [
            'pos_ids' => [$this->pos1->id, $this->pos2->id],
            'format' => 'csv',
            'start_date' => '2099-01-01',
            'end_date' => '2099-01-02',
        ];

        $response = $this->postJson('/api/v1/pos/batch-export', $payload);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
        $this->assertNotEmpty($response->json('message'));
    }
}
