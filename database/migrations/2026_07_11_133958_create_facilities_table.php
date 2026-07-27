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
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('facility_name', 150);
            $table->enum('facility_type', ['computer_lab', 'av_room'])->default('computer_lab');
            $table->integer('capacity')->nullable();
            $table->string('location', 150)->nullable();
            $table->enum('availability_status', ['available', 'unavailable', 'under_maintenance'])->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
