<?php

use App\Models\Facility;
use App\Models\IncidentReport;
use App\Models\Role;
use App\Models\User;

function accessUser(string $roleName): User
{
    $role = Role::firstOrCreate(['role_name' => $roleName]);

    return User::factory()->create([
        'role_id' => $role->id,
        'status' => 'active',
        'password' => bcrypt('secret'),
    ]);
}

test('students are blocked from the facility booking pages', function () {
    $student = accessUser('student');

    $this->actingAs($student)->get(route('bookings.index'))->assertForbidden();
    $this->actingAs($student)->get(route('bookings.create'))->assertForbidden();
    $this->actingAs($student)->post(route('bookings.store'), [])->assertForbidden();
    $this->actingAs($student)->get(route('bookings.show', 999))->assertForbidden();
    $this->actingAs($student)->put(route('bookings.update', 999), [
        'booking_status' => 'cancelled',
    ])->assertForbidden();
});

test('students are blocked from the laboratory incident report pages', function () {
    $student = accessUser('student');

    $this->actingAs($student)->get(route('incidents.index'))->assertForbidden();
    $this->actingAs($student)->get(route('incidents.create'))->assertForbidden();
    $this->actingAs($student)->post(route('incidents.store'), [])->assertForbidden();
    $this->actingAs($student)->get(route('incidents.show', 999))->assertForbidden();
});

test('students are blocked from booking and incident api endpoints', function () {
    $token = auth('api')->login(accessUser('student'));

    $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/bookings')
        ->assertForbidden();
    $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/bookings', [])
        ->assertForbidden();
    $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/facilities')
        ->assertForbidden();
    $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/incidents')
        ->assertForbidden();
    $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/incidents', [])
        ->assertForbidden();
});

test('faculty and staff still access booking and incident pages', function () {
    $faculty = accessUser('faculty_staff');

    $this->actingAs($faculty)->get(route('bookings.create'))->assertOk();
    $this->actingAs($faculty)->get(route('incidents.create'))->assertOk();
});

test('admins still access booking and incident indexes', function () {
    $admin = accessUser('ict_admin');
    $faculty = accessUser('faculty_staff');

    IncidentReport::create([
        'reported_by' => $faculty->id,
        'incident_type' => 'Equipment damage',
        'incident_description' => 'Monitor cracked during relocation.',
        'incident_date' => '2026-09-01',
        'status' => 'open',
    ]);

    $this->actingAs($admin)->get(route('bookings.index'))->assertOk();
    $this->actingAs($admin)->get(route('incidents.index'))->assertOk();
});

test('admins can view the facility booking create form', function () {
    $admin = accessUser('ict_admin');

    $this->actingAs($admin)->get(route('bookings.create'))->assertOk();
});

test('admins can submit facility bookings', function () {
    $admin = accessUser('ict_admin');
    $facility = Facility::create([
        'facility_name' => 'Computer Laboratory A',
        'facility_type' => 'computer_lab',
        'capacity' => 40,
        'location' => 'Balubal Campus',
        'availability_status' => 'available',
    ]);

    $response = $this->actingAs($admin)->post(route('bookings.store'), [
        'facility_id' => $facility->id,
        'booking_date' => now()->addDays(2)->toDateString(),
        'start_time' => '09:00',
        'end_time' => '11:00',
        'purpose' => 'ICT staff training',
    ]);

    $response->assertRedirect(route('bookings.index'));
    $response->assertSessionHas('status');

    $this->assertDatabaseHas('bookings', [
        'user_id' => $admin->id,
        'facility_id' => $facility->id,
        'booking_status' => 'pending',
    ]);
});
