<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class AuditLog extends Model
{
    protected $fillable = [
        'admin_user_id',
        'action_taken',
        'module_name',
        'record_id',
        'action_date',
        'details',
        'old_values',
        'new_values',
    ];

    protected $casts = [
        'action_date' => 'datetime',
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    /**
     * Get the admin who performed this action.
     */
    public function adminUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }

    /**
     * Convenience helper to record an audit log entry.
     *
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    public static function record(
        string $action,
        string $module,
        int $recordId,
        ?string $details = null,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        static::create([
            'admin_user_id' => Auth::id() ?? Auth::guard('api')->id(),
            'action_taken' => $action,
            'module_name' => $module,
            'record_id' => $recordId,
            'action_date' => now(),
            'details' => $details,
            'old_values' => $oldValues,
            'new_values' => $newValues,
        ]);
    }
}
