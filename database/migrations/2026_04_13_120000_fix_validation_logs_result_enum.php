<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE validation_logs MODIFY COLUMN result ENUM('Valid', 'Invalid', 'Expired', 'Already Scanned', 'Already Checked-In') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE validation_logs MODIFY COLUMN result ENUM('Valid', 'Invalid', 'Expired', 'Already Scanned') NOT NULL");
    }
};
