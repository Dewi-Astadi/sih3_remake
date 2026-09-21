<?php

use App\Http\Controllers\Api\PosController;
use App\Http\Controllers\Api\TelemetryController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/telemetry/summary', [TelemetryController::class, 'summary']);
    Route::get('/pos', [PosController::class, 'index']);
    Route::get('/pos/{id}', [PosController::class, 'show']);
    Route::get('/pos/{id}/timeseries', [PosController::class, 'timeseries']);
});
