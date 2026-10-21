<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Role;
use App\Models\StudentRoster;
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

        $this->applyStudentRosterDetails($input);

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
     * Students are activated immediately — the roster check above already
     * proves they belong to the campus, so there is nothing for an admin to
     * approve. Faculty/staff accounts still wait for admin approval.
     *
     * @param  array<string, string>  $input
     */
    public function createVerified(array $input): User
    {
        $this->applyStudentRosterDetails($input);
        $this->applyEmploymentDefaults($input);

        $autoApproved = ($input['role'] ?? null) === 'student';

        return DB::transaction(function () use ($input, $autoApproved) {
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
                    'employment_type' => $input['employment_type'] ?? null,
                    'id_number' => $input['id_number'] ?? null,
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
                'employment_type' => $input['employment_type'] ?? null,
                'id_number' => $input['id_number'] ?? null,
                'status' => $autoApproved ? 'active' : 'pending',
                'email_verified_at' => $autoApproved ? now() : null,
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
            // Faculty declare whether they teach; teaching faculty must pick
            // one of the campus departments below.
            'employment_type' => [
                'required_if:role,faculty_staff',
                'nullable',
                'string',
                Rule::when(
                    ($input['role'] ?? null) === 'faculty_staff',
                    Rule::in(['teaching', 'non_teaching']),
                ),
            ],
            'department' => [
                'required_if:role,student',
                'required_if:employment_type,teaching',
                'nullable',
                'string',
                'max:100',
                Rule::when(
                    ($input['role'] ?? null) === 'student'
                        || ($input['employment_type'] ?? null) === 'teaching',
                    Rule::in(['BSA', 'BSIT', 'BTLED']),
                ),
            ],
            // Students register with their university ID number, which must
            // exist on the ICT-managed roster before an account can be made.
            // The ID is strictly unique: deactivated students must be
            // reactivated by an admin instead of registering a new account.
            'id_number' => [
                'required_if:role,student',
                'nullable',
                'string',
                'max:20',
                'regex:/^[0-9]{10}$/',
                Rule::when(
                    ($input['role'] ?? null) === 'student',
                    [
                        Rule::unique(User::class, 'id_number'),
                        Rule::exists(StudentRoster::class, 'id_number'),
                    ],
                ),
            ],
            'password' => $this->passwordRules(),
        ], [
            'id_number.regex' => 'ID number must be exactly 10 digits (e.g., 2023303709).',
            'id_number.unique' => 'This ID number is already registered to an account.',
            'id_number.exists' => 'ID number not found in the student list. Please visit ICT/Registrar to be enrolled.',
        ])->validate();
    }

    /**
     * For student registrations, replace the submitted name and program with
     * the authoritative details from the roster, and fail when the ID number
     * is no longer (or never was) on the roster.
     *
     * @param  array<string, string>  $input
     */
    private function applyStudentRosterDetails(array &$input): void
    {
        if (($input['role'] ?? null) !== 'student') {
            return;
        }

        $roster = StudentRoster::where('id_number', $input['id_number'] ?? '')->first();

        if ($roster === null) {
            throw ValidationException::withMessages([
                'id_number' => 'ID number not found in the student list. Please visit ICT/Registrar to be enrolled.',
            ]);
        }

        $input['id_number'] = $roster->id_number;
        $input['name'] = $roster->name;
        $input['department'] = $roster->program;
    }

    /**
     * Students never carry an employment type, and only teaching faculty
     * carry a department; everyone else is stored without one.
     *
     * @param  array<string, string>  $input
     */
    private function applyEmploymentDefaults(array &$input): void
    {
        if (($input['role'] ?? null) !== 'faculty_staff') {
            $input['employment_type'] = null;

            return;
        }

        if (($input['employment_type'] ?? null) !== 'teaching') {
            $input['department'] = null;
        }
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
