<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DokumenController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\PengukuranController;
use App\Http\Controllers\Api\PosController;
use App\Http\Controllers\Api\TelemetryController;
use App\Http\Controllers\Api\WalidataController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Public Telemetry & Catalog
    Route::get('/telemetry/summary', [TelemetryController::class, 'summary']);
    Route::get('/pos', [PosController::class, 'index']);
    Route::post('/pos/batch-export', [ExportController::class, 'exportBatch']);
    Route::get('/pos/{id}', [PosController::class, 'show']);
    Route::get('/pos/{id}/timeseries', [PosController::class, 'timeseries']);
    Route::get('/pos/{id}/export', [ExportController::class, 'exportSingle']);

    // Dokumen Publikasi
    Route::get('/dokumen', [DokumenController::class, 'index']);
    Route::get('/dokumen/{id}', [DokumenController::class, 'show']);
    Route::get('/dokumen/{id}/download', [DokumenController::class, 'download']);

    // Direktori Walidata
    Route::get('/walidata', [WalidataController::class, 'index']);
    Route::get('/walidata/{id}', [WalidataController::class, 'show']);

    // Admin Protected Endpoints
    Route::middleware('auth.api_token')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Pos CRUD
        Route::post('/pos', [PosController::class, 'store']);
        Route::put('/pos/{id}', [PosController::class, 'update']);
        Route::delete('/pos/{id}', [PosController::class, 'destroy']);

        // Walidata CRUD
        Route::post('/walidata', [WalidataController::class, 'store']);
        Route::put('/walidata/{id}', [WalidataController::class, 'update']);
        Route::delete('/walidata/{id}', [WalidataController::class, 'destroy']);

        // Dokumen CRUD
        Route::post('/dokumen', [DokumenController::class, 'store']);
        Route::post('/dokumen/{id}', [DokumenController::class, 'update']); // for multipart update
        Route::put('/dokumen/{id}', [DokumenController::class, 'update']);
        Route::delete('/dokumen/{id}', [DokumenController::class, 'destroy']);

        // Pengukuran CRUD
        Route::get('/pengukuran', [PengukuranController::class, 'index']);
        Route::post('/pengukuran', [PengukuranController::class, 'store']);
        Route::delete('/pengukuran/{id}', [PengukuranController::class, 'destroy']);
    });
});
