import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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

type ServiceRequestDetail = {
    id: number;
    problem_description: string;
    priority_level: string | null;
    request_status: string;
    date_requested: string;
    user: { name: string; department: string | null };
    request_services: RequestService[];
};

type Props = {
    request: ServiceRequestDetail;
    isAdmin: boolean;
};

const statusStyles: Record<string, string> = {
    pending: 'bg-slate-100 text-slate-700',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
};

export default function RequestsShow({ request, isAdmin }: Props) {
    const [priority, setPriority] = useState(request.priority_level ?? '');
    const [processing, setProcessing] = useState(false);

    function updateStatus(status: string) {
        setProcessing(true);
        router.put(
            `/requests/${request.id}`,
            { request_status: status, priority_level: priority || null },
            { onFinish: () => setProcessing(false) },
        );
    }

    return (
        <>
            <Head title={`Request #${request.id}`} />

            <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Request #{request.id}
                        </p>
                        <h1 className="text-xl font-semibold">
                            {request.request_services
                                .map((s) => s.service_type.service_name)
                                .join(', ') || 'Service request'}
                        </h1>
                    </div>
                    <Badge className={statusStyles[request.request_status] ?? ''} variant="outline">
                        {request.request_status}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground">Requested by</p>
                        <p>{request.user.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p>{request.user.department ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Date requested</p>
                        <p>{new Date(request.date_requested).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Priority</p>
                        <p className="capitalize">{request.priority_level ?? 'Not set yet'}</p>
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="mb-2 text-sm font-medium">Services requested</p>
                    <div className="flex flex-col gap-2">
                        {request.request_services.map((service) => (
                            <div
                                key={service.id}
                                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
                            >
                                <span>{service.service_type.service_name}</span>
                                <span className="text-muted-foreground">
                                    {service.specification && `${service.specification} · `}
                                    Qty: {service.quantity}
                                    {service.action_type && ` · ${service.action_type}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="mb-2 text-sm font-medium">Problem description</p>
                    <p className="text-sm text-muted-foreground">
                        {request.problem_description}
                    </p>
                </div>

                {isAdmin && request.request_status === 'pending' && (
                    <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="mb-3 text-sm font-medium">Review this request</p>

                        <div className="mb-4 grid gap-2">
                            <label className="text-xs text-muted-foreground">
                                Set priority
                            </label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                disabled={processing}
                                onClick={() => updateStatus('rejected')}
                                className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                                Reject
                            </Button>
                            <Button
                                disabled={processing}
                                onClick={() => updateStatus('approved')}
                                className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
