<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\StudentRoster;
use App\Models\User;
use App\Services\StudentAccountProvisioner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentRosterController extends Controller
{
    public function __construct(private StudentAccountProvisioner $provisioner) {}

    /**
     * Ensure only ICT Admins can manage the student roster.
     */
    private function ensureAdmin(): void
    {
        if (Auth::user()->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can manage the student list.');
        }
    }

    /**
     * Display the roster with each student's account status.
     */
    public function index(Request $request): Response
    {
        $this->ensureAdmin();

        $students = StudentRoster::query()
            ->leftJoin('users', 'users.id', '=', 'student_rosters.user_id')
            ->select('student_rosters.*')
            ->selectRaw('users.id as registered_user_id')
            ->selectRaw('users.status as account_suspended')
            ->orderBy('student_rosters.id_number')
            ->get()
            ->map(fn (StudentRoster $student): array => [
                'id' => $student->id,
                'id_number' => $student->id_number,
                'name' => $student->name,
                'program' => $student->program,
                'email' => $student->email,
                'registered_user_id' => $student->registered_user_id,
                'account_status' => $this->accountStatus($student),
            ]);

        return Inertia::render('student-roster/index', [
            'students' => $students,
            'credentials' => $request->session()->get('student_credentials'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Add a single student to the roster and provision their portal account
     * in the same database transaction.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'id_number' => [
                'required',
                'string',
                'regex:/^[0-9]{10}$/',
                Rule::unique(StudentRoster::class, 'id_number'),
                Rule::unique(User::class, 'id_number')
                    ->where(fn ($query) => $query->whereIn('status', ['pending', 'active'])),
            ],
            'name' => ['required', 'string', 'max:255'],
            'program' => ['required', Rule::in(StudentRoster::PROGRAMS)],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(StudentRoster::class, 'email'),
                Rule::unique(User::class, 'email')
                    ->where(fn ($query) => $query
                        ->whereNull('id_number')
                        ->orWhere('id_number', '!=', $request->input('id_number'))),
            ],
        ], [
            'id_number.regex' => 'ID number must be exactly 10 digits (e.g., 2023303709).',
            'id_number.unique' => 'This ID number is already on the student list or registered to an account.',
            'email.required' => 'Enter the student\'s Gmail address so they can reset their password.',
            'email.unique' => 'This email address is already used by another account.',
        ]);

        $provisioned = DB::transaction(function () use ($validated): array {
            $student = StudentRoster::create($validated);

            return $this->provisioner->provision($student);
        });

        AuditLog::record('Provisioned student account', 'users', $provisioned['user']->id);

        return back()
            ->with('status', 'Student added. Their portal account uses their ID number as both the username and the initial password.')
            ->with('student_credentials', [$this->credentialRow($provisioned)]);
    }

    /**
     * Bulk-import students from a CSV file with an
     * id_number,name,program header row. Every imported student receives a
     * portal account inside the same database transaction.
     */
    public function import(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $handle = fopen($request->file('csv_file')->getRealPath(), 'r');

        if ($handle === false) {
            return back()->withErrors(['csv_file' => 'The file could not be read.']);
        }

        $header = fgetcsv($handle);
        $header = array_map(
            fn ($column) => strtolower(trim((string) preg_replace('/^\xEF\xBB\xBF/', '', (string) $column))),
            $header ?? [],
        );

        $idIndex = array_search('id_number', $header, true);
        $nameIndex = array_search('name', $header, true);
        $programIndex = array_search('program', $header, true);
        $emailIndex = array_search('email', $header, true);

        if ($idIndex === false || $nameIndex === false || $programIndex === false || $emailIndex === false) {
            fclose($handle);

            return back()->withErrors([
                'csv_file' => 'The CSV must have id_number, name, program, and email columns.',
            ]);
        }

        [$imported, $skipped, $credentials] = DB::transaction(function () use ($handle, $idIndex, $nameIndex, $programIndex, $emailIndex): array {
            $imported = 0;
            $skipped = 0;
            $seen = [];
            $credentials = [];

            while (($row = fgetcsv($handle)) !== false) {
                $idNumber = trim((string) ($row[$idIndex] ?? ''));
                $name = trim((string) ($row[$nameIndex] ?? ''));
                $program = strtoupper(trim((string) ($row[$programIndex] ?? '')));
                $email = strtolower(trim((string) ($row[$emailIndex] ?? '')));

                $valid = preg_match('/^[0-9]{10}$/', $idNumber) === 1
                    && $name !== ''
                    && mb_strlen($name) <= 255
                    && in_array($program, StudentRoster::PROGRAMS, true)
                    && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
                    && mb_strlen($email) <= 255
                    && ! isset($seen[$idNumber])
                    && ! StudentRoster::where('id_number', $idNumber)->exists()
                    && ! StudentRoster::where('email', $email)->exists()
                    && ! User::where('id_number', $idNumber)
                        ->whereIn('status', ['pending', 'active'])
                        ->exists()
                    && ! User::where('email', $email)
                        ->where(fn ($query) => $query
                            ->whereNull('id_number')
                            ->orWhere('id_number', '!=', $idNumber))
                        ->exists();

                if (! $valid) {
                    $skipped++;

                    continue;
                }

                $student = StudentRoster::create([
                    'id_number' => $idNumber,
                    'name' => $name,
                    'program' => $program,
                    'email' => $email,
                ]);

                $credentials[] = $this->credentialRow(
                    $this->provisioner->provision($student),
                );

                $seen[$idNumber] = true;
                $imported++;
            }

            return [$imported, $skipped, $credentials];
        });

        fclose($handle);

        return back()
            ->with('status', "Imported {$imported} student(s), skipped {$skipped}. Their portal accounts use their ID number as the initial password.")
            ->with('student_credentials', $credentials);
    }

    /**
     * Issue a new temporary password for a student, provisioning the account
     * first when the roster entry does not have one yet.
     */
    public function resetPassword(StudentRoster $studentRoster): RedirectResponse
    {
        $this->ensureAdmin();

        $provisioned = DB::transaction(function () use ($studentRoster): array {
            $user = $studentRoster->user;

            if ($user === null) {
                return $this->provisioner->provision($studentRoster);
            }

            $password = $this->provisioner->resetPassword($user);

            return ['user' => $user->refresh(), 'password' => $password];
        });

        AuditLog::record('Reset student password', 'users', $provisioned['user']->id);

        return back()
            ->with('status', 'The student password has been reset to their ID number.')
            ->with('student_credentials', [$this->credentialRow($provisioned)]);
    }

    /**
     * Remove a student from the roster and disable their portal account.
     * The account itself is kept so historical records stay intact.
     */
    public function destroy(StudentRoster $studentRoster): RedirectResponse
    {
        $this->ensureAdmin();

        DB::transaction(function () use ($studentRoster): void {
            $studentRoster->user?->update(['status' => 'inactive']);
            $studentRoster->delete();
        });

        return back()->with('status', 'Student removed from the list. Their portal account has been disabled.');
    }

    /**
     * Resolve the display status for a roster entry's account.
     */
    private function accountStatus(StudentRoster $student): string
    {
        if ($student->registered_user_id === null) {
            return 'no_account';
        }

        if ($student->account_suspended === 'inactive') {
            return 'disabled';
        }

        return 'active';
    }

    /**
     * Shape a provisioned account into the one-time credential payload
     * shown to the administrator.
     *
     * @param  array{user: User, password: string}  $provisioned
     * @return array{id_number: string, name: string, password: string}
     */
    private function credentialRow(array $provisioned): array
    {
        return [
            'id_number' => (string) $provisioned['user']->id_number,
            'name' => $provisioned['user']->name,
            'password' => $provisioned['password'],
        ];
    }
}
