<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'facility_id',
        'approved_by',
        'booking_date',
        'start_time',
        'end_time',
        'purpose',
        'booking_status',
    ];

    protected $casts = [
        'booking_date' => 'date',
    ];

    /**
     * Limit the query to bookings that are still upcoming or currently in use.
     */
    public function scopeActive(Builder $query): Builder
    {
        $now = now();
        $today = $now->toDateString();
        $time = $now->format('H:i:s');

        return $query
            ->whereIn('booking_status', ['pending', 'approved'])
            ->where(function (Builder $query) use ($today, $time): void {
                $query->whereDate('booking_date', '>', $today)
                    ->orWhere(function (Builder $query) use ($today, $time): void {
                        $query->whereDate('booking_date', $today)
                            ->where('end_time', '>', $time);
                    });
            });
    }

    /**
     * Get the user who made this booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the facility being booked.
     */
    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    /**
     * Get the admin who approved/rejected this booking.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
