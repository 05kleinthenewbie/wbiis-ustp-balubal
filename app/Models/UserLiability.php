<?php

namespace App\Models;

use App\Services\LiabilityNotificationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLiability extends Model
{
    protected $fillable = [
        'incident_id',
        'user_id',
        'liability_description',
        'liability_amount',
        'liability_status',
        'date_assigned',
        'date_settled',
        'acknowledged_at',
    ];

    protected $casts = [
        'liability_amount' => 'decimal:2',
        'date_assigned' => 'datetime',
        'date_settled' => 'datetime',
        'acknowledged_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::created(fn (UserLiability $liability) => app(LiabilityNotificationService::class)->send($liability, true));
        static::updated(function (UserLiability $liability): void {
            if ($liability->wasChanged('liability_status')) {
                app(LiabilityNotificationService::class)->send($liability, false);
            }
        });
    }

    /**
     * Get the incident this liability is tied to.
     */
    public function incidentReport(): BelongsTo
    {
        return $this->belongsTo(IncidentReport::class, 'incident_id');
    }

    /**
     * Get the user held liable.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
