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
    open: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-amber-100 text-amber-800',
    completed: 'bg-blue-100 text-blue-800',
    closed: 'bg-green-100 text-green-800',
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

            <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Job order #JO-{String(jobOrder.id).padStart(4, '0')}
                        </p>
                        <h1 className="text-xl font-semibold">
                            {jobOrder.service_request.request_services
                                .map((s) => s.service_type.service_name)
                                .join(', ')}
                        </h1>
                    </div>
                    <Badge className={statusStyles[jobOrder.status] ?? ''} variant="outline">
                        {jobOrder.status.replace('_', ' ')}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground">Requested by</p>
                        <p>{jobOrder.service_request.user.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p>{jobOrder.service_request.user.department ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Assigned technician</p>
                        <p>{jobOrder.technician?.name ?? 'Unassigned'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Date assigned</p>
                        <p>
                            {jobOrder.date_assigned
                                ? new Date(jobOrder.date_assigned).toLocaleDateString()
                                : '—'}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="mb-2 text-sm font-medium">Problem description</p>
                    <p className="text-sm text-muted-foreground">
                        {jobOrder.service_request.problem_description}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="mb-2 text-sm font-medium">Technician responses</p>

                    {jobOrder.technician_responses.length > 0 ? (
                        <div className="mb-4 flex flex-col gap-2">
                            {jobOrder.technician_responses.map((response) => (
                                <div key={response.id} className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xs text-muted-foreground">
                                        {response.technician.name} ·{' '}
                                        {new Date(response.date_responded).toLocaleString()}
                                    </p>
                                    <p className="mt-1 text-sm">{response.response_report}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mb-4 text-sm text-muted-foreground">No responses yet.</p>
                    )}

                    {isAdmin && (
                        <form onSubmit={handleAddResponse} className="flex flex-col gap-2">
                            <Textarea
                                rows={3}
                                placeholder="Add findings, progress update, or recommendation"
                                value={responseText}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setResponseText(e.target.value)
                                }
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={responseProcessing || !responseText.trim()}
                                    className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                                >
                                    Add response
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                {isAdmin && (
                    <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="mb-3 text-sm font-medium">Manage job order</p>

                        <div className="mb-3 grid gap-2">
                            <label className="text-xs text-muted-foreground">
                                Assign technician
                            </label>
                            <Select value={assignedTo} onValueChange={setAssignedTo}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    {technicians.map((tech) => (
                                        <SelectItem key={tech.id} value={String(tech.id)}>
                                            {tech.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-3 grid gap-2">
                            <label className="text-xs text-muted-foreground">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-4 grid gap-2">
                            <label className="text-xs text-muted-foreground">
                                Final remarks
                            </label>
                            <Select value={finalRemarks} onValueChange={setFinalRemarks}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Not set" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="outsource_repair">
                                        For Outsource Repair
                                    </SelectItem>
                                    <SelectItem value="replacement">For Replacement</SelectItem>
                                    <SelectItem value="disposal">For Disposal</SelectItem>
                                    <SelectItem value="task_completed">Task Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                disabled={processing}
                                onClick={handleSave}
                                className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                            >
                                Save changes
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
