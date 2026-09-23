<?php

namespace App\Listeners\Auth;

use App\Services\BrevoMailService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendWelcomeEmailViaBrevo implements ShouldQueue
{
    public function __construct(private BrevoMailService $brevo)
    {
        //
    }

    public function handle(Registered $event): void
    {
        $user = $event->user;

        if (! is_string($user->email) || $user->email === '') {
            return;
        }

        // Refresh so the email reflects the account's current status — an
        // admin may have approved it while this job waited in the queue.
        $user->refresh();

        // Let exceptions bubble up so queue:work shows FAIL instead of a
        // misleading DONE when Brevo rejects the send.
        $this->brevo->sendWelcomeEmail(
            $user->email,
            (string) ($user->name ?? $user->email),
            $user->status === 'active',
        );
    }

    public function failed(Registered $event, \Throwable $e): void
    {
        Log::error('Brevo welcome email failed', [
            'email' => $event->user->email ?? null,
            'error' => $e->getMessage(),
        ]);
    }
}
