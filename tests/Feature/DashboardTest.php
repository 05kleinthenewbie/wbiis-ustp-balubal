<?php

use App\Models\InventoryItem;
use App\Models\JobOrder;
use App\Models\Role;
use App\Models\ServiceRequest;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    User::factory()->create();

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this
        ->actingAs($user)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->where('period', null)
        ->where('overview', null)
        ->where('pendingActions', null)
        ->where('inventoryAlerts', null)
        ->where('activitySeries', null));
});

test('admin dashboard surfaces assignment, sla, and inventory expiry stats', function () {
    $adminRole = Role::firstOrCreate(['role_name' => 'ict_admin']);
    $admin = User::factory()->create(['role_id' => $adminRole->id]);
    $technician = User::factory()->create(['role_id' => $adminRole->id]);

    $requesterRole = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $requester = User::factory()->create(['role_id' => $requesterRole->id]);

    $serviceRequest = ServiceRequest::create([
        'user_id' => $requester->id,
        'problem_description' => 'Dashboard check request',
        'request_status' => 'pending',
    ]);

    JobOrder::create([
        'request_id' => $serviceRequest->id,
        'status' => 'open',
    ]);

    JobOrder::create([
        'request_id' => $serviceRequest->id,
        'assigned_to' => $technician->id,
        'status' => 'in_progress',
        'date_assigned' => now()->subDays(3),
        'sla_deadline' => now()->subDay(),
    ]);

    InventoryItem::factory()->create(['expiration_date' => now()->addDays(10)]);
    InventoryItem::factory()->create(['expiration_date' => now()->subDays(5)]);
    InventoryItem::factory()->create(['expiration_date' => null]);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('isAdmin', true)
            ->where('stats.technicians', 2)
            ->where('stats.unassignedJobOrders', 1)
            ->where('stats.overdueJobOrders', 1)
            ->where('stats.inventoryExpiryAlerts', 2)
            ->where('stats.pendingRequests', 1));
});

test('admin dashboard overview, pending actions, and alerts are exposed', function () {
    $adminRole = Role::firstOrCreate(['role_name' => 'ict_admin']);
    $admin = User::factory()->create(['role_id' => $adminRole->id]);

    $requesterRole = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $requester = User::factory()->create(['role_id' => $requesterRole->id]);

    ServiceRequest::create([
        'user_id' => $requester->id,
        'problem_description' => 'Overview check request',
        'request_status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('period', 'year')
            ->has('activitySeries.labels', 12)
            ->has('activitySeries.bookings', 12)
            ->has('activitySeries.requests', 12)
            ->has('activitySeries.jobOrders', 12)
            ->where('overview.serviceRequests.pending', 1)
            ->where('overview.inventory.defective', 0)
            ->where('overview.pendingActions.total', 1)
            ->where('pendingActions.requestApprovals', 1)
            ->where('pendingActions.bookingApprovals', 0)
            ->where('inventoryAlerts.defective', 0)
            ->where('inventoryAlerts.expired', 0));
});

test('admin dashboard period filter scopes totals and activity buckets', function () {
    $adminRole = Role::firstOrCreate(['role_name' => 'ict_admin']);
    $admin = User::factory()->create(['role_id' => $adminRole->id]);

    $requesterRole = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $requester = User::factory()->create(['role_id' => $requesterRole->id]);

    $oldRequest = ServiceRequest::create([
        'user_id' => $requester->id,
        'problem_description' => 'Older request outside the week window',
        'request_status' => 'pending',
    ]);
    $oldRequest->created_at = now()->subDays(10);
    $oldRequest->save();

    ServiceRequest::create([
        'user_id' => $requester->id,
        'problem_description' => 'Fresh request',
        'request_status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard', ['period' => 'year']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('period', 'year')
            ->where('overview.serviceRequests.total', 2)
            ->has('activitySeries.labels', 12));

    $this->actingAs($admin)
        ->get(route('dashboard', ['period' => 'month']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('period', 'month')
            ->where('overview.serviceRequests.total', 2)
            ->has('activitySeries.labels', 6));

    $this->actingAs($admin)
        ->get(route('dashboard', ['period' => 'week']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('period', 'week')
            ->where('overview.serviceRequests.total', 1)
            ->has('activitySeries.labels', 7));

    $this->actingAs($admin)
        ->get(route('dashboard', ['period' => 'bogus']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('period', 'year'));
});
