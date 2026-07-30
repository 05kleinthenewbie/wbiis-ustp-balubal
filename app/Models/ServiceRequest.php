<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceRequest extends Model
{
    protected $fillable = [
        'user_id',
        'problem_description',
        'priority_level',
        'request_status',
        'date_requested',
    ];

    protected $casts = [
        'date_requested' => 'datetime',
    ];

    /**
     * Get the user who submitted this request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the inventory items linked to this request.
     */
    public function requestItems(): HasMany
    {
        return $this->hasMany(RequestItem::class, 'request_id');
    }

    /**
     * Get the specific services requested (category/type/qty/action).
     */
    public function requestServices(): HasMany
    {
        return $this->hasMany(RequestService::class, 'request_id');
    }

    /**
     * Get file attachments for this request.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'request_id');
    }

    /**
     * Get job orders generated from this request.
     */
    public function jobOrders(): HasMany
    {
        return $this->hasMany(JobOrder::class, 'request_id');
    }
}
