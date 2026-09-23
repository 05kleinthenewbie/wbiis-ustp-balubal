<?php

namespace App\Http\Controllers;

use App\Mail\ServiceRequestApproved;
use App\Mail\ServiceRequestRejected;
use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\ServiceCategory;
use App\Models\ServiceRequest as ServiceRequestModel;
use App\Services\SlaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = ServiceRequestModel::with(['user', 'requestServices.serviceType.category']);

        if ($user->role->role_name !== 'ict_admin') {
            $query->where('user_id', $user->id);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhere('problem_description', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('requestServices.serviceType', fn ($q) => $q->where('service_name', 'like', "%{$search}%"));
            });
        }

        $sort = $request->input('sort', 'status');
        if ($sort === 'oldest') {
            $query->oldest();
        } elseif ($sort === 'newest') {
            $query->latest();
        } else {
            $query->orderByRaw("FIELD(request_status, 'pending', 'approved', 'rejected', 'completed') ASC")
                ->latest();
        }

        return Inertia::render('requests/index', [
            'requests' => $query->paginate(25)->withQueryString(),
            'isAdmin' => $user->role->role_name === 'ict_admin',
            'filters' => $request->only(['search', 'sort']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();

        if ($user->role->role_name === 'ict_admin') {
            abort(403, 'ICT Administrators cannot submit service requests.');
        }

        $categories = ServiceCategory::with('serviceTypes')->get();

        return Inertia::render('requests/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role->role_name === 'ict_admin') {
            abort(403, 'ICT Administrators cannot submit service requests.');
        }

        $validated = $request->validate([
            'problem_description' => ['required', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'contact_details' => ['nullable', 'string', 'max:255'],
            'services' => ['required', 'array', 'min:1'],
            'services.*.service_type_id' => ['required', 'exists:service_types,id'],
            'services.*.specification' => ['nullable', 'string'],
            'services.*.quantity' => ['required', 'integer', 'min:1'],
            'services.*.action_type' => ['nullable', 'string'],
        ]);

        $serviceRequest = ServiceRequestModel::create([
            'user_id' => Auth::id(),
            'problem_description' => $validated['problem_description'],
            'location' => $validated['location'] ?? null,
            'contact_details' => $validated['contact_details'] ?? null,
            'request_status' => 'pending',
            'date_requested' => now(),
        ]);

        foreach ($validated['services'] as $service) {
            $serviceRequest->requestServices()->create($service);
        }

        return redirect()->route('requests.index')
            ->with('status', 'Service request submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $serviceRequest = ServiceRequestModel::with([
            'user', 'requestServices.serviceType.category', 'attachments', 'jobOrders.technician',
        ])->findOrFail($id);

        return Inertia::render('requests/show', [
            'request' => $serviceRequest,
            'isAdmin' => Auth::user()->role->role_name === 'ict_admin',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();

        if ($user->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can review service requests.');
        }

        $validated = $request->validate([
            'request_status' => ['required', 'in:pending,approved,rejected,completed'],
            'priority_level' => ['nullable', 'in:low,medium,high,urgent'],
            'rejection_reason' => ['nullable', 'string'],
        ]);

        $serviceRequest = ServiceRequestModel::findOrFail($id);
        $wasPending = $serviceRequest->request_status === 'pending';

        $updateData = $validated;

        if ($wasPending && $validated['request_status'] === 'approved') {
            $updateData['approved_by'] = $user->id;
            $updateData['date_approved'] = now();
            $updateData['sla_deadline'] = SlaService::calculateResponseDeadline($serviceRequest);
            $updateData['sla_status'] = 'on_track';
        }

        if ($wasPending && $validated['request_status'] === 'rejected') {
            $updateData['approved_by'] = $user->id;
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

        AuditLog::record(
            "Set request status to {$validated['request_status']}",
            'service_requests',
            $serviceRequest->id
        );

        return redirect()->back()->with('status', 'Request updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
