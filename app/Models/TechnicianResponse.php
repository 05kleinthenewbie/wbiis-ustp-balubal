<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechnicianResponse extends Model
{
    protected $fillable = [
        'technician_id',
        'job_order_id',
        'response_report',
        'response_type',
        'date_responded',
        'date_resolved',
        'time_spent_minutes',
    ];

    protected $casts = [
        'date_responded' => 'datetime',
        'date_resolved' => 'datetime',
        'time_spent_minutes' => 'integer',
    ];

    /**
     * Get the technician who posted this response.
     */
    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    /**
     * Get the parent job order.
     */
    public function jobOrder(): BelongsTo
    {
        return $this->belongsTo(JobOrder::class);
    }
}
