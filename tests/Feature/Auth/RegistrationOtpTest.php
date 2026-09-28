<?php

use App\Models\Role;
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
