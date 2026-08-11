<?php

namespace App\Http\Controllers;

use App\Models\JobOrder;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $query = JobOrder::with(['serviceRequest.user', 'serviceRequest.requestServices.serviceType', 'technician'])->latest();
        // Technicians (any non-admin who gets assigned) only see their own job orders.
        // Admins see everything.
        if ($user->role->role_name !== 'ict_admin') {
            $query->where('assigned_to', $user->id);
        }

        return Inertia::render('job-orders/index', [
            'jobOrders' => $query->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jobOrder = JobOrder::with([
            'serviceRequest.user',
            'serviceRequest.requestServices.serviceType',
            'technician',
            'technicianResponses.technician',
        ])->findOrFail($id);

        return Inertia::render('job-orders/show', [
            'jobOrder' => $jobOrder,
            'isAdmin' => Auth::user()->role->role_name === 'ict_admin',
            'technicians' => User::whereHas('role', fn ($q) => $q->where('role_name', 'ict_admin'))->get(['id', 'name']),
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
            abort(403, 'Only ICT Admins can manage job orders.');
        }

        $validated = $request->validate([
            'assigned_to' => ['nullable', 'exists:users,id'],
            'status' => ['required', 'in:open,in_progress,completed,closed'],
            'final_remarks' => ['nullable', 'in:outsource_repair,replacement,disposal,task_completed'],
        ]);

        $jobOrder = JobOrder::findOrFail($id);

        if (isset($validated['assigned_to']) && ! $jobOrder->date_assigned) {
            $validated['date_assigned'] = now();
        }

        if ($validated['status'] === 'completed' && ! $jobOrder->date_completed) {
            $validated['date_completed'] = now();
        }

        $jobOrder->update($validated);

        if ($validated['status'] === 'completed') {
            \App\Models\Notification::create([
                'user_id' => $jobOrder->serviceRequest->user_id,
                'message' => "Your job order #JO-".str_pad($jobOrder->id, 4, '0', STR_PAD_LEFT)." has been completed. Please rate the service.",
                'notification_type' => 'job_order',
                'notification_status' => 'unread',
            ]);
        }

        return redirect()->back()->with('status', 'Job order updated successfully.');

        $jobOrder->update($validated);

        return redirect()->back()->with('status', 'Job order updated successfully.');
    }

        public function addResponse(Request $request, string $id)
    {
        $user = Auth::user();

        if ($user->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can add technician responses.');
        }

        $validated = $request->validate([
            'response_report' => ['required', 'string'],
        ]);

        $jobOrder = JobOrder::findOrFail($id);

        $jobOrder->technicianResponses()->create([
            'technician_id' => $user->id,
            'response_report' => $validated['response_report'],
            'date_responded' => now(),
        ]);

        return redirect()->back()->with('status', 'Response added successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
