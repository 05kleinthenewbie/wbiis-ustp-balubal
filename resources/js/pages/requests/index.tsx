import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    ClipboardList,
    Plus,
    Search,
} from 'lucide-react';
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
    pending: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    approved:
        'border-ustp-light-blue/30 bg-ustp-light-blue/10 text-ustp-light-blue',
    rejected: 'border-red-400/30 bg-red-400/10 text-red-300',
    completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
};

const priorityBadge: Record<string, string> = {
    low: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
    medium: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
    high: 'border-orange-400/30 bg-orange-400/10 text-orange-300',
    urgent: 'border-red-400/30 bg-red-400/10 text-red-300',
};

export default function RequestsIndex({ requests, isAdmin }: Props) {
    const [search, setSearch] = useState('');

    const requestList = Array.isArray(requests) ? requests : requests.data ?? [];

    const filteredRequests = requestList.filter((request) => {
        const query = search.toLowerCase();

        return (
            request.problem_description.toLowerCase().includes(query) ||
            request.user.name.toLowerCase().includes(query) ||
            request.request_services.some((service) =>
                service.service_type.service_name
                    .toLowerCase()
                    .includes(query),
            ) ||
            String(request.id).includes(query)
        );
    });

    return (
        <>
            <Head title="Service Requests" />

            <div className="relative min-h-full flex-1 overflow-hidden bg-[#070b18] px-4 py-6 text-white sm:px-6 lg:px-8">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-ustp-gold/[0.015] blur-3xl" />

                {/* Subtle dot pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, #fcb315 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                <div className="relative mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                                    ICT Services
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-white">
                                Service Requests
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50">
                                Monitor and manage ICT service requests
                                submitted by the campus community.
                            </p>
                        </div>

                        {!isAdmin && (
                            <Button
                                asChild
                                className="h-10 bg-ustp-gold px-4 text-sm font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:bg-ustp-gold-dark hover:text-white"
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
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search requests..."
                                className="h-10 border-white/[0.08] bg-white/[0.03] pl-9 text-sm text-white placeholder:text-white/40 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                            />
                        </div>

                        <div className="text-xs text-white/40">
                            {filteredRequests.length} request
                            {filteredRequests.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filteredRequests.length === 0 ? (
                        <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-ustp-gold/10 text-ustp-gold">
                                <ClipboardList className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-white">
                                {search
                                    ? 'No matching requests'
                                    : 'No service requests yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-white/40">
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
                        <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-200 text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.06] bg-[#0a0f1c]/80">
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Request
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Submitted by
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Date
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Priority
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Status
                                            </th>

                                            <th className="px-5 py-3.5" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredRequests.map((request) => (
                                            <tr
                                                key={request.id}
                                                className="group border-b border-[#151c2c] transition-colors last:border-0 hover:bg-[#111827]/70"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                                            <ClipboardList className="size-4" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-[10px] text-white/40">
                                                                    #
                                                                    {request.id}
                                                                </span>
                                                            </div>

                                                            <p className="mt-0.5 truncate font-medium text-white/90">
                                                                {request
                                                                    .request_services
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

                                                            <p className="mt-1 max-w-85 truncate text-xs text-white/40">
                                                                {
                                                                    request.problem_description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-white/70">
                                                        {request.user.name}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-white/40">
                                                        {new Date(
                                                            request.date_requested,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${priorityBadge[request.priority_level ?? ''] ?? 'border-white/20 bg-white/5 text-white/60'}`}
                                                    >
                                                        {request.priority_level ??
                                                            'Not set'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge[request.request_status] ?? 'border-white/20 bg-white/5 text-white/60'}`}
                                                    >
                                                        {request.request_status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/requests/${request.id}`}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-ustp-gold"
                                                    >
                                                        View
                                                        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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