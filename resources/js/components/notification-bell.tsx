import { router, usePage } from '@inertiajs/react';
import { Bell, BellRing, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type NotificationItem = {
    id: number;
    message: string;
    notification_type: string | null;
    notification_status: 'unread' | 'read';
    created_at: string;
};

const typeStyles: Record<string, { icon: typeof Bell; color: string }> = {
    service_request: { icon: BellRing, color: 'bg-ustp-light-blue/10 text-ustp-light-blue' },
    job_order: { icon: Bell, color: 'bg-ustp-gold/10 text-ustp-gold-dark' },
};

export function NotificationBell() {
    const { unreadNotifications, notifications } = usePage().props as unknown as {
        unreadNotifications: NotificationItem[];
        notifications: NotificationItem[];
    };

    const unread = unreadNotifications ?? [];
    const allNotifications = notifications ?? [];

    function markAllRead() {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    }

    function markOneRead(id: number) {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    }

    function deleteNotification(id: number) {
        router.delete(`/notifications/${id}`, { preserveScroll: true });
    }

    function typeIcon(notification: NotificationItem) {
        const style = typeStyles[notification.notification_type ?? ''];

        return style ?? typeStyles.job_order;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-ustp-navy-light hover:text-ustp-gold data-[state=open]:bg-ustp-navy-light data-[state=open]:text-ustp-gold"
                >
                    <Bell className="size-5" />

                    {unread.length > 0 && (
                        <span className="absolute top-0.5 right-0.5 flex size-4.5 items-center justify-center rounded-full bg-ustp-gold text-[10px] font-bold text-ustp-navy ring-2 ring-ustp-navy">
                            {unread.length > 9 ? '9+' : unread.length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 overflow-hidden rounded-xl border-ustp-gray-medium p-0 shadow-xl">
                {/* Header */}
                <div className="relative overflow-hidden bg-ustp-navy px-5 py-4">
                    <div className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-ustp-gold/[0.12] blur-2xl" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/15 text-ustp-gold">
                                <Bell className="size-5" />
                            </div>
                            <div>
                                <p className="font-serif text-sm font-bold text-white">
                                    Notifications
                                </p>
                                <p className="text-[11px] uppercase tracking-wider text-white/50">
                                    {unread.length > 0
                                        ? `${unread.length} unread`
                                        : 'You are all caught up'}
                                </p>
                            </div>
                        </div>
                        {unread.length > 0 && (
                            <button
                                onClick={markAllRead}
                                className="rounded-lg border border-ustp-gold/40 px-3 py-1.5 text-xs font-semibold text-ustp-gold transition-all hover:bg-ustp-gold hover:text-ustp-navy"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>

                {/* Body */}
                {allNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-ustp-gray text-ustp-navy/30 dark:bg-ustp-navy-light">
                            <Bell className="size-6 text-ustp-navy/30 dark:text-ustp-gold/60" />
                        </div>
                        <p className="mt-3 font-serif text-sm font-bold text-ustp-navy dark:text-white">
                            No notifications yet
                        </p>
                        <p className="mt-1 text-xs text-ustp-navy/50 dark:text-white/50">
                            You'll be notified here about requests, job orders, and bookings.
                        </p>
                    </div>
                ) : (
                    <div className="flex max-h-96 flex-col overflow-y-auto">
                        {allNotifications.map((notification) => {
                            const isUnread = notification.notification_status === 'unread';
                            const { icon: TypeIcon, color } = typeIcon(notification);

                            return (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        'group flex items-start gap-3 border-b border-ustp-gray-medium px-4 py-3 transition-colors last:border-0 hover:bg-ustp-gray/60 dark:border-white/10 dark:hover:bg-white/5',
                                        isUnread && 'bg-ustp-gold/[0.04] dark:bg-ustp-gold/[0.08]'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                                            color
                                        )}
                                    >
                                        <TypeIcon className="size-4" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <button
                                            onClick={() => markOneRead(notification.id)}
                                            className="block w-full text-left"
                                            title={isUnread ? 'Mark as read' : 'Notification read'}
                                        >
                                            <p
                                                className={cn(
                                                    'text-sm leading-snug',
                                                    isUnread
                                                        ? 'font-medium text-ustp-navy dark:text-white'
                                                        : 'text-ustp-navy/60 dark:text-white/60'
                                                )}
                                            >
                                                {notification.message}
                                            </p>
                                            <p className="mt-1 flex items-center gap-1.5 text-xs text-ustp-navy/40 dark:text-white/40">
                                                {isUnread && (
                                                    <span className="size-1.5 rounded-full bg-ustp-gold" />
                                                )}
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </button>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                        {isUnread && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => markOneRead(notification.id)}
                                                className="size-7 text-ustp-navy/40 hover:bg-ustp-gold/15 hover:text-ustp-navy dark:text-white/40 dark:hover:text-ustp-gold"
                                                title="Mark as read"
                                            >
                                                <Check className="size-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteNotification(notification.id)}
                                            className="size-7 text-ustp-navy/40 hover:bg-red-50 hover:text-red-500 dark:text-white/40 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                            title="Delete notification"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
