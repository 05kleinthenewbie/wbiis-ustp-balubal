<?php

namespace App\Models;

use App\Traits\HasFormNumber;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceRequest extends Model
{
    use HasFactory, HasFormNumber;

    public const FORM_PREFIX = 'SR';

    protected $fillable = [
        'user_id',
        'form_number',
        'approved_by',
        'problem_description',
        'priority_level',
        'request_status',
        'date_requested',
        'date_approved',
        'rejection_reason',
        'location',
        'contact_details',
        'sla_deadline',
        'sla_status',
    ];

    protected $casts = [
        'date_requested' => 'datetime',
        'date_approved' => 'datetime',
        'sla_deadline' => 'datetime',
    ];

    /**
     * Get the user who submitted this request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who approved/rejected this request.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
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

    public function scopeForStatus(Builder $query, string $status): Builder
    {
        return $query->where('request_status', $status);
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForPriority(Builder $query, string $priority): Builder
    {
        return $query->where('priority_level', $priority);
    }
}
