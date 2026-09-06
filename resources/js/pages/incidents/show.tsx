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

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
    open: {
        label: 'Open',
        color: 'text-slate-300',
        bg: 'bg-slate-400/10',
        border: 'border-slate-400/30',
        icon: <AlertTriangle className="size-5" />,
    },
    under_review: {
        label: 'Under Review',
        color: 'text-amber-300',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/30',
        icon: <ShieldAlert className="size-5" />,
    },
    resolved: {
        label: 'Resolved',
        color: 'text-emerald-300',
        bg: 'bg-emerald-400/10',
        border: 'border-emerald-400/30',
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

                <div className="relative mx-auto max-w-4xl space-y-6">
                    <BackButton href="/incidents" />

                    {/* Header */}
                    <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10 md:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${statusConfig_.bg} ${statusConfig_.color}`}>
                                    {statusConfig_.icon}
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-white/40">
                                            INCIDENT #{incident.id}
                                        </span>

                                        <span className="size-1 rounded-full bg-white/20" />

                                        <span className="text-[10px] uppercase tracking-wider text-white/40">
                                            ICT Incident
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                                        {incident.incident_type}
                                    </h1>

                                    <p className="mt-1.5 text-xs text-white/40">
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
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                                <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 md:px-6">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <User className="size-4 text-ustp-gold" />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-white">
                                            Reporter information
                                        </h2>
                                        <p className="mt-0.5 text-[11px] text-white/40">
                                            Who reported this incident
                                        </p>
                                    </div>
                                </div>

                                <div className="grid divide-y divide-[#151c2c] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                    <div className="p-6">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
                                            Reported by
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-white">
                                            {incident.reporter.name}
                                        </p>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
                                            Equipment
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-white">
                                            {incident.inventory_item?.item_name ?? '—'}
                                        </p>
                                        {incident.inventory_item?.property_no && (
                                            <p className="mt-0.5 text-xs text-white/40">
                                                {incident.inventory_item.property_no}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10 md:p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <AlertTriangle className="size-4 text-ustp-gold" />
                                    </div>

                                    <p className="text-sm font-semibold text-white">
                                        Description
                                    </p>
                                </div>

                                <div className="rounded-xl border border-white/[0.08] bg-[#0c1222] p-4">
                                    <p className="whitespace-pre-wrap text-sm leading-6 text-white/70">
                                        {incident.incident_description}
                                    </p>
                                </div>
                            </div>

                            {/* Liability records */}
                            {incident.user_liabilities.length > 0 && (
                                <section className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                                    <div className="flex items-center gap-3 border-b border-white/[0.06] bg-ustp-gold/[0.04] px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                            <UserPlus className="size-4 text-ustp-gold" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                Liability records
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-white/40">
                                                {incident.user_liabilities.length} record{incident.user_liabilities.length !== 1 ? 's' : ''} assigned
                                            </p>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-[#151c2c]">
                                        {incident.user_liabilities.map((liability) => (
                                            <div
                                                key={liability.id}
                                                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {liability.user.name}
                                                    </p>
                                                    {liability.liability_description && (
                                                        <p className="mt-1 text-xs text-white/40">
                                                            {liability.liability_description}
                                                        </p>
                                                    )}
                                                </div>

                                                <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium capitalize text-amber-300">
                                                    {liability.liability_status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Admin review sidebar */}
                        {isAdmin && (
                            <div className="h-fit overflow-hidden rounded-2xl border border-ustp-gold/30 bg-[#0f1723] shadow-xl shadow-black/10">
                                <div className="flex items-center gap-3 border-b border-white/[0.06] bg-ustp-gold/[0.04] px-5 py-5">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <ShieldAlert className="size-4 text-ustp-gold" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            Review incident
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-white/40">
                                            Update status and assign liability
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 p-5">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-white/70">
                                            Status
                                        </Label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="h-10 w-full rounded-lg border border-[#1a2035] bg-[#0c1222] px-3 text-sm text-white/80 focus:ring-1 focus:ring-ustp-gold/30"
                                        >
                                            <option value="open">Open</option>
                                            <option value="under_review">Under Review</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-white/70">
                                            Assign liability (optional)
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="User ID responsible"
                                            value={liabilityUserId}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setLiabilityUserId(e.target.value)
                                            }
                                            className="h-10 border-[#1a2035] bg-[#0c1222] text-white placeholder:text-white/40 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-white/70">
                                            Notes
                                        </Label>
                                        <Textarea
                                            rows={2}
                                            value={liabilityDescription}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                setLiabilityDescription(e.target.value)
                                            }
                                            className="border-[#1a2035] bg-[#0c1222] text-white placeholder:text-white/40 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-white/[0.06] bg-[#0a0f1c] px-5 py-4">
                                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                        <Button
                                            variant="outline"
                                            disabled={processing}
                                            onClick={handleSave}
                                            className="border-white/[0.08] bg-transparent text-white/50 hover:border-ustp-gold/30 hover:bg-ustp-gold/10 hover:text-ustp-gold"
                                        >
                                            <XCircle className="size-4" />
                                            Reset
                                        </Button>

                                        <Button
                                            disabled={processing}
                                            onClick={handleSave}
                                            className="bg-ustp-gold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:bg-ustp-gold-dark hover:text-white"
                                        >
                                            <CheckCircle2 className="size-4" />
                                            Save changes
                                        </Button>
                                    </div>

                                    <p className="mt-3 text-[11px] leading-5 text-white/40">
                                        The reporter will see the updated incident
                                        status after your review.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Status summary when not admin */}
                        {!isAdmin && (
                            <div className="h-fit rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
                                    Incident status
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    <div className={`flex size-9 items-center justify-center rounded-lg ${statusConfig_.bg} ${statusConfig_.color}`}>
                                        {statusConfig_.icon}
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium capitalize text-white">
                                            {incident.status.replace('_', ' ')}
                                        </p>
                                        <p className="mt-0.5 text-xs text-white/40">
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