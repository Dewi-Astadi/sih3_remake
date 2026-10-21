<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WalidataResource\Pages;
use App\Models\Walidata;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WalidataResource extends Resource
{
    protected static ?string $model = Walidata::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';

    protected static ?string $navigationGroup = 'Master Data SIH3';

    protected static ?string $navigationLabel = 'Instansi Walidata';

    protected static ?string $modelLabel = 'Instansi Walidata';

    protected static ?string $pluralModelLabel = 'Instansi Walidata';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Profil Instansi')
                    ->description('Identitas instansi mitra walidata hidrologi dan hidrometeorologi')
                    ->schema([
                        Forms\Components\TextInput::make('nama')
                            ->label('Nama Lengkap Instansi')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Contoh: Balai Besar Wilayah Sungai Serayu Opak'),
                        Forms\Components\TextInput::make('singkatan')
                            ->label('Singkatan / Akronim')
                            ->required()
                            ->maxLength(50)
                            ->placeholder('Contoh: BBWS SO'),
                        Forms\Components\Textarea::make('deskripsi')
                            ->label('Tupoksi & Deskripsi Lembaga')
                            ->rows(4)
                            ->columnSpanFull()
                            ->placeholder('Jelaskan wewenang dan cakupan pengelolaan sumber daya air instansi ini...'),
                        Forms\Components\FileUpload::make('logo_path')
                            ->label('Logo Resmi Instansi')
                            ->image()
                            ->disk('public')
                            ->directory('walidata-logos')
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Konektivitas & Kontak Publik')
                    ->description('Tautan portal eksternal dan kontak operasional')
                    ->schema([
                        Forms\Components\TextInput::make('website_url')
                            ->label('Tautan Website Resmi')
                            ->url()
                            ->maxLength(255)
                            ->placeholder('https://bbwsserayuopak.pu.go.id'),
                        Forms\Components\TextInput::make('layanan_url')
                            ->label('Tautan Portal / Layanan Data')
                            ->url()
                            ->maxLength(255)
                            ->placeholder('https://bbwsserayuopak.pu.go.id/layanan-data'),
                        Forms\Components\TextInput::make('kontak_wa')
                            ->label('Nomor WhatsApp Petugas')
                            ->tel()
                            ->maxLength(50)
                            ->placeholder('+62 812-3456-7890'),
                        Forms\Components\TextInput::make('kontak_telp')
                            ->label('Nomor Telepon Kantor')
                            ->tel()
                            ->maxLength(50)
                            ->placeholder('(0274) 588219'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo_path')
                    ->label('Logo')
                    ->circular()
                    ->disk('public'),
                Tables\Columns\TextColumn::make('singkatan')
                    ->label('Singkatan')
                    ->weight('bold')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('nama')
                    ->label('Nama Lengkap')
                    ->searchable()
                    ->sortable()
                    ->wrap(),
                Tables\Columns\TextColumn::make('kontak_wa')
                    ->label('WhatsApp')
                    ->searchable()
                    ->icon('heroicon-o-chat-bubble-left-ellipsis')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('website_url')
                    ->label('Website')
                    ->url(fn (Walidata $record) => $record->website_url, true)
                    ->color('primary')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
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
            'index' => Pages\ListWalidatas::route('/'),
            'create' => Pages\CreateWalidata::route('/create'),
            'edit' => Pages\EditWalidata::route('/{record}/edit'),
        ];
    }
}
