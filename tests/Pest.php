<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Configure Brevo credentials and fake outbound HTTP for mail tests.
 */
function fakeBrevoMail(): void
{
    config()->set('services.brevo.key', 'test-key');
    config()->set('services.brevo.sender_email', 'noreply@example.com');
    config()->set('services.brevo.sender_name', 'Test App');

    Http::fake([
        'api.brevo.com/*' => Http::response(['messageId' => 'test-id'], 201),
    ]);
}

/**
 * A payload accepted by the web registration flow.
 *
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function registrationPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'faculty_staff',
        'terms' => 'on',
    ], $overrides);
}

/**
 * Extract the six-digit OTP from the most recently recorded Brevo email.
 */
function registrationOtpCode(): string
{
    $recorded = Http::recorded()->last();

    if ($recorded === null) {
        return '';
    }

    $body = $recorded[0]->body();
    $decoded = json_decode($body, true);
    $html = is_array($decoded) && isset($decoded['htmlContent'])
        ? (string) $decoded['htmlContent']
        : $body;

    preg_match('/\b\d{6}\b/', $html, $matches);

    return $matches[0] ?? '';
}
