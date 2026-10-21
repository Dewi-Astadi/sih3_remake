<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DokumenResource\Pages;
use App\Models\Dokumen;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DokumenResource extends Resource
{
    protected static ?string $model = Dokumen::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Publikasi & Dokumen';

    protected static ?string $navigationLabel = 'Repositori Dokumen';

    protected static ?string $modelLabel = 'Dokumen Publikasi';

    protected static ?string $pluralModelLabel = 'Dokumen Publikasi';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Dokumen')
                    ->description('Detail metadata berkas publikasi atau regulasi SDA')
                    ->schema([
                        Forms\Components\TextInput::make('judul')
                            ->label('Judul Dokumen')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull()
                            ->placeholder('Contoh: Laporan Kinerja Pengelolaan SDA BBWS Serayu Opak 2025'),
                        Forms\Components\Select::make('kategori')
                            ->label('Kategori Dokumen')
                            ->options([
                                'regulasi' => 'Regulasi & Kebijakan',
                                'sop' => 'Standar Operasional Prosedur (SOP)',
                                'buletin' => 'Buletin & Publikasi Ilmiah',
                                'laporan' => 'Laporan Tahunan / Berkala',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\TextInput::make('tahun')
                            ->label('Tahun Terbit')
                            ->numeric()
                            ->default((int) date('Y'))
                            ->required(),
                        Forms\Components\TextInput::make('nomor_dokumen')
                            ->label('Nomor Dokumen / SK')
                            ->maxLength(100)
                            ->placeholder('Contoh: KPTS/BBWSSO/2025/08'),
                        Forms\Components\TextInput::make('download_count')
                            ->label('Total Diunduh')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->dehydrated(false),
                    ])->columns(2),

                Forms\Components\Section::make('Berkas Dokumen')
                    ->description('Upload berkas PDF resmi')
                    ->schema([
                        Forms\Components\FileUpload::make('file_path')
                            ->label('Berkas PDF')
                            ->helperText('Hanya menerima format PDF')
                            ->acceptedFileTypes(['application/pdf'])
                            ->disk('public')
                            ->directory('dokumen')
                            ->required()
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('judul')
                    ->label('Judul Dokumen')
                    ->searchable()
                    ->sortable()
                    ->wrap()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('kategori')
                    ->label('Kategori')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'regulasi' => 'danger',
                        'sop' => 'warning',
                        'buletin' => 'info',
                        'laporan' => 'success',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('tahun')
                    ->label('Tahun')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('nomor_dokumen')
                    ->label('Nomor Dokumen')
                    ->searchable()
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('file_size')
                    ->label('Ukuran')
                    ->badge()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('download_count')
                    ->label('Diunduh')
                    ->numeric()
                    ->sortable()
                    ->suffix(' kali'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal Unggah')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('kategori')
                    ->label('Kategori')
                    ->options([
                        'regulasi' => 'Regulasi',
                        'sop' => 'SOP',
                        'buletin' => 'Buletin',
                        'laporan' => 'Laporan',
                    ]),
                Tables\Filters\SelectFilter::make('tahun')
                    ->label('Tahun')
                    ->options(fn () => Dokumen::query()->select('tahun')->distinct()->orderByDesc('tahun')->pluck('tahun', 'tahun')),
            ])
            ->actions([
                Tables\Actions\Action::make('download')
                    ->label('Unduh')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->url(fn (Dokumen $record) => asset('storage/' . $record->file_path), true),
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
            'index' => Pages\ListDokumens::route('/'),
            'create' => Pages\CreateDokumen::route('/create'),
            'edit' => Pages\EditDokumen::route('/{record}/edit'),
        ];
    }
}
