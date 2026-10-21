<?php

use App\Models\InventoryItem;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

function inventoryItemAdmin(): User
{
    $role = Role::firstOrCreate(['role_name' => 'ict_admin']);

    return User::factory()->create(['role_id' => $role->id]);
}

function inventoryItemPayload(array $overrides = []): array
{
    return array_merge([
        'property_no' => 'PROP-EXP-001',
        'item_name' => 'Epson Ink Cartridge 003',
        'category' => 'Printer',
        'purchase_date' => '2026-01-15',
        'expiration_date' => '2027-06-30',
        'condition' => 'working',
        'status' => 'active',
    ], $overrides);
}

test('admin can create an inventory item with an expiration date', function () {
    $admin = inventoryItemAdmin();

    $response = $this->actingAs($admin)->post(
        route('inventory.store'),
        inventoryItemPayload(),
    );

    $response->assertRedirect(route('inventory.index'));
    $response->assertSessionHas('status');

    $this->assertTrue(
        DB::table('inventory_items')
            ->where('property_no', 'PROP-EXP-001')
            ->where('item_name', 'Epson Ink Cartridge 003')
            ->whereDate('expiration_date', '2027-06-30')
            ->exists(),
    );
});

test('expiration date is optional', function () {
    $admin = inventoryItemAdmin();

    $this->actingAs($admin)
        ->post(
            route('inventory.store'),
            inventoryItemPayload([
                'property_no' => 'PROP-EXP-002',
                'expiration_date' => null,
            ]),
        )
        ->assertRedirect(route('inventory.index'));

    $this->assertDatabaseHas('inventory_items', [
        'property_no' => 'PROP-EXP-002',
        'expiration_date' => null,
    ]);
});

test('expiration date must be a valid date', function () {
    $admin = inventoryItemAdmin();

    $this->actingAs($admin)
        ->post(
            route('inventory.store'),
            inventoryItemPayload([
                'property_no' => 'PROP-EXP-003',
                'expiration_date' => 'not-a-date',
            ]),
        )
        ->assertSessionHasErrors('expiration_date');

    $this->assertDatabaseMissing('inventory_items', [
        'property_no' => 'PROP-EXP-003',
    ]);
});

test('admin can update the expiration date', function () {
    $admin = inventoryItemAdmin();
    $item = InventoryItem::factory()->create([
        'property_no' => 'PROP-EXP-004',
        'expiration_date' => null,
    ]);

    $response = $this->actingAs($admin)->put(
        route('inventory.update', $item->id),
        inventoryItemPayload([
            'property_no' => 'PROP-EXP-004',
            'item_name' => $item->item_name,
            'purchase_date' => optional($item->purchase_date)->toDateString(),
            'expiration_date' => '2028-12-31',
        ]),
    );

    $response->assertRedirect(route('inventory.index'));

    $this->assertTrue(
        DB::table('inventory_items')
            ->where('id', $item->id)
            ->whereDate('expiration_date', '2028-12-31')
            ->exists(),
    );
});

test('non admins cannot create inventory items', function () {
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $faculty = User::factory()->create(['role_id' => $role->id]);

    $this->actingAs($faculty)
        ->post(route('inventory.store'), inventoryItemPayload())
        ->assertForbidden();

    $this->assertDatabaseMissing('inventory_items', [
        'property_no' => 'PROP-EXP-001',
    ]);
});

test('admin can create an item with the for disposal status', function () {
    $admin = inventoryItemAdmin();

    $this->actingAs($admin)
        ->post(
            route('inventory.store'),
            inventoryItemPayload([
                'property_no' => 'PROP-EXP-005',
                'status' => 'for_disposal',
            ]),
        )
        ->assertRedirect(route('inventory.index'));

    $this->assertDatabaseHas('inventory_items', [
        'property_no' => 'PROP-EXP-005',
        'status' => 'for_disposal',
    ]);
});

test('admin can mark an item for disposal', function () {
    $admin = inventoryItemAdmin();
    $item = InventoryItem::factory()->create([
        'property_no' => 'PROP-EXP-006',
        'status' => 'active',
        'expiration_date' => '2020-01-01',
    ]);

    $response = $this->actingAs($admin)->patch(
        route('inventory.mark-disposal', $item->id),
    );

    $response->assertRedirect();
    $response->assertSessionHas('status');

    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'status' => 'for_disposal',
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'action_taken' => 'Marked item for disposal',
        'module_name' => 'inventory_items',
        'record_id' => $item->id,
    ]);
});

test('non admins cannot mark items for disposal', function () {
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $faculty = User::factory()->create(['role_id' => $role->id]);
    $item = InventoryItem::factory()->create(['status' => 'active']);

    $this->actingAs($faculty)
        ->patch(route('inventory.mark-disposal', $item->id))
        ->assertForbidden();

    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'status' => 'active',
    ]);
});

test('admin can create an item with an expiration type', function () {
    $admin = inventoryItemAdmin();

    $this->actingAs($admin)
        ->post(
            route('inventory.store'),
            inventoryItemPayload([
                'property_no' => 'PROP-EXP-TYPE-1',
                'category' => 'Antivirus Licenses',
                'expiration_type' => 'License Expiration',
            ]),
        )
        ->assertRedirect(route('inventory.index'));

    $this->assertDatabaseHas('inventory_items', [
        'property_no' => 'PROP-EXP-TYPE-1',
        'expiration_type' => 'License Expiration',
    ]);
});

test('expiration type must be a supported value', function () {
    $admin = inventoryItemAdmin();

    $this->actingAs($admin)
        ->post(
            route('inventory.store'),
            inventoryItemPayload([
                'property_no' => 'PROP-EXP-TYPE-2',
                'expiration_type' => 'Made Up Type',
            ]),
        )
        ->assertSessionHasErrors('expiration_type');
});

test('admin can view the expiration monitor', function () {
    $admin = inventoryItemAdmin();

    InventoryItem::factory()->create([
        'property_no' => 'PROP-EXP-MON-1',
        'expiration_date' => now()->addDays(10)->toDateString(),
        'expiration_type' => 'License Expiration',
    ]);

    $this->actingAs($admin)
        ->get(route('inventory.expirations'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('inventory/expirations')
            ->has('items')
            ->where('items.0.expiration_type', 'License Expiration'));
});

test('non admins cannot view the expiration monitor', function () {
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $faculty = User::factory()->create(['role_id' => $role->id]);

    $this->actingAs($faculty)
        ->get(route('inventory.expirations'))
        ->assertForbidden();
});

test('admin can view the defective and under repair inventory views', function () {
    $admin = inventoryItemAdmin();

    InventoryItem::factory()->create([
        'property_no' => 'PROP-COND-DEF',
        'condition' => 'defective',
    ]);
    InventoryItem::factory()->create([
        'property_no' => 'PROP-COND-REP',
        'condition' => 'under_repair',
    ]);

    $this->actingAs($admin)
        ->get(route('inventory.defective-index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('inventory/index')
            ->where('filters.condition', 'defective')
            ->has('items', 1)
            ->where('items.0.property_no', 'PROP-COND-DEF'));

    $this->actingAs($admin)
        ->get(route('inventory.under-repair-index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('inventory/index')
            ->where('filters.condition', 'under_repair')
            ->has('items', 1)
            ->where('items.0.property_no', 'PROP-COND-REP'));
});

test('non admins cannot view the defective and under repair views', function () {
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $faculty = User::factory()->create(['role_id' => $role->id]);

    $this->actingAs($faculty)
        ->get(route('inventory.defective-index'))
        ->assertForbidden();

    $this->actingAs($faculty)
        ->get(route('inventory.under-repair-index'))
        ->assertForbidden();
});
