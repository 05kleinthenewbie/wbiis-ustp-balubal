<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Concerns\HasTeams;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property int|null $current_team_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Team|null $currentTeam
 * @property-read Collection<int, Team> $ownedTeams
 * @property-read Collection<int, Membership> $teamMemberships
 * @property-read Collection<int, Team> $teams
 */
#[Fillable(['name', 'email', 'password', 'current_team_id', 'role_id', 'department', 'contact_no', 'status'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasTeams, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the role assigned to this user.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get all service requests submitted by this user.
     */
    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }

    /**
     * Get all job orders assigned to this user (as technician).
     */
    public function assignedJobOrders(): HasMany
    {
        return $this->hasMany(JobOrder::class, 'assigned_to');
    }

    /**
     * Get all bookings made by this user.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get all bookings this user has approved (as admin).
     */
    public function approvedBookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'approved_by');
    }

    /**
     * Get all incidents reported by this user.
     */
    public function incidentReports(): HasMany
    {
        return $this->hasMany(IncidentReport::class, 'reported_by');
    }

    /**
     * Get all liability records assigned to this user.
     */
    public function userLiabilities(): HasMany
    {
        return $this->hasMany(UserLiability::class);
    }

    /**
     * Get all system notifications for this user.
     * Named differently from notifications() to avoid conflicting
     * with Laravel's built-in Notifiable trait relationship.
     */
    public function systemNotifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get all audit log entries created by this user (as admin).
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'admin_user_id');
    }
}
