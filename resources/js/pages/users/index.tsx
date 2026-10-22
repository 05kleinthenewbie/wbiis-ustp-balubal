import { Head, router } from '@inertiajs/react';
import { UserCheck, Users, Search, UserX, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInitials } from '@/hooks/use-initials';

type UserRow = {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    department: string | null;
    status: string;
    role: { role_name: string } | null;
    created_at: string;
};

type Props = {
    status?: string | null;
    error?: string | null;
    pendingUsers: UserRow[];
    activeUsers: UserRow[];
    deactivatedUsers: UserRow[];
};

const roleLabels: Record<string, string> = {
    faculty_staff: 'Faculty/Staff',
    student: 'Student',
    ict_admin: 'ICT Admin',
};

export default function UsersIndex({
    status,
    error,
    pendingUsers,
    activeUsers,
    deactivatedUsers,
}: Props) {
    const getInitials = useInitials();
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

    function deactivateUser(id: number) {
        if (
            confirm(
                'Deactivate this account? They will no longer be able to log in.',
            )
        ) {
            setProcessingId(id);
            router.put(
                `/users/${id}`,
                { status: 'inactive' },
                { onFinish: () => setProcessingId(null) },
            );
        }
    }

    function reactivateUser(id: number) {
        setProcessingId(id);
        router.put(
            `/users/${id}`,
            { status: 'active' },
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

            <div className="min-h-full flex-1 bg-slate-50 text-slate-800">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="relative">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-800 md:text-3xl">
                            User Management
                        </h1>

                        <p className="mt-1.5 max-w-xl text-sm text-slate-400">
                            Review and approve new account registrations.
                        </p>
                    </div>

                    {status && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {status}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    )}

                    {/* Active Users */}
                    <section className="relative">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                    <Users className="size-4" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Active Users
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {activeUsers.length} user
                                        {activeUsers.length !== 1
                                            ? 's'
                                            : ''}{' '}
                                        registered
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full max-w-xs">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    value={searchActive}
                                    onChange={(e) =>
                                        setSearchActive(e.target.value)
                                    }
                                    placeholder="Search active..."
                                    className="h-9 border-slate-300 bg-white pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                />
                            </div>
                        </div>

                        {filteredActive.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                                <Users className="mb-3 size-8 text-slate-400" />
                                <p className="text-sm text-slate-400">
                                    {searchActive
                                        ? 'No matching active users'
                                        : 'No active users yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-180 text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Name
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Email
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Role
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Department
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-5 py-3.5" />
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredActive.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="size-8 shrink-0 rounded-lg">
                                                                {user.avatar ? (
                                                                    <AvatarImage
                                                                        src={
                                                                            user.avatar
                                                                        }
                                                                        alt={
                                                                            user.name
                                                                        }
                                                                        className="object-cover"
                                                                    />
                                                                ) : null}
                                                                <AvatarFallback className="rounded-lg bg-ustp-navy text-[10px] font-bold text-ustp-gold">
                                                                    {getInitials(
                                                                        user.name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium text-slate-600">
                                                                {user.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {roleLabels[
                                                            user.role
                                                                ?.role_name ??
                                                                ''
                                                        ] ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {user.department ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-md border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 capitalize"
                                                        >
                                                            {user.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={
                                                                processingId ===
                                                                user.id
                                                            }
                                                            onClick={() =>
                                                                deactivateUser(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="h-8 border-rose-200 bg-white px-3 text-xs text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                                                        >
                                                            <UserX className="mr-1 size-3" />
                                                            Deactivate
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Pending Approval */}
                    <section className="relative">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                    <UserCheck className="size-4" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Pending Approval
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {pendingUsers.length} account
                                        {pendingUsers.length !== 1
                                            ? 's'
                                            : ''}{' '}
                                        awaiting review
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full max-w-xs">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    value={searchPending}
                                    onChange={(e) =>
                                        setSearchPending(e.target.value)
                                    }
                                    placeholder="Search pending..."
                                    className="h-9 border-slate-300 bg-white pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                />
                            </div>
                        </div>

                        {filteredPending.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                                <UserCheck className="mb-3 size-8 text-slate-400" />
                                <p className="text-sm text-slate-400">
                                    {searchPending
                                        ? 'No matching pending users'
                                        : 'No accounts awaiting approval.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-180 text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Name
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Email
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Role
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Department
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Registered
                                                </th>
                                                <th className="px-5 py-3.5" />
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredPending.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="size-8 shrink-0 rounded-lg">
                                                                {user.avatar ? (
                                                                    <AvatarImage
                                                                        src={
                                                                            user.avatar
                                                                        }
                                                                        alt={
                                                                            user.name
                                                                        }
                                                                        className="object-cover"
                                                                    />
                                                                ) : null}
                                                                <AvatarFallback className="rounded-lg bg-ustp-navy text-[10px] font-bold text-ustp-gold">
                                                                    {getInitials(
                                                                        user.name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium text-slate-600">
                                                                {user.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {roleLabels[
                                                            user.role
                                                                ?.role_name ??
                                                                ''
                                                        ] ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {user.department ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {new Date(
                                                            user.created_at,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={
                                                                    processingId ===
                                                                    user.id
                                                                }
                                                                onClick={() =>
                                                                    rejectUser(
                                                                        user.id,
                                                                    )
                                                                }
                                                                className="h-8 border-rose-200 bg-white px-3 text-xs text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                                                            >
                                                                <X className="mr-1 size-3" />
                                                                Reject
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                disabled={
                                                                    processingId ===
                                                                    user.id
                                                                }
                                                                onClick={() =>
                                                                    approveUser(
                                                                        user.id,
                                                                    )
                                                                }
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

                    {/* Deactivated Users */}
                    <section className="relative">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                                <UserX className="size-4" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    Deactivated
                                </p>
                                <p className="text-xs text-slate-500">
                                    {deactivatedUsers.length} account
                                    {deactivatedUsers.length !== 1 ? 's' : ''}{' '}
                                    cannot log in
                                </p>
                            </div>
                        </div>

                        {deactivatedUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                                <UserX className="mb-3 size-8 text-slate-400" />
                                <p className="text-sm text-slate-400">
                                    No deactivated accounts.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-180 text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Name
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Email
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Role
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Department
                                                </th>
                                                <th className="px-5 py-3.5" />
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {deactivatedUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="size-8 shrink-0 rounded-lg">
                                                                {user.avatar ? (
                                                                    <AvatarImage
                                                                        src={
                                                                            user.avatar
                                                                        }
                                                                        alt={
                                                                            user.name
                                                                        }
                                                                        className="object-cover"
                                                                    />
                                                                ) : null}
                                                                <AvatarFallback className="rounded-lg bg-slate-200 text-[10px] font-bold text-slate-500">
                                                                    {getInitials(
                                                                        user.name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium text-slate-600">
                                                                {user.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {roleLabels[
                                                            user.role
                                                                ?.role_name ?? ''
                                                        ] ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {user.department ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <Button
                                                            size="sm"
                                                            disabled={
                                                                processingId ===
                                                                user.id
                                                            }
                                                            onClick={() =>
                                                                reactivateUser(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="h-8 bg-emerald-600 px-3 text-xs text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                                                        >
                                                            <UserCheck className="mr-1 size-3" />
                                                            Reactivate
                                                        </Button>
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
