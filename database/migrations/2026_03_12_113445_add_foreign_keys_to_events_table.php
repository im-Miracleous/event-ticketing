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
        Schema::table('events', function (Blueprint $table) {
            $table->foreign(['event_category_id'], 'fk_events_category')->references(['id'])->on('event_category')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign(['organizer_id'], 'fk_events_organizers')->references(['id'])->on('organizers')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign('fk_events_category');
            $table->dropForeign('fk_events_organizers');
        });
    }
};
