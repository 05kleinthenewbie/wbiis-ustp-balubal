import { Head, router } from '@inertiajs/react';
import {
    ClipboardList,
    Star,
    User,
    Clock,
    PlayCircle,
    CheckCircle2,
    Archive,
    MessageSquare,
    Settings,
    AlertTriangle,
    FileText,
    Send,
    UserCog,
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
import { Textarea } from '@/components/ui/textarea';

type Technician = { id: number; name: string };

type TechnicianResponse = {
    id: number;
    response_report: string;
    response_type: string;
    time_spent_minutes: number | null;
    date_responded: string;
    technician: { name: string };
};

type JobOrderDetail = {
    id: number;
    job_order_number: string | null;
    status: string;
    final_remarks: string | null;
    date_assigned: string | null;
    date_completed: string | null;
    date_in_progress: string | null;
    date_closed: string | null;
    rating: number | null;
    requester_comment: string | null;
    sla_deadline: string | null;
    sla_status: string | null;
    priority_level: string | null;
    support_type: string;
    user_permission_granted: boolean;
    estimated_repair_days: number | null;
    replacement_provided: boolean;
    service_request: {
        problem_description: string;
        location: string | null;
        user: { name: string; department: string | null };
        request_services: {
            id: number;
            specification: string | null;
            quantity: number;
            action_type: string | null;
            service_type: { service_name: string };
        }[];
    };
    technician: { id: number; name: string } | null;
    technician_responses: TechnicianResponse[];
};

type Props = {
    jobOrder: JobOrderDetail;
    isAdmin: boolean;
    isRequester: boolean;
    canRate: boolean;
    canVerify: boolean;
    technicians: Technician[];
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
    open: {
        label: 'Open',
        color: 'text-slate-300',
        bg: 'bg-slate-400/10',
        border: 'border-slate-400/20',
        icon: <Clock className="size-5" />,
    },
    in_progress: {
        label: 'In Progress',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20',
        icon: <PlayCircle className="size-5" />,
    },
    completed: {
        label: 'Completed',
        color: 'text-ustp-light-blue',
        bg: 'bg-ustp-light-blue/10',
        border: 'border-ustp-light-blue/20',
        icon: <CheckCircle2 className="size-5" />,
    },
    closed: {
        label: 'Closed',
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
        border: 'border-emerald-400/20',
        icon: <Archive className="size-5" />,
    },
};

const statusSteps = ['open', 'in_progress', 'completed', 'closed'];

export default function JobOrdersShow({ jobOrder, isAdmin, isRequester, canRate, canVerify, technicians }: Props) {
    const [assignedTo, setAssignedTo] = useState(
        jobOrder.technician ? String(jobOrder.technician.id) : '',
    );
    const [status, setStatus] = useState(jobOrder.status);
    const [finalRemarks, setFinalRemarks] = useState(jobOrder.final_remarks ?? '');
    const [supportType, setSupportType] = useState(jobOrder.support_type);
    const [userPermission, setUserPermission] = useState(jobOrder.user_permission_granted);
    const [estimatedDays, setEstimatedDays] = useState(jobOrder.estimated_repair_days?.toString() ?? '');
    const [processing, setProcessing] = useState(false);

    const [responseText, setResponseText] = useState('');
    const [responseType, setResponseType] = useState('progress');
    const [timeSpent, setTimeSpent] = useState('');
    const [responseProcessing, setResponseProcessing] = useState(false);

    const [rating, setRating] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [ratingProcessing, setRatingProcessing] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);

    const [verifyProcessing, setVerifyProcessing] = useState(false);

    function handleSave() {
        setProcessing(true);
        router.put(
            `/job-orders/${jobOrder.id}`,
            {
                assigned_to: assignedTo || null,
                status,
                final_remarks: finalRemarks || null,
                support_type: supportType,
                user_permission_granted: userPermission,
                estimated_repair_days: estimatedDays ? parseInt(estimatedDays) : null,
            },
            { onFinish: () => setProcessing(false) },
        );
    }

    function handleAddResponse(e: React.FormEvent) {
        e.preventDefault();
        setResponseProcessing(true);
        router.post(
            `/job-orders/${jobOrder.id}/responses`,
            {
                response_report: responseText,
                response_type: responseType,
                time_spent_minutes: timeSpent ? parseInt(timeSpent) : null,
            },
            {
                onSuccess: () => {
                    setResponseText('');
                    setResponseType('progress');
                    setTimeSpent('');
                },
                onFinish: () => setResponseProcessing(false),
            },
        );
    }

    function handleVerify(verified: boolean) {
        setVerifyProcessing(true);
        router.post(
            `/job-orders/${jobOrder.id}/verify`,
            { verified },
            { onFinish: () => setVerifyProcessing(false) },
        );
    }

    function handleRate(e: React.FormEvent) {
        e.preventDefault();

        if (rating === 0) {
return;
}

        setRatingProcessing(true);
        router.post(
            `/job-orders/${jobOrder.id}/rate`,
            { rating, requester_comment: ratingComment || null },
            {
                onSuccess: () => {
                    setRating(0);
                    setRatingComment('');
                },
                onFinish: () => setRatingProcessing(false),
            },
        );
    }

    const statusConfig_ = statusConfig[jobOrder.status] || statusConfig.open;
    const currentStepIndex = statusSteps.indexOf(jobOrder.status);

    return (
        <>
            <Head title={`Job Order #${jobOrder.id}`} />

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative mx-auto flex max-w-4xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-100 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/job-orders" />
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
                                            {jobOrder.job_order_number || `JO-${String(jobOrder.id).padStart(4, '0')}`}
                                        </span>
                                        <span className="size-1 rounded-full bg-gray-600" />
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500">
                                            Job Order
                                        </span>
                                    </div>
                                    <h1 className="text-xl font-semibold tracking-tight text-gray-50 md:text-2xl">
                                        {jobOrder.service_request.request_services
                                            .map((s) => s.service_type.service_name)
                                            .join(', ')}
                                    </h1>
                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Requested by {jobOrder.service_request.user.name}
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
                        <p className="mb-4 text-sm font-medium text-gray-200">Job Order Progress</p>
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
                                                    <span className="text-xs font-medium">{index + 1}</span>
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

                    {/* Info grid */}
                    <div className="relative grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                <User className="size-4" />
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                Requested by
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-200">
                                {jobOrder.service_request.user.name}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                                {jobOrder.service_request.user.department ?? 'No department'}
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                <UserCog className="size-4" />
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                Assigned technician
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-200">
                                {jobOrder.technician?.name ?? 'Unassigned'}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                                {jobOrder.date_assigned
                                    ? new Date(jobOrder.date_assigned).toLocaleDateString()
                                    : 'Not yet assigned'}
                            </p>
                        </div>
                    </div>

                    {/* SLA and Support Info */}
                    <div className="relative grid gap-4 md:grid-cols-3">
                        {jobOrder.sla_deadline && (
                            <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                                <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                    <Clock className="size-4" />
                                </div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                    SLA Deadline
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-200">
                                    {new Date(jobOrder.sla_deadline).toLocaleString()}
                                </p>
                                <p className={`mt-0.5 text-xs capitalize ${
                                    jobOrder.sla_status === 'breached' ? 'text-red-400' :
                                    jobOrder.sla_status === 'at_risk' ? 'text-amber-400' :
                                    'text-emerald-400'
                                }`}>
                                    {jobOrder.sla_status === 'breached' ? 'SLA Breached' :
                                     jobOrder.sla_status === 'at_risk' ? 'At Risk' :
                                     'On Track'}
                                </p>
                            </div>
                        )}

                        <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                <Settings className="size-4" />
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                Support Type
                            </p>
                            <p className="mt-1 text-sm font-medium capitalize text-gray-200">
                                {jobOrder.support_type === 'remote' ? 'Remote Support' : 'On-Site Support'}
                            </p>
                            {jobOrder.support_type === 'remote' && (
                                <p className="mt-0.5 text-xs text-gray-500">
                                    {jobOrder.user_permission_granted ? 'Permission granted' : 'Permission required'}
                                </p>
                            )}
                        </div>

                        {jobOrder.estimated_repair_days && (
                            <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-4">
                                <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                    <Clock className="size-4" />
                                </div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                    Estimated Repair
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-200">
                                    {jobOrder.estimated_repair_days} days
                                </p>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    {jobOrder.replacement_provided ? 'Replacement provided' : 'No replacement'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    {jobOrder.service_request.location && (
                        <section className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                            <div className="flex items-center gap-2">
                                <FileText className="size-4 text-ustp-light-blue" />
                                <p className="text-sm font-medium text-gray-200">
                                    Location
                                </p>
                            </div>
                            <div className="mt-3 rounded-xl border border-[#1a2035] bg-[#070b18] p-4">
                                <p className="text-sm text-gray-300">
                                    {jobOrder.service_request.location}
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Services */}
                    <section className="relative overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723]">
                        <div className="border-b border-[#1a2035] px-5 py-4 md:px-6">
                            <div className="flex items-center gap-2">
                                <FileText className="size-4 text-ustp-light-blue" />
                                <p className="text-sm font-medium text-gray-200">
                                    Services requested
                                </p>
                            </div>
                        </div>
                        <div className="divide-y divide-[#151c2c]">
                            {jobOrder.service_request.request_services.map((service) => (
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

                    {/* Problem description */}
                    <section className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="size-4 text-amber-400" />
                            <p className="text-sm font-medium text-gray-200">
                                Problem description
                            </p>
                        </div>
                        <div className="mt-3 rounded-xl border border-[#1a2035] bg-[#070b18] p-4">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                                {jobOrder.service_request.problem_description}
                            </p>
                        </div>
                    </section>

                    {/* Technician responses */}
                    <section className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="size-4 text-ustp-light-blue" />
                            <p className="text-sm font-medium text-gray-200">
                                Technician responses
                            </p>
                        </div>

                        {jobOrder.technician_responses.length > 0 ? (
                            <div className="mt-4 flex flex-col gap-3">
                                {jobOrder.technician_responses.map((response) => (
                                    <div
                                        key={response.id}
                                        className="rounded-xl border border-[#1a2035] bg-[#070b18] p-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-6 items-center justify-center rounded-full bg-ustp-blue-accent/15 text-ustp-light-blue">
                                                <User className="size-3" />
                                            </div>
                                            <p className="text-xs font-medium text-gray-300">
                                                {response.technician.name}
                                            </p>
                                            <span className="text-[10px] text-gray-500">
                                                · {new Date(response.date_responded).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-300">
                                            {response.response_report}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-gray-500">No responses yet.</p>
                        )}

                        {isAdmin && (
                            <form onSubmit={handleAddResponse} className="mt-4 flex flex-col gap-2">
                                <Textarea
                                    rows={3}
                                    placeholder="Add findings, progress update, or recommendation"
                                    value={responseText}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setResponseText(e.target.value)
                                    }
                                    className="border-[#1a2035] bg-[#070b18] text-sm text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={responseProcessing || !responseText.trim()}
                                        className="bg-ustp-navy text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                                    >
                                        <Send className="size-3.5" />
                                        Add response
                                    </Button>
                                </div>
                            </form>
                        )}
                    </section>

                    {/* Rating section */}
                    {(canRate || jobOrder.rating) && (
                        <section className="relative overflow-hidden rounded-2xl border border-ustp-gold/20 bg-[#0f1723]">
                            <div className="border-b border-[#1a2035] bg-ustp-gold/[0.04] px-5 py-4 md:px-6">
                                <div className="flex items-center gap-2">
                                    <Star className="size-4 text-ustp-gold" />
                                    <p className="text-sm font-medium text-gray-200">
                                        Service Rating
                                    </p>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    {jobOrder.rating
                                        ? 'Your feedback for this service.'
                                        : 'Rate the service provided for this job order.'}
                                </p>
                            </div>

                            <div className="p-5 md:p-6">
                                {jobOrder.rating ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`size-5 ${star <= jobOrder.rating! ? 'fill-ustp-gold text-ustp-gold' : 'text-gray-600'}`}
                                                />
                                            ))}
                                        </div>
                                        {jobOrder.requester_comment && (
                                            <div className="rounded-xl border border-[#1a2035] bg-[#070b18] p-4">
                                                <p className="text-xs text-gray-500 mb-1">Your comment</p>
                                                <p className="text-sm text-gray-300">{jobOrder.requester_comment}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <form onSubmit={handleRate} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-300 mb-2 block">
                                                How would you rate this service?
                                            </label>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onMouseEnter={() => setHoveredStar(star)}
                                                        onMouseLeave={() => setHoveredStar(0)}
                                                        onClick={() => setRating(star)}
                                                        className="transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            className={`size-6 transition-colors ${
                                                                star <= (hoveredStar || rating)
                                                                    ? 'fill-ustp-gold text-ustp-gold'
                                                                    : 'text-gray-600'
                                                            }`}
                                                        />
                                                    </button>
                                                ))}
                                                {rating > 0 && (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        {rating}/5
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <label className="text-xs font-medium text-gray-300">
                                                Comment (optional)
                                            </label>
                                            <Textarea
                                                rows={3}
                                                placeholder="Share your experience or suggestions..."
                                                value={ratingComment}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                    setRatingComment(e.target.value)
                                                }
                                                className="border-[#1a2035] bg-[#070b18] text-sm text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={ratingProcessing || rating === 0}
                                                className="bg-ustp-gold text-black shadow-lg shadow-ustp-gold/20 hover:bg-ustp-gold/90"
                                            >
                                                <Star className="size-3.5" />
                                                Submit Rating
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Verification section */}
                    {canVerify && (
                        <section className="relative overflow-hidden rounded-2xl border border-ustp-light-blue/20 bg-[#0f1723]">
                            <div className="border-b border-[#1a2035] bg-ustp-light-blue/[0.04] px-5 py-4 md:px-6">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-ustp-light-blue" />
                                    <p className="text-sm font-medium text-gray-200">
                                        Verify Completion
                                    </p>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Please verify if the issue has been resolved.
                                </p>
                            </div>

                            <div className="p-5 md:p-6">
                                <p className="mb-4 text-sm text-gray-300">
                                    Has the technician resolved your issue?
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        disabled={verifyProcessing}
                                        onClick={() => handleVerify(true)}
                                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                                    >
                                        <CheckCircle2 className="size-4" />
                                        Yes, issue resolved
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={verifyProcessing}
                                        onClick={() => handleVerify(false)}
                                        className="border-amber-400/25 text-amber-300 hover:bg-amber-400/10"
                                    >
                                        <AlertTriangle className="size-4" />
                                        No, issue persists
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Admin manage */}
                    {isAdmin && (
                        <section className="relative overflow-hidden rounded-2xl border border-ustp-navy/20 bg-[#0f1723]">
                            <div className="border-b border-[#1a2035] bg-ustp-navy/[0.04] px-5 py-4 md:px-6">
                                <div className="flex items-center gap-2">
                                    <Settings className="size-4 text-ustp-light-blue" />
                                    <p className="text-sm font-medium text-gray-200">
                                        Manage job order
                                    </p>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Assign a technician and update the order status.
                                </p>
                            </div>

                            <div className="space-y-4 p-5 md:p-6">
                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-gray-300">
                                        Assign technician
                                    </label>
                                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                                        <SelectTrigger className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                            <SelectValue placeholder="Unassigned" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                            {technicians.map((tech) => (
                                                <SelectItem key={tech.id} value={String(tech.id)}>
                                                    {tech.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-gray-300">
                                        Status
                                    </label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                            <SelectItem value="open">Open</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-gray-300">
                                        Support type
                                    </label>
                                    <Select value={supportType} onValueChange={setSupportType}>
                                        <SelectTrigger className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                            <SelectItem value="on_site">On-Site Support</SelectItem>
                                            <SelectItem value="remote">Remote Support</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {supportType === 'remote' && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="user_permission"
                                            checked={userPermission}
                                            onChange={(e) => setUserPermission(e.target.checked)}
                                            className="rounded border-gray-600 bg-[#070b18] text-ustp-navy focus:ring-ustp-navy/25"
                                        />
                                        <label htmlFor="user_permission" className="text-xs text-gray-300">
                                            User permission granted for remote access
                                        </label>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-gray-300">
                                        Estimated repair days
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={estimatedDays}
                                        onChange={(e) => setEstimatedDays(e.target.value)}
                                        placeholder="e.g. 5"
                                        className="h-10 rounded-md border border-[#1a2035] bg-[#070b18] px-3 text-sm text-gray-300 placeholder:text-gray-500 focus:ring-1 focus:ring-ustp-navy/30"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-gray-300">
                                        Final remarks
                                    </label>
                                    <Select value={finalRemarks} onValueChange={setFinalRemarks}>
                                        <SelectTrigger className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                            <SelectValue placeholder="Not set" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                            <SelectItem value="outsource_repair">
                                                For Outsource Repair
                                            </SelectItem>
                                            <SelectItem value="replacement">For Replacement</SelectItem>
                                            <SelectItem value="disposal">For Disposal</SelectItem>
                                            <SelectItem value="task_completed">Task Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="border-t border-[#1a2035] bg-[#0a0f1c] px-5 py-4">
                                <div className="flex justify-end">
                                    <Button
                                        disabled={processing}
                                        onClick={handleSave}
                                        className="bg-ustp-navy text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                                    >
                                        Save changes
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
