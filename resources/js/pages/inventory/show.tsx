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
    FileText,
    ArrowUpRight,
    Trash2,
    Shield,
    QrCode,
    Banknote,
    User as UserIcon,
    Building2,
    BadgeCheck,
    StickyNote,
    ClipboardList,
    Wrench,
    History,
    Pencil,
    LocateFixed,
} from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';

/* ---------- Types ---------- */

type RequestItemRecord = {
    id: number;
    issue_description: string | null;
    serviceRequest?: {
        id: number;
        form_number: string;
        request_status: string;
        problem_description: string | null;
        user?: { name: string } | null;
    } | null;
};

type JobOrderRecord = {
    id: number;
    job_order_number: string;
    status: string;
    priority_level: string | null;
    serviceRequest?: { form_number: string } | null;
};

type DefectiveRecord = {
    id: number;
    damage_description: string;
    repair_status: string;
    date_reported: string | null;
    jobOrder?: JobOrderRecord | null;
};

type IncidentRecord = {
    id: number;
    incident_type: string;
    incident_description: string;
    incident_date: string | null;
    status: string;
    reporter?: { name: string } | null;
};

type AuditLogRecord = {
    id: number;
    action_taken: string;
    action_date: string;
    details: string | null;
    adminUser?: { name: string } | null;
};

type InventoryItemData = {
    id: number;
    property_no: string;
    item_inventory_no: string | null;
    item_name: string;
    category: string | null;
    brand: string | null;
    model: string | null;
    serial_no: string | null;
    specification: string | null;
    description: string | null;
    location: string | null;
    purchase_date: string | null;
    unit_cost: string | null;
    purchase_order_no: string | null;
    end_user: string | null;
    department: string | null;
    campus: string | null;
    building: string | null;
    room: string | null;
    specific_location: string | null;
    condition: string;
    status: string;
    validation: string | null;
    inspection_date: string | null;
    inspection_remarks: string | null;
    request_items?: RequestItemRecord[];
    defective_records?: DefectiveRecord[];
    incident_reports?: IncidentRecord[];
    audit_logs?: AuditLogRecord[];
};

type Props = {
    item: InventoryItemData;
};

/* ---------- Config ---------- */

function getCategoryFromName(name: string): string {
    const lower = name.toLowerCase();

    if (lower.includes('desktop')) {
        return 'Desktop';
    }

    if (lower.includes('laptop')) {
        return 'Laptop';
    }

    if (lower.includes('monitor')) {
        return 'Monitor';
    }

    if (lower.includes('printer')) {
        return 'Printer';
    }

    if (lower.includes('projector')) {
        return 'Projector';
    }

    if (lower.includes('network')) {
        return 'Network';
    }

    if (lower.includes('ups')) {
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
    Other: 'bg-slate-50 text-slate-400 border-slate-200',
};

const conditionConfig: Record<
    string,
    { badge: string; dot: string; label: string }
> = {
    working: {
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        dot: 'bg-emerald-400',
        label: 'Working',
    },
    defective: {
        badge: 'border-red-200 bg-red-50 text-red-600',
        dot: 'bg-red-400',
        label: 'Defective',
    },
    under_repair: {
        badge: 'border-amber-200 bg-amber-50 text-amber-700',
        dot: 'bg-amber-400',
        label: 'Under Repair',
    },
};

const statusConfig: Record<string, string> = {
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    retired: 'border-slate-200 bg-slate-50 text-slate-600',
    disposed: 'border-red-200 bg-red-50 text-red-600',
};

const repairStatusConfig: Record<string, string> = {
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    in_progress: 'border-sky-200 bg-sky-50 text-sky-700',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const incidentStatusConfig: Record<string, string> = {
    open: 'border-red-200 bg-red-50 text-red-600',
    under_review: 'border-amber-200 bg-amber-50 text-amber-700',
    resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const validationConfig: Record<string, string> = {
    validated: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    'for inspection': 'border-amber-200 bg-amber-50 text-amber-700',
    pending: 'border-slate-200 bg-slate-50 text-slate-500',
};

const requestStatusConfig: Record<string, string> = {
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    approved: 'border-sky-200 bg-sky-50 text-sky-700',
    rejected: 'border-red-200 bg-red-50 text-red-600',
    in_progress: 'border-sky-200 bg-sky-50 text-sky-700',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    cancelled: 'border-slate-200 bg-slate-50 text-slate-500',
};

const jobOrderStatusConfig: Record<string, string> = {
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    in_progress: 'border-sky-200 bg-sky-50 text-sky-700',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    closed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    cancelled: 'border-slate-200 bg-slate-50 text-slate-500',
};

/* ---------- Helpers ---------- */

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

function formatDateTime(dateStr: string | null): string {
    if (!dateStr) {
        return '—';
    }

    return new Date(dateStr).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

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

function formatCurrency(value: string | null): string {
    const parsed = parseFloat(value ?? '');

    if (Number.isNaN(parsed)) {
        return '—';
    }

    return parsed.toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
    });
}

/* ---------- Component ---------- */

export default function InventoryShow({ item }: Props) {
    const category = item.category ?? getCategoryFromName(item.item_name);
    const CatIcon = categoryIcons[category] ?? Box;
    const catColor =
        categoryColors[category] ??
        'bg-slate-50 text-slate-400 border-slate-200';
    const cc = conditionConfig[item.condition] ?? conditionConfig.working;

    const requestItems = item.request_items ?? [];
    const defectiveRecords = item.defective_records ?? [];
    const incidentReports = item.incident_reports ?? [];
    const auditLogs = item.audit_logs ?? [];

    const jobOrderMap = new Map<number, JobOrderRecord>();
    defectiveRecords.forEach((record) => {
        if (record.jobOrder) {
            jobOrderMap.set(record.jobOrder.id, record.jobOrder);
        }
    });
    const jobOrders = Array.from(jobOrderMap.values());

    const locationParts = [item.campus, item.building, item.room]
        .filter(Boolean)
        .join(' · ');

    function handleDelete() {
        if (confirm('Delete this inventory item? This cannot be undone.')) {
            router.delete(`/inventory/${item.id}`);
        }
    }

    function handlePrintLabel() {
        window.open(`/inventory/${item.id}/qr`, '_blank');
    }

    return (
        <>
            <Head title={`Inventory — ${item.item_name}`} />

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-6xl space-y-6">
                    <BackButton href="/inventory" />

                    {/* Item header */}
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div
                                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border ${catColor}`}
                            >
                                <CatIcon className="size-7" />
                            </div>

                            <div>
                                <div className="mb-2.5 flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                    <span className="text-[11px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                                        Inventory Record
                                    </span>
                                </div>

                                <h1 className="text-2xl font-semibold tracking-tight text-slate-800 md:text-3xl">
                                    {item.item_name}
                                </h1>

                                <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cc.badge}`}
                                    >
                                        <span
                                            className={`size-1.5 rounded-full ${cc.dot}`}
                                        />
                                        {cc.label}
                                    </span>

                                    <span
                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusConfig[item.status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                    >
                                        {item.status}
                                    </span>

                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${catColor}`}
                                    >
                                        {category}
                                    </span>

                                    {item.validation && (
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${validationConfig[item.validation.toLowerCase()] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                        >
                                            <BadgeCheck className="size-3" />
                                            {item.validation}
                                        </span>
                                    )}

                                    <span className="font-mono text-xs text-slate-400">
                                        {item.property_no}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-9 border border-slate-200 bg-white px-4 text-sm text-slate-600 shadow-sm hover:bg-slate-50"
                                onClick={handlePrintLabel}
                            >
                                <QrCode className="size-4" />
                                Print Label
                            </Button>

                            <Button
                                asChild
                                className="h-9 bg-ustp-gold px-4 text-sm font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/10 transition-all hover:bg-ustp-gold-dark hover:text-white"
                            >
                                <Link href={`/inventory/${item.id}/edit`}>
                                    <Pencil className="size-4" />
                                    Edit
                                </Link>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-9 text-slate-400 hover:bg-red-400/10 hover:text-red-400"
                                onClick={handleDelete}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Two-column layout */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main column */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Property Information */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <Hash className="size-4 text-ustp-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Property Information
                                        </h3>
                                        <p className="text-[11px] text-slate-400">
                                            Identifiers from the physical
                                            property label
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-6">
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Property No.
                                        </p>
                                        <p className="mt-1 font-mono text-sm text-slate-800">
                                            {item.property_no}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Item / Inventory No.
                                        </p>
                                        <p className="mt-1 font-mono text-sm text-slate-800">
                                            {item.item_inventory_no ?? '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Property Name
                                        </p>
                                        <p className="mt-1 text-sm text-slate-800">
                                            {item.item_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Category
                                        </p>
                                        <p className="mt-1 text-sm text-slate-800">
                                            {category}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <FileText className="size-4 text-ustp-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Specifications
                                        </h3>
                                        <p className="text-[11px] text-slate-400">
                                            Brand, model, serial, and technical
                                            details
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-5 sm:grid-cols-3 md:p-6">
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Brand
                                        </p>
                                        <p className="mt-1 text-sm text-slate-800">
                                            {item.brand ?? '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Model
                                        </p>
                                        <p className="mt-1 text-sm text-slate-800">
                                            {item.model ?? '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Serial No.
                                        </p>
                                        <p className="mt-1 font-mono text-sm text-slate-800">
                                            {item.serial_no ?? '—'}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Specification
                                        </p>
                                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                                            {item.specification ?? '—'}
                                        </p>
                                    </div>
                                    {item.description && (
                                        <div className="sm:col-span-3">
                                            <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                                Description
                                            </p>
                                            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                                                {item.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Acquisition & Location */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <Banknote className="size-4 text-ustp-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Acquisition
                                        </h3>
                                        <p className="text-[11px] text-slate-400">
                                            Date acquired, cost, and reference
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-5 sm:grid-cols-3 md:p-6">
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Date Acquired
                                        </p>
                                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                                            <Calendar className="size-3.5 text-slate-400" />
                                            {formatDate(item.purchase_date)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Unit Cost
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {formatCurrency(item.unit_cost)}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Reference / Purchase Order
                                        </p>
                                        <p className="mt-1 font-mono text-sm text-slate-800">
                                            {item.purchase_order_no ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 px-5 py-4 md:px-6">
                                    <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                        Assignment &amp; Location
                                    </p>
                                    <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <p className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <UserIcon className="size-3" />
                                                End User
                                            </p>
                                            <p className="mt-1 text-sm text-slate-800">
                                                {item.end_user ?? '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <Building2 className="size-3" />
                                                Department
                                            </p>
                                            <p className="mt-1 text-sm text-slate-800">
                                                {item.department ?? '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <LocateFixed className="size-3" />
                                                Campus / Location
                                            </p>
                                            <p className="mt-1 text-sm text-slate-800">
                                                {item.campus ?? '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <Building2 className="size-3" />
                                                Building
                                            </p>
                                            <p className="mt-1 text-sm text-slate-800">
                                                {item.building ?? '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Room
                                            </p>
                                            <p className="mt-1 text-sm text-slate-800">
                                                {item.room ?? '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Specific Location
                                            </p>
                                            <p className="mt-1 text-sm text-slate-800">
                                                {item.specific_location ?? '—'}
                                            </p>
                                        </div>
                                    </div>

                                    {locationParts && (
                                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                                            <MapPin className="size-3.5 text-slate-400" />
                                            {locationParts}
                                            {item.location &&
                                                item.location !==
                                                    locationParts && (
                                                    <span className="text-slate-300">
                                                        ·{item.location}
                                                    </span>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Inspection */}
                            {item.validation ||
                            item.inspection_date ||
                            item.inspection_remarks ? (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                            <BadgeCheck className="size-4 text-ustp-gold" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Inspection
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                Validation and inspection
                                                details
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-6">
                                        <div>
                                            <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                                Validation
                                            </p>
                                            <span
                                                className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${validationConfig[item.validation?.toLowerCase() ?? ''] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                            >
                                                {item.validation ?? '—'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                                Inspection Date
                                            </p>
                                            <div className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                                                <Calendar className="size-3.5 text-slate-400" />
                                                {formatDate(
                                                    item.inspection_date,
                                                )}
                                            </div>
                                        </div>
                                        {item.inspection_remarks && (
                                            <div className="sm:col-span-2">
                                                <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                                    Inspection Remarks
                                                </p>
                                                <p className="mt-1 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                                                    <StickyNote className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                                                    {item.inspection_remarks}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}

                            {/* Service Requests */}
                            {requestItems.length > 0 && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-slate-200 bg-sky-50/50 px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-sky-400/10">
                                            <ClipboardList className="size-4 text-sky-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Service Requests
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                {requestItems.length} linked
                                                request
                                                {requestItems.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-slate-200">
                                        {requestItems.map((ri) => {
                                            const sr = ri.serviceRequest;

                                            return (
                                                <div
                                                    key={ri.id}
                                                    className="px-5 py-4 md:px-6"
                                                >
                                                    {sr ? (
                                                        <>
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-mono text-xs font-semibold text-slate-700">
                                                                            {
                                                                                sr.form_number
                                                                            }
                                                                        </span>
                                                                        <Link
                                                                            href={`/service-requests/${sr.id}`}
                                                                            className="flex items-center gap-1 text-xs text-ustp-gold/90 transition-colors hover:text-ustp-gold"
                                                                        >
                                                                            <ArrowUpRight className="size-3" />
                                                                            View
                                                                        </Link>
                                                                    </div>
                                                                    <p className="mt-1 text-sm text-slate-800">
                                                                        {sr.problem_description ??
                                                                            ri.issue_description ??
                                                                            'No description provided'}
                                                                    </p>
                                                                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                                                                        {sr.user
                                                                            ?.name && (
                                                                            <span>
                                                                                by{' '}
                                                                                {
                                                                                    sr
                                                                                        .user
                                                                                        .name
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${requestStatusConfig[sr.request_status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                                                >
                                                                    {
                                                                        sr.request_status
                                                                    }
                                                                </span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <p className="text-xs text-slate-400">
                                                            {ri.issue_description ??
                                                                'Service request record'}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Job Orders */}
                            {jobOrders.length > 0 && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-slate-200 bg-indigo-50/50 px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-400/10">
                                            <Wrench className="size-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Job Orders
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                {jobOrders.length} job order
                                                {jobOrders.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-slate-200">
                                        {jobOrders.map((jo) => (
                                            <div
                                                key={jo.id}
                                                className="px-5 py-4 md:px-6"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs font-semibold text-slate-700">
                                                                {jo.job_order_number ??
                                                                    `JO-${jo.id}`}
                                                            </span>
                                                            {jo.serviceRequest && (
                                                                <span className="text-xs text-slate-400">
                                                                    from{' '}
                                                                    {
                                                                        jo
                                                                            .serviceRequest
                                                                            .form_number
                                                                    }
                                                                </span>
                                                            )}
                                                            <Link
                                                                href={`/job-orders/${jo.id}`}
                                                                className="flex items-center gap-1 text-xs text-ustp-gold/90 transition-colors hover:text-ustp-gold"
                                                            >
                                                                <ArrowUpRight className="size-3" />
                                                                View
                                                            </Link>
                                                        </div>
                                                        {jo.priority_level && (
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                Priority:{' '}
                                                                {
                                                                    jo.priority_level
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${jobOrderStatusConfig[jo.status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                                    >
                                                        {jo.status.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Defective Records */}
                            {defectiveRecords.length > 0 && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-slate-200 bg-red-50/50 px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-red-400/10">
                                            <AlertTriangle className="size-4 text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Defective Equipment
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                {defectiveRecords.length} record
                                                {defectiveRecords.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-slate-200">
                                        {defectiveRecords.map((record) => (
                                            <div
                                                key={record.id}
                                                className="px-5 py-4 md:px-6"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-slate-800">
                                                            {
                                                                record.damage_description
                                                            }
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="size-3" />
                                                                {formatDate(
                                                                    record.date_reported,
                                                                )}
                                                            </span>
                                                            {record.jobOrder && (
                                                                <Link
                                                                    href={`/job-orders/${record.jobOrder.id}`}
                                                                    className="flex items-center gap-1 text-ustp-gold/90 transition-colors hover:text-ustp-gold"
                                                                >
                                                                    <FileText className="size-3" />
                                                                    {record
                                                                        .jobOrder
                                                                        .job_order_number ??
                                                                        `JO-${record.jobOrder.id}`}
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${repairStatusConfig[record.repair_status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                                    >
                                                        {record.repair_status.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Incident Reports */}
                            {incidentReports.length > 0 && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-slate-200 bg-amber-50/50 px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-amber-400/10">
                                            <Shield className="size-4 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Incident Reports
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                {incidentReports.length} report
                                                {incidentReports.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-slate-200">
                                        {incidentReports.map((report) => (
                                            <div
                                                key={report.id}
                                                className="px-5 py-4 md:px-6"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium text-slate-800">
                                                                {
                                                                    report.incident_type
                                                                }
                                                            </p>
                                                        </div>
                                                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                                                            {
                                                                report.incident_description
                                                            }
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="size-3" />
                                                                {formatDate(
                                                                    report.incident_date,
                                                                )}
                                                            </span>
                                                            {report.reporter && (
                                                                <span>
                                                                    by{' '}
                                                                    {
                                                                        report
                                                                            .reporter
                                                                            .name
                                                                    }
                                                                </span>
                                                            )}
                                                            <Link
                                                                href={`/incidents/${report.id}`}
                                                                className="flex items-center gap-1 text-ustp-gold/90 transition-colors hover:text-ustp-gold"
                                                            >
                                                                <ArrowUpRight className="size-3" />
                                                                View
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${incidentStatusConfig[report.status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                                    >
                                                        {report.status.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Audit History */}
                            {auditLogs.length > 0 && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100">
                                            <History className="size-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Audit History
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                Actions recorded for this record
                                            </p>
                                        </div>
                                    </div>

                                    <ol className="px-5 py-5 md:px-6">
                                        {auditLogs.map((log, index) => (
                                            <li
                                                key={log.id}
                                                className="relative flex gap-4 pb-6 last:pb-0"
                                            >
                                                {index <
                                                    auditLogs.length - 1 && (
                                                    <span className="absolute top-6 left-[11px] h-full w-px bg-slate-200" />
                                                )}
                                                <span className="mt-1 size-[15px] shrink-0 rounded-full border-2 border-ustp-gold/40 bg-white" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {log.action_taken}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                                        {formatDateTime(
                                                            log.action_date,
                                                        )}
                                                        {log.adminUser && (
                                                            <span>
                                                                {' '}
                                                                by{' '}
                                                                {
                                                                    log
                                                                        .adminUser
                                                                        .name
                                                                }
                                                            </span>
                                                        )}
                                                    </p>
                                                    {log.details && (
                                                        <p className="mt-1.5 text-xs text-slate-500">
                                                            {log.details}
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Status summary */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-4 text-sm font-semibold text-slate-800">
                                    Status Summary
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Condition
                                        </p>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <span
                                                className={`size-2 rounded-full ${cc.dot}`}
                                            />
                                            <span className="text-sm font-medium text-slate-800">
                                                {cc.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-200" />

                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Status
                                        </p>
                                        <span
                                            className={`mt-1.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusConfig[item.status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="h-px bg-slate-200" />

                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Related Records
                                        </p>
                                        <div className="mt-1.5 grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {requestItems.length}
                                                </p>
                                                <p className="flex items-center gap-1 text-[10px] text-slate-400">
                                                    <ClipboardList className="size-3" />
                                                    Service Req.
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {jobOrders.length}
                                                </p>
                                                <p className="flex items-center gap-1 text-[10px] text-slate-400">
                                                    <Wrench className="size-3" />
                                                    Job Orders
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {defectiveRecords.length}
                                                </p>
                                                <p className="flex items-center gap-1 text-[10px] text-slate-400">
                                                    <AlertTriangle className="size-3" />
                                                    Defects
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {incidentReports.length}
                                                </p>
                                                <p className="flex items-center gap-1 text-[10px] text-slate-400">
                                                    <Shield className="size-3" />
                                                    Incidents
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <QrCode className="size-4 text-ustp-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Property Label QR
                                        </h3>
                                        <p className="text-[11px] text-slate-400">
                                            Points to this record
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <img
                                        src={`/inventory/${item.id}/qr`}
                                        alt="QR code for this inventory record"
                                        className="size-40"
                                    />
                                    <p className="mt-3 text-center font-mono text-[10px] text-slate-400">
                                        {item.property_no}
                                    </p>
                                </div>

                                <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                                    Scanning this QR opens the record in the
                                    system. The database remains the source of
                                    truth for all label details.
                                </p>
                            </div>

                            {/* Acquisition */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-4 text-sm font-semibold text-slate-800">
                                    Acquisition
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Purchase Date
                                        </p>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <Calendar className="size-3.5 text-slate-400" />
                                            <span className="text-sm text-slate-800">
                                                {formatDate(item.purchase_date)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-200" />

                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Unit Cost
                                        </p>
                                        <p className="mt-1.5 text-sm font-medium text-slate-800">
                                            {formatCurrency(item.unit_cost)}
                                        </p>
                                    </div>

                                    <div className="h-px bg-slate-200" />

                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                            Age
                                        </p>
                                        <p className="mt-1.5 text-sm text-slate-800">
                                            {formatAge(item.purchase_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick actions */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-4 text-sm font-semibold text-slate-800">
                                    Actions
                                </h3>

                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={handlePrintLabel}
                                        className="flex w-full items-center gap-3 rounded-xl p-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10">
                                            <QrCode className="size-4 text-ustp-gold" />
                                        </div>
                                        Print property label (QR)
                                    </button>

                                    <Link
                                        href={`/inventory/${item.id}/edit`}
                                        className="flex items-center gap-3 rounded-xl p-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10">
                                            <Pencil className="size-4 text-ustp-gold" />
                                        </div>
                                        Edit record
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex w-full items-center gap-3 rounded-xl p-3 text-sm text-slate-600 transition-colors hover:bg-red-400/5 hover:text-red-400"
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
