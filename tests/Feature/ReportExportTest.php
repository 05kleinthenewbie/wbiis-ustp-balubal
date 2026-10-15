<?php

use App\Models\Role;
use App\Models\User;

function reportAdmin(): User
{
    $role = Role::firstOrCreate(['role_name' => 'ict_admin']);

    return User::factory()->create(['role_id' => $role->id]);
}

function reportFaculty(): User
{
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);

    return User::factory()->create(['role_id' => $role->id]);
}

test('guests are redirected to login from the report export', function () {
    $this->get(route('reports.export'))->assertRedirect(route('login'));
});

test('non admins cannot export reports', function () {
    $faculty = reportFaculty();

    $this->actingAs($faculty)->get(route('reports.export'))->assertForbidden();
});

test('admin can export the report summary as csv', function () {
    $admin = reportAdmin();

    $response = $this->actingAs($admin)->get(route('reports.export'));

    $response->assertOk();
    expect($response->headers->get('Content-Type'))->toContain('text/csv');
    expect($response->headers->get('Content-Disposition'))->toContain('ict-reports-');

    $content = $response->streamedContent();

    expect($content)->toContain('Module,Metric,Value')
        ->toContain('Service Requests')
        ->toContain('Job Orders')
        ->toContain('Inventory')
        ->toContain('Bookings')
        ->toContain('Incidents')
        ->toContain('Liabilities');
});
