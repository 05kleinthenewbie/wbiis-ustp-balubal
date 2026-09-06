import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Calendar, ChevronRight, Plus, Search } from 'lucide-react';
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
    pending: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    approved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    rejected: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
    cancelled: 'border-slate-500/30 bg-slate-500/10 text-slate-400',
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

            <div className="relative min-h-full flex-1 overflow-hidden bg-[#070b18] px-4 py-6 text-white sm:px-6 lg:px-8">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-ustp-gold/[0.015] blur-3xl" />

                {/* Subtle dot pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, #fcb315 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                <div className="relative mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-ustp-gold shadow-[0_0_10px_rgba(252,179,21,0.5)]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                                    Facility Management
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-white">
                                Facility Bookings
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50">
                                Reserve computer labs and AV rooms.
                            </p>
                        </div>

                        {!isAdmin && (
                            <Button
                                asChild
                                className="h-10 bg-ustp-gold px-4 text-sm font-semibold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:bg-ustp-gold-dark hover:text-white"
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
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search bookings..."
                                className="h-10 border-white/[0.08] bg-white/[0.03] pl-9 text-sm text-white placeholder:text-white/40 focus-visible:border-ustp-gold/40 focus-visible:ring-1 focus-visible:ring-ustp-gold/20"
                            />
                        </div>

                        <div className="text-xs text-white/40">
                            {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Empty */}
                    {filtered.length === 0 ? (
                        <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-ustp-gold/10 text-ustp-gold">
                                <Calendar className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-white">
                                {search ? 'No matching bookings' : 'No bookings yet'}
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-white/40">
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
                        <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-xl shadow-black/10">
                            {/* Table heading */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        Booking requests
                                    </h2>
                                    <p className="mt-1 text-xs text-white/40">
                                        {bookings.length}{' '}
                                        {bookings.length === 1 ? 'booking' : 'bookings'}
                                    </p>
                                </div>

                                <Calendar className="size-4 text-white/40" />
                            </div>

                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-[#1a2035] bg-[#0a0f1c]/80">
                                        <tr className="text-left">
                                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Facility
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Requested by
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
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
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                                            <Calendar className="size-4" />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-white/90">
                                                                {booking.facility.facility_name}
                                                            </p>
                                                            <p className="mt-1 text-xs text-white/40">
                                                                Booking #{booking.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="text-sm text-white/70">
                                                        {booking.user.name}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="text-white/90">
                                                        {new Date(
                                                            booking.booking_date,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                    <p className="mt-1 text-xs text-white/40">
                                                        {booking.start_time} – {booking.end_time}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge[booking.booking_status] ?? 'border-white/20 bg-white/5 text-white/60'}`}
                                                    >
                                                        {booking.booking_status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <Link
                                                        href={`/bookings/${booking.id}`}
                                                        className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-ustp-gold"
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
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ustp-gold/10 text-ustp-gold">
                                                    <Calendar className="size-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-white/90">
                                                        {booking.facility.facility_name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-white/40">
                                                        Booking #{booking.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <ChevronRight className="mt-1 size-4 shrink-0 text-white/40" />
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-white/40">
                                                    Requested by
                                                </p>
                                                <p className="mt-1 text-sm text-white/70">
                                                    {booking.user.name}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-white/40">
                                                    Date
                                                </p>
                                                <p className="mt-1 text-sm text-white/70">
                                                    {new Date(
                                                        booking.booking_date,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs text-white/40">
                                                {booking.start_time} – {booking.end_time}
                                            </span>

                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge[booking.booking_status] ?? 'border-white/20 bg-white/5 text-white/60'}`}
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