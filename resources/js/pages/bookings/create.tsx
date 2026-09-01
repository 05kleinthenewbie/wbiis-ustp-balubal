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

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative mx-auto flex max-w-3xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 left-1/4 size-105 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                        <div className="absolute -bottom-40 right-1/4 size-90 rounded-full bg-ustp-gold/[0.015] blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/bookings" />
                    </div>

                    {/* Heading */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                                Facility Management
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl border border-[#1a2035] bg-[#0f1723] text-ustp-light-blue">
                                <CalendarDays className="size-5" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                                    Book a Facility
                                </h1>

                                <p className="mt-1 text-sm text-gray-400">
                                    Choose a facility, schedule, and purpose for your booking
                                    request.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-2xl shadow-black/20">
                            {/* Form header */}
                            <div className="border-b border-[#1a2035] bg-[#0a0f1c]/70 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                        <CalendarDays className="size-4" />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-200">
                                            Booking details
                                        </h2>
                                        <p className="mt-0.5 text-xs text-gray-500">
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
                                        className="text-xs font-medium text-gray-300"
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
                                            className="h-11 border-[#1a2035] bg-[#070b18] text-gray-200 shadow-none hover:border-[#252d44] focus:ring-1 focus:ring-ustp-navy/30"
                                        >
                                            <SelectValue placeholder="Select a facility" />
                                        </SelectTrigger>

                                        <SelectContent className="border-[#1a2035] bg-[#0f1723] text-gray-200">
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
                                        <p className="text-xs text-red-300">
                                            {errors.facility_id}
                                        </p>
                                    )}
                                </div>

                                {/* Date */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="booking_date"
                                        className="text-xs font-medium text-gray-300"
                                    >
                                        Date
                                    </Label>

                                    <div className="relative">
                                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />

                                        <Input
                                            id="booking_date"
                                            type="date"
                                            value={data.booking_date}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData('booking_date', e.target.value)
                                            }
                                            className="h-11 border-[#1a2035] bg-[#070b18] pl-10 text-gray-200 shadow-none scheme-dark placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                        />
                                    </div>

                                    {errors.booking_date && (
                                        <p className="text-xs text-red-300">
                                            {errors.booking_date}
                                        </p>
                                    )}
                                </div>

                                {/* Time */}
                                <div>
                                    <div className="mb-3 flex items-center gap-2">
                                        <Clock3 className="size-3.5 text-ustp-light-blue" />
                                        <span className="text-xs font-medium text-gray-300">
                                            Schedule
                                        </span>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="start_time"
                                                className="text-xs text-gray-400"
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
                                                className="h-11 border-[#1a2035] bg-[#070b18] text-gray-200 shadow-none scheme-dark focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="end_time"
                                                className="text-xs text-gray-400"
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
                                                className="h-11 border-[#1a2035] bg-[#070b18] text-gray-200 shadow-none scheme-dark focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                        </div>
                                    </div>

                                    {errors.start_time && (
                                        <p className="mt-2 text-xs text-red-300">
                                            {errors.start_time}
                                        </p>
                                    )}
                                </div>

                                {/* Purpose */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="purpose"
                                        className="text-xs font-medium text-gray-300"
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
                                        className="resize-none border-[#1a2035] bg-[#070b18] text-gray-200 shadow-none placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                    />

                                    <p className="text-xs text-gray-500">
                                        Include relevant information such as the activity,
                                        class, meeting, or event.
                                    </p>
                                </div>

                                {/* Notice */}
                                <div className="flex gap-3 rounded-xl border border-ustp-gold/20 bg-ustp-gold/[0.03] p-4">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-ustp-gold" />

                                    <div>
                                        <p className="text-xs font-medium text-gray-200">
                                            Approval required
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-gray-400">
                                            Your booking will remain pending until it is
                                            reviewed by an ICT administrator.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-[#1a2035] bg-[#0a0f1c] px-6 py-5 sm:flex-row sm:justify-end">
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
                                    className="bg-ustp-navy px-5 font-medium text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
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
