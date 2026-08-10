import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    open: 'bg-slate-100 text-slate-700',
    under_review: 'bg-amber-100 text-amber-800',
    resolved: 'bg-green-100 text-green-800',
};

export default function IncidentsIndex({ incidents }: Props) {
    return (
        <>
            <Head title="Incident Reports" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Incident Reports</h1>
                        <p className="text-sm text-muted-foreground">
                            Report and track ICT-related incidents.
                        </p>
                    </div>
                    <Button asChild className="bg-ustp-navy text-white hover:bg-ustp-navy-dark">
                        <Link href="/incidents/create">
                            <Plus className="size-4" />
                            Report Incident
                        </Link>
                    </Button>
                </div>

                {incidents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
                        <AlertTriangle className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No incidents reported yet.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Incident</th>
                                    <th className="px-4 py-3 font-medium">Reported by</th>
                                    <th className="px-4 py-3 font-medium">Equipment</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {incidents.map((incident) => (
                                    <tr key={incident.id} className="border-b last:border-0">
                                        <td className="px-4 py-3 font-medium">
                                            {incident.incident_type}
                                            {incident.user_liabilities.length > 0 && (
                                                <Badge variant="outline" className="ml-2 bg-red-50 text-red-700">
                                                    Liability assigned
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {incident.reporter.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {incident.inventory_item?.item_name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={statusStyles[incident.status] ?? ''}
                                                variant="outline"
                                            >
                                                {incident.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/incidents/${incident.id}`}
                                                className="text-ustp-navy hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
