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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('property_no', 50)->unique();
            $table->string('item_name', 150);
            $table->string('brand', 100)->nullable();
            $table->string('model', 100)->nullable();
            $table->string('serial_no', 100)->nullable();
            $table->string('location', 150)->nullable();
            $table->enum('condition', ['working', 'defective', 'under_repair'])->default('working');
            $table->enum('status', ['active', 'retired', 'disposed'])->default('active');
            $table->date('purchase_date')->nullable();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
