<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\IncidentReport;
use App\Models\InventoryItem;
use App\Models\JobOrder;
use App\Models\ServiceRequest;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
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
                'technicians' => User::whereHas('role', fn ($query) => $query->where('role_name', 'ict_admin'))->count(),
                'unassignedJobOrders' => JobOrder::whereNull('assigned_to')->count(),
                'overdueJobOrders' => JobOrder::whereIn('status', ['open', 'in_progress'])
                    ->whereNotNull('sla_deadline')
                    ->where('sla_deadline', '<', now())
                    ->count(),
                'inventoryExpiryAlerts' => InventoryItem::whereNotNull('expiration_date')
                    ->where(function ($query) {
                        $query->where('expiration_date', '<', now()->startOfDay())
                            ->orWhereBetween('expiration_date', [now()->startOfDay(), now()->addDays(30)->endOfDay()]);
                    })
                    ->count(),
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

            $period = $request->query('period');

            if (! in_array($period, ['week', 'month', 'year'], true)) {
                $period = 'year';
            }

            $periodRange = match ($period) {
                'week' => [now()->subDays(6)->startOfDay(), now()->endOfDay()],
                'month' => [now()->subDays(29)->startOfDay(), now()->endOfDay()],
                default => [now()->subDays(364)->startOfDay(), now()->endOfDay()],
            };

            $overview = [
                'serviceRequests' => [
                    'total' => ServiceRequest::whereBetween('created_at', $periodRange)->count(),
                    'pending' => ServiceRequest::where('request_status', 'pending')->count(),
                ],
                'jobOrders' => [
                    'total' => JobOrder::whereBetween('created_at', $periodRange)->count(),
                    'inProgress' => JobOrder::where('status', 'in_progress')->count(),
                    'unassigned' => $stats['unassignedJobOrders'],
                ],
                'inventory' => [
                    'total' => InventoryItem::count(),
                    'defective' => $inventorySummary['defective'],
                ],
                'bookings' => [
                    'total' => Booking::whereBetween('created_at', $periodRange)->count(),
                    'pending' => $stats['pendingBookings'],
                ],
                'incidents' => [
                    'total' => IncidentReport::whereBetween('created_at', $periodRange)->count(),
                    'unresolved' => $stats['openIncidents'],
                ],
            ];

            $pendingActions = [
                'bookingApprovals' => $stats['pendingBookings'],
                'requestApprovals' => $stats['pendingRequests'],
                'jobOrdersInProgress' => JobOrder::where('status', 'in_progress')->count(),
                'overdueJobOrders' => $stats['overdueJobOrders'],
                'incidentsUnresolved' => $stats['openIncidents'],
            ];

            $overview['pendingActions'] = ['total' => array_sum($pendingActions)];

            $inventoryAlerts = [
                'expiringSoon' => InventoryItem::whereNotNull('expiration_date')
                    ->whereBetween('expiration_date', [now()->startOfDay(), now()->addDays(30)->endOfDay()])
                    ->count(),
                'expired' => InventoryItem::whereNotNull('expiration_date')
                    ->where('expiration_date', '<', now()->startOfDay())
                    ->count(),
                'defective' => $inventorySummary['defective'],
                'underRepair' => $inventorySummary['under_repair'],
            ];

            $activitySeries = $this->buildActivitySeries($period);

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
            $period = null;
            $overview = null;
            $pendingActions = null;
            $inventoryAlerts = null;
            $activitySeries = null;
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'isAdmin' => $isAdmin,
            'greeting' => $greeting,
            'period' => $period,
            'overview' => $overview,
            'pendingActions' => $pendingActions,
            'inventoryAlerts' => $inventoryAlerts,
            'activitySeries' => $activitySeries,
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

    /**
     * Build the monthly system activity chart data for the selected period.
     *
     * @return array{labels: string[], bookings: int[], requests: int[], jobOrders: int[]}
     */
    private function buildActivitySeries(string $period): array
    {
        $driver = DB::connection()->getDriverName();

        $dayExpression = $driver === 'sqlite'
            ? "strftime('%Y-%m-%d', created_at)"
            : 'DATE_FORMAT(created_at, "%Y-%m-%d")';

        $monthExpression = $driver === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : 'DATE_FORMAT(created_at, "%Y-%m")';

        $labels = [];
        $bookings = [];
        $requests = [];
        $jobOrders = [];

        if ($period === 'week') {
            $start = now()->subDays(6)->startOfDay();

            $bookingCounts = $this->countByDate(Booking::class, $dayExpression, $start);
            $requestCounts = $this->countByDate(ServiceRequest::class, $dayExpression, $start);
            $jobOrderCounts = $this->countByDate(JobOrder::class, $dayExpression, $start);

            for ($i = 6; $i >= 0; $i--) {
                $day = now()->subDays($i);
                $key = $day->format('Y-m-d');

                $labels[] = $day->format('D');
                $bookings[] = (int) $bookingCounts->get($key, 0);
                $requests[] = (int) $requestCounts->get($key, 0);
                $jobOrders[] = (int) $jobOrderCounts->get($key, 0);
            }

            return compact('labels', 'bookings', 'requests', 'jobOrders');
        }

        if ($period === 'month') {
            $start = now()->subDays(29)->startOfDay();

            $bookingCounts = $this->countByDate(Booking::class, $dayExpression, $start);
            $requestCounts = $this->countByDate(ServiceRequest::class, $dayExpression, $start);
            $jobOrderCounts = $this->countByDate(JobOrder::class, $dayExpression, $start);

            for ($i = 5; $i >= 0; $i--) {
                $bucketEnd = now()->subDays($i * 5);
                $bucketStart = $bucketEnd->copy()->subDays(4);

                $labels[] = $bucketStart->format('M j');
                $bookings[] = $this->sumBucket($bookingCounts, $bucketStart, $bucketEnd);
                $requests[] = $this->sumBucket($requestCounts, $bucketStart, $bucketEnd);
                $jobOrders[] = $this->sumBucket($jobOrderCounts, $bucketStart, $bucketEnd);
            }

            return compact('labels', 'bookings', 'requests', 'jobOrders');
        }

        $start = now()->subMonths(11)->startOfMonth();

        $bookingCounts = $this->countByDate(Booking::class, $monthExpression, $start);
        $requestCounts = $this->countByDate(ServiceRequest::class, $monthExpression, $start);
        $jobOrderCounts = $this->countByDate(JobOrder::class, $monthExpression, $start);

        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $key = $month->format('Y-m');

            $labels[] = $month->format('M');
            $bookings[] = (int) $bookingCounts->get($key, 0);
            $requests[] = (int) $requestCounts->get($key, 0);
            $jobOrders[] = (int) $jobOrderCounts->get($key, 0);
        }

        return compact('labels', 'bookings', 'requests', 'jobOrders');
    }

    /**
     * Count model rows grouped by a driver-specific date expression.
     *
     * @return Collection<string, int>
     */
    private function countByDate(string $model, string $dateExpression, CarbonInterface $start): Collection
    {
        return $model::query()
            ->where('created_at', '>=', $start)
            ->toBase()
            ->selectRaw("{$dateExpression} as bucket, COUNT(*) as total")
            ->groupBy('bucket')
            ->pluck('total', 'bucket');
    }

    /**
     * Sum per-day counts across a bucket range.
     *
     * @param  Collection<string, int>  $counts
     */
    private function sumBucket(Collection $counts, CarbonInterface $start, CarbonInterface $end): int
    {
        $total = 0;

        for ($day = $start->copy(); $day->lte($end); $day = $day->addDay()) {
            $total += (int) $counts->get($day->format('Y-m-d'), 0);
        }

        return $total;
    }
}
