<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Booking;
use App\Models\IncidentReport;
use App\Models\InventoryItem;
use App\Models\JobOrder;
use App\Models\ServiceRequest;
use App\Models\UserLiability;
use App\Services\SlaService;
use Illuminate\Http\JsonResponse;

class ReportController extends ApiController
{
    public function index(): JsonResponse
    {
        $this->ensureAdmin();

        return response()->json([
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
            'slaMetrics' => SlaService::getMetrics(),
            'inventoryStats' => [
                'total' => InventoryItem::count(),
                'by_condition' => InventoryItem::selectRaw('`condition`, count(*) as total')
                    ->groupBy('condition')
                    ->pluck('total', 'condition'),
                'by_status' => InventoryItem::selectRaw('status, count(*) as total')
                    ->groupBy('status')
                    ->pluck('total', 'status'),
                'past_service_life' => InventoryItem::whereIn('status', ['active', 'for_disposal'])
                    ->whereNotNull('expiration_date')
                    ->whereDate('expiration_date', '<', today())
                    ->count(),
                'expiring_soon' => InventoryItem::whereIn('status', ['active', 'for_disposal'])
                    ->whereNotNull('expiration_date')
                    ->whereDate('expiration_date', '>=', today())
                    ->whereDate('expiration_date', '<=', today()->addDays(30))
                    ->count(),
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
                'liabilities_assigned' => UserLiability::count(),
                'liabilities_settled' => UserLiability::where('liability_status', 'settled')->count(),
            ],
        ]);
    }
}
