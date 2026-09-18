import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    User,
    UserPlus,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { BackButton } from '@/components/back-button';
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

const statusConfig: Record<
    string,
    {
        label: string;
        color: string;
        bg: string;
        border: string;
        icon: React.ReactNode;
    }
> = {
    open: {
        label: 'Open',
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        icon: <AlertTriangle className="size-5" />,
    },
    under_review: {
        label: 'Under Review',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <ShieldAlert className="size-5" />,
    },
    resolved: {
        label: 'Resolved',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: <CheckCircle2 className="size-5" />,
    },
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

    const statusConfig_ = statusConfig[incident.status] || statusConfig.open;

    return (
        <>
            <Head title={`Incident #${incident.id}`} />

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-4xl space-y-6">
                    <BackButton href="/incidents" />

                    {/* Header */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                                <div
                                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${statusConfig_.bg} ${statusConfig_.color}`}
                                >
                                    {statusConfig_.icon}
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-slate-400">
                                            INCIDENT #{incident.id}
                                        </span>

                                        <span className="size-1 rounded-full bg-slate-300" />

                                        <span className="text-[10px] tracking-wider text-slate-400 uppercase">
                                            ICT Incident
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-semibold tracking-tight text-slate-800 md:text-2xl">
                                        {incident.incident_type}
                                    </h1>

                                    <p className="mt-1.5 text-xs text-slate-400">
                                        Reported by {incident.reporter.name}
                                    </p>
                                </div>
                            </div>

                            <Badge
                                variant="outline"
                                className={`w-fit rounded-lg px-3 py-1 text-[10px] font-medium capitalize ${statusConfig_.border} ${statusConfig_.bg} ${statusConfig_.color}`}
                            >
                                {statusConfig_.label}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                        {/* Main */}
                        <div className="space-y-5">
                            {/* Reporter card */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <User className="size-4 text-ustp-gold" />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-800">
                                            Reporter information
                                        </h2>
                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            Who reported this incident
                                        </p>
                                    </div>
                                </div>

                                <div className="grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                    <div className="p-6">
                                        <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                            Reported by
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-slate-800">
                                            {incident.reporter.name}
                                        </p>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                            Equipment
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-slate-800">
                                            {incident.inventory_item
                                                ?.item_name ?? '—'}
                                        </p>
                                        {incident.inventory_item
                                            ?.property_no && (
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {
                                                    incident.inventory_item
                                                        .property_no
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <AlertTriangle className="size-4 text-ustp-gold" />
                                    </div>

                                    <p className="text-sm font-semibold text-slate-800">
                                        Description
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm leading-6 whitespace-pre-wrap text-slate-600">
                                        {incident.incident_description}
                                    </p>
                                </div>
                            </div>

                            {/* Liability records */}
                            {incident.user_liabilities.length > 0 && (
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-slate-200 bg-ustp-gold/[0.04] px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                            <UserPlus className="size-4 text-ustp-gold" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Liability records
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                {
                                                    incident.user_liabilities
                                                        .length
                                                }{' '}
                                                record
                                                {incident.user_liabilities
                                                    .length !== 1
                                                    ? 's'
                                                    : ''}{' '}
                                                assigned
                                            </p>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-slate-200">
                                        {incident.user_liabilities.map(
                                            (liability) => (
                                                <div
                                                    key={liability.id}
                                                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">
                                                            {
                                                                liability.user
                                                                    .name
                                                            }
                                                        </p>
                                                        {liability.liability_description && (
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                {
                                                                    liability.liability_description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 capitalize">
                                                        {
                                                            liability.liability_status
                                                        }
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Admin review sidebar */}
                        {isAdmin && (
                            <div className="h-fit overflow-hidden rounded-2xl border border-ustp-gold/30 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-200 bg-ustp-gold/[0.04] px-5 py-5">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <ShieldAlert className="size-4 text-ustp-gold" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Review incident
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            Update status and assign liability
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 p-5">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-slate-600">
                                            Status
                                        </Label>
                                        <select
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(e.target.value)
                                            }
                                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:ring-1 focus:ring-ustp-gold/30"
                                        >
                                            <option value="open">Open</option>
                                            <option value="under_review">
                                                Under Review
                                            </option>
                                            <option value="resolved">
                                                Resolved
                                            </option>
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-slate-600">
                                            Assign liability (optional)
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="User ID responsible"
                                            value={liabilityUserId}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setLiabilityUserId(
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-slate-600">
                                            Notes
                                        </Label>
                                        <Textarea
                                            rows={2}
                                            value={liabilityDescription}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>,
                                            ) =>
                                                setLiabilityDescription(
                                                    e.target.value,
                                                )
                                            }
                                            className="border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
                                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                        <Button
                                            variant="outline"
                                            disabled={processing}
                                            onClick={handleSave}
                                            className="border-slate-200 bg-transparent text-slate-500 hover:border-ustp-gold/30 hover:bg-ustp-gold/10 hover:text-ustp-gold"
                                        >
                                            <XCircle className="size-4" />
                                            Reset
                                        </Button>

                                        <Button
                                            disabled={processing}
                                            onClick={handleSave}
                                            className="bg-ustp-gold text-ustp-navy shadow-lg shadow-ustp-gold/10 transition-all hover:bg-ustp-gold-dark hover:text-white"
                                        >
                                            <CheckCircle2 className="size-4" />
                                            Save changes
                                        </Button>
                                    </div>

                                    <p className="mt-3 text-[11px] leading-5 text-slate-400">
                                        The reporter will see the updated
                                        incident status after your review.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Status summary when not admin */}
                        {!isAdmin && (
                            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                    Incident status
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    <div
                                        className={`flex size-9 items-center justify-center rounded-lg ${statusConfig_.bg} ${statusConfig_.color}`}
                                    >
                                        {statusConfig_.icon}
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-800 capitalize">
                                            {incident.status.replace('_', ' ')}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            Reported by {incident.reporter.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
