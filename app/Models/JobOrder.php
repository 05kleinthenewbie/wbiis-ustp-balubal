<?php

namespace App\Models;

use App\Services\PrioritizationService;
use App\Traits\HasFormNumber;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobOrder extends Model
{
    use HasFactory, HasFormNumber;

    public const FORM_PREFIX = 'JO';

    protected $fillable = [
        'request_id',
        'job_order_number',
        'assigned_to',
        'status',
        'report',
        'resolution',
        'final_remarks',
        'action_taken',
        'date_assigned',
        'date_completed',
        'date_in_progress',
        'date_closed',
        'rating',
        'requester_comment',
        'sla_deadline',
        'sla_status',
        'priority_level',
        'support_type',
        'user_permission_granted',
        'estimated_repair_days',
        'replacement_provided',
        'replacement_item_id',
    ];

    protected $casts = [
        'date_assigned' => 'datetime',
        'date_completed' => 'datetime',
        'date_in_progress' => 'datetime',
        'date_closed' => 'datetime',
        'sla_deadline' => 'datetime',
        'rating' => 'integer',
        'user_permission_granted' => 'boolean',
        'replacement_provided' => 'boolean',
    ];

    protected $appends = ['replacement_due'];

    /**
     * Temporary replacement is due when equipment is out of service over five days.
     */
    protected function replacementDue(): Attribute
    {
        return Attribute::get(fn (): bool => PrioritizationService::shouldProvideReplacement($this));
    }

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

    /**
     * Get the replacement item assigned to this job order.
     */
    public function replacementItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'replacement_item_id');
    }

    public function scopeForStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeForTechnician(Builder $query, int $userId): Builder
    {
        return $query->where('assigned_to', $userId);
    }
}
