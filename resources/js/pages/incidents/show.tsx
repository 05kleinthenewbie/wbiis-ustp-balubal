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

const statusStyles: Record<string, string> = {
    open: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
    under_review: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    resolved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
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

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative mx-auto flex max-w-4xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-100 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/incidents" />
                    </div>

                    {/* Header */}
                    <div className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-2xl shadow-black/20 md:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#1a2035] bg-[#070b18] text-ustp-light-blue">
                                    <AlertTriangle className="size-5" />
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-gray-500">
                                            INCIDENT #{incident.id}
                                        </span>

                                        <span className="size-1 rounded-full bg-gray-600" />

                                        <span className="text-[10px] uppercase tracking-wider text-gray-500">
                                            ICT Incident
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-semibold tracking-tight text-gray-50 md:text-2xl">
                                        {incident.incident_type}
                                    </h1>

                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Reported by {incident.reporter.name}
                                    </p>
                                </div>
                            </div>

                            <Badge
                                variant="outline"
                                className={`w-fit rounded-md px-3 py-1 text-[10px] font-medium capitalize ${statusStyles[incident.status] ?? 'border-[#1a2035] bg-[#070b18] text-gray-400'}`}
                            >
                                {incident.status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                        {/* Main */}
                        <div className="space-y-5">
                            {/* Reporter card */}
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723]">
                                <div className="border-b border-[#1a2035] px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                            <User className="size-4" />
                                        </div>

                                        <div>
                                            <h2 className="text-sm font-semibold text-gray-200">
                                                Reporter information
                                            </h2>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Who reported this incident
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid divide-y divide-[#151c2c] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                    <div className="p-6">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                            Reported by
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-gray-200">
                                            {incident.reporter.name}
                                        </p>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                            Equipment
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-gray-200">
                                            {incident.inventory_item?.item_name ?? '—'}
                                        </p>
                                        {incident.inventory_item?.property_no && (
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {incident.inventory_item.property_no}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-6">
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                    Description
                                </p>

                                <div className="mt-3 rounded-xl border border-[#1a2035] bg-[#070b18] p-4">
                                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                                        {incident.incident_description}
                                    </p>
                                </div>
                            </div>

                            {/* Liability records */}
                            {incident.user_liabilities.length > 0 && (
                                <section className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723]">
                                    <div className="border-b border-[#1a2035] px-5 py-4 md:px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                                <UserPlus className="size-4" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-gray-200">
                                                    Liability records
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    {incident.user_liabilities.length} record{incident.user_liabilities.length !== 1 ? 's' : ''} assigned
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-[#151c2c]">
                                        {incident.user_liabilities.map((liability) => (
                                            <div
                                                key={liability.id}
                                                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-200">
                                                        {liability.user.name}
                                                    </p>
                                                    {liability.liability_description && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {liability.liability_description}
                                                        </p>
                                                    )}
                                                </div>

                                                <Badge
                                                    variant="outline"
                                                    className="w-fit rounded-md border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-medium capitalize text-amber-300"
                                                >
                                                    {liability.liability_status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Admin review sidebar */}
                        {isAdmin && (
                            <div className="h-fit overflow-hidden rounded-2xl border border-ustp-navy/20 bg-[#0f1723]">
                                <div className="border-b border-[#1a2035] bg-ustp-navy/[0.04] px-5 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                            <ShieldAlert className="size-4" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-gray-200">
                                                Review incident
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Update status and assign liability
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 p-5">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-gray-300">
                                            Status
                                        </Label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="h-10 rounded-lg border border-[#1a2035] bg-[#070b18] px-3 text-sm text-gray-300 focus:ring-1 focus:ring-ustp-navy/30"
                                        >
                                            <option value="open">Open</option>
                                            <option value="under_review">Under Review</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-gray-300">
                                            Assign liability (optional)
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="User ID responsible"
                                            value={liabilityUserId}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setLiabilityUserId(e.target.value)
                                            }
                                            className="h-10 border-[#1a2035] bg-[#070b18] text-gray-300 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-gray-300">
                                            Notes
                                        </Label>
                                        <Textarea
                                            rows={2}
                                            value={liabilityDescription}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                setLiabilityDescription(e.target.value)
                                            }
                                            className="border-[#1a2035] bg-[#070b18] text-gray-300 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-[#1a2035] bg-[#0a0f1c] px-5 py-4">
                                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                        <Button
                                            variant="outline"
                                            disabled={processing}
                                            onClick={handleSave}
                                            className="border-[#252d44] bg-transparent text-gray-400 hover:border-gray-500 hover:bg-[#111827]"
                                        >
                                            <XCircle className="size-4" />
                                            Cancel
                                        </Button>

                                        <Button
                                            disabled={processing}
                                            onClick={handleSave}
                                            className="bg-ustp-navy text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                                        >
                                            <CheckCircle2 className="size-4" />
                                            Save changes
                                        </Button>
                                    </div>

                                    <p className="mt-3 text-[11px] leading-5 text-gray-500">
                                        The reporter will see the updated incident
                                        status after your review.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Status summary when not admin */}
                        {!isAdmin && (
                            <div className="h-fit rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                    Incident status
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    {incident.status === 'resolved' ? (
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10">
                                            <CheckCircle2 className="size-4 text-emerald-300" />
                                        </div>
                                    ) : incident.status === 'under_review' ? (
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10">
                                            <AlertTriangle className="size-4 text-amber-300" />
                                        </div>
                                    ) : (
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-slate-400/20 bg-slate-400/10">
                                            <AlertTriangle className="size-4 text-slate-300" />
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-medium capitalize text-gray-200">
                                            {incident.status.replace('_', ' ')}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500">
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
