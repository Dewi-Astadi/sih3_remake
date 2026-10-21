<?php

namespace Tests\Feature;

use App\Models\Pengukuran;
use App\Models\Pos;
use App\Models\Walidata;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class PosApiTest extends TestCase
{
    use DatabaseTransactions;

    protected Pos $pos;
    protected Walidata $walidata;

    protected function setUp(): void
    {
        parent::setUp();

        // Cari atau gunakan pos & walidata yang sudah ada dari seeder
        $this->pos = Pos::with(['walidata', 'pengukuran'])->first() ?? $this->createSamplePos();
        $this->walidata = $this->pos->walidata;
    }

    private function createSamplePos(): Pos
    {
        $walidata = Walidata::create([
            'nama' => 'BBWS Serayu Opak Test',
            'singkatan' => 'BBWS-SO-TEST',
            'deskripsi' => 'Deskripsi Walidata Test',
        ]);

        $pos = Pos::create([
            'kode_pos' => 'TEST-POS-01',
            'nama' => 'Pos Uji Coba Kali Progo',
            'tipe' => 'hidrologi',
            'jenis' => 'AWLR',
            'wilayah_sungai' => 'WS Progo Opak Serang',
            'das' => 'DAS Progo',
            'sub_das' => 'Progo Hulu',
            'sungai' => 'Sungai Progo',
            'desa' => 'Desa Test',
            'kecamatan' => 'Kecamatan Test',
            'kabupaten' => 'Temanggung',
            'provinsi' => 'Jawa Tengah',
            'latitude' => -7.3486110,
            'longitude' => 110.2188890,
            'walidata_id' => $walidata->id,
            'status_alat' => 'aktif',
        ]);

        Pengukuran::create([
            'pos_id' => $pos->id,
            'recorded_at' => now()->subHours(2),
            'nilai' => 1.75,
            'satuan' => 'm',
            'status_siaga' => 'normal',
        ]);

        Pengukuran::create([
            'pos_id' => $pos->id,
            'recorded_at' => now(),
            'nilai' => 2.10,
            'satuan' => 'm',
            'status_siaga' => 'waspada',
        ]);

        return $pos;
    }

    public function test_telemetry_summary_returns_success(): void
    {
        $response = $this->getJson('/api/v1/telemetry/summary');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'kode_pos',
                        'nama',
                        'tipe',
                        'jenis',
                        'status_alat',
                        'satuan',
                        'nilai',
                        'status_siaga',
                        'recorded_at',
                    ],
                ],
            ]);

        // Verifikasi semua pos yang dikembalikan status alatnya 'aktif'
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertEquals('aktif', $item['status_alat']);
            $this->assertArrayHasKey('nilai', $item);
            $this->assertArrayHasKey('satuan', $item);
            $this->assertArrayHasKey('status_siaga', $item);
        }
    }

    public function test_pos_list_returns_paginated_data_with_meta(): void
    {
        $response = $this->getJson('/api/v1/pos');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
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
                        'walidata_id',
                    ],
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
            ]);
    }

    public function test_pos_list_can_be_filtered_by_tipe(): void
    {
        $response = $this->getJson('/api/v1/pos?tipe=' . $this->pos->tipe);

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertEquals($this->pos->tipe, $item['tipe']);
        }
    }

    public function test_pos_list_can_be_filtered_by_jenis(): void
    {
        $response = $this->getJson('/api/v1/pos?jenis=' . $this->pos->jenis);

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertEquals($this->pos->jenis, $item['jenis']);
        }
    }

    public function test_pos_list_can_be_filtered_by_das(): void
    {
        $response = $this->getJson('/api/v1/pos?das=' . urlencode($this->pos->das));

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertEquals($this->pos->das, $item['das']);
        }
    }

    public function test_pos_list_can_be_filtered_by_walidata_id(): void
    {
        $response = $this->getJson('/api/v1/pos?walidata_id=' . $this->walidata->id);

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertEquals($this->walidata->id, $item['walidata_id']);
        }
    }

    public function test_pos_list_can_be_searched_by_q(): void
    {
        $keyword = substr($this->pos->nama, 0, 6);
        $response = $this->getJson('/api/v1/pos?q=' . urlencode($keyword));

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);

        $ids = array_column($data, 'id');
        $this->assertContains($this->pos->id, $ids);
    }

    public function test_pos_detail_returns_metadata_and_walidata(): void
    {
        $response = $this->getJson('/api/v1/pos/' . $this->pos->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $this->pos->id,
                    'kode_pos' => $this->pos->kode_pos,
                    'nama' => $this->pos->nama,
                ],
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'kode_pos',
                    'nama',
                    'tipe',
                    'jenis',
                    'wilayah_sungai',
                    'das',
                    'latitude',
                    'longitude',
                    'status_alat',
                    'walidata' => [
                        'id',
                        'nama',
                        'singkatan',
                    ],
                ],
            ]);
    }

    public function test_pos_detail_returns_404_when_not_found(): void
    {
        $response = $this->getJson('/api/v1/pos/999999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_pos_timeseries_returns_measurements(): void
    {
        $response = $this->getJson('/api/v1/pos/' . $this->pos->id . '/timeseries');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
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
    }

    public function test_pos_timeseries_can_be_filtered_by_date_range(): void
    {
        $startDate = '2026-09-01';
        $endDate = '2026-09-15';

        $response = $this->getJson('/api/v1/pos/' . $this->pos->id . "/timeseries?start_date={$startDate}&end_date={$endDate}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $measurements = $response->json('data');
        foreach ($measurements as $item) {
            $recDate = substr($item['recorded_at'], 0, 10);
            $this->assertGreaterThanOrEqual($startDate, $recDate);
            $this->assertLessThanOrEqual($endDate, $recDate);
        }
    }

    public function test_pos_timeseries_returns_404_for_invalid_pos(): void
    {
        $response = $this->getJson('/api/v1/pos/999999/timeseries');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }
}
