<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed default admin users for testing/auth
        User::firstOrCreate(
            ['email' => 'admin@sih3.pu.go.id'],
            [
                'name' => 'Administrator SIH3',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@bbwsserayuopak.id'],
            [
                'name' => 'Admin BBWS Serayu Opak',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Seed domain SIH3 data
        $this->call([
            WalidataSeeder::class,
            PosSeeder::class,
            PengukuranSeeder::class,
            DokumenSeeder::class,
        ]);
    }
}
