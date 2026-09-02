<?php

namespace App\Services;

use App\Models\JobOrder;
use App\Models\ServiceRequest;
use Carbon\Carbon;

class SlaService
{
    /**
     * Calculate initial response deadline (24 hours from request).
     */
    public static function calculateResponseDeadline(ServiceRequest $request): Carbon
    {
        return Carbon::instance($request->date_requested)->addHours(24);
    }

    /**
     * Calculate resolution deadline based on priority.
     */
    public static function calculateResolutionDeadline(JobOrder $jobOrder): ?Carbon
    {
        if ($jobOrder->date_assigned === null) {
            return null;
        }

        $priority = $jobOrder->priority_level ?? $jobOrder->serviceRequest->priority_level ?? 'medium';

        $hours = match ($priority) {
            'urgent' => 24,
            'high' => 48,
            'medium' => 72,
            'low' => 120, // 5 business days
        };

        return Carbon::instance($jobOrder->date_assigned)->addHours($hours);
    }

    /**
     * Update SLA status for a service request.
     */
    public static function updateRequestSlaStatus(ServiceRequest $request): void
    {
        if ($request->request_status !== 'pending' || $request->sla_deadline === null) {
            return;
        }

        $now = Carbon::now();
        $deadline = $request->sla_deadline;
        $hoursUntilDeadline = $now->diffInHours($deadline, false);

        $status = match (true) {
            $hoursUntilDeadline < 0 => 'breached',
            $hoursUntilDeadline < 6 => 'at_risk',
            default => 'on_track',
        };

        if ($request->sla_status !== $status) {
            $request->update(['sla_status' => $status]);
        }
    }

    /**
     * Update SLA status for a job order.
     */
    public static function updateJobOrderSlaStatus(JobOrder $jobOrder): void
    {
        if (in_array($jobOrder->status, ['completed', 'closed']) || $jobOrder->sla_deadline === null) {
            return;
        }

        $now = Carbon::now();
        $deadline = $jobOrder->sla_deadline;
        $hoursUntilDeadline = $now->diffInHours($deadline, false);

        $status = match (true) {
            $hoursUntilDeadline < 0 => 'breached',
            $hoursUntilDeadline < 6 => 'at_risk',
            default => 'on_track',
        };

        if ($jobOrder->sla_status !== $status) {
            $jobOrder->update(['sla_status' => $status]);
        }
    }

    /**
     * Check for breached SLAs and return them.
     */
    public static function checkBreachedSlas(): array
    {
        $breachedRequests = ServiceRequest::where('request_status', 'pending')
            ->where('sla_status', '!=', 'breached')
            ->where('sla_deadline', '<', Carbon::now())
            ->get();

        $breachedJobOrders = JobOrder::whereIn('status', ['open', 'in_progress'])
            ->where('sla_status', '!=', 'breached')
            ->where('sla_deadline', '<', Carbon::now())
            ->get();

        foreach ($breachedRequests as $request) {
            self::updateRequestSlaStatus($request);
        }

        foreach ($breachedJobOrders as $jobOrder) {
            self::updateJobOrderSlaStatus($jobOrder);
        }

        return [
            'requests' => $breachedRequests->count(),
            'job_orders' => $breachedJobOrders->count(),
        ];
    }

    /**
     * Get SLA metrics for reporting.
     */
    public static function getMetrics(): array
    {
        $totalRequests = ServiceRequest::whereNotNull('date_approved')->count();
        $completedRequests = ServiceRequest::where('request_status', 'completed')->count();

        $avgResponseTime = ServiceRequest::whereNotNull('date_approved')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, date_requested, date_approved)) as avg_hours')
            ->value('avg_hours');

        $avgResolutionTime = JobOrder::whereNotNull('date_completed')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, date_assigned, date_completed)) as avg_hours')
            ->value('avg_hours');

        $complianceRate = $totalRequests > 0
            ? round(($completedRequests / $totalRequests) * 100, 2)
            : 0;

        return [
            'average_response_hours' => round($avgResponseTime ?? 0, 2),
            'average_resolution_hours' => round($avgResolutionTime ?? 0, 2),
            'sla_compliance_rate' => $complianceRate,
            'total_requests' => $totalRequests,
            'completed_requests' => $completedRequests,
        ];
    }
}
