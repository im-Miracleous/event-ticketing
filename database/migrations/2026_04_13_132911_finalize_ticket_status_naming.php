<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Update existing data to match the new enum values
        DB::table('tickets')->where('ticket_status', 'Scanned')->update(['ticket_status' => 'Issued']); // Temporary hold
        
        // 2. Modify columns (note: sqlite might need different approach, but we are on MySQL/MariaDB)
        Schema::table('tickets', function (Blueprint $table) {
            $table->enum('ticket_status', ['Pending', 'Issued', 'Checked-In', 'Cancelled', 'Refunded'])->default('Pending')->change();
        });

        // 3. Move 'Scanned' data to 'Checked-In'
        // Since we temporary moved them to Issued, we should have a better way if they were already scanned.
        DB::statement("UPDATE tickets SET ticket_status = 'Checked-In' WHERE validated_at IS NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->enum('ticket_status', ['Pending', 'Issued', 'Scanned', 'Cancelled', 'Expired'])->default('Pending')->change();
        });
    }
};
