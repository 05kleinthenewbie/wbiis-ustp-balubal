<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLiability extends Model
{
    protected $fillable = [
    'incident_id',
    'user_id',
    'liability_description',
    'liability_status',
    'date_assigned',
    'date_settled',
];

protected $casts = [
    'date_assigned' => 'datetime',
    'date_settled' => 'datetime',
];
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
