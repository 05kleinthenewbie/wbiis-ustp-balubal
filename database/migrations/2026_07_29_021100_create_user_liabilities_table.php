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
        Schema::create('user_liabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_id')->constrained('incident_reports')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('liability_description')->nullable();
            $table->enum('liability_status', ['pending', 'settled', 'waived'])->default('pending');
            $table->timestamp('date_assigned')->useCurrent();
            $table->timestamp('date_settled')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_liabilities');
    }
};
