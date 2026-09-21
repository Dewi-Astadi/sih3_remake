<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pengukuran extends Model
{
    use HasFactory;

    protected $table = 'pengukuran';

    protected $fillable = [
        'pos_id',
        'recorded_at',
        'nilai',
        'satuan',
        'status_siaga',
        'parameter_tambahan',
    ];

    protected function casts(): array
    {
        return [
            'recorded_at' => 'datetime',
            'nilai' => 'float',
            'parameter_tambahan' => 'array',
        ];
    }

    /**
     * Get the pos that owns this measurement.
     */
    public function pos(): BelongsTo
    {
        return $this->belongsTo(Pos::class, 'pos_id');
    }
}
