import { router, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NotificationItem = {
    id: number;
    message: string;
    notification_type: string | null;
    created_at: string;
};

export function NotificationBell() {
    const { unreadNotifications } = usePage().props as unknown as {
        unreadNotifications: NotificationItem[];
    };

    const notifications = unreadNotifications ?? [];

    function markAllRead() {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    }

    function markOneRead(id: number) {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="size-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                            {notifications.length > 9 ? '9+' : notifications.length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between border-b px-3 py-2">
                    <p className="text-sm font-medium">Notifications</p>
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs text-ustp-navy hover:underline"
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                        No new notifications.
                    </p>
                ) : (
                    <div className="flex max-h-80 flex-col overflow-y-auto">
                        {notifications.map((notification) => (
                            <button
                                key={notification.id}
                                onClick={() => markOneRead(notification.id)}
                                className="border-b px-3 py-2.5 text-left text-sm last:border-0 hover:bg-muted/50"
                            >
                                <p>{notification.message}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {new Date(notification.created_at).toLocaleString()}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
