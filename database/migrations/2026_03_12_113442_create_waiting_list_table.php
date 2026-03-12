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
        Schema::create('waiting_list', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['Waiting', 'Confirmed', 'Cancelled']);
            $table->char('event_id', 36)->index('fk_waiting_events_idx');
            $table->unsignedBigInteger('ticket_type_id')->index('fk_waiting_ticketstypes_idx');
            $table->char('user_id', 36)->index('fk_waiting_users_idx');
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waiting_list');
    }
};
