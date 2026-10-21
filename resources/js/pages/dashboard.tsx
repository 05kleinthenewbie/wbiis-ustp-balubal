import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowUpRight,
    Calendar,
    Clock,
    ClipboardList,
    FileText,
    Layers,
    Package,
    TrendingUp,
    Wrench,
} from 'lucide-react';

type Period = 'week' | 'month' | 'year';

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

type Overview = {
    serviceRequests: {
        total: number;
        pending: number;
        approved?: number;
        completed?: number;
    };
    jobOrders?: { total: number; inProgress: number; unassigned?: number };
    inventory?: { total: number; defective: number };
    bookings?: { total: number; pending: number };
    incidents?: { total: number; unresolved: number };
    pendingActions: { total: number };
};

type PendingActions = {
    requestApprovals: number;
    jobOrdersInProgress?: number;
    rejectedRequests?: number;
    bookingApprovals?: number;
    overdueJobOrders?: number;
    incidentsUnresolved?: number;
};

type InventoryAlerts = {
    expiringSoon: number;
    expired: number;
    defective: number;
    underRepair: number;
};

type ActivitySeries = {
    labels: string[];
    requests?: number[];
    bookings?: number[];
    jobOrders?: number[];
    incidents?: number[];
};

type Props = {
    isAdmin: boolean;
    period: Period | null;
    overview: Overview | null;
    pendingActions: PendingActions | null;
    inventoryAlerts: InventoryAlerts | null;
    activitySeries: ActivitySeries | null;
    recentRequests: RecentRequest[];
    recentJobOrders: RecentJobOrder[];
    recentIncidents: RecentIncident[];
    recentBookings: RecentBooking[];
};

type SeriesKey = 'requests' | 'bookings' | 'jobOrders' | 'incidents';

const SERIES_META: readonly { key: SeriesKey; label: string; color: string }[] =
    [
        { key: 'requests', label: 'Requests', color: '#f59e0b' },
        { key: 'bookings', label: 'Bookings', color: '#10b981' },
        { key: 'jobOrders', label: 'Job Orders', color: '#1a1851' },
        { key: 'incidents', label: 'Incidents', color: '#f43f5e' },
    ];

function LineChart({ data }: { data: ActivitySeries }) {
    const width = 780;
    const height = 250;
    const padTop = 14;
    const padRight = 14;
    const padBottom = 26;
    const padLeft = 38;

    const series = SERIES_META.map((meta) => ({
        ...meta,
        values: data[meta.key] ?? [],
    })).filter((entry) => entry.values.length > 0);

    const max = Math.max(1, ...series.flatMap((entry) => entry.values));
    const step = Math.max(1, Math.ceil(max / 4));
    const yMax = step * 4;

    const count = data.labels.length;
    const xFor = (index: number) =>
        count <= 1
            ? padLeft
            : padLeft + (index * (width - padLeft - padRight)) / (count - 1);
    const yFor = (value: number) =>
        height - padBottom - (value / yMax) * (height - padTop - padBottom);

    const ticks = [0, step, step * 2, step * 3, step * 4];

    return (
        <div>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full"
                role="img"
                aria-label="Monthly system activity line chart"
            >
                {ticks.map((tick) => (
                    <g key={tick}>
                        <line
                            x1={padLeft}
                            x2={width - padRight}
                            y1={yFor(tick)}
                            y2={yFor(tick)}
                            stroke="rgba(15,23,42,0.08)"
                            strokeDasharray={tick === 0 ? undefined : '4 4'}
                        />
                        <text
                            x={padLeft - 8}
                            y={yFor(tick)}
                            textAnchor="end"
                            dominantBaseline="middle"
                            className="fill-slate-400 text-[10px]"
                        >
                            {tick}
                        </text>
                    </g>
                ))}
                {data.labels.map((label, index) => (
                    <text
                        key={`${label}-${index}`}
                        x={xFor(index)}
                        y={height - 8}
                        textAnchor="middle"
                        className="fill-slate-400 text-[10px]"
                    >
                        {label}
                    </text>
                ))}
                {series.map((entry) => (
                    <g key={entry.label}>
                        <polyline
                            fill="none"
                            stroke={entry.color}
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={entry.values
                                .map(
                                    (value, index) =>
                                        `${xFor(index)},${yFor(value)}`,
                                )
                                .join(' ')}
                        />
                        {entry.values.map((value, index) => (
                            <circle
                                key={`${entry.label}-${index}`}
                                cx={xFor(index)}
                                cy={yFor(value)}
                                r={3}
                                fill="#ffffff"
                                stroke={entry.color}
                                strokeWidth={2}
                            />
                        ))}
                    </g>
                ))}
            </svg>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {series.map((entry) => (
                    <span
                        key={entry.label}
                        className="flex items-center gap-1.5 text-xs text-slate-500"
                    >
                        <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        {entry.label}
                    </span>
                ))}
            </div>
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
            title: `Laboratory Incident by ${i.reporter_name}`,
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
                        className="group -mx-2 flex gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50"
                    >
                        <div className="relative flex flex-col items-center">
                            <div
                                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                            >
                                <Icon className={`size-4 ${item.iconText}`} />
                            </div>
                            {idx < visible.length - 1 && (
                                <div className="mt-1 w-px flex-1 bg-slate-200" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                            <p className="text-sm font-medium text-slate-600 transition-colors group-hover:text-slate-800">
                                {item.title}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400 capitalize">
                                {item.subtitle}
                            </p>
                        </div>
                        <span className="shrink-0 pt-0.5 text-[11px] text-slate-400">
                            {item.date ? formatRelativeTime(item.date) : ''}
                        </span>
                    </Link>
                );
            })}
            {visible.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-400">
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
    isAdmin,
    period,
    overview,
    pendingActions,
    inventoryAlerts,
    activitySeries,
    recentRequests,
    recentJobOrders,
    recentIncidents,
    recentBookings,
}: Props) {
    const { auth } = usePage().props as any;
    const userName = auth?.user?.name?.split(' ')[0] ?? 'User';

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const activePeriod: Period = period ?? 'year';

    const adminCards =
        overview &&
        overview.jobOrders &&
        overview.inventory &&
        overview.bookings &&
        overview.incidents
            ? [
                  {
                      label: 'Service Requests',
                      value: overview.serviceRequests.total,
                      sub: `${overview.serviceRequests.pending} pending`,
                      icon: FileText,
                      href: '/requests',
                      color: 'text-ustp-navy',
                      bg: 'bg-ustp-navy/5',
                  },
                  {
                      label: 'Job Orders',
                      value: overview.jobOrders.total,
                      sub: `${overview.jobOrders.inProgress} in progress · ${overview.jobOrders.unassigned} unassigned`,
                      icon: ClipboardList,
                      href: '/job-orders',
                      color: 'text-amber-600',
                      bg: 'bg-amber-50',
                  },
                  {
                      label: 'ICT Inventory',
                      value: overview.inventory.total,
                      sub: `${overview.inventory.defective} defective`,
                      icon: Package,
                      href: '/inventory',
                      color: 'text-ustp-light-blue',
                      bg: 'bg-ustp-light-blue/10',
                  },
                  {
                      label: 'Facility Bookings',
                      value: overview.bookings.total,
                      sub: `${overview.bookings.pending} pending`,
                      icon: Calendar,
                      href: '/bookings',
                      color: 'text-emerald-600',
                      bg: 'bg-emerald-50',
                  },
                  {
                      label: 'Lab Incidents',
                      value: overview.incidents.total,
                      sub: `${overview.incidents.unresolved} unresolved`,
                      icon: AlertTriangle,
                      href: '/incidents',
                      color: 'text-rose-600',
                      bg: 'bg-rose-50',
                  },
                  {
                      label: 'Pending Actions',
                      value: overview.pendingActions.total,
                      sub: 'Needs attention',
                      icon: Clock,
                      href: '/requests/approvals',
                      color: 'text-orange-600',
                      bg: 'bg-orange-50',
                  },
              ]
            : [];

    const userCards = overview
        ? [
              {
                  label: 'Service Requests',
                  value: overview.serviceRequests.total,
                  sub: `${overview.serviceRequests.pending} pending`,
                  icon: FileText,
                  href: '/requests',
                  color: 'text-ustp-navy',
                  bg: 'bg-ustp-navy/5',
              },
              ...(overview.bookings
                  ? [
                        {
                            label: 'Facility Bookings',
                            value: overview.bookings.total,
                            sub: `${overview.bookings.pending} pending`,
                            icon: Calendar,
                            href: '/bookings',
                            color: 'text-emerald-600',
                            bg: 'bg-emerald-50',
                        },
                    ]
                  : []),
              ...(overview.incidents
                  ? [
                        {
                            label: 'Lab Incidents',
                            value: overview.incidents.total,
                            sub: `${overview.incidents.unresolved} unresolved`,
                            icon: AlertTriangle,
                            href: '/incidents',
                            color: 'text-rose-600',
                            bg: 'bg-rose-50',
                        },
                    ]
                  : []),
              ...(overview.serviceRequests.approved !== undefined
                  ? [
                        {
                            label: 'Approved Requests',
                            value: overview.serviceRequests.approved,
                            sub: 'awaiting completion',
                            icon: Layers,
                            href: '/requests',
                            color: 'text-ustp-light-blue',
                            bg: 'bg-ustp-light-blue/10',
                        },
                    ]
                  : []),
              ...(overview.serviceRequests.completed !== undefined
                  ? [
                        {
                            label: 'Completed Requests',
                            value: overview.serviceRequests.completed,
                            sub: 'resolved successfully',
                            icon: ClipboardList,
                            href: '/requests',
                            color: 'text-teal-600',
                            bg: 'bg-teal-50',
                        },
                    ]
                  : []),
              {
                  label: 'Pending Actions',
                  value: overview.pendingActions.total,
                  sub: 'Needs attention',
                  icon: Clock,
                  href: '/requests',
                  color: 'text-orange-600',
                  bg: 'bg-orange-50',
              },
          ]
        : [];

    const cards = isAdmin ? adminCards : userCards;

    const actionRows = !pendingActions
        ? []
        : isAdmin
          ? [
                {
                    label: 'Booking approvals',
                    value: pendingActions.bookingApprovals ?? 0,
                    href: '/bookings/approvals',
                    bar: 'bg-emerald-500',
                },
                {
                    label: 'Service request approvals',
                    value: pendingActions.requestApprovals,
                    href: '/requests/approvals',
                    bar: 'bg-ustp-light-blue',
                },
                {
                    label: 'Job orders in progress',
                    value: pendingActions.jobOrdersInProgress ?? 0,
                    href: '/job-orders/progress',
                    bar: 'bg-amber-500',
                },
                {
                    label: 'Overdue job orders (SLA)',
                    value: pendingActions.overdueJobOrders ?? 0,
                    href: '/job-orders/progress',
                    bar: 'bg-red-500',
                },
                {
                    label: 'Unresolved incidents',
                    value: pendingActions.incidentsUnresolved ?? 0,
                    href: '/incidents',
                    bar: 'bg-rose-500',
                },
            ]
          : [
                {
                    label: 'Requests awaiting approval',
                    value: pendingActions.requestApprovals,
                    href: '/requests',
                    bar: 'bg-ustp-light-blue',
                },
                ...(pendingActions.bookingApprovals !== undefined
                    ? [
                          {
                              label: 'Bookings awaiting approval',
                              value: pendingActions.bookingApprovals,
                              href: '/bookings',
                              bar: 'bg-emerald-500',
                          },
                      ]
                    : []),
                ...(pendingActions.incidentsUnresolved !== undefined
                    ? [
                          {
                              label: 'Open incidents',
                              value: pendingActions.incidentsUnresolved,
                              href: '/incidents',
                              bar: 'bg-rose-500',
                          },
                      ]
                    : []),
                ...(pendingActions.rejectedRequests !== undefined
                    ? [
                          {
                              label: 'Rejected requests',
                              value: pendingActions.rejectedRequests,
                              href: '/requests',
                              bar: 'bg-red-500',
                          },
                      ]
                    : []),
            ];
    const maxActionValue = Math.max(1, ...actionRows.map((row) => row.value));

    const alertRows = inventoryAlerts
        ? [
              {
                  label: 'Expiring Soon',
                  sub: 'Within the next 30 days',
                  value: inventoryAlerts.expiringSoon,
                  href: '/inventory/expirations',
                  icon: Clock,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
              },
              {
                  label: 'Expired',
                  sub: 'Past expiration date',
                  value: inventoryAlerts.expired,
                  href: '/inventory/expirations',
                  icon: AlertTriangle,
                  color: 'text-red-600',
                  bg: 'bg-red-50',
              },
              {
                  label: 'Defective Equipment',
                  sub: 'Requires inspection',
                  value: inventoryAlerts.defective,
                  href: '/inventory/defective',
                  icon: Wrench,
                  color: 'text-rose-600',
                  bg: 'bg-rose-50',
              },
              {
                  label: 'Under Repair',
                  sub: 'Currently being serviced',
                  value: inventoryAlerts.underRepair,
                  href: '/inventory/under-repair',
                  icon: Package,
                  color: 'text-ustp-light-blue',
                  bg: 'bg-ustp-light-blue/10',
              },
          ]
        : [];

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-full flex-1 bg-slate-50 text-slate-800">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* ── Welcome header ── */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-800 md:text-3xl">
                                Dashboard Overview
                            </h1>

                            <p className="mt-1.5 max-w-lg text-sm text-slate-500">
                                {`Welcome back, ${userName}. Here\u2019s what needs your attention.`}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                                {(['week', 'month', 'year'] as const).map(
                                    (value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                router.get(
                                                    '/dashboard',
                                                    { period: value },
                                                    {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                    },
                                                )
                                            }
                                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                                activePeriod === value
                                                    ? 'bg-ustp-navy text-white'
                                                    : 'text-slate-500 hover:bg-slate-100'
                                            }`}
                                        >
                                            {value === 'week'
                                                ? 'This Week'
                                                : value === 'month'
                                                  ? 'This Month'
                                                  : 'This Year'}
                                        </button>
                                    ),
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Clock className="size-4" />
                                {today}
                            </div>
                        </div>
                    </div>

                    {/* ── Stat cards ── */}
                    <div
                        className={`grid grid-cols-2 gap-4 ${cards.length >= 5 ? 'lg:grid-cols-3' : 'lg:max-w-2xl'}`}
                    >
                        {cards.map((card) => (
                            <Link
                                key={card.label}
                                href={card.href}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-medium text-slate-600">
                                        {card.label}
                                    </p>
                                    <div
                                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${card.bg}`}
                                    >
                                        <card.icon
                                            className={`size-4 ${card.color}`}
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-800">
                                    {card.value}
                                </p>
                                <p className="mt-1.5 text-xs text-slate-400 group-hover:text-slate-500">
                                    {card.sub}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* ── Activity chart + Pending actions ── */}
                    {actionRows.length > 0 && (
                        <div
                            className={
                                activitySeries
                                    ? 'grid gap-5 lg:grid-cols-3'
                                    : ''
                            }
                        >
                            {activitySeries && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
                                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-light-blue/10">
                                                <TrendingUp className="size-4 text-ustp-light-blue" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800">
                                                    Monthly System Activity
                                                </h3>
                                                <p className="text-[11px] text-slate-400">
                                                    Activity by operational
                                                    module
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <LineChart data={activitySeries} />
                                    </div>
                                </div>
                            )}

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-orange-50">
                                            <Clock className="size-4 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Pending Actions
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                Queues that need attention
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 p-5">
                                    {actionRows.map((row) => (
                                        <Link
                                            key={row.label}
                                            href={row.href}
                                            className="group block"
                                        >
                                            <div className="mb-1.5 flex items-center justify-between gap-2">
                                                <span className="text-xs font-medium text-slate-600 transition-colors group-hover:text-slate-800">
                                                    {row.label}
                                                </span>
                                                <span className="text-xs font-semibold text-slate-800">
                                                    {row.value}
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${row.bar}`}
                                                    style={{
                                                        width: `${(row.value / maxActionValue) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Admin: Inventory alerts ── */}
                    {isAdmin && alertRows.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-rose-50">
                                        <AlertTriangle className="size-4 text-rose-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Inventory Alerts
                                        </h3>
                                        <p className="text-[11px] text-slate-400">
                                            Items requiring action
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/inventory"
                                    className="group flex items-center gap-1 text-xs font-medium text-ustp-light-blue/70 transition-colors hover:text-ustp-light-blue"
                                >
                                    View all
                                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </div>
                            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
                                {alertRows.map((row) => (
                                    <Link
                                        key={row.label}
                                        href={row.href}
                                        className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm"
                                    >
                                        <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${row.bg}`}
                                        >
                                            <row.icon
                                                className={`size-4 ${row.color}`}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                                                {row.label}
                                            </p>
                                            <p className="truncate text-[11px] text-slate-400">
                                                {row.sub}
                                            </p>
                                        </div>
                                        <span className="ml-auto text-lg font-semibold text-slate-800">
                                            {row.value}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Recent Activity ── */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100">
                                    <Clock className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        Recent Activity
                                    </h3>
                                    <p className="text-[11px] text-slate-400">
                                        Across all modules
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <ActivityFeed
                                recentRequests={recentRequests}
                                recentJobOrders={recentJobOrders}
                                recentIncidents={recentIncidents}
                                recentBookings={recentBookings}
                            />
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
