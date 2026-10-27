<?php

use App\Actions\Fortify\CreateNewUser;
use App\Models\Role;
use App\Models\User;
use Illuminate\Validation\ValidationException;

test('rejected accounts can register again', function () {
    fakeBrevoMail();
    Role::firstOrCreate(['role_name' => 'faculty_staff'], ['description' => 'Faculty and staff']);

    $rejected = User::factory()->create([
        'email' => 'rejected@example.com',
        'status' => 'inactive',
    ]);

    $this->post(route('register.store'), registrationPayload([
        'name' => 'Returning User',
        'email' => 'rejected@example.com',
    ]))->assertRedirect(route('register.otp.show'));

    $this->post(route('register.otp.verify'), ['code' => registrationOtpCode()])
        ->assertRedirect(route('faculty.login'));

    $user = User::where('email', 'rejected@example.com')->first();

    expect($user->id)->toBe($rejected->id)
        ->and($user->status)->toBe('pending')
        ->and(User::where('email', 'rejected@example.com')->count())->toBe(1);
});

test('active emails still cannot register twice', function () {
    Role::firstOrCreate(['role_name' => 'faculty_staff'], ['description' => 'Faculty and staff']);

    User::factory()->create([
        'email' => 'active@example.com',
        'status' => 'active',
    ]);

    expect(fn () => app(CreateNewUser::class)->create([
        'name' => 'Duplicate User',
        'email' => 'active@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'faculty_staff',
    ]))->toThrow(ValidationException::class);
});
