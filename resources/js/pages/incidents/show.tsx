import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Liability = {
    id: number;
    liability_description: string | null;
    liability_status: string;
    user: { name: string };
};

type IncidentDetail = {
    id: number;
    incident_type: string;
    incident_description: string;
    incident_date: string | null;
    status: string;
    reporter: { name: string };
    inventory_item: { item_name: string; property_no: string } | null;
    user_liabilities: Liability[];
};

type Props = {
    incident: IncidentDetail;
    isAdmin: boolean;
};

const statusStyles: Record<string, string> = {
    open: 'bg-slate-100 text-slate-700',
    under_review: 'bg-amber-100 text-amber-800',
    resolved: 'bg-green-100 text-green-800',
};

export default function IncidentsShow({ incident, isAdmin }: Props) {
    const [status, setStatus] = useState(incident.status);
    const [liabilityUserId, setLiabilityUserId] = useState('');
    const [liabilityDescription, setLiabilityDescription] = useState('');
    const [processing, setProcessing] = useState(false);

    function handleSave() {
        setProcessing(true);
        router.put(
            `/incidents/${incident.id}`,
            {
                status,
                liability_user_id: liabilityUserId || null,
                liability_description: liabilityDescription || null,
            },
            { onFinish: () => setProcessing(false) },
        );
    }

    return (
        <>
            <Head title={`Incident #${incident.id}`} />

            <div className="mx-auto flex max-w-lg flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Incident #{incident.id}</p>
                        <h1 className="text-xl font-semibold">{incident.incident_type}</h1>
                    </div>
                    <Badge className={statusStyles[incident.status] ?? ''} variant="outline">
                        {incident.status.replace('_', ' ')}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground">Reported by</p>
                        <p>{incident.reporter.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Equipment</p>
                        <p>{incident.inventory_item?.item_name ?? '—'}</p>
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="mb-2 text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">
                        {incident.incident_description}
                    </p>
                </div>

                {incident.user_liabilities.length > 0 && (
                    <div className="rounded-xl border p-4">
                        <p className="mb-2 text-sm font-medium">Liability records</p>
                        <div className="flex flex-col gap-2">
                            {incident.user_liabilities.map((liability) => (
                                <div key={liability.id} className="rounded-lg bg-muted/50 p-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{liability.user.name}</span>
                                        <Badge variant="outline">{liability.liability_status}</Badge>
                                    </div>
                                    {liability.liability_description && (
                                        <p className="mt-1 text-muted-foreground">
                                            {liability.liability_description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isAdmin && (
                    <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="mb-3 text-sm font-medium">Review incident</p>

                        <div className="mb-4 grid gap-2">
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="rounded-md border px-3 py-2 text-sm"
                            >
                                <option value="open">Open</option>
                                <option value="under_review">Under Review</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>

                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                            Assign liability (optional)
                        </p>
                        <div className="mb-3 grid gap-2">
                            <Label className="text-xs">User ID</Label>
                            <Input
                                type="number"
                                placeholder="User ID responsible"
                                value={liabilityUserId}
                                onChange={(e) => setLiabilityUserId(e.target.value)}
                            />
                        </div>

                        <div className="mb-4 grid gap-2">
                            <Label className="text-xs">Notes</Label>
                            <Textarea
                                rows={2}
                                value={liabilityDescription}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setLiabilityDescription(e.target.value)
                                }
                            />
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
