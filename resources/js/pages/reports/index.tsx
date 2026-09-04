import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Box,
    Calendar,
    ClipboardList,
    FileText,
    Star,
} from 'lucide-react';

type StatusCounts = Record<string, number>;

type Props = {
    requestStats: { total: number; by_status: StatusCounts };
    jobOrderStats: {
        total: number;
        by_status: StatusCounts;
        average_rating: number;
        rated_count: number;
    };
    inventoryStats: { total: number; by_condition: StatusCounts };
    bookingStats: { total: number; by_status: StatusCounts };
    incidentStats: {
        total: number;
        by_status: StatusCounts;
        by_type: StatusCounts;
        liabilities_assigned: number;
        liabilities_settled: number;
    };
};

const topCards = [
    { key: 'requests', label: 'Total Requests', icon: FileText, color: 'ustp-light-blue' },
    { key: 'jobOrders', label: 'Total Job Orders', icon: ClipboardList, color: 'ustp-gold' },
    { key: 'bookings', label: 'Total Bookings', icon: Calendar, color: 'ustp-light-blue' },
    { key: 'incidents', label: 'Total Incidents', icon: AlertTriangle, color: 'ustp-gold' },
] as const;

const colorMap: Record<string, { bg: string; text: string }> = {
    'ustp-light-blue': { bg: 'bg-ustp-blue-accent/15', text: 'text-ustp-light-blue' },
    'ustp-gold': { bg: 'bg-ustp-gold/10', text: 'text-ustp-gold' },
};

function BreakdownList({ data }: { data: StatusCounts }) {
    const entries = Object.entries(data);

    if (entries.length === 0) {
        return <p className="text-sm text-gray-500">No data yet.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            {entries.map(([key, count]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-gray-400">
                        {key.replace('_', ' ')}
                    </span>
                    <span className="font-medium text-gray-200">{count}</span>
                </div>
            ))}
        </div>
    );
}

export default function ReportsIndex({
    requestStats,
    jobOrderStats,
    inventoryStats,
    bookingStats,
    incidentStats,
}: Props) {
    const totals: Record<string, number> = {
        requests: requestStats.total,
        jobOrders: jobOrderStats.total,
        bookings: bookingStats.total,
        incidents: incidentStats.total,
    };

    return (
        <>
            <Head title="Reports" />

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-105 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                        <div className="absolute -bottom-40 left-1/4 size-90 rounded-full bg-ustp-gold/[0.015] blur-3xl" />
                    </div>

                    {/* Header */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                                Analytics
                            </span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                            Reports
                        </h1>

                        <p className="mt-1.5 max-w-xl text-sm text-gray-400">
                            System-wide statistics and performance overview.
                        </p>
                    </div>

                    {/* Top stat cards */}
                    <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4">
                        {topCards.map(({ key, label, icon: Icon, color }) => {
                            const c = colorMap[color];
                            
                            return (
                                <div
                                    key={key}
                                    className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-xs text-gray-400">{label}</p>
                                        <div className={`flex size-8 items-center justify-center rounded-lg ${c.bg} ${c.text}`}>
                                            <Icon className="size-4" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-semibold text-gray-50">{totals[key]}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Breakdown grid */}
                    <div className="relative grid gap-4 md:grid-cols-2">
                        {/* Service Requests by Status */}
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                            <p className="mb-3 text-sm font-medium text-gray-200">Service Requests by Status</p>
                            <BreakdownList data={requestStats.by_status} />
                        </div>

                        {/* Job Orders by Status */}
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                            <p className="mb-3 text-sm font-medium text-gray-200">Job Orders by Status</p>
                            <BreakdownList data={jobOrderStats.by_status} />
                        </div>

                        {/* Job Order Satisfaction */}
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-200">Job Order Satisfaction</p>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                    <Star className="size-4" />
                                </div>
                            </div>
                            {jobOrderStats.rated_count > 0 ? (
                                <>
                                    <p className="text-2xl font-semibold text-gray-50">
                                        {jobOrderStats.average_rating}
                                        <span className="text-sm font-normal text-gray-400">
                                            {' '}/ 5.0
                                        </span>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Based on {jobOrderStats.rated_count} rated job order
                                        {jobOrderStats.rated_count !== 1 && 's'}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No ratings submitted yet.
                                </p>
                            )}
                        </div>

                        {/* Inventory by Condition */}
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-200">Inventory by Condition</p>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                    <Box className="size-4" />
                                </div>
                            </div>
                            <BreakdownList data={inventoryStats.by_condition} />
                            <p className="mt-2 text-xs text-gray-500">
                                {inventoryStats.total} total items tracked
                            </p>
                        </div>

                        {/* Bookings by Status */}
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                            <p className="mb-3 text-sm font-medium text-gray-200">Bookings by Status</p>
                            <BreakdownList data={bookingStats.by_status} />
                        </div>

                        {/* Incidents by Type */}
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                            <p className="mb-3 text-sm font-medium text-gray-200">Incidents by Type</p>
                            <BreakdownList data={incidentStats.by_type} />
                        </div>

                        {/* Incidents by Status */}
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                            <p className="mb-3 text-sm font-medium text-gray-200">Incidents by Status</p>
                            <BreakdownList data={incidentStats.by_status} />
                        </div>

                        {/* Liability Records */}
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                            <p className="mb-3 text-sm font-medium text-gray-200">Liability Records</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Assigned</span>
                                <span className="font-medium text-gray-200">{incidentStats.liabilities_assigned}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="text-gray-400">Settled</span>
                                <span className="font-medium text-gray-200">{incidentStats.liabilities_settled}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
