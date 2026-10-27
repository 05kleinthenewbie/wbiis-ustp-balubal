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
        Schema::table('users', function (Blueprint $table) {
            $table->string('employee_id_number', 50)->nullable()->unique();
            $table->string('position')->nullable();
            $table->string('employment_document_path')->nullable();
            $table->string('employment_document_original_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['employee_id_number']);
            $table->dropColumn(['employee_id_number', 'position', 'employment_document_path', 'employment_document_original_name']);
        });
    }
};
