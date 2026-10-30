<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use App\Models\InventoryItem;
use App\Models\User;
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

        $isAdmin = Auth::user()->role->role_name === 'ict_admin';

        abort_unless($isAdmin || $incident->reported_by === Auth::id(), 403, 'You can only view incidents you reported.');

        return Inertia::render('incidents/show', [
            'incident' => $incident,
            'isAdmin' => $isAdmin,
            'users' => $isAdmin
                ? User::query()->orderBy('name')->get(['id', 'name'])
                : [],
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
            'status' => ['required', 'in:open,under_review,resolved,closed'],
            'liability_user_id' => ['nullable', 'exists:users,id'],
            'liability_description' => ['nullable', 'string'],
            'liability_amount' => ['nullable', 'required_with:liability_user_id', 'numeric', 'min:0', 'max:9999999999.99'],
        ]);

        $incident = IncidentReport::findOrFail($id);
        $incident->update(['status' => $validated['status']]);

        if (! empty($validated['liability_user_id'])) {
            $incident->userLiabilities()->create([
                'user_id' => $validated['liability_user_id'],
                'liability_description' => $validated['liability_description'] ?? null,
                'liability_amount' => $validated['liability_amount'] ?? null,
                'liability_status' => 'pending',
                'date_assigned' => now(),
            ]);
        }

        return redirect()->back()->with('status', 'Incident updated successfully.');
    }

    /**
     * Settle or waive a liability assigned from this incident.
     */
    public function resolveLiability(Request $request, string $incident, string $liability)
    {
        if (Auth::user()->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can resolve liabilities.');
        }

        $validated = $request->validate([
            'liability_status' => ['required', 'in:settled,waived'],
        ]);

        $incidentReport = IncidentReport::findOrFail($incident);
        $liabilityRecord = $incidentReport->userLiabilities()->findOrFail($liability);

        $liabilityRecord->update([
            'liability_status' => $validated['liability_status'],
            'date_settled' => now(),
        ]);

        return redirect()->back()->with(
            'status',
            'Liability marked as '.$validated['liability_status'].'.',
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
