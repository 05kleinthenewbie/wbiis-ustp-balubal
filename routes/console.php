<?php

use App\Services\SlaService;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    SlaService::checkBreachedSlas();
})->hourly()->description('Check for breached SLAs');

Schedule::command('bookings:complete-past')
    ->hourly()
    ->description('Complete past approved bookings');
