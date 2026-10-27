<?php

namespace Database\Seeders;

use App\Models\Pengukuran;
use App\Models\Pos;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PengukuranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $poses = Pos::all()->keyBy('kode_pos');
        if ($poses->isEmpty()) {
            return;
        }

        // Target: 30 hari ke belakang sampai 2026-09-21
        // Interval: per 6 jam (00:00, 06:00, 12:00, 18:00) -> ~121 records per pos
        $startDate = Carbon::create(2026, 8, 22, 0, 0, 0);
        $endDate = Carbon::create(2026, 9, 21, 18, 0, 0);

        // Hapus data lama jika ada
        DB::table('pengukuran')->truncate();

        $records = [];
        $batchSize = 250;

        foreach ($poses as $kode => $pos) {
            $currentDate = $startDate->copy();
            $step = 0;

            while ($currentDate->lessThanOrEqualTo($endDate)) {
                $step++;
                $hour = $currentDate->hour;
                $dayIndex = (int) $startDate->diffInDays($currentDate);

                $record = [
                    'pos_id' => $pos->id,
                    'recorded_at' => $currentDate->toDateTimeString(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                switch ($pos->jenis) {
                    case 'AWLR':
                        // TMA dalam meter
                        // Ada siklus debit naik pada hari ke 21-24 (12-15 Sept)
                        $baseTma = ($pos->kode_pos === 'AWLR-SERMO') ? 2.40 : 1.35;
                        $rainWave = 0;
                        if ($dayIndex >= 20 && $dayIndex <= 24) {
                            $rainWave = sin(($dayIndex - 20) / 4 * M_PI) * 1.8;
                        }
                        $dailyFlux = sin(($step % 4) / 4 * 2 * M_PI) * 0.15;
                        $randomNoise = (mt_rand(-10, 10) / 100);

                        $tma = round(max(0.4, $baseTma + $rainWave + $dailyFlux + $randomNoise), 2);

                        $status = 'normal';
                        if ($tma >= 3.0) {
                            $status = 'siaga';
                        } elseif ($tma >= 2.3) {
                            $status = 'waspada';
                        }

                        $record['nilai'] = $tma;
                        $record['satuan'] = 'm';
                        $record['status_siaga'] = $status;
                        $record['parameter_tambahan'] = json_encode([
                            'debit' => round(pow($tma, 1.8) * 14.2, 2),
                            'suhu_air' => round(24.5 + ($hour >= 12 ? 1.5 : 0.2), 1),
                            'kecepatan_aliran' => round(0.4 + ($tma * 0.35), 2),
                        ]);
                        break;

                    case 'ARR':
                        // Curah hujan dalam mm per interval 6 jam
                        // Ada beberapa hari hujan lebat di pertengahan dan akhir periode
                        $satuan = 'mm';
                        $hujan = 0.0;
                        $status = 'normal';

                        if (in_array($dayIndex, [5, 12, 21, 22, 28])) {
                            if ($hour == 12 || $hour == 18) {
                                if ($dayIndex == 21) {
                                    $hujan = round(mt_rand(550, 750) / 10, 1); // 55 - 75 mm (siaga)
                                    $status = 'siaga';
                                } elseif ($dayIndex == 22) {
                                    $hujan = round(mt_rand(350, 480) / 10, 1); // 35 - 48 mm (waspada)
                                    $status = 'waspada';
                                } else {
                                    $hujan = round(mt_rand(150, 280) / 10, 1); // 15 - 28 mm (normal-sedang)
                                    $status = 'normal';
                                }
                            }
                        } elseif (in_array($dayIndex, [3, 8, 15, 19, 25]) && $hour == 18) {
                            $hujan = round(mt_rand(40, 120) / 10, 1); // 4 - 12 mm
                        }

                        $record['nilai'] = $hujan;
                        $record['satuan'] = $satuan;
                        $record['status_siaga'] = $status;
                        $record['parameter_tambahan'] = json_encode([
                            'durasi_menit' => $hujan > 0 ? mt_rand(45, 180) : 0,
                            'intensitas' => $hujan > 50 ? 'sangat_lebat' : ($hujan > 20 ? 'lebat' : ($hujan > 5 ? 'sedang' : ($hujan > 0 ? 'ringan' : 'berawan'))),
                            'kelembapan_relatif' => $hujan > 0 ? mt_rand(88, 98) : mt_rand(65, 82),
                        ]);
                        break;

                    case 'Kualitas Air':
                        // Parameter Kualitas Air: pH, DO, BOD, COD
                        // Nilai utama: Indeks Pencemaran (IP) atau DO
                        $isJumprit = ($pos->kode_pos === 'WQ-MA-JUMPRIT');
                        $isSaluranBuang = ($pos->kode_pos === 'WQ-SB-PDAM');

                        if ($isJumprit) {
                            // Mata Air Pegunungan murni
                            $ph = round(7.2 + (mt_rand(-2, 2) / 10), 2);
                            $do = round(7.5 + (mt_rand(-3, 4) / 10), 2);
                            $bod = round(1.2 + (mt_rand(0, 5) / 10), 2);
                            $cod = round(4.5 + (mt_rand(0, 15) / 10), 2);
                            $tss = round(12.0 + mt_rand(-2, 4), 1);
                            $status = 'normal';
                            $nilaiUtama = round(0.45 + (mt_rand(0, 15) / 100), 2); // IP < 1.0 (Memenuhi Baku Mutu)
                        } elseif ($isSaluranBuang) {
                            // Saluran Buang PDAM / Urban
                            $ph = round(6.9 + (mt_rand(-3, 5) / 10), 2);
                            $do = round(5.2 + (mt_rand(-8, 5) / 10), 2);
                            $bod = round(4.2 + (mt_rand(5, 30) / 10), 2);
                            $cod = round(18.0 + (mt_rand(10, 120) / 10), 2);
                            $tss = round(35.0 + mt_rand(5, 25), 1);
                            $status = ($bod >= 6.0 || $cod >= 25.0) ? 'waspada' : 'normal';
                            $nilaiUtama = round(1.85 + (mt_rand(0, 90) / 100), 2); // IP Cemar Ringan
                        } else {
                            // Slinga Purbalingga
                            $ph = round(7.1 + (mt_rand(-2, 3) / 10), 2);
                            $do = round(6.0 + (mt_rand(-5, 6) / 10), 2);
                            $bod = round(2.8 + (mt_rand(0, 18) / 10), 2);
                            $cod = round(12.0 + (mt_rand(0, 60) / 10), 2);
                            $tss = round(24.0 + mt_rand(-3, 8), 1);
                            $status = 'normal';
                            $nilaiUtama = round(1.20 + (mt_rand(0, 40) / 100), 2);
                        }

                        $record['nilai'] = $nilaiUtama;
                        $record['satuan'] = 'indeks';
                        $record['status_siaga'] = $status;
                        $record['parameter_tambahan'] = json_encode([
                            'ph' => $ph,
                            'do' => $do,
                            'bod' => $bod,
                            'cod' => $cod,
                            'tss' => $tss,
                            'suhu' => round(24.0 + ($hour >= 12 ? 2.2 : 0.5), 1),
                        ]);
                        break;

                    case 'Klimatologi':
                        // Suhu Udara (°C)
                        $baseTemp = 26.5;
                        $tempFlux = ($hour == 12) ? 4.8 : (($hour == 18) ? 1.5 : -2.5);
                        $suhu = round($baseTemp + $tempFlux + (mt_rand(-8, 8) / 10), 1);
                        $kelembapan = round(max(50, 95 - (($suhu - 24) * 4) + mt_rand(-3, 3)));
                        $kecepatanAngin = round(mt_rand(4, 22) + ($hour == 12 ? 5 : 0), 1);

                        $record['nilai'] = $suhu;
                        $record['satuan'] = '°C';
                        $record['status_siaga'] = ($suhu >= 34.0 || $kecepatanAngin >= 30) ? 'waspada' : 'normal';
                        $record['parameter_tambahan'] = json_encode([
                            'suhu' => $suhu,
                            'kelembapan' => $kelembapan,
                            'kecepatan_angin' => $kecepatanAngin,
                            'arah_angin' => mt_rand(120, 240),
                            'radiasi_matahari' => ($hour == 12) ? mt_rand(650, 920) : (($hour == 6 || $hour == 18) ? mt_rand(80, 250) : 0),
                            'tekanan_udara' => round(1011.0 + (mt_rand(-20, 20) / 10), 1),
                            'curah_hujan' => (in_array($dayIndex, [21, 22]) && $hour == 18) ? 18.5 : 0.0,
                        ]);
                        break;

                    case 'MAT':
                        // Kedalaman Muka Air Tanah (meter di bawah permukaan tanah)
                        // Nilai realistis CAT Wates: 4.20 - 5.15 m
                        $fluktuasi = sin(($step % 12) / 12 * 2 * M_PI) * 0.18;
                        $kedalaman = round(4.55 + $fluktuasi + (mt_rand(-5, 5) / 100), 2);
                        $status = ($kedalaman >= 5.05) ? 'waspada' : 'normal';

                        $record['nilai'] = $kedalaman;
                        $record['satuan'] = 'm';
                        $record['status_siaga'] = $status;
                        $record['parameter_tambahan'] = json_encode([
                            'kedalaman_sumur' => 15.0,
                            'daya_hantar_listrik' => mt_rand(390, 435),
                            'suhu_air' => round(26.2 + (mt_rand(-3, 3) / 10), 1),
                            'ph' => 7.2,
                        ]);
                        break;
                }

                $records[] = $record;

                if (count($records) >= $batchSize) {
                    Pengukuran::insert($records);
                    $records = [];
                }

                $currentDate->addHours(6);
            }
        }

        if (!empty($records)) {
            Pengukuran::insert($records);
        }
    }
}
