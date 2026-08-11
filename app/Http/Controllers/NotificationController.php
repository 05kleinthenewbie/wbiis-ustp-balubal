<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function markAsRead(string $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->update([
            'notification_status' => 'read',
            'read_at' => now(),
        ]);

        return redirect()->back();
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('notification_status', 'unread')
            ->update([
                'notification_status' => 'read',
                'read_at' => now(),
            ]);

        return redirect()->back();
    }
}
