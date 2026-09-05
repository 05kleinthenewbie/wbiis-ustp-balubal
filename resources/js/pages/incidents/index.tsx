import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type IncidentItem = {
    id: number;
    incident_type: string;
    incident_date: string | null;
    status: string;
    reporter: { name: string };
    inventory_item: { item_name: string } | null;
    user_liabilities: { id: number }[];
};

type Props = {
    incidents: IncidentItem[];
    isAdmin: boolean;
};

const statusStyles: Record<string, string> = {
    open: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
    under_review: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    resolved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
};

export default function IncidentsIndex({ incidents }: Props) {
    const [search, setSearch] = useState('');

    const filtered = incidents.filter((incident) => {
        const q = search.toLowerCase();

        return (
            incident.incident_type.toLowerCase().includes(q) ||
            incident.reporter.name.toLowerCase().includes(q) ||
            incident.inventory_item?.item_name?.toLowerCase().includes(q) ||
            String(incident.id).includes(q)
        );
    });

    return (
        <>
            <Head title="Incident Reports" />

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
                                    ICT Incidents
                                </span>
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                                Incident Reports
                            </h1>

                            <p className="mt-1.5 max-w-xl text-sm text-gray-400">
                                Report and track ICT-related incidents across
                                the campus.
                            </p>
                        </div>

                        <Button
                            asChild
                            className="h-10 bg-ustp-navy px-4 text-sm font-medium text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                        >
                            <Link href="/incidents/create">
                                <Plus className="size-4" />
                                Report Incident
                            </Link>
                        </Button>
                    </div>

                    {/* Toolbar */}
                    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search incidents..."
                                className="h-10 border-[#1a2035] bg-[#0c1222] pl-9 text-sm text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                            />
                        </div>

                        <div className="text-xs text-gray-500">
                            {filtered.length} incident{filtered.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filtered.length === 0 ? (
                        <div className="relative flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-[#1a2035] bg-[#0c1222]/50 px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#1a2035] bg-[#0f1723] text-ustp-light-blue">
                                <AlertTriangle className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-gray-200">
                                {search ? 'No matching incidents' : 'No incidents reported yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-gray-500">
                                {search
                                    ? 'Try a different incident type, reporter, equipment, or ID.'
                                    : 'Reported ICT incidents will appear here once they are created.'}
                            </p>

                            {!search && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-5 border-[#1a2035] bg-transparent text-gray-300 hover:bg-ustp-navy/10 hover:text-ustp-light-blue"
                                >
                                    <Link href="/incidents/create">
                                        <Plus className="size-4" />
                                        Report your first incident
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
                                                Incident
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Reported by
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Equipment
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                Status
                                            </th>

                                            <th className="px-5 py-3.5" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((incident) => (
                                            <tr
                                                key={incident.id}
                                                className="group border-b border-[#151c2c] transition-colors last:border-0 hover:bg-[#111827]/70"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                                            <AlertTriangle className="size-4" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-[10px] text-gray-500">
                                                                    #{incident.id}
                                                                </span>
                                                            </div>

                                                            <p className="mt-0.5 truncate font-medium text-gray-200">
                                                                {incident.incident_type}
                                                            </p>

                                                            {incident.user_liabilities.length > 0 && (
                                                                <Badge variant="outline" className="mt-1 border-red-400/30 bg-red-400/10 text-[10px] text-red-300">
                                                                    Liability assigned
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-gray-300">
                                                        {incident.reporter.name}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-gray-400">
                                                        {incident.inventory_item?.item_name ?? '—'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyles[incident.status] ?? 'border-[#1a2035] bg-[#070b18] text-gray-400'}`}
                                                    >
                                                        {incident.status.replace('_', ' ')}
                                                    </Badge>
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/incidents/${incident.id}`}
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
