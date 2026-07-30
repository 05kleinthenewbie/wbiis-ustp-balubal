<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    protected $fillable = [
        'facility_name',
        'facility_type',
        'capacity',
        'location',
        'availability_status',
    ];

    /**
     * Get all bookings for this facility.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
