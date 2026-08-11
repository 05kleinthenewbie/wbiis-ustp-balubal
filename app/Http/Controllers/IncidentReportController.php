<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IncidentReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $query = IncidentReport::with(['reporter', 'inventoryItem', 'userLiabilities'])->latest();

        // Non-admins only see incidents they personally reported.
        if ($user->role->role_name !== 'ict_admin') {
            $query->where('reported_by', $user->id);
        }

        return Inertia::render('incidents/index', [
            'incidents' => $query->get(),
            'isAdmin' => $user->role->role_name === 'ict_admin',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('incidents/create', [
            'inventoryItems' => InventoryItem::select('id', 'item_name', 'property_no')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => ['nullable', 'exists:inventory_items,id'],
            'incident_type' => ['required', 'string', 'max:100'],
            'incident_description' => ['required', 'string'],
            'incident_date' => ['nullable', 'date'],
        ]);

        IncidentReport::create([
            ...$validated,
            'reported_by' => Auth::id(),
            'status' => 'open',
        ]);

        return redirect()->route('incidents.index')
            ->with('status', 'Incident report submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $incident = IncidentReport::with([
            'reporter', 'inventoryItem', 'userLiabilities.user',
        ])->findOrFail($id);

        return Inertia::render('incidents/show', [
            'incident' => $incident,
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
            abort(403, 'Only ICT Admins can review incident reports.');
        }

            $validated = $request->validate([
            'status' => ['required', 'in:open,under_review,resolved'],
            'liability_user_id' => ['nullable', 'exists:users,id'],
            'liability_description' => ['nullable', 'string'],
        ]);

        $incident = IncidentReport::findOrFail($id);
        $incident->update(['status' => $validated['status']]);

        if (! empty($validated['liability_user_id'])) {
            $incident->userLiabilities()->create([
                'user_id' => $validated['liability_user_id'],
                'liability_description' => $validated['liability_description'] ?? null,
                'liability_status' => 'pending',
                'date_assigned' => now(),
            ]);
        }
        return redirect()->back()->with('status', 'Incident updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
