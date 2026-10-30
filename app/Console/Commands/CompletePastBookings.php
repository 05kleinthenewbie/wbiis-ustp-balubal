<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;

#[Signature('bookings:complete-past')]
#[Description('Mark approved bookings whose schedule has passed as completed')]
class CompletePastBookings extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $now = now();
        $today = $now->toDateString();
        $time = $now->format('H:i:s');

        $completed = Booking::query()
            ->where('booking_status', 'approved')
            ->where(function (Builder $query) use ($today, $time): void {
                $query->whereDate('booking_date', '<', $today)
                    ->orWhere(function (Builder $query) use ($today, $time): void {
                        $query->whereDate('booking_date', $today)
                            ->where('end_time', '<=', $time);
                    });
            })
            ->update(['booking_status' => 'completed']);

        $this->info("Marked {$completed} booking(s) as completed.");

        return self::SUCCESS;
    }
}
