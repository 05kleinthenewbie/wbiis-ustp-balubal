import { Head, Link } from '@inertiajs/react';
import { ClipboardList, ArrowUpRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

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
    jobOrders: JobOrderItem[] | { data: JobOrderItem[] };
};

const statusBadge: Record<string, string> = {
    open: 'border-slate-200 bg-slate-50 text-slate-600',
    in_progress: 'border-amber-200 bg-amber-50 text-amber-700',
    completed:
        'border-ustp-light-blue/30 bg-ustp-light-blue/10 text-ustp-light-blue',
    closed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export default function JobOrdersIndex({ jobOrders }: Props) {
    const [search, setSearch] = useState('');

    const jobOrderList = Array.isArray(jobOrders)
        ? jobOrders
        : (jobOrders.data ?? []);

    const filtered = jobOrderList.filter((jo) => {
        const q = search.toLowerCase();

        return (
            jo.service_request.user.name.toLowerCase().includes(q) ||
            jo.technician?.name?.toLowerCase().includes(q) ||
            jo.service_request.request_services.some((s) =>
                s.service_type.service_name.toLowerCase().includes(q),
            ) ||
            String(jo.id).includes(q)
        );
    });

    return (
        <>
            <Head title="Job Orders" />

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                            <span className="text-[11px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                                ICT Operations
                            </span>
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
                            Job Orders
                        </h1>

                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                            Track and assign ICT service tasks.
                        </p>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search job orders..."
                                className="h-10 border-slate-300 bg-white pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                            />
                        </div>

                        <div className="text-xs text-slate-400">
                            {filtered.length} job order
                            {filtered.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filtered.length === 0 ? (
                        <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-ustp-gold/10 text-ustp-gold">
                                <ClipboardList className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-slate-800">
                                {search
                                    ? 'No matching job orders'
                                    : 'No job orders yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
                                {search
                                    ? 'Try a different search term.'
                                    : 'Job orders will appear here when service requests are assigned.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-180 text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Job Order
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Requested by
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Technician
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Status
                                            </th>
                                            <th className="px-5 py-3.5" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((jobOrder) => (
                                            <tr
                                                key={jobOrder.id}
                                                className="group border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                                            <ClipboardList className="size-4" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="font-mono text-[10px] text-slate-400">
                                                                JO-
                                                                {String(
                                                                    jobOrder.id,
                                                                ).padStart(
                                                                    4,
                                                                    '0',
                                                                )}
                                                            </p>

                                                            <p className="mt-0.5 truncate font-medium text-slate-800">
                                                                {jobOrder.service_request.request_services
                                                                    .map(
                                                                        (s) =>
                                                                            s
                                                                                .service_type
                                                                                .service_name,
                                                                    )
                                                                    .join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {
                                                        jobOrder.service_request
                                                            .user.name
                                                    }
                                                </td>
                                                <td className="px-5 py-4 text-xs text-slate-400">
                                                    {jobOrder.technician
                                                        ?.name ?? 'Unassigned'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge[jobOrder.status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                                    >
                                                        {jobOrder.status.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/job-orders/${jobOrder.id}`}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-ustp-gold"
                                                    >
                                                        View
                                                        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
