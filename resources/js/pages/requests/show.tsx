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
        'border-[#C8A24A]/30 bg-[#C8A24A]/10 text-[#E5C76B]',
    approved:
        'border-[#35C98B]/25 bg-[#35C98B]/10 text-[#55DDA0]',
    rejected:
        'border-[#E45B68]/25 bg-[#E45B68]/10 text-[#F27B86]',
    completed:
        'border-[#22B8C7]/25 bg-[#22B8C7]/10 text-[#50D1DD]',
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

            <div className="min-h-full flex-1 bg-[#12141A] text-[#F1F3F5]">
                <div className="relative mx-auto flex max-w-4xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-100 rounded-full bg-[#22B8C7]/[0.035] blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/requests" />
                    </div>

                    {/* Header */}
                    <div className="relative rounded-2xl border border-[#2A2F3B] bg-[#1B1E28] p-5 shadow-2xl shadow-black/20 md:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#2A2F3B] bg-[#12141A] text-[#22B8C7]">
                                    <ClipboardList className="size-5" />
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-[#555D6B]">
                                            REQUEST #{request.id}
                                        </span>

                                        <span className="size-1 rounded-full bg-[#3B414D]" />

                                        <span className="text-[10px] uppercase tracking-wider text-[#555D6B]">
                                            ICT Service
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-semibold tracking-tight text-[#F1F3F5] md:text-2xl">
                                        {request.request_services
                                            .map(
                                                (s) =>
                                                    s.service_type.service_name,
                                            )
                                            .join(', ') ||
                                            'Service request'}
                                    </h1>

                                    <p className="mt-1.5 text-xs text-[#626A78]">
                                        Submitted{' '}
                                        {new Date(
                                            request.date_requested,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <Badge
                                variant="outline"
                                className={`w-fit rounded-md px-3 py-1 text-[10px] font-medium capitalize ${statusStyles[request.request_status] ?? 'border-[#2A2F3B] bg-[#12141A] text-[#737B8A]'}`}
                            >
                                {request.request_status}
                            </Badge>
                        </div>
                    </div>

                    {/* Request metadata */}
                    <div className="relative grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-[#2A2F3B] bg-[#1B1E28] p-4">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-[#22B8C7]/10 text-[#50D1DD]">
                                <UserRound className="size-4" />
                            </div>

                            <p className="text-[10px] font-medium uppercase tracking-wider text-[#555D6B]">
                                Requested by
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#E3E6EA]">
                                {request.user.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#626A78]">
                                {request.user.department ?? 'No department'}
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#2A2F3B] bg-[#1B1E28] p-4">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-[#8B6DFF]/10 text-[#A996FF]">
                                <Clock3 className="size-4" />
                            </div>

                            <p className="text-[10px] font-medium uppercase tracking-wider text-[#555D6B]">
                                Date requested
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#E3E6EA]">
                                {new Date(
                                    request.date_requested,
                                ).toLocaleDateString()}
                            </p>

                            <p className="mt-0.5 text-xs text-[#626A78]">
                                {new Date(
                                    request.date_requested,
                                ).toLocaleTimeString([], {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#2A2F3B] bg-[#1B1E28] p-4">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-[#C8A24A]/10 text-[#E5C76B]">
                                <span className="text-sm font-semibold">!</span>
                            </div>

                            <p className="text-[10px] font-medium uppercase tracking-wider text-[#555D6B]">
                                Priority
                            </p>

                            <p className="mt-1 text-sm font-medium capitalize text-[#E3E6EA]">
                                {request.priority_level ?? 'Not set yet'}
                            </p>

                            <p className="mt-0.5 text-xs text-[#626A78]">
                                Assigned by ICT Admin
                            </p>
                        </div>
                    </div>

                    {/* Services */}
                    <section className="relative overflow-hidden rounded-2xl border border-[#2A2F3B] bg-[#1B1E28]">
                        <div className="border-b border-[#2A2F3B] px-5 py-4 md:px-6">
                            <p className="text-sm font-medium text-[#E3E6EA]">
                                Services requested
                            </p>

                            <p className="mt-1 text-xs text-[#626A78]">
                                Services and specifications included in this
                                request.
                            </p>
                        </div>

                        <div className="divide-y divide-[#252A34]">
                            {request.request_services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-[#E3E6EA]">
                                            {service.service_type.service_name}
                                        </p>

                                        <p className="mt-1 text-[10px] uppercase tracking-wider text-[#555D6B]">
                                            {
                                                service.service_type.category
                                                    .category_name
                                            }
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {service.specification && (
                                            <span className="rounded-md border border-[#2A2F3B] bg-[#12141A] px-2.5 py-1 text-[#8D95A3]">
                                                {service.specification}
                                            </span>
                                        )}

                                        <span className="rounded-md border border-[#2A2F3B] bg-[#12141A] px-2.5 py-1 text-[#8D95A3]">
                                            Qty: {service.quantity}
                                        </span>

                                        {service.action_type && (
                                            <span className="rounded-md border border-[#22B8C7]/15 bg-[#22B8C7]/5 px-2.5 py-1 text-[#50D1DD]">
                                                {service.action_type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Problem */}
                    <section className="relative rounded-2xl border border-[#2A2F3B] bg-[#1B1E28] p-5 md:p-6">
                        <p className="text-sm font-medium text-[#E3E6EA]">
                            Problem description
                        </p>

                        <div className="mt-4 rounded-xl border border-[#2A2F3B] bg-[#12141A] p-4">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-[#9BA3B0]">
                                {request.problem_description}
                            </p>
                        </div>
                    </section>

                    {/* Admin review */}
                    {isAdmin && request.request_status === 'pending' && (
                        <section className="relative overflow-hidden rounded-2xl border border-[#22B8C7]/20 bg-[#1B1E28]">
                            <div className="border-b border-[#2A2F3B] bg-[#22B8C7]/[0.035] px-5 py-4 md:px-6">
                                <p className="text-sm font-medium text-[#E3E6EA]">
                                    Review request
                                </p>

                                <p className="mt-1 text-xs text-[#626A78]">
                                    Set the request priority before approving
                                    or rejecting it.
                                </p>
                            </div>

                            <div className="p-5 md:p-6">
                                <div className="max-w-sm">
                                    <label className="mb-2 block text-xs font-medium text-[#B8BFCA]">
                                        Priority
                                    </label>

                                    <Select
                                        value={priority}
                                        onValueChange={setPriority}
                                    >
                                        <SelectTrigger className="h-10 w-full border-[#2A2F3B] bg-[#12141A] text-[#B8BFCA] focus:ring-1 focus:ring-[#22B8C7]/30">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>

                                        <SelectContent className="border-[#2A2F3B] bg-[#1B1E28] text-[#F1F3F5]">
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
                                        className="border-[#E45B68]/25 bg-transparent text-[#F27B86] hover:bg-[#E45B68]/10 hover:text-[#F58A93]"
                                    >
                                        <X className="size-4" />
                                        Reject
                                    </Button>

                                    <Button
                                        disabled={processing}
                                        onClick={() =>
                                            updateStatus('approved')
                                        }
                                        className="bg-[#22B8C7] text-[#081014] hover:bg-[#29C4D3]"
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
