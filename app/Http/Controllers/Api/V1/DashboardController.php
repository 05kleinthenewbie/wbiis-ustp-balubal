<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Booking;
use App\Models\IncidentReport;
use App\Models\InventoryItem;
use App\Models\JobOrder;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends ApiController
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $this->user();

        if ($user === null) {
            abort(401);
        }

        $isAdmin = $this->isAdmin();
        $isStudent = $this->roleName() === 'student';

        if ($isAdmin) {
            $payload = [
                'stats' => [
                    'pendingRequests' => ServiceRequest::where('request_status', 'pending')->count(),
                    'openJobOrders' => JobOrder::whereIn('status', ['open', 'in_progress'])->count(),
                    'pendingBookings' => Booking::where('booking_status', 'pending')->count(),
                    'openIncidents' => IncidentReport::whereIn('status', ['open', 'under_review'])->count(),
                ],
                'requestsByStatus' => ServiceRequest::selectRaw('request_status, count(*) as total')->groupBy('request_status')->pluck('total', 'request_status'),
                'requestsByPriority' => ServiceRequest::whereNotNull('priority_level')->selectRaw('priority_level, count(*) as total')->groupBy('priority_level')->pluck('total', 'priority_level'),
                'jobOrdersByStatus' => JobOrder::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
                'inventorySummary' => InventoryItem::selectRaw('`condition`, count(*) as total')->groupBy('condition')->pluck('total', 'condition'),
                'recentRequests' => ServiceRequest::with('user')->latest()->take(5)->get(),
                'recentJobOrders' => JobOrder::with(['technician', 'serviceRequest'])->latest()->take(5)->get(),
                'recentIncidents' => IncidentReport::with('reporter')->latest()->take(5)->get(),
                'recentBookings' => Booking::with(['user', 'facility'])->latest()->take(5)->get(),
            ];
        } elseif ($isStudent) {
            $payload = [
                'stats' => [
                    'myRequests' => ServiceRequest::where('user_id', $user->id)->count(),
                    'pendingRequests' => ServiceRequest::where('user_id', $user->id)->where('request_status', 'pending')->count(),
                    'approvedRequests' => ServiceRequest::where('user_id', $user->id)->where('request_status', 'approved')->count(),
                ],
                'requestsByStatus' => $this->requestStatusCounts($user->id),
                'recentRequests' => ServiceRequest::with('user')->where('user_id', $user->id)->latest()->take(5)->get(),
            ];
        } else {
            $payload = [
                'stats' => [
                    'myRequests' => ServiceRequest::where('user_id', $user->id)->count(),
                    'pendingRequests' => ServiceRequest::where('user_id', $user->id)->where('request_status', 'pending')->count(),
                    'myBookings' => Booking::where('user_id', $user->id)->count(),
                    'upcomingBookings' => Booking::where('user_id', $user->id)
                        ->where('booking_status', 'approved')
                        ->where('booking_date', '>=', now()->toDateString())
                        ->count(),
                ],
                'requestsByStatus' => $this->requestStatusCounts($user->id),
                'recentRequests' => ServiceRequest::with('user')->where('user_id', $user->id)->latest()->take(5)->get(),
                'recentBookings' => Booking::with(['user', 'facility'])->where('user_id', $user->id)->latest()->take(5)->get(),
            ];
        }

        return response()->json([
            'isAdmin' => $isAdmin,
            'isStudent' => $isStudent,
            'greeting' => $this->greeting(),
            ...$payload,
        ]);
    }

    /**
     * Count the requester's service requests grouped by status.
     */
    private function requestStatusCounts(int $userId): mixed
    {
        return ServiceRequest::where('user_id', $userId)
            ->selectRaw('request_status, count(*) as total')
            ->groupBy('request_status')
            ->pluck('total', 'request_status');
    }

    /**
     * Generate a time-based greeting.
     */
    private function greeting(): string
    {
        return match (true) {
            (int) now()->format('H') < 12 => 'Good morning',
            (int) now()->format('H') < 17 => 'Good afternoon',
            default => 'Good evening',
        };
    }
}
