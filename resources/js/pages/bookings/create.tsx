import { Head, useForm } from '@inertiajs/react';
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
import { Textarea } from '@/components/ui/textarea';

type Facility = { id: number; facility_name: string; facility_type: string };

type Props = {
    facilities: Facility[];
};

export default function BookingsCreate({ facilities }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        facility_id: '',
        booking_date: '',
        start_time: '',
        end_time: '',
        purpose: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/bookings');
    }

    return (
        <>
            <Head title="New Booking" />

            <div className="mx-auto flex max-w-lg flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Book a facility</h1>
                    <p className="text-sm text-muted-foreground">
                        Bookings require ICT admin approval before confirmation.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border p-6">
                    <div className="grid gap-2">
                        <Label htmlFor="facility_id">Facility</Label>
                        <Select
                            value={data.facility_id}
                            onValueChange={(value) => setData('facility_id', value)}
                        >
                            <SelectTrigger id="facility_id" className="w-full">
                                <SelectValue placeholder="Select a facility" />
                            </SelectTrigger>
                            <SelectContent>
                                {facilities.map((facility) => (
                                    <SelectItem key={facility.id} value={String(facility.id)}>
                                        {facility.facility_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.facility_id && (
                            <p className="text-sm text-destructive">{errors.facility_id}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="booking_date">Date</Label>
                        <Input
                            id="booking_date"
                            type="date"
                            value={data.booking_date}
                            onChange={(e) => setData('booking_date', e.target.value)}
                        />
                        {errors.booking_date && (
                            <p className="text-sm text-destructive">{errors.booking_date}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="start_time">Start time</Label>
                            <Input
                                id="start_time"
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_time">End time</Label>
                            <Input
                                id="end_time"
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                            />
                        </div>
                    </div>
                    {errors.start_time && (
                        <p className="text-sm text-destructive">{errors.start_time}</p>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Textarea
                            id="purpose"
                            rows={3}
                            placeholder="Describe why you need this facility"
                            value={data.purpose}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setData('purpose', e.target.value)
                            }
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-ustp-navy text-white hover:bg-ustp-navy-dark"
                        >
                            {processing && <Spinner />}
                            Request booking
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
