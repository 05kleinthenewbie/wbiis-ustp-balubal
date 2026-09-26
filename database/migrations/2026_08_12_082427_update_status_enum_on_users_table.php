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
        if (! $this->supportsRawAlter()) {
            return;
        }

        // Raw ALTER avoids requiring doctrine/dbal and works on MySQL + TiDB.
        DB::statement("ALTER TABLE `users` MODIFY COLUMN `status` ENUM('pending', 'active', 'inactive') NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! $this->supportsRawAlter()) {
            return;
        }

        DB::statement("ALTER TABLE `users` MODIFY COLUMN `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active'");
    }

    /**
     * SQLite (used by tests) has no ALTER ... MODIFY syntax; enum columns are already flexible enough there.
     */
    private function supportsRawAlter(): bool
    {
        return in_array(DB::getDriverName(), ['mysql', 'mariadb', 'tidb'], true);
    }
};
