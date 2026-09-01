import { Head, router } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    UserRound,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { BackButton } from '@/components/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type BookingDetail = {
    id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    purpose: string | null;
    booking_status: string;
    user: { name: string; department: string | null };
    facility: { facility_name: string; location: string | null };
    approver: { name: string } | null;
};

type Props = {
    booking: BookingDetail;
    isAdmin: boolean;
};

const statusStyles: Record<string, string> = {
    pending:
        'border-amber-400/30 bg-amber-400/10 text-amber-300',
    approved:
        'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    rejected:
        'border-rose-400/30 bg-rose-400/10 text-rose-300',
    cancelled:
        'border-slate-500/30 bg-slate-500/10 text-slate-400',
};

export default function BookingsShow({ booking, isAdmin }: Props) {
    const [processing, setProcessing] = useState(false);

    function updateStatus(status: string) {
        setProcessing(true);

        router.put(
            `/bookings/${booking.id}`,
            { booking_status: status },
            { onFinish: () => setProcessing(false) },
        );
    }

    return (
        <>
            <Head title={`Booking #${booking.id}`} />

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative mx-auto flex max-w-4xl flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-100 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                    </div>

                    <div className="relative">
                        <BackButton href="/bookings" />
                    </div>

                    {/* Header */}
                    <div className="relative rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 shadow-2xl shadow-black/20 md:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#1a2035] bg-[#070b18] text-ustp-light-blue">
                                    <CalendarDays className="size-5" />
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-gray-500">
                                            BOOKING #{booking.id}
                                        </span>

                                        <span className="size-1 rounded-full bg-gray-600" />

                                        <span className="text-[10px] uppercase tracking-wider text-gray-500">
                                            Facility Reservation
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-semibold tracking-tight text-gray-50 md:text-2xl">
                                        {booking.facility.facility_name}
                                    </h1>

                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Requested by {booking.user.name}
                                    </p>
                                </div>
                            </div>

                            <Badge
                                variant="outline"
                                className={`w-fit rounded-md px-3 py-1 text-[10px] font-medium capitalize ${statusStyles[booking.booking_status] ?? 'border-[#1a2035] bg-[#070b18] text-gray-400'}`}
                            >
                                {booking.booking_status}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                        {/* Main */}
                        <div className="space-y-5">
                            {/* Schedule card */}
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723]">
                                <div className="border-b border-[#1a2035] px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                            <CalendarDays className="size-4" />
                                        </div>

                                        <div>
                                            <h2 className="text-sm font-semibold text-gray-200">
                                                Reservation schedule
                                            </h2>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Facility reservation information
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid divide-y divide-[#151c2c] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                    <div className="p-6">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                            Date
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <CalendarDays className="size-4 text-gray-500" />
                                            <p className="text-sm font-medium text-gray-200">
                                                {new Date(
                                                    booking.booking_date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                            Time
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <Clock3 className="size-4 text-gray-500" />
                                            <p className="text-sm font-medium text-gray-200">
                                                {booking.start_time} – {booking.end_time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Requester */}
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723]">
                                <div className="border-b border-[#1a2035] px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                            <UserRound className="size-4" />
                                        </div>

                                        <h2 className="text-sm font-semibold text-gray-200">
                                            Requester information
                                        </h2>
                                    </div>
                                </div>

                                <div className="grid gap-6 p-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                            Requested by
                                        </p>
                                        <p className="mt-2 text-sm text-gray-300">
                                            {booking.user.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                            Department
                                        </p>
                                        <p className="mt-2 text-sm text-gray-300">
                                            {booking.user.department ?? '—'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                            Location
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <MapPin className="size-3.5 text-gray-500" />
                                            <p className="text-sm text-gray-300">
                                                {booking.facility.location ?? '—'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                            Approved by
                                        </p>
                                        <p className="mt-2 text-sm text-gray-300">
                                            {booking.approver?.name ?? 'Not yet reviewed'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Purpose */}
                            {booking.purpose && (
                                <div className="rounded-2xl border border-[#1a2035] bg-[#0f1723] p-6">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                        Purpose
                                    </p>

                                    <p className="mt-3 text-sm leading-7 text-gray-300">
                                        {booking.purpose}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Admin review */}
                        {isAdmin && booking.booking_status === 'pending' && (
                            <div className="h-fit overflow-hidden rounded-2xl border border-ustp-navy/20 bg-[#0f1723]">
                                <div className="border-b border-[#1a2035] bg-ustp-navy/[0.04] px-5 py-5">
                                    <p className="text-sm font-semibold text-gray-200">
                                        Review booking
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Approve or reject this facility reservation.
                                    </p>
                                </div>

                                <div className="space-y-3 p-5">
                                    <Button
                                        disabled={processing}
                                        onClick={() => updateStatus('approved')}
                                        className="h-11 w-full bg-ustp-navy font-medium text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                                    >
                                        <CheckCircle2 className="mr-2 size-4" />
                                        Approve booking
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={processing}
                                        onClick={() => updateStatus('rejected')}
                                        className="h-11 w-full border-rose-400/25 bg-transparent text-rose-300 hover:border-rose-400/40 hover:bg-rose-400/10"
                                    >
                                        <XCircle className="mr-2 size-4" />
                                        Reject booking
                                    </Button>
                                </div>

                                <div className="border-t border-[#1a2035] bg-[#0a0f1c] px-5 py-4">
                                    <p className="text-[11px] leading-5 text-gray-500">
                                        The requester will see the updated booking
                                        status after your decision.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Status summary when not pending */}
                        {(!isAdmin || booking.booking_status !== 'pending') && (
                            <div className="h-fit rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5">
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                    Booking status
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    {booking.booking_status === 'approved' ? (
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10">
                                            <CheckCircle2 className="size-4 text-emerald-300" />
                                        </div>
                                    ) : booking.booking_status === 'rejected' ? (
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-rose-400/20 bg-rose-400/10">
                                            <XCircle className="size-4 text-rose-300" />
                                        </div>
                                    ) : (
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10">
                                            <Clock3 className="size-4 text-amber-300" />
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-medium capitalize text-gray-200">
                                            {booking.booking_status}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {booking.approver?.name
                                                ? `Reviewed by ${booking.approver.name}`
                                                : 'Awaiting review'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
