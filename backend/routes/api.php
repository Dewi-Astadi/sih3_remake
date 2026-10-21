<?php

use App\Http\Controllers\Api\DokumenController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\PosController;
use App\Http\Controllers\Api\TelemetryController;
use App\Http\Controllers\Api\WalidataController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
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
});

