<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceType extends Model
{
    protected $fillable = ['category_id', 'service_name', 'default_action'];

    /**
     * Get the category this service type belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    /**
     * Get all request_services entries using this service type.
     */
    public function requestServices(): HasMany
    {
        return $this->hasMany(RequestService::class);
    }
}
