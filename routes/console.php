<?php

use App\Models\TeamInvitation;
use App\Services\SlaService;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    TeamInvitation::query()
        ->whereNotNull('expires_at')
        ->where('expires_at', '<', now())
        ->delete();
})->daily()->description('Delete expired team invitations');

Schedule::call(function () {
    SlaService::checkBreachedSlas();
})->hourly()->description('Check for breached SLAs');
