import { Head, router } from '@inertiajs/react';
import { ClipboardList, User } from 'lucide-react';
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
    date_responded: string;
    technician: { name: string };
};

type JobOrderDetail = {
    id: number;
    status: string;
    final_remarks: string | null;
    date_assigned: string | null;
    date_completed: string | null;
    service_request: {
        problem_description: string;
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
    technicians: Technician[];
};

const statusStyles: Record<string, string> = {
    open: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
    in_progress: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    completed: 'border-ustp-light-blue/30 bg-ustp-light-blue/10 text-ustp-light-blue',
    closed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
};

export default function JobOrdersShow({ jobOrder, isAdmin, technicians }: Props) {
    const [assignedTo, setAssignedTo] = useState(
        jobOrder.technician ? String(jobOrder.technician.id) : '',
    );
    const [status, setStatus] = useState(jobOrder.status);
    const [finalRemarks, setFinalRemarks] = useState(jobOrder.final_remarks ?? '');
    const [processing, setProcessing] = useState(false);

    const [responseText, setResponseText] = useState('');
    const [responseProcessing, setResponseProcessing] = useState(false);

    function handleSave() {
        setProcessing(true);
        router.put(
            `/job-orders/${jobOrder.id}`,
            {
                assigned_to: assignedTo || null,
                status,
                final_remarks: finalRemarks || null,
            },
            { onFinish: () => setProcessing(false) },
        );
    }

    function handleAddResponse(e: React.FormEvent) {
        e.preventDefault();
        setResponseProcessing(true);
        router.post(
            `/job-orders/${jobOrder.id}/responses`,
            { response_report: responseText },
            {
                onSuccess: () => setResponseText(''),
                onFinish: () => setResponseProcessing(false),
            },
        );
    }

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
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#1a2035] bg-[#070b18] text-ustp-light-blue">
                                    <ClipboardList className="size-5" />
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-gray-500">
                                            JO-{String(jobOrder.id).padStart(4, '0')}
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
                                className={`w-fit rounded-md px-3 py-1 text-[10px] font-medium capitalize ${statusStyles[jobOrder.status] ?? 'border-[#1a2035] bg-[#070b18] text-gray-400'}`}
                            >
                                {jobOrder.status.replace('_', ' ')}
                            </Badge>
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
                                <ClipboardList className="size-4" />
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

                    {/* Problem description */}
                    <section className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                        <p className="text-sm font-medium text-gray-200">
                            Problem description
                        </p>

                        <div className="mt-3 rounded-xl border border-[#1a2035] bg-[#070b18] p-4">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                                {jobOrder.service_request.problem_description}
                            </p>
                        </div>
                    </section>

                    {/* Technician responses */}
                    <section className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                        <p className="text-sm font-medium text-gray-200">
                            Technician responses
                        </p>

                        {jobOrder.technician_responses.length > 0 ? (
                            <div className="mt-3 flex flex-col gap-2">
                                {jobOrder.technician_responses.map((response) => (
                                    <div
                                        key={response.id}
                                        className="rounded-xl border border-[#1a2035] bg-[#070b18] p-3"
                                    >
                                        <p className="text-xs text-gray-500">
                                            {response.technician.name} ·{' '}
                                            {new Date(response.date_responded).toLocaleString()}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-300">
                                            {response.response_report}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">No responses yet.</p>
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
                                        Add response
                                    </Button>
                                </div>
                            </form>
                        )}
                    </section>

                    {/* Admin manage */}
                    {isAdmin && (
                        <section className="relative overflow-hidden rounded-2xl border border-ustp-navy/20 bg-[#0f1723]">
                            <div className="border-b border-[#1a2035] bg-ustp-navy/[0.04] px-5 py-4 md:px-6">
                                <p className="text-sm font-medium text-gray-200">
                                    Manage job order
                                </p>
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
