import { Head, Link, router } from '@inertiajs/react';
import { Box, Plus, Search, Trash2 } from 'lucide-react';
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
    working: 'bg-green-100 text-green-800',
    defective: 'bg-red-100 text-red-800',
    under_repair: 'bg-amber-100 text-amber-800',
};

export default function InventoryIndex({ items, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [condition, setCondition] = useState(filters.condition ?? 'all');

    function applyFilters(newSearch: string, newCondition: string) {
        router.get(
            '/inventory',
            {
                search: newSearch || undefined,
                condition: newCondition !== 'all' ? newCondition : undefined,
            },
            { preserveState: true, replace: true },
        );
    }

    function handleDelete(id: number) {
        if (confirm('Delete this inventory item? This cannot be undone.')) {
            router.delete(`/inventory/${id}`);
        }
    }

    return (
        <>
            <Head title="Inventory" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Inventory</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage ICT equipment records.
                        </p>
                    </div>
                    <Button asChild className="bg-ustp-navy text-white hover:bg-ustp-navy-dark">
                        <Link href="/inventory/create">
                            <Plus className="size-4" />
                            Add Item
                        </Link>
                    </Button>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or property no."
                            className="pl-8"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                applyFilters(e.target.value, condition);
                            }}
                        />
                    </div>
                    <Select
                        value={condition}
                        onValueChange={(value) => {
                            setCondition(value);
                            applyFilters(search, value);
                        }}
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All conditions</SelectItem>
                            <SelectItem value="working">Working</SelectItem>
                            <SelectItem value="defective">Defective</SelectItem>
                            <SelectItem value="under_repair">Under repair</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
                        <Box className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No inventory items found.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Property no.</th>
                                    <th className="px-4 py-3 font-medium">Item name</th>
                                    <th className="px-4 py-3 font-medium">Brand</th>
                                    <th className="px-4 py-3 font-medium">Location</th>
                                    <th className="px-4 py-3 font-medium">Condition</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-b last:border-0">
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {item.property_no}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{item.item_name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {item.brand ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {item.location ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={conditionStyles[item.condition] ?? ''}
                                                variant="outline"
                                            >
                                                {item.condition.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Link
                                                    href={`/inventory/${item.id}/edit`}
                                                    className="text-ustp-navy hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
