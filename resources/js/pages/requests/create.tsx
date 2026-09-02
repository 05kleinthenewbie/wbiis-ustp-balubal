import { Head, useForm } from '@inertiajs/react';
import { Check, ClipboardPlus, FileText, AlertCircle, Send } from 'lucide-react';
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
        location: '',
        contact_details: '',
        services: [] as ServiceLine[],
    });

    function toggleService(typeId: number, defaultAction: string | null) {
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

    function updateLine(typeId: number, field: keyof ServiceLine, value: string | number) {
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
    const selectionCount = Object.keys(selected).length;

    return (
        <>
            <Head title="New Service Request" />

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative mx-auto flex max-w-4xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 left-1/4 size-105 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                        <div className="absolute -bottom-40 right-1/4 size-90 rounded-full bg-ustp-gold/[0.015] blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/requests" />
                    </div>

                    {/* Heading */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />
                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                                ICT Services
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-ustp-blue-accent/15 text-ustp-light-blue">
                                <ClipboardPlus className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                                    New Service Request
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">
                                    Select the ICT services you need and provide the relevant details.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
                        {/* Services card */}
                        <section className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-2xl shadow-black/20">
                            <div className="flex flex-col gap-3 border-b border-[#1a2035] bg-[#0a0f1c]/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                                <div className="flex items-center gap-2">
                                    <FileText className="size-4 text-ustp-light-blue" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">
                                            Select services
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            Check a service to provide its specification, quantity, and action.
                                        </p>
                                    </div>
                                </div>
                                {selectionCount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-lg bg-ustp-navy/10 px-2.5 py-1 text-[10px] font-medium text-ustp-light-blue">
                                            {selectionCount} selected
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 md:p-6">
                                <div className="flex flex-col gap-7">
                                    {categories.map((category) => {
                                        const actionOptions = actionOptionsByCategory[category.category_name] ?? [];

                                        return (
                                            <div key={category.id}>
                                                {/* Category heading */}
                                                <div className="mb-3 flex items-center gap-3">
                                                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                                                        {category.category_name}
                                                    </span>
                                                    <div className="h-px flex-1 bg-[#1a2035]" />
                                                </div>

                                                {/* Services */}
                                                <div className="flex flex-col gap-2">
                                                    {category.service_types.map((type) => {
                                                        const isChecked = Boolean(selected[type.id]);

                                                        return (
                                                            <div
                                                                key={type.id}
                                                                className={`rounded-xl border p-3 transition-all ${
                                                                    isChecked
                                                                        ? 'border-ustp-navy/30 bg-ustp-navy/[0.06] shadow-[0_0_20px_rgba(26,24,81,0.06)]'
                                                                        : 'border-[#1a2035] bg-[#070b18] hover:border-[#252d44] hover:bg-[#0a0f1c]'
                                                                }`}
                                                            >
                                                                <div className="flex flex-col gap-3">
                                                                    {/* Service selector */}
                                                                    <div className="flex items-center gap-3">
                                                                        <Checkbox
                                                                            checked={isChecked}
                                                                            onCheckedChange={() => toggleService(type.id, type.default_action)}
                                                                            className="border-gray-600 data-[state=checked]:border-ustp-navy data-[state=checked]:bg-ustp-navy data-[state=checked]:text-white"
                                                                        />
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className={`text-sm font-medium ${isChecked ? 'text-gray-100' : 'text-gray-300'}`}>
                                                                                {type.service_name}
                                                                            </p>
                                                                            {isChecked && (
                                                                                <p className="mt-0.5 text-[10px] text-ustp-light-blue">
                                                                                    Service selected
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        {isChecked && (
                                                                            <div className="flex size-6 items-center justify-center rounded-full bg-ustp-navy/10 text-ustp-light-blue">
                                                                                <Check className="size-3.5" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Selected fields */}
                                                                    {isChecked && (
                                                                        <div className="grid gap-3 border-t border-[#1a2035] pt-3 md:grid-cols-[1fr_100px_180px]">
                                                                            <div className="grid gap-1.5">
                                                                                <Label htmlFor={`specification-${type.id}`} className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                                                                    Specification
                                                                                </Label>
                                                                                <Input
                                                                                    id={`specification-${type.id}`}
                                                                                    placeholder="e.g. Core i5, Windows 11, Room 204"
                                                                                    value={selected[type.id]?.specification ?? ''}
                                                                                    onChange={(e) => updateLine(type.id, 'specification', e.target.value)}
                                                                                    className="h-9 border-[#1a2035] bg-[#070b18] text-xs text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                                                                />
                                                                            </div>
                                                                            <div className="grid gap-1.5">
                                                                                <Label htmlFor={`quantity-${type.id}`} className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                                                                    Quantity
                                                                                </Label>
                                                                                <Input
                                                                                    id={`quantity-${type.id}`}
                                                                                    type="number"
                                                                                    min={1}
                                                                                    value={selected[type.id]?.quantity ?? 1}
                                                                                    onChange={(e) => updateLine(type.id, 'quantity', Number(e.target.value) || 1)}
                                                                                    className="h-9 border-[#1a2035] bg-[#070b18] text-xs text-gray-100 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                                                                />
                                                                            </div>
                                                                            <div className="grid gap-1.5">
                                                                                <Label htmlFor={`action-${type.id}`} className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                                                                    Action
                                                                                </Label>
                                                                                <Select
                                                                                    disabled={!isChecked}
                                                                                    value={selected[type.id]?.action_type ?? ''}
                                                                                    onValueChange={(value) => updateLine(type.id, 'action_type', value)}
                                                                                >
                                                                                    <SelectTrigger
                                                                                        id={`action-${type.id}`}
                                                                                        className="h-9 w-full border-[#1a2035] bg-[#070b18] text-xs text-gray-300 focus:ring-1 focus:ring-ustp-navy/25"
                                                                                    >
                                                                                        <SelectValue placeholder="Select action" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                                                                        {actionOptions.map((action) => (
                                                                                            <SelectItem key={action} value={action}>
                                                                                                {action}
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {errors.services && (
                                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs text-red-300">
                                        <AlertCircle className="size-4" />
                                        {errors.services}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Problem description */}
                        <section className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <AlertCircle className="size-4 text-amber-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-200">
                                        Problem description
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Explain the issue or provide any details that may help the ICT team.
                                    </p>
                                </div>
                            </div>

                            <Textarea
                                id="problem_description"
                                rows={5}
                                placeholder="Describe the problem, affected equipment, or any relevant details..."
                                value={data.problem_description}
                                onChange={(e) => setData('problem_description', e.target.value)}
                                className="resize-none border-[#1a2035] bg-[#070b18] text-sm leading-6 text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                            />

                            {errors.problem_description && (
                                <p className="mt-2 text-xs text-red-300">
                                    {errors.problem_description}
                                </p>
                            )}

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="location" className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                        Location (Optional)
                                    </Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g. Room 204, Building A, 2nd Floor"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="h-9 border-[#1a2035] bg-[#070b18] text-xs text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                    />
                                    {errors.location && (
                                        <p className="text-xs text-red-300">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="contact_details" className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                        Contact Details (Optional)
                                    </Label>
                                    <Input
                                        id="contact_details"
                                        placeholder="e.g. Local 123, 09123456789"
                                        value={data.contact_details}
                                        onChange={(e) => setData('contact_details', e.target.value)}
                                        className="h-9 border-[#1a2035] bg-[#070b18] text-xs text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                    />
                                    {errors.contact_details && (
                                        <p className="text-xs text-red-300">
                                            {errors.contact_details}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Submit */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
                            <div>
                                <p className="text-xs font-medium text-gray-300">
                                    Ready to submit?
                                </p>
                                <p className="mt-1 text-[11px] text-gray-500">
                                    Select at least one service before submitting.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing || !hasSelection}
                                className="h-10 bg-ustp-navy px-5 text-sm font-medium text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {processing ? <Spinner /> : <Send className="size-4" />}
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
