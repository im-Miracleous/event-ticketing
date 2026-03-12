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
        Schema::table('tickets_types', function (Blueprint $table) {
            $table->foreign(['event_id'], 'fk_tickets_types_events')->references(['id'])->on('events')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets_types', function (Blueprint $table) {
            $table->dropForeign('fk_tickets_types_events');
        });
    }
};
