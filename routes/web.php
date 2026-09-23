<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\JobOrderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['ok' => true]))->name('health');

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::resource('requests', ServiceRequestController::class)->except(['edit', 'destroy']);
    Route::resource('job-orders', JobOrderController::class)->only(['index', 'show', 'update']);
    Route::get('job-orders/{jobOrder}/print', [JobOrderController::class, 'print'])->name('job-orders.print');
    Route::post('job-orders/{jobOrder}/responses', [JobOrderController::class, 'addResponse'])->name('job-orders.responses.store');
    Route::post('job-orders/{jobOrder}/rate', [JobOrderController::class, 'rate'])->name('job-orders.rate');
    Route::post('job-orders/{jobOrder}/verify', [JobOrderController::class, 'verify'])->name('job-orders.verify');
    Route::resource('bookings', BookingController::class)->except(['edit', 'destroy']);
    Route::resource('incidents', IncidentReportController::class)->except(['edit', 'destroy']);
    Route::resource('inventory', InventoryItemController::class);
    Route::get('inventory/{id}/qr', [InventoryItemController::class, 'qr'])->name('inventory.qr');
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::get('audit-log', [AuditLogController::class, 'index'])->name('audit-log.index');
    Route::resource('users', UserController::class)->only(['index', 'update']);
});

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
