<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\IncidentReport;
use App\Models\InventoryItem;
use App\Models\JobOrder;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user()->load('role');

        $isAdmin = $user->role->role_name === 'ict_admin';

        $greeting = 'Welcome';

        if ($isAdmin) {
            $stats = [
                'pendingRequests' => ServiceRequest::where('request_status', 'pending')->count(),
                'openJobOrders' => JobOrder::whereIn('status', ['open', 'in_progress'])->count(),
                'pendingBookings' => Booking::where('booking_status', 'pending')->count(),
                'openIncidents' => IncidentReport::whereIn('status', ['open', 'under_review'])->count(),
            ];

            $requestsByStatus = [
                'pending' => ServiceRequest::where('request_status', 'pending')->count(),
                'approved' => ServiceRequest::where('request_status', 'approved')->count(),
                'rejected' => ServiceRequest::where('request_status', 'rejected')->count(),
                'completed' => ServiceRequest::where('request_status', 'completed')->count(),
            ];

            $requestsByPriority = [
                'low' => ServiceRequest::where('priority_level', 'low')->count(),
                'medium' => ServiceRequest::where('priority_level', 'medium')->count(),
                'high' => ServiceRequest::where('priority_level', 'high')->count(),
                'urgent' => ServiceRequest::where('priority_level', 'urgent')->count(),
            ];

            $jobOrdersByStatus = [
                'open' => JobOrder::where('status', 'open')->count(),
                'in_progress' => JobOrder::where('status', 'in_progress')->count(),
                'completed' => JobOrder::where('status', 'completed')->count(),
                'closed' => JobOrder::where('status', 'closed')->count(),
            ];

            $inventorySummary = [
                'working' => InventoryItem::where('condition', 'working')->count(),
                'defective' => InventoryItem::where('condition', 'defective')->count(),
                'under_repair' => InventoryItem::where('condition', 'under_repair')->count(),
            ];

            $recentRequests = ServiceRequest::with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn (ServiceRequest $r) => [
                    'id' => $r->id,
                    'user_name' => $r->user?->name ?? 'Deleted User',
                    'priority' => $r->priority_level,
                    'status' => $r->request_status,
                    'description' => mb_substr($r->problem_description, 0, 80),
                    'date' => $r->date_requested?->toIso8601String(),
                ]);

            $recentJobOrders = JobOrder::with(['technician', 'serviceRequest'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn (JobOrder $jo) => [
                    'id' => $jo->id,
                    'technician_name' => $jo->technician?->name ?? 'Unassigned',
                    'status' => $jo->status,
                    'date_assigned' => $jo->date_assigned?->toIso8601String(),
                ]);

            $recentIncidents = IncidentReport::with('reporter')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn (IncidentReport $i) => [
                    'id' => $i->id,
                    'reporter_name' => $i->reporter?->name ?? 'Deleted User',
                    'type' => $i->incident_type,
                    'status' => $i->status,
                    'date' => $i->incident_date?->toIso8601String(),
                ]);

            $recentBookings = Booking::with(['user', 'facility'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn (Booking $b) => [
                    'id' => $b->id,
                    'user_name' => $b->user?->name ?? 'Deleted User',
                    'facility' => $b->facility?->facility_name ?? 'Unknown Facility',
                    'status' => $b->booking_status,
                    'date' => $b->booking_date,
                ]);
        } else {
            $stats = [
                'myRequests' => ServiceRequest::where('user_id', $user->id)->count(),
                'pendingRequests' => ServiceRequest::where('user_id', $user->id)
                    ->where('request_status', 'pending')->count(),
            ];

            $requestsByStatus = [
                'pending' => ServiceRequest::where('user_id', $user->id)->where('request_status', 'pending')->count(),
                'approved' => ServiceRequest::where('user_id', $user->id)->where('request_status', 'approved')->count(),
                'rejected' => ServiceRequest::where('user_id', $user->id)->where('request_status', 'rejected')->count(),
                'completed' => ServiceRequest::where('user_id', $user->id)->where('request_status', 'completed')->count(),
            ];

            $requestsByPriority = [
                'low' => ServiceRequest::where('user_id', $user->id)->where('priority_level', 'low')->count(),
                'medium' => ServiceRequest::where('user_id', $user->id)->where('priority_level', 'medium')->count(),
                'high' => ServiceRequest::where('user_id', $user->id)->where('priority_level', 'high')->count(),
                'urgent' => ServiceRequest::where('user_id', $user->id)->where('priority_level', 'urgent')->count(),
            ];

            $recentRequests = ServiceRequest::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get()
                ->map(fn (ServiceRequest $r) => [
                    'id' => $r->id,
                    'user_name' => $user->name,
                    'priority' => $r->priority_level,
                    'status' => $r->request_status,
                    'description' => mb_substr($r->problem_description, 0, 80),
                    'date' => $r->date_requested?->toIso8601String(),
                ]);

            $jobOrdersByStatus = [];
            $inventorySummary = [];
            $recentJobOrders = [];
            $recentIncidents = [];
            $recentBookings = [];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'isAdmin' => $isAdmin,
            'greeting' => $greeting,
            'requestsByStatus' => $requestsByStatus,
            'requestsByPriority' => $requestsByPriority,
            'jobOrdersByStatus' => $jobOrdersByStatus,
            'inventorySummary' => $inventorySummary,
            'recentRequests' => $recentRequests ?? collect(),
            'recentJobOrders' => $recentJobOrders ?? collect(),
            'recentIncidents' => $recentIncidents ?? collect(),
            'recentBookings' => $recentBookings ?? collect(),
        ]);
    }
}
