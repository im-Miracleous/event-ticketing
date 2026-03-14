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
        Schema::table('validation_logs', function (Blueprint $table) {
            $table->foreign(['ticket_id'], 'fk_logs_tickets')->references(['id'])->on('tickets')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('validation_logs', function (Blueprint $table) {
            $table->dropForeign('fk_logs_tickets');
        });
    }
};
