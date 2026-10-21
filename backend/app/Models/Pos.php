<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pos extends Model
{
    use HasFactory;

    protected $table = 'pos';

    protected $fillable = [
        'kode_pos',
        'nama',
        'tipe',
        'jenis',
        'wilayah_sungai',
        'das',
        'sub_das',
        'sungai',
        'desa',
        'kecamatan',
        'kabupaten',
        'provinsi',
        'latitude',
        'longitude',
        'walidata_id',
        'status_alat',
        'foto_path',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    /**
     * Get the walidata that owns this pos.
     */
    public function walidata(): BelongsTo
    {
        return $this->belongsTo(Walidata::class, 'walidata_id');
    }

    /**
     * Get the pengukuran records for this pos.
     */
    public function pengukuran(): HasMany
    {
        return $this->hasMany(Pengukuran::class, 'pos_id');
    }

    /**
     * Get the latest measurement record for this pos.
     */
    public function latestPengukuran(): HasOne
    {
        return $this->hasOne(Pengukuran::class, 'pos_id')->latestOfMany('recorded_at');
    }
}
