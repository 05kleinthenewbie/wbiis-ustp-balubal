import { Head, useForm } from '@inertiajs/react';
import {
    CalendarDays,
    PackagePlus,
    Tag,
    MapPin,
    Wrench,
    ShoppingCart,
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
    if (lower.startsWith('desktop')) return 'Desktop';
    if (lower.startsWith('laptop')) return 'Laptop';
    if (lower.startsWith('monitor')) return 'Monitor';
    if (lower.startsWith('printer')) return 'Printer';
    if (lower.startsWith('projector')) return 'Projector';
    if (lower.startsWith('network')) return 'Network';
    if (lower.startsWith('ups')) return 'UPS';
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
    Desktop: 'bg-ustp-light-blue/15 text-ustp-light-blue border-ustp-light-blue/20',
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

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative mx-auto flex max-w-6xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 left-1/3 size-105 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                        <div className="absolute -bottom-40 right-1/4 size-90 rounded-full bg-ustp-gold/[0.015] blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/inventory" />
                    </div>

                    {/* Header */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                                Inventory Management
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl border border-[#1a2035] bg-[#0f1723] text-ustp-light-blue">
                                <PackagePlus className="size-5" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                                    Add Equipment
                                </h1>

                                <p className="mt-1 text-sm text-gray-400">
                                    Register new ICT equipment in the inventory.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Two-column layout */}
                    <div className="relative grid gap-6 lg:grid-cols-3">
                        {/* Form column */}
                        <form
                            onSubmit={handleSubmit}
                            className="relative overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-2xl shadow-black/20 lg:col-span-2"
                        >
                            <div className="flex flex-col gap-7 p-5 md:p-6">
                                {/* Step 1: Identification */}
                                <section>
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ustp-blue-accent/20 text-[11px] font-bold text-ustp-light-blue">
                                            1
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-200">Identification</p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Basic information used to identify this equipment.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="property_no" className="text-xs font-medium text-gray-300">
                                                Property no. <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                id="property_no"
                                                value={data.property_no}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('property_no', e.target.value)}
                                                placeholder="USTP-ICT-XX-0001"
                                                className="h-10 border-[#1a2035] bg-[#070b18] text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                            {errors.property_no && <p className="text-xs text-red-400">{errors.property_no}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="item_name" className="text-xs font-medium text-gray-300">
                                                Item name <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                id="item_name"
                                                value={data.item_name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('item_name', e.target.value)}
                                                placeholder="Desktop - Dell OptiPlex 7090"
                                                className="h-10 border-[#1a2035] bg-[#070b18] text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                            {errors.item_name && <p className="text-xs text-red-400">{errors.item_name}</p>}
                                        </div>
                                    </div>
                                </section>

                                {/* Step 2: Product Details */}
                                <section className="border-t border-[#1a2035] pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ustp-gold/20 text-[11px] font-bold text-ustp-gold">
                                            2
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-200">Product Details</p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Manufacturer and model information.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="brand" className="text-xs font-medium text-gray-300">Brand</Label>
                                            <Input
                                                id="brand"
                                                value={data.brand}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('brand', e.target.value)}
                                                placeholder="Dell"
                                                className="h-10 border-[#1a2035] bg-[#070b18] text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="model" className="text-xs font-medium text-gray-300">Model</Label>
                                            <Input
                                                id="model"
                                                value={data.model}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('model', e.target.value)}
                                                placeholder="OptiPlex 7090"
                                                className="h-10 border-[#1a2035] bg-[#070b18] text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Step 3: Asset Details */}
                                <section className="border-t border-[#1a2035] pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ustp-light-blue/20 text-[11px] font-bold text-ustp-light-blue">
                                            3
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-200">Asset Details</p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Serial information and current equipment location.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="serial_no" className="text-xs font-medium text-gray-300">Serial no.</Label>
                                            <Input
                                                id="serial_no"
                                                value={data.serial_no}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('serial_no', e.target.value)}
                                                placeholder="SN-123456789"
                                                className="h-10 border-[#1a2035] bg-[#070b18] text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="location" className="text-xs font-medium text-gray-300">Location</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('location', e.target.value)}
                                                placeholder="ICT Office - Room 101"
                                                className="h-10 border-[#1a2035] bg-[#070b18] text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Step 4: Status & Condition */}
                                <section className="border-t border-[#1a2035] pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-[11px] font-bold text-emerald-400">
                                            4
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-200">Status & Condition</p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Set the current operational state of the equipment.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="condition" className="text-xs font-medium text-gray-300">Condition</Label>
                                            <Select value={data.condition} onValueChange={(value) => setData('condition', value)}>
                                                <SelectTrigger id="condition" className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                                    <SelectItem value="working">Working</SelectItem>
                                                    <SelectItem value="defective">Defective</SelectItem>
                                                    <SelectItem value="under_repair">Under Repair</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="status" className="text-xs font-medium text-gray-300">Status</Label>
                                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                <SelectTrigger id="status" className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="retired">Retired</SelectItem>
                                                    <SelectItem value="disposed">Disposed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </section>

                                {/* Step 5: Acquisition */}
                                <section className="border-t border-[#1a2035] pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-orange-400/20 text-[11px] font-bold text-orange-400">
                                            5
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-200">Acquisition</p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Record when the equipment was purchased.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid max-w-md gap-2">
                                        <Label htmlFor="purchase_date" className="text-xs font-medium text-gray-300">Purchase date</Label>
                                        <div className="relative">
                                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
                                            <Input
                                                id="purchase_date"
                                                type="date"
                                                value={data.purchase_date}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('purchase_date', e.target.value)}
                                                className="h-10 border-[#1a2035] bg-[#070b18] pl-10 text-gray-100 scheme-dark focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col-reverse gap-3 border-t border-[#1a2035] bg-[#0a0f1c]/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                                <p className="text-[11px] text-gray-500">
                                    Make sure the property number and item details are correct before saving.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => window.history.back()}
                                        className="text-gray-400 hover:bg-[#111827] hover:text-gray-200"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-ustp-navy text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
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
                                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                                    Live Preview
                                </p>

                                {hasAnyData ? (
                                    <div className="space-y-4">
                                        {/* Icon + Name */}
                                        <div className="flex items-start gap-3">
                                            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl border ${catColor}`}>
                                                <CatIcon className="size-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-gray-200">
                                                    {data.item_name || 'Item name'}
                                                </p>
                                                {data.brand && (
                                                    <p className="mt-0.5 text-xs text-gray-500">
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
                                                    <span className="text-xs text-gray-500">Property No.</span>
                                                    <span className="font-mono text-xs text-gray-300">{data.property_no}</span>
                                                </div>
                                            )}
                                            {data.serial_no && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">Serial No.</span>
                                                    <span className="font-mono text-xs text-gray-300">{data.serial_no}</span>
                                                </div>
                                            )}
                                            {data.location && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">Location</span>
                                                    <span className="flex items-center gap-1 text-xs text-gray-300">
                                                        <MapPin className="size-3 text-gray-500" />
                                                        {data.location}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="h-px bg-white/[0.06]" />

                                        {/* Condition + Status */}
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium ${cv.color}`}>
                                                <CondIcon className="size-3" />
                                                {data.condition === 'under_repair' ? 'Under Repair' : data.condition.charAt(0).toUpperCase() + data.condition.slice(1)}
                                            </div>
                                            <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium capitalize text-emerald-300">
                                                {data.status}
                                            </div>
                                        </div>

                                        {data.purchase_date && (
                                            <>
                                                <div className="h-px bg-white/[0.06]" />
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <CalendarDays className="size-3.5" />
                                                    Purchased {new Date(data.purchase_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-[#1a2035] bg-[#070b18] text-gray-600">
                                            <PackagePlus className="size-5" />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Start filling in the form to see a live preview of the equipment record.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Tips */}
                            <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-xl shadow-black/10">
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                                    Tips
                                </p>
                                <ul className="space-y-2 text-xs text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 size-1 shrink-0 rounded-full bg-ustp-light-blue" />
                                        Use the format <span className="font-mono text-gray-300">USTP-ICT-XX-0001</span> for property numbers.
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
