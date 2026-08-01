import { Head, Link } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type JobOrderItem = {
    id: number;
    status: string;
    date_assigned: string | null;
    service_request: {
        user: { name: string };
        request_services: { service_type: { service_name: string } }[];
    };
    technician: { name: string } | null;
};

type Props = {
    jobOrders: JobOrderItem[];
};

const statusStyles: Record<string, string> = {
    open: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-amber-100 text-amber-800',
    completed: 'bg-blue-100 text-blue-800',
    closed: 'bg-green-100 text-green-800',
};

export default function JobOrdersIndex({ jobOrders }: Props) {
    return (
        <>
            <Head title="Job Orders" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Job Orders</h1>
                    <p className="text-sm text-muted-foreground">
                        Track and assign ICT service tasks.
                    </p>
                </div>

                {jobOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
                        <ClipboardList className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No job orders yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Job Order</th>
                                    <th className="px-4 py-3 font-medium">Requested by</th>
                                    <th className="px-4 py-3 font-medium">Technician</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobOrders.map((jobOrder) => (
                                    <tr key={jobOrder.id} className="border-b last:border-0">
                                        <td className="px-4 py-3">
                                            <p className="font-medium">
                                                JO-{String(jobOrder.id).padStart(4, '0')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {jobOrder.service_request.request_services
                                                    .map((s) => s.service_type.service_name)
                                                    .join(', ')}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {jobOrder.service_request.user.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {jobOrder.technician?.name ?? 'Unassigned'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={statusStyles[jobOrder.status] ?? ''}
                                                variant="outline"
                                            >
                                                {jobOrder.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/job-orders/${jobOrder.id}`}
                                                className="text-ustp-navy hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
