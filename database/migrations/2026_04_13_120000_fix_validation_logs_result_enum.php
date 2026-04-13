<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration 
{
    /**
     * Fix the result enum in validation_logs to include 'Already Checked-In'
     * which the controller uses but was missing from the original migration.
     */
    public function up(): void
    {
        // MySQL: ALTER the enum to add the missing value
        DB::statement("ALTER TABLE validation_logs MODIFY COLUMN result ENUM('Valid', 'Invalid', 'Expired', 'Already Scanned', 'Already Checked-In') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE validation_logs MODIFY COLUMN result ENUM('Valid', 'Invalid', 'Expired', 'Already Scanned') NOT NULL");
    }
};
