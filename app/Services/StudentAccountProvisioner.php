<?php

namespace App\Services;

use App\Models\Role;
use App\Models\StudentRoster;
use App\Models\User;
use Illuminate\Support\Str;

class StudentAccountProvisioner
{
    /**
     * Provision or re-provision the portal account for a roster student.
     *
     * Students sign in with their ID number as both the username and the
     * initial password. The password is returned so it can be shown to the
     * administrator; only its hash is ever stored.
     *
     * @return array{user: User, password: string}
     */
    public function provision(StudentRoster $student): array
    {
        $role = Role::firstOrCreate(
            ['role_name' => 'student'],
            ['role_description' => 'Students who can request ICT services and book facilities.'],
        );

        $password = $this->temporaryPasswordFor($student->id_number);
        $email = $student->email ?: $this->emailFor($student->id_number);

        $user = User::where('id_number', $student->id_number)->first();

        if ($user === null) {
            $user = User::create([
                'name' => $student->name,
                'email' => $email,
                'password' => $password,
                'role_id' => $role->id,
                'department' => $student->program,
                'employment_type' => null,
                'id_number' => $student->id_number,
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
        } else {
            $user->update([
                'name' => $student->name,
                'email' => $email,
                'password' => $password,
                'role_id' => $role->id,
                'department' => $student->program,
                'employment_type' => null,
                'status' => 'active',
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);
        }

        $student->forceFill(['user_id' => $user->id])->save();

        return ['user' => $user->refresh(), 'password' => $password];
    }

    /**
     * Restore the initial password for an existing account without changing
     * whether the account is enabled.
     */
    public function resetPassword(User $user): string
    {
        $password = $this->temporaryPasswordFor($user->id_number);

        $user->update([
            'password' => $password,
        ]);

        return $password;
    }

    /**
     * Build the initial password for a student account. Students use their ID
     * number as both username and password, so the first login is predictable
     * and the password change screen forces them to pick a private one.
     */
    public function temporaryPasswordFor(?string $idNumber): string
    {
        if (is_string($idNumber) && preg_match('/^[0-9]{8,}$/', $idNumber) === 1) {
            return $idNumber;
        }

        return Str::password(12, letters: true, numbers: true, symbols: false);
    }

    /**
     * Build a stable, non-deliverable login email for a provisioned student.
     * Students authenticate with their ID number, so this address is only
     * used to satisfy the users table's unique email requirement.
     */
    private function emailFor(string $idNumber): string
    {
        $email = "{$idNumber}@student.ustp.edu.ph";
        $suffix = 1;

        while (User::where('email', $email)->exists()) {
            $email = "{$idNumber}.{$suffix}@student.ustp.edu.ph";
            $suffix++;
        }

        return $email;
    }
}
