<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Walidata extends Model
{
    use HasFactory;

    protected $table = 'walidata';

    protected $fillable = [
        'nama',
        'singkatan',
        'deskripsi',
        'logo_path',
        'website_url',
        'layanan_url',
        'kontak_wa',
        'kontak_telp',
    ];

    /**
     * Get all pos managed by this walidata.
     */
    public function pos(): HasMany
    {
        return $this->hasMany(Pos::class, 'walidata_id');
    }
}
