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
    Send,
    UserCog,
    FileText,
} from 'lucide-react';
import { useState } from 'react';
import { BackButton } from '@/components/back-button';
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

const inputClass =
    'border-[#1a2035] bg-[#0c1222] text-white placeholder:text-white/40 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20';

const selectClass =
    'h-10 w-full border-[#1a2035] bg-[#0c1222] text-white/80 focus:ring-1 focus:ring-ustp-gold/30';

export default function JobOrdersShow({ jobOrder, isAdmin, canRate, canVerify, technicians }: Props) {
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

            <div className="relative min-h-full flex-1 overflow-hidden bg-[#070b18] px-4 py-6 text-white sm:px-6 lg:px-8">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-ustp-navy/[0.06] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-ustp-gold/[0.02] blur-3xl" />

                {/* Subtle dot pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, #fcb315 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                <div className="relative mx-auto max-w-4xl space-y-6">
                    <BackButton href="/job-orders" />

                    {/* Header */}
                    <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10 md:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${statusConfig_.bg} ${statusConfig_.color}`}>
                                    {statusConfig_.icon}
                                </div>
                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-white/40">
                                            {jobOrder.job_order_number || `JO-${String(jobOrder.id).padStart(4, '0')}`}
                                        </span>
                                        <span className="size-1 rounded-full bg-white/20" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">
                                            Job Order
                                        </span>
                                    </div>
                                    <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                                        {jobOrder.service_request.request_services
                                            .map((s) => s.service_type.service_name)
                                            .join(', ')}
                                    </h1>
                                    <p className="mt-1.5 text-xs text-white/40">
                                        Requested by {jobOrder.service_request.user.name}
                                    </p>
                                </div>
                            </div>

                            <span className={`w-fit rounded-lg border px-3 py-1 text-[10px] font-medium capitalize ${statusConfig_.border} ${statusConfig_.bg} ${statusConfig_.color}`}>
                                {statusConfig_.label}
                            </span>
                        </div>
                    </div>

                    {/* Timeline Progress */}
                    <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10 md:p-6">
                        <p className="mb-4 text-sm font-semibold text-white">Job Order Progress</p>
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
                                                        : 'border-white/15 bg-[#0a0f1c] text-white/30'
                                                } ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-[#0f1723] ' + stepConfig.border : ''}`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle2 className="size-5" />
                                                ) : (
                                                    <span className="text-xs font-medium">{index + 1}</span>
                                                )}
                                            </div>
                                            <span className={`mt-2 text-[10px] font-medium ${isCompleted ? stepConfig.color : 'text-white/30'}`}>
                                                {stepConfig.label}
                                            </span>
                                        </div>
                                        {index < statusSteps.length - 1 && (
                                            <div className={`mx-2 h-0.5 flex-1 ${index < currentStepIndex ? 'bg-ustp-light-blue' : 'bg-white/10'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                <User className="size-4" />
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                                Requested by
                            </p>
                            <p className="mt-1 text-sm font-medium text-white">
                                {jobOrder.service_request.user.name}
                            </p>
                            <p className="mt-0.5 text-xs text-white/40">
                                {jobOrder.service_request.user.department ?? 'No department'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                <UserCog className="size-4" />
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                                Assigned technician
                            </p>
                            <p className="mt-1 text-sm font-medium text-white">
                                {jobOrder.technician?.name ?? 'Unassigned'}
                            </p>
                            <p className="mt-0.5 text-xs text-white/40">
                                {jobOrder.date_assigned
                                    ? new Date(jobOrder.date_assigned).toLocaleDateString()
                                    : 'Not yet assigned'}
                            </p>
                        </div>
                    </div>

                    {/* SLA and Support Info */}
                    <div className="grid gap-4 md:grid-cols-3">
                        {jobOrder.sla_deadline && (
                            <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10">
                                <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                    <Clock className="size-4" />
                                </div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                                    SLA Deadline
                                </p>
                                <p className="mt-1 text-sm font-medium text-white">
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

                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10">
                            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                <UserCog className="size-4" />
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                                Support Type
                            </p>
                            <p className="mt-1 text-sm font-medium capitalize text-white">
                                {jobOrder.support_type === 'remote' ? 'Remote Support' : 'On-Site Support'}
                            </p>
                            {jobOrder.support_type === 'remote' && (
                                <p className="mt-0.5 text-xs text-white/40">
                                    {jobOrder.user_permission_granted ? 'Permission granted' : 'Permission required'}
                                </p>
                            )}
                        </div>

                        {jobOrder.estimated_repair_days && (
                            <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10">
                                <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                    <Clock className="size-4" />
                                </div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                                    Estimated Repair
                                </p>
                                <p className="mt-1 text-sm font-medium text-white">
                                    {jobOrder.estimated_repair_days} days
                                </p>
                                <p className="mt-0.5 text-xs text-white/40">
                                    {jobOrder.replacement_provided ? 'Replacement provided' : 'No replacement'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    {jobOrder.service_request.location && (
                        <section className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10 md:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <FileText className="size-4 text-ustp-gold" />
                                </div>
                                <p className="text-sm font-semibold text-white">Location</p>
                            </div>
                            <div className="mt-4 rounded-xl border border-[#1a2035] bg-[#0c1222] p-4">
                                <p className="text-sm text-white/70">
                                    {jobOrder.service_request.location}
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Services */}
                    <section className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 md:px-6">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                <ClipboardList className="size-4 text-ustp-gold" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Services requested</p>
                                <p className="mt-0.5 text-[11px] text-white/40">
                                    Services and specifications included in this job.
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
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                            <ClipboardList className="size-4" />
                                        </div>
                                        <p className="text-sm font-medium text-white">
                                            {service.service_type.service_name}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {service.specification && (
                                            <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/50">
                                                {service.specification}
                                            </span>
                                        )}
                                        <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/50">
                                            Qty: {service.quantity}
                                        </span>
                                        {service.action_type && (
                                            <span className="rounded-lg border border-ustp-gold/30 bg-ustp-gold/10 px-2.5 py-1 text-ustp-gold">
                                                {service.action_type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Problem description */}
                    <section className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-red-400/10">
                                <FileText className="size-4 text-red-400" />
                            </div>
                            <p className="text-sm font-semibold text-white">Problem description</p>
                        </div>
                        <div className="mt-4 rounded-xl border border-[#1a2035] bg-[#0c1222] p-4">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-white/70">
                                {jobOrder.service_request.problem_description}
                            </p>
                        </div>
                    </section>

                    {/* Technician responses */}
                    <section className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                <MessageSquare className="size-4 text-ustp-gold" />
                            </div>
                            <p className="text-sm font-semibold text-white">Technician responses</p>
                        </div>

                        {jobOrder.technician_responses.length > 0 ? (
                            <div className="mt-4 flex flex-col gap-3">
                                {jobOrder.technician_responses.map((response) => (
                                    <div
                                        key={response.id}
                                        className="rounded-xl border border-[#1a2035] bg-[#0c1222] p-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-6 items-center justify-center rounded-full bg-ustp-gold/10 text-ustp-gold">
                                                <User className="size-3" />
                                            </div>
                                            <p className="text-xs font-medium text-white/80">
                                                {response.technician.name}
                                            </p>
                                            <span className="text-[10px] text-white/40">
                                                · {new Date(response.date_responded).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-white/70">
                                            {response.response_report}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-white/40">No responses yet.</p>
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
                                    className={inputClass}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={responseProcessing || !responseText.trim()}
                                        className="bg-ustp-gold text-ustp-navy hover:bg-ustp-gold-dark hover:text-white"
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
                        <section className="overflow-hidden rounded-2xl border border-ustp-gold/30 bg-[#0f1723] shadow-xl shadow-black/10">
                            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-ustp-gold/[0.04] px-5 py-4 md:px-6">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <Star className="size-4 text-ustp-gold" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Service Rating</p>
                                    <p className="mt-0.5 text-[11px] text-white/40">
                                        {jobOrder.rating
                                            ? 'Your feedback for this service.'
                                            : 'Rate the service provided for this job order.'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 md:p-6">
                                {jobOrder.rating ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`size-5 ${star <= jobOrder.rating! ? 'fill-ustp-gold text-ustp-gold' : 'text-white/20'}`}
                                                />
                                            ))}
                                        </div>
                                        {jobOrder.requester_comment && (
                                            <div className="rounded-xl border border-[#1a2035] bg-[#0c1222] p-4">
                                                <p className="mb-1 text-xs text-white/40">Your comment</p>
                                                <p className="text-sm text-white/70">{jobOrder.requester_comment}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <form onSubmit={handleRate} className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-xs font-medium text-white/70">
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
                                                                    : 'text-white/20'
                                                            }`}
                                                        />
                                                    </button>
                                                ))}
                                                {rating > 0 && (
                                                    <span className="ml-2 text-xs text-white/40">
                                                        {rating}/5
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <label className="text-xs font-medium text-white/70">
                                                Comment (optional)
                                            </label>
                                            <Textarea
                                                rows={3}
                                                placeholder="Share your experience or suggestions..."
                                                value={ratingComment}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                    setRatingComment(e.target.value)
                                                }
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={ratingProcessing || rating === 0}
                                                className="bg-ustp-gold text-ustp-navy hover:bg-ustp-gold-dark hover:text-white"
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
                        <section className="overflow-hidden rounded-2xl border border-ustp-light-blue/20 bg-[#0f1723] shadow-xl shadow-black/10">
                            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-ustp-light-blue/[0.04] px-5 py-4 md:px-6">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-light-blue/10">
                                    <CheckCircle2 className="size-4 text-ustp-light-blue" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Verify Completion</p>
                                    <p className="mt-0.5 text-[11px] text-white/40">
                                        Please verify if the issue has been resolved.
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 md:p-6">
                                <p className="mb-4 text-sm text-white/70">
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
                                        <FileText className="size-4" />
                                        No, issue persists
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Admin manage */}
                    {isAdmin && (
                        <section className="overflow-hidden rounded-2xl border border-ustp-gold/30 bg-[#0f1723] shadow-xl shadow-black/10">
                            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-ustp-gold/[0.04] px-5 py-4 md:px-6">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <UserCog className="size-4 text-ustp-gold" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Manage job order</p>
                                    <p className="mt-0.5 text-[11px] text-white/40">
                                        Assign a technician and update the order status.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 p-5 md:p-6">
                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-white/70">Assign technician</label>
                                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                                        <SelectTrigger className={selectClass}>
                                            <SelectValue placeholder="Unassigned" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-white">
                                            {technicians.map((tech) => (
                                                <SelectItem key={tech.id} value={String(tech.id)}>
                                                    {tech.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-white/70">Status</label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger className={selectClass}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-white">
                                            <SelectItem value="open">Open</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-white/70">Support type</label>
                                    <Select value={supportType} onValueChange={setSupportType}>
                                        <SelectTrigger className={selectClass}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-white">
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
                                            className="rounded border-white/30 bg-[#0c1222] text-ustp-gold focus:ring-ustp-gold/30"
                                        />
                                        <label htmlFor="user_permission" className="text-xs text-white/70">
                                            User permission granted for remote access
                                        </label>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-white/70">Estimated repair days</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={estimatedDays}
                                        onChange={(e) => setEstimatedDays(e.target.value)}
                                        placeholder="e.g. 5"
                                        className="h-10 rounded-md border border-[#1a2035] bg-[#0c1222] px-3 text-sm text-white placeholder:text-white/40 focus:ring-1 focus:ring-ustp-gold/30"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-white/70">Final remarks</label>
                                    <Select value={finalRemarks} onValueChange={setFinalRemarks}>
                                        <SelectTrigger className={selectClass}>
                                            <SelectValue placeholder="Not set" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-white">
                                            <SelectItem value="outsource_repair">For Outsource Repair</SelectItem>
                                            <SelectItem value="replacement">For Replacement</SelectItem>
                                            <SelectItem value="disposal">For Disposal</SelectItem>
                                            <SelectItem value="task_completed">Task Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="border-t border-white/[0.06] bg-[#0a0f1c] px-5 py-4">
                                <div className="flex justify-end">
                                    <Button
                                        disabled={processing}
                                        onClick={handleSave}
                                        className="bg-ustp-gold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:bg-ustp-gold-dark hover:text-white"
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