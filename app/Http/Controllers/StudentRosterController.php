<?php

namespace App\Http\Controllers;

use App\Models\StudentRoster;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentRosterController extends Controller
{
    /**
     * Ensure only ICT Admins can manage the student roster.
     */
    private function ensureAdmin(): void
    {
        if (Auth::user()->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can manage the student roster.');
        }
    }

    /**
     * Display the roster with each student's registration status.
     */
    public function index(Request $request): Response
    {
        $this->ensureAdmin();

        return Inertia::render('student-roster/index', [
            'students' => StudentRoster::query()
                ->leftJoin('users', 'users.id_number', '=', 'student_rosters.id_number')
                ->select('student_rosters.*')
                ->selectRaw('users.id as registered_user_id')
                ->orderBy('id_number')
                ->get(),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Add a single student to the roster.
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
        ], [
            'id_number.regex' => 'ID number must be exactly 10 digits (e.g., 2023303709).',
            'id_number.unique' => 'This ID number is already on the roster or registered to an account.',
        ]);

        StudentRoster::create($validated);

        return back()->with('status', 'Student added to the roster.');
    }

    /**
     * Bulk-import students from a CSV file with an
     * id_number,name,program header row.
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

        if ($idIndex === false || $nameIndex === false || $programIndex === false) {
            fclose($handle);

            return back()->withErrors([
                'csv_file' => 'The CSV must have id_number, name, and program columns.',
            ]);
        }

        $imported = 0;
        $skipped = 0;
        $seen = [];

        while (($row = fgetcsv($handle)) !== false) {
            $idNumber = trim((string) ($row[$idIndex] ?? ''));
            $name = trim((string) ($row[$nameIndex] ?? ''));
            $program = strtoupper(trim((string) ($row[$programIndex] ?? '')));

            $valid = preg_match('/^[0-9]{10}$/', $idNumber) === 1
                && $name !== ''
                && mb_strlen($name) <= 255
                && in_array($program, StudentRoster::PROGRAMS, true)
                && ! isset($seen[$idNumber])
                && ! StudentRoster::where('id_number', $idNumber)->exists()
                && ! User::where('id_number', $idNumber)
                    ->whereIn('status', ['pending', 'active'])
                    ->exists();

            if (! $valid) {
                $skipped++;

                continue;
            }

            StudentRoster::create([
                'id_number' => $idNumber,
                'name' => $name,
                'program' => $program,
            ]);

            $seen[$idNumber] = true;
            $imported++;
        }

        fclose($handle);

        return back()->with(
            'status',
            "Imported {$imported} student(s), skipped {$skipped}.",
        );
    }

    /**
     * Remove a student from the roster.
     */
    public function destroy(StudentRoster $studentRoster): RedirectResponse
    {
        $this->ensureAdmin();

        $studentRoster->delete();

        return back()->with('status', 'Student removed from the roster.');
    }
}
