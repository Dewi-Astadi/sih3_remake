<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dokumen extends Model
{
    use HasFactory;

    protected $table = 'dokumen';

    protected $fillable = [
        'judul',
        'kategori',
        'tahun',
        'nomor_dokumen',
        'file_path',
        'file_size',
        'file_extension',
        'download_count',
    ];

    protected function casts(): array
    {
        return [
            'tahun' => 'integer',
            'download_count' => 'integer',
        ];
    }
}
