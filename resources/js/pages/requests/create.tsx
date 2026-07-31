import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

type ServiceTypeItem = {
    id: number;
    service_name: string;
    default_action: string | null;
};

type ServiceCategoryItem = {
    id: number;
    category_name: string;
    service_types: ServiceTypeItem[];
};

type Props = {
    categories: ServiceCategoryItem[];
};

type ServiceLine = {
    service_type_id: number;
    specification: string;
    quantity: number;
    action_type: string;
};

const actionOptionsByCategory: Record<string, string[]> = {
    'Network Services': ['New Connection', 'Troubleshoot'],
    'Hardware Services': ['Installation', 'Troubleshoot', 'Update'],
    'Software Services': ['Installation', 'Troubleshoot', 'Update'],
    'Information System Services': ['Create New', 'Troubleshoot', 'Update'],
};

export default function RequestsCreate({ categories }: Props) {
    const [selected, setSelected] = useState<Record<number, ServiceLine>>({});

    const { data, setData, post, processing, errors } = useForm({
        problem_description: '',
        services: [] as ServiceLine[],
    });

    function toggleService(typeId: number, defaultAction: string | null) {
        setSelected((prev) => {
            const next = { ...prev };

            if (next[typeId]) {
                delete next[typeId];
            } else {
                next[typeId] = {
                    service_type_id: typeId,
                    specification: '',
                    quantity: 1,
                    action_type: defaultAction ?? '',
                };
            }
            
            return next;
        });
    }

    function updateLine(typeId: number, field: keyof ServiceLine, value: string | number) {
        setSelected((prev) => ({
            ...prev,
            [typeId]: { ...prev[typeId], [field]: value },
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setData('services', Object.values(selected));
        post('/requests', {
            onSuccess: () => setSelected({}),
        });
    }

    const hasSelection = Object.keys(selected).length > 0;

    return (
        <>
            <Head title="New Service Request" />

            <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">New service request</h1>
                    <p className="text-sm text-muted-foreground">
                        Check all services needed for this request.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="rounded-xl border p-6">
                        {categories.map((category) => (
                            <div key={category.id} className="mb-6 last:mb-0">
                                <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    {category.category_name}
                                </p>

                                <div className="flex flex-col gap-3">
                                    {category.service_types.map((type) => {
                                        const isChecked = Boolean(selected[type.id]);
                                        const actionOptions =
                                            actionOptionsByCategory[category.category_name] ?? [];

                                        return (
                                            <div
                                                key={type.id}
                                                className="grid grid-cols-[20px_1.4fr_1fr_0.7fr_1.3fr] items-center gap-2"
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={() =>
                                                        toggleService(type.id, type.default_action)
                                                    }
                                                />
                                                <span
                                                    className={
                                                        isChecked
                                                            ? 'text-sm font-medium'
                                                            : 'text-sm text-muted-foreground'
                                                    }
                                                >
                                                    {type.service_name}
                                                </span>
                                                <Input
                                                    placeholder="Specify"
                                                    disabled={!isChecked}
                                                    value={selected[type.id]?.specification ?? ''}
                                                    onChange={(e) =>
                                                        updateLine(type.id, 'specification', e.target.value)
                                                    }
                                                    className="h-8 text-xs"
                                                />
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    placeholder="Qty"
                                                    disabled={!isChecked}
                                                    value={selected[type.id]?.quantity ?? 1}
                                                    onChange={(e) =>
                                                        updateLine(
                                                            type.id,
                                                            'quantity',
                                                            Number(e.target.value) || 1,
                                                        )
                                                    }
                                                    className="h-8 text-xs"
                                                />
                                                <Select
                                                    disabled={!isChecked}
                                                    value={selected[type.id]?.action_type ?? ''}
                                                    onValueChange={(value) =>
                                                        updateLine(type.id, 'action_type', value)
                                                    }
                                                >
                                                    <SelectTrigger className="h-8 w-full text-xs">
                                                        <SelectValue placeholder="Action" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {actionOptions.map((action) => (
                                                            <SelectItem key={action} value={action}>
                                                                {action}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {errors.services && (
                            <p className="mt-2 text-sm text-destructive">{errors.services}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="problem_description">Problem description</Label>
                        <Textarea
                            id="problem_description"
                            rows={4}
                            placeholder="Provide relevant details"
                            value={data.problem_description}
                            onChange={(e) => setData('problem_description', e.target.value)}
                        />
                        {errors.problem_description && (
                            <p className="text-sm text-destructive">
                                {errors.problem_description}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="submit"
                            disabled={processing || !hasSelection}
                            className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                        >
                            {processing && <Spinner />}
                            Submit request
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
