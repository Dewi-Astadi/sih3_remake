<?php

namespace App\Filament\Resources\PosResource\Pages;

use App\Filament\Resources\PosResource;
use App\Models\Pos;
use App\Services\PengukuranImportService;
use Filament\Actions;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Storage;

class ListPos extends ListRecords
{
    protected static string $resource = PosResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('importCsv')
                ->label('Import CSV Pengukuran')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('success')
                ->form([
                    Forms\Components\Select::make('pos_id')
                        ->label('Target Pos (Opsional jika kode_pos tercantum di CSV)')
                        ->options(fn () => Pos::orderBy('nama')->pluck('nama', 'id'))
                        ->searchable()
                        ->placeholder('-- Seluruh Pos atau Tertera di CSV --'),
                    Forms\Components\FileUpload::make('csv_file')
                        ->label('Unggah Berkas CSV Pengukuran')
                        ->helperText('Format kolom yang didukung: recorded_at, nilai, satuan, status_siaga, kode_pos / pos_id')
                        ->acceptedFileTypes(['text/csv', 'text/plain', 'application/vnd.ms-excel', 'text/x-csv', 'application/csv'])
                        ->disk('local')
                        ->directory('temp-imports')
                        ->required(),
                ])
                ->action(function (array $data) {
                    try {
                        $filePath = Storage::disk('local')->path($data['csv_file']);
                        $service = new PengukuranImportService();
                        $res = $service->import($filePath, ! empty($data['pos_id']) ? (int) $data['pos_id'] : null);

                        @unlink($filePath);

                        Notification::make()
                            ->title('Import Selesai')
                            ->body("Berhasil memasukkan {$res['imported']} data pengukuran." . ($res['skipped'] > 0 ? " ({$res['skipped']} baris dilewati)." : ''))
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('Import Gagal')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),
            Actions\CreateAction::make()->label('Tambah Pos Baru'),
        ];
    }
}
