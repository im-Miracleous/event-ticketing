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
        Schema::table('waiting_list', function (Blueprint $table) {
            $table->foreign(['event_id'], 'fk_waiting_events')->references(['id'])->on('events')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['ticket_type_id'], 'fk_waiting_ticketstypes')->references(['id'])->on('tickets_types')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['user_id'], 'fk_waiting_users')->references(['id'])->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('waiting_list', function (Blueprint $table) {
            $table->dropForeign('fk_waiting_events');
            $table->dropForeign('fk_waiting_ticketstypes');
            $table->dropForeign('fk_waiting_users');
        });
    }
};
