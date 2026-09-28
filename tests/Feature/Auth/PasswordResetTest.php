<?php

use App\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::resetPasswords());
});

test('reset password link screen can be rendered', function () {
    $response = $this->get(route('password.request'));

    $response->assertOk();
});

test('reset password link can be requested', function () {
    fakeBrevoMail();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    Http::assertSentCount(1);

    Http::assertSent(function (Request $request) use ($user) {
        return $request->url() === 'https://api.brevo.com/v3/smtp/email'
            && $request['to'][0]['email'] === $user->email
            && str_contains($request['subject'], 'Reset your');
    });

    expect(passwordResetUrl())->toStartWith(url('reset-password/'))
        ->and(passwordResetToken())->not->toBe('');
});

test('reset password screen can be rendered', function () {
    fakeBrevoMail();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    $this->get(passwordResetUrl())->assertOk();
});

test('password can be reset with valid token', function () {
    fakeBrevoMail();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    $response = $this->post(route('password.update'), [
        'token' => passwordResetToken(),
        'email' => $user->email,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('login'));
});

test('password cannot be reset with invalid token', function () {
    $user = User::factory()->create();

    $response = $this->post(route('password.update'), [
        'token' => 'invalid-token',
        'email' => $user->email,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertSessionHasErrors('email');
});

test('a failed password reset email surfaces an error', function () {
    config()->set('services.brevo.key', 'test-key');
    config()->set('services.brevo.sender_email', 'noreply@example.com');
    config()->set('services.brevo.sender_name', 'Test App');

    Http::fake([
        'api.brevo.com/*' => Http::response(['message' => 'Error'], 500),
    ]);

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email])
        ->assertSessionHasErrors('email');
});
