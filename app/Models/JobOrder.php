<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobOrder extends Model
{
    protected $fillable = [
        'request_id',
        'assigned_to',
        'status',
        'report',
        'resolution',
        'final_remarks',
        'action_taken',
        'date_assigned',
        'date_completed',
        'rating',
        'requester_comment',
    ];

    protected $casts = [
        'date_assigned' => 'datetime',
        'date_completed' => 'datetime',
        'rating' => 'integer',
    ];

    /**
     * Get the parent service request.
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class, 'request_id');
    }

    /**
     * Get the technician assigned to this job order.
     */
    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get all technician responses/updates for this job order.
     */
    public function technicianResponses(): HasMany
    {
        return $this->hasMany(TechnicianResponse::class);
    }

    /**
     * Get defective equipment records flagged from this job order.
     */
    public function defectiveRecords(): HasMany
    {
        return $this->hasMany(DefectiveEquipment::class);
    }
}
