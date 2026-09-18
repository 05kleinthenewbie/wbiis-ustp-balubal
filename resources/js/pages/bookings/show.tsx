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
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    rejected: 'border-rose-200 bg-rose-50 text-rose-600',
    cancelled: 'border-slate-200 bg-slate-50 text-slate-600',
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

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-4xl space-y-6">
                    <BackButton href="/bookings" />

                    {/* Header */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ustp-gold/10 text-ustp-gold">
                                    <CalendarDays className="size-5" />
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-slate-400">
                                            BOOKING #{booking.id}
                                        </span>

                                        <span className="size-1 rounded-full bg-slate-300" />

                                        <span className="text-[10px] tracking-wider text-slate-400 uppercase">
                                            Facility Reservation
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-semibold tracking-tight text-slate-800 md:text-2xl">
                                        {booking.facility.facility_name}
                                    </h1>

                                    <p className="mt-1.5 text-xs text-slate-400">
                                        Requested by {booking.user.name}
                                    </p>
                                </div>
                            </div>

                            <Badge
                                variant="outline"
                                className={`w-fit rounded-lg px-3 py-1 text-[10px] font-medium capitalize ${statusStyles[booking.booking_status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                            >
                                {booking.booking_status}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                        {/* Main */}
                        <div className="space-y-5">
                            {/* Schedule card */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <CalendarDays className="size-4 text-ustp-gold" />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-800">
                                            Reservation schedule
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            Facility reservation information
                                        </p>
                                    </div>
                                </div>

                                <div className="grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                    <div className="p-6">
                                        <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                            Date
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <CalendarDays className="size-4 text-ustp-gold" />
                                            <p className="text-sm font-medium text-slate-800">
                                                {new Date(
                                                    booking.booking_date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                            Time
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <Clock3 className="size-4 text-ustp-gold" />
                                            <p className="text-sm font-medium text-slate-800">
                                                {booking.start_time} –{' '}
                                                {booking.end_time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Requester */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <UserRound className="size-4 text-ustp-gold" />
                                    </div>

                                    <h2 className="text-sm font-semibold text-slate-800">
                                        Requester information
                                    </h2>
                                </div>

                                <div className="grid gap-6 p-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                            Requested by
                                        </p>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {booking.user.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                            Department
                                        </p>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {booking.user.department ?? '—'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                            Location
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <MapPin className="size-3.5 text-ustp-gold" />
                                            <p className="text-sm text-slate-600">
                                                {booking.facility.location ??
                                                    '—'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                            Approved by
                                        </p>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {booking.approver?.name ??
                                                'Not yet reviewed'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Purpose */}
                            {booking.purpose && (
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                            <MapPin className="size-4 text-ustp-gold" />
                                        </div>

                                        <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                            Purpose
                                        </p>
                                    </div>

                                    <p className="mt-4 text-sm leading-7 whitespace-pre-wrap text-slate-600">
                                        {booking.purpose}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Admin review */}
                        {isAdmin && booking.booking_status === 'pending' && (
                            <div className="h-fit overflow-hidden rounded-2xl border border-ustp-gold/30 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-200 bg-ustp-gold/[0.04] px-5 py-5">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-ustp-gold/10">
                                        <CheckCircle2 className="size-4 text-ustp-gold" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Review booking
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-400">
                                            Approve or reject this facility
                                            reservation.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 p-5">
                                    <Button
                                        disabled={processing}
                                        onClick={() => updateStatus('approved')}
                                        className="h-11 w-full bg-ustp-gold font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/10 transition-all hover:bg-ustp-gold-dark hover:text-white"
                                    >
                                        <CheckCircle2 className="mr-2 size-4" />
                                        Approve booking
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={processing}
                                        onClick={() => updateStatus('rejected')}
                                        className="h-11 w-full border-rose-200 bg-transparent text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                                    >
                                        <XCircle className="mr-2 size-4" />
                                        Reject booking
                                    </Button>
                                </div>

                                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
                                    <p className="text-[11px] leading-5 text-slate-400">
                                        The requester will see the updated
                                        booking status after your decision.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Status summary when not pending */}
                        {(!isAdmin || booking.booking_status !== 'pending') && (
                            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                                    Booking status
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    {booking.booking_status === 'approved' ? (
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50">
                                            <CheckCircle2 className="size-4 text-emerald-700" />
                                        </div>
                                    ) : booking.booking_status ===
                                      'rejected' ? (
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50">
                                            <XCircle className="size-4 text-rose-600" />
                                        </div>
                                    ) : (
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50">
                                            <Clock3 className="size-4 text-amber-700" />
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-medium text-slate-800 capitalize">
                                            {booking.booking_status}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400">
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
