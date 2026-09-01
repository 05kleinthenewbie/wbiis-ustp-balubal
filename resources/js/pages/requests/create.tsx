import { Head, useForm } from '@inertiajs/react';
import { Check, ClipboardPlus } from 'lucide-react';
import { useState } from 'react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

type ServiceTypeItem = {
    id: number;
    service_name: string;
    default_action: string | null;
};

type ServiceCategoryItem = {
    id: number;
    category_name: string;
    service_types: ServiceTypeItem[];
};

type Props = {
    categories: ServiceCategoryItem[];
};

type ServiceLine = {
    service_type_id: number;
    specification: string;
    quantity: number;
    action_type: string;
};

const actionOptionsByCategory: Record<string, string[]> = {
    'Network Services': ['New Connection', 'Troubleshoot'],
    'Hardware Services': ['Installation', 'Troubleshoot', 'Update'],
    'Software Services': ['Installation', 'Troubleshoot', 'Update'],
    'Information System Services': ['Create New', 'Troubleshoot', 'Update'],
};

export default function RequestsCreate({ categories }: Props) {
    const [selected, setSelected] = useState<Record<number, ServiceLine>>({});

    const { data, setData, post, processing, errors } = useForm({
        problem_description: '',
        services: [] as ServiceLine[],
    });

    function toggleService(
        typeId: number,
        defaultAction: string | null,
    ) {
        setSelected((prev) => {
            const next = { ...prev };

            if (next[typeId]) {
                delete next[typeId];
            } else {
                next[typeId] = {
                    service_type_id: typeId,
                    specification: '',
                    quantity: 1,
                    action_type: defaultAction ?? '',
                };
            }

            return next;
        });
    }

    function updateLine(
        typeId: number,
        field: keyof ServiceLine,
        value: string | number,
    ) {
        setSelected((prev) => ({
            ...prev,
            [typeId]: {
                ...prev[typeId],
                [field]: value,
            },
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setData('services', Object.values(selected));

        post('/requests', {
            onSuccess: () => setSelected({}),
        });
    }

    const hasSelection = Object.keys(selected).length > 0;

    return (
        <>
            <Head title="New Service Request" />

            <div className="min-h-full flex-1 bg-[#12141A] text-[#F1F3F5]">
                <div className="relative mx-auto flex max-w-4xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 left-1/4 size-105 rounded-full bg-[#22B8C7]/[0.035] blur-3xl" />
                        <div className="absolute -bottom-40 right-1/4 size-90 rounded-full bg-[#8B6DFF]/2.5 blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/requests" />
                    </div>

                    {/* Heading */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-[#22B8C7] shadow-[0_0_8px_rgba(34,184,199,0.8)]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#626A78]">
                                ICT Services
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl border border-[#2A2F3B] bg-[#1B1E28] text-[#22B8C7]">
                                <ClipboardPlus className="size-5" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-[#F1F3F5] md:text-3xl">
                                    New Service Request
                                </h1>

                                <p className="mt-1 text-sm text-[#7F8795]">
                                    Select the ICT services you need and provide
                                    the relevant details.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="relative flex flex-col gap-5"
                    >
                        {/* Services card */}
                        <section className="overflow-hidden rounded-2xl border border-[#2A2F3B] bg-[#1B1E28] shadow-2xl shadow-black/20">
                            <div className="flex flex-col gap-3 border-b border-[#2A2F3B] bg-[#171A23]/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                                <div>
                                    <p className="text-sm font-medium text-[#E3E6EA]">
                                        Select services
                                    </p>

                                    <p className="mt-1 text-xs text-[#626A78]">
                                        Check a service to provide its
                                        specification, quantity, and action.
                                    </p>
                                </div>

                                <div className="rounded-md border border-[#2A2F3B] bg-[#12141A] px-2.5 py-1 text-[10px] text-[#737B8A]">
                                    {Object.keys(selected).length} selected
                                </div>
                            </div>

                            <div className="p-4 md:p-6">
                                <div className="flex flex-col gap-7">
                                    {categories.map((category) => {
                                        const actionOptions =
                                            actionOptionsByCategory[
                                                category.category_name
                                            ] ?? [];

                                        return (
                                            <div key={category.id}>
                                                {/* Category heading */}
                                                <div className="mb-3 flex items-center gap-3">
                                                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737B8A]">
                                                        {
                                                            category.category_name
                                                        }
                                                    </span>

                                                    <div className="h-px flex-1 bg-[#2A2F3B]" />
                                                </div>

                                                {/* Services */}
                                                <div className="flex flex-col gap-2">
                                                    {category.service_types.map(
                                                        (type) => {
                                                            const isChecked =
                                                                Boolean(
                                                                    selected[
                                                                        type.id
                                                                    ],
                                                                );

                                                            return (
                                                                <div
                                                                    key={
                                                                        type.id
                                                                    }
                                                                    className={`rounded-xl border p-3 transition-all ${
                                                                        isChecked
                                                                            ? 'border-[#22B8C7]/30 bg-[#22B8C7]/4.5 shadow-[0_0_20px_rgba(34,184,199,0.035)]'
                                                                            : 'border-[#2A2F3B] bg-[#12141A] hover:border-[#3A414E] hover:bg-[#171A23]'
                                                                    }`}
                                                                >
                                                                    <div className="flex flex-col gap-3">
                                                                        {/* Service selector */}
                                                                        <div className="flex items-center gap-3">
                                                                            <Checkbox
                                                                                checked={
                                                                                    isChecked
                                                                                }
                                                                                onCheckedChange={() =>
                                                                                    toggleService(
                                                                                        type.id,
                                                                                        type.default_action,
                                                                                    )
                                                                                }
                                                                                className="border-[#4A5260] data-[state=checked]:border-[#22B8C7] data-[state=checked]:bg-[#22B8C7] data-[state=checked]:text-[#081014]"
                                                                            />

                                                                            <div className="min-w-0 flex-1">
                                                                                <p
                                                                                    className={`text-sm font-medium ${
                                                                                        isChecked
                                                                                            ? 'text-[#EAFBFD]'
                                                                                            : 'text-[#B8BFCA]'
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        type.service_name
                                                                                    }
                                                                                </p>

                                                                                {isChecked && (
                                                                                    <p className="mt-0.5 text-[10px] text-[#50D1DD]">
                                                                                        Service
                                                                                        selected
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {isChecked && (
                                                                                <div className="flex size-6 items-center justify-center rounded-full bg-[#22B8C7]/10 text-[#50D1DD]">
                                                                                    <Check className="size-3.5" />
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Selected fields */}
                                                                        {isChecked && (
                                                                            <div className="grid gap-3 border-t border-[#2A2F3B] pt-3 md:grid-cols-[1fr_100px_180px]">
                                                                                <div className="grid gap-1.5">
                                                                                    <Label
                                                                                        htmlFor={`specification-${type.id}`}
                                                                                        className="text-[10px] font-medium uppercase tracking-wider text-[#626A78]"
                                                                                    >
                                                                                        Specification
                                                                                    </Label>

                                                                                    <Input
                                                                                        id={`specification-${type.id}`}
                                                                                        placeholder="e.g. Core i5, Windows 11, Room 204"
                                                                                        value={
                                                                                            selected[
                                                                                                type
                                                                                                    .id
                                                                                            ]
                                                                                                ?.specification ??
                                                                                            ''
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            updateLine(
                                                                                                type.id,
                                                                                                'specification',
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            )
                                                                                        }
                                                                                        className="h-9 border-[#2A2F3B] bg-[#12141A] text-xs text-[#F1F3F5] placeholder:text-[#4F5765] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/25"
                                                                                    />
                                                                                </div>

                                                                                <div className="grid gap-1.5">
                                                                                    <Label
                                                                                        htmlFor={`quantity-${type.id}`}
                                                                                        className="text-[10px] font-medium uppercase tracking-wider text-[#626A78]"
                                                                                    >
                                                                                        Quantity
                                                                                    </Label>

                                                                                    <Input
                                                                                        id={`quantity-${type.id}`}
                                                                                        type="number"
                                                                                        min={
                                                                                            1
                                                                                        }
                                                                                        value={
                                                                                            selected[
                                                                                                type
                                                                                                    .id
                                                                                            ]
                                                                                                ?.quantity ??
                                                                                            1
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            updateLine(
                                                                                                type.id,
                                                                                                'quantity',
                                                                                                Number(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                ) ||
                                                                                                    1,
                                                                                            )
                                                                                        }
                                                                                        className="h-9 border-[#2A2F3B] bg-[#12141A] text-xs text-[#F1F3F5] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/25"
                                                                                    />
                                                                                </div>

                                                                                <div className="grid gap-1.5">
                                                                                    <Label
                                                                                        htmlFor={`action-${type.id}`}
                                                                                        className="text-[10px] font-medium uppercase tracking-wider text-[#626A78]"
                                                                                    >
                                                                                        Action
                                                                                    </Label>

                                                                                    <Select
                                                                                        disabled={
                                                                                            !isChecked
                                                                                        }
                                                                                        value={
                                                                                            selected[
                                                                                                type
                                                                                                    .id
                                                                                            ]
                                                                                                ?.action_type ??
                                                                                            ''
                                                                                        }
                                                                                        onValueChange={(
                                                                                            value,
                                                                                        ) =>
                                                                                            updateLine(
                                                                                                type.id,
                                                                                                'action_type',
                                                                                                value,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <SelectTrigger
                                                                                            id={`action-${type.id}`}
                                                                                            className="h-9 w-full border-[#2A2F3B] bg-[#12141A] text-xs text-[#B8BFCA] focus:ring-1 focus:ring-[#22B8C7]/25"
                                                                                        >
                                                                                            <SelectValue placeholder="Select action" />
                                                                                        </SelectTrigger>

                                                                                        <SelectContent className="border-[#2A2F3B] bg-[#1B1E28] text-[#F1F3F5]">
                                                                                            {actionOptions.map(
                                                                                                (
                                                                                                    action,
                                                                                                ) => (
                                                                                                    <SelectItem
                                                                                                        key={
                                                                                                            action
                                                                                                        }
                                                                                                        value={
                                                                                                            action
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            action
                                                                                                        }
                                                                                                    </SelectItem>
                                                                                                ),
                                                                                            )}
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {errors.services && (
                                    <p className="mt-4 rounded-lg border border-[#E45B68]/20 bg-[#E45B68]/5 px-3 py-2 text-xs text-[#F27B86]">
                                        {errors.services}
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* Problem description */}
                        <section className="rounded-2xl border border-[#2A2F3B] bg-[#1B1E28] p-5 md:p-6">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-[#E3E6EA]">
                                    Problem description
                                </p>

                                <p className="mt-1 text-xs text-[#626A78]">
                                    Explain the issue or provide any details
                                    that may help the ICT team.
                                </p>
                            </div>

                            <Textarea
                                id="problem_description"
                                rows={5}
                                placeholder="Describe the problem, location, affected equipment, or any relevant details..."
                                value={data.problem_description}
                                onChange={(e) =>
                                    setData(
                                        'problem_description',
                                        e.target.value,
                                    )
                                }
                                className="resize-none border-[#2A2F3B] bg-[#12141A] text-sm leading-6 text-[#F1F3F5] placeholder:text-[#555D6B] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/25"
                            />

                            {errors.problem_description && (
                                <p className="mt-2 text-xs text-[#F27B86]">
                                    {errors.problem_description}
                                </p>
                            )}
                        </section>

                        {/* Submit */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-[#2A2F3B] bg-[#1B1E28] p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
                            <div>
                                <p className="text-xs font-medium text-[#B8BFCA]">
                                    Ready to submit?
                                </p>

                                <p className="mt-1 text-[11px] text-[#555D6B]">
                                    Select at least one service before
                                    submitting.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing || !hasSelection}
                                className="h-10 bg-[#22B8C7] px-5 text-sm font-medium text-[#081014] shadow-[0_0_18px_rgba(34,184,199,0.10)] hover:bg-[#29C4D3] hover:shadow-[0_0_24px_rgba(34,184,199,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {processing && <Spinner />}
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
