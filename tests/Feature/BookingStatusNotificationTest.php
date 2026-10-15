<?php

use App\Mail\BookingStatusUpdated;
use App\Models\Booking;
use App\Models\Facility;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

function bookingRole(string $name): Role
{
    return Role::firstOrCreate(['role_name' => $name]);
}

function makeBooking(array $overrides = []): array
{
    $owner = User::factory()->create(['role_id' => bookingRole('faculty_staff')->id]);
    $facility = Facility::create(['facility_name' => 'Computer Lab A']);

    $booking = Booking::create([
        'user_id' => $owner->id,
        'facility_id' => $facility->id,
        'booking_date' => '2099-03-15',
        'start_time' => '08:00',
        'end_time' => '10:00',
        'purpose' => 'Class orientation',
        'booking_status' => 'pending',
        ...$overrides,
    ]);

    return [$owner, $facility, $booking];
}

test('approving a booking notifies and emails the owner', function () {
    Mail::fake();

    $admin = User::factory()->create(['role_id' => bookingRole('ict_admin')->id]);
    [$owner, , $booking] = makeBooking();

    $this->actingAs($admin)
        ->put(route('bookings.update', $booking), ['booking_status' => 'approved'])
        ->assertRedirect();

    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'booking_status' => 'approved',
        'approved_by' => $admin->id,
    ]);

    $this->assertDatabaseHas('notifications', [
        'user_id' => $owner->id,
        'notification_type' => 'booking',
        'notification_status' => 'unread',
    ]);

    Mail::assertQueued(BookingStatusUpdated::class, function (BookingStatusUpdated $mail) use ($owner, $booking) {
        return $mail->hasTo($owner->email)
            && $mail->hasSubject('Facility Booking #'.$booking->id.' Approved');
    });
});

test('rejecting a booking notifies and emails the owner', function () {
    Mail::fake();

    $admin = User::factory()->create(['role_id' => bookingRole('ict_admin')->id]);
    [$owner, , $booking] = makeBooking();

    $this->actingAs($admin)
        ->put(route('bookings.update', $booking), ['booking_status' => 'rejected'])
        ->assertRedirect();

    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'booking_status' => 'rejected',
    ]);

    Mail::assertQueued(BookingStatusUpdated::class, function (BookingStatusUpdated $mail) use ($owner, $booking) {
        return $mail->hasTo($owner->email)
            && $mail->hasSubject('Facility Booking #'.$booking->id.' Rejected');
    });
});

test('re-saving the same decision does not resend the email', function () {
    Mail::fake();

    $admin = User::factory()->create(['role_id' => bookingRole('ict_admin')->id]);
    [, , $booking] = makeBooking(['booking_status' => 'approved']);

    $this->actingAs($admin)
        ->put(route('bookings.update', $booking), ['booking_status' => 'approved'])
        ->assertRedirect();

    Mail::assertNotQueued(BookingStatusUpdated::class);
});

test('non admins cannot approve or reject bookings', function () {
    Mail::fake();

    $faculty = User::factory()->create(['role_id' => bookingRole('faculty_staff')->id]);
    [, , $booking] = makeBooking();

    $this->actingAs($faculty)
        ->put(route('bookings.update', $booking), ['booking_status' => 'approved'])
        ->assertForbidden();

    Mail::assertNotQueued(BookingStatusUpdated::class);
});

test('the booking owner can cancel their own pending booking', function () {
    Mail::fake();

    [$owner, , $booking] = makeBooking();

    $this->actingAs($owner)
        ->put(route('bookings.update', $booking), ['booking_status' => 'cancelled'])
        ->assertRedirect();

    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'booking_status' => 'cancelled',
    ]);

    Mail::assertNotQueued(BookingStatusUpdated::class);
});

test('the booking owner cannot cancel someone else booking', function () {
    [, , $booking] = makeBooking();
    $other = User::factory()->create(['role_id' => bookingRole('faculty_staff')->id]);

    $this->actingAs($other)
        ->put(route('bookings.update', $booking), ['booking_status' => 'cancelled'])
        ->assertForbidden();
});

test('the booking owner cannot cancel an already approved booking', function () {
    [$owner, , $booking] = makeBooking(['booking_status' => 'approved']);

    $this->actingAs($owner)
        ->put(route('bookings.update', $booking), ['booking_status' => 'cancelled'])
        ->assertForbidden();
});
