<?php

use App\Models\Booking;
use App\Models\Facility;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function bookingPagesUser(string $roleName): User
{
    $role = Role::firstOrCreate(['role_name' => $roleName]);

    return User::factory()->create([
        'role_id' => $role->id,
        'status' => 'active',
    ]);
}

function bookingPagesFacility(string $name = 'Computer Laboratory A'): Facility
{
    return Facility::create([
        'facility_name' => $name,
        'facility_type' => 'computer_lab',
        'capacity' => 40,
        'location' => 'ICT Building',
        'availability_status' => 'available',
    ]);
}

function bookingPagesBooking(User $owner, Facility $facility, string $status, string $date = '2099-03-14'): Booking
{
    return Booking::create([
        'user_id' => $owner->id,
        'facility_id' => $facility->id,
        'booking_date' => $date,
        'start_time' => '08:00',
        'end_time' => '10:00',
        'purpose' => 'Lab session',
        'booking_status' => $status,
    ]);
}

test('admins can view the booking approvals queue', function () {
    $admin = bookingPagesUser('ict_admin');
    $faculty = bookingPagesUser('faculty_staff');
    $facility = bookingPagesFacility();
    $pending = bookingPagesBooking($faculty, $facility, 'pending');
    bookingPagesBooking($faculty, $facility, 'approved', '2099-03-15');

    $this->actingAs($admin)
        ->get('/bookings/approvals')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('bookings/approvals')
            ->has('bookings', 1)
            ->where('bookings.0.id', $pending->id)
            ->where('stats.pending', 1)
            ->where('stats.approved', 1));
});

test('faculty and students cannot view the booking approvals queue', function () {
    $faculty = bookingPagesUser('faculty_staff');
    $student = bookingPagesUser('student');

    $this->actingAs($faculty)->get('/bookings/approvals')->assertForbidden();
    $this->actingAs($student)->get('/bookings/approvals')->assertForbidden();
});
