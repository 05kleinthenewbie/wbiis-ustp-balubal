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
        Schema::create('job_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('service_requests')->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['open', 'in_progress', 'completed', 'closed'])->default('open');
            $table->text('report')->nullable();
            $table->text('resolution')->nullable();
            $table->enum('final_remarks', ['outsource_repair', 'replacement', 'disposal', 'task_completed'])->nullable();
            $table->string('action_taken', 150)->nullable();
            $table->timestamp('date_assigned')->nullable();
            $table->timestamp('date_completed')->nullable();
            $table->unsignedTinyInteger('rating')->nullable();
            $table->text('requester_comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_orders');
    }
};
