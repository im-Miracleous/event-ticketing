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
        Schema::create('events', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('title', 45);
            $table->string('description', 200);
            $table->string('banner_image');
            $table->dateTime('event_date');
            $table->integer('total_quota');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('location', 45);
            $table->unsignedBigInteger('event_category_id')->index('fk_events_category_idx');
            $table->char('organizer_id', 36)->index('fk_events_organizers_idx');
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
