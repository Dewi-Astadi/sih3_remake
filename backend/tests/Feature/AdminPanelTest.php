<?php

namespace Tests\Feature;

use App\Models\Pengukuran;
use App\Models\Pos;
use App\Models\User;
use App\Models\Walidata;
use App\Services\PengukuranImportService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use DatabaseTransactions;

    protected User $admin;
    protected Pos $samplePos;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::firstOrCreate(
            ['email' => 'admin@bbwsserayuopak.id'],
            [
                'name' => 'Admin BBWS Serayu Opak',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->samplePos = Pos::first() ?? Pos::create([
            'kode_pos' => 'POS-TEST-001',
            'nama' => 'Pos Uji Admin',
            'tipe' => 'hidrologi',
            'jenis' => 'AWLR',
            'wilayah_sungai' => 'WS Progo Opak Serang',
            'das' => 'DAS Progo',
            'walidata_id' => Walidata::first()->id,
            'status_alat' => 'aktif',
        ]);
    }

    public function test_admin_login_page_returns_status_200(): void
    {
        $response = $this->get('/admin/login');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_is_redirected_to_login(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/admin/login');
    }

    public function test_authenticated_admin_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin');

        $response->assertStatus(200);
    }

    public function test_authenticated_admin_can_access_pos_resource(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/pos');

        $response->assertStatus(200);
    }

    public function test_authenticated_admin_can_access_dokumen_resource(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/dokumens');

        $response->assertStatus(200);
    }

    public function test_authenticated_admin_can_access_walidata_resource(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/walidatas');

        $response->assertStatus(200);
    }

    public function test_pengukuran_csv_import_service_with_pos_id(): void
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'csv_import_');
        $csvContent = implode("\n", [
            'recorded_at,nilai,satuan,status_siaga',
            '2026-09-21 08:00:00,2.35,m,waspada',
            '2026-09-21 09:00:00,3.15,m,siaga',
        ]);
        file_put_contents($tempPath, $csvContent);

        $service = new PengukuranImportService();
        $result = $service->import($tempPath, $this->samplePos->id);

        @unlink($tempPath);

        $this->assertEquals(2, $result['imported']);
        $this->assertEquals(0, $result['skipped']);
        $this->assertEmpty($result['errors']);

        $this->assertDatabaseHas('pengukuran', [
            'pos_id' => $this->samplePos->id,
            'recorded_at' => '2026-09-21 08:00:00',
            'nilai' => 2.35,
            'status_siaga' => 'waspada',
        ]);

        $this->assertDatabaseHas('pengukuran', [
            'pos_id' => $this->samplePos->id,
            'recorded_at' => '2026-09-21 09:00:00',
            'nilai' => 3.15,
            'status_siaga' => 'siaga',
        ]);
    }

    public function test_pengukuran_csv_import_service_with_kode_pos(): void
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'csv_import_');
        $csvContent = implode("\n", [
            'kode_pos,recorded_at,nilai,satuan,status_siaga',
            "{$this->samplePos->kode_pos},2026-09-21 10:00:00,1.85,m,normal",
        ]);
        file_put_contents($tempPath, $csvContent);

        $service = new PengukuranImportService();
        $result = $service->import($tempPath);

        @unlink($tempPath);

        $this->assertEquals(1, $result['imported']);
        $this->assertEquals(0, $result['skipped']);

        $this->assertDatabaseHas('pengukuran', [
            'pos_id' => $this->samplePos->id,
            'recorded_at' => '2026-09-21 10:00:00',
            'nilai' => 1.85,
        ]);
    }
}
