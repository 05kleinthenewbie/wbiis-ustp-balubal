import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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

const statusStyles: Record<string, string> = {
    open: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
    in_progress: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    completed: 'border-ustp-light-blue/30 bg-ustp-light-blue/10 text-ustp-light-blue',
    closed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
};

export default function JobOrdersIndex({ jobOrders }: Props) {
    const [search, setSearch] = useState('');

    const jobOrderList = Array.isArray(jobOrders) ? jobOrders : jobOrders.data ?? [];

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

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-105 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                        <div className="absolute -bottom-40 left-1/4 size-90 rounded-full bg-ustp-gold/[0.015] blur-3xl" />
                    </div>

                    {/* Header */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                                ICT Operations
                            </span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                            Job Orders
                        </h1>

                        <p className="mt-1.5 max-w-xl text-sm text-gray-400">
                            Track and assign ICT service tasks.
                        </p>
                    </div>

                    {/* Toolbar */}
                    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search job orders..."
                                className="h-10 border-[#1a2035] bg-[#0c1222] pl-9 text-sm text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                            />
                        </div>

                        <div className="text-xs text-gray-500">
                            {filtered.length} job order{filtered.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filtered.length === 0 ? (
                        <div className="relative flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-[#1a2035] bg-[#0c1222]/50 px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#1a2035] bg-[#0f1723] text-ustp-light-blue">
                                <ClipboardList className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-gray-200">
                                {search ? 'No matching job orders' : 'No job orders yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-gray-500">
                                {search
                                    ? 'Try a different search term.'
                                    : 'Job orders will appear here when service requests are assigned.'}
                            </p>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-2xl shadow-black/20">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-180 text-sm">
                                    <thead>
                                        <tr className="border-b border-[#1a2035] bg-[#0a0f1c]/80">
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Job Order
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Requested by
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Technician
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-5 py-3.5" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((jobOrder) => (
                                            <tr
                                                key={jobOrder.id}
                                                className="group border-b border-[#151c2c] transition-colors last:border-0 hover:bg-[#111827]/70"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                                            <ClipboardList className="size-4" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="font-mono text-[10px] text-gray-500">
                                                                JO-{String(jobOrder.id).padStart(4, '0')}
                                                            </p>

                                                            <p className="mt-0.5 truncate font-medium text-gray-200">
                                                                {jobOrder.service_request.request_services
                                                                    .map((s) => s.service_type.service_name)
                                                                    .join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-300">
                                                    {jobOrder.service_request.user.name}
                                                </td>
                                                <td className="px-5 py-4 text-xs text-gray-400">
                                                    {jobOrder.technician?.name ?? 'Unassigned'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyles[jobOrder.status] ?? 'border-[#1a2035] bg-[#070b18] text-gray-400'}`}
                                                    >
                                                        {jobOrder.status.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/job-orders/${jobOrder.id}`}
                                                        className="text-xs font-medium text-gray-400 transition-colors hover:text-ustp-light-blue"
                                                    >
                                                        View
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
