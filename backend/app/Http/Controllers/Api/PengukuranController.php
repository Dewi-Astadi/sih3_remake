<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengukuran;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PengukuranController extends Controller
{
    /**
     * List measurements with pagination and filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pengukuran::with('pos:id,nama,kode_pos,jenis,tipe');

        if ($request->filled('pos_id')) {
            $query->where('pos_id', $request->query('pos_id'));
        }

        if ($request->filled('status_siaga')) {
            $query->where('status_siaga', $request->query('status_siaga'));
        }

        if ($request->filled('start_date')) {
            $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
            $query->where('recorded_at', '>=', $startDate);
        }

        if ($request->filled('end_date')) {
            $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
            $query->where('recorded_at', '<=', $endDate);
        }

        $query->orderBy('recorded_at', 'desc');

        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
        $data = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $data->items(),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ],
        ]);
    }

    /**
     * Store new measurement
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pos_id' => 'required|exists:pos,id',
            'recorded_at' => 'required|date',
            'nilai' => 'required|numeric',
            'satuan' => 'required|string|max:50',
            'status_siaga' => 'nullable|string|in:Normal,Waspada,Siaga,Awas',
            'parameter_tambahan' => 'nullable|array',
        ]);

        if (empty($validated['status_siaga'])) {
            $validated['status_siaga'] = 'Normal';
        }

        $pengukuran = Pengukuran::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pengukuran berhasil dicatat.',
            'data' => $pengukuran->load('pos:id,nama,kode_pos'),
        ], 201);
    }

    /**
     * Delete measurement
     */
    public function destroy(int|string $id): JsonResponse
    {
        $pengukuran = Pengukuran::findOrFail($id);
        $pengukuran->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pengukuran berhasil dihapus.',
        ]);
    }
}

