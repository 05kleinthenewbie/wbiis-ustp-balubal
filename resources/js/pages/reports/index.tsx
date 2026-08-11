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

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number | string;
    icon: React.ElementType;
}) {
    return (
        <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
}

function BreakdownList({ data }: { data: StatusCounts }) {
    const entries = Object.entries(data);

    if (entries.length === 0) {
        return <p className="text-sm text-muted-foreground">No data yet.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            {entries.map(([key, count]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-muted-foreground">
                        {key.replace('_', ' ')}
                    </span>
                    <span className="font-medium">{count}</span>
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
    return (
        <>
            <Head title="Reports" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Reports</h1>
                    <p className="text-sm text-muted-foreground">
                        System-wide statistics and performance overview.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard label="Total Requests" value={requestStats.total} icon={FileText} />
                    <StatCard label="Total Job Orders" value={jobOrderStats.total} icon={ClipboardList} />
                    <StatCard label="Total Bookings" value={bookingStats.total} icon={Calendar} />
                    <StatCard label="Total Incidents" value={incidentStats.total} icon={AlertTriangle} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border p-4">
                        <p className="mb-3 text-sm font-medium">Service Requests by Status</p>
                        <BreakdownList data={requestStats.by_status} />
                    </div>

                    <div className="rounded-xl border p-4">
                        <p className="mb-3 text-sm font-medium">Job Orders by Status</p>
                        <BreakdownList data={jobOrderStats.by_status} />
                    </div>

                    <div className="rounded-xl border p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-medium">Job Order Satisfaction</p>
                            <Star className="size-4 text-ustp-gold" />
                        </div>
                        {jobOrderStats.rated_count > 0 ? (
                            <>
                                <p className="text-2xl font-semibold">
                                    {jobOrderStats.average_rating}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {' '}/ 5.0
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Based on {jobOrderStats.rated_count} rated job order
                                    {jobOrderStats.rated_count !== 1 && 's'}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No ratings submitted yet.
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-medium">Inventory by Condition</p>
                            <Box className="size-4 text-muted-foreground" />
                        </div>
                        <BreakdownList data={inventoryStats.by_condition} />
                        <p className="mt-2 text-xs text-muted-foreground">
                            {inventoryStats.total} total items tracked
                        </p>
                    </div>

                    <div className="rounded-xl border p-4">
                        <p className="mb-3 text-sm font-medium">Bookings by Status</p>
                        <BreakdownList data={bookingStats.by_status} />
                    </div>

                    <div className="rounded-xl border p-4">
                        <p className="mb-3 text-sm font-medium">Incidents by Type</p>
                        <BreakdownList data={incidentStats.by_type} />
                    </div>

                    <div className="rounded-xl border p-4">
                        <p className="mb-3 text-sm font-medium">Incidents by Status</p>
                        <BreakdownList data={incidentStats.by_status} />
                    </div>

                    <div className="rounded-xl border p-4">
                        <p className="mb-3 text-sm font-medium">Liability Records</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Assigned</span>
                            <span className="font-medium">{incidentStats.liabilities_assigned}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Settled</span>
                            <span className="font-medium">{incidentStats.liabilities_settled}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
