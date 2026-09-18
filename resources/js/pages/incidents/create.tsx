import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, Send, ShieldAlert } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';

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

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-3xl space-y-6">
                    <BackButton href="/incidents" />

                    {/* Heading */}
                    <div className="flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ustp-gold/10 text-ustp-gold">
                            <AlertTriangle className="size-5" />
                        </div>

                        <div>
                            <div className="mb-2.5 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                                    ICT Incidents
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
                                Report an Incident
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                                Report damage, misuse, or safety concerns
                                involving ICT equipment.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        {/* Incident type */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <ShieldAlert className="size-4 text-ustp-gold" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Incident type
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Select the type of incident being
                                        reported.
                                    </p>
                                </div>
                            </div>

                            <Select
                                value={data.incident_type}
                                onValueChange={(value) =>
                                    setData('incident_type', value)
                                }
                            >
                                <SelectTrigger
                                    className={`h-10 w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="Select incident type" />
                                </SelectTrigger>

                                <SelectContent className="border-slate-200 bg-white text-slate-800">
                                    <SelectItem value="Equipment damage">
                                        Equipment damage
                                    </SelectItem>
                                    <SelectItem value="Unauthorized use">
                                        Unauthorized use
                                    </SelectItem>
                                    <SelectItem value="Theft or loss">
                                        Theft or loss
                                    </SelectItem>
                                    <SelectItem value="Safety concern">
                                        Safety concern
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {errors.incident_type && (
                                <p className="mt-2 text-xs text-red-600">
                                    {errors.incident_type}
                                </p>
                            )}
                        </section>

                        {/* Equipment */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <AlertTriangle className="size-4 text-ustp-gold" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Related equipment{' '}
                                        <span className="text-[11px] font-normal text-slate-400">
                                            (optional)
                                        </span>
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Link this incident to an inventory item
                                        if applicable.
                                    </p>
                                </div>
                            </div>

                            <Select
                                value={data.item_id}
                                onValueChange={(value) =>
                                    setData('item_id', value)
                                }
                            >
                                <SelectTrigger
                                    className={`h-10 w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>

                                <SelectContent className="border-slate-200 bg-white text-slate-800">
                                    {inventoryItems.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={String(item.id)}
                                        >
                                            {item.item_name} ({item.property_no}
                                            )
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </section>

                        {/* Description */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                    <AlertTriangle className="size-4 text-ustp-gold" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Description
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Explain what happened, when, and who was
                                        involved.
                                    </p>
                                </div>
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
                                className={`resize-none text-sm leading-6 ${fieldClass}`}
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
                            <div>
                                <p className="text-xs font-medium text-slate-800">
                                    Ready to submit?
                                </p>

                                <p className="mt-1 text-[11px] text-slate-400">
                                    Ensure all details are accurate before
                                    reporting.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
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
