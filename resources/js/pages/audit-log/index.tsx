import { Head, Link, router } from '@inertiajs/react';
import { History } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type LogEntry = {
    id: number;
    action_taken: string;
    module_name: string;
    record_id: number | null;
    action_date: string;
    details: string | null;
    admin_user: { name: string } | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedLogs = {
    data: LogEntry[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
};

type Props = {
    logs: PaginatedLogs;
    modules: string[];
    filters: { module?: string };
};

export default function AuditLogIndex({ logs, modules, filters }: Props) {
    function applyFilter(module: string) {
        router.get(
            '/audit-log',
            { module: module !== 'all' ? module : undefined },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Audit Log" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Audit Log</h1>
                        <p className="text-sm text-muted-foreground">
                            Track all administrative actions across the system.
                        </p>
                    </div>
                    <Select
                        defaultValue={filters.module ?? 'all'}
                        onValueChange={applyFilter}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All modules</SelectItem>
                            {modules.map((module) => (
                                <SelectItem key={module} value={module}>
                                    {module.replace('_', ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {logs.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
                        <History className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No audit log entries yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Action</th>
                                        <th className="px-4 py-3 font-medium">Module</th>
                                        <th className="px-4 py-3 font-medium">Admin</th>
                                        <th className="px-4 py-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.map((log) => (
                                        <tr key={log.id} className="border-b last:border-0">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{log.action_taken}</p>
                                                {log.record_id && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Record #{log.record_id}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {log.module_name.replace('_', ' ')}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {log.admin_user?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(log.action_date).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {logs.last_page > 1 && (
                            <div className="flex items-center justify-center gap-1">
                                {logs.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url ?? '#'}
                                        preserveState
                                        className={`rounded-md px-3 py-1.5 text-sm ${
                                            link.active
                                                ? 'bg-ustp-navy text-white'
                                                : link.url
                                                  ? 'text-muted-foreground hover:bg-muted'
                                                  : 'pointer-events-none text-muted-foreground/40'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
