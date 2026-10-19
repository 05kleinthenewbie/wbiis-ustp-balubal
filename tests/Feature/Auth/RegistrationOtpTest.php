<?php

use App\Models\Role;
use App\Models\StudentRoster;
use App\Models\User;
use App\Services\RegistrationOtpService;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Role::firstOrCreate(['role_name' => 'faculty_staff'], ['description' => 'Faculty and staff']);
});

test('registering emails an OTP and defers account creation', function () {
    fakeBrevoMail();

    $response = $this->post(route('register.store'), registrationPayload());

    $response->assertRedirect(route('register.otp.show'));
    $this->assertGuest();
    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();

    Http::assertSentCount(1);
    expect(registrationOtpCode())->toHaveLength(6);
});

test('a student can register and is assigned the student role', function () {
    Role::firstOrCreate(['role_name' => 'student'], ['description' => 'Students']);
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'name' => 'Juan Dela Cruz',
        'email' => 'student@ustp.edu.ph',
        'role' => 'student',
        'department' => 'BSIT',
        'id_number' => '2023303709',
    ]))->assertRedirect(route('register.otp.show'));

    $this->post(route('register.otp.verify'), ['code' => registrationOtpCode()])
        ->assertRedirect(route('login'))
        ->assertSessionHas(
            'status',
            'Registration successful! You can now log in to your account.',
        );

    $user = User::where('email', 'student@ustp.edu.ph')->first();

    expect($user)->not->toBeNull()
        ->and($user->status)->toBe('active')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->role->role_name)->toBe('student')
        ->and($user->id_number)->toBe('2023303709')
        ->and($user->department)->toBe('BSIT')
        ->and($user->name)->toBe('Juan S. Dela Cruz');
});

test('a student can log in immediately after registering', function () {
    Role::firstOrCreate(['role_name' => 'student'], ['description' => 'Students']);
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'email' => 'student@ustp.edu.ph',
        'role' => 'student',
        'department' => 'BSIT',
        'id_number' => '2023303709',
    ]));

    $this->post(route('register.otp.verify'), ['code' => registrationOtpCode()])
        ->assertRedirect(route('login'));

    $this->post(route('login'), [
        'email' => 'student@ustp.edu.ph',
        'password' => 'password',
    ])->assertRedirect(route('dashboard'));
});

test('a deactivated student cannot register again with the same id number', function () {
    Role::firstOrCreate(['role_name' => 'student'], ['description' => 'Students']);
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);
    User::factory()->create([
        'email' => 'blocked@ustp.edu.ph',
        'status' => 'inactive',
        'id_number' => '2023303709',
        'role_id' => Role::firstOrCreate(['role_name' => 'student'])->id,
    ]);
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'email' => 'new@ustp.edu.ph',
        'role' => 'student',
        'department' => 'BSIT',
        'id_number' => '2023303709',
    ]))->assertSessionHasErrors('id_number');

    Http::assertNothingSent();
    expect(User::where('email', 'new@ustp.edu.ph')->exists())->toBeFalse();
});

test('a student registration without a rostered id number is rejected', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'role' => 'student',
        'department' => 'BSIT',
        'id_number' => '9999999999',
    ]))->assertSessionHasErrors('id_number');

    Http::assertNothingSent();
    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});

test('a student registration with an invalid department is rejected', function () {
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'role' => 'student',
        'department' => 'CITC',
        'id_number' => '2023303709',
    ]))->assertSessionHasErrors('department');

    Http::assertNothingSent();
});

test('a student registration without a department is rejected', function () {
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'role' => 'student',
        'department' => null,
        'id_number' => '2023303709',
    ]))->assertSessionHasErrors('department');

    Http::assertNothingSent();
});

test('a faculty registration without a department is accepted', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'department' => null,
    ]))->assertRedirect(route('register.otp.show'));

    $this->post(route('register.otp.verify'), ['code' => registrationOtpCode()])
        ->assertRedirect(route('login'));

    expect(User::where('email', 'test@example.com')->first()->department)->toBeNull();
});

test('a faculty registration without an employment type is rejected', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'employment_type' => null,
    ]))->assertSessionHasErrors('employment_type');

    Http::assertNothingSent();
    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});

test('a teaching faculty registration requires a department', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'employment_type' => 'teaching',
        'department' => null,
    ]))->assertSessionHasErrors('department');

    Http::assertNothingSent();
    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});

test('a teaching faculty registration is stored with their department', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'employment_type' => 'teaching',
        'department' => 'BSIT',
    ]))->assertRedirect(route('register.otp.show'));

    $this->post(route('register.otp.verify'), ['code' => registrationOtpCode()])
        ->assertRedirect(route('login'));

    $user = User::where('email', 'test@example.com')->first();

    expect($user->employment_type)->toBe('teaching')
        ->and($user->department)->toBe('BSIT');
});

test('a non-teaching faculty registration stores no department', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'employment_type' => 'non_teaching',
        'department' => 'CITC',
    ]))->assertRedirect(route('register.otp.show'));

    $this->post(route('register.otp.verify'), ['code' => registrationOtpCode()])
        ->assertRedirect(route('login'));

    $user = User::where('email', 'test@example.com')->first();

    expect($user->employment_type)->toBe('non_teaching')
        ->and($user->department)->toBeNull();
});

test('the OTP verification page renders', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload());

    $this->get(route('register.otp.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/register-otp')
            ->where('email', 'test@example.com'));
});

test('the OTP page redirects to registration without a pending session', function () {
    $this->get(route('register.otp.show'))->assertRedirect(route('register'));
});

test('a correct OTP creates the account', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload());
    $code = registrationOtpCode();

    $this->post(route('register.otp.verify'), ['code' => $code])
        ->assertRedirect(route('login'))
        ->assertSessionHas('status');

    $user = User::where('email', 'test@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->status)->toBe('pending')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and(cache(RegistrationOtpService::key('test@example.com')))->toBeNull()
        ->and(session('registration_otp_email'))->toBeNull();
});

test('an incorrect OTP is rejected but the account can still be created', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload());
    $code = registrationOtpCode();

    $this->post(route('register.otp.verify'), ['code' => '000000'])
        ->assertSessionHasErrors('code');

    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();

    $this->post(route('register.otp.verify'), ['code' => $code])
        ->assertRedirect(route('login'));

    expect(User::where('email', 'test@example.com')->exists())->toBeTrue();
});

test('an expired OTP cannot be verified', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload());
    $code = registrationOtpCode();

    $this->travel(RegistrationOtpService::EXPIRY_MINUTES + 1)->minutes();

    $this->post(route('register.otp.verify'), ['code' => $code])
        ->assertSessionHasErrors('email');

    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});

test('too many incorrect attempts invalidate the OTP', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload());
    $code = registrationOtpCode();

    foreach (range(1, RegistrationOtpService::MAX_ATTEMPTS) as $attempt) {
        $this->post(route('register.otp.verify'), ['code' => '000000'])
            ->assertSessionHasErrors('code');
    }

    $this->post(route('register.otp.verify'), ['code' => $code])
        ->assertSessionHasErrors('email');

    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});

test('resending issues a new code that replaces the old one', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload());
    $first = registrationOtpCode();

    $this->post(route('register.otp.resend'))
        ->assertRedirect(route('register.otp.show'))
        ->assertSessionHas('status');

    Http::assertSentCount(2);

    $second = registrationOtpCode();
    expect($second)->toHaveLength(6);

    $this->post(route('register.otp.verify'), ['code' => $first])
        ->assertSessionHasErrors('code');

    $this->post(route('register.otp.verify'), ['code' => $second])
        ->assertRedirect(route('login'));
});

test('registration OTP requests are rate limited', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload());
    $this->post(route('register.otp.resend'));
    $this->post(route('register.otp.resend'));

    $this->post(route('register.otp.resend'))
        ->assertSessionHasErrors('resend');

    Http::assertSentCount(3);
});

test('a failed OTP send reports an error and creates nothing', function () {
    Http::fake(['api.brevo.com/*' => Http::response('Server error', 500)]);

    $this->post(route('register.store'), registrationPayload())
        ->assertSessionHasErrors('email');

    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});

test('registration validation failures do not send an OTP', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'password_confirmation' => 'mismatched',
    ]))->assertSessionHasErrors('password');

    Http::assertNothingSent();
    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});

test('registering requires agreeing to the terms and privacy policy', function () {
    fakeBrevoMail();

    $this->post(route('register.store'), registrationPayload([
        'terms' => null,
    ]))->assertSessionHasErrors('terms');

    Http::assertNothingSent();
    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});
