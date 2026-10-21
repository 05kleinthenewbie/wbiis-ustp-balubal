<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('student_rosters', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->unique()
                ->after('id')
                ->constrained('users')
                ->nullOnDelete();
        });

        // Link roster entries to accounts that were created before this
        // relationship existed, matching on the shared ID number.
        DB::table('student_rosters')
            ->whereNull('user_id')
            ->orderBy('id')
            ->get(['id', 'id_number'])
            ->each(function (object $roster): void {
                $userId = DB::table('users')
                    ->where('id_number', $roster->id_number)
                    ->value('id');

                if ($userId !== null) {
                    DB::table('student_rosters')
                        ->where('id', $roster->id)
                        ->update(['user_id' => $userId]);
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_rosters', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
        });
    }
};
