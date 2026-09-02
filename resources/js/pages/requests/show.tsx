import { Head, router } from '@inertiajs/react';
import {
    Check,
    ClipboardList,
    Clock3,
    UserRound,
    X,
    FileText,
    AlertTriangle,
    CheckCircle2,
    Circle,
    ArrowRight,
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
    form_number: string | null;
    problem_description: string;
    priority_level: string | null;
    request_status: string;
    date_requested: string;
    location: string | null;
    contact_details: string | null;
    rejection_reason: string | null;
    sla_deadline: string | null;
    sla_status: string | null;
    user: { name: string; department: string | null };
    request_services: RequestService[];
};

type Props = {
    request: ServiceRequestDetail;
    isAdmin: boolean;
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
    pending: {
        label: 'Pending',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20',
        icon: <Clock3 className="size-5" />,
    },
    approved: {
        label: 'Approved',
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
        border: 'border-emerald-400/20',
        icon: <CheckCircle2 className="size-5" />,
    },
    rejected: {
        label: 'Rejected',
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20',
        icon: <X className="size-5" />,
    },
    completed: {
        label: 'Completed',
        color: 'text-ustp-light-blue',
        bg: 'bg-ustp-light-blue/10',
        border: 'border-ustp-light-blue/20',
        icon: <CheckCircle2 className="size-5" />,
    },
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
    low: { label: 'Low', color: 'text-gray-400', bg: 'bg-gray-400/10' },
    medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    urgent: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-400/10' },
};

const statusSteps = ['pending', 'approved', 'completed'];

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

    const statusConfig_ = statusConfig[request.request_status] || statusConfig.pending;
    const priorityConfig_ = request.priority_level ? priorityConfig[request.priority_level] : null;
    const currentStepIndex = statusSteps.indexOf(request.request_status);

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
                                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${statusConfig_.bg} ${statusConfig_.color}`}>
                                    {statusConfig_.icon}
                                </div>
                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-gray-500">
                                            {request.form_number || `REQUEST #${request.id}`}
                                        </span>
                                        <span className="size-1 rounded-full bg-gray-600" />
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500">
                                            ICT Service
                                        </span>
                                    </div>
                                    <h1 className="text-xl font-semibold tracking-tight text-gray-50 md:text-2xl">
                                        {request.request_services
                                            .map((s) => s.service_type.service_name)
                                            .join(', ') || 'Service request'}
                                    </h1>
                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Submitted {new Date(request.date_requested).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <Badge
                                variant="outline"
                                className={`w-fit rounded-lg px-3 py-1 text-[10px] font-medium capitalize ${statusConfig_.border} ${statusConfig_.bg} ${statusConfig_.color}`}
                            >
                                {statusConfig_.label}
                            </Badge>
                        </div>
                    </div>

                    {/* Timeline Progress */}
                    <div className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10 md:p-6">
                        <p className="mb-4 text-sm font-medium text-gray-200">Request Progress</p>
                        <div className="flex items-center justify-between">
                            {statusSteps.map((step, index) => {
                                const stepConfig = statusConfig[step];
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step} className="flex flex-1 items-center">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`flex size-10 items-center justify-center rounded-full border-2 transition-all ${
                                                    isCompleted
                                                        ? `${stepConfig.border} ${stepConfig.bg} ${stepConfig.color}`
                                                        : 'border-gray-700 bg-[#070b18] text-gray-600'
                                                } ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-[#0f1723] ' + stepConfig.border : ''}`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle2 className="size-5" />
                                                ) : (
                                                    <Circle className="size-5" />
                                                )}
                                            </div>
                                            <span className={`mt-2 text-[10px] font-medium ${isCompleted ? stepConfig.color : 'text-gray-600'}`}>
                                                {stepConfig.label}
                                            </span>
                                        </div>
                                        {index < statusSteps.length - 1 && (
                                            <div className={`mx-2 h-0.5 flex-1 ${index < currentStepIndex ? 'bg-ustp-light-blue' : 'bg-gray-700'}`} />
                                        )}
                                    </div>
                                );
                            })}
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
                                {new Date(request.date_requested).toLocaleDateString()}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                                {new Date(request.date_requested).toLocaleTimeString([], {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                            <div className={`mb-3 flex size-8 items-center justify-center rounded-lg ${priorityConfig_?.bg || 'bg-gray-400/10'} ${priorityConfig_?.color || 'text-gray-400'}`}>
                                <AlertTriangle className="size-4" />
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                Priority
                            </p>
                            <p className={`mt-1 text-sm font-medium capitalize ${priorityConfig_?.color || 'text-gray-400'}`}>
                                {request.priority_level ?? 'Not set yet'}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                                Assigned by ICT Admin
                            </p>
                        </div>
                    </div>

                    {/* SLA Status, Location, and Contact */}
                    <div className="relative grid gap-4 md:grid-cols-3">
                        {request.sla_deadline && (
                            <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                                <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                    <Clock3 className="size-4" />
                                </div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                    SLA Deadline
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-200">
                                    {new Date(request.sla_deadline).toLocaleString()}
                                </p>
                                <p className={`mt-0.5 text-xs capitalize ${
                                    request.sla_status === 'breached' ? 'text-red-400' :
                                    request.sla_status === 'at_risk' ? 'text-amber-400' :
                                    'text-emerald-400'
                                }`}>
                                    {request.sla_status === 'breached' ? 'SLA Breached' :
                                     request.sla_status === 'at_risk' ? 'At Risk' :
                                     'On Track'}
                                </p>
                            </div>
                        )}

                        {request.location && (
                            <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                                <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                    <FileText className="size-4" />
                                </div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                    Location
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-200">
                                    {request.location}
                                </p>
                            </div>
                        )}

                        {request.contact_details && (
                            <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                                <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                    <FileText className="size-4" />
                                </div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                    Contact Details
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-200">
                                    {request.contact_details}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Services */}
                    <section className="relative overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723]">
                        <div className="border-b border-[#1a2035] px-5 py-4 md:px-6">
                            <div className="flex items-center gap-2">
                                <FileText className="size-4 text-ustp-light-blue" />
                                <p className="text-sm font-medium text-gray-200">
                                    Services requested
                                </p>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Services and specifications included in this request.
                            </p>
                        </div>

                        <div className="divide-y divide-[#151c2c]">
                            {request.request_services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                            <ClipboardList className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-200">
                                                {service.service_type.service_name}
                                            </p>
                                            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-500">
                                                {service.service_type.category.category_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {service.specification && (
                                            <span className="rounded-lg border border-[#1a2035] bg-[#070b18] px-2.5 py-1 text-gray-400">
                                                {service.specification}
                                            </span>
                                        )}
                                        <span className="rounded-lg border border-[#1a2035] bg-[#070b18] px-2.5 py-1 text-gray-400">
                                            Qty: {service.quantity}
                                        </span>
                                        {service.action_type && (
                                            <span className="rounded-lg border border-ustp-navy/20 bg-ustp-navy/5 px-2.5 py-1 text-ustp-light-blue">
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
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="size-4 text-amber-400" />
                            <p className="text-sm font-medium text-gray-200">
                                Problem description
                            </p>
                        </div>
                        <div className="mt-4 rounded-xl border border-[#1a2035] bg-[#070b18] p-4">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                                {request.problem_description}
                            </p>
                        </div>
                    </section>

                    {/* Rejection reason */}
                    {request.request_status === 'rejected' && request.rejection_reason && (
                        <section className="relative rounded-2xl border border-red-400/20 bg-red-400/5 p-5 md:p-6">
                            <div className="flex items-center gap-2">
                                <X className="size-4 text-red-400" />
                                <p className="text-sm font-medium text-red-300">
                                    Rejection Reason
                                </p>
                            </div>
                            <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/5 p-4">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-red-200">
                                    {request.rejection_reason}
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Admin review */}
                    {isAdmin && request.request_status === 'pending' && (
                        <section className="relative overflow-hidden rounded-2xl border border-ustp-navy/20 bg-[#0f1723]">
                            <div className="border-b border-[#1a2035] bg-ustp-navy/[0.04] px-5 py-4 md:px-6">
                                <div className="flex items-center gap-2">
                                    <Check className="size-4 text-ustp-light-blue" />
                                    <p className="text-sm font-medium text-gray-200">
                                        Review request
                                    </p>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Set the request priority before approving or rejecting it.
                                </p>
                            </div>

                            <div className="p-5 md:p-6">
                                <div className="max-w-sm">
                                    <label className="mb-2 block text-xs font-medium text-gray-300">
                                        Priority
                                    </label>
                                    <Select value={priority} onValueChange={setPriority}>
                                        <SelectTrigger className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Button
                                        variant="outline"
                                        disabled={processing}
                                        onClick={() => updateStatus('rejected')}
                                        className="border-red-400/25 bg-transparent text-red-300 hover:bg-red-400/10 hover:text-red-200"
                                    >
                                        <X className="size-4" />
                                        Reject
                                    </Button>
                                    <Button
                                        disabled={processing}
                                        onClick={() => updateStatus('approved')}
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
