<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->string('item_inventory_no', 50)->nullable()->after('property_no');
            $table->string('category', 50)->nullable()->index()->after('item_name');
            $table->text('specification')->nullable()->after('serial_no');
            $table->text('description')->nullable()->after('specification');
            $table->decimal('unit_cost', 12, 2)->nullable()->after('purchase_date');
            $table->string('purchase_order_no', 150)->nullable()->after('unit_cost');
            $table->string('end_user', 150)->nullable()->after('purchase_order_no');
            $table->string('department', 100)->nullable()->after('end_user');
            $table->string('campus', 100)->nullable()->after('department');
            $table->string('building', 100)->nullable()->after('campus');
            $table->string('room', 100)->nullable()->after('building');
            $table->string('specific_location', 150)->nullable()->after('room');
            $table->string('validation', 50)->nullable()->after('status');
            $table->date('inspection_date')->nullable()->after('validation');
            $table->text('inspection_remarks')->nullable()->after('inspection_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn([
                'item_inventory_no',
                'category',
                'specification',
                'description',
                'unit_cost',
                'purchase_order_no',
                'end_user',
                'department',
                'campus',
                'building',
                'room',
                'specific_location',
                'validation',
                'inspection_date',
                'inspection_remarks',
            ]);
        });
    }
};
