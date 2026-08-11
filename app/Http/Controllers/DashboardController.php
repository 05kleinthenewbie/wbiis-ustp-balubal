<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\IncidentReport;
use App\Models\JobOrder;
use App\Models\ServiceRequest;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user()->load('role');
        $email = strtolower($user->email);

        $pendingInvitations = TeamInvitation::query()
            ->with(['inviter', 'team'])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->latest()
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);

        $isAdmin = $user->role->role_name === 'ict_admin';

        if ($isAdmin) {
            $stats = [
                'pendingRequests' => ServiceRequest::where('request_status', 'pending')->count(),
                'openJobOrders' => JobOrder::whereIn('status', ['open', 'in_progress'])->count(),
                'pendingBookings' => Booking::where('booking_status', 'pending')->count(),
                'openIncidents' => IncidentReport::whereIn('status', ['open', 'under_review'])->count(),
            ];
        } elseif ($user->role->role_name === 'student') {
            $stats = [
                'myRequests' => ServiceRequest::where('user_id', $user->id)->count(),
                'pendingRequests' => ServiceRequest::where('user_id', $user->id)
                    ->where('request_status', 'pending')->count(),
                'approvedRequests' => ServiceRequest::where('user_id', $user->id)
                    ->where('request_status', 'approved')->count(),
            ];
        } else {
            $stats = [
                'myRequests' => ServiceRequest::where('user_id', $user->id)->count(),
                'pendingRequests' => ServiceRequest::where('user_id', $user->id)
                    ->where('request_status', 'pending')->count(),
                'myBookings' => Booking::where('user_id', $user->id)->count(),
                'upcomingBookings' => Booking::where('user_id', $user->id)
                    ->where('booking_status', 'approved')
                    ->where('booking_date', '>=', now()->toDateString())
                    ->count(),
            ];
        }

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
            'stats' => $stats,
            'isAdmin' => $isAdmin,
            'isStudent' => $user->role->role_name === 'student',
        ]);
    }
}
