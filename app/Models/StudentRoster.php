<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentRoster extends Model
{
    /**
     * Student programs accepted on the roster and during registration.
     */
    public const PROGRAMS = ['BSA', 'BSIT', 'BTLED'];

    protected $fillable = [
        'id_number',
        'name',
        'program',
    ];
}
