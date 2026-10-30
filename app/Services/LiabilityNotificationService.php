<?php

namespace App\Services;

use App\Mail\LiabilityUpdated;
use App\Models\Notification;
use App\Models\UserLiability;
use Illuminate\Support\Facades\Mail;

class LiabilityNotificationService
{
    public function send(UserLiability $liability, bool $assigned): void
    {
        $message = $assigned
            ? 'You have been assigned liability #'.$liability->id.' for laboratory incident #'.$liability->incident_id.'.'
            : 'Your liability #'.$liability->id.' has been marked '.$liability->liability_status.'.';

        Notification::create([
            'user_id' => $liability->user_id,
            'message' => $message,
            'notification_type' => 'liability',
            'link' => route('liabilities.index', ['liability' => $liability->id], false),
            'notification_status' => 'unread',
        ]);

        if (filled($liability->user?->email)) {
            Mail::to($liability->user->email)->queue((new LiabilityUpdated(
                $liability->user->name,
                $message,
                $liability->liability_description,
                $liability->liability_amount,
                $liability->id,
            ))->afterCommit());
        }
    }
}
