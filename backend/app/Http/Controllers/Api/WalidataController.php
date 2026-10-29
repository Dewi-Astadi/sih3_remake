<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Walidata;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalidataController extends Controller
{
    /**
     * Menampilkan daftar seluruh mitra walidata beserta pos_count dan kontak.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Walidata::query()->withCount('pos');

        // Pencarian nama, singkatan, atau deskripsi
        if ($request->filled('q')) {
            $q = trim($request->query('q'));
            $query->where(function ($sub) use ($q) {
                $sub->where('nama', 'like', "%{$q}%")
                    ->orWhere('singkatan', 'like', "%{$q}%")
                    ->orWhere('deskripsi', 'like', "%{$q}%");
            });
        }

        // Sorting
        $allowedSorts = ['id', 'nama', 'singkatan', 'pos_count', 'created_at'];
        $sortBy = in_array($request->query('sort_by'), $allowedSorts, true) ? $request->query('sort_by') : 'nama';
        $sortDirection = strtolower($request->query('sort_direction', 'asc')) === 'desc' ? 'desc' : 'asc';
        $query->orderBy($sortBy, $sortDirection);

        $walidata = $query->get();

        return response()->json([
            'success' => true,
            'count' => $walidata->count(),
            'data' => $walidata,
        ]);
    }

    /**
     * Menampilkan detail mitra walidata beserta daftar pos pemantauan yang dinaungi.
     */
    public function show(string|int $id): JsonResponse
    {
        $walidata = Walidata::withCount('pos')
            ->with(['pos' => function ($q) {
                $q->orderBy('nama', 'asc');
            }])
            ->find($id);

        if (!$walidata) {
            return response()->json([
                'success' => false,
                'message' => 'Mitra walidata tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $walidata,
        ]);
    }

    /**
     * Store new Walidata
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'singkatan' => 'required|string|max:50',
            'deskripsi' => 'nullable|string',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'website' => 'nullable|url|max:255',
            'url_layanan_data' => 'nullable|url|max:255',
        ]);

        $walidata = Walidata::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data walidata berhasil ditambahkan.',
            'data' => $walidata,
        ], 201);
    }

    /**
     * Update existing Walidata
     */
    public function update(Request $request, int|string $id): JsonResponse
    {
        $walidata = Walidata::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'singkatan' => 'sometimes|required|string|max:50',
            'deskripsi' => 'nullable|string',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'website' => 'nullable|url|max:255',
            'url_layanan_data' => 'nullable|url|max:255',
        ]);

        $walidata->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data walidata berhasil diperbarui.',
            'data' => $walidata,
        ]);
    }

    /**
     * Delete Walidata
     */
    public function destroy(int|string $id): JsonResponse
    {
        $walidata = Walidata::findOrFail($id);
        $walidata->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data walidata berhasil dihapus.',
        ]);
    }
}
