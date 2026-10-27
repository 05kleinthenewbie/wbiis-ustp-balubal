<?php

use App\Models\Notification;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function mgmtUser(string $roleName, string $status = 'active'): User
{
    $role = Role::firstOrCreate(['role_name' => $roleName]);

    return User::factory()->create(['role_id' => $role->id, 'status' => $status]);
}

test('the user management page lists active and deactivated users', function () {
    $admin = mgmtUser('ict_admin');
    mgmtUser('faculty_staff');
    mgmtUser('student', 'inactive');
    User::factory()->create(['status' => 'pending']);

    $this->actingAs($admin)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('pendingUsers', 1)
            ->has('activeUsers', 1)
            ->has('deactivatedUsers', 1));
});

test('admins can deactivate an active account', function () {
    $admin = mgmtUser('ict_admin');
    $user = mgmtUser('faculty_staff');

    $this->actingAs($admin)
        ->put(route('users.update', $user->id), ['status' => 'inactive'])
        ->assertRedirect();

    $this->assertDatabaseHas('users', ['id' => $user->id, 'status' => 'inactive']);

    expect(Notification::where('user_id', $user->id)->latest('id')->first()->message)
        ->toBe('Your account has been deactivated. Please contact the ICT office for more information.');
});

test('admins can reactivate a deactivated account', function () {
    $admin = mgmtUser('ict_admin');
    $user = mgmtUser('student', 'inactive');

    $this->actingAs($admin)
        ->put(route('users.update', $user->id), ['status' => 'active'])
        ->assertRedirect();

    $this->assertDatabaseHas('users', ['id' => $user->id, 'status' => 'active']);

    expect(Notification::where('user_id', $user->id)->latest('id')->first()->message)
        ->toBe('Your account has been reactivated. You can now log in.');
});

test('rejecting a pending registration keeps the rejection notice', function () {
    $admin = mgmtUser('ict_admin');
    $user = mgmtUser('faculty_staff', 'pending');

    $this->actingAs($admin)
        ->put(route('users.update', $user->id), ['status' => 'inactive'])
        ->assertRedirect();

    expect(Notification::where('user_id', $user->id)->latest('id')->first()->message)
        ->toBe('Your account registration was not approved. Please contact the ICT office for more information.');
    expect($user->refresh()->status)->toBe('rejected');
});

test('rejected registrations are separate from deactivated accounts and must be reviewed again', function () {
    $admin = mgmtUser('ict_admin');
    $rejected = mgmtUser('faculty_staff', 'rejected');
    mgmtUser('faculty_staff', 'inactive');
    $this->actingAs($admin)->get(route('users.index'))
        ->assertInertia(fn (Assert $page) => $page->has('rejectedUsers', 1)->has('deactivatedUsers', 1));
    $this->put(route('users.update', $rejected), ['status' => 'active'])->assertSessionHasErrors('status');
    expect($rejected->refresh()->status)->toBe('rejected');
    $this->put(route('users.update', $rejected), ['status' => 'pending'])->assertRedirect();
    expect($rejected->refresh()->status)->toBe('pending');
});

test('rejected applicants cannot authenticate through web or API login', function () {
    $rejected = mgmtUser('faculty_staff', 'rejected');
    $this->post(route('login.store'), ['email' => $rejected->email, 'password' => 'password'])
        ->assertSessionHasErrors('email');
    $this->assertGuest();
    $this->postJson('/api/v1/auth/login', ['email' => $rejected->email, 'password' => 'password'])
        ->assertForbidden();
});

test('non-admins cannot manage user accounts', function () {
    $faculty = mgmtUser('faculty_staff');
    $target = mgmtUser('student');

    $this->actingAs($faculty)->get(route('users.index'))->assertForbidden();
    $this->actingAs($faculty)
        ->put(route('users.update', $target->id), ['status' => 'inactive'])
        ->assertForbidden();
});

test('the user management page exposes the COR link for pending students', function () {
    Storage::fake('local');
    Storage::disk('local')->put('cor/students/cor.pdf', 'cor contents');

    $admin = mgmtUser('ict_admin');
    $student = mgmtUser('student', 'pending');
    $student->update([
        'cor_path' => 'cor/students/cor.pdf',
        'cor_original_name' => 'cor.pdf',
    ]);

    $this->actingAs($admin)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->where(
                'pendingUsers.0.cor_url',
                route('users.cor', $student->id),
            ));
});

test('a pending student cannot be approved without a COR', function () {
    Storage::fake('local');
    $admin = mgmtUser('ict_admin');
    $student = mgmtUser('student', 'pending');

    $this->actingAs($admin)
        ->put(route('users.update', $student->id), ['status' => 'active'])
        ->assertSessionHasErrors('status');

    expect($student->refresh()->status)->toBe('pending');
});

test('a pending student with a COR can be approved', function () {
    Storage::fake('local');
    Storage::disk('local')->put('cor/students/cor.pdf', 'cor contents');

    $admin = mgmtUser('ict_admin');
    $student = mgmtUser('student', 'pending');
    $student->update([
        'cor_path' => 'cor/students/cor.pdf',
        'cor_original_name' => 'cor.pdf',
    ]);

    $this->actingAs($admin)
        ->put(route('users.update', $student->id), ['status' => 'active'])
        ->assertRedirect();

    expect($student->refresh()->status)->toBe('active');
});

test('admins can download a COR and other users cannot', function () {
    Storage::fake('local');
    Storage::disk('local')->put('cor/students/cor.pdf', 'cor contents');

    $admin = mgmtUser('ict_admin');
    $faculty = mgmtUser('faculty_staff');
    $student = mgmtUser('student', 'pending');
    $student->update([
        'cor_path' => 'cor/students/cor.pdf',
        'cor_original_name' => 'cor.pdf',
    ]);

    $this->actingAs($admin)
        ->get(route('users.cor', $student->id))
        ->assertOk()
        ->assertDownload('cor.pdf');

    $this->actingAs($faculty)
        ->get(route('users.cor', $student->id))
        ->assertForbidden();
});

test('downloading a missing COR returns not found', function () {
    Storage::fake('local');
    $admin = mgmtUser('ict_admin');
    $student = mgmtUser('student', 'pending');

    $this->actingAs($admin)
        ->get(route('users.cor', $student->id))
        ->assertNotFound();
});
