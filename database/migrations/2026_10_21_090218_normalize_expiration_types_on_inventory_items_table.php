<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Collapse the previous expiration type labels into the two supported
     * values so existing rows keep passing validation on edit.
     *
     * @var array<string, string>
     */
    private const TYPE_MAP = [
        'Expiration / Use-by Date' => 'Expiration Date',
        'Recommended Shelf Life' => 'Shelf Life',
        'Replacement / Service Life' => 'Shelf Life',
        'Shelf Life' => 'Shelf Life',
        'Expiration Date' => 'Expiration Date',
        'License Expiration' => 'Expiration Date',
        'Subscription Expiration' => 'Expiration Date',
        'Certificate Expiration' => 'Expiration Date',
        'Registration Expiration' => 'Expiration Date',
        'Warranty Expiration' => 'Expiration Date',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (self::TYPE_MAP as $legacy => $normalized) {
            DB::table('inventory_items')
                ->where('expiration_type', $legacy)
                ->update(['expiration_type' => $normalized]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Legacy labels cannot be restored reliably.
    }
};
