<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pos;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TelemetryController extends Controller
{
    /**
     * Mengambil ringkasan data telemetri pos aktif dengan nilai pengukuran terkini.
     * Cocok untuk strip telemetri beranda (AWLR, ARR, MAT, dll).
     */
    public function summary(Request $request): JsonResponse
    {
        $query = Pos::query()
            ->with(['latestPengukuran', 'walidata'])
            ->where('status_alat', 'aktif');

        if ($request->filled('jenis')) {
            $jenisList = explode(',', $request->query('jenis'));
            $query->whereIn('jenis', array_map('trim', $jenisList));
        }

        if ($request->filled('tipe')) {
            $query->where('tipe', $request->query('tipe'));
        }

        if ($request->filled('das')) {
            $query->where('das', $request->query('das'));
        }

        $poses = $query->orderBy('nama', 'asc')->get();

        $data = $poses->map(function (Pos $pos) {
            $latest = $pos->latestPengukuran;

            // Default satuan berdasarkan jenis pos hidrologi/hidrometeorologi
            $defaultSatuan = match ($pos->jenis) {
                'ARR' => 'mm',
                'AWLR' => 'm',
                'MAT' => 'm',
                default => 'm',
            };

            return [
                'id' => $pos->id,
                'kode_pos' => $pos->kode_pos,
                'nama' => $pos->nama,
                'tipe' => $pos->tipe,
                'jenis' => $pos->jenis,
                'wilayah_sungai' => $pos->wilayah_sungai,
                'das' => $pos->das,
                'sub_das' => $pos->sub_das,
                'sungai' => $pos->sungai,
                'desa' => $pos->desa,
                'kecamatan' => $pos->kecamatan,
                'kabupaten' => $pos->kabupaten,
                'provinsi' => $pos->provinsi,
                'latitude' => $pos->latitude,
                'longitude' => $pos->longitude,
                'status_alat' => $pos->status_alat,
                'foto_path' => $pos->foto_path,
                'walidata_id' => $pos->walidata_id,
                'walidata' => $pos->walidata ? [
                    'id' => $pos->walidata->id,
                    'nama' => $pos->walidata->nama,
                    'singkatan' => $pos->walidata->singkatan,
                ] : null,
                'nilai' => $latest?->nilai,
                'satuan' => $latest?->satuan ?? $defaultSatuan,
                'status_siaga' => $latest?->status_siaga ?? 'normal',
                'recorded_at' => $latest?->recorded_at?->toIso8601String(),
                'latest_pengukuran' => $latest ? [
                    'id' => $latest->id,
                    'recorded_at' => $latest->recorded_at?->toIso8601String(),
                    'nilai' => $latest->nilai,
                    'satuan' => $latest->satuan,
                    'status_siaga' => $latest->status_siaga,
                    'parameter_tambahan' => $latest->parameter_tambahan,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'count' => $data->count(),
            'data' => $data,
        ]);
    }
}
