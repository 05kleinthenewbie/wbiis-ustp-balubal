import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowUpRight,
    Calendar,
    CalendarCheck,
    ChevronRight,
    Clock,
    ClipboardList,
    FileText,
    Layers,
    LayoutGrid,
    Package,
    Plus,
    TrendingUp,
    Wrench,
    Zap,
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

type StudentStats = {
    myRequests: number;
    pendingRequests: number;
    approvedRequests: number;
};

type RecentRequest = {
    id: number;
    user_name: string;
    priority: string;
    status: string;
    description: string;
    date: string | null;
};

type RecentJobOrder = {
    id: number;
    technician_name: string;
    status: string;
    date_assigned: string | null;
};

type RecentIncident = {
    id: number;
    reporter_name: string;
    type: string;
    status: string;
    date: string | null;
};

type RecentBooking = {
    id: number;
    user_name: string;
    facility: string;
    status: string;
    date: string | null;
};

type Props = {
    pendingInvitations?: DashboardInvitation[];
    stats: AdminStats | UserStats | StudentStats;
    isAdmin: boolean;
    isStudent: boolean;
    greeting: string;
    requestsByStatus: Record<string, number>;
    requestsByPriority: Record<string, number>;
    jobOrdersByStatus: Record<string, number>;
    inventorySummary: Record<string, number>;
    recentRequests: RecentRequest[];
    recentJobOrders: RecentJobOrder[];
    recentIncidents: RecentIncident[];
    recentBookings: RecentBooking[];
};

function StatCard({
    label,
    value,
    icon: Icon,
    href,
    accent = 'navy',
    trend,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    href: string;
    accent?: 'navy' | 'gold';
    trend?: { value: string; direction: 'up' | 'down' };
}) {
    const accentStyles = {
        navy: {
            card: 'border-ustp-blue-accent/50 bg-ustp-blue-accent/20 hover:bg-ustp-blue-accent/30 hover:border-ustp-blue-accent/70',
            iconBg: 'bg-ustp-light-blue/15',
            iconText: 'text-ustp-light-blue',
        },
        gold: {
            card: 'border-ustp-gold/25 bg-ustp-gold/[0.06] hover:bg-ustp-gold/10 hover:border-ustp-gold/40',
            iconBg: 'bg-ustp-gold/15',
            iconText: 'text-ustp-gold',
        },
    };

    const styles = accentStyles[accent];

    return (
        <Link
            href={href}
            className={`group overflow-hidden rounded-2xl border p-5 transition-all ${styles.card}`}
        >
            <div className="flex items-start justify-between">
                <div
                    className={`flex size-10 items-center justify-center rounded-xl ${styles.iconBg}`}
                >
                    <Icon className={`size-5 ${styles.iconText}`} />
                </div>

                <div className="flex items-center gap-2">
                    {trend && (
                        <span
                            className={`text-[11px] font-medium ${
                                trend.direction === 'up'
                                    ? 'text-emerald-400'
                                    : 'text-red-400'
                            }`}
                        >
                            {trend.direction === 'up' ? '+' : ''}
                            {trend.value}
                        </span>
                    )}
                    <ChevronRight className="size-4 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-white/50" />
                </div>
            </div>

            <div className="mt-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
                    {label}
                </p>
                <p className="mt-1.5 text-3xl font-semibold tracking-tight text-white">
                    {value}
                </p>
            </div>
        </Link>
    );
}

function HorizontalBarChart({
    data,
    colors,
    total,
}: {
    data: Record<string, number>;
    colors: Record<string, string>;
    total: number;
}) {
    const entries = Object.entries(data).filter(([, v]) => v > 0);

    return (
        <div className="space-y-3">
            {entries.map(([key, count]) => {
                const pct = total > 0 ? (count / total) * 100 : 0;

                return (
                    <div key={key}>
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-xs font-medium capitalize text-white/70">
                                {key.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-semibold text-white/90">
                                {count}
                                <span className="ml-1 text-white/40">
                                    ({Math.round(pct)}%)
                                </span>
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${colors[key] ?? 'bg-white/20'}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
            {entries.length === 0 && (
                <p className="py-4 text-center text-xs text-white/30">No data yet</p>
            )}
        </div>
    );
}

function RingChart({
    data,
    strokeColors,
    dotClasses,
    total,
    centerLabel,
}: {
    data: Record<string, number>;
    strokeColors: Record<string, string>;
    dotClasses: Record<string, string>;
    total: number;
    centerLabel: string;
}) {
    const entries = Object.entries(data).filter(([, v]) => v > 0);
    const size = 120;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulated = 0;
    const segments = entries.map(([key, count]) => {
        const pct = total > 0 ? count / total : 0;
        const dashLength = circumference * pct;
        const dashOffset = circumference * (1 - accumulated / total);
        accumulated += count;

        return {
            key,
            count,
            pct,
            dashLength: dashLength - 1,
            dashOffset,
            color: strokeColors[key] ?? 'rgba(255,255,255,0.2)',
        };
    });

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <svg width={size} height={size} className="-rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={strokeWidth}
                    />
                    {segments.map((seg) => (
                        <circle
                            key={seg.key}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                            strokeDashoffset={seg.dashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{total}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/40">
                        {centerLabel}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {entries.map(([key, count]) => (
                    <div key={key} className="flex items-center gap-2">
                        <span
                            className={`size-2.5 rounded-full ${dotClasses[key] ?? 'bg-white/20'}`}
                        />
                        <span className="text-xs capitalize text-white/60">
                            {key.replace('_', ' ')}
                        </span>
                        <span className="ml-auto text-xs font-semibold text-white/80">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RecentRequestsTable({ requests }: { requests: RecentRequest[] }) {
    const statusBadge: Record<string, string> = {
        pending: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
        approved: 'border-ustp-light-blue/30 bg-ustp-light-blue/10 text-ustp-light-blue',
        rejected: 'border-red-400/30 bg-red-400/10 text-red-300',
        completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    };

    const priorityBadge: Record<string, string> = {
        low: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
        medium: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
        high: 'border-orange-400/30 bg-orange-400/10 text-orange-300',
        urgent: 'border-red-400/30 bg-red-400/10 text-red-300',
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/[0.06] bg-[#0a0f1c]/80">
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                            Requester
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                            Description
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                            Priority
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                            When
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r) => (
                        <tr
                            key={r.id}
                            className="border-b border-[#151c2c] transition-colors hover:bg-[#111827]/70"
                        >
                            <td className="px-4 py-3 text-sm font-medium text-white/90">
                                {r.user_name}
                            </td>
                            <td className="max-w-[200px] truncate px-4 py-3 text-sm text-white/50">
                                {r.description || '—'}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${priorityBadge[r.priority] ?? 'border-white/20 bg-white/5 text-white/60'}`}
                                >
                                    {r.priority}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge[r.status] ?? 'border-white/20 bg-white/5 text-white/60'}`}
                                >
                                    {r.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-white/40">
                                {r.date ? formatRelativeTime(r.date) : '—'}
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-8 text-center text-sm text-white/30"
                            >
                                No service requests yet
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function ActivityFeed({
    recentRequests,
    recentJobOrders,
    recentIncidents,
    recentBookings,
}: {
    recentRequests: RecentRequest[];
    recentJobOrders: RecentJobOrder[];
    recentIncidents: RecentIncident[];
    recentBookings: RecentBooking[];
}) {
    type ActivityItem = {
        id: string;
        icon: React.ElementType;
        iconBg: string;
        iconText: string;
        title: string;
        subtitle: string;
        date: string | null;
        href: string;
    };

    const items: ActivityItem[] = [];

    recentRequests.forEach((r) => {
        items.push({
            id: `req-${r.id}`,
            icon: FileText,
            iconBg: 'bg-ustp-light-blue/10',
            iconText: 'text-ustp-light-blue',
            title: `Service request from ${r.user_name}`,
            subtitle: `${r.status.replace('_', ' ')} · ${r.priority} priority`,
            date: r.date,
            href: `/requests/${r.id}`,
        });
    });

    recentJobOrders.forEach((jo) => {
        items.push({
            id: `jo-${jo.id}`,
            icon: Wrench,
            iconBg: 'bg-ustp-gold/10',
            iconText: 'text-ustp-gold',
            title: `Job order → ${jo.technician_name}`,
            subtitle: jo.status.replace('_', ' '),
            date: jo.date_assigned,
            href: `/job-orders/${jo.id}`,
        });
    });

    recentIncidents.forEach((i) => {
        items.push({
            id: `inc-${i.id}`,
            icon: AlertTriangle,
            iconBg: 'bg-red-400/10',
            iconText: 'text-red-400',
            title: `Incident by ${i.reporter_name}`,
            subtitle: `${i.type} · ${i.status.replace('_', ' ')}`,
            date: i.date,
            href: `/incidents/${i.id}`,
        });
    });

    recentBookings.forEach((b) => {
        items.push({
            id: `bk-${b.id}`,
            icon: Calendar,
            iconBg: 'bg-emerald-400/10',
            iconText: 'text-emerald-400',
            title: `Booking by ${b.user_name}`,
            subtitle: `${b.facility} · ${b.status}`,
            date: b.date,
            href: `/bookings/${b.id}`,
        });
    });

    items.sort((a, b) => {
        if (!a.date) {
            return 1;
        }

        if (!b.date) {
            return -1;
        }

        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const visible = items.slice(0, 8);

    return (
        <div className="space-y-0">
            {visible.map((item, idx) => {
                const Icon = item.icon;

                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className="group flex gap-3 py-3 transition-colors hover:bg-white/[0.02] rounded-lg px-2 -mx-2"
                    >
                        <div className="relative flex flex-col items-center">
                            <div
                                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                            >
                                <Icon className={`size-4 ${item.iconText}`} />
                            </div>
                            {idx < visible.length - 1 && (
                                <div className="mt-1 w-px flex-1 bg-white/[0.06]" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                            <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                                {item.title}
                            </p>
                            <p className="mt-0.5 text-xs capitalize text-white/40">
                                {item.subtitle}
                            </p>
                        </div>
                        <span className="shrink-0 text-[11px] text-white/30 pt-0.5">
                            {item.date ? formatRelativeTime(item.date) : ''}
                        </span>
                    </Link>
                );
            })}
            {visible.length === 0 && (
                <p className="py-8 text-center text-sm text-white/30">
                    No recent activity
                </p>
            )}
        </div>
    );
}

function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) {
        return 'just now';
    }

    if (diffMin < 60) {
        return `${diffMin}m ago`;
    }

    if (diffHr < 24) {
        return `${diffHr}h ago`;
    }

    if (diffDay < 7) {
        return `${diffDay}d ago`;
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Dashboard({
    pendingInvitations = [],
    stats,
    isAdmin,
    isStudent,
    greeting,
    requestsByStatus,
    requestsByPriority,
    jobOrdersByStatus,
    inventorySummary,
    recentRequests,
    recentJobOrders,
    recentIncidents,
    recentBookings,
}: Props) {
    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );
    const { auth } = usePage().props as any;
    const userName = auth?.user?.name?.split(' ')[0] ?? 'User';

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const reqTotal = Object.values(requestsByStatus).reduce((a, b) => a + b, 0);
    const joTotal = Object.values(jobOrdersByStatus).reduce((a, b) => a + b, 0);
    const invTotal = Object.values(inventorySummary).reduce((a, b) => a + b, 0);

    return (
        <>
            <Head title="Dashboard" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <div className="relative min-h-full flex-1 overflow-hidden bg-[#070b18] px-4 py-6 text-white sm:px-6 lg:px-8">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-ustp-gold/[0.015] blur-3xl" />

                {/* Subtle dot pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, #fcb315 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                <div className="relative mx-auto max-w-7xl space-y-6">
                    {/* ── Welcome header ── */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                                    {isAdmin ? 'ICT Admin Overview' : 'Dashboard'}
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-white">
                                {greeting}, {userName}
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50">
                                {isAdmin
                                    ? 'Here\u2019s what needs your attention today.'
                                    : 'A quick look at your requests and bookings.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
                            <Clock className="size-4 text-white/40" />
                            <span className="text-sm text-white/60">{today}</span>
                        </div>
                    </div>

                    {/* ── Stat cards ── */}
                    <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {isAdmin ? (
                            <>
                                <StatCard
                                    label="Pending Requests"
                                    value={(stats as AdminStats).pendingRequests}
                                    icon={FileText}
                                    href="/requests"
                                    accent="navy"
                                />
                                <StatCard
                                    label="Open Job Orders"
                                    value={(stats as AdminStats).openJobOrders}
                                    icon={ClipboardList}
                                    href="/job-orders"
                                    accent="navy"
                                />
                                <StatCard
                                    label="Pending Bookings"
                                    value={(stats as AdminStats).pendingBookings}
                                    icon={Calendar}
                                    href="/bookings"
                                    accent="gold"
                                />
                                <StatCard
                                    label="Open Incidents"
                                    value={(stats as AdminStats).openIncidents}
                                    icon={AlertTriangle}
                                    href="/incidents"
                                    accent="gold"
                                />
                            </>
                        ) : isStudent ? (
                            <>
                                <StatCard
                                    label="My Requests"
                                    value={(stats as StudentStats).myRequests}
                                    icon={FileText}
                                    href="/requests"
                                    accent="navy"
                                />
                                <StatCard
                                    label="Pending Requests"
                                    value={(stats as StudentStats).pendingRequests}
                                    icon={ClipboardList}
                                    href="/requests"
                                    accent="gold"
                                />
                                <StatCard
                                    label="Approved Requests"
                                    value={(stats as StudentStats).approvedRequests}
                                    icon={CalendarCheck}
                                    href="/requests"
                                    accent="navy"
                                />
                            </>
                        ) : (
                            <>
                                <StatCard
                                    label="My Requests"
                                    value={(stats as UserStats).myRequests}
                                    icon={FileText}
                                    href="/requests"
                                    accent="navy"
                                />
                                <StatCard
                                    label="Pending Requests"
                                    value={(stats as UserStats).pendingRequests}
                                    icon={ClipboardList}
                                    href="/requests"
                                    accent="gold"
                                />
                                <StatCard
                                    label="My Bookings"
                                    value={(stats as UserStats).myBookings}
                                    icon={Calendar}
                                    href="/bookings"
                                    accent="navy"
                                />
                                <StatCard
                                    label="Upcoming Bookings"
                                    value={(stats as UserStats).upcomingBookings}
                                    icon={CalendarCheck}
                                    href="/bookings"
                                    accent="gold"
                                />
                            </>
                        )}
                    </div>

                    {/* ── Main content: two-column ── */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* LEFT: wider column */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Requests by Status */}
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-blue-accent/15">
                                        <Layers className="size-4 text-ustp-light-blue" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            Requests by Status
                                        </h3>
                                        <p className="text-[11px] text-white/40">
                                            {reqTotal} total requests
                                        </p>
                                    </div>
                                </div>
                                <HorizontalBarChart
                                    data={requestsByStatus}
                                    total={reqTotal}
                                    colors={{
                                        pending: 'bg-amber-400',
                                        approved: 'bg-ustp-light-blue',
                                        rejected: 'bg-red-400',
                                        completed: 'bg-emerald-400',
                                    }}
                                />
                            </div>

                            {/* Requests by Priority */}
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <Zap className="size-4 text-ustp-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            Requests by Priority
                                        </h3>
                                        <p className="text-[11px] text-white/40">
                                            Distribution across priority levels
                                        </p>
                                    </div>
                                </div>
                                <HorizontalBarChart
                                    data={requestsByPriority}
                                    total={reqTotal}
                                    colors={{
                                        low: 'bg-slate-400',
                                        medium: 'bg-blue-400',
                                        high: 'bg-orange-400',
                                        urgent: 'bg-red-400',
                                    }}
                                />
                            </div>

                            {/* Recent Service Requests table */}
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-light-blue/10">
                                            <TrendingUp className="size-4 text-ustp-light-blue" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">
                                                Recent Requests
                                            </h3>
                                            <p className="text-[11px] text-white/40">
                                                Latest service requests
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/requests"
                                        className="group flex items-center gap-1 text-xs font-medium text-ustp-light-blue/70 transition-colors hover:text-ustp-light-blue"
                                    >
                                        View all
                                        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                                <RecentRequestsTable requests={recentRequests} />
                            </div>
                        </div>

                        {/* RIGHT: narrower column */}
                        <div className="space-y-6">
                            {/* Job Orders ring chart — admin only */}
                            {isAdmin && (
                                <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                            <Wrench className="size-4 text-ustp-gold" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">
                                                Job Orders
                                            </h3>
                                            <p className="text-[11px] text-white/40">
                                                Status overview
                                            </p>
                                        </div>
                                    </div>
                                    <RingChart
                                        data={jobOrdersByStatus}
                                        total={joTotal}
                                        centerLabel="orders"
                                        strokeColors={{
                                            open: 'rgba(148,163,184,0.9)',
                                            in_progress: 'rgba(251,191,36,0.9)',
                                            completed: 'rgba(50,157,234,0.9)',
                                            closed: 'rgba(52,211,153,0.9)',
                                        }}
                                        dotClasses={{
                                            open: 'bg-slate-400',
                                            in_progress: 'bg-amber-400',
                                            completed: 'bg-ustp-light-blue',
                                            closed: 'bg-emerald-400',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Inventory Health — admin only */}
                            {isAdmin && (
                                <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-400/10">
                                            <Package className="size-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">
                                                Inventory Health
                                            </h3>
                                            <p className="text-[11px] text-white/40">
                                                Equipment condition breakdown
                                            </p>
                                        </div>
                                    </div>
                                    <RingChart
                                        data={inventorySummary}
                                        total={invTotal}
                                        centerLabel="items"
                                        strokeColors={{
                                            working: 'rgba(52,211,153,0.9)',
                                            defective: 'rgba(248,113,113,0.9)',
                                            under_repair: 'rgba(251,191,36,0.9)',
                                        }}
                                        dotClasses={{
                                            working: 'bg-emerald-400',
                                            defective: 'bg-red-400',
                                            under_repair: 'bg-amber-400',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Recent Activity Feed */}
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-white/5">
                                        <Clock className="size-4 text-white/50" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            Recent Activity
                                        </h3>
                                        <p className="text-[11px] text-white/40">
                                            Across all modules
                                        </p>
                                    </div>
                                </div>
                                <ActivityFeed
                                    recentRequests={recentRequests}
                                    recentJobOrders={recentJobOrders}
                                    recentIncidents={recentIncidents}
                                    recentBookings={recentBookings}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Quick actions ── */}
                    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                        <div className="border-b border-white/[0.08] px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-blue-accent/30">
                                    <LayoutGrid className="size-4 text-ustp-light-blue" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        Quick actions
                                    </h2>
                                    <p className="mt-0.5 text-xs text-white/40">
                                        Common tasks and shortcuts
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid divide-y divide-white/[0.08] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                            {!isAdmin && !isStudent && (
                                <Link
                                    href="/requests/create"
                                    className="group flex items-center gap-4 p-5 transition-colors hover:bg-white/[0.04]"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-ustp-light-blue/10">
                                        <Plus className="size-5 text-ustp-light-blue" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white">
                                            Submit a request
                                        </p>
                                        <p className="mt-0.5 text-xs text-white/40">
                                            Request ICT services
                                        </p>
                                    </div>

                                    <ChevronRight className="size-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-white/50" />
                                </Link>
                            )}

                            {isAdmin && (
                                <Link
                                    href="/requests"
                                    className="group flex items-center gap-4 p-5 transition-colors hover:bg-white/[0.04]"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-ustp-light-blue/10">
                                        <FileText className="size-5 text-ustp-light-blue" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white">
                                            Manage requests
                                        </p>
                                        <p className="mt-0.5 text-xs text-white/40">
                                            Review pending submissions
                                        </p>
                                    </div>

                                    <ChevronRight className="size-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-white/50" />
                                </Link>
                            )}

                            <Link
                                href={isAdmin ? '/bookings' : '/bookings/create'}
                                className="group flex items-center gap-4 p-5 transition-colors hover:bg-white/[0.04]"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-ustp-gold/10">
                                    <Calendar className="size-5 text-ustp-gold" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-white">
                                        {isAdmin ? 'Review bookings' : 'Book a facility'}
                                    </p>
                                    <p className="mt-0.5 text-xs text-white/40">
                                        {isAdmin
                                            ? 'Approve or reject reservations'
                                            : 'Reserve a computer lab or AV room'}
                                    </p>
                                </div>

                                <ChevronRight className="size-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-ustp-gold/60" />
                            </Link>

                            <Link
                                href="/incidents"
                                className="group flex items-center gap-4 p-5 transition-colors hover:bg-white/[0.04]"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-red-400/10">
                                    <AlertTriangle className="size-5 text-red-400" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-white">
                                        {isAdmin ? 'Review incidents' : 'Report an incident'}
                                    </p>
                                    <p className="mt-0.5 text-xs text-white/40">
                                        {isAdmin
                                            ? 'Manage open incident reports'
                                            : 'Report equipment issues'}
                                    </p>
                                </div>

                                <ChevronRight className="size-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-white/50" />
                            </Link>

                            {isAdmin && (
                                <Link
                                    href="/inventory"
                                    className="group flex items-center gap-4 p-5 transition-colors hover:bg-white/[0.04]"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/10">
                                        <Package className="size-5 text-emerald-400" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white">
                                            Inventory
                                        </p>
                                        <p className="mt-0.5 text-xs text-white/40">
                                            Manage equipment records
                                        </p>
                                    </div>

                                    <ChevronRight className="size-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-white/50" />
                                </Link>
                            )}
                        </div>
                    </div>
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
