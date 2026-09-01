import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Calendar, ChevronRight, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-105 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                        <div className="absolute -bottom-40 left-1/4 size-90 rounded-full bg-ustp-gold/[0.015] blur-3xl" />
                    </div>

                    {/* Header */}
                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />

                                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                                    Facility Management
                                </span>
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                                Facility Bookings
                            </h1>

                            <p className="mt-1.5 max-w-xl text-sm text-gray-400">
                                Reserve computer labs and AV rooms.
                            </p>
                        </div>

                        {!isAdmin && (
                            <Button
                                asChild
                                className="h-10 bg-ustp-navy px-4 text-sm font-medium text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                            >
                                <Link href="/bookings/create">
                                    <Plus className="mr-2 size-4" />
                                    New Booking
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Toolbar */}
                    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search bookings..."
                                className="h-10 border-[#1a2035] bg-[#0c1222] pl-9 text-sm text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                            />
                        </div>

                        <div className="text-xs text-gray-500">
                            {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filtered.length === 0 ? (
                        <div className="relative flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-[#1a2035] bg-[#0c1222]/50 px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#1a2035] bg-[#0f1723] text-ustp-light-blue">
                                <Calendar className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-gray-200">
                                {search ? 'No matching bookings' : 'No bookings yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-gray-500">
                                {search
                                    ? 'Try a different facility name, requester, or booking ID.'
                                    : 'Facility booking requests will appear here.'}
                            </p>

                            {!search && !isAdmin && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-5 border-[#1a2035] bg-transparent text-gray-300 hover:bg-ustp-navy/10 hover:text-ustp-light-blue"
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
                        <div className="relative overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-2xl shadow-black/20">
                            {/* Table heading */}
                            <div className="flex items-center justify-between border-b border-[#1a2035] px-5 py-5 sm:px-6">
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-200">
                                        Booking requests
                                    </h2>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {bookings.length}{' '}
                                        {bookings.length === 1 ? 'booking' : 'bookings'}
                                    </p>
                                </div>

                                <Calendar className="size-4 text-gray-500" />
                            </div>

                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-[#1a2035] bg-[#0a0f1c]/80">
                                        <tr className="text-left">
                                            <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                                Facility
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                                Requested by
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
                                                Status
                                            </th>
                                            <th className="w-16 px-6 py-4" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((booking) => (
                                            <tr
                                                key={booking.id}
                                                className="group border-b border-[#151c2c] transition-colors last:border-0 hover:bg-[#111827]/70"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                                            <Calendar className="size-4" />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-gray-200">
                                                                {booking.facility.facility_name}
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Booking #{booking.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="text-sm text-gray-300">
                                                        {booking.user.name}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="text-gray-200">
                                                        {new Date(
                                                            booking.booking_date,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {booking.start_time} – {booking.end_time}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[booking.booking_status] ?? 'border-[#1a2035] bg-[#070b18] text-gray-400'}`}
                                                    >
                                                        {booking.booking_status}
                                                    </Badge>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <Link
                                                        href={`/bookings/${booking.id}`}
                                                        className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-ustp-light-blue"
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
                            <div className="divide-y divide-[#151c2c] md:hidden">
                                {filtered.map((booking) => (
                                    <Link
                                        key={booking.id}
                                        href={`/bookings/${booking.id}`}
                                        className="block p-5 transition-colors hover:bg-[#111827]/70"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ustp-blue-accent/15 text-ustp-light-blue">
                                                    <Calendar className="size-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-gray-200">
                                                        {booking.facility.facility_name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Booking #{booking.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <ChevronRight className="mt-1 size-4 shrink-0 text-gray-500" />
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                                                    Requested by
                                                </p>
                                                <p className="mt-1 text-sm text-gray-300">
                                                    {booking.user.name}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                                                    Date
                                                </p>
                                                <p className="mt-1 text-sm text-gray-300">
                                                    {new Date(
                                                        booking.booking_date,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {booking.start_time} – {booking.end_time}
                                            </span>

                                            <Badge
                                                variant="outline"
                                                className={`rounded-md px-2.5 py-1 text-[11px] capitalize ${statusStyles[booking.booking_status] ?? 'border-[#1a2035] bg-[#070b18] text-gray-400'}`}
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
