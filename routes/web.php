<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\Teams\TeamInvitationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::resource('requests', ServiceRequestController::class)->except(['edit', 'destroy']);
    Route::resource('job-orders', \App\Http\Controllers\JobOrderController::class)->only(['index', 'show', 'update']);
    Route::post('job-orders/{jobOrder}/responses', [\App\Http\Controllers\JobOrderController::class, 'addResponse'])->name('job-orders.responses.store');
    Route::resource('bookings', \App\Http\Controllers\BookingController::class)->except(['edit', 'destroy']);
    Route::resource('incidents', \App\Http\Controllers\IncidentReportController::class)->except(['edit', 'destroy']);
    Route::resource('inventory', \App\Http\Controllers\InventoryItemController::class);
    Route::get('reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::post('notifications/{notification}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::get('audit-log', [\App\Http\Controllers\AuditLogController::class, 'index'])->name('audit-log.index');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
