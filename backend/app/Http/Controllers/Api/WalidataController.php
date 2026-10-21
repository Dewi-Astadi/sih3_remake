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
}
