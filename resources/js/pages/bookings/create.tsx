import { Head, useForm } from '@inertiajs/react';
import { CalendarDays, Clock3, MapPin } from 'lucide-react';
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

type Facility = { id: number; facility_name: string; facility_type: string };

type Props = {
    facilities: Facility[];
};

const fieldClass =
    'h-11 border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20';

export default function BookingsCreate({ facilities }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        facility_id: '',
        booking_date: '',
        start_time: '',
        end_time: '',
        purpose: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/bookings');
    }

    return (
        <>
            <Head title="New Booking" />

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-3xl space-y-6">
                    <BackButton href="/bookings" />

                    {/* Heading */}
                    <div className="flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ustp-gold/10 text-ustp-gold">
                            <CalendarDays className="size-5" />
                        </div>

                        <div>
                            <div className="mb-2.5 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                                    Facility Management
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
                                Book a Facility
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                                Choose a facility, schedule, and purpose for
                                your booking request.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Form header */}
                            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <CalendarDays className="size-4 text-ustp-gold" />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-800">
                                            Booking details
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            All fields marked by validation are
                                            required.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-7 p-6">
                                {/* Facility */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="facility_id"
                                        className="text-xs font-medium text-slate-600"
                                    >
                                        Facility
                                    </Label>

                                    <Select
                                        value={data.facility_id}
                                        onValueChange={(value) =>
                                            setData('facility_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="facility_id"
                                            className="h-11 w-full border-slate-300 bg-white text-slate-800 shadow-none hover:border-ustp-gold/40 focus:ring-1 focus:ring-ustp-gold/20"
                                        >
                                            <SelectValue placeholder="Select a facility" />
                                        </SelectTrigger>

                                        <SelectContent className="border-slate-200 bg-white text-slate-800">
                                            {facilities.map((facility) => (
                                                <SelectItem
                                                    key={facility.id}
                                                    value={String(facility.id)}
                                                >
                                                    {facility.facility_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.facility_id && (
                                        <p className="text-xs text-red-600">
                                            {errors.facility_id}
                                        </p>
                                    )}
                                </div>

                                {/* Date */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="booking_date"
                                        className="text-xs font-medium text-slate-600"
                                    >
                                        Date
                                    </Label>

                                    <div className="relative">
                                        <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                                        <Input
                                            id="booking_date"
                                            type="date"
                                            value={data.booking_date}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setData(
                                                    'booking_date',
                                                    e.target.value,
                                                )
                                            }
                                            className={`${fieldClass} pl-10 scheme-light`}
                                        />
                                    </div>

                                    {errors.booking_date && (
                                        <p className="text-xs text-red-600">
                                            {errors.booking_date}
                                        </p>
                                    )}
                                </div>

                                {/* Time */}
                                <div>
                                    <div className="mb-3 flex items-center gap-2">
                                        <Clock3 className="size-3.5 text-ustp-gold" />
                                        <span className="text-xs font-medium text-slate-600">
                                            Schedule
                                        </span>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="start_time"
                                                className="text-xs text-slate-400"
                                            >
                                                Start time
                                            </Label>

                                            <Input
                                                id="start_time"
                                                type="time"
                                                value={data.start_time}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'start_time',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${fieldClass} scheme-light`}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="end_time"
                                                className="text-xs text-slate-400"
                                            >
                                                End time
                                            </Label>

                                            <Input
                                                id="end_time"
                                                type="time"
                                                value={data.end_time}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'end_time',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${fieldClass} scheme-light`}
                                            />
                                        </div>
                                    </div>

                                    {errors.start_time && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {errors.start_time}
                                        </p>
                                    )}
                                </div>

                                {/* Purpose */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="purpose"
                                        className="text-xs font-medium text-slate-600"
                                    >
                                        Purpose
                                    </Label>

                                    <Textarea
                                        id="purpose"
                                        rows={5}
                                        placeholder="Describe why you need this facility..."
                                        value={data.purpose}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>,
                                        ) => setData('purpose', e.target.value)}
                                        className="resize-none border-slate-300 bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                                    />

                                    <p className="text-xs text-slate-400">
                                        Include relevant information such as the
                                        activity, class, meeting, or event.
                                    </p>
                                </div>

                                {/* Notice */}
                                <div className="flex gap-3 rounded-xl border border-ustp-gold/20 bg-ustp-gold/[0.06] p-4">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-ustp-gold" />

                                    <div>
                                        <p className="text-xs font-medium text-slate-800">
                                            Approval required
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-400">
                                            Your booking will remain pending
                                            until it is reviewed by an ICT
                                            administrator.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => window.history.back()}
                                    className="text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-ustp-gold px-5 font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/10 transition-all hover:bg-ustp-gold-dark hover:text-white"
                                >
                                    {processing && <Spinner />}
                                    Request booking
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
