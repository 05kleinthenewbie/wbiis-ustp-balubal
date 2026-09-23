<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Raw ALTER avoids requiring doctrine/dbal and works on MySQL + TiDB.
        DB::statement("ALTER TABLE `users` MODIFY COLUMN `status` ENUM('pending', 'active', 'inactive') NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `users` MODIFY COLUMN `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active'");
    }
};
