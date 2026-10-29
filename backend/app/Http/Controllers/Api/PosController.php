<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pos;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosController extends Controller
{
    /**
     * Menampilkan daftar pos pemantauan dengan filter dan paginasi.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pos::query()->with(['walidata', 'latestPengukuran']);

        // Filter pencarian universal (q)
        if ($request->filled('q')) {
            $q = trim($request->query('q'));
            $query->where(function ($sub) use ($q) {
                $sub->where('nama', 'like', "%{$q}%")
                    ->orWhere('kode_pos', 'like', "%{$q}%")
                    ->orWhere('sungai', 'like', "%{$q}%")
                    ->orWhere('das', 'like', "%{$q}%")
                    ->orWhere('sub_das', 'like', "%{$q}%")
                    ->orWhere('desa', 'like', "%{$q}%")
                    ->orWhere('kecamatan', 'like', "%{$q}%")
                    ->orWhere('kabupaten', 'like', "%{$q}%");
            });
        }

        // Filter tipe (hidrologi, hidrometeorologi, hidrogeologi)
        if ($request->filled('tipe')) {
            $query->where('tipe', strtolower(trim($request->query('tipe'))));
        }

        // Filter jenis (AWLR, ARR, MAT, Kualitas Air, Klimatologi)
        if ($request->filled('jenis')) {
            $query->where('jenis', trim($request->query('jenis')));
        }

        // Filter DAS
        if ($request->filled('das')) {
            $query->where('das', trim($request->query('das')));
        }

        // Filter Wilayah Sungai
        if ($request->filled('wilayah_sungai')) {
            $query->where('wilayah_sungai', trim($request->query('wilayah_sungai')));
        }

        // Filter Walidata ID
        if ($request->filled('walidata_id')) {
            $query->where('walidata_id', $request->query('walidata_id'));
        }

        // Filter Status Alat (aktif, rusak, perbaikan)
        if ($request->filled('status_alat')) {
            $query->where('status_alat', trim($request->query('status_alat')));
        }

        // Sorting
        $allowedSorts = ['id', 'nama', 'kode_pos', 'tipe', 'jenis', 'das', 'kabupaten', 'created_at'];
        $sortBy = in_array($request->query('sort_by'), $allowedSorts, true) ? $request->query('sort_by') : 'nama';
        $sortDirection = strtolower($request->query('sort_direction', 'asc')) === 'desc' ? 'desc' : 'asc';
        $query->orderBy($sortBy, $sortDirection);

        // Paginasi
        $perPage = (int) $request->query('per_page', 15);
        if ($perPage < 1) {
            $perPage = 15;
        } elseif ($perPage > 100) {
            $perPage = 100;
        }

        $paginated = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
            ],
            'links' => [
                'first' => $paginated->url(1),
                'last' => $paginated->url($paginated->lastPage()),
                'prev' => $paginated->previousPageUrl(),
                'next' => $paginated->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Menampilkan detail metadata satu pos pemantauan beserta relasi walidata dan pengukuran terakhir.
     */
    public function show(string|int $id): JsonResponse
    {
        $pos = Pos::with(['walidata', 'latestPengukuran'])->find($id);

        if (!$pos) {
            return response()->json([
                'success' => false,
                'message' => 'Pos pemantauan tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $pos,
        ]);
    }

    /**
     * Menampilkan rekaman deret waktu (timeseries) pengukuran pos untuk grafik tren.
     */
    public function timeseries(string|int $id, Request $request): JsonResponse
    {
        $pos = Pos::find($id);

        if (!$pos) {
            return response()->json([
                'success' => false,
                'message' => 'Pos pemantauan tidak ditemukan.',
            ], 404);
        }

        $query = $pos->pengukuran()->orderBy('recorded_at', 'asc');

        if ($request->filled('start_date')) {
            $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
            $query->where('recorded_at', '>=', $startDate);
        }

        if ($request->filled('end_date')) {
            $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
            $query->where('recorded_at', '<=', $endDate);
        }

        if ($request->filled('limit')) {
            $limit = (int) $request->query('limit');
            if ($limit > 0) {
                $query->limit($limit);
            }
        }

        $measurements = $query->get();

        return response()->json([
            'success' => true,
            'pos' => [
                'id' => $pos->id,
                'kode_pos' => $pos->kode_pos,
                'nama' => $pos->nama,
                'jenis' => $pos->jenis,
                'tipe' => $pos->tipe,
            ],
            'count' => $measurements->count(),
            'data' => $measurements,
        ]);
    }

    /**
     * Store new Pos
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:100|unique:pos,kode_pos',
            'tipe' => 'required|in:hidrologi,hidrometeorologi,hidrogeologi',
            'jenis' => 'required|string|max:100',
            'sungai' => 'nullable|string|max:255',
            'das' => 'nullable|string|max:255',
            'sub_das' => 'nullable|string|max:255',
            'desa' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:255',
            'kabupaten' => 'nullable|string|max:255',
            'provinsi' => 'nullable|string|max:255',
            'wilayah_sungai' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'elevasi' => 'nullable|numeric',
            'tahun_pembangunan' => 'nullable|integer',
            'status_alat' => 'nullable|string|in:aktif,rusak,perbaikan',
            'walidata_id' => 'nullable|exists:walidata,id',
            'keterangan' => 'nullable|string',
        ]);

        if (empty($validated['wilayah_sungai'])) {
            $validated['wilayah_sungai'] = 'WS Progo-Opak-Serang';
        }
        if (empty($validated['das'])) {
            $validated['das'] = 'DAS Progo';
        }
        if (empty($validated['walidata_id'])) {
            $validated['walidata_id'] = \App\Models\Walidata::value('id') ?? 1;
        }

        $pos = Pos::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pos pemantauan berhasil ditambahkan.',
            'data' => $pos,
        ], 201);
    }

    /**
     * Update existing Pos
     */
    public function update(Request $request, int|string $id): JsonResponse
    {
        $pos = Pos::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'kode_pos' => 'sometimes|required|string|max:100|unique:pos,kode_pos,'.$pos->id,
            'tipe' => 'sometimes|required|in:hidrologi,hidrometeorologi,hidrogeologi',
            'jenis' => 'sometimes|required|string|max:100',
            'sungai' => 'nullable|string|max:255',
            'das' => 'nullable|string|max:255',
            'sub_das' => 'nullable|string|max:255',
            'desa' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:255',
            'kabupaten' => 'nullable|string|max:255',
            'provinsi' => 'nullable|string|max:255',
            'wilayah_sungai' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'elevasi' => 'nullable|numeric',
            'tahun_pembangunan' => 'nullable|integer',
            'status_alat' => 'nullable|string|in:aktif,rusak,perbaikan',
            'walidata_id' => 'nullable|exists:walidata,id',
            'keterangan' => 'nullable|string',
        ]);

        $pos->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pos pemantauan berhasil diperbarui.',
            'data' => $pos,
        ]);
    }

    /**
     * Delete Pos
     */
    public function destroy(int|string $id): JsonResponse
    {
        $pos = Pos::findOrFail($id);
        $pos->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pos pemantauan berhasil dihapus.',
        ]);
    }
}
