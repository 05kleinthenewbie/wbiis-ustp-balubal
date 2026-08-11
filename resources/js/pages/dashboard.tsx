import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CalendarCheck,
    ClipboardList,
    FileText,
} from 'lucide-react';
import { useState } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import type { DashboardInvitation } from '@/types';

type AdminStats = {
    pendingRequests: number;
    openJobOrders: number;
    pendingBookings: number;
    openIncidents: number;
};

type UserStats = {
    myRequests: number;
    pendingRequests: number;
    myBookings: number;
    upcomingBookings: number;
};

type Props = {
    pendingInvitations?: DashboardInvitation[];
    stats: AdminStats | UserStats;
    isAdmin: boolean;
};

function StatCard({
    label,
    value,
    icon: Icon,
    href,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="rounded-xl border p-4 transition-colors hover:bg-muted/50"
        >
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold">{value}</p>
        </Link>
    );
}

export default function Dashboard({
    pendingInvitations = [],
    stats,
    isAdmin,
}: Props) {
    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );

    return (
        <>
            <Head title="Dashboard" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">
                        {isAdmin ? 'ICT Admin Overview' : 'Dashboard'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isAdmin
                            ? "Here's what needs your attention."
                            : 'A quick look at your requests and bookings.'}
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {isAdmin ? (
                        <>
                            <StatCard
                                label="Pending Requests"
                                value={(stats as AdminStats).pendingRequests}
                                icon={FileText}
                                href="/requests"
                            />
                            <StatCard
                                label="Open Job Orders"
                                value={(stats as AdminStats).openJobOrders}
                                icon={ClipboardList}
                                href="/job-orders"
                            />
                            <StatCard
                                label="Pending Bookings"
                                value={(stats as AdminStats).pendingBookings}
                                icon={Calendar}
                                href="/bookings"
                            />
                            <StatCard
                                label="Open Incidents"
                                value={(stats as AdminStats).openIncidents}
                                icon={AlertTriangle}
                                href="/incidents"
                            />
                        </>
                    ) : (
                        <>
                            <StatCard
                                label="My Requests"
                                value={(stats as UserStats).myRequests}
                                icon={FileText}
                                href="/requests"
                            />
                            <StatCard
                                label="Pending Requests"
                                value={(stats as UserStats).pendingRequests}
                                icon={ClipboardList}
                                href="/requests"
                            />
                            <StatCard
                                label="My Bookings"
                                value={(stats as UserStats).myBookings}
                                icon={Calendar}
                                href="/bookings"
                            />
                            <StatCard
                                label="Upcoming Bookings"
                                value={(stats as UserStats).upcomingBookings}
                                icon={CalendarCheck}
                                href="/bookings"
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
