<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class DokumenController extends Controller
{
    /**
     * Menampilkan daftar dokumen publikasi dengan paginasi, filter kategori, dan pencarian.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Dokumen::query();

        // Filter pencarian universal (q) pada judul atau nomor dokumen
        if ($request->filled('q')) {
            $q = trim($request->query('q'));
            $query->where(function ($sub) use ($q) {
                $sub->where('judul', 'like', "%{$q}%")
                    ->orWhere('nomor_dokumen', 'like', "%{$q}%");
            });
        }

        // Filter kategori ('regulasi', 'sop', 'buletin', 'laporan')
        if ($request->filled('kategori')) {
            $query->where('kategori', strtolower(trim($request->query('kategori'))));
        }

        // Filter tahun
        if ($request->filled('tahun')) {
            $query->where('tahun', (int) $request->query('tahun'));
        }

        // Sorting
        $allowedSorts = ['id', 'judul', 'kategori', 'tahun', 'download_count', 'created_at'];
        $sortBy = in_array($request->query('sort_by'), $allowedSorts, true) ? $request->query('sort_by') : 'tahun';
        $sortDirection = strtolower($request->query('sort_direction', 'desc')) === 'asc' ? 'asc' : 'desc';
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
     * Menampilkan detail metadata dokumen tunggal.
     */
    public function show(string|int $id): JsonResponse
    {
        $dokumen = Dokumen::find($id);

        if (!$dokumen) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $dokumen,
        ]);
    }

    /**
     * Mengunduh berkas fisik dokumen dan menambah jumlah counter download_count.
     */
    public function download(string|int $id): Response
    {
        $dokumen = Dokumen::find($id);

        if (!$dokumen) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen tidak ditemukan.',
            ], 404);
        }

        // Tambah counter download_count secara atomik
        $dokumen->increment('download_count');

        $relativePath = ltrim($dokumen->file_path, '/');
        $filename = basename($dokumen->file_path) ?: ($dokumen->judul . '.' . ($dokumen->file_extension ?: 'pdf'));

        // Cek disk public storage
        if (Storage::disk('public')->exists($relativePath)) {
            return Storage::disk('public')->download($relativePath, $filename);
        }

        // Cek public path langsung
        if (file_exists(public_path($dokumen->file_path))) {
            return response()->download(public_path($dokumen->file_path), $filename);
        }

        // Cek default storage disk
        if (Storage::exists($relativePath)) {
            return Storage::download($relativePath, $filename);
        }

        if (file_exists(storage_path('app/' . $relativePath))) {
            return response()->download(storage_path('app/' . $relativePath), $filename);
        }

        // Fallback: Untuk data seeded/sample dummy yang belum memiliki file fisik di storage
        $extension = strtolower($dokumen->file_extension ?: 'pdf');
        $mimeType = match ($extension) {
            'pdf' => 'application/pdf',
            'docx', 'doc' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx', 'xls' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'zip' => 'application/zip',
            default => 'application/octet-stream',
        };

        // Konten minimal valid dokumen PDF placeholder
        $dummyContent = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000108 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n185\n%%EOF\n";

        return response($dummyContent, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Content-Length' => strlen($dummyContent),
        ]);
    }
}
