import { Head, useForm } from '@inertiajs/react';
import {
    CalendarDays,
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
    Save,
    Banknote,
    User as UserIcon,
    Building2,
    LocateFixed,
    BadgeCheck,
    StickyNote,
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
import { Textarea } from '@/components/ui/textarea';

type UserOption = {
    id: number;
    name: string;
    department: string | null;
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
};

type Props = {
    item: InventoryItemData;
    users: UserOption[];
};

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

const categoryOptions = [
    'Desktop',
    'Laptop',
    'Monitor',
    'Printer',
    'Projector',
    'Network',
    'UPS',
    'Other',
];

const validationOptions = ['Validated', 'For Inspection', 'Pending'];

const conditionVisuals: Record<
    string,
    { icon: React.ElementType; color: string }
> = {
    working: {
        icon: CheckCircle2,
        color: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400',
    },
    defective: {
        icon: AlertTriangle,
        color: 'border-red-400/40 bg-red-400/10 text-red-400',
    },
    under_repair: {
        icon: Wrench,
        color: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
    },
};

const statusConfig: Record<string, string> = {
    active: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-700',
    retired: 'border-slate-300 bg-slate-100 text-slate-600',
    disposed: 'border-red-400/30 bg-red-400/10 text-red-700',
};

const inputClass =
    'h-10 border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20';

const textareaClass =
    'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20';

const selectClass =
    'h-10 w-full border-slate-300 bg-white text-slate-800 focus:ring-1 focus:ring-ustp-gold/30';

const stepClasses: Record<number, string> = {
    1: 'bg-ustp-gold/15 text-ustp-gold',
    2: 'bg-ustp-gold/15 text-ustp-gold',
    3: 'bg-ustp-gold/15 text-ustp-gold',
    4: 'bg-emerald-400/15 text-emerald-400',
    5: 'bg-orange-400/15 text-orange-400',
    6: 'bg-purple-400/15 text-purple-400',
};

function formatCurrency(value: string): string {
    const parsed = parseFloat(value);

    if (Number.isNaN(parsed)) {
        return '';
    }

    return parsed.toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
    });
}

export default function InventoryEdit({ item, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        property_no: item.property_no,
        item_inventory_no: item.item_inventory_no ?? '',
        item_name: item.item_name,
        category: item.category ?? 'Desktop',
        brand: item.brand ?? '',
        model: item.model ?? '',
        serial_no: item.serial_no ?? '',
        specification: item.specification ?? '',
        description: item.description ?? '',
        location: item.location ?? '',
        purchase_date: item.purchase_date ?? '',
        unit_cost: item.unit_cost ?? '',
        purchase_order_no: item.purchase_order_no ?? '',
        end_user: item.end_user ?? '',
        department: item.department ?? '',
        campus: item.campus ?? '',
        building: item.building ?? '',
        room: item.room ?? '',
        specific_location: item.specific_location ?? '',
        condition: item.condition,
        status: item.status,
        validation: item.validation ?? 'Pending',
        inspection_date: item.inspection_date ?? '',
        inspection_remarks: item.inspection_remarks ?? '',
    });

    const departments = Array.from(
        new Set(users.map((u) => u.department).filter(Boolean) as string[]),
    ).sort();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setData(
            'location',
            [data.building, data.room].filter(Boolean).join(' - ') ||
                data.campus ||
                item.location ||
                '',
        );
        put(`/inventory/${item.id}`);
    }

    const category = data.category || getCategoryFromName(data.item_name);
    const CatIcon = categoryIcons[category] ?? Box;
    const catColor =
        categoryColors[category] ??
        'bg-slate-50 text-slate-400 border-slate-200';
    const cv = conditionVisuals[data.condition] ?? conditionVisuals.working;
    const CondIcon = cv.icon;

    return (
        <>
            <Head title="Edit Inventory Item" />

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-6xl space-y-6">
                    <BackButton href={`/inventory/${item.id}`} />

                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div
                                className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${catColor}`}
                            >
                                <CatIcon className="size-5" />
                            </div>

                            <div>
                                <div className="mb-2.5 flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                    <span className="text-[11px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                                        Inventory Management
                                    </span>
                                </div>

                                <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
                                    {data.item_name || 'Edit Equipment'}
                                </h1>

                                <p className="mt-1 font-mono text-xs text-slate-400">
                                    Property No. {item.property_no}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Two-column layout */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Form column */}
                        <form
                            onSubmit={handleSubmit}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2"
                        >
                            <div className="flex flex-col gap-7 p-5 md:p-6">
                                {/* Step 1: Property Information */}
                                <section>
                                    <div className="mb-4 flex items-start gap-3">
                                        <div
                                            className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[1]}`}
                                        >
                                            1
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Property Information
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Identifiers printed on the
                                                physical property label.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="property_no"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Property no.{' '}
                                                <span className="text-red-400">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="property_no"
                                                value={data.property_no}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'property_no',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="USTP-ICT-XX-0001"
                                                className={`${inputClass} font-mono`}
                                            />
                                            {errors.property_no && (
                                                <p className="text-xs text-red-400">
                                                    {errors.property_no}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="item_inventory_no"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Item/Inventory no.
                                            </Label>
                                            <Input
                                                id="item_inventory_no"
                                                value={data.item_inventory_no}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'item_inventory_no',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. 24-1001"
                                                className={`${inputClass} font-mono`}
                                            />
                                            {errors.item_inventory_no && (
                                                <p className="text-xs text-red-400">
                                                    {errors.item_inventory_no}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="item_name"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Property name{' '}
                                                <span className="text-red-400">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="item_name"
                                                value={data.item_name}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'item_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Desktop - Dell OptiPlex 7090"
                                                className={inputClass}
                                            />
                                            {errors.item_name && (
                                                <p className="text-xs text-red-400">
                                                    {errors.item_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="category"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Category
                                            </Label>
                                            <Select
                                                value={data.category}
                                                onValueChange={(value) =>
                                                    setData('category', value)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="category"
                                                    className={selectClass}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-slate-200 bg-white text-slate-800">
                                                    {categoryOptions.map(
                                                        (c) => (
                                                            <SelectItem
                                                                key={c}
                                                                value={c}
                                                            >
                                                                {c}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.category && (
                                                <p className="text-xs text-red-400">
                                                    {errors.category}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Step 2: Specifications */}
                                <section className="border-t border-slate-200 pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div
                                            className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[2]}`}
                                        >
                                            2
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Specifications
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Manufacturer, model, serial and
                                                technical details.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="brand"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Brand
                                            </Label>
                                            <Input
                                                id="brand"
                                                value={data.brand}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'brand',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Dell"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="model"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Model
                                            </Label>
                                            <Input
                                                id="model"
                                                value={data.model}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'model',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="OptiPlex 7090"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="serial_no"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Serial no.
                                            </Label>
                                            <Input
                                                id="serial_no"
                                                value={data.serial_no}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'serial_no',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="SN-123456789"
                                                className={`${inputClass} font-mono`}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="specification"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Specification
                                            </Label>
                                            <Textarea
                                                id="specification"
                                                value={data.specification}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                                ) =>
                                                    setData(
                                                        'specification',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Processor, RAM, storage, etc."
                                                className={`${textareaClass} min-h-20`}
                                            />
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label
                                                htmlFor="description"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                                ) =>
                                                    setData(
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Additional notes about this equipment."
                                                className={`${textareaClass} min-h-20`}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Step 3: Acquisition */}
                                <section className="border-t border-slate-200 pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div
                                            className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[3]}`}
                                        >
                                            3
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Acquisition
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Purchase details and reference
                                                documents.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="purchase_date"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Date acquired
                                            </Label>
                                            <div className="relative">
                                                <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="purchase_date"
                                                    type="date"
                                                    value={data.purchase_date}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>,
                                                    ) =>
                                                        setData(
                                                            'purchase_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`${inputClass} pl-10 scheme-light`}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="unit_cost"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Unit cost (PHP)
                                            </Label>
                                            <div className="relative">
                                                <Banknote className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="unit_cost"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={data.unit_cost}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>,
                                                    ) =>
                                                        setData(
                                                            'unit_cost',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="45000.00"
                                                    className={`${inputClass} pl-10 font-mono`}
                                                />
                                            </div>
                                            {errors.unit_cost && (
                                                <p className="text-xs text-red-400">
                                                    {errors.unit_cost}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label
                                                htmlFor="purchase_order_no"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Reference / Purchase order
                                            </Label>
                                            <Input
                                                id="purchase_order_no"
                                                value={data.purchase_order_no}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'purchase_order_no',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="USTP - Main/F/C/New/PO 0112"
                                                className={`${inputClass} font-mono`}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Step 4: Assignment & Location */}
                                <section className="border-t border-slate-200 pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div
                                            className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[4]}`}
                                        >
                                            4
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Assignment &amp; Location
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Current custodian and where the
                                                equipment is placed.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="end_user"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                End user
                                            </Label>
                                            <div className="relative">
                                                <UserIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="end_user"
                                                    list="edit-end-users"
                                                    value={data.end_user}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>,
                                                    ) =>
                                                        setData(
                                                            'end_user',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Person assigned to the equipment"
                                                    className={`${inputClass} pl-9`}
                                                />
                                                <datalist id="edit-end-users">
                                                    {users.map((u) => (
                                                        <option
                                                            key={u.id}
                                                            value={u.name}
                                                        />
                                                    ))}
                                                </datalist>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="department"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Department
                                            </Label>
                                            <Input
                                                id="department"
                                                list="edit-departments"
                                                value={data.department}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'department',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="College of Engineering"
                                                className={inputClass}
                                            />
                                            <datalist id="edit-departments">
                                                {departments.map((d) => (
                                                    <option key={d} value={d} />
                                                ))}
                                            </datalist>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="campus"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Campus / Location
                                            </Label>
                                            <div className="relative">
                                                <LocateFixed className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="campus"
                                                    list="edit-campuses"
                                                    value={data.campus}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>,
                                                    ) =>
                                                        setData(
                                                            'campus',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Balubal Campus"
                                                    className={`${inputClass} pl-9`}
                                                />
                                                <datalist id="edit-campuses">
                                                    {[
                                                        'Balubal Campus',
                                                        'Main Campus',
                                                    ].map((c) => (
                                                        <option
                                                            key={c}
                                                            value={c}
                                                        />
                                                    ))}
                                                </datalist>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="building"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Building
                                            </Label>
                                            <div className="relative">
                                                <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="building"
                                                    value={data.building}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>,
                                                    ) =>
                                                        setData(
                                                            'building',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="ICT Office"
                                                    className={`${inputClass} pl-9`}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="room"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Room
                                            </Label>
                                            <Input
                                                id="room"
                                                value={data.room}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'room',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Room 101"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="specific_location"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Specific location
                                            </Label>
                                            <Input
                                                id="specific_location"
                                                value={data.specific_location}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'specific_location',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Server rack, cabinet 2"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Step 5: Condition & Status */}
                                <section className="border-t border-slate-200 pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div
                                            className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[5]}`}
                                        >
                                            5
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Condition &amp; Status
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Set the current operational
                                                state of the equipment.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="condition"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Condition
                                            </Label>
                                            <Select
                                                value={data.condition}
                                                onValueChange={(value) =>
                                                    setData('condition', value)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="condition"
                                                    className={selectClass}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-slate-200 bg-white text-slate-800">
                                                    <SelectItem value="working">
                                                        Working
                                                    </SelectItem>
                                                    <SelectItem value="defective">
                                                        Defective
                                                    </SelectItem>
                                                    <SelectItem value="under_repair">
                                                        Under Repair
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="status"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Status
                                            </Label>
                                            <Select
                                                value={data.status}
                                                onValueChange={(value) =>
                                                    setData('status', value)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="status"
                                                    className={selectClass}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-slate-200 bg-white text-slate-800">
                                                    <SelectItem value="active">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="retired">
                                                        Retired
                                                    </SelectItem>
                                                    <SelectItem value="disposed">
                                                        Disposed
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </section>

                                {/* Step 6: Inspection */}
                                <section className="border-t border-slate-200 pt-6">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div
                                            className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stepClasses[6]}`}
                                        >
                                            6
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Inspection
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Verification and inspection
                                                details.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-10 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="validation"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Validation
                                            </Label>
                                            <Select
                                                value={
                                                    data.validation || 'Pending'
                                                }
                                                onValueChange={(value) =>
                                                    setData('validation', value)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="validation"
                                                    className={selectClass}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-slate-200 bg-white text-slate-800">
                                                    {validationOptions.map(
                                                        (v) => (
                                                            <SelectItem
                                                                key={v}
                                                                value={v}
                                                            >
                                                                {v}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="inspection_date"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Inspection date
                                            </Label>
                                            <div className="relative">
                                                <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="inspection_date"
                                                    type="date"
                                                    value={data.inspection_date}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>,
                                                    ) =>
                                                        setData(
                                                            'inspection_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`${inputClass} pl-10 scheme-light`}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label
                                                htmlFor="inspection_remarks"
                                                className="text-xs font-medium text-slate-700"
                                            >
                                                Inspection remarks
                                            </Label>
                                            <Textarea
                                                id="inspection_remarks"
                                                value={data.inspection_remarks}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                                ) =>
                                                    setData(
                                                        'inspection_remarks',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Findings during inspection, verified by..."
                                                className={`${textareaClass} min-h-20`}
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                                <p className="text-[11px] text-slate-400">
                                    Changes are recorded in the audit history.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => window.history.back()}
                                        className="border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-ustp-gold text-ustp-navy shadow-lg shadow-ustp-gold/10 transition-all hover:bg-ustp-gold-dark hover:text-white"
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <Save className="size-4" />
                                        )}
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Current record sidebar */}
                        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-ustp-gold" />
                                    <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                        Current Record
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {/* Icon + Name */}
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`flex size-12 shrink-0 items-center justify-center rounded-xl border ${catColor}`}
                                        >
                                            <CatIcon className="size-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-800">
                                                {data.item_name || 'Item name'}
                                            </p>
                                            {(data.brand || data.model) && (
                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    {data.brand}
                                                    {data.brand && data.model
                                                        ? ' '
                                                        : ''}
                                                    {data.model}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-200" />

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-400">
                                                Property No.
                                            </span>
                                            <span className="font-mono text-xs text-slate-600">
                                                {data.property_no}
                                            </span>
                                        </div>
                                        {data.serial_no && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-400">
                                                    Serial No.
                                                </span>
                                                <span className="font-mono text-xs text-slate-600">
                                                    {data.serial_no}
                                                </span>
                                            </div>
                                        )}
                                        {data.end_user && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-400">
                                                    End user
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-slate-600">
                                                    <UserIcon className="size-3 text-slate-400" />
                                                    {data.end_user}
                                                </span>
                                            </div>
                                        )}
                                        {(data.campus ||
                                            data.building ||
                                            data.room) && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-400">
                                                    Location
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-slate-600">
                                                    <MapPin className="size-3 text-slate-400" />
                                                    {[
                                                        data.campus,
                                                        data.building,
                                                        data.room,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' · ')}
                                                </span>
                                            </div>
                                        )}
                                        {data.unit_cost && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-400">
                                                    Unit cost
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-slate-600">
                                                    <Banknote className="size-3 text-slate-400" />
                                                    {formatCurrency(
                                                        data.unit_cost,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-px bg-slate-200" />

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${cv.color}`}
                                        >
                                            <CondIcon className="size-3" />
                                            {data.condition === 'under_repair'
                                                ? 'Under Repair'
                                                : data.condition}
                                        </span>
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${statusConfig[data.status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                        >
                                            {data.status}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-ustp-gold/25 bg-ustp-gold/10 px-2.5 py-1 text-[11px] font-medium text-ustp-gold">
                                            <BadgeCheck className="size-3" />
                                            {data.validation || 'Pending'}
                                        </span>
                                    </div>

                                    {data.purchase_date && (
                                        <>
                                            <div className="h-px bg-slate-200" />
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <CalendarDays className="size-3.5" />
                                                Acquired{' '}
                                                {new Date(
                                                    data.purchase_date,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </>
                                    )}

                                    {data.inspection_remarks && (
                                        <div className="flex items-start gap-2 text-xs text-slate-400">
                                            <StickyNote className="mt-0.5 size-3.5 shrink-0" />
                                            {data.inspection_remarks}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="mb-3 text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                                    Tips
                                </p>
                                <ul className="space-y-2 text-xs text-slate-500">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 size-1 shrink-0 rounded-full bg-ustp-gold" />
                                        Keep the property number exactly as
                                        printed on the physical label.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 size-1 shrink-0 rounded-full bg-emerald-400" />
                                        Updating condition to defective can
                                        trigger a service request review.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 size-1 shrink-0 rounded-full bg-ustp-gold" />
                                        The QR code on the label always points
                                        to this record.
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
