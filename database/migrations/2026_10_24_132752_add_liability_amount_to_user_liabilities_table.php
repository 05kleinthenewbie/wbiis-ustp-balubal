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
        Schema::table('user_liabilities', function (Blueprint $table) {
            $table->decimal('liability_amount', 12, 2)->nullable()->after('liability_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_liabilities', function (Blueprint $table) {
            $table->dropColumn('liability_amount');
        });
    }
};
