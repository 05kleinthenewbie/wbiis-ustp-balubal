<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\AuditLog;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryItemController extends ApiController
{
    /**
     * List inventory items.
     */
    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $query = InventoryItem::query()->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                    ->orWhere('property_no', 'like', "%{$search}%");
            });
        }

        if ($condition = $request->input('condition')) {
            $query->where('condition', $condition);
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    /**
     * Create a new inventory item.
     */
    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'property_no' => ['required', 'string', 'max:50', 'unique:inventory_items,property_no'],
            'item_name' => ['required', 'string', 'max:150'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'serial_no' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'condition' => ['required', 'in:working,defective,under_repair'],
            'status' => ['required', 'in:active,retired,disposed'],
            'purchase_date' => ['nullable', 'date'],
        ]);

        $item = InventoryItem::create($validated);

        AuditLog::record('Added inventory item', 'inventory_items', $item->id);

        return response()->json([
            'message' => 'Inventory item added successfully.',
            'item' => $item,
        ], 201);
    }

    /**
     * Show a single inventory item.
     */
    public function show(string $id): JsonResponse
    {
        $this->ensureAdmin();

        $item = InventoryItem::with(['defectiveRecords', 'incidentReports'])->findOrFail($id);

        return response()->json(['item' => $item]);
    }

    /**
     * Update an inventory item.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $this->ensureAdmin();

        $item = InventoryItem::findOrFail($id);

        $validated = $request->validate([
            'property_no' => ['required', 'string', 'max:50', 'unique:inventory_items,property_no,'.$item->id],
            'item_name' => ['required', 'string', 'max:150'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'serial_no' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'condition' => ['required', 'in:working,defective,under_repair'],
            'status' => ['required', 'in:active,retired,disposed'],
            'purchase_date' => ['nullable', 'date'],
        ]);

        $item->update($validated);

        return response()->json([
            'message' => 'Inventory item updated successfully.',
            'item' => $item->fresh(),
        ]);
    }

    /**
     * Delete an inventory item.
     */
    public function destroy(string $id): JsonResponse
    {
        $this->ensureAdmin();

        $item = InventoryItem::findOrFail($id);
        $itemId = $item->id;
        $item->delete();

        AuditLog::record('Deleted inventory item', 'inventory_items', $itemId);

        return response()->json(['message' => 'Inventory item deleted.']);
    }
}
