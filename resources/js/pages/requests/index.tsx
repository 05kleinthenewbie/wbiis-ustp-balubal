import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, ClipboardList, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

type ServiceRequestItem = {
    id: number;
    problem_description: string;
    priority_level: string | null;
    request_status: string;
    date_requested: string;
    user: { name: string };
    request_services: RequestService[];
};

type Props = {
    requests: ServiceRequestItem[] | { data: ServiceRequestItem[] };
    isAdmin: boolean;
};

const statusBadge: Record<string, string> = {
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    approved: 'border-sky-200 bg-sky-50 text-sky-700',
    rejected: 'border-red-200 bg-red-50 text-red-600',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const priorityBadge: Record<string, string> = {
    low: 'border-slate-200 bg-slate-50 text-slate-600',
    medium: 'border-blue-200 bg-blue-50 text-blue-700',
    high: 'border-orange-200 bg-orange-50 text-orange-600',
    urgent: 'border-red-200 bg-red-50 text-red-600',
};

export default function RequestsIndex({ requests, isAdmin }: Props) {
    const [search, setSearch] = useState('');

    const requestList = Array.isArray(requests)
        ? requests
        : (requests.data ?? []);

    const filteredRequests = requestList.filter((request) => {
        const query = search.toLowerCase();

        return (
            request.problem_description.toLowerCase().includes(query) ||
            request.user.name.toLowerCase().includes(query) ||
            request.request_services.some((service) =>
                service.service_type.service_name.toLowerCase().includes(query),
            ) ||
            String(request.id).includes(query)
        );
    });

    return (
        <>
            <Head title="Service Requests" />

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                                    ICT Services
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
                                Service Requests
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                                Monitor and manage ICT service requests
                                submitted by the campus community.
                            </p>
                        </div>

                        {!isAdmin && (
                            <Button
                                asChild
                                className="h-10 bg-ustp-gold px-4 text-sm font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/10 transition-all hover:bg-ustp-gold-dark hover:text-white"
                            >
                                <Link href="/requests/create">
                                    <Plus className="size-4" />
                                    New Request
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search requests..."
                                className="h-10 border-slate-300 bg-white pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                            />
                        </div>

                        <div className="text-xs text-slate-400">
                            {filteredRequests.length} request
                            {filteredRequests.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filteredRequests.length === 0 ? (
                        <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-ustp-gold/10 text-ustp-gold">
                                <ClipboardList className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-slate-800">
                                {search
                                    ? 'No matching requests'
                                    : 'No service requests yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
                                {search
                                    ? 'Try a different request number, service name, description, or user.'
                                    : 'Submitted ICT service requests will appear here once they are created.'}
                            </p>

                            {!isAdmin && !search && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-5 border-ustp-gold/30 bg-transparent text-ustp-gold hover:bg-ustp-gold/10 hover:text-ustp-gold"
                                >
                                    <Link href="/requests/create">
                                        <Plus className="size-4" />
                                        Create your first request
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        /* Table */
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-200 text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Request
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Submitted by
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Date
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Priority
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Status
                                            </th>

                                            <th className="px-5 py-3.5" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredRequests.map((request) => (
                                            <tr
                                                key={request.id}
                                                className="group border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                                            <ClipboardList className="size-4" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-[10px] text-slate-400">
                                                                    #
                                                                    {request.id}
                                                                </span>
                                                            </div>

                                                            <p className="mt-0.5 truncate font-medium text-slate-800">
                                                                {request.request_services
                                                                    .map(
                                                                        (s) =>
                                                                            s
                                                                                .service_type
                                                                                .service_name,
                                                                    )
                                                                    .join(
                                                                        ', ',
                                                                    ) ||
                                                                    'Service request'}
                                                            </p>

                                                            <p className="mt-1 max-w-85 truncate text-xs text-slate-400">
                                                                {
                                                                    request.problem_description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-slate-600">
                                                        {request.user.name}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(
                                                            request.date_requested,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${priorityBadge[request.priority_level ?? ''] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                                    >
                                                        {request.priority_level ??
                                                            'Not set'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge[request.request_status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                                    >
                                                        {request.request_status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/requests/${request.id}`}
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
