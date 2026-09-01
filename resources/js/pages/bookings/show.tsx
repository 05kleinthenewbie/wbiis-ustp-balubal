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

            <div className="min-h-full flex-1 bg-[#0f1117] px-4 py-6 text-[#f3f4f6] sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <BackButton href="/bookings" />

                    {/* Header */}
                    <div className="mb-8 mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[#22d3ee] shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#7d8ba3]">
                                    Booking Details
                                </span>
                            </div>

                            <p className="mb-1 text-xs text-[#657187]">
                                Booking #{booking.id}
                            </p>

                            <h1 className="text-3xl font-semibold tracking-tight text-[#f5f7fa]">
                                {booking.facility.facility_name}
                            </h1>
                        </div>

                        <Badge
                            variant="outline"
                            className={`w-fit rounded-md px-3 py-1.5 text-xs font-medium capitalize ${statusStyles[booking.booking_status] ?? 'border-[#394252] bg-[#20242d] text-[#aab3c0]'}`}
                        >
                            {booking.booking_status}
                        </Badge>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                        {/* Main */}
                        <div className="space-y-5">
                            {/* Schedule card */}
                            <div className="overflow-hidden rounded-2xl border border-[#292e3a] bg-[#181b24]">
                                <div className="border-b border-[#292e3a] px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-[#24404a] bg-[#152a31]">
                                            <CalendarDays className="size-4 text-[#22c6df]" />
                                        </div>

                                        <div>
                                            <h2 className="text-sm font-semibold text-[#edf0f4]">
                                                Reservation schedule
                                            </h2>
                                            <p className="mt-0.5 text-xs text-[#69758a]">
                                                Facility reservation information
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid divide-y divide-[#252a35] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                    <div className="p-6">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#657187]">
                                            Date
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <CalendarDays className="size-4 text-[#728096]" />
                                            <p className="text-sm font-medium text-[#dfe4ea]">
                                                {new Date(
                                                    booking.booking_date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#657187]">
                                            Time
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <Clock3 className="size-4 text-[#728096]" />
                                            <p className="text-sm font-medium text-[#dfe4ea]">
                                                {booking.start_time} – {booking.end_time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Requester */}
                            <div className="overflow-hidden rounded-2xl border border-[#292e3a] bg-[#181b24]">
                                <div className="border-b border-[#292e3a] px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-[#303542] bg-[#20242d]">
                                            <UserRound className="size-4 text-[#8d9aae]" />
                                        </div>

                                        <h2 className="text-sm font-semibold text-[#edf0f4]">
                                            Requester information
                                        </h2>
                                    </div>
                                </div>

                                <div className="grid gap-6 p-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#657187]">
                                            Requested by
                                        </p>
                                        <p className="mt-2 text-sm text-[#d6dce4]">
                                            {booking.user.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#657187]">
                                            Department
                                        </p>
                                        <p className="mt-2 text-sm text-[#d6dce4]">
                                            {booking.user.department ?? '—'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#657187]">
                                            Location
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <MapPin className="size-3.5 text-[#68758a]" />
                                            <p className="text-sm text-[#d6dce4]">
                                                {booking.facility.location ?? '—'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#657187]">
                                            Approved by
                                        </p>
                                        <p className="mt-2 text-sm text-[#d6dce4]">
                                            {booking.approver?.name ?? 'Not yet reviewed'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Purpose */}
                            {booking.purpose && (
                                <div className="rounded-2xl border border-[#292e3a] bg-[#181b24] p-6">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#657187]">
                                        Purpose
                                    </p>

                                    <p className="mt-3 text-sm leading-7 text-[#aab4c3]">
                                        {booking.purpose}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Admin review */}
                        {isAdmin && booking.booking_status === 'pending' && (
                            <div className="h-fit overflow-hidden rounded-2xl border border-[#292e3a] bg-[#181b24]">
                                <div className="border-b border-[#292e3a] px-5 py-5">
                                    <p className="text-sm font-semibold text-[#edf0f4]">
                                        Review booking
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-[#69758a]">
                                        Approve or reject this facility reservation.
                                    </p>
                                </div>

                                <div className="space-y-3 p-5">
                                    <Button
                                        disabled={processing}
                                        onClick={() => updateStatus('approved')}
                                        className="h-11 w-full bg-[#22b8cf] font-medium text-[#071116] hover:bg-[#2ac7df]"
                                    >
                                        <CheckCircle2 className="mr-2 size-4" />
                                        Approve booking
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={processing}
                                        onClick={() => updateStatus('rejected')}
                                        className="h-11 w-full border-[#51313a] bg-transparent text-[#fb7185] hover:border-[#713944] hover:bg-[#24191e]"
                                    >
                                        <XCircle className="mr-2 size-4" />
                                        Reject booking
                                    </Button>
                                </div>

                                <div className="border-t border-[#292e3a] bg-[#151820] px-5 py-4">
                                    <p className="text-[11px] leading-5 text-[#606c7f]">
                                        The requester will see the updated booking
                                        status after your decision.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Status summary when not pending */}
                        {(!isAdmin || booking.booking_status !== 'pending') && (
                            <div className="h-fit rounded-2xl border border-[#292e3a] bg-[#181b24] p-5">
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#657187]">
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
                                        <p className="text-sm font-medium capitalize text-[#e1e5ea]">
                                            {booking.booking_status}
                                        </p>
                                        <p className="mt-0.5 text-xs text-[#69758a]">
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
