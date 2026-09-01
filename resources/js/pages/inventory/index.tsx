import { Head, Link, router } from '@inertiajs/react';
import {
    Box,
    ChevronRight,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type InventoryItemRow = {
    id: number;
    property_no: string;
    item_name: string;
    brand: string | null;
    location: string | null;
    condition: string;
};

type Props = {
    items: InventoryItemRow[];
    filters: { search?: string; condition?: string };
};

const conditionStyles: Record<string, string> = {
    working:
        'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    defective:
        'border-red-400/20 bg-red-400/10 text-red-300',
    under_repair:
        'border-orange-400/20 bg-orange-400/10 text-orange-300',
};

const conditionLabels: Record<string, string> = {
    working: 'Working',
    defective: 'Defective',
    under_repair: 'Under repair',
};

export default function InventoryIndex({
    items,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [condition, setCondition] = useState(
        filters.condition ?? 'all',
    );

    function applyFilters(
        newSearch: string,
        newCondition: string,
    ) {
        router.get(
            '/inventory',
            {
                search: newSearch || undefined,
                condition:
                    newCondition !== 'all'
                        ? newCondition
                        : undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function handleDelete(id: number) {
        if (
            confirm(
                'Delete this inventory item? This cannot be undone.',
            )
        ) {
            router.delete(`/inventory/${id}`);
        }
    }

    return (
        <>
            <Head title="Inventory" />

            <div className="min-h-full flex-1 bg-[#12141A] text-[#F1F3F5]">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    {/* Background accents */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-1/4 size-[420px] rounded-full bg-[#22B8C7]/[0.035] blur-3xl" />
                        <div className="absolute -bottom-48 left-1/4 size-[360px] rounded-full bg-[#8B6DFF]/[0.025] blur-3xl" />
                    </div>

                    <div className="relative flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-[#22B8C7] shadow-[0_0_8px_rgba(34,184,199,0.8)]" />

                                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#626A78]">
                                        ICT Asset Management
                                    </span>
                                </div>

                                <h1 className="text-2xl font-semibold tracking-tight text-[#F1F3F5] md:text-3xl">
                                    Inventory
                                </h1>

                                <p className="mt-1 text-sm text-[#7F8795]">
                                    Manage ICT equipment and property
                                    records.
                                </p>
                            </div>

                            <Button
                                asChild
                                className="w-full border-0 bg-[#22B8C7] text-[#081014] shadow-[0_0_20px_rgba(34,184,199,0.12)] transition-all hover:bg-[#29C4D3] hover:shadow-[0_0_28px_rgba(34,184,199,0.22)] sm:w-auto"
                            >
                                <Link href="/inventory/create">
                                    <Plus className="size-4" />
                                    Add Equipment
                                </Link>
                            </Button>
                        </div>

                        {/* Search and filters */}
                        <div className="rounded-xl border border-[#2A2F3B] bg-[#171A23]/90 p-3 shadow-2xl shadow-black/20">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1 sm:max-w-lg">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#626A78]" />

                                    <Input
                                        placeholder="Search equipment..."
                                        className="h-10 border-[#2A2F3B] bg-[#12141A] pl-9 text-sm text-[#F1F3F5] placeholder:text-[#626A78] shadow-none focus-visible:border-[#22B8C7]/60 focus-visible:ring-1 focus-visible:ring-[#22B8C7]/30"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            applyFilters(
                                                e.target.value,
                                                condition,
                                            );
                                        }}
                                    />
                                </div>

                                <Select
                                    value={condition}
                                    onValueChange={(value) => {
                                        setCondition(value);
                                        applyFilters(
                                            search,
                                            value,
                                        );
                                    }}
                                >
                                    <SelectTrigger className="h-10 w-full border-[#2A2F3B] bg-[#12141A] text-sm text-[#B8BFCA] shadow-none focus:ring-1 focus:ring-[#22B8C7]/30 sm:w-48">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent className="border-[#2A2F3B] bg-[#1B1E28] text-[#F1F3F5]">
                                        <SelectItem value="all">
                                            All conditions
                                        </SelectItem>

                                        <SelectItem value="working">
                                            Working
                                        </SelectItem>

                                        <SelectItem value="defective">
                                            Defective
                                        </SelectItem>

                                        <SelectItem value="under_repair">
                                            Under repair
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Section heading */}
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737B8A]">
                                    Inventory Records
                                </p>

                                <p className="mt-1 text-xs text-[#4F5765]">
                                    {items.length === 1
                                        ? '1 equipment record'
                                        : `${items.length} equipment records`}
                                </p>
                            </div>

                            {(search || condition !== 'all') && (
                                <span className="rounded-md border border-[#2A2F3B] bg-[#171A23] px-2.5 py-1 text-[10px] text-[#737B8A]">
                                    Filtered results
                                </span>
                            )}
                        </div>

                        {/* Empty state */}
                        {items.length === 0 ? (
                            <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-[#2A2F3B] bg-[#171A23]/70 px-6 text-center">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-[#2A2F3B] bg-[#12141A]">
                                    <Box className="size-5 text-[#626A78]" />
                                </div>

                                <h2 className="text-sm font-medium text-[#E3E6EA]">
                                    No inventory items found
                                </h2>

                                <p className="mt-1 max-w-sm text-sm leading-6 text-[#626A78]">
                                    {search ||
                                    condition !== 'all'
                                        ? 'Try changing your search or condition filter.'
                                        : 'There are no equipment records in the inventory yet.'}
                                </p>

                                {!search &&
                                    condition === 'all' && (
                                        <Button
                                            asChild
                                            size="sm"
                                            className="mt-5 bg-[#22B8C7] text-[#081014] hover:bg-[#29C4D3]"
                                        >
                                            <Link href="/inventory/create">
                                                <Plus className="size-4" />
                                                Add First Item
                                            </Link>
                                        </Button>
                                    )}
                            </div>
                        ) : (
                            /* Table */
                            <div className="overflow-hidden rounded-xl border border-[#2A2F3B] bg-[#1B1E28] shadow-2xl shadow-black/25">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[800px] text-sm">
                                        <thead className="border-b border-[#2A2F3B] bg-[#171A23]">
                                            <tr>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-[#626A78]">
                                                    Property No.
                                                </th>

                                                <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-[#626A78]">
                                                    Equipment
                                                </th>

                                                <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-[#626A78]">
                                                    Brand
                                                </th>

                                                <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-[#626A78]">
                                                    Location
                                                </th>

                                                <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-[#626A78]">
                                                    Condition
                                                </th>

                                                <th className="w-28 px-5 py-3.5 text-right text-[10px] font-medium uppercase tracking-[0.14em] text-[#626A78]">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {items.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="group border-b border-[#2A2F3B]/70 transition-colors last:border-0 hover:bg-[#222633]/60"
                                                >
                                                    {/* Property number */}
                                                    <td className="px-5 py-4 align-middle">
                                                        <span className="font-mono text-[11px] text-[#7F8795]">
                                                            {
                                                                item.property_no
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* Equipment */}
                                                    <td className="px-5 py-4 align-middle">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#2A2F3B] bg-[#12141A] text-[#626A78] transition-all group-hover:border-[#22B8C7]/30 group-hover:text-[#22B8C7]">
                                                                <Box className="size-4" />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate font-medium text-[#E9ECF0]">
                                                                    {
                                                                        item.item_name
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 text-xs text-[#555D6B]">
                                                                    Equipment
                                                                    record
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Brand */}
                                                    <td className="px-5 py-4 align-middle text-[#8E96A5]">
                                                        {item.brand ?? (
                                                            <span className="text-[#414854]">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Location */}
                                                    <td className="px-5 py-4 align-middle">
                                                        {item.location ? (
                                                            <span className="text-[#8E96A5]">
                                                                {
                                                                    item.location
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-[#414854]">
                                                                Not assigned
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Condition */}
                                                    <td className="px-5 py-4 align-middle">
                                                        <Badge
                                                            variant="outline"
                                                            className={`gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${
                                                                conditionStyles[
                                                                    item
                                                                        .condition
                                                                ] ??
                                                                'border-[#2A2F3B] bg-[#12141A] text-[#737B8A]'
                                                            }`}
                                                        >
                                                            <span className="size-1.5 rounded-full bg-current" />

                                                            {conditionLabels[
                                                                item
                                                                    .condition
                                                            ] ??
                                                                item.condition.replace(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                        </Badge>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-5 py-4 align-middle">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-2.5 text-xs text-[#737B8A] hover:bg-white/[0.04] hover:text-[#F1F3F5]"
                                                            >
                                                                <Link
                                                                    href={`/inventory/${item.id}/edit`}
                                                                >
                                                                    Edit
                                                                    <ChevronRight className="ml-1 size-3" />
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-[#555D6B] hover:bg-red-500/10 hover:text-red-400"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.id,
                                                                    )
                                                                }
                                                                title="Delete item"
                                                            >
                                                                <Trash2 className="size-3.5" />

                                                                <span className="sr-only">
                                                                    Delete{' '}
                                                                    {
                                                                        item.item_name
                                                                    }
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Table footer */}
                                <div className="flex items-center justify-between border-t border-[#2A2F3B] bg-[#171A23]/60 px-5 py-3">
                                    <p className="text-[11px] text-[#555D6B]">
                                        Showing {items.length}{' '}
                                        {items.length === 1
                                            ? 'record'
                                            : 'records'}
                                    </p>

                                    <div className="flex items-center gap-2 text-[10px] text-[#555D6B]">
                                        <span className="size-1 rounded-full bg-[#22B8C7]" />
                                        Inventory Management
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
