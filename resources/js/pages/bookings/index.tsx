import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Calendar, ChevronRight, Plus } from 'lucide-react';
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
    pending:
        'border-amber-400/30 bg-amber-400/10 text-amber-300',
    approved:
        'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    rejected:
        'border-rose-400/30 bg-rose-400/10 text-rose-300',
    cancelled:
        'border-slate-500/30 bg-slate-500/10 text-slate-400',
};

export default function BookingsIndex({ bookings, isAdmin }: Props) {
    return (
        <>
            <Head title="Facility Bookings" />

            <div className="min-h-full flex-1 bg-[#0f1117] px-4 py-6 text-[#f3f4f6] sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[#22d3ee] shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#7d8ba3]">
                                    Facility Management
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-[#f5f7fa]">
                                Facility Bookings
                            </h1>

                            <p className="mt-2 text-sm text-[#7f8ba0]">
                                Reserve computer labs and AV rooms.
                            </p>
                        </div>

                        {!isAdmin && (
                            <Button
                                asChild
                                className="h-10 border-0 bg-[#22b8cf] px-4 font-medium text-[#071116] shadow-[0_0_18px_rgba(34,184,207,0.12)] hover:bg-[#2ac7df]"
                            >
                                <Link href="/bookings/create">
                                    <Plus className="mr-2 size-4" />
                                    New Booking
                                </Link>
                            </Button>
                        )}
                    </div>

                    {bookings.length === 0 ? (
                        <div className="rounded-2xl border border-[#292e3a] bg-[#181b24] px-6 py-20 text-center shadow-2xl shadow-black/10">
                            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-[#263541] bg-[#15262c]">
                                <Calendar className="size-5 text-[#22d3ee]" />
                            </div>

                            <h2 className="text-sm font-medium text-[#e9edf2]">
                                No bookings yet
                            </h2>

                            <p className="mt-1 text-sm text-[#707c91]">
                                Facility booking requests will appear here.
                            </p>

                            {!isAdmin && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-5 border-[#34404f] bg-transparent text-[#c9d1dc] hover:border-[#22b8cf]/50 hover:bg-[#1d222c] hover:text-[#22d3ee]"
                                >
                                    <Link href="/bookings/create">
                                        Create your first booking
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-[#292e3a] bg-[#181b24] shadow-2xl shadow-black/10">
                            {/* Table heading */}
                            <div className="flex items-center justify-between border-b border-[#292e3a] px-5 py-5 sm:px-6">
                                <div>
                                    <h2 className="text-sm font-semibold text-[#edf0f4]">
                                        Booking requests
                                    </h2>
                                    <p className="mt-1 text-xs text-[#717d91]">
                                        {bookings.length}{' '}
                                        {bookings.length === 1 ? 'booking' : 'bookings'}
                                    </p>
                                </div>

                                <Calendar className="size-4 text-[#596579]" />
                            </div>

                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-[#292e3a] bg-[#151820]">
                                        <tr className="text-left">
                                            <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#728097]">
                                                Facility
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#728097]">
                                                Requested by
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#728097]">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#728097]">
                                                Status
                                            </th>
                                            <th className="w-16 px-6 py-4" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr
                                                key={booking.id}
                                                className="group border-b border-[#252a35] transition-colors last:border-0 hover:bg-[#1d212b]"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#24404a] bg-[#152a31]">
                                                            <Calendar className="size-4 text-[#22c6df]" />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-[#edf0f4]">
                                                                {booking.facility.facility_name}
                                                            </p>
                                                            <p className="mt-1 text-xs text-[#69758a]">
                                                                Booking #{booking.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="text-[#b8c1cf]">
                                                        {booking.user.name}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="text-[#c7ced8]">
                                                        {new Date(
                                                            booking.booking_date,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#6f7b8f]">
                                                        {booking.start_time} – {booking.end_time}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[booking.booking_status] ?? 'border-[#394252] bg-[#20242d] text-[#aab3c0]'}`}
                                                    >
                                                        {booking.booking_status}
                                                    </Badge>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <Link
                                                        href={`/bookings/${booking.id}`}
                                                        className="inline-flex items-center gap-1.5 text-sm text-[#7d8ca3] transition-colors hover:text-[#22d3ee]"
                                                    >
                                                        View
                                                        <ArrowUpRight className="size-3.5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="divide-y divide-[#252a35] md:hidden">
                                {bookings.map((booking) => (
                                    <Link
                                        key={booking.id}
                                        href={`/bookings/${booking.id}`}
                                        className="block p-5 transition-colors hover:bg-[#1d212b]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#24404a] bg-[#152a31]">
                                                    <Calendar className="size-4 text-[#22c6df]" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-[#edf0f4]">
                                                        {booking.facility.facility_name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#69758a]">
                                                        Booking #{booking.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <ChevronRight className="mt-1 size-4 shrink-0 text-[#5e6879]" />
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-[#657187]">
                                                    Requested by
                                                </p>
                                                <p className="mt-1 text-sm text-[#b8c1cf]">
                                                    {booking.user.name}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-[#657187]">
                                                    Date
                                                </p>
                                                <p className="mt-1 text-sm text-[#b8c1cf]">
                                                    {new Date(
                                                        booking.booking_date,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs text-[#707c91]">
                                                {booking.start_time} – {booking.end_time}
                                            </span>

                                            <Badge
                                                variant="outline"
                                                className={`rounded-md px-2.5 py-1 text-[11px] capitalize ${statusStyles[booking.booking_status] ?? 'border-[#394252] bg-[#20242d] text-[#aab3c0]'}`}
                                            >
                                                {booking.booking_status}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
