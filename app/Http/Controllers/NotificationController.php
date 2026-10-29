<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'status' => ['nullable', 'in:all,unread,read'],
        ]);
        $status = $filters['status'] ?? 'all';
        $query = Notification::where('user_id', $request->user()->id);
        $total = (clone $query)->count();
        $unread = (clone $query)->where('notification_status', 'unread')->count();

        return Inertia::render('notifications/index', [
            'notificationHistory' => $query
                ->when($status !== 'all', fn ($query) => $query->where('notification_status', $status))
                ->latest()->orderByDesc('id')->paginate(20)->withQueryString(),
            'counts' => ['all' => $total, 'unread' => $unread, 'read' => $total - $unread],
            'filters' => ['status' => $status],
        ]);
    }

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

    public function destroy(string $id)
    {
        Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail()
            ->delete();

        return redirect()->back();
    }
}
