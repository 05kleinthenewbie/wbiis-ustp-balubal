<?php

namespace App\Http\Controllers\Api\V1;

use App\Mail\ServiceRequestApproved;
use App\Mail\ServiceRequestRejected;
use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\ServiceRequest as ServiceRequestModel;
use App\Models\ServiceType;
use App\Services\PrioritizationService;
use App\Services\SlaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class ServiceRequestController extends ApiController
{
    /**
     * List service requests.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ServiceRequestModel::with(['user', 'requestServices.serviceType.category']);

        if (! $this->isAdmin()) {
            $query->where('user_id', $this->user()->id);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhere('problem_description', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        $sort = $request->input('sort', 'status');
        if ($sort === 'oldest') {
            $query->oldest();
        } elseif ($sort === 'newest') {
            $query->latest();
        } else {
            $query->orderByRaw("CASE WHEN request_status = 'pending' THEN 1 WHEN request_status = 'approved' THEN 2 WHEN request_status = 'rejected' THEN 3 WHEN request_status = 'completed' THEN 4 ELSE 5 END ASC")->latest();
        }

        $requests = $query->paginate((int) $request->input('per_page', 25))->withQueryString();

        return response()->json([
            'data' => $requests->items(),
            'meta' => collect($requests->toArray())->except(['data']),
        ]);
    }

    /**
     * Create a new service request.
     */
    public function store(Request $request): JsonResponse
    {
        $serviceTypeIdRules = ['required', 'exists:service_types,id'];

        if ($this->roleName() === 'student') {
            $serviceTypeIdRules = ['required', Rule::in($this->studentAllowedServiceTypeIds())];
        }

        $validated = $request->validate([
            'problem_description' => ['required', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'contact_details' => ['nullable', 'string', 'max:255'],
            'priority_level' => ['nullable', 'in:low,medium,high,urgent'],
            'services' => ['required', 'array', 'min:1'],
            'services.*.service_type_id' => $serviceTypeIdRules,
            'services.*.specification' => ['nullable', 'string'],
            'services.*.quantity' => ['required', 'integer', 'min:1'],
            'services.*.action_type' => ['nullable', 'string'],
        ]);

        $serviceRequest = ServiceRequestModel::create([
            'user_id' => $this->user()->id,
            'problem_description' => $validated['problem_description'],
            'location' => $validated['location'] ?? null,
            'contact_details' => $validated['contact_details'] ?? null,
            'priority_level' => $validated['priority_level'] ?? null,
            'request_status' => 'pending',
            'date_requested' => now(),
        ]);

        foreach ($validated['services'] as $service) {
            $serviceRequest->requestServices()->create($service);
        }

        if (empty($validated['priority_level'])) {
            $serviceRequest->load('requestServices.serviceType');
            $serviceRequest->update([
                'priority_level' => PrioritizationService::determinePriority($serviceRequest),
            ]);
        }

        AuditLog::record('Submitted service request', 'service_requests', $serviceRequest->id);

        return response()->json([
            'message' => 'Service request submitted successfully.',
            'request' => $serviceRequest->load(['user', 'requestServices.serviceType.category']),
        ], 201);
    }

    /**
     * Service type IDs a student account is allowed to request.
     *
     * @return Collection<int, int>
     */
    private function studentAllowedServiceTypeIds()
    {
        return ServiceType::query()
            ->whereIn('service_name', ['E-mail', 'Office 365'])
            ->whereHas('category', fn ($query) => $query->where('category_name', 'Information System Services'))
            ->pluck('id');
    }

    /**
     * Show a single service request.
     */
    public function show(string $id): JsonResponse
    {
        $serviceRequest = ServiceRequestModel::with([
            'user', 'requestServices.serviceType.category', 'attachments', 'jobOrders.technician',
        ])->findOrFail($id);

        if (! $this->isAdmin() && $serviceRequest->user_id !== $this->user()->id) {
            abort(403, 'You can only view your own service requests.');
        }

        return response()->json(['request' => $serviceRequest]);
    }

    /**
     * Update a service request (admin review).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'request_status' => ['required', 'in:pending,approved,rejected,completed'],
            'priority_level' => ['nullable', 'in:low,medium,high,urgent'],
            'rejection_reason' => ['nullable', 'string'],
        ]);

        $serviceRequest = ServiceRequestModel::findOrFail($id);
        $wasPending = $serviceRequest->request_status === 'pending';
        $updateData = $validated;

        if ($wasPending && $validated['request_status'] === 'approved') {
            $updateData['approved_by'] = $this->user()->id;
            $updateData['date_approved'] = now();
            $updateData['sla_deadline'] = SlaService::calculateResponseDeadline($serviceRequest);
            $updateData['sla_status'] = 'on_track';
        }

        if ($wasPending && $validated['request_status'] === 'rejected') {
            $updateData['approved_by'] = $this->user()->id;
            $updateData['date_approved'] = now();
        }

        $serviceRequest->update($updateData);

        if ($wasPending && $validated['request_status'] === 'approved') {
            $serviceRequest->jobOrders()->create([
                'status' => 'open',
                'date_assigned' => null,
                'priority_level' => $validated['priority_level'] ?? null,
            ]);
        }

        if ($wasPending && in_array($validated['request_status'], ['approved', 'rejected'])) {
            Notification::create([
                'user_id' => $serviceRequest->user_id,
                'message' => "Your service request #{$serviceRequest->form_number} has been {$validated['request_status']}.",
                'notification_type' => 'service_request',
                'link' => '/requests/'.$serviceRequest->id,
                'notification_status' => 'unread',
            ]);

            if ($validated['request_status'] === 'approved') {
                Mail::to($serviceRequest->user->email)->queue(
                    new ServiceRequestApproved($serviceRequest->user->name, $serviceRequest->id)
                );
            } else {
                Mail::to($serviceRequest->user->email)->queue(
                    new ServiceRequestRejected($serviceRequest->user->name, $serviceRequest->id, $validated['rejection_reason'] ?? null)
                );
            }
        }

        AuditLog::record("Set request status to {$validated['request_status']}", 'service_requests', $serviceRequest->id);

        return response()->json([
            'message' => 'Request updated successfully.',
            'request' => $serviceRequest->load('user'),
        ]);
    }
}
