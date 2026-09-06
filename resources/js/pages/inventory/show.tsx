import { Head, Link, router } from '@inertiajs/react';
import {
    Box,
    Calendar,
    AlertTriangle,
    MapPin,
    Monitor,
    Laptop,
    Printer,
    Projector,
    Wifi,
    Battery,
    Hash,
    Clock,
    FileText,
    ArrowUpRight,
    Trash2,
    Shield,
} from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';

type DefectiveRecord = {
    id: number;
    damage_description: string;
    repair_status: string;
    date_reported: string | null;
    job_order?: { id: number } | null;
};

type IncidentRecord = {
    id: number;
    incident_type: string;
    incident_description: string;
    incident_date: string | null;
    status: string;
    reporter?: { name: string } | null;
};

type InventoryItemData = {
    id: number;
    property_no: string;
    item_name: string;
    brand: string | null;
    model: string | null;
    serial_no: string | null;
    location: string | null;
    condition: string;
    status: string;
    purchase_date: string | null;
    defective_records?: DefectiveRecord[];
    incident_reports?: IncidentRecord[];
};

type Props = {
    item: InventoryItemData;
};

function getCategoryFromName(name: string): string {
    const lower = name.toLowerCase();

    if (lower.startsWith('desktop')) {
        return 'Desktop';
    }

    if (lower.startsWith('laptop')) {
        return 'Laptop';
    }

    if (lower.startsWith('monitor')) {
        return 'Monitor';
    }

    if (lower.startsWith('printer')) {
        return 'Printer';
    }

    if (lower.startsWith('projector')) {
        return 'Projector';
    }

    if (lower.startsWith('network')) {
        return 'Network';
    }

    if (lower.startsWith('ups')) {
        return 'UPS';
    }

    return 'Other';
}

const categoryIcons: Record<string, React.ElementType> = {
    Desktop: Monitor,
    Laptop: Laptop,
    Monitor: Monitor,
    Printer: Printer,
    Projector: Projector,
    Network: Wifi,
    UPS: Battery,
    Other: Box,
};

const categoryColors: Record<string, string> = {
    Desktop: 'bg-ustp-gold/15 text-ustp-gold border-ustp-gold/20',
    Laptop: 'bg-purple-400/15 text-purple-400 border-purple-400/20',
    Monitor: 'bg-ustp-gold/15 text-ustp-gold border-ustp-gold/20',
    Printer: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/20',
    Projector: 'bg-orange-400/15 text-orange-400 border-orange-400/20',
    Network: 'bg-cyan-400/15 text-cyan-400 border-cyan-400/20',
    UPS: 'bg-amber-400/15 text-amber-400 border-amber-400/20',
    Other: 'bg-white/5 text-white/40 border-white/10',
};

const conditionConfig: Record<string, { badge: string; dot: string; label: string }> = {
    working: {
        badge: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
        dot: 'bg-emerald-400',
        label: 'Working',
    },
    defective: {
        badge: 'border-red-400/30 bg-red-400/10 text-red-300',
        dot: 'bg-red-400',
        label: 'Defective',
    },
    under_repair: {
        badge: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
        dot: 'bg-amber-400',
        label: 'Under Repair',
    },
};

const statusConfig: Record<string, string> = {
    active: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    retired: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
    disposed: 'border-red-400/30 bg-red-400/10 text-red-300',
};

const repairStatusConfig: Record<string, string> = {
    pending: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    in_progress: 'border-ustp-light-blue/30 bg-ustp-light-blue/10 text-ustp-light-blue',
    completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
};

const incidentStatusConfig: Record<string, string> = {
    open: 'border-red-400/30 bg-red-400/10 text-red-300',
    under_review: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    resolved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
};

function formatAge(purchaseDate: string | null): string {
    if (!purchaseDate) {
        return '—';
    }

    const purchase = new Date(purchaseDate);
    const now = new Date();
    const diffMs = now.getTime() - purchase.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days < 0) {
        return 'Future date';
    }

    if (days < 30) {
        return `${days}d old`;
    }

    if (days < 365) {
        return `${Math.floor(days / 30)}mo old`;
    }

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);

    return months > 0 ? `${years}y ${months}mo old` : `${years}y old`;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) {
        return '—';
    }

    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function InventoryShow({ item }: Props) {
    const category = getCategoryFromName(item.item_name);
    const CatIcon = categoryIcons[category] ?? Box;
    const catColor = categoryColors[category] ?? 'bg-white/5 text-white/40 border-white/10';
    const cc = conditionConfig[item.condition] ?? conditionConfig.working;

    const defectiveRecords = item.defective_records ?? [];
    const incidentReports = item.incident_reports ?? [];

    function handleDelete() {
        if (confirm('Delete this inventory item? This cannot be undone.')) {
            router.delete(`/inventory/${item.id}`);
        }
    }

    return (
        <>
            <Head title={`Inventory — ${item.item_name}`} />

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

                <div className="relative mx-auto max-w-5xl space-y-6">
                    <BackButton href="/inventory" />

                    {/* Item header */}
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border ${catColor}`}>
                                <CatIcon className="size-7" />
                            </div>

                            <div>
                                <div className="mb-2.5 flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                                        Inventory Record
                                    </span>
                                </div>

                                <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                                    {item.item_name}
                                </h1>

                                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cc.badge}`}>
                                        <span className={`size-1.5 rounded-full ${cc.dot}`} />
                                        {cc.label}
                                    </span>

                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusConfig[item.status] ?? 'border-white/20 bg-white/5 text-white/60'}`}>
                                        {item.status}
                                    </span>

                                    <span className="font-mono text-xs text-white/40">
                                        {item.property_no}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                asChild
                                className="h-9 bg-ustp-gold px-4 text-sm font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:bg-ustp-gold-dark hover:text-white"
                            >
                                <Link href={`/inventory/${item.id}/edit`}>
                                    Edit
                                </Link>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-9 text-white/40 hover:bg-red-400/10 hover:text-red-400"
                                onClick={handleDelete}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Detail cards */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main info */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Identification */}
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                                <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 md:px-6">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <Hash className="size-4 text-ustp-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">Identification</h3>
                                        <p className="text-[11px] text-white/40">Core equipment identifiers</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-6">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Property No.</p>
                                        <p className="mt-1 font-mono text-sm text-white">{item.property_no}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Item Name</p>
                                        <p className="mt-1 text-sm text-white">{item.item_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Serial No.</p>
                                        <p className="mt-1 font-mono text-sm text-white">{item.serial_no ?? '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Category</p>
                                        <p className="mt-1 text-sm text-white">{category}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product & Location */}
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                                <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 md:px-6">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <MapPin className="size-4 text-ustp-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">Details</h3>
                                        <p className="text-[11px] text-white/40">Brand, model, and location</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-6">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Brand</p>
                                        <p className="mt-1 text-sm text-white">{item.brand ?? '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Model</p>
                                        <p className="mt-1 text-sm text-white">{item.model ?? '—'}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Location</p>
                                        <div className="mt-1 flex items-center gap-2 text-sm text-white">
                                            <MapPin className="size-3.5 text-white/40" />
                                            {item.location ?? '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Defective Records */}
                            {defectiveRecords.length > 0 && (
                                <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                                    <div className="flex items-center gap-3 border-b border-white/[0.06] bg-red-400/[0.03] px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-red-400/10">
                                            <AlertTriangle className="size-4 text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">Defect Records</h3>
                                            <p className="text-[11px] text-white/40">
                                                {defectiveRecords.length} record{defectiveRecords.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-[#151c2c]">
                                        {defectiveRecords.map((record) => (
                                            <div key={record.id} className="px-5 py-4 md:px-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-white/90">
                                                            {record.damage_description}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="size-3" />
                                                                {formatDate(record.date_reported)}
                                                            </span>
                                                            {record.job_order && (
                                                                <Link
                                                                    href={`/job-orders/${record.job_order.id}`}
                                                                    className="flex items-center gap-1 text-ustp-gold/80 transition-colors hover:text-ustp-gold"
                                                                >
                                                                    <FileText className="size-3" />
                                                                    JO-000{record.job_order.id}
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${repairStatusConfig[record.repair_status] ?? 'border-white/20 bg-white/5 text-white/60'}`}>
                                                        {record.repair_status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Incident Reports */}
                            {incidentReports.length > 0 && (
                                <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                                    <div className="flex items-center gap-3 border-b border-white/[0.06] bg-amber-400/[0.03] px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-amber-400/10">
                                            <Shield className="size-4 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">Incident Reports</h3>
                                            <p className="text-[11px] text-white/40">
                                                {incidentReports.length} report{incidentReports.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-[#151c2c]">
                                        {incidentReports.map((report) => (
                                            <div key={report.id} className="px-5 py-4 md:px-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium text-white">
                                                                {report.incident_type}
                                                            </p>
                                                        </div>
                                                        <p className="mt-1 text-xs text-white/40 line-clamp-2">
                                                            {report.incident_description}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="size-3" />
                                                                {formatDate(report.incident_date)}
                                                            </span>
                                                            {report.reporter && (
                                                                <span>by {report.reporter.name}</span>
                                                            )}
                                                            <Link
                                                                href={`/incidents/${report.id}`}
                                                                className="flex items-center gap-1 text-ustp-gold/80 transition-colors hover:text-ustp-gold"
                                                            >
                                                                <ArrowUpRight className="size-3" />
                                                                View
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${incidentStatusConfig[report.status] ?? 'border-white/20 bg-white/5 text-white/60'}`}>
                                                        {report.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Status summary */}
                            <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <h3 className="mb-4 text-sm font-semibold text-white">Status Summary</h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Condition</p>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <span className={`size-2 rounded-full ${cc.dot}`} />
                                            <span className="text-sm font-medium text-white">{cc.label}</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/[0.06]" />

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Status</p>
                                        <span className={`mt-1.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusConfig[item.status] ?? 'border-white/20 bg-white/5 text-white/60'}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="h-px bg-white/[0.06]" />

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Total Records</p>
                                        <div className="mt-1.5 flex items-center gap-4 text-sm">
                                            <span className="text-white">
                                                {defectiveRecords.length} defect{defectiveRecords.length !== 1 ? 's' : ''}
                                            </span>
                                            <span className="text-white">
                                                {incidentReports.length} incident{incidentReports.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Acquisition */}
                            <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <h3 className="mb-4 text-sm font-semibold text-white">Acquisition</h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Purchase Date</p>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <Calendar className="size-3.5 text-white/40" />
                                            <span className="text-sm text-white">{formatDate(item.purchase_date)}</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/[0.06]" />

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Age</p>
                                        <p className="mt-1.5 text-sm text-white">{formatAge(item.purchase_date)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick actions */}
                            <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <h3 className="mb-4 text-sm font-semibold text-white">Actions</h3>

                                <div className="space-y-2">
                                    <Link
                                        href={`/inventory/${item.id}/edit`}
                                        className="flex items-center gap-3 rounded-xl p-3 text-sm text-white/80 transition-colors hover:bg-white/[0.04] hover:text-white"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10">
                                            <Hash className="size-4 text-ustp-gold" />
                                        </div>
                                        Edit record
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex w-full items-center gap-3 rounded-xl p-3 text-sm text-white/80 transition-colors hover:bg-red-400/5 hover:text-red-400"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-red-400/10">
                                            <Trash2 className="size-4 text-red-400" />
                                        </div>
                                        Delete record
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}