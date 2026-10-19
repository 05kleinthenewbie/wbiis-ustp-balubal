<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Role;
use App\Models\User;
use App\Services\BrevoMailService;
use App\Services\RegistrationOtpService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use RuntimeException;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function __construct(
        private RegistrationOtpService $registrationOtp,
        private BrevoMailService $mail,
    ) {}

    /**
     * Validate the registration request, email a one-time code to the
     * applicant, and redirect to the OTP verification step. The account
     * itself is only created once the code has been confirmed.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $this->validateInput($input);

        Validator::make($input, [
            'terms' => ['accepted'],
        ], [
            'terms.accepted' => 'You must agree to the Terms of Service and Privacy Policy to continue.',
        ])->validate();

        $email = (string) $input['email'];
        $this->throttleOtpRequest($email);

        $code = $this->registrationOtp->issue($email, $input);

        try {
            $this->mail->sendRegistrationOtpEmail(
                $email,
                (string) $input['name'],
                $code,
                RegistrationOtpService::EXPIRY_MINUTES,
            );
        } catch (RuntimeException|ConnectionException $exception) {
            report($exception);
            $this->registrationOtp->forget($email);

            throw ValidationException::withMessages([
                'email' => 'We could not send a verification code to your email address. Please try again.',
            ]);
        }

        session()->put('registration_otp_email', $email);

        throw new HttpResponseException(
            redirect()->route('register.otp.show')->with(
                'status',
                "We sent a 6-digit verification code to {$email}. Enter it below to finish creating your account.",
            ),
        );
    }

    /**
     * Create the user account once the emailed OTP has been verified.
     *
     * @param  array<string, string>  $input
     */
    public function createVerified(array $input): User
    {
        return DB::transaction(function () use ($input) {
            $role = Role::where('role_name', $input['role'])->firstOrFail();

            $rejected = User::where('email', $input['email'])
                ->where('status', 'inactive')
                ->first();

            if ($rejected !== null) {
                $rejected->update([
                    'name' => $input['name'],
                    'password' => $input['password'],
                    'role_id' => $role->id,
                    'department' => $input['department'] ?? null,
                    'status' => 'pending',
                    'email_verified_at' => null,
                ]);

                return $rejected->refresh();
            }

            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'role_id' => $role->id,
                'department' => $input['department'] ?? null,
                'status' => 'pending',
            ]);

            return $user;
        });
    }

    /**
     * Validate the registration input and create the account immediately,
     * skipping the email OTP step. Used by API clients that cannot complete
     * the browser-based verification flow.
     *
     * @param  array<string, string>  $input
     */
    public function createWithoutEmailVerification(array $input): User
    {
        $this->validateInput($input);

        return $this->createVerified($input);
    }

    /**
     * Validate the raw registration input.
     *
     * @param  array<string, string>  $input
     */
    private function validateInput(array $input): void
    {
        Validator::make($input, [
            'name' => $this->nameRules(),
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                // Rejected (inactive) accounts may register again, so only
                // pending/active emails block a new registration.
                Rule::unique(User::class)->where(fn ($query) => $query->whereIn('status', ['pending', 'active'])),
            ],
            'role' => ['required', Rule::in(['faculty_staff', 'student'])],
            'department' => [
                'required_if:role,student',
                'nullable',
                'string',
                'max:100',
                Rule::when(
                    ($input['role'] ?? null) === 'student',
                    Rule::in(['BSA', 'BSIT', 'BTLED']),
                ),
            ],
            'password' => $this->passwordRules(),
        ])->validate();
    }

    /**
     * Limit how many verification codes can be requested for one address.
     */
    private function throttleOtpRequest(string $email): void
    {
        $key = 'registration-otp:'.Str::lower($email).'|'.request()->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            throw ValidationException::withMessages([
                'email' => 'Too many verification codes requested. Please wait a moment and try again.',
            ]);
        }

        RateLimiter::hit($key, 60);
    }
}
