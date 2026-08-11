import { Head, router } from '@inertiajs/react';
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
    pending: 'bg-slate-100 text-slate-700',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-slate-100 text-slate-500',
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

            <div className="mx-auto flex max-w-lg flex-1 flex-col gap-4 p-4">
                <BackButton href="/bookings" />
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Booking #{booking.id}</p>
                        <h1 className="text-xl font-semibold">{booking.facility.facility_name}</h1>
                    </div>
                    <Badge className={statusStyles[booking.booking_status] ?? ''} variant="outline">
                        {booking.booking_status}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground">Requested by</p>
                        <p>{booking.user.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p>{booking.user.department ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p>{new Date(booking.booking_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p>{booking.start_time} – {booking.end_time}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p>{booking.facility.location ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Approved by</p>
                        <p>{booking.approver?.name ?? 'Not yet reviewed'}</p>
                    </div>
                </div>

                {booking.purpose && (
                    <div className="rounded-xl border p-4">
                        <p className="mb-2 text-sm font-medium">Purpose</p>
                        <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                    </div>
                )}

                {isAdmin && booking.booking_status === 'pending' && (
                    <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="mb-3 text-sm font-medium">Review this booking</p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                disabled={processing}
                                onClick={() => updateStatus('rejected')}
                                className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                                Reject
                            </Button>
                            <Button
                                disabled={processing}
                                onClick={() => updateStatus('approved')}
                                className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
