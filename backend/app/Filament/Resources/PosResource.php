<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PosResource\Pages;
use App\Models\Pos;
use App\Services\PengukuranImportService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Storage;

class PosResource extends Resource
{
    protected static ?string $model = Pos::class;

    protected static ?string $navigationIcon = 'heroicon-o-map-pin';

    protected static ?string $navigationGroup = 'Master Data SIH3';

    protected static ?string $navigationLabel = 'Pos Hidrologi & Pos Pantau';

    protected static ?string $modelLabel = 'Pos Pantau';

    protected static ?string $pluralModelLabel = 'Pos Pantau';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Utama Pos')
                    ->description('Identitas stasiun, kode pos, dan instansi pengelola walidata')
                    ->schema([
                        Forms\Components\TextInput::make('kode_pos')
                            ->label('Kode Pos / Stasiun')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(50)
                            ->placeholder('Contoh: AWLR-KRASAK-01'),
                        Forms\Components\TextInput::make('nama')
                            ->label('Nama Pos')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Contoh: Pos Duga Air Krasak'),
                        Forms\Components\Select::make('tipe')
                            ->label('Pilar / Tipe')
                            ->options([
                                'hidrologi' => 'Hidrologi',
                                'hidrometeorologi' => 'Hidrometeorologi',
                                'hidrogeologi' => 'Hidrogeologi',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\Select::make('jenis')
                            ->label('Jenis Pos')
                            ->options([
                                'AWLR' => 'AWLR (Duga Air)',
                                'ARR' => 'ARR (Curah Hujan)',
                                'Klimatologi' => 'Klimatologi',
                                'Kualitas Air' => 'Kualitas Air',
                                'MAT' => 'MAT (Muka Air Tanah)',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\Select::make('walidata_id')
                            ->label('Instansi Walidata')
                            ->relationship('walidata', 'nama')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('status_alat')
                            ->label('Status Operasional Alat')
                            ->options([
                                'aktif' => 'Aktif Beroperasi',
                                'pemeliharaan' => 'Dalam Pemeliharaan',
                                'nonaktif' => 'Nonaktif / Rusak',
                            ])
                            ->default('aktif')
                            ->required()
                            ->native(false),
                    ])->columns(2),

                Forms\Components\Section::make('Wilayah Sungai & Lokasi Geografis')
                    ->description('Atribut hidrologi dan koordinat lintang bujur stasiun')
                    ->schema([
                        Forms\Components\TextInput::make('wilayah_sungai')
                            ->label('Wilayah Sungai (WS)')
                            ->required()
                            ->maxLength(150)
                            ->placeholder('Contoh: Progo Opak Serang'),
                        Forms\Components\TextInput::make('das')
                            ->label('Daerah Aliran Sungai (DAS)')
                            ->required()
                            ->maxLength(150)
                            ->placeholder('Contoh: DAS Opak'),
                        Forms\Components\TextInput::make('sub_das')
                            ->label('Sub DAS')
                            ->maxLength(150)
                            ->placeholder('Contoh: Sub DAS Krasak'),
                        Forms\Components\TextInput::make('sungai')
                            ->label('Nama Sungai')
                            ->maxLength(150)
                            ->placeholder('Contoh: Sungai Krasak'),
                        Forms\Components\TextInput::make('desa')
                            ->label('Desa / Kelurahan')
                            ->maxLength(100),
                        Forms\Components\TextInput::make('kecamatan')
                            ->label('Kecamatan')
                            ->maxLength(100),
                        Forms\Components\TextInput::make('kabupaten')
                            ->label('Kabupaten / Kota')
                            ->maxLength(100),
                        Forms\Components\TextInput::make('provinsi')
                            ->label('Provinsi')
                            ->maxLength(100),
                        Forms\Components\TextInput::make('latitude')
                            ->label('Lintang (Latitude)')
                            ->numeric()
                            ->placeholder('-7.7500000'),
                        Forms\Components\TextInput::make('longitude')
                            ->label('Bujur (Longitude)')
                            ->numeric()
                            ->placeholder('110.3700000'),
                        Forms\Components\FileUpload::make('foto_path')
                            ->label('Foto Pos / Stasiun')
                            ->image()
                            ->disk('public')
                            ->directory('pos-photos')
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('kode_pos')
                    ->label('Kode Pos')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('nama')
                    ->label('Nama Pos')
                    ->searchable()
                    ->sortable()
                    ->wrap(),
                Tables\Columns\TextColumn::make('tipe')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'hidrologi' => 'info',
                        'hidrometeorologi' => 'primary',
                        'hidrogeologi' => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('jenis')
                    ->label('Jenis')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('wilayah_sungai')
                    ->label('Wilayah Sungai')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('das')
                    ->label('DAS')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('walidata.singkatan')
                    ->label('Walidata')
                    ->sortable()
                    ->badge()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('status_alat')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'aktif' => 'success',
                        'pemeliharaan' => 'warning',
                        'nonaktif' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Terakhir Diperbarui')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('tipe')
                    ->label('Pilar / Tipe')
                    ->options([
                        'hidrologi' => 'Hidrologi',
                        'hidrometeorologi' => 'Hidrometeorologi',
                        'hidrogeologi' => 'Hidrogeologi',
                    ]),
                Tables\Filters\SelectFilter::make('jenis')
                    ->label('Jenis Pos')
                    ->options([
                        'AWLR' => 'AWLR (Duga Air)',
                        'ARR' => 'ARR (Curah Hujan)',
                        'Klimatologi' => 'Klimatologi',
                        'Kualitas Air' => 'Kualitas Air',
                        'MAT' => 'MAT (Muka Air Tanah)',
                    ]),
                Tables\Filters\SelectFilter::make('walidata_id')
                    ->label('Instansi Walidata')
                    ->relationship('walidata', 'singkatan'),
                Tables\Filters\SelectFilter::make('status_alat')
                    ->label('Status Alat')
                    ->options([
                        'aktif' => 'Aktif',
                        'pemeliharaan' => 'Pemeliharaan',
                        'nonaktif' => 'Nonaktif',
                    ]),
            ])
            ->headerActions([
                Tables\Actions\Action::make('importCsvHeader')
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
                            ->label('Unggah File CSV Pengukuran')
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

                            // Clean up file
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
            ])
            ->actions([
                Tables\Actions\Action::make('importPengukuran')
                    ->label('Import CSV')
                    ->icon('heroicon-o-arrow-up-tray')
                    ->color('success')
                    ->form([
                        Forms\Components\FileUpload::make('csv_file')
                            ->label('Unggah File CSV Pengukuran untuk Pos Ini')
                            ->helperText('Kolom: recorded_at, nilai, satuan (opsional), status_siaga (opsional)')
                            ->acceptedFileTypes(['text/csv', 'text/plain', 'application/vnd.ms-excel', 'text/x-csv', 'application/csv'])
                            ->disk('local')
                            ->directory('temp-imports')
                            ->required(),
                    ])
                    ->action(function (array $data, Pos $record) {
                        try {
                            $filePath = Storage::disk('local')->path($data['csv_file']);
                            $service = new PengukuranImportService();
                            $res = $service->import($filePath, $record->id);

                            @unlink($filePath);

                            Notification::make()
                                ->title('Import Berhasil')
                                ->body("Berhasil memasukkan {$res['imported']} data pengukuran untuk pos {$record->nama}." . ($res['skipped'] > 0 ? " ({$res['skipped']} baris dilewati)." : ''))
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
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPos::route('/'),
            'create' => Pages\CreatePos::route('/create'),
            'edit' => Pages\EditPos::route('/{record}/edit'),
        ];
    }
}
