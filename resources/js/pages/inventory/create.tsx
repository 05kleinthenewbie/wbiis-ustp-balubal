import { Head, useForm } from '@inertiajs/react';
import { CalendarDays, PackagePlus } from 'lucide-react';
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

    return (
        <>
            <Head title="Add Inventory Item" />

            <div className="min-h-full flex-1 bg-[#12141A] text-[#F1F3F5]">
                <div className="relative mx-auto flex max-w-3xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient background */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 left-1/3 size-105 rounded-full bg-[#22B8C7]/[0.035] blur-3xl" />
                        <div className="absolute -bottom-40 right-1/4 size-90 rounded-full bg-[#8B6DFF]/2.5 blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/inventory" />
                    </div>

                    {/* Header */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-[#22B8C7] shadow-[0_0_8px_rgba(34,184,199,0.8)]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#626A78]">
                                Inventory Management
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl border border-[#2A2F3B] bg-[#1B1E28] text-[#22B8C7]">
                                <PackagePlus className="size-5" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-[#F1F3F5] md:text-3xl">
                                    Add Equipment
                                </h1>

                                <p className="mt-1 text-sm text-[#7F8795]">
                                    Register new ICT equipment in the
                                    inventory.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="relative overflow-hidden rounded-2xl border border-[#2A2F3B] bg-[#1B1E28] shadow-2xl shadow-black/25"
                    >
                        {/* Form header */}
                        <div className="border-b border-[#2A2F3B] bg-[#171A23]/70 px-5 py-4 md:px-6">
                            <p className="text-xs font-medium text-[#E3E6EA]">
                                Equipment Information
                            </p>

                            <p className="mt-1 text-xs text-[#626A78]">
                                Enter the identifying and operational
                                details of the equipment.
                            </p>
                        </div>

                        <div className="flex flex-col gap-7 p-5 md:p-6">
                            {/* Identification */}
                            <section>
                                <div className="mb-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#737B8A]">
                                        Identification
                                    </p>

                                    <p className="mt-1 text-xs text-[#4F5765]">
                                        Basic information used to identify
                                        this equipment.
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="property_no"
                                            className="text-xs font-medium text-[#B8BFCA]"
                                        >
                                            Property no.
                                        </Label>

                                        <Input
                                            id="property_no"
                                            value={data.property_no}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData(
                                                    'property_no',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="PROP-0001"
                                            className="h-10 border-[#2A2F3B] bg-[#12141A] text-[#F1F3F5] placeholder:text-[#555D6B] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/30"
                                        />

                                        {errors.property_no && (
                                            <p className="text-xs text-red-400">
                                                {errors.property_no}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="item_name"
                                            className="text-xs font-medium text-[#B8BFCA]"
                                        >
                                            Item name
                                        </Label>

                                        <Input
                                            id="item_name"
                                            value={data.item_name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData(
                                                    'item_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Desktop PC"
                                            className="h-10 border-[#2A2F3B] bg-[#12141A] text-[#F1F3F5] placeholder:text-[#555D6B] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/30"
                                        />

                                        {errors.item_name && (
                                            <p className="text-xs text-red-400">
                                                {errors.item_name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Product details */}
                            <section className="border-t border-[#2A2F3B] pt-7">
                                <div className="mb-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#737B8A]">
                                        Product Details
                                    </p>

                                    <p className="mt-1 text-xs text-[#4F5765]">
                                        Manufacturer and model information.
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="brand"
                                            className="text-xs font-medium text-[#B8BFCA]"
                                        >
                                            Brand
                                        </Label>

                                        <Input
                                            id="brand"
                                            value={data.brand}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData(
                                                    'brand',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Dell"
                                            className="h-10 border-[#2A2F3B] bg-[#12141A] text-[#F1F3F5] placeholder:text-[#555D6B] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/30"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="model"
                                            className="text-xs font-medium text-[#B8BFCA]"
                                        >
                                            Model
                                        </Label>

                                        <Input
                                            id="model"
                                            value={data.model}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData(
                                                    'model',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="OptiPlex 7090"
                                            className="h-10 border-[#2A2F3B] bg-[#12141A] text-[#F1F3F5] placeholder:text-[#555D6B] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/30"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Placement */}
                            <section className="border-t border-[#2A2F3B] pt-7">
                                <div className="mb-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#737B8A]">
                                        Asset Details
                                    </p>

                                    <p className="mt-1 text-xs text-[#4F5765]">
                                        Serial information and current
                                        equipment location.
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="serial_no"
                                            className="text-xs font-medium text-[#B8BFCA]"
                                        >
                                            Serial no.
                                        </Label>

                                        <Input
                                            id="serial_no"
                                            value={data.serial_no}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData(
                                                    'serial_no',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="SN-123456789"
                                            className="h-10 border-[#2A2F3B] bg-[#12141A] text-[#F1F3F5] placeholder:text-[#555D6B] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/30"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="location"
                                            className="text-xs font-medium text-[#B8BFCA]"
                                        >
                                            Location
                                        </Label>

                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData(
                                                    'location',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Computer Laboratory"
                                            className="h-10 border-[#2A2F3B] bg-[#12141A] text-[#F1F3F5] placeholder:text-[#555D6B] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/30"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Status */}
                            <section className="border-t border-[#2A2F3B] pt-7">
                                <div className="mb-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#737B8A]">
                                        Status & Condition
                                    </p>

                                    <p className="mt-1 text-xs text-[#4F5765]">
                                        Set the current operational state
                                        of the equipment.
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="condition"
                                            className="text-xs font-medium text-[#B8BFCA]"
                                        >
                                            Condition
                                        </Label>

                                        <Select
                                            value={data.condition}
                                            onValueChange={(value) =>
                                                setData(
                                                    'condition',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="condition"
                                                className="h-10 w-full border-[#2A2F3B] bg-[#12141A] text-[#B8BFCA] shadow-none focus:ring-1 focus:ring-[#22B8C7]/30"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent className="border-[#2A2F3B] bg-[#1B1E28] text-[#F1F3F5]">
                                                <SelectItem value="working">
                                                    Working
                                                </SelectItem>

                                                <SelectItem value="defective">
                                                    Defective
                                                </SelectItem>

                                                <SelectItem value="under_repair">
                                                    Under repair
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="status"
                                            className="text-xs font-medium text-[#B8BFCA]"
                                        >
                                            Status
                                        </Label>

                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData(
                                                    'status',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="status"
                                                className="h-10 w-full border-[#2A2F3B] bg-[#12141A] text-[#B8BFCA] shadow-none focus:ring-1 focus:ring-[#22B8C7]/30"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent className="border-[#2A2F3B] bg-[#1B1E28] text-[#F1F3F5]">
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

                            {/* Purchase */}
                            <section className="border-t border-[#2A2F3B] pt-7">
                                <div className="mb-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#737B8A]">
                                        Acquisition
                                    </p>

                                    <p className="mt-1 text-xs text-[#4F5765]">
                                        Record when the equipment was
                                        purchased.
                                    </p>
                                </div>

                                <div className="grid max-w-md gap-2">
                                    <Label
                                        htmlFor="purchase_date"
                                        className="text-xs font-medium text-[#B8BFCA]"
                                    >
                                        Purchase date
                                    </Label>

                                    <div className="relative">
                                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#626A78]" />

                                        <Input
                                            id="purchase_date"
                                            type="date"
                                            value={data.purchase_date}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData(
                                                    'purchase_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 border-[#2A2F3B] bg-[#12141A] pl-9 text-[#F1F3F5] focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/30"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col-reverse gap-3 border-t border-[#2A2F3B] bg-[#171A23]/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                            <p className="text-[11px] text-[#555D6B]">
                                Make sure the property number and item
                                details are correct before saving.
                            </p>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => window.history.back()}
                                    className="text-[#737B8A] hover:bg-white/4 hover:text-[#F1F3F5]"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#22B8C7] text-[#081014] shadow-[0_0_18px_rgba(34,184,199,0.10)] hover:bg-[#29C4D3] hover:shadow-[0_0_24px_rgba(34,184,199,0.18)]"
                                >
                                    {processing && <Spinner />}
                                    Add Equipment
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
