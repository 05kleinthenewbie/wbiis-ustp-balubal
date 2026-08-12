<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'pendingUsers' => User::with('role')
                ->where('status', 'pending')
                ->latest()
                ->get(),
            'activeUsers' => User::with('role')
                ->where('status', 'active')
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
        $user->update($validated);

        if ($validated['status'] === 'active') {
            \App\Models\Notification::create([
                'user_id' => $user->id,
                'message' => 'Your account has been approved. You can now log in.',
                'notification_type' => 'account_approval',
                'notification_status' => 'unread',
            ]);
        }

        AuditLog::record(
            "Set user status to {$validated['status']}",
            'users',
            $user->id
        );

        return redirect()->back()->with('status', 'User account updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
