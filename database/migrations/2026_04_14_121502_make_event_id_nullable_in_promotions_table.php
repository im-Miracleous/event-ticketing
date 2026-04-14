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
        Schema::table('promotions', function (Blueprint $table) {
            // Drop FK first so we can alter the column
            $table->dropForeign('fk_promotions_events');
            $table->char('event_id', 36)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            $table->char('event_id', 36)->nullable(false)->change();
            // Re-add the FK only if it doesn't already exist
            try {
                $table->foreign('event_id', 'fk_promotions_events')
                      ->references('id')->on('events')
                      ->onUpdate('cascade')->onDelete('cascade');
            } catch (\Throwable $e) {
                // FK already exists, ignore
            }
        });
    }
};
