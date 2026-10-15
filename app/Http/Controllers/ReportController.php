<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\IncidentReport;
use App\Models\InventoryItem;
use App\Models\JobOrder;
use App\Models\ServiceRequest;
use App\Models\UserLiability;
use App\Services\SlaService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    private function ensureAdmin(): void
    {
        if (Auth::user()->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can view reports.');
        }
    }

    public function index()
    {
        $this->ensureAdmin();

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
            'slaMetrics' => SlaService::getMetrics(),
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
                'liabilities_assigned' => UserLiability::count(),
                'liabilities_settled' => UserLiability::where('liability_status', 'settled')->count(),
            ],
        ]);
    }

    /**
     * Export the report summary as a CSV file.
     */
    public function export()
    {
        $this->ensureAdmin();

        $rows = [
            ['Module', 'Metric', 'Value'],
        ];

        $appendBreakdown = function (string $module, string $metric, $counts) use (&$rows) {
            $rows[] = [$module, $metric.' (total)', (string) array_sum(is_array($counts) ? $counts : $counts->all())];

            foreach ($counts as $key => $count) {
                $rows[] = [$module, $metric.' — '.$key, (string) $count];
            }
        };

        $appendBreakdown('Service Requests', 'By status', ServiceRequest::selectRaw('request_status, count(*) as total')
            ->groupBy('request_status')
            ->pluck('total', 'request_status'));

        $appendBreakdown('Job Orders', 'By status', JobOrder::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status'));

        $rows[] = ['Job Orders', 'Average rating', (string) round((float) JobOrder::whereNotNull('rating')->avg('rating'), 1)];
        $rows[] = ['Job Orders', 'Rated count', (string) JobOrder::whereNotNull('rating')->count()];

        $appendBreakdown('Inventory', 'By condition', InventoryItem::selectRaw('`condition`, count(*) as total')
            ->groupBy('condition')
            ->pluck('total', 'condition'));

        $appendBreakdown('Bookings', 'By status', Booking::selectRaw('booking_status, count(*) as total')
            ->groupBy('booking_status')
            ->pluck('total', 'booking_status'));

        $appendBreakdown('Incidents', 'By status', IncidentReport::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status'));

        $appendBreakdown('Incidents', 'By type', IncidentReport::selectRaw('incident_type, count(*) as total')
            ->groupBy('incident_type')
            ->pluck('total', 'incident_type'));

        $rows[] = ['Liabilities', 'Assigned', (string) UserLiability::count()];
        $rows[] = ['Liabilities', 'Settled', (string) UserLiability::where('liability_status', 'settled')->count()];
        $rows[] = ['Liabilities', 'Waived', (string) UserLiability::where('liability_status', 'waived')->count()];
        $rows[] = ['Liabilities', 'Pending', (string) UserLiability::where('liability_status', 'pending')->count()];

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            foreach ($rows as $row) {
                fputcsv($handle, $row, ',', '"', '\\');
            }
            fclose($handle);
        }, 'ict-reports-'.now()->format('Ymd-His').'.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
