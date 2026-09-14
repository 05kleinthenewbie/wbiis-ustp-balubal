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

    /**
     * Convenience helper to record an audit log entry.
     */
    public static function record(string $action, string $module, int $recordId, ?string $details = null): void
    {
        static::create([
            'admin_user_id' => Auth::id() ?? Auth::guard('api')->id(),
            'action_taken' => $action,
            'module_name' => $module,
            'record_id' => $recordId,
            'action_date' => now(),
            'details' => $details,
        ]);
    }
}
