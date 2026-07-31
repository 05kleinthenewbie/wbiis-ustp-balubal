import { Head, Link } from '@inertiajs/react';
import { FileText, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type RequestService = {
    id: number;
    specification: string | null;
    quantity: number;
    action_type: string | null;
    service_type: {
        service_name: string;
        category: { category_name: string };
    };
};

type ServiceRequestItem = {
    id: number;
    problem_description: string;
    priority_level: string | null;
    request_status: string;
    date_requested: string;
    user: { name: string };
    request_services: RequestService[];
};

type Props = {
    requests: ServiceRequestItem[];
};

const statusStyles: Record<string, string> = {
    pending: 'bg-slate-100 text-slate-700',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
};

export default function RequestsIndex({ requests }: Props) {
    return (
        <>
            <Head title="Service Requests" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Service Requests</h1>
                        <p className="text-sm text-muted-foreground">
                            Track your submitted ICT service requests.
                        </p>
                    </div>
                    <Button asChild className="bg-ustp-navy text-white hover:bg-ustp-navy-dark">
                        <Link href="/requests/create">
                            <Plus className="size-4" />
                            New Request
                        </Link>
                    </Button>
                </div>

                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
                        <FileText className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No service requests yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Request</th>
                                    <th className="px-4 py-3 font-medium">Submitted by</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request.id} className="border-b last:border-0">
                                        <td className="px-4 py-3">
                                            <p className="font-medium">
                                                {request.request_services
                                                    .map((s) => s.service_type.service_name)
                                                    .join(', ') || 'Service request'}
                                            </p>
                                            <p className="line-clamp-1 text-xs text-muted-foreground">
                                                {request.problem_description}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {request.user.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(request.date_requested).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={statusStyles[request.request_status] ?? ''}
                                                variant="outline"
                                            >
                                                {request.request_status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/requests/${request.id}`}
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
