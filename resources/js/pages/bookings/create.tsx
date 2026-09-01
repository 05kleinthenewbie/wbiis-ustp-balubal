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

            <div className="min-h-full flex-1 bg-[#0f1117] px-4 py-6 text-[#f3f4f6] sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <BackButton href="/bookings" />

                    <div className="mb-8 mt-5">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#22d3ee] shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#7d8ba3]">
                                Facility Management
                            </span>
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-[#f5f7fa]">
                            Book a facility
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#7f8ba0]">
                            Choose a facility, schedule, and purpose for your booking
                            request.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="overflow-hidden rounded-2xl border border-[#292e3a] bg-[#181b24] shadow-2xl shadow-black/10">
                            {/* Form header */}
                            <div className="border-b border-[#292e3a] px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg border border-[#24404a] bg-[#152a31]">
                                        <CalendarDays className="size-4 text-[#22c6df]" />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-[#edf0f4]">
                                            Booking details
                                        </h2>
                                        <p className="mt-0.5 text-xs text-[#69758a]">
                                            All fields marked by validation are required.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-7 p-6">
                                {/* Facility */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="facility_id"
                                        className="text-xs font-medium text-[#aeb8c7]"
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
                                            className="h-11 border-[#303744] bg-[#12151c] text-[#e7ebf0] shadow-none hover:border-[#455162] focus:ring-[#22b8cf]/30"
                                        >
                                            <SelectValue placeholder="Select a facility" />
                                        </SelectTrigger>

                                        <SelectContent className="border-[#303744] bg-[#181b24] text-[#e7ebf0]">
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
                                        <p className="text-xs text-rose-400">
                                            {errors.facility_id}
                                        </p>
                                    )}
                                </div>

                                {/* Date */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="booking_date"
                                        className="text-xs font-medium text-[#aeb8c7]"
                                    >
                                        Date
                                    </Label>

                                    <div className="relative">
                                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#68758a]" />

                                        <Input
                                            id="booking_date"
                                            type="date"
                                            value={data.booking_date}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData('booking_date', e.target.value)
                                            }
                                            className="h-11 border-[#303744] bg-[#12151c] pl-10 text-[#e7ebf0] shadow-none scheme-dark placeholder:text-[#5e6879] focus-visible:ring-[#22b8cf]/30"
                                        />
                                    </div>

                                    {errors.booking_date && (
                                        <p className="text-xs text-rose-400">
                                            {errors.booking_date}
                                        </p>
                                    )}
                                </div>

                                {/* Time */}
                                <div>
                                    <div className="mb-3 flex items-center gap-2">
                                        <Clock3 className="size-3.5 text-[#22c6df]" />
                                        <span className="text-xs font-medium text-[#aeb8c7]">
                                            Schedule
                                        </span>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="start_time"
                                                className="text-xs text-[#727f93]"
                                            >
                                                Start time
                                            </Label>

                                            <Input
                                                id="start_time"
                                                type="time"
                                                value={data.start_time}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setData('start_time', e.target.value)
                                                }
                                                className="h-11 border-[#303744] bg-[#12151c] text-[#e7ebf0] shadow-none scheme-dark focus-visible:ring-[#22b8cf]/30"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="end_time"
                                                className="text-xs text-[#727f93]"
                                            >
                                                End time
                                            </Label>

                                            <Input
                                                id="end_time"
                                                type="time"
                                                value={data.end_time}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setData('end_time', e.target.value)
                                                }
                                                className="h-11 border-[#303744] bg-[#12151c] text-[#e7ebf0] shadow-none scheme-dark focus-visible:ring-[#22b8cf]/30"
                                            />
                                        </div>
                                    </div>

                                    {errors.start_time && (
                                        <p className="mt-2 text-xs text-rose-400">
                                            {errors.start_time}
                                        </p>
                                    )}
                                </div>

                                {/* Purpose */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="purpose"
                                        className="text-xs font-medium text-[#aeb8c7]"
                                    >
                                        Purpose
                                    </Label>

                                    <Textarea
                                        id="purpose"
                                        rows={5}
                                        placeholder="Describe why you need this facility..."
                                        value={data.purpose}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setData('purpose', e.target.value)
                                        }
                                        className="resize-none border-[#303744] bg-[#12151c] text-[#e7ebf0] shadow-none placeholder:text-[#5e6879] focus-visible:ring-[#22b8cf]/30"
                                    />

                                    <p className="text-xs text-[#5f6b7e]">
                                        Include relevant information such as the activity,
                                        class, meeting, or event.
                                    </p>
                                </div>

                                {/* Notice */}
                                <div className="flex gap-3 rounded-xl border border-[#3b3440] bg-[#1b1a21] p-4">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#fac775]" />

                                    <div>
                                        <p className="text-xs font-medium text-[#d8dce3]">
                                            Approval required
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-[#737e90]">
                                            Your booking will remain pending until it is
                                            reviewed by an ICT administrator.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-[#292e3a] bg-[#151820] px-6 py-5 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => window.history.back()}
                                    className="text-[#8994a6] hover:bg-[#20242d] hover:text-[#e5e9ee]"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#22b8cf] px-5 font-medium text-[#071116] shadow-[0_0_18px_rgba(34,184,207,0.12)] hover:bg-[#2ac7df]"
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
