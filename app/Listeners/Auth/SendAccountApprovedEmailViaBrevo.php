<?php

namespace App\Listeners\Auth;

use App\Events\UserApproved;
use App\Services\BrevoMailService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendAccountApprovedEmailViaBrevo implements ShouldQueue
{
    public function __construct(private BrevoMailService $brevo)
    {
        //
    }

    public function handle(UserApproved $event): void
    {
        $user = $event->user;

        if (! is_string($user->email) || $user->email === '') {
            return;
        }

        // Let exceptions bubble up so queue:work shows FAIL instead of a
        // misleading DONE when Brevo rejects the send.
        $this->brevo->sendAccountApprovedEmail($user->email, (string) ($user->name ?? $user->email));
    }

    public function failed(UserApproved $event, \Throwable $e): void
    {
        Log::error('Brevo account-approved email failed', [
            'email' => $event->user->email ?? null,
            'error' => $e->getMessage(),
        ]);
    }
}
