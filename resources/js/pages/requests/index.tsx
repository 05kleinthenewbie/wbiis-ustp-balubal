import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    ClipboardList,
    Plus,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
    requests: ServiceRequestItem[];
    isAdmin: boolean;
};

const statusStyles: Record<string, string> = {
    pending:
        'border-amber-400/30 bg-amber-400/10 text-amber-300',
    approved:
        'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    rejected:
        'border-red-400/25 bg-red-400/10 text-red-300',
    completed:
        'border-ustp-light-blue/25 bg-ustp-light-blue/10 text-ustp-light-blue',
};

const priorityStyles: Record<string, string> = {
    low: 'text-gray-400',
    medium: 'text-amber-300',
    high: 'text-orange-300',
    urgent: 'text-red-300',
};

export default function RequestsIndex({ requests, isAdmin }: Props) {
    const [search, setSearch] = useState('');

    const filteredRequests = requests.filter((request) => {
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

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-105 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                        <div className="absolute -bottom-40 left-1/4 size-90 rounded-full bg-ustp-gold/[0.015] blur-3xl" />
                    </div>

                    {/* Header */}
                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />

                                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                                    ICT Services
                                </span>
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                                Service Requests
                            </h1>

                            <p className="mt-1.5 max-w-xl text-sm text-gray-400">
                                Monitor and manage ICT service requests
                                submitted by the campus community.
                            </p>
                        </div>

                        {!isAdmin && (
                            <Button
                                asChild
                                className="h-10 bg-ustp-navy px-4 text-sm font-medium text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                            >
                                <Link href="/requests/create">
                                    <Plus className="size-4" />
                                    New Request
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Toolbar */}
                    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search requests..."
                                className="h-10 border-[#1a2035] bg-[#0c1222] pl-9 text-sm text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                            />
                        </div>

                        <div className="text-xs text-gray-500">
                            {filteredRequests.length} request
                            {filteredRequests.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filteredRequests.length === 0 ? (
                        <div className="relative flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-[#1a2035] bg-[#0c1222]/50 px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#1a2035] bg-[#0f1723] text-ustp-light-blue">
                                <ClipboardList className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-gray-200">
                                {search
                                    ? 'No matching requests'
                                    : 'No service requests yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-gray-500">
                                {search
                                    ? 'Try a different request number, service name, description, or user.'
                                    : 'Submitted ICT service requests will appear here once they are created.'}
                            </p>

                            {!isAdmin && !search && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-5 border-[#1a2035] bg-transparent text-gray-300 hover:bg-ustp-navy/10 hover:text-ustp-light-blue"
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
                        <div className="relative overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-2xl shadow-black/20">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-200 text-sm">
                                    <thead>
                                        <tr className="border-b border-[#1a2035] bg-[#0a0f1c]/80">
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Request
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Submitted by
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Date
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Priority
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
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
                                                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                                            <ClipboardList className="size-4" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-[10px] text-gray-500">
                                                                    #
                                                                    {request.id}
                                                                </span>
                                                            </div>

                                                            <p className="mt-0.5 truncate font-medium text-gray-200">
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

                                                            <p className="mt-1 max-w-85 truncate text-xs text-gray-500">
                                                                {
                                                                    request.problem_description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-gray-300">
                                                        {request.user.name}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(
                                                            request.date_requested,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`text-xs font-medium capitalize ${priorityStyles[request.priority_level ?? ''] ?? 'text-gray-500'}`}
                                                    >
                                                        {request.priority_level ??
                                                            'Not set'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyles[request.request_status] ?? 'border-[#1a2035] bg-[#070b18] text-gray-400'}`}
                                                    >
                                                        {request.request_status}
                                                    </Badge>
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/requests/${request.id}`}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-ustp-light-blue"
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
