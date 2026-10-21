<?php

namespace App\Filament\Resources\WalidataResource\Pages;

use App\Filament\Resources\WalidataResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditWalidata extends EditRecord
{
    protected static string $resource = WalidataResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
