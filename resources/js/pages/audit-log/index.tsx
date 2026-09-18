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

            <div className="min-h-full flex-1 bg-slate-50 text-slate-800">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-ustp-light-blue shadow-[0_0_8px_rgba(50,157,234,0.6)]" />

                                <span className="text-[10px] font-medium tracking-[0.18em] text-slate-500 uppercase">
                                    System
                                </span>
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-slate-800 md:text-3xl">
                                Audit Log
                            </h1>

                            <p className="mt-1.5 max-w-xl text-sm text-slate-500">
                                Track all administrative actions across the
                                system.
                            </p>
                        </div>

                        <Select
                            defaultValue={filters.module ?? 'all'}
                            onValueChange={applyFilter}
                        >
                            <SelectTrigger className="h-10 w-48 border-slate-300 bg-white text-slate-600 focus:ring-1 focus:ring-ustp-navy/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-slate-200 bg-white text-slate-800">
                                <SelectItem value="all">All modules</SelectItem>
                                {modules.map((module) => (
                                    <SelectItem key={module} value={module}>
                                        {module.replace('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Empty */}
                    {logs.data.length === 0 ? (
                        <div className="relative flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-ustp-light-blue">
                                <History className="size-6" />
                            </div>

                            <h2 className="text-sm font-medium text-slate-800">
                                No audit log entries yet
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
                                Administrative actions will appear here as they
                                are performed.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-180 text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Action
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Module
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Admin
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {logs.data.map((log) => (
                                                <tr
                                                    key={log.id}
                                                    className="border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        <p className="font-medium text-slate-800">
                                                            {log.action_taken}
                                                        </p>
                                                        {log.record_id && (
                                                            <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                                                                Record #
                                                                {log.record_id}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500 capitalize">
                                                            {log.module_name.replace(
                                                                '_',
                                                                ' ',
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-500">
                                                        {log.admin_user?.name ??
                                                            '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-500">
                                                        {new Date(
                                                            log.action_date,
                                                        ).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            {logs.last_page > 1 && (
                                <div className="flex items-center justify-center gap-1">
                                    {logs.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url ?? '#'}
                                            preserveState
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-ustp-navy text-white shadow-lg shadow-ustp-navy/10'
                                                    : link.url
                                                      ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                                      : 'pointer-events-none text-slate-400'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
