import { Head, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarDays,
    Check,
    Circle,
    Monitor,
    Package,
    Send,
    ShieldAlert,
    UserMinus,
} from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

type InventoryItemOption = {
    id: number;
    item_name: string;
    property_no: string;
};

type Props = {
    inventoryItems: InventoryItemOption[];
};

const fieldClass =
    'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20';

const incidentTypes = [
    {
        value: 'Equipment damage',
        icon: Monitor,
        hint: 'Broken or damaged ICT equipment',
    },
    {
        value: 'Unauthorized use',
        icon: UserMinus,
        hint: 'Used without permission',
    },
    {
        value: 'Theft or loss',
        icon: Package,
        hint: 'Missing or lost equipment',
    },
    {
        value: 'Safety concern',
        icon: ShieldAlert,
        hint: 'Hazards around ICT gear',
    },
];

const NONE_VALUE = '__none__';

export default function IncidentsCreate({ inventoryItems }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        incident_type: '',
        item_id: '',
        incident_description: '',
        incident_date: '',
    });

    const descriptionLength = data.incident_description.trim().length;
    const canSubmit = data.incident_type !== '' && descriptionLength > 0;

    const checklist = [
        { label: 'Incident type selected', done: data.incident_type !== '' },
        {
            label: 'Description provided',
            done: descriptionLength > 0,
        },
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/incidents');
    }

    return (
        <>
            <Head title="Report Laboratory Incident" />

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-3xl space-y-6">
                    <div className="flex justify-end">
                        <BackButton href="/incidents" />
                    </div>

                    {/* Heading */}
                    <div className="flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ustp-gold/10 text-ustp-gold">
                            <AlertTriangle className="size-5" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
                                Report a Laboratory Incident
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                                Report damage, misuse, or safety concerns
                                involving laboratory ICT equipment.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        {/* Incident type tiles */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <ShieldAlert className="size-4 text-ustp-gold" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Incident type{' '}
                                        <span className="text-red-500">*</span>
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Choose what best describes the incident.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {incidentTypes.map((type) => {
                                    const selected =
                                        data.incident_type === type.value;
                                    const Icon = type.icon;

                                    return (
                                        <button
                                            key={type.value}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() =>
                                                setData(
                                                    'incident_type',
                                                    type.value,
                                                )
                                            }
                                            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                                                selected
                                                    ? 'border-ustp-gold/50 bg-ustp-gold/[0.06] shadow-sm ring-1 ring-ustp-gold/30'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div
                                                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                                                    selected
                                                        ? 'bg-ustp-gold/15 text-ustp-gold'
                                                        : 'bg-slate-100 text-slate-400'
                                                }`}
                                            >
                                                <Icon className="size-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`text-sm font-medium ${selected ? 'text-slate-800' : 'text-slate-600'}`}
                                                >
                                                    {type.value}
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-slate-400">
                                                    {type.hint}
                                                </p>
                                            </div>

                                            <div
                                                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                                                    selected
                                                        ? 'bg-ustp-gold text-white'
                                                        : 'border border-slate-300 text-transparent'
                                                }`}
                                            >
                                                {selected ? (
                                                    <Check className="size-3" />
                                                ) : (
                                                    <Circle className="size-3" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {errors.incident_type && (
                                <p className="mt-3 text-xs text-red-600">
                                    {errors.incident_type}
                                </p>
                            )}
                        </section>

                        {/* Date + equipment */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <CalendarDays className="size-4 text-ustp-gold" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        When &amp; what equipment
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Optional details that help ICT locate
                                        the issue.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <label
                                        htmlFor="incident_date"
                                        className="text-xs font-medium text-slate-600"
                                    >
                                        Date of incident{' '}
                                        <span className="font-normal text-slate-400">
                                            (optional)
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="incident_date"
                                            type="date"
                                            value={data.incident_date}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setData(
                                                    'incident_date',
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-10 pl-10 text-sm scheme-light ${fieldClass} ${errors.incident_date ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200' : ''}`}
                                        />
                                    </div>

                                    {errors.incident_date && (
                                        <p className="text-xs text-red-600">
                                            {errors.incident_date}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="item_id"
                                        className="text-xs font-medium text-slate-600"
                                    >
                                        Related equipment{' '}
                                        <span className="font-normal text-slate-400">
                                            (optional)
                                        </span>
                                    </label>

                                    <Select
                                        value={data.item_id || NONE_VALUE}
                                        onValueChange={(value) =>
                                            setData(
                                                'item_id',
                                                value === NONE_VALUE
                                                    ? ''
                                                    : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="item_id"
                                            className={`h-10 w-full text-sm ${fieldClass} ${errors.item_id ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200' : ''}`}
                                        >
                                            <SelectValue placeholder="Select equipment" />
                                        </SelectTrigger>

                                        <SelectContent className="max-h-64 border-slate-200 bg-white text-slate-800">
                                            <SelectItem value={NONE_VALUE}>
                                                None — no linked equipment
                                            </SelectItem>
                                            {inventoryItems.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={String(item.id)}
                                                >
                                                    {item.item_name} (
                                                    {item.property_no})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.item_id && (
                                        <p className="text-xs text-red-600">
                                            {errors.item_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Description */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <AlertTriangle className="size-4 text-ustp-gold" />
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Description{' '}
                                        <span className="text-red-500">*</span>
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Explain what happened, when, and who was
                                        involved.
                                    </p>
                                </div>

                                <span className="text-[11px] text-slate-400 tabular-nums">
                                    {descriptionLength} chars
                                </span>
                            </div>

                            <Textarea
                                id="incident_description"
                                rows={5}
                                placeholder="Describe the incident, location, affected equipment, or any relevant details..."
                                value={data.incident_description}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) =>
                                    setData(
                                        'incident_description',
                                        e.target.value,
                                    )
                                }
                                className={`resize-none text-sm leading-6 ${fieldClass} ${errors.incident_description ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200' : ''}`}
                            />

                            {errors.incident_description && (
                                <p className="mt-2 text-xs text-red-600">
                                    {errors.incident_description}
                                </p>
                            )}
                        </section>

                        {/* Notice */}
                        <div className="rounded-xl border border-ustp-gold/20 bg-ustp-gold/[0.04] p-3 text-xs leading-5 text-slate-500">
                            After review, ICT admin may assign liability to
                            involved parties. You'll be notified of any
                            resulting action.
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-5">
                            <div className="space-y-1.5">
                                <p className="text-xs font-medium text-slate-800">
                                    Ready to submit?
                                </p>

                                <ul className="space-y-1">
                                    {checklist.map((item) => (
                                        <li
                                            key={item.label}
                                            className="flex items-center gap-1.5 text-[11px]"
                                        >
                                            <span
                                                className={`flex size-3.5 items-center justify-center rounded-full ${
                                                    item.done
                                                        ? 'bg-emerald-100 text-emerald-600'
                                                        : 'bg-slate-100 text-slate-300'
                                                }`}
                                            >
                                                <Check className="size-2.5" />
                                            </span>
                                            <span
                                                className={
                                                    item.done
                                                        ? 'text-slate-500'
                                                        : 'text-slate-400'
                                                }
                                            >
                                                {item.label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing || !canSubmit}
                                className="h-10 bg-ustp-gold px-5 text-sm font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/10 transition-all hover:bg-ustp-gold-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <Send className="size-4" />
                                )}
                                Submit Report
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
