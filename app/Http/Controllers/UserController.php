<?php

namespace App\Http\Controllers;

use App\Events\UserApproved;
use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Ensure only ICT Admins can manage users.
     */
    private function ensureAdmin(): void
    {
        if (Auth::user()->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can manage user accounts.');
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->ensureAdmin();

        return Inertia::render('users/index', [
            'status' => session('status'),
            'error' => session('error'),
            'pendingUsers' => User::with('role')
                ->where('status', 'pending')
                ->latest()
                ->get(),
            'activeUsers' => User::with('role')
                ->where('status', 'active')
                ->where('id', '!=', Auth::id())
                ->latest()
                ->get(),
            'deactivatedUsers' => User::with('role')
                ->where('status', 'inactive')
                ->where('id', '!=', Auth::id())
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Create a new technician record for job order assignments.
     *
     * The technician account is managed by the admin only; no login
     * credentials are issued, so a random unusable password is set.
     */
    public function storeTechnician(Request $request)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:100'],
            'contact_no' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]{7,20}$/'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
        ], [
            'contact_no.regex' => 'Please enter a valid Philippine phone number (e.g. 0917 123 4567).',
        ]);

        $technician = User::create([
            'name' => $validated['name'],
            'department' => $validated['department'] ?? null,
            'contact_no' => $validated['contact_no'] ?? null,
            'email' => $validated['email'] ?? 'technician-'.Str::lower(Str::random(12)).'@no-login.local',
            'password' => Hash::make(Str::random(40)),
            'role_id' => Role::firstOrCreate(['role_name' => 'ict_admin'])->id,
            'status' => 'active',
        ]);

        AuditLog::record(
            'Added new technician '.$technician->name,
            'users',
            $technician->id,
        );

        return redirect()->back()->with('status', 'Technician added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'status' => ['required', 'in:pending,active,inactive'],
        ]);

        $user = User::findOrFail($id);
        $previousStatus = $user->status;
        $user->update($validated);

        if ($validated['status'] === 'active') {
            Notification::create([
                'user_id' => $user->id,
                'message' => $previousStatus === 'inactive'
                    ? 'Your account has been reactivated. You can now log in.'
                    : 'Your account has been approved. You can now log in.',
                'notification_type' => 'account_approval',
                'link' => '/dashboard',
                'notification_status' => 'unread',
            ]);

            if ($user->wasChanged('status')) {
                UserApproved::dispatch($user);
            }
        } elseif ($validated['status'] === 'inactive') {
            Notification::create([
                'user_id' => $user->id,
                'message' => $previousStatus === 'active'
                    ? 'Your account has been deactivated. Please contact the ICT office for more information.'
                    : 'Your account registration was not approved. Please contact the ICT office for more information.',
                'notification_type' => 'account_rejection',
                'link' => '/dashboard',
                'notification_status' => 'unread',
            ]);
        }

        AuditLog::record(
            "Set user status to {$validated['status']}",
            'users',
            $user->id,
            null,
            ['status' => $previousStatus],
            ['status' => $user->status],
        );

        return redirect()->back()->with('status', 'User account updated successfully.');
    }
}
