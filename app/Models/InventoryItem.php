<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = [
        'property_no',
        'item_name',
        'brand',
        'model',
        'serial_no',
        'location',
        'condition',
        'status',
        'purchase_date',
    ];

    protected $casts = [
        'purchase_date' => 'date',
    ];

    /**
     * Get all request_items referencing this inventory item.
     */
    public function requestItems(): HasMany
    {
        return $this->hasMany(RequestItem::class, 'item_id');
    }

    /**
     * Get all defective_equipment records for this item.
     */
    public function defectiveRecords(): HasMany
    {
        return $this->hasMany(DefectiveEquipment::class, 'item_id');
    }

    /**
     * Get all incident_reports referencing this item.
     */
    public function incidentReports(): HasMany
    {
        return $this->hasMany(IncidentReport::class, 'item_id');
    }
}
