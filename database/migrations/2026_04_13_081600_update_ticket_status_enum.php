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
        // Adding 'Pending' to the enum
        Schema::table('tickets', function (Blueprint $table) {
            $table->enum('ticket_status', ['Pending', 'Issued', 'Scanned', 'Cancelled', 'Expired'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->enum('ticket_status', ['Issued', 'Scanned', 'Cancelled', 'Expired'])->change();
        });
    }
};
