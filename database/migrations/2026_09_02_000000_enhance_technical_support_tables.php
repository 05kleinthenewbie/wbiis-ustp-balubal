<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->string('form_number', 50)->unique()->nullable()->after('id');
            $table->foreignId('approved_by')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
            $table->timestamp('date_approved')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('location', 255)->nullable();
            $table->timestamp('sla_deadline')->nullable();
            $table->enum('sla_status', ['on_track', 'at_risk', 'breached'])->nullable();
        });

        Schema::table('job_orders', function (Blueprint $table) {
            $table->string('job_order_number', 50)->unique()->nullable()->after('id');
            $table->timestamp('date_in_progress')->nullable();
            $table->timestamp('date_closed')->nullable();
            $table->timestamp('sla_deadline')->nullable();
            $table->enum('sla_status', ['on_track', 'at_risk', 'breached'])->nullable();
            $table->enum('priority_level', ['low', 'medium', 'high', 'urgent'])->nullable();
            $table->enum('support_type', ['on_site', 'remote'])->default('on_site');
            $table->boolean('user_permission_granted')->default(false);
            $table->unsignedSmallInteger('estimated_repair_days')->nullable();
            $table->boolean('replacement_provided')->default(false);
            $table->foreignId('replacement_item_id')->nullable()->constrained('inventory_items')->nullOnDelete();
        });

        Schema::table('technician_responses', function (Blueprint $table) {
            $table->enum('response_type', ['progress', 'finding', 'resolution'])->default('progress')->after('response_report');
            $table->unsignedInteger('time_spent_minutes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropColumn([
                'form_number',
                'approved_by',
                'date_approved',
                'rejection_reason',
                'location',
                'sla_deadline',
                'sla_status',
            ]);
        });

        Schema::table('job_orders', function (Blueprint $table) {
            $table->dropColumn([
                'job_order_number',
                'date_in_progress',
                'date_closed',
                'sla_deadline',
                'sla_status',
                'priority_level',
                'support_type',
                'user_permission_granted',
                'estimated_repair_days',
                'replacement_provided',
                'replacement_item_id',
            ]);
        });

        Schema::table('technician_responses', function (Blueprint $table) {
            $table->dropColumn(['response_type', 'time_spent_minutes']);
        });
    }
};
