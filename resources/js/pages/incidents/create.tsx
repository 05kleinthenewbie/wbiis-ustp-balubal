import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
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

type InventoryItemOption = { id: number; item_name: string; property_no: string };

type Props = {
    inventoryItems: InventoryItemOption[];
};

export default function IncidentsCreate({ inventoryItems }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        incident_type: '',
        item_id: '',
        incident_description: '',
        incident_date: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/incidents');
    }

    return (
        <>
            <Head title="Report Incident" />

            <div className="mx-auto flex max-w-lg flex-1 flex-col gap-4 p-4">
                <BackButton href="/incidents" />
                <div>
                    <h1 className="text-xl font-semibold">Report an incident</h1>
                    <p className="text-sm text-muted-foreground">
                        Use this to report damage, misuse, or safety concerns involving ICT
                        equipment.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border p-6">
                    <div className="grid gap-2">
                        <Label htmlFor="incident_type">Incident type</Label>
                        <Select
                            value={data.incident_type}
                            onValueChange={(value) => setData('incident_type', value)}
                        >
                            <SelectTrigger id="incident_type" className="w-full">
                                <SelectValue placeholder="Select incident type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Equipment damage">Equipment damage</SelectItem>
                                <SelectItem value="Unauthorized use">Unauthorized use</SelectItem>
                                <SelectItem value="Theft or loss">Theft or loss</SelectItem>
                                <SelectItem value="Safety concern">Safety concern</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.incident_type && (
                            <p className="text-sm text-destructive">{errors.incident_type}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="item_id">
                            Related equipment{' '}
                            <span className="text-xs text-muted-foreground">(optional)</span>
                        </Label>
                        <Select
                            value={data.item_id}
                            onValueChange={(value) => setData('item_id', value)}
                        >
                            <SelectTrigger id="item_id" className="w-full">
                                <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                                {inventoryItems.map((item) => (
                                    <SelectItem key={item.id} value={String(item.id)}>
                                        {item.item_name} ({item.property_no})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="incident_description">Description</Label>
                        <Textarea
                            id="incident_description"
                            rows={4}
                            placeholder="What happened, when, and who was involved"
                            value={data.incident_description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setData('incident_description', e.target.value)
                            }
                        />
                        {errors.incident_description && (
                            <p className="text-sm text-destructive">
                                {errors.incident_description}
                            </p>
                        )}
                    </div>

                    <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                        After review, ICT admin may assign liability to involved parties. You'll
                        be notified of any resulting action.
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                        >
                            {processing && <Spinner />}
                            Submit report
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

