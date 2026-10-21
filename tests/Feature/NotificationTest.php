<?php

use App\Models\Notification;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('notifications are shared with a deep link for the bell', function () {
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $user = User::factory()->create(['role_id' => $role->id]);

    Notification::create([
        'user_id' => $user->id,
        'message' => 'Your booking has been approved.',
        'notification_type' => 'booking',
        'link' => '/bookings/7',
        'notification_status' => 'unread',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('notifications.0.link', '/bookings/7'));
});

test('guests cannot mark a notification as read', function () {
    $user = User::factory()->create();
    $notification = Notification::create([
        'user_id' => $user->id,
        'message' => 'Test notification',
        'notification_status' => 'unread',
    ]);

    $this->post(route('notifications.read', $notification->id))
        ->assertRedirect(route('login'));
});

test('users can mark one notification as read', function () {
    $user = User::factory()->create();
    $notification = Notification::create([
        'user_id' => $user->id,
        'message' => 'Test notification',
        'notification_status' => 'unread',
    ]);

    $this->actingAs($user)
        ->post(route('notifications.read', $notification->id))
        ->assertRedirect();

    $this->assertDatabaseHas('notifications', [
        'id' => $notification->id,
        'notification_status' => 'read',
    ]);
});

test('users cannot mark another user notification as read', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $notification = Notification::create([
        'user_id' => $owner->id,
        'message' => 'Test notification',
        'notification_status' => 'unread',
    ]);

    $this->actingAs($otherUser)
        ->post(route('notifications.read', $notification->id))
        ->assertNotFound();

    $this->assertDatabaseHas('notifications', [
        'id' => $notification->id,
        'notification_status' => 'unread',
    ]);
});

test('users can mark all notifications as read', function () {
    $user = User::factory()->create();
    Notification::create([
        'user_id' => $user->id,
        'message' => 'First',
        'notification_status' => 'unread',
    ]);
    Notification::create([
        'user_id' => $user->id,
        'message' => 'Second',
        'notification_status' => 'unread',
    ]);

    $this->actingAs($user)
        ->post(route('notifications.read-all'))
        ->assertRedirect();

    $this->assertDatabaseMissing('notifications', [
        'user_id' => $user->id,
        'notification_status' => 'unread',
    ]);
});

test('users can delete their own notification', function () {
    $user = User::factory()->create();
    $notification = Notification::create([
        'user_id' => $user->id,
        'message' => 'Test notification',
    ]);

    $this->actingAs($user)
        ->delete(route('notifications.destroy', $notification->id))
        ->assertRedirect();

    $this->assertDatabaseMissing('notifications', [
        'id' => $notification->id,
    ]);
});

test('users cannot delete another user notification', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $notification = Notification::create([
        'user_id' => $owner->id,
        'message' => 'Test notification',
    ]);

    $this->actingAs($otherUser)
        ->delete(route('notifications.destroy', $notification->id))
        ->assertNotFound();

    $this->assertDatabaseHas('notifications', [
        'id' => $notification->id,
    ]);
});
