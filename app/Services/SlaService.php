<?php

namespace App\Services;

use App\Models\JobOrder;
use App\Models\ServiceRequest;
use Carbon\Carbon;

class SlaService
{
    /**
     * Official ICT working hours (NOTE 1: Monday to Friday).
     */
    public const WORK_START_HOUR = 8;

    public const WORK_END_HOUR = 17;

    /**
     * Calculate initial response deadline (24 working hours from request).
     */
    public static function calculateResponseDeadline(ServiceRequest $request): Carbon
    {
        return self::addWorkingHours(Carbon::instance($request->date_requested), 24);
    }

    /**
     * Add working hours to a date, skipping weekends and non-office hours.
     */
    public static function addWorkingHours(Carbon $start, int $hours): Carbon
    {
        $cursor = $start->copy();
        $remaining = $hours * 60;

        while ($remaining > 0) {
            if ($cursor->isWeekend()) {
                $cursor->next(Carbon::MONDAY)->setTime(self::WORK_START_HOUR, 0);

                continue;
            }

            $dayStart = $cursor->copy()->setTime(self::WORK_START_HOUR, 0);
            $dayEnd = $cursor->copy()->setTime(self::WORK_END_HOUR, 0);

            if ($cursor->lt($dayStart)) {
                $cursor = $dayStart;

                continue;
            }

            if ($cursor->gte($dayEnd)) {
                $cursor->addDay()->setTime(self::WORK_START_HOUR, 0);

                continue;
            }

            $available = (int) $cursor->diffInMinutes($dayEnd);
            $take = min($remaining, $available);

            $cursor->addMinutes($take);
            $remaining -= $take;

            if ($remaining > 0) {
                $cursor->addDay()->setTime(self::WORK_START_HOUR, 0);
            }
        }

        return $cursor;
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
            ->get(['date_requested', 'date_approved'])
            ->avg(fn (ServiceRequest $request): float => Carbon::parse($request->date_requested)
                ->diffInHours(Carbon::parse($request->date_approved)));

        $avgResolutionTime = JobOrder::whereNotNull('date_completed')
            ->get(['date_assigned', 'date_completed'])
            ->avg(fn (JobOrder $jobOrder): float => Carbon::parse($jobOrder->date_assigned)
                ->diffInHours(Carbon::parse($jobOrder->date_completed)));

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
