import { Head, router } from '@inertiajs/react';
import {
    Check,
    ClipboardList,
    Clock3,
    UserRound,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { BackButton } from '@/components/back-button';
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
    pending:
        'border-amber-400/30 bg-amber-400/10 text-amber-300',
    approved:
        'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    rejected:
        'border-red-400/25 bg-red-400/10 text-red-300',
    completed:
        'border-ustp-light-blue/25 bg-ustp-light-blue/10 text-ustp-light-blue',
};

export default function RequestsShow({ request, isAdmin }: Props) {
    const [priority, setPriority] = useState(request.priority_level ?? '');
    const [processing, setProcessing] = useState(false);

    function updateStatus(status: string) {
        setProcessing(true);

        router.put(
            `/requests/${request.id}`,
            {
                request_status: status,
                priority_level: priority || null,
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    }

    return (
        <>
            <Head title={`Request #${request.id}`} />

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative mx-auto flex max-w-4xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-100 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/requests" />
                    </div>

                    {/* Header */}
                    <div className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-2xl shadow-black/20 md:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#1a2035] bg-[#070b18] text-ustp-light-blue">
                                    <ClipboardList className="size-5" />
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-gray-500">
                                            REQUEST #{request.id}
                                        </span>

                                        <span className="size-1 rounded-full bg-gray-600" />

                                        <span className="text-[10px] uppercase tracking-wider text-gray-500">
                                            ICT Service
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-semibold tracking-tight text-gray-50 md:text-2xl">
                                        {request.request_services
                                            .map(
                                                (s) =>
                                                    s.service_type.service_name,
                                            )
                                            .join(', ') ||
                                            'Service request'}
                                    </h1>

                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Submitted{' '}
                                        {new Date(
                                            request.date_requested,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <Badge
                                variant="outline"
                                className={`w-fit rounded-md px-3 py-1 text-[10px] font-medium capitalize ${statusStyles[request.request_status] ?? 'border-[#1a2035] bg-[#070b18] text-gray-400'}`}
                            >
                                {request.request_status}
                            </Badge>
                        </div>
                    </div>

                    {/* Request metadata */}
                    <div className="relative grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                <UserRound className="size-4" />
                            </div>

                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                Requested by
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-200">
                                {request.user.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                                {request.user.department ?? 'No department'}
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                <Clock3 className="size-4" />
                            </div>

                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                Date requested
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-200">
                                {new Date(
                                    request.date_requested,
                                ).toLocaleDateString()}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                                {new Date(
                                    request.date_requested,
                                ).toLocaleTimeString([], {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
                                <span className="text-sm font-semibold">!</span>
                            </div>

                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                Priority
                            </p>

                            <p className="mt-1 text-sm font-medium capitalize text-gray-200">
                                {request.priority_level ?? 'Not set yet'}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                                Assigned by ICT Admin
                            </p>
                        </div>
                    </div>

                    {/* Services */}
                    <section className="relative overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723]">
                        <div className="border-b border-[#1a2035] px-5 py-4 md:px-6">
                            <p className="text-sm font-medium text-gray-200">
                                Services requested
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Services and specifications included in this
                                request.
                            </p>
                        </div>

                        <div className="divide-y divide-[#151c2c]">
                            {request.request_services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">
                                            {service.service_type.service_name}
                                        </p>

                                        <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">
                                            {
                                                service.service_type.category
                                                    .category_name
                                            }
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {service.specification && (
                                            <span className="rounded-md border border-[#1a2035] bg-[#070b18] px-2.5 py-1 text-gray-400">
                                                {service.specification}
                                            </span>
                                        )}

                                        <span className="rounded-md border border-[#1a2035] bg-[#070b18] px-2.5 py-1 text-gray-400">
                                            Qty: {service.quantity}
                                        </span>

                                        {service.action_type && (
                                            <span className="rounded-md border border-ustp-navy/20 bg-ustp-navy/5 px-2.5 py-1 text-ustp-light-blue">
                                                {service.action_type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Problem */}
                    <section className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                        <p className="text-sm font-medium text-gray-200">
                            Problem description
                        </p>

                        <div className="mt-4 rounded-xl border border-[#1a2035] bg-[#070b18] p-4">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                                {request.problem_description}
                            </p>
                        </div>
                    </section>

                    {/* Admin review */}
                    {isAdmin && request.request_status === 'pending' && (
                        <section className="relative overflow-hidden rounded-2xl border border-ustp-navy/20 bg-[#0f1723]">
                            <div className="border-b border-[#1a2035] bg-ustp-navy/[0.04] px-5 py-4 md:px-6">
                                <p className="text-sm font-medium text-gray-200">
                                    Review request
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Set the request priority before approving
                                    or rejecting it.
                                </p>
                            </div>

                            <div className="p-5 md:p-6">
                                <div className="max-w-sm">
                                    <label className="mb-2 block text-xs font-medium text-gray-300">
                                        Priority
                                    </label>

                                    <Select
                                        value={priority}
                                        onValueChange={setPriority}
                                    >
                                        <SelectTrigger className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>

                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High
                                            </SelectItem>
                                            <SelectItem value="urgent">
                                                Urgent
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Button
                                        variant="outline"
                                        disabled={processing}
                                        onClick={() =>
                                            updateStatus('rejected')
                                        }
                                        className="border-red-400/25 bg-transparent text-red-300 hover:bg-red-400/10 hover:text-red-200"
                                    >
                                        <X className="size-4" />
                                        Reject
                                    </Button>

                                    <Button
                                        disabled={processing}
                                        onClick={() =>
                                            updateStatus('approved')
                                        }
                                        className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                                    >
                                        <Check className="size-4" />
                                        Approve Request
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}
