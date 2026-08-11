import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
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

export default function InventoryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        property_no: '',
        item_name: '',
        brand: '',
        model: '',
        serial_no: '',
        location: '',
        condition: 'working',
        status: 'active',
        purchase_date: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/inventory');
    }

    return (
        <>
            <Head title="Add Inventory Item" />

            <div className="mx-auto flex max-w-lg flex-1 flex-col gap-4 p-4">
                <BackButton href="/inventory" />
                <div>
                    <h1 className="text-xl font-semibold">Add inventory item</h1>
                    <p className="text-sm text-muted-foreground">
                        Register new ICT equipment.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border p-6">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="property_no">Property no.</Label>
                            <Input
                                id="property_no"
                                value={data.property_no}
                                onChange={(e) => setData('property_no', e.target.value)}
                                placeholder="PROP-0001"
                            />
                            {errors.property_no && (
                                <p className="text-sm text-destructive">{errors.property_no}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="item_name">Item name</Label>
                            <Input
                                id="item_name"
                                value={data.item_name}
                                onChange={(e) => setData('item_name', e.target.value)}
                                placeholder="Desktop PC"
                            />
                            {errors.item_name && (
                                <p className="text-sm text-destructive">{errors.item_name}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                                id="brand"
                                value={data.brand}
                                onChange={(e) => setData('brand', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                value={data.model}
                                onChange={(e) => setData('model', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="serial_no">Serial no.</Label>
                            <Input
                                id="serial_no"
                                value={data.serial_no}
                                onChange={(e) => setData('serial_no', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="Computer Lab"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="condition">Condition</Label>
                            <Select
                                value={data.condition}
                                onValueChange={(value) => setData('condition', value)}
                            >
                                <SelectTrigger id="condition" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="working">Working</SelectItem>
                                    <SelectItem value="defective">Defective</SelectItem>
                                    <SelectItem value="under_repair">Under repair</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) => setData('status', value)}
                            >
                                <SelectTrigger id="status" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="retired">Retired</SelectItem>
                                    <SelectItem value="disposed">Disposed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="purchase_date">Purchase date</Label>
                        <Input
                            id="purchase_date"
                            type="date"
                            value={data.purchase_date}
                            onChange={(e) => setData('purchase_date', e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                        >
                            {processing && <Spinner />}
                            Add item
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
