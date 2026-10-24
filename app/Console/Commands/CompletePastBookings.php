<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('bookings:complete-past')]
#[Description('Mark approved bookings whose schedule has passed as completed')]
class CompletePastBookings extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $completed = Booking::query()
            ->where('booking_status', 'approved')
            ->whereDate('booking_date', '<', today())
            ->update(['booking_status' => 'completed']);

        $this->info("Marked {$completed} booking(s) as completed.");

        return self::SUCCESS;
    }
}
