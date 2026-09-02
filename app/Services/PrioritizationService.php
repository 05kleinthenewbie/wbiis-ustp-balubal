<?php

namespace App\Services;

use App\Models\JobOrder;
use App\Models\ServiceRequest;

class PrioritizationService
{
    /**
     * Determine priority based on rules from NOTE 2.
     *
     * Rules:
     * 1. Computer viruses = urgent
     * 2. Department-wide issues (affecting multiple users) = high
     * 3. Non-operational equipment = high
     * 4. Intermittent problems = medium
     * 5. Same urgency = first-come-first-served
     */
    public static function determinePriority(ServiceRequest $request): string
    {
        $description = strtolower($request->problem_description);
        $serviceNames = $request->requestServices
            ->pluck('serviceType.service_name')
            ->map(fn ($name) => strtolower($name))
            ->toArray();

        // Rule 1: Computer viruses = urgent
        $virusKeywords = ['virus', 'malware', 'ransomware', 'trojan', 'infected', 'infection'];
        foreach ($virusKeywords as $keyword) {
            if (str_contains($description, $keyword) || in_array($keyword, $serviceNames)) {
                return 'urgent';
            }
        }

        // Rule 2: Department-wide issues = high
        $departmentKeywords = ['department', 'entire', 'all computers', 'network', 'server', 'printer', 'lab'];
        foreach ($departmentKeywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return 'high';
            }
        }

        // Rule 3: Non-operational equipment = high
        $nonOperationalKeywords = ['not working', 'dead', 'broken', 'won\'t turn on', 'no power', 'black screen', 'blue screen'];
        foreach ($nonOperationalKeywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return 'high';
            }
        }

        // Rule 4: Intermittent problems = medium
        $intermittentKeywords = ['intermittent', 'sometimes', 'occasional', 'slow', 'freezing', 'lagging'];
        foreach ($intermittentKeywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return 'medium';
            }
        }

        // Default priority
        return 'medium';
    }

    /**
     * Check if replacement should be provided (>5 days).
     */
    public static function shouldProvideReplacement(JobOrder $jobOrder): bool
    {
        if ($jobOrder->date_assigned === null) {
            return false;
        }

        $daysSinceAssignment = $jobOrder->date_assigned->diffInDays(now());

        return $daysSinceAssignment > 5 && ! $jobOrder->replacement_provided;
    }

    /**
     * Propagate priority from service request to job order.
     */
    public static function propagatePriority(JobOrder $jobOrder): void
    {
        if ($jobOrder->priority_level === null && $jobOrder->serviceRequest->priority_level !== null) {
            $jobOrder->update(['priority_level' => $jobOrder->serviceRequest->priority_level]);
        }
    }
}
