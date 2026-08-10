<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryItemController extends Controller
{
    /**
     * Ensure only ICT Admins can manage inventory.
     */
    private function ensureAdmin(): void
    {
        if (Auth::user()->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can manage inventory.');
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
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

        return Inertia::render('inventory/index', [
            'items' => $query->get(),
            'filters' => $request->only(['search', 'condition']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->ensureAdmin();

        return Inertia::render('inventory/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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

        InventoryItem::create($validated);

        return redirect()->route('inventory.index')
            ->with('status', 'Inventory item added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $this->ensureAdmin();

        $item = InventoryItem::with(['defectiveRecords', 'incidentReports'])->findOrFail($id);

        return Inertia::render('inventory/show', ['item' => $item]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $this->ensureAdmin();

        return Inertia::render('inventory/edit', [
            'item' => InventoryItem::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
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

        return redirect()->route('inventory.index')
            ->with('status', 'Inventory item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->ensureAdmin();

        InventoryItem::findOrFail($id)->delete();

        return redirect()->route('inventory.index')
            ->with('status', 'Inventory item deleted.');
    }
}
