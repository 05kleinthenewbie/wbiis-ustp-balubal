import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, Plus, Search } from 'lucide-react';
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

const statusBadge: Record<string, string> = {
    open: 'border-slate-200 bg-slate-50 text-slate-600',
    under_review: 'border-amber-200 bg-amber-50 text-amber-700',
    resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
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

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                                    ICT Incidents
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
                                Incident Reports
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                                Report and track ICT-related incidents across
                                the campus.
                            </p>
                        </div>

                        <Button
                            asChild
                            className="h-10 bg-ustp-gold px-4 text-sm font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/10 transition-all hover:bg-ustp-gold-dark hover:text-white"
                        >
                            <Link href="/incidents/create">
                                <Plus className="size-4" />
                                Report Incident
                            </Link>
                        </Button>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search incidents..."
                                className="h-10 border-slate-300 bg-white pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                            />
                        </div>

                        <div className="text-xs text-slate-400">
                            {filtered.length} incident
                            {filtered.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filtered.length === 0 ? (
                        <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-ustp-gold/10 text-ustp-gold">
                                <AlertTriangle className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-slate-800">
                                {search
                                    ? 'No matching incidents'
                                    : 'No incidents reported yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
                                {search
                                    ? 'Try a different incident type, reporter, equipment, or ID.'
                                    : 'Reported ICT incidents will appear here once they are created.'}
                            </p>

                            {!search && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-5 border-ustp-gold/30 bg-transparent text-ustp-gold hover:bg-ustp-gold/10 hover:text-ustp-gold"
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
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-200 text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Incident
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Reported by
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Equipment
                                            </th>

                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Status
                                            </th>

                                            <th className="px-5 py-3.5" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((incident) => (
                                            <tr
                                                key={incident.id}
                                                className="group border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                                            <AlertTriangle className="size-4" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-[10px] text-slate-400">
                                                                    #
                                                                    {
                                                                        incident.id
                                                                    }
                                                                </span>
                                                            </div>

                                                            <p className="mt-0.5 truncate font-medium text-slate-800">
                                                                {
                                                                    incident.incident_type
                                                                }
                                                            </p>

                                                            {incident
                                                                .user_liabilities
                                                                .length > 0 && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="mt-1.5 border-red-200 bg-red-50 text-[10px] text-red-600"
                                                                >
                                                                    Liability
                                                                    assigned
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-slate-600">
                                                        {incident.reporter.name}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-slate-400">
                                                        {incident.inventory_item
                                                            ?.item_name ?? '—'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge[incident.status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                                    >
                                                        {incident.status.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/incidents/${incident.id}`}
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
