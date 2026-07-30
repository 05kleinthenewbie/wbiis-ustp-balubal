<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DefectiveEquipment extends Model
{
    protected $fillable = [
        'item_id',
        'job_order_id',
        'damage_description',
        'repair_status',
        'date_reported',
    ];

    protected $casts = [
        'date_reported' => 'datetime',
    ];

    /**
     * Get the inventory item flagged as defective.
     */
    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'item_id');
    }

    /**
     * Get the job order this defect was flagged from.
     */
    public function jobOrder(): BelongsTo
    {
        return $this->belongsTo(JobOrder::class);
    }
}
