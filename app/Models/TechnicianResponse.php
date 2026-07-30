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
        'date_responded',
        'date_resolved',
    ];

    protected $casts = [
        'date_responded' => 'datetime',
        'date_resolved' => 'datetime',
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
