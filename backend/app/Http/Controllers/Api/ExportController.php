<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengukuran;
use App\Models\Pos;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Rap2hpoutre\FastExcel\FastExcel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Header kolom standar untuk berkas ekspor data rekaman SIH3.
     */
    protected const EXPORT_HEADERS = [
        'Tanggal',
        'Waktu',
        'Kode Pos',
        'Nama Pos',
        'Tipe',
        'Jenis',
        'Nilai',
        'Satuan',
        'Status Siaga',
    ];

    /**
     * Ekspor data rekaman deret waktu untuk satu pos pemantauan (single pos export).
     * Format: CSV atau XLSX.
     * Filter opsional: start_date, end_date.
     */
    public function exportSingle(string|int $id, Request $request): StreamedResponse|JsonResponse
    {
        $pos = Pos::find($id);

        if (!$pos) {
            return response()->json([
                'success' => false,
                'message' => 'Pos pemantauan tidak ditemukan.',
            ], 404);
        }

        $query = Pengukuran::with('pos')
            ->where('pos_id', $pos->id)
            ->orderBy('recorded_at', 'asc');

        if ($request->filled('start_date')) {
            $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
            $query->where('recorded_at', '>=', $startDate);
        }

        if ($request->filled('end_date')) {
            $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
            $query->where('recorded_at', '<=', $endDate);
        }

        if ($query->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada data pengukuran untuk rentang tanggal yang dipilih.',
            ], 404);
        }

        $format = strtolower($request->query('format', 'csv'));
        $sanitizedKode = preg_replace('/[^A-Za-z0-9_\-]/', '_', $pos->kode_pos);
        $timestamp = now()->format('Ymd_His');

        if ($format === 'xlsx') {
            $filename = "export-pos-{$sanitizedKode}-{$timestamp}.xlsx";
            return $this->streamXlsx($query, $filename);
        }

        // Default CSV
        $filename = "export-pos-{$sanitizedKode}-{$timestamp}.csv";
        return $this->streamCsv($query, $filename);
    }

    /**
     * Ekspor data gabungan untuk banyak pos pemantauan (batch export).
     * Body JSON: { pos_ids: [...], format: "csv"|"xlsx", start_date: "...", end_date: "..." }
     */
    public function exportBatch(Request $request): StreamedResponse|JsonResponse
    {
        $validated = $request->validate([
            'pos_ids' => 'required|array|min:1',
            'pos_ids.*' => 'integer|exists:pos,id',
            'format' => 'nullable|string|in:csv,xlsx',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $query = Pengukuran::with('pos')
            ->whereIn('pos_id', $validated['pos_ids'])
            ->orderBy('recorded_at', 'asc')
            ->orderBy('pos_id', 'asc');

        if (!empty($validated['start_date'])) {
            $startDate = Carbon::parse($validated['start_date'])->startOfDay();
            $query->where('recorded_at', '>=', $startDate);
        }

        if (!empty($validated['end_date'])) {
            $endDate = Carbon::parse($validated['end_date'])->endOfDay();
            $query->where('recorded_at', '<=', $endDate);
        }

        if ($query->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada data pengukuran untuk pos dan rentang tanggal yang dipilih.',
            ], 404);
        }

        $format = strtolower($validated['format'] ?? 'csv');
        $timestamp = now()->format('Ymd_His');

        if ($format === 'xlsx') {
            $filename = "batch-export-pos-{$timestamp}.xlsx";
            return $this->streamXlsx($query, $filename);
        }

        // Default CSV
        $filename = "batch-export-pos-{$timestamp}.csv";
        return $this->streamCsv($query, $filename);
    }

    /**
     * Streaming CSV menggunakan Symfony StreamedResponse dan fputcsv()
     * dengan zero-memory buffering (<10MB) via cursor().
     */
    protected function streamCsv($query, string $filename): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($query) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM untuk kompatibilitas penuh Microsoft Excel
            fputs($handle, "\xEF\xBB\xBF");

            // Baris Header CSV
            fputcsv($handle, self::EXPORT_HEADERS);

            // Tulis rekaman baris demi baris menggunakan cursor untuk efisiensi memori maksimal
            foreach ($query->cursor() as $record) {
                fputcsv($handle, [
                    $record->recorded_at ? $record->recorded_at->format('Y-m-d') : '',
                    $record->recorded_at ? $record->recorded_at->format('H:i:s') : '',
                    $record->pos?->kode_pos ?? '',
                    $record->pos?->nama ?? '',
                    $record->pos?->tipe ?? '',
                    $record->pos?->jenis ?? '',
                    $record->nilai,
                    $record->satuan ?? '',
                    $record->status_siaga ?? '',
                ]);
            }

            fclose($handle);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    /**
     * Streaming XLSX OpenXML yang valid menggunakan FastExcel (OpenSpout),
     * kompatibel langsung dengan Microsoft Excel, Google Sheets, dan LibreOffice tanpa warning korup.
     */
    protected function streamXlsx($query, string $filename): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $generator = function () use ($query) {
            foreach ($query->cursor() as $record) {
                yield [
                    'Tanggal' => $record->recorded_at ? $record->recorded_at->format('Y-m-d') : '',
                    'Waktu' => $record->recorded_at ? $record->recorded_at->format('H:i:s') : '',
                    'Kode Pos' => $record->pos?->kode_pos ?? '',
                    'Nama Pos' => $record->pos?->nama ?? '',
                    'Tipe' => $record->pos?->tipe ?? '',
                    'Jenis' => $record->pos?->jenis ?? '',
                    'Nilai' => $record->nilai,
                    'Satuan' => $record->satuan ?? '',
                    'Status Siaga' => $record->status_siaga ?? '',
                ];
            }
        };

        $callback = function () use ($generator) {
            $tempFile = tempnam(sys_get_temp_dir(), 'sih3_xlsx_') . '.xlsx';
            try {
                (new FastExcel($generator()))->export($tempFile);
                readfile($tempFile);
            } finally {
                if (file_exists($tempFile)) {
                    @unlink($tempFile);
                }
            }
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}
