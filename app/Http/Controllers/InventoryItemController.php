<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\InventoryItem;
use App\Models\User;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
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

        $query = InventoryItem::query()->latest('purchase_date')->latest('id');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                    ->orWhere('property_no', 'like', "%{$search}%")
                    ->orWhere('serial_no', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($condition = $request->input('condition')) {
            $query->where('condition', $condition);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($campus = $request->input('campus')) {
            $query->where(function ($q) use ($campus) {
                $q->where('campus', $campus)
                    ->orWhere('building', $campus)
                    ->orWhere('room', $campus)
                    ->orWhere('specific_location', $campus)
                    ->orWhere('location', 'like', "%{$campus}%");
            });
        }

        if ($endUser = $request->input('end_user')) {
            $query->where(function ($q) use ($endUser) {
                $q->where('end_user', 'like', "%{$endUser}%");
            });
        }

        $items = $query->get();

        $conditionCounts = InventoryItem::query()
            ->selectRaw('`condition`, count(*) as total')
            ->groupBy('condition')
            ->pluck('total', 'condition');

        $statusCounts = InventoryItem::query()
            ->selectRaw('`status`, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $options = [
            'categories' => InventoryItem::whereNotNull('category')
                ->distinct()
                ->pluck('category')
                ->sort()
                ->values(),
            'campuses' => InventoryItem::whereNotNull('campus')
                ->distinct()
                ->pluck('campus')
                ->sort()
                ->values(),
            'endUsers' => InventoryItem::whereNotNull('end_user')
                ->distinct()
                ->pluck('end_user')
                ->sort()
                ->values(),
        ];

        return Inertia::render('inventory/index', [
            'items' => $items,
            'filters' => $request->only(['search', 'category', 'condition', 'status', 'campus', 'end_user']),
            'stats' => [
                'total' => (int) array_sum($conditionCounts->all() ?: [0]),
                'working' => (int) ($conditionCounts['working'] ?? 0),
                'defective' => (int) ($conditionCounts['defective'] ?? 0),
                'under_repair' => (int) ($conditionCounts['under_repair'] ?? 0),
                'active' => (int) ($statusCounts['active'] ?? 0),
                'retired' => (int) ($statusCounts['retired'] ?? 0),
                'disposed' => (int) ($statusCounts['disposed'] ?? 0),
            ],
            'options' => $options,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->ensureAdmin();

        return Inertia::render('inventory/create', [
            'users' => User::where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name', 'department']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->ensureAdmin();

        $validated = $request->validate($this->rules());

        $item = InventoryItem::create($validated);

        AuditLog::record('Added inventory item', 'inventory_items', $item->id);

        return redirect()->route('inventory.index')
            ->with('status', 'Inventory item added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $this->ensureAdmin();

        $item = InventoryItem::with([
            'defectiveRecords.jobOrder.serviceRequest.user',
            'incidentReports.reporter',
            'requestItems.serviceRequest.user',
            'auditLogs.adminUser',
        ])->findOrFail($id);

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
            'users' => User::where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name', 'department']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $this->ensureAdmin();

        $item = InventoryItem::findOrFail($id);

        $rules = $this->rules();
        $rules['property_no'] = ['required', 'string', 'max:50', 'unique:inventory_items,property_no,'.$item->id];

        $item->update($request->validate($rules));

        return redirect()->route('inventory.index')
            ->with('status', 'Inventory item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->ensureAdmin();

        $item = InventoryItem::findOrFail($id);
        $itemId = $item->id;
        $item->delete();

        AuditLog::record('Deleted inventory item', 'inventory_items', $itemId);

        return redirect()->route('inventory.index')
            ->with('status', 'Inventory item deleted.');
    }

    /**
     * Flag an inventory item as defective and create a defect record.
     */
    public function flagDefective(Request $request, string $id)
    {
        $this->ensureAdmin();

        $item = InventoryItem::findOrFail($id);

        $validated = $request->validate([
            'damage_description' => ['required', 'string', 'max:1000'],
            'job_order_id' => ['nullable', 'exists:job_orders,id'],
        ]);

        $item->defectiveRecords()->create([
            ...$validated,
            'repair_status' => 'pending',
            'date_reported' => now(),
        ]);

        $item->update(['condition' => 'defective']);

        AuditLog::record(
            'Flagged item as defective',
            'inventory_items',
            $item->id,
            $validated['damage_description'],
        );

        return redirect()->back()
            ->with('status', 'Item flagged as defective. A defect record was created.');
    }

    /**
     * Update the repair status of a defect record.
     */
    public function updateRepairStatus(Request $request, string $id, string $defectiveId)
    {
        $this->ensureAdmin();

        $item = InventoryItem::findOrFail($id);
        $record = $item->defectiveRecords()->findOrFail($defectiveId);

        $validated = $request->validate([
            'repair_status' => ['required', 'in:pending,in_progress,completed'],
        ]);

        $record->update($validated);

        if ($validated['repair_status'] === 'completed') {
            $item->update(['condition' => 'working']);
        }

        AuditLog::record(
            'Repair status changed to '.$validated['repair_status'],
            'inventory_items',
            $item->id,
        );

        return redirect()->back()
            ->with('status', 'Repair status updated successfully.');
    }

    /**
     * Generate the QR code for the physical property label.
     * The QR content identifies the record via its canonical URL, and
     * the database remains the source of truth for all fields.
     */
    public function qr(string $id)
    {
        $this->ensureAdmin();

        $item = InventoryItem::findOrFail($id);

        $renderer = new ImageRenderer(
            new RendererStyle(360, 4),
            new SvgImageBackEnd
        );

        $content = url('/inventory/'.$item->id);
        $svg = (new Writer($renderer))->writeString($content);

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Shared validation rules for inventory records.
     *
     * @return array<string, array<int, string>>
     */
    private function rules(): array
    {
        return [
            'property_no' => ['required', 'string', 'max:50', 'unique:inventory_items,property_no'],
            'item_inventory_no' => ['nullable', 'string', 'max:50'],
            'item_name' => ['required', 'string', 'max:150'],
            'category' => ['nullable', 'string', 'max:50'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'serial_no' => ['nullable', 'string', 'max:100'],
            'specification' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:150'],
            'purchase_date' => ['nullable', 'date'],
            'unit_cost' => ['nullable', 'numeric', 'min:0', 'max:9999999999'],
            'purchase_order_no' => ['nullable', 'string', 'max:150'],
            'end_user' => ['nullable', 'string', 'max:150'],
            'department' => ['nullable', 'string', 'max:100'],
            'campus' => ['nullable', 'string', 'max:100'],
            'building' => ['nullable', 'string', 'max:100'],
            'room' => ['nullable', 'string', 'max:100'],
            'specific_location' => ['nullable', 'string', 'max:150'],
            'condition' => ['required', 'in:working,defective,under_repair'],
            'status' => ['required', 'in:active,retired,disposed'],
            'validation' => ['nullable', 'string', 'max:50'],
            'inspection_date' => ['nullable', 'date'],
            'inspection_remarks' => ['nullable', 'string'],
        ];
    }
}
