<?php

use App\Services\SlaService;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    SlaService::checkBreachedSlas();
})->hourly()->description('Check for breached SLAs');

Schedule::command('bookings:complete-past')
    ->dailyAt('00:10')
    ->description('Complete past approved bookings');
