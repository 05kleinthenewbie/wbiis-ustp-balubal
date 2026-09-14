<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;

abstract class ApiController extends Controller
{
    /**
     * Get the authenticated user from the JWT (api) guard.
     */
    protected function user(): ?User
    {
        return auth('api')->user();
    }

    /**
     * Get the authenticated user's role name.
     */
    protected function roleName(): ?string
    {
        return $this->user()?->role?->role_name;
    }

    /**
     * Determine whether the authenticated user is an ICT admin.
     */
    protected function isAdmin(): bool
    {
        return $this->roleName() === 'ict_admin';
    }

    /**
     * Abort with a 403 response unless the authenticated user is an ICT admin.
     */
    protected function ensureAdmin(): void
    {
        abort_unless($this->isAdmin(), 403, 'Only ICT Admins can access this resource.');
    }
}
