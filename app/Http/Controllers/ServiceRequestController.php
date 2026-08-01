<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use App\Models\ServiceRequest as ServiceRequestModel;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $query = ServiceRequestModel::with(['user', 'requestServices.serviceType.category'])
            ->latest();

        // Faculty/Staff and Students only see their own requests.
        // ICT Admins see everyone's requests.
        if ($user->role->role_name !== 'ict_admin') {
            $query->where('user_id', $user->id);
        }

        return Inertia::render('requests/index', [
            'requests' => $query->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();

        $categories = ServiceCategory::with('serviceTypes')->get();

        // Students can only request Information System services (email/O365).
        if ($user->role->role_name === 'student') {
            $categories = $categories->filter(
                fn ($category) => $category->category_name === 'Information System Services'
            )->values();
        }

        return Inertia::render('requests/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'problem_description' => ['required', 'string'],
            'services' => ['required', 'array', 'min:1'],
            'services.*.service_type_id' => ['required', 'exists:service_types,id'],
            'services.*.specification' => ['nullable', 'string'],
            'services.*.quantity' => ['required', 'integer', 'min:1'],
            'services.*.action_type' => ['nullable', 'string'],
        ]);

        $serviceRequest = ServiceRequestModel::create([
            'user_id' => Auth::id(),
            'problem_description' => $validated['problem_description'],
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
        ]);

        $serviceRequest = ServiceRequestModel::findOrFail($id);
        $wasPending = $serviceRequest->request_status === 'pending';
        $serviceRequest->update($validated);

        if ($wasPending && $validated['request_status'] === 'approved') {
            $serviceRequest->jobOrders()->create([
                'status' => 'open',
                'date_assigned' => null,
            ]);
        }

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
