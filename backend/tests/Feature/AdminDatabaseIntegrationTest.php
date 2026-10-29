<?php

namespace Tests\Feature;

use App\Models\Pos;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDatabaseIntegrationTest extends TestCase
{
    public function test_admin_can_login_against_database(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@bbwsserayuopak.id'],
            [
                'name' => 'Admin BBWS Serayu Opak',
                'password' => bcrypt('password'),
            ]
        );

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@bbwsserayuopak.id',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['message', 'token', 'user' => ['id', 'name', 'email']]);

        // Cek bahwa token tersimpan di database
        $this->assertNotNull($user->fresh()->api_token);
    }

    public function test_admin_can_create_pos_in_database(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@bbwsserayuopak.id'],
            [
                'name' => 'Admin BBWS Serayu Opak',
                'password' => bcrypt('password'),
            ]
        );

        $token = 'test_token_secret_12345';
        $user->api_token = $token;
        $user->save();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/pos', [
                'nama' => 'Pos Integrasi DB Test',
                'kode_pos' => 'TST-999',
                'tipe' => 'hidrologi',
                'jenis' => 'AWLR',
                'status_alat' => 'aktif',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('pos', [
            'kode_pos' => 'TST-999',
            'nama' => 'Pos Integrasi DB Test',
        ]);
    }
}

