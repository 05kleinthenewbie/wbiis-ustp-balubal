import { Head, router } from '@inertiajs/react';
import { UserCheck, Users, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type UserRow = {
    id: number;
    name: string;
    email: string;
    department: string | null;
    status: string;
    role: { role_name: string } | null;
    created_at: string;
};

type Props = {
    pendingUsers: UserRow[];
    activeUsers: UserRow[];
};

const roleLabels: Record<string, string> = {
    faculty_staff: 'Faculty/Staff',
    student: 'Student',
    ict_admin: 'ICT Admin',
};

export default function UsersIndex({ pendingUsers, activeUsers }: Props) {
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [searchPending, setSearchPending] = useState('');
    const [searchActive, setSearchActive] = useState('');

    function approveUser(id: number) {
        setProcessingId(id);
        router.put(
            `/users/${id}`,
            { status: 'active' },
            { onFinish: () => setProcessingId(null) },
        );
    }

    function rejectUser(id: number) {
        setProcessingId(id);
        router.put(
            `/users/${id}`,
            { status: 'inactive' },
            { onFinish: () => setProcessingId(null) },
        );
    }

    const filteredPending = pendingUsers.filter((user) => {
        const q = searchPending.toLowerCase();
        return (
            user.name.toLowerCase().includes(q) ||
            user.email.toLowerCase().includes(q) ||
            user.department?.toLowerCase().includes(q) ||
            roleLabels[user.role?.role_name ?? '']?.toLowerCase().includes(q)
        );
    });

    const filteredActive = activeUsers.filter((user) => {
        const q = searchActive.toLowerCase();
        return (
            user.name.toLowerCase().includes(q) ||
            user.email.toLowerCase().includes(q) ||
            user.department?.toLowerCase().includes(q) ||
            roleLabels[user.role?.role_name ?? '']?.toLowerCase().includes(q)
        );
    });

    return (
        <>
            <Head title="User Management" />

            <div className="min-h-full flex-1 bg-[#070b18] text-gray-100">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Ambient accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-105 rounded-full bg-ustp-navy/[0.04] blur-3xl" />
                        <div className="absolute -bottom-40 left-1/4 size-90 rounded-full bg-ustp-gold/[0.015] blur-3xl" />
                    </div>

                    {/* Header */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                                Administration
                            </span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-gray-50 md:text-3xl">
                            User Management
                        </h1>

                        <p className="mt-1.5 max-w-xl text-sm text-gray-400">
                            Review and approve new account registrations.
                        </p>
                    </div>

                    {/* Pending Approval */}
                    <section className="relative">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
                                    <UserCheck className="size-4" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-200">
                                        Pending Approval
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {pendingUsers.length} account{pendingUsers.length !== 1 ? 's' : ''} awaiting review
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full max-w-xs">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />

                                <Input
                                    value={searchPending}
                                    onChange={(e) => setSearchPending(e.target.value)}
                                    placeholder="Search pending..."
                                    className="h-9 border-[#1a2035] bg-[#0c1222] pl-9 text-xs text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                />
                            </div>
                        </div>

                        {filteredPending.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1a2035] bg-[#0c1222]/50 py-12 text-center">
                                <UserCheck className="mb-3 size-8 text-gray-600" />
                                <p className="text-sm text-gray-400">
                                    {searchPending ? 'No matching pending users' : 'No accounts awaiting approval.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-2xl shadow-black/20">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-180 text-sm">
                                        <thead>
                                            <tr className="border-b border-[#1a2035] bg-[#0a0f1c]/80">
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Name
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Email
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Role
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Department
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Registered
                                                </th>
                                                <th className="px-5 py-3.5" />
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredPending.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-[#151c2c] transition-colors last:border-0 hover:bg-[#111827]/70"
                                                >
                                                    <td className="px-5 py-4 font-medium text-gray-200">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-gray-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-gray-400">
                                                        {roleLabels[user.role?.role_name ?? ''] ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-gray-400">
                                                        {user.department ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-gray-400">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={processingId === user.id}
                                                                onClick={() => rejectUser(user.id)}
                                                                className="h-8 border-rose-400/25 bg-transparent px-3 text-xs text-rose-300 hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-200"
                                                            >
                                                                <X className="mr-1 size-3" />
                                                                Reject
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                disabled={processingId === user.id}
                                                                onClick={() => approveUser(user.id)}
                                                                className="h-8 bg-ustp-navy px-3 text-xs text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                                                            >
                                                                Approve
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Active Users */}
                    <section className="relative">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                                    <Users className="size-4" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-200">
                                        Active Users
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''} registered
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full max-w-xs">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />

                                <Input
                                    value={searchActive}
                                    onChange={(e) => setSearchActive(e.target.value)}
                                    placeholder="Search active..."
                                    className="h-9 border-[#1a2035] bg-[#0c1222] pl-9 text-xs text-gray-100 placeholder:text-gray-500 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                />
                            </div>
                        </div>

                        {filteredActive.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1a2035] bg-[#0c1222]/50 py-12 text-center">
                                <Users className="mb-3 size-8 text-gray-600" />
                                <p className="text-sm text-gray-400">
                                    {searchActive ? 'No matching active users' : 'No active users yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-[#1a2035] bg-[#0f1723] shadow-2xl shadow-black/20">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-180 text-sm">
                                        <thead>
                                            <tr className="border-b border-[#1a2035] bg-[#0a0f1c]/80">
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Name
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Email
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Role
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Department
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredActive.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-[#151c2c] transition-colors last:border-0 hover:bg-[#111827]/70"
                                                >
                                                    <td className="px-5 py-4 font-medium text-gray-200">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-gray-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-gray-400">
                                                        {roleLabels[user.role?.role_name ?? ''] ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-gray-400">
                                                        {user.department ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-md border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium capitalize text-emerald-300"
                                                        >
                                                            {user.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
