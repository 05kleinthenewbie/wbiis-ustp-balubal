import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
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

type InventoryItemOption = { id: number; item_name: string; property_no: string };

type Props = {
    inventoryItems: InventoryItemOption[];
};

export default function IncidentsCreate({ inventoryItems }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        incident_type: '',
        item_id: '',
        incident_description: '',
        incident_date: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/incidents');
    }

    return (
        <>
            <Head title="Report Incident" />

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative mx-auto flex max-w-2xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 left-1/4 size-105 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                        <div className="absolute -bottom-40 right-1/4 size-90 rounded-full bg-ustp-gold/[0.015] blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/incidents" />
                    </div>

                    {/* Heading */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                                ICT Incidents
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl border border-[#1a2035] bg-[#0f1723] text-ustp-light-blue">
                                <AlertTriangle className="size-5" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                                    Report an Incident
                                </h1>

                                <p className="mt-1 text-sm text-gray-400">
                                    Report damage, misuse, or safety concerns involving ICT
                                    equipment.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="relative flex flex-col gap-5"
                    >
                        {/* Incident type */}
                        <section className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-200">
                                    Incident type
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Select the type of incident being reported.
                                </p>
                            </div>

                            <Select
                                value={data.incident_type}
                                onValueChange={(value) => setData('incident_type', value)}
                            >
                                <SelectTrigger className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                    <SelectValue placeholder="Select incident type" />
                                </SelectTrigger>

                                <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                    <SelectItem value="Equipment damage">Equipment damage</SelectItem>
                                    <SelectItem value="Unauthorized use">Unauthorized use</SelectItem>
                                    <SelectItem value="Theft or loss">Theft or loss</SelectItem>
                                    <SelectItem value="Safety concern">Safety concern</SelectItem>
                                </SelectContent>
                            </Select>

                            {errors.incident_type && (
                                <p className="mt-2 text-xs text-red-300">{errors.incident_type}</p>
                            )}
                        </section>

                        {/* Equipment */}
                        <section className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-200">
                                    Related equipment{' '}
                                    <span className="text-xs text-gray-500">(optional)</span>
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Link this incident to an inventory item if applicable.
                                </p>
                            </div>

                            <Select
                                value={data.item_id}
                                onValueChange={(value) => setData('item_id', value)}
                            >
                                <SelectTrigger className="h-10 w-full border-[#1a2035] bg-[#070b18] text-gray-300 focus:ring-1 focus:ring-ustp-navy/30">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>

                                <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-100">
                                    {inventoryItems.map((item) => (
                                        <SelectItem key={item.id} value={String(item.id)}>
                                            {item.item_name} ({item.property_no})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </section>

                        {/* Description */}
                        <section className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 md:p-6">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-200">
                                    Description
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Explain what happened, when, and who was involved.
                                </p>
                            </div>

                            <Textarea
                                id="incident_description"
                                rows={5}
                                placeholder="Describe the incident, location, affected equipment, or any relevant details..."
                                value={data.incident_description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setData('incident_description', e.target.value)
                                }
                                className="resize-none border-[#1a2035] bg-[#070b18] text-sm leading-6 text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                            />

                            {errors.incident_description && (
                                <p className="mt-2 text-xs text-red-300">
                                    {errors.incident_description}
                                </p>
                            )}
                        </section>

                        {/* Notice */}
                        <div className="rounded-xl border border-[#1a2035] bg-[#0f1723]/50 p-3 text-xs text-gray-400">
                            After review, ICT admin may assign liability to involved parties. You'll
                            be notified of any resulting action.
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-[#1a2035] bg-[#0f1723] p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
                            <div>
                                <p className="text-xs font-medium text-gray-300">
                                    Ready to submit?
                                </p>

                                <p className="mt-1 text-[11px] text-gray-500">
                                    Ensure all details are accurate before reporting.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-10 bg-ustp-navy px-5 text-sm font-medium text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {processing && <Spinner />}
                                Submit Report
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
