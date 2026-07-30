<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceCategory extends Model
{
    protected $fillable = ['category_name', 'description'];

    /**
     * Get all service types under this category.
     */
    public function serviceTypes(): HasMany
    {
        return $this->hasMany(ServiceType::class, 'category_id');
    }
}
