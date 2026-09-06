import { Head, useForm } from '@inertiajs/react';
import {
    CalendarDays,
    PackagePlus,
    MapPin,
    Wrench,
    Monitor,
    Laptop,
    Printer,
    Projector,
    Wifi,
    Battery,
    Box,
    CheckCircle2,
    AlertTriangle,
} from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

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

const conditionVisuals: Record<string, { icon: React.ElementType; color: string; ring: string }> = {
    working: {
        icon: CheckCircle2,
        color: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400',
        ring: 'ring-emerald-400/30',
    },
    defective: {
        icon: AlertTriangle,
        color: 'border-red-400/40 bg-red-400/10 text-red-400',
        ring: 'ring-red-400/30',
    },
    under_repair: {
        icon: Wrench,
        color: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
        ring: 'ring-amber-400/30',
    },
};

const inputClass =
    'h-10 border-[#1a2035] bg-[#0c1222] text-white placeholder:text-white/40 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20';

const selectClass =
    'h-10 w-full border-[#1a2035] bg-[#0c1222] text-white/80 focus:ring-1 focus:ring-ustp-gold/30';

const stepClasses: Record<number, string> = {
    1: 'bg-ustp-gold/15 text-ustp-gold',
    2: 'bg-ustp-gold/15 text-ustp-gold',
    3: 'bg-ustp-gold/15 text-ustp-gold',
    4: 'bg-emerald-400/15 text-emerald-400',
    5: 'bg-orange-400/15 text-orange-400',
};

export default function InventoryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        property_no: '',
        item_name: '',
        brand: '',
        model: '',
        serial_no: '',
        location: '',
        condition: 'working',
        status: 'active',
        purchase_date: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/inventory');
    }

    const category = getCategoryFromName(data.item_name);
    const CatIcon = categoryIcons[category] ?? Box;
    const catColor = categoryColors[category] ?? 'bg-white/5 text-white/40 border-white/10';
    const cv = conditionVisuals[data.condition] ?? conditionVisuals.working;
    const CondIcon = cv.icon;

    const hasAnyData = data.property_no || data.item_name || data.brand || data.model;

    return (
        <>
            <Head title="Add Inventory Item" />

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

                <div className="relative mx-auto max-w-6xl space-y-6">
                    <BackButton href="/inventory" />

                    {/* Heading */}
                    <div className="flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ustp-gold/10 text-ustp-gold">
                            <PackagePlus className="size-5" />
                        </div>

                        <div>
                            <div className="mb-2.5 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                                    Inventory Management
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-white">
                                Add Equipment
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50">
                                Register new ICT equipment in the inventory.
                            </p>
                        </div>
                    </div>

                    {/* Two-column layout */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Form column */}
                        <form
                            onSubmit={handleSubmit}
                            className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10 lg:col-span-2"
                        >
                            <div className="flex flex-col gap-7 p-5 md:p-6">
                                {/* Step 1: Identification */}
                                <section>
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[1]}`}>
                                            1
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Identification</p>
                                            <p className="mt-0.5 text-xs text-white/40">
                                                Basic information used to identify this equipment.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="property_no" className="text-xs font-medium text-white/70">
                                                Property no. <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                id="property_no"
                                                value={data.property_no}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('property_no', e.target.value)}
                                                placeholder="USTP-ICT-XX-0001"
                                                className={inputClass}
                                            />
                                            {errors.property_no && <p className="text-xs text-red-400">{errors.property_no}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="item_name" className="text-xs font-medium text-white/70">
                                                Item name <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                id="item_name"
                                                value={data.item_name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('item_name', e.target.value)}
                                                placeholder="Desktop - Dell OptiPlex 7090"
                                                className={inputClass}
                                            />
                                            {errors.item_name && <p className="text-xs text-red-400">{errors.item_name}</p>}
                                        </div>
                                    </div>
                                </section>

                                {/* Step 2: Product Details */}
                                <section className="border-t border-white/[0.06] pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[2]}`}>
                                            2
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Product Details</p>
                                            <p className="mt-0.5 text-xs text-white/40">
                                                Manufacturer and model information.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="brand" className="text-xs font-medium text-white/70">Brand</Label>
                                            <Input
                                                id="brand"
                                                value={data.brand}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('brand', e.target.value)}
                                                placeholder="Dell"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="model" className="text-xs font-medium text-white/70">Model</Label>
                                            <Input
                                                id="model"
                                                value={data.model}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('model', e.target.value)}
                                                placeholder="OptiPlex 7090"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Step 3: Asset Details */}
                                <section className="border-t border-white/[0.06] pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[3]}`}>
                                            3
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Asset Details</p>
                                            <p className="mt-0.5 text-xs text-white/40">
                                                Serial information and current equipment location.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="serial_no" className="text-xs font-medium text-white/70">Serial no.</Label>
                                            <Input
                                                id="serial_no"
                                                value={data.serial_no}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('serial_no', e.target.value)}
                                                placeholder="SN-123456789"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="location" className="text-xs font-medium text-white/70">Location</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('location', e.target.value)}
                                                placeholder="ICT Office - Room 101"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Step 4: Status & Condition */}
                                <section className="border-t border-white/[0.06] pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[4]}`}>
                                            4
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Status & Condition</p>
                                            <p className="mt-0.5 text-xs text-white/40">
                                                Set the current operational state of the equipment.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="condition" className="text-xs font-medium text-white/70">Condition</Label>
                                            <Select value={data.condition} onValueChange={(value) => setData('condition', value)}>
                                                <SelectTrigger id="condition" className={selectClass}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-[#1a2035] bg-[#0f1723] text-white">
                                                    <SelectItem value="working">Working</SelectItem>
                                                    <SelectItem value="defective">Defective</SelectItem>
                                                    <SelectItem value="under_repair">Under Repair</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="status" className="text-xs font-medium text-white/70">Status</Label>
                                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                <SelectTrigger id="status" className={selectClass}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-[#1a2035] bg-[#0f1723] text-white">
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="retired">Retired</SelectItem>
                                                    <SelectItem value="disposed">Disposed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </section>

                                {/* Step 5: Acquisition */}
                                <section className="border-t border-white/[0.06] pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[5]}`}>
                                            5
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Acquisition</p>
                                            <p className="mt-0.5 text-xs text-white/40">
                                                Record when the equipment was purchased.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid max-w-md gap-2">
                                        <Label htmlFor="purchase_date" className="text-xs font-medium text-white/70">Purchase date</Label>
                                        <div className="relative">
                                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                                            <Input
                                                id="purchase_date"
                                                type="date"
                                                value={data.purchase_date}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('purchase_date', e.target.value)}
                                                className={`${inputClass} pl-10 scheme-dark`}
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] bg-[#0a0f1c]/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                                <p className="text-[11px] text-white/40">
                                    Make sure the property number and item details are correct before saving.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => window.history.back()}
                                        className="text-white/50 hover:bg-[#111827] hover:text-white"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-ustp-gold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:bg-ustp-gold-dark hover:text-white"
                                    >
                                        {processing && <Spinner />}
                                        Add Equipment
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Live preview sidebar */}
                        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-ustp-gold" />
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
                                        Live Preview
                                    </p>
                                </div>

                                {hasAnyData ? (
                                    <div className="space-y-4">
                                        {/* Icon + Name */}
                                        <div className="flex items-start gap-3">
                                            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl border ${catColor}`}>
                                                <CatIcon className="size-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-white">
                                                    {data.item_name || 'Item name'}
                                                </p>
                                                {data.brand && (
                                                    <p className="mt-0.5 text-xs text-white/40">
                                                        {data.brand}{data.model ? ` ${data.model}` : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/[0.06]" />

                                        {/* Details */}
                                        <div className="space-y-3 text-sm">
                                            {data.property_no && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-white/40">Property No.</span>
                                                    <span className="font-mono text-xs text-white/80">{data.property_no}</span>
                                                </div>
                                            )}
                                            {data.serial_no && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-white/40">Serial No.</span>
                                                    <span className="font-mono text-xs text-white/80">{data.serial_no}</span>
                                                </div>
                                            )}
                                            {data.location && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-white/40">Location</span>
                                                    <span className="flex items-center gap-1 text-xs text-white/80">
                                                        <MapPin className="size-3 text-white/40" />
                                                        {data.location}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="h-px bg-white/[0.06]" />

                                        {/* Condition + Status */}
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${cv.color}`}>
                                                <CondIcon className="size-3" />
                                                {data.condition === 'under_repair' ? 'Under Repair' : data.condition.charAt(0).toUpperCase() + data.condition.slice(1)}
                                            </span>
                                            <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium capitalize text-emerald-300">
                                                {data.status}
                                            </span>
                                        </div>

                                        {data.purchase_date && (
                                            <>
                                                <div className="h-px bg-white/[0.06]" />
                                                <div className="flex items-center gap-2 text-xs text-white/40">
                                                    <CalendarDays className="size-3.5" />
                                                    Purchased {new Date(data.purchase_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-[#1a2035] bg-[#070b18] text-white/40">
                                            <PackagePlus className="size-5" />
                                        </div>
                                        <p className="text-xs text-white/40">
                                            Start filling in the form to see a live preview of the equipment record.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Tips */}
                            <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
                                    Tips
                                </p>
                                <ul className="space-y-2 text-xs text-white/50">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 size-1 shrink-0 rounded-full bg-ustp-gold" />
                                        Use the format <span className="font-mono text-white/80">USTP-ICT-XX-0001</span> for property numbers.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 size-1 shrink-0 rounded-full bg-ustp-gold" />
                                        Prefix item names with the category (e.g., "Desktop - ...", "Laptop - ...").
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 size-1 shrink-0 rounded-full bg-emerald-400" />
                                        Serial numbers help track manufacturer warranty and service history.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}