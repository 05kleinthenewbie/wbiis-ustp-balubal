<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestService extends Model
{
    protected $fillable = [
        'request_id',
        'service_type_id',
        'specification',
        'quantity',
        'action_type',
    ];

    /**
     * Get the parent service request.
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class, 'request_id');
    }

    /**
     * Get the service type selected (category/type hierarchy).
     */
    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }
}
