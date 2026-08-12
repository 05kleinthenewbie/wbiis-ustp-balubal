import { Head, router } from '@inertiajs/react';
import { UserCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

    function approveUser(id: number) {
        setProcessingId(id);
        router.put(
            `/users/${id}`,
            { status: 'active' },
            { onFinish: () => setProcessingId(null) },
        );
    }

    return (
        <>
            <Head title="User Management" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">User Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Review and approve new account registrations.
                    </p>
                </div>

                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <UserCheck className="size-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                            Pending Approval ({pendingUsers.length})
                        </p>
                    </div>

                    {pendingUsers.length === 0 ? (
                        <div className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
                            No accounts awaiting approval.
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">Email</th>
                                        <th className="px-4 py-3 font-medium">Role</th>
                                        <th className="px-4 py-3 font-medium">Department</th>
                                        <th className="px-4 py-3 font-medium">Registered</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingUsers.map((user) => (
                                        <tr key={user.id} className="border-b last:border-0">
                                            <td className="px-4 py-3 font-medium">{user.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {roleLabels[user.role?.role_name ?? ''] ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {user.department ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    size="sm"
                                                    disabled={processingId === user.id}
                                                    onClick={() => approveUser(user.id)}
                                                    className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                                                >
                                                    Approve
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                            Active Users ({activeUsers.length})
                        </p>
                    </div>

                    {activeUsers.length === 0 ? (
                        <div className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
                            No active users yet.
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">Email</th>
                                        <th className="px-4 py-3 font-medium">Role</th>
                                        <th className="px-4 py-3 font-medium">Department</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeUsers.map((user) => (
                                        <tr key={user.id} className="border-b last:border-0">
                                            <td className="px-4 py-3 font-medium">{user.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {roleLabels[user.role?.role_name ?? ''] ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {user.department ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-100 text-green-800"
                                                >
                                                    {user.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
