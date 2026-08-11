<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\IncidentReport;
use App\Models\InventoryItem;
use App\Models\JobOrder;
use App\Models\ServiceRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        if (Auth::user()->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can view reports.');
        }

        return Inertia::render('reports/index', [
            'requestStats' => [
                'total' => ServiceRequest::count(),
                'by_status' => ServiceRequest::selectRaw('request_status, count(*) as total')
                    ->groupBy('request_status')
                    ->pluck('total', 'request_status'),
            ],
            'jobOrderStats' => [
                'total' => JobOrder::count(),
                'by_status' => JobOrder::selectRaw('status, count(*) as total')
                    ->groupBy('status')
                    ->pluck('total', 'status'),
                'average_rating' => round((float) JobOrder::whereNotNull('rating')->avg('rating'), 1),
                'rated_count' => JobOrder::whereNotNull('rating')->count(),
            ],
            'inventoryStats' => [
                'total' => InventoryItem::count(),
                'by_condition' => InventoryItem::selectRaw('`condition`, count(*) as total')
                    ->groupBy('condition')
                    ->pluck('total', 'condition'),
            ],
            'bookingStats' => [
                'total' => Booking::count(),
                'by_status' => Booking::selectRaw('booking_status, count(*) as total')
                    ->groupBy('booking_status')
                    ->pluck('total', 'booking_status'),
            ],
            'incidentStats' => [
                'total' => IncidentReport::count(),
                'by_status' => IncidentReport::selectRaw('status, count(*) as total')
                    ->groupBy('status')
                    ->pluck('total', 'status'),
                'by_type' => IncidentReport::selectRaw('incident_type, count(*) as total')
                    ->groupBy('incident_type')
                    ->pluck('total', 'incident_type'),
                'liabilities_assigned' => \App\Models\UserLiability::count(),
                'liabilities_settled' => \App\Models\UserLiability::where('liability_status', 'settled')->count(),
            ],
        ]);
    }
}
