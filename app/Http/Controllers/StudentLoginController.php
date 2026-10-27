<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentLoginController extends Controller
{
    /**
     * Display the dedicated student sign-in form.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/student-login', [
            'status' => $request->session()->get('status'),
            'idNumber' => $request->session()->get('registration_id_number'),
        ]);
    }

    /**
     * Authenticate a student with their ID number and password.
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'id_number' => ['required', 'string', 'regex:/^[0-9]{10}$/'],
            'password' => ['required', 'string'],
        ], [
            'id_number.regex' => 'Enter your 10-digit student ID number.',
        ]);

        $user = User::where('id_number', $credentials['id_number'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'id_number' => 'The ID number and password do not match our records.',
            ]);
        }

        if ($user->role?->role_name !== 'student') {
            throw ValidationException::withMessages([
                'id_number' => 'This sign-in form is for students only. Faculty and staff should use the main login page.',
            ]);
        }

        if ($user->status === 'pending') {
            throw ValidationException::withMessages([
                'id_number' => 'Your account is pending ICT Admin approval. Please contact the ICT office.',
            ]);
        }

        if ($user->status === 'rejected') {
            throw ValidationException::withMessages(['id_number' => 'Your registration was not approved. Please contact the ICT office.']);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'id_number' => 'Your account has been deactivated. Please contact the ICT office.',
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }
}
