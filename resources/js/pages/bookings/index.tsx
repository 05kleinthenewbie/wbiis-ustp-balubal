import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Calendar,
    ChevronRight,
    Plus,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

const statusBadge: Record<string, string> = {
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    rejected: 'border-rose-200 bg-rose-50 text-rose-600',
    cancelled: 'border-slate-200 bg-slate-50 text-slate-600',
};

export default function BookingsIndex({ bookings, isAdmin }: Props) {
    const [search, setSearch] = useState('');

    const filtered = bookings.filter((booking) => {
        const q = search.toLowerCase();

        return (
            booking.facility.facility_name.toLowerCase().includes(q) ||
            booking.user.name.toLowerCase().includes(q) ||
            String(booking.id).includes(q)
        );
    });

    return (
        <>
            <Head title="Facility Bookings" />

            <div className="relative min-h-full flex-1 overflow-hidden bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                                    Facility Management
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
                                Facility Bookings
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                                Reserve computer labs and AV rooms.
                            </p>
                        </div>

                        {!isAdmin && (
                            <Button
                                asChild
                                className="h-10 bg-ustp-gold px-4 text-sm font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/10 transition-all hover:bg-ustp-gold-dark hover:text-white"
                            >
                                <Link href="/bookings/create">
                                    <Plus className="mr-2 size-4" />
                                    New Booking
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search bookings..."
                                className="h-10 border-slate-300 bg-white pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                            />
                        </div>

                        <div className="text-xs text-slate-400">
                            {filtered.length} booking
                            {filtered.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filtered.length === 0 ? (
                        <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-ustp-gold/10 text-ustp-gold">
                                <Calendar className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-slate-800">
                                {search
                                    ? 'No matching bookings'
                                    : 'No bookings yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
                                {search
                                    ? 'Try a different facility name, requester, or booking ID.'
                                    : 'Facility booking requests will appear here.'}
                            </p>

                            {!search && !isAdmin && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-5 border-ustp-gold/30 bg-transparent text-ustp-gold hover:bg-ustp-gold/10 hover:text-ustp-gold"
                                >
                                    <Link href="/bookings/create">
                                        <Plus className="size-4" />
                                        Create your first booking
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        /* Table */
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Table heading */}
                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-800">
                                        Booking requests
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {bookings.length}{' '}
                                        {bookings.length === 1
                                            ? 'booking'
                                            : 'bookings'}
                                    </p>
                                </div>

                                <Calendar className="size-4 text-slate-400" />
                            </div>

                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-slate-200 bg-slate-50">
                                        <tr className="text-left">
                                            <th className="px-6 py-4 text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Facility
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Requested by
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                Status
                                            </th>
                                            <th className="w-16 px-6 py-4" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((booking) => (
                                            <tr
                                                key={booking.id}
                                                className="group border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                                            <Calendar className="size-4" />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {
                                                                    booking
                                                                        .facility
                                                                        .facility_name
                                                                }
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                Booking #
                                                                {booking.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="text-sm text-slate-600">
                                                        {booking.user.name}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="text-slate-800">
                                                        {new Date(
                                                            booking.booking_date,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {booking.start_time} –{' '}
                                                        {booking.end_time}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge[booking.booking_status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                                    >
                                                        {booking.booking_status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <Link
                                                        href={`/bookings/${booking.id}`}
                                                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-ustp-gold"
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
                            <div className="divide-y divide-slate-200 md:hidden">
                                {filtered.map((booking) => (
                                    <Link
                                        key={booking.id}
                                        href={`/bookings/${booking.id}`}
                                        className="block p-5 transition-colors hover:bg-slate-50"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                                    <Calendar className="size-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-slate-800">
                                                        {
                                                            booking.facility
                                                                .facility_name
                                                        }
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Booking #{booking.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <ChevronRight className="mt-1 size-4 shrink-0 text-slate-400" />
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] tracking-wider text-slate-400 uppercase">
                                                    Requested by
                                                </p>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    {booking.user.name}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] tracking-wider text-slate-400 uppercase">
                                                    Date
                                                </p>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    {new Date(
                                                        booking.booking_date,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs text-slate-400">
                                                {booking.start_time} –{' '}
                                                {booking.end_time}
                                            </span>

                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge[booking.booking_status] ?? 'border-slate-200 bg-slate-50 text-slate-500'}`}
                                            >
                                                {booking.booking_status}
                                            </span>
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
