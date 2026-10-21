<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentRoster extends Model
{
    /**
     * Student programs accepted on the roster and during registration.
     */
    public const PROGRAMS = ['BSA', 'BSIT', 'BTLED'];

    protected $fillable = [
        'user_id',
        'id_number',
        'name',
        'program',
        'email',
    ];

    /**
     * Get the user account provisioned for this roster entry.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
