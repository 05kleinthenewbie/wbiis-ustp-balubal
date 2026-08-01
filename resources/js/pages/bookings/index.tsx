import { Head, Link } from '@inertiajs/react';
import { Calendar, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type BookingItem = {
    id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    booking_status: string;
    user: { name: string };
    facility: { facility_name: string };
};

type Props = {
    bookings: BookingItem[];
    isAdmin: boolean;
};

const statusStyles: Record<string, string> = {
    pending: 'bg-slate-100 text-slate-700',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-slate-100 text-slate-500',
};

export default function BookingsIndex({ bookings, isAdmin }: Props) {
    return (
        <>
            <Head title="Facility Bookings" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Facility Bookings</h1>
                        <p className="text-sm text-muted-foreground">
                            Reserve computer labs and AV rooms.
                        </p>
                    </div>
                    {!isAdmin && (
                        <Button asChild className="bg-ustp-navy text-white hover:bg-ustp-navy-dark">
                            <Link href="/bookings/create">
                                <Plus className="size-4" />
                                New Booking
                            </Link>
                        </Button>
                    )}
                </div>

                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
                        <Calendar className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No bookings yet.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Facility</th>
                                    <th className="px-4 py-3 font-medium">Requested by</th>
                                    <th className="px-4 py-3 font-medium">Date & Time</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="border-b last:border-0">
                                        <td className="px-4 py-3 font-medium">
                                            {booking.facility.facility_name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {booking.user.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(booking.booking_date).toLocaleDateString()}{' '}
                                            · {booking.start_time}–{booking.end_time}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={statusStyles[booking.booking_status] ?? ''}
                                                variant="outline"
                                            >
                                                {booking.booking_status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/bookings/${booking.id}`}
                                                className="text-ustp-navy hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
