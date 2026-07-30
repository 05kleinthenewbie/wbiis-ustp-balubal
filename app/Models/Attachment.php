<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attachment extends Model
{
    protected $fillable = ['request_id', 'file_name', 'file_path', 'uploaded_at'];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    /**
     * Get the parent service request.
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class, 'request_id');
    }
}
