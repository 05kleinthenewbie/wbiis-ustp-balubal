<?php

namespace App\Actions\Fortify;

use App\Actions\Teams\CreateTeam;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function __construct(private CreateTeam $createTeam)
    {
        //
    }

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
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
            'role' => ['required', Rule::in(['faculty_staff'])],
            'password' => $this->passwordRules(),
        ])->validate();

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
                    'department' => null,
                    'status' => 'pending',
                    'email_verified_at' => null,
                ]);

                if (! $rejected->ownedTeams()->exists()) {
                    $this->createTeam->handle($rejected, $rejected->name."'s Team", isPersonal: true);
                }

                return $rejected->refresh();
            }

            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'role_id' => $role->id,
                'department' => null,
                'status' => 'pending',
            ]);

            $this->createTeam->handle($user, $user->name."'s Team", isPersonal: true);

            return $user;
        });
    }
}
