<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = [
        'admin_user_id',
        'action_taken',
        'module_name',
        'record_id',
        'action_date',
        'details',
    ];

    protected $casts = [
        'action_date' => 'datetime',
    ];

    /**
     * Get the admin who performed this action.
     */
    public function adminUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }
}
