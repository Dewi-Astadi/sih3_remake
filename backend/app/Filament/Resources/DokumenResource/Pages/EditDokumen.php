<?php

namespace App\Filament\Resources\DokumenResource\Pages;

use App\Filament\Resources\DokumenResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditDokumen extends EditRecord
{
    protected static string $resource = DokumenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (! empty($data['file_path'])) {
            $disk = Storage::disk('public');
            if ($disk->exists($data['file_path'])) {
                $bytes = $disk->size($data['file_path']);
                $data['file_size'] = $bytes >= 1048576
                    ? round($bytes / 1048576, 2) . ' MB'
                    : round($bytes / 1024, 1) . ' KB';
                $data['file_extension'] = strtolower(pathinfo($data['file_path'], PATHINFO_EXTENSION) ?: 'pdf');
            }
        }

        return $data;
    }
}
