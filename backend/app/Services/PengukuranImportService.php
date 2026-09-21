<?php

namespace App\Services;

use App\Models\Pengukuran;
use App\Models\Pos;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PengukuranImportService
{
    /**
     * Import measurement records from a CSV file.
     *
     * @param  string  $filePath  Absolute path to the CSV file
     * @param  int|null  $defaultPosId  Optional fallback Pos ID
     * @return array{imported: int, skipped: int, errors: array<string>}
     */
    public function import(string $filePath, ?int $defaultPosId = null): array
    {
        if (! file_exists($filePath) || ! is_readable($filePath)) {
            throw new \InvalidArgumentException("Berkas CSV tidak ditemukan atau tidak dapat dibaca: {$filePath}");
        }

        $handle = fopen($filePath, 'r');
        if (! $handle) {
            throw new \RuntimeException("Gagal membuka berkas CSV.");
        }

        // Cache pos lookup
        $posesById = Pos::all()->keyBy('id');
        $posesByCode = Pos::all()->keyBy(fn ($pos) => strtolower(trim($pos->kode_pos)));

        // Detect delimiter (comma or semicolon)
        $firstLine = fgets($handle);
        rewind($handle);

        $delimiter = ',';
        if ($firstLine !== false) {
            $commaCount = substr_count($firstLine, ',');
            $semicolonCount = substr_count($firstLine, ';');
            if ($semicolonCount > $commaCount) {
                $delimiter = ';';
            }
        }

        $headerRow = fgetcsv($handle, 0, $delimiter);
        if (! $headerRow) {
            fclose($handle);
            return ['imported' => 0, 'skipped' => 0, 'errors' => ['Berkas CSV kosong.']];
        }

        // Check if first line is a header
        $headerMap = [];
        $isHeader = false;
        foreach ($headerRow as $idx => $col) {
            $normalized = strtolower(trim($col));
            if (in_array($normalized, ['recorded_at', 'timestamp', 'tanggal_waktu', 'waktu', 'datetime', 'tanggal', 'nilai', 'value', 'kode_pos', 'pos_id'])) {
                $isHeader = true;
            }

            if (in_array($normalized, ['pos_id', 'id_pos'])) {
                $headerMap['pos_id'] = $idx;
            } elseif (in_array($normalized, ['kode_pos', 'kode', 'station_code'])) {
                $headerMap['kode_pos'] = $idx;
            } elseif (in_array($normalized, ['recorded_at', 'timestamp', 'tanggal_waktu', 'waktu', 'datetime', 'tanggal'])) {
                $headerMap['recorded_at'] = $idx;
            } elseif (in_array($normalized, ['nilai', 'value', 'tma', 'curah_hujan', 'ch', 'debit', 'suhu', 'kedalaman'])) {
                $headerMap['nilai'] = $idx;
            } elseif (in_array($normalized, ['satuan', 'unit'])) {
                $headerMap['satuan'] = $idx;
            } elseif (in_array($normalized, ['status_siaga', 'status', 'alert_level'])) {
                $headerMap['status_siaga'] = $idx;
            } elseif (in_array($normalized, ['parameter_tambahan', 'extra', 'json'])) {
                $headerMap['parameter_tambahan'] = $idx;
            }
        }

        $records = [];
        $imported = 0;
        $skipped = 0;
        $errors = [];
        $rowNumber = 1;

        if (! $isHeader) {
            // First row was actually data, rewind and parse as raw positional
            rewind($handle);
            $headerMap = [];
            $rowNumber = 0;
        }

        $batchSize = 500;

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $rowNumber++;

            // Skip completely blank rows
            if (empty(array_filter($row, fn ($val) => trim((string) $val) !== ''))) {
                continue;
            }

            try {
                $posId = null;
                $recordedAtRaw = null;
                $nilaiRaw = null;
                $satuan = null;
                $statusSiaga = 'normal';
                $paramTambahan = null;

                if (! empty($headerMap)) {
                    // Header mapped
                    if (isset($headerMap['pos_id']) && ! empty($row[$headerMap['pos_id']])) {
                        $posId = (int) trim($row[$headerMap['pos_id']]);
                    } elseif (isset($headerMap['kode_pos']) && ! empty($row[$headerMap['kode_pos']])) {
                        $code = strtolower(trim($row[$headerMap['kode_pos']]));
                        $posId = $posesByCode->get($code)?->id;
                    }

                    $recordedAtRaw = isset($headerMap['recorded_at']) ? trim($row[$headerMap['recorded_at']] ?? '') : null;
                    $nilaiRaw = isset($headerMap['nilai']) ? trim($row[$headerMap['nilai']] ?? '') : null;
                    $satuan = isset($headerMap['satuan']) ? trim($row[$headerMap['satuan']] ?? '') : null;
                    $statusSiaga = isset($headerMap['status_siaga']) ? strtolower(trim($row[$headerMap['status_siaga']] ?? 'normal')) : 'normal';
                    $paramTambahan = isset($headerMap['parameter_tambahan']) ? trim($row[$headerMap['parameter_tambahan']] ?? '') : null;
                } else {
                    // Positional
                    if ($defaultPosId !== null) {
                        $posId = $defaultPosId;
                        $recordedAtRaw = trim($row[0] ?? '');
                        $nilaiRaw = trim($row[1] ?? '');
                        $satuan = isset($row[2]) ? trim($row[2]) : null;
                        $statusSiaga = isset($row[3]) ? strtolower(trim($row[3])) : 'normal';
                    } else {
                        // Col 0 is pos id or code
                        $firstCol = trim($row[0] ?? '');
                        if (is_numeric($firstCol)) {
                            $posId = (int) $firstCol;
                        } else {
                            $code = strtolower($firstCol);
                            $posId = $posesByCode->get($code)?->id;
                        }
                        $recordedAtRaw = trim($row[1] ?? '');
                        $nilaiRaw = trim($row[2] ?? '');
                        $satuan = isset($row[3]) ? trim($row[3]) : null;
                        $statusSiaga = isset($row[4]) ? strtolower(trim($row[4])) : 'normal';
                    }
                }

                // Fallback to defaultPosId if posId still null
                if (! $posId && $defaultPosId) {
                    $posId = $defaultPosId;
                }

                if (! $posId || ! $posesById->has($posId)) {
                    $skipped++;
                    $errors[] = "Baris {$rowNumber}: Pos tidak valid atau tidak ditemukan.";
                    continue;
                }

                $pos = $posesById->get($posId);

                if (empty($recordedAtRaw) || $nilaiRaw === null || $nilaiRaw === '') {
                    $skipped++;
                    $errors[] = "Baris {$rowNumber}: Tanggal/waktu atau nilai kosong.";
                    continue;
                }

                // Parse timestamp
                $recordedAt = Carbon::parse($recordedAtRaw)->format('Y-m-d H:i:s');
                $nilai = (float) str_replace(',', '.', $nilaiRaw);

                // Default satuan if empty
                if (empty($satuan)) {
                    $satuan = match ($pos->jenis) {
                        'AWLR' => 'm',
                        'ARR' => 'mm',
                        'Kualitas Air' => 'indeks',
                        'Klimatologi' => '°C',
                        'MAT' => 'm',
                        default => 'nilai',
                    };
                }

                // Validate status siaga
                if (! in_array($statusSiaga, ['normal', 'waspada', 'siaga', 'awas'])) {
                    $statusSiaga = 'normal';
                }

                $paramJson = null;
                if (! empty($paramTambahan)) {
                    $decoded = json_decode($paramTambahan, true);
                    $paramJson = is_array($decoded) ? json_encode($decoded) : null;
                }

                $records[] = [
                    'pos_id' => $posId,
                    'recorded_at' => $recordedAt,
                    'nilai' => $nilai,
                    'satuan' => $satuan,
                    'status_siaga' => $statusSiaga,
                    'parameter_tambahan' => $paramJson,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                if (count($records) >= $batchSize) {
                    Pengukuran::insert($records);
                    $imported += count($records);
                    $records = [];
                }
            } catch (\Throwable $e) {
                $skipped++;
                $errors[] = "Baris {$rowNumber}: " . $e->getMessage();
            }
        }

        fclose($handle);

        if (! empty($records)) {
            Pengukuran::insert($records);
            $imported += count($records);
        }

        return [
            'imported' => $imported,
            'skipped' => $skipped,
            'errors' => array_slice($errors, 0, 10), // return first 10 errors for brevity
        ];
    }
}
