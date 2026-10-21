<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentPasswordResetLinkController extends Controller
{
    /**
     * Display the student forgot-password form.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/student-forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Email a password reset link to a student's Gmail address.
     *
     * Unknown and non-student addresses receive the same response so the form
     * cannot be used to discover which emails belong to students.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $email = Str::lower(trim($validated['email']));

        $student = User::query()
            ->where('email', $email)
            ->whereHas('role', fn ($query) => $query->where('role_name', 'student'))
            ->first();

        if ($student !== null) {
            $status = Password::sendResetLink(['email' => $student->email]);

            if ($status === Password::RESET_THROTTLED) {
                throw ValidationException::withMessages([
                    'email' => __($status),
                ]);
            }
        }

        return back()->with('status', 'Please check your email for the reset details.');
    }
}
