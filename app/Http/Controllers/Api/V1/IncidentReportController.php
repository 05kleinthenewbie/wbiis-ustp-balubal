<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\IncidentReport;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IncidentReportController extends ApiController
{
    /**
     * List incident reports.
     */
    public function index(): JsonResponse
    {
        $query = IncidentReport::with(['reporter', 'inventoryItem', 'userLiabilities'])->latest();

        if (! $this->isAdmin()) {
            $query->where('reported_by', $this->user()->id);
        }

        return response()->json([
            'data' => $query->get(),
            'inventoryItems' => InventoryItem::select('id', 'item_name', 'property_no')->get(),
        ]);
    }

    /**
     * Create a new incident report.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_id' => ['nullable', 'exists:inventory_items,id'],
            'incident_type' => ['required', 'string', 'max:100'],
            'incident_description' => ['required', 'string'],
            'incident_date' => ['nullable', 'date'],
        ]);

        $incident = IncidentReport::create([
            ...$validated,
            'reported_by' => $this->user()->id,
            'status' => 'open',
        ]);

        return response()->json([
            'message' => 'Incident report submitted successfully.',
            'incident' => $incident->load(['reporter', 'inventoryItem', 'userLiabilities']),
        ], 201);
    }

    /**
     * Show a single incident report.
     */
    public function show(string $id): JsonResponse
    {
        $incident = IncidentReport::with([
            'reporter', 'inventoryItem', 'userLiabilities.user',
        ])->findOrFail($id);

        if (! $this->isAdmin() && $incident->reported_by !== $this->user()->id) {
            abort(403, 'You can only view your own incident reports.');
        }

        return response()->json(['incident' => $incident]);
    }

    /**
     * Update an incident report (admin review).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $this->ensureAdmin();

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

        return response()->json([
            'message' => 'Incident updated successfully.',
            'incident' => $incident->load(['reporter', 'inventoryItem', 'userLiabilities.user']),
        ]);
    }
}
