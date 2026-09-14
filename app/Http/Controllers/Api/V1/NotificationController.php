<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;

class NotificationController extends ApiController
{
    /**
     * List the authenticated user's notifications.
     */
    public function index(): JsonResponse
    {
        $notifications = Notification::where('user_id', $this->user()->id)
            ->latest()
            ->paginate(20);

        return response()->json([
            'data' => $notifications->items(),
            'unread_count' => Notification::where('user_id', $this->user()->id)
                ->where('notification_status', 'unread')
                ->count(),
            'meta' => collect($notifications->toArray())->except(['data']),
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(string $id): JsonResponse
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $this->user()->id)
            ->firstOrFail();

        $notification->update([
            'notification_status' => 'read',
            'read_at' => now(),
        ]);

        return response()->json(['message' => 'Notification marked as read.', 'notification' => $notification]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): JsonResponse
    {
        Notification::where('user_id', $this->user()->id)
            ->where('notification_status', 'unread')
            ->update([
                'notification_status' => 'read',
                'read_at' => now(),
            ]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    /**
     * Delete a notification.
     */
    public function destroy(string $id): JsonResponse
    {
        Notification::where('id', $id)
            ->where('user_id', $this->user()->id)
            ->firstOrFail()
            ->delete();

        return response()->json(['message' => 'Notification deleted.']);
    }
}
