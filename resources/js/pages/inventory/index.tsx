import { Head, Link, router } from '@inertiajs/react';
import {
    Box,
    CheckCircle2,
    AlertTriangle,
    Wrench,
    Plus,
    Search,
    Trash2,
    MapPin,
    Tag,
    Monitor,
    Laptop,
    Printer,
    Projector,
    Wifi,
    Battery,
    ArrowUpRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type InventoryItemRow = {
    id: number;
    property_no: string;
    item_name: string;
    brand: string | null;
    model: string | null;
    serial_no: string | null;
    location: string | null;
    condition: string;
    status: string;
};

type Props = {
    items: InventoryItemRow[];
    filters: { search?: string; condition?: string };
};

const conditionConfig: Record<string, { icon: React.ElementType; badge: string; dot: string }> = {
    working: {
        icon: CheckCircle2,
        badge: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
        dot: 'bg-emerald-400',
    },
    defective: {
        icon: AlertTriangle,
        badge: 'border-red-400/30 bg-red-400/10 text-red-300',
        dot: 'bg-red-400',
    },
    under_repair: {
        icon: Wrench,
        badge: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
        dot: 'bg-amber-400',
    },
};

const statusConfig: Record<string, string> = {
    active: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    retired: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
    disposed: 'border-red-400/30 bg-red-400/10 text-red-300',
};

const conditionLabels: Record<string, string> = {
    working: 'Working',
    defective: 'Defective',
    under_repair: 'Under Repair',
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
    Desktop: 'bg-ustp-gold/10 text-ustp-gold',
    Laptop: 'bg-purple-400/10 text-purple-400',
    Monitor: 'bg-ustp-gold/10 text-ustp-gold',
    Printer: 'bg-emerald-400/10 text-emerald-400',
    Projector: 'bg-orange-400/10 text-orange-400',
    Network: 'bg-cyan-400/10 text-cyan-400',
    UPS: 'bg-amber-400/10 text-amber-400',
    Other: 'bg-white/5 text-white/40',
};

function ConditionRingChart({
    working,
    defective,
    underRepair,
    total,
}: {
    working: number;
    defective: number;
    underRepair: number;
    total: number;
}) {
    const size = 100;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const segments = [
        { key: 'working', count: working, color: 'rgba(52,211,153,0.9)' },
        { key: 'defective', count: defective, color: 'rgba(248,113,113,0.9)' },
        { key: 'under_repair', count: underRepair, color: 'rgba(251,191,36,0.9)' },
    ].filter((s) => s.count > 0);

    let accumulated = 0;
    const arcs = segments.map((seg) => {
        const pct = total > 0 ? seg.count / total : 0;
        const dashLength = circumference * pct - 1;
        const dashOffset = circumference * (1 - accumulated / total);
        accumulated += seg.count;

        return { ...seg, dashLength: Math.max(0, dashLength), dashOffset };
    });

    return (
        <div className="flex items-center gap-5">
            <div className="relative shrink-0">
                <svg width={size} height={size} className="-rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={strokeWidth}
                    />
                    {arcs.map((arc) => (
                        <circle
                            key={arc.key}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={arc.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${arc.dashLength} ${circumference - arc.dashLength}`}
                            strokeDashoffset={arc.dashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-white">{total}</span>
                    <span className="text-[8px] uppercase tracking-wider text-white/40">total</span>
                </div>
            </div>

            <div className="space-y-2">
                {[
                    { label: 'Working', count: working, color: 'bg-emerald-400' },
                    { label: 'Defective', count: defective, color: 'bg-red-400' },
                    { label: 'Under Repair', count: underRepair, color: 'bg-amber-400' },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${item.color}`} />
                        <span className="text-xs text-white/60">{item.label}</span>
                        <span className="text-xs font-semibold text-white/80">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CategoryBreakdown({ items }: { items: InventoryItemRow[] }) {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
        const cat = getCategoryFromName(item.item_name);
        counts[cat] = (counts[cat] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = sorted.length > 0 ? sorted[0][1] : 1;

    return (
        <div className="space-y-2.5">
            {sorted.map(([cat, count]) => {
                const Icon = categoryIcons[cat] ?? Box;
                const pct = (count / max) * 100;

                return (
                    <div key={cat}>
                        <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon className="size-3.5 text-white/40" />
                                <span className="text-xs text-white/60">{cat}</span>
                            </div>
                            <span className="text-xs font-semibold text-white/80">{count}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                                className="h-full rounded-full bg-ustp-gold/60 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
            {sorted.length === 0 && (
                <p className="py-4 text-center text-xs text-white/30">No items yet</p>
            )}
        </div>
    );
}

export default function InventoryIndex({ items, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [condition, setCondition] = useState(filters.condition ?? 'all');

    function applyFilters(newSearch: string, newCondition: string) {
        router.get(
            '/inventory',
            {
                search: newSearch || undefined,
                condition: newCondition !== 'all' ? newCondition : undefined,
            },
            { preserveState: true, replace: true },
        );
    }

    function handleDelete(id: number) {
        if (confirm('Delete this inventory item? This cannot be undone.')) {
            router.delete(`/inventory/${id}`);
        }
    }

    const totalCount = items.length;
    const workingCount = items.filter((i) => i.condition === 'working').length;
    const defectiveCount = items.filter((i) => i.condition === 'defective').length;
    const repairCount = items.filter((i) => i.condition === 'under_repair').length;
    const activeCount = items.filter((i) => i.status === 'active').length;

    return (
        <>
            <Head title="Inventory" />

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

                <div className="relative mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                                    ICT Asset Management
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-white">
                                Inventory
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50">
                                Manage ICT equipment and property records.
                            </p>
                        </div>

                        <Button
                            asChild
                            className="h-10 bg-ustp-gold px-4 text-sm font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:bg-ustp-gold-dark hover:text-white"
                        >
                            <Link href="/inventory/create">
                                <Plus className="size-4" />
                                Add Equipment
                            </Link>
                        </Button>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs text-white/40">Total Items</p>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                    <Box className="size-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-white">{totalCount}</p>
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div className="h-full rounded-full bg-ustp-gold" style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs text-white/40">Active</p>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                                    <CheckCircle2 className="size-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-white">{activeCount}</p>
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    className="h-full rounded-full bg-emerald-400"
                                    style={{ width: `${totalCount > 0 ? (activeCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs text-white/40">Defective</p>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-red-400/10 text-red-300">
                                    <AlertTriangle className="size-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-white">{defectiveCount}</p>
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    className="h-full rounded-full bg-red-400"
                                    style={{ width: `${totalCount > 0 ? (defectiveCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 shadow-xl shadow-black/10">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs text-white/40">Under Repair</p>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
                                    <Wrench className="size-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-white">{repairCount}</p>
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    className="h-full rounded-full bg-amber-400"
                                    style={{ width: `${totalCount > 0 ? (repairCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Health overview + Category breakdown */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <CheckCircle2 className="size-4 text-ustp-gold" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Condition Health</h3>
                                    <p className="text-[11px] text-white/40">Equipment status overview</p>
                                </div>
                            </div>
                            <ConditionRingChart
                                working={workingCount}
                                defective={defectiveCount}
                                underRepair={repairCount}
                                total={totalCount}
                            />
                        </div>

                        <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10 lg:col-span-2">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <Box className="size-4 text-ustp-gold" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">By Category</h3>
                                    <p className="text-[11px] text-white/40">
                                        Distribution across {Object.keys(categoryIcons).length} equipment types
                                    </p>
                                </div>
                            </div>
                            <CategoryBreakdown items={items} />
                        </div>
                    </div>

                    {/* Search and filters */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1 sm:max-w-lg">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />

                            <Input
                                placeholder="Search by name, property number, or brand..."
                                className="h-10 border-white/[0.08] bg-white/[0.03] pl-9 text-sm text-white placeholder:text-white/40 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    applyFilters(e.target.value, condition);
                                }}
                            />
                        </div>

                        <Select
                            value={condition}
                            onValueChange={(value) => {
                                setCondition(value);
                                applyFilters(search, value);
                            }}
                        >
                            <SelectTrigger className="h-10 w-full border-white/[0.08] bg-white/[0.03] text-sm text-white/80 focus:ring-1 focus:ring-ustp-gold/30 sm:w-48">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="border-[#1a2035] bg-[#0f1723] text-white">
                                <SelectItem value="all">All conditions</SelectItem>
                                <SelectItem value="working">Working</SelectItem>
                                <SelectItem value="defective">Defective</SelectItem>
                                <SelectItem value="under_repair">Under Repair</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Empty state */}
                    {items.length === 0 ? (
                        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-ustp-gold/10 text-ustp-gold">
                                <Box className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-white">
                                {search || condition !== 'all'
                                    ? 'No inventory items found'
                                    : 'No inventory items yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-white/40">
                                {search || condition !== 'all'
                                    ? 'Try changing your search or condition filter.'
                                    : 'Add your first equipment to start tracking inventory.'}
                            </p>

                            {!search && condition === 'all' && (
                                <Button
                                    asChild
                                    size="sm"
                                    className="mt-5 bg-ustp-gold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:bg-ustp-gold-dark hover:text-white"
                                >
                                    <Link href="/inventory/create">
                                        <Plus className="size-4" />
                                        Add First Item
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        /* Table */
                        <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.06] bg-[#0a0f1c]/80">
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Equipment
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Property No.
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Serial No.
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Location
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Condition
                                            </th>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Status
                                            </th>
                                            <th className="w-28 px-5 py-3.5" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {items.map((item) => {
                                            const cc = conditionConfig[item.condition] ?? conditionConfig.working;
                                            const category = getCategoryFromName(item.item_name);
                                            const CatIcon = categoryIcons[category] ?? Box;
                                            const catColor = categoryColors[category] ?? 'bg-white/5 text-white/40';

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="group border-b border-[#151c2c] transition-colors last:border-0 hover:bg-[#111827]/70"
                                                >
                                                    {/* Equipment */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${catColor}`}>
                                                                <CatIcon className="size-4" />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <Link
                                                                    href={`/inventory/${item.id}`}
                                                                    className="truncate font-medium text-white/90 transition-colors hover:text-ustp-gold"
                                                                >
                                                                    {item.item_name}
                                                                </Link>

                                                                <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                                                                    {item.brand && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Tag className="size-3" />
                                                                            {item.brand}
                                                                        </span>
                                                                    )}
                                                                    {item.model && (
                                                                        <span className="text-white/30">
                                                                            · {item.model}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Property No */}
                                                    <td className="px-5 py-4">
                                                        <span className="font-mono text-[11px] text-white/40">
                                                            {item.property_no}
                                                        </span>
                                                    </td>

                                                    {/* Serial No */}
                                                    <td className="px-5 py-4">
                                                        {item.serial_no ? (
                                                            <span className="font-mono text-[11px] text-white/40">
                                                                {item.serial_no}
                                                            </span>
                                                        ) : (
                                                            <span className="text-white/30">—</span>
                                                        )}
                                                    </td>

                                                    {/* Location */}
                                                    <td className="px-5 py-4">
                                                        {item.location ? (
                                                            <span className="flex items-center gap-1.5 text-xs text-white/40">
                                                                <MapPin className="size-3 shrink-0 text-white/30" />
                                                                {item.location}
                                                            </span>
                                                        ) : (
                                                            <span className="text-white/30">—</span>
                                                        )}
                                                    </td>

                                                    {/* Condition */}
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cc.badge}`}>
                                                            <span className={`size-1.5 rounded-full ${cc.dot}`} />
                                                            {conditionLabels[item.condition] ?? item.condition.replace('_', ' ')}
                                                        </span>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusConfig[item.status] ?? 'border-white/20 bg-white/5 text-white/60'}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Link
                                                                href={`/inventory/${item.id}`}
                                                                className="flex size-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-ustp-gold/10 hover:text-ustp-gold"
                                                            >
                                                                <ArrowUpRight className="size-3.5" />
                                                            </Link>

                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-2.5 text-xs text-white/50 hover:bg-[#111827] hover:text-white"
                                                            >
                                                                <Link href={`/inventory/${item.id}/edit`}>
                                                                    Edit
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-white/40 hover:bg-red-400/10 hover:text-red-400"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table footer */}
                            <div className="flex items-center justify-between border-t border-white/[0.06] bg-[#0a0f1c]/60 px-5 py-3">
                                <p className="text-[11px] text-white/40">
                                    Showing {totalCount} {totalCount === 1 ? 'record' : 'records'}
                                </p>

                                <div className="flex items-center gap-2 text-[10px] text-white/40">
                                    <span className="size-1 rounded-full bg-ustp-gold" />
                                    Inventory Management
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}